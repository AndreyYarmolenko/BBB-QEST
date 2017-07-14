<?php
	include '../lang/langs.php';

	$nextStage = "";
	$idx = $_REQUEST['idx'];
	$draft = $_REQUEST['draft_id'];
	$VALUES = em_get_update_header();
	$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
	$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
	$implemented= $_REQUEST['implemented'];
	$RequestID= $_REQUEST['RequestID'];
	$process_id = $_REQUEST['process_id'];

	$telegram = getBaseDataTelegram($idx, 38, $RequestID, $draft);
	$old_data = getOldData($table, $idx);

	$implementedArr =  json_decode(stripcslashes($implemented));
	$table_op = "";
	for($i=0; $i<count($implementedArr); $i++){
		$implementedArr[$i] = (array)$implementedArr[$i];
		switch($implementedArr[$i]['el_type']){
			case 1: $table_op = '`bb_tasks_operation_tool`'; break;
			case 2: $table_op = '`bb_tasks_operation_gage`';break;
			case 3: $table_op = '`bb_tasks_operation_equipment`';break;
			case 4: $table_op = '`bb_tasks_operation_workstation`';break;
		}

		$query = "UPDATE ".$table_op."SET `implemented` = ".$implementedArr[$i]['implemented']." WHERE `id` = ".$implementedArr[$i]['row_id'];
		em_query($query);
	}

	if($draft == 1) {
	    $status = getStatusDraft();
	    em_update_order_task(38, $status, $reject=0);
	    $where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES, $where);

		$telegram['current_status'] = $status;
		TelegramManager($telegram);

		$result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'RequestID'=>$RequestID, 'process_id'=>$process_id);
	}
	else {

		$query = "SELECT COUNT(*) FROM `bb_order_tasks` WHERE `task_type` IN (23,25) AND  `order_id` = ".$RequestID." AND `status` NOT IN (4)";
		if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    }

    if($count>0){
        $result = array('success' => false, 'message' => " Not completed previous tasks!<br>(Purchasing Request/Procurement Request)");
    }
    else {
		$status = 4;
		$nextStage = $answers['next_stage'];
		$CompletionDate = $VALUES['CompletionDate']= transform_complit_date(gmdate("Y-m-d H:i:s"));
		$where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES, $where);
		em_update_order_task(38, $status, $reject=0);

		$telegram['current_status'] = $status;
		TelegramManager($telegram);

		$query = "SELECT ir.`RequestID`, ir.`ProductType`, ir.`ProductLine`, ir.`bbb_sku`, ir.`oe_latest_sku`, ir.`oe_reman_sku`, re.`core_sku`, `Application`
			FROM `bb_implementation_request` ir
			INNER JOIN `bb_reverse_engineering` re ON re.`RequestID` = ir.`RequestID`
			WHERE ir.`idx` =".$idx."";
		if($stmt = $db->query($query)){
			$result = $stmt->fetch_array(MYSQL_ASSOC);
			$stmt->close();
		}

		$query1 = "SELECT `component_id`, `ppap`, `bom_id` FROM bb_bom_components bc
					INNER JOIN `bb_bom` b ON b.`id` = bc.`bom_id`
					INNER JOIN `bb_components` c ON `component_id` = c.`id`
					WHERE bbb_sku_id = ".$result['bbb_sku']." AND `comp_type` = 1
					ORDER BY b.`id` DESC LIMIT 1";
		if($stmt1 = $db->query($query1)){
			$result1 = $stmt1->fetch_array(MYSQL_ASSOC);
			$stmt1->close();
		}
		
		$array_ppap = $result;
        $array_ppap['RequestedDate'] = $CompletionDate;
        $array_ppap['id_user'] = $id_user;
        $array_ppap['id_part_number'] = $result1['component_id'];
        $array_ppap['qty'] = $result1['ppap'];
        $array_ppap['id_user'] =$id_user;

        $query = "SELECT `AssignedTo` FROM `bb_npd_request` WHERE `RequestID` = ".$RequestID;
	        if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($AssignedTo);
	            $stmt->fetch();
	            $stmt->close();
	        }

    	$array_ppap['AssignedTo']= $order_v['assignee'] = $AssignedTo;
    	$array_ppap['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $array_ppap['AssignmentDate']= date('Y-m-d H:i:s');

        $content = &$array_ppap;
		$code = stripslashes(getPreScript(39));
		eval($code);

		$array_ppap['AssignmentDate'] = $array_ppap['RequestedDate'] = $CompletionDate;

        $outId_task = em_insert('bb_ppap_finished_good', $array_ppap);
        $task_id1 = em_insert_order_task(39, 1, $outId_task, $order_v);

        $query = "UPDATE `bb_bom_components` SET `task_type` = 39, `ppap_task_id` = ".$outId_task." WHERE  `bom_id`= ".$result1['bom_id']." AND `component_id` = ".$result1['component_id'];
            em_query($query);
        em_update('bb_components', array('comp_status'=>0, 'ppap_task_id'=>$task_id1, 'task_type'=>39), "`id` = '".$result1['component_id']."'");

        $telegram1 = getBaseDataTelegram(false, 39, $RequestID, 1);
	    $telegram1['current_assignee'] = $array_ppap['AssignedTo'];
	    $telegram1['current_responsible'] = $array_ppap['Responsible'];
	    $telegram1['task_id'] = $task_id1;
	    TelegramManager($telegram1);

	    $history = array('idx'=>$outId_task, 'task_type'=>39, 'status'=>1, 'id_user'=>$id_user);
    	setHistoryRecord($history);

        $nextStage = $tasks['39'];
        $result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'RequestID'=>$RequestID, 'process_id'=>$process_id);
	}
}

$history = array('idx'=>$idx, 'task_type'=>38, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

echo json_encode($result);
$db->commit();
?>