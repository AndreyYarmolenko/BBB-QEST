<?php
	$nextStage = "";
	$idx = $_REQUEST['idx'];
	$draft = $_REQUEST['draft_id'];
	$VALUES = em_get_update_header();
	$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
	$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
	$purchasing= $_REQUEST['purchasing'];
	$RequestID= $_REQUEST['RequestID'];
	$process_id = $_REQUEST['process_id'];

	$telegram = getBaseDataTelegram($idx, 25, $RequestID, $draft);
	$old_data = getOldData($table, $idx);
	 
	$purchasingArr =  json_decode(stripcslashes($purchasing));
	$table_op = "";
	for($i=0; $i<count($purchasingArr); $i++){
		$purchasingArr[$i] = (array)$purchasingArr[$i];
		switch($purchasingArr[$i]['el_type']){
			case 1: $table_op = '`bb_tasks_operation_tool`'; break;
			case 2: $table_op = '`bb_tasks_operation_gage`';break;
			case 3: $table_op = '`bb_tasks_operation_equipment`';break;
			case 4: $table_op = '`bb_tasks_operation_workstation`';break;
		}

		$query = "UPDATE ".$table_op." SET `received` = ".$purchasingArr[$i]['received']." WHERE `id` = ".$purchasingArr[$i]['row_id'];
		em_query($query);
	}
	if($draft == 1) {
	    $status = getStatusDraft();
	    em_update_order_task(25, $status, $reject=0);
	    $where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES, $where);
	}
	else {
		$status = 4;
		$nextStage = " Implementation Request";
		$CompletionDate = $VALUES['CompletionDate']= transform_complit_date(gmdate("Y-m-d H:i:s"));
		$where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES, $where);
		em_update_order_task(25, $status, $reject=0);

		$query = "SELECT COUNT(*) FROM `bb_implementation_request` WHERE `RequestID` = ".$RequestID."";
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }
        
        if($count==0){
        	$query = "SELECT `RequestID`, `process_id`, `requested_by`, `ProductType`, `ProductLine`, `bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku` 
			FROM `bb_purchasing_request` WHERE `idx` =".$idx."";
			if($stmt = $db->query($query)){
				$result = $stmt->fetch_array(MYSQL_ASSOC);
				$stmt->close();
			}
			$procArr = $result;
			$procArr['RequestedDate'] = $CompletionDate;
			$procArr['id_user'] =$id_user;

			$query = "SELECT `AssignedTo` FROM `bb_process_design_request` WHERE `RequestID` = ".$RequestID;
	        if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($AssignedTo);
	            $stmt->fetch();
	            $stmt->close();
	        }

	    	$procArr['AssignedTo']= $order_v['assignee'] = $AssignedTo;
	    	$procArr['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $procArr['AssignmentDate']= date('Y-m-d H:i:s');

			$content = &$procArr;
		    $code = stripslashes(getPreScript(38));
		    eval($code);

		    $procArr['AssignmentDate'] = $procArr['RequestedDate'] = $CompletionDate;

			$last_idx = em_insert('bb_implementation_request', $procArr);
		    $task_id1 = em_insert_order_task(38, 1, $last_idx, $order_v);

		    $telegram1 = getBaseDataTelegram(false, 38, $RequestID, 1);
		    $telegram1['current_assignee'] = $procArr['AssignedTo'];
		    $telegram1['current_responsible'] = $procArr['Responsible'];
		    $telegram1['task_id'] = $task_id1;
		    TelegramManager($telegram1);

		    $history = array('idx'=>$last_idx, 'task_type'=>38, 'status'=>1, 'id_user'=>$id_user);
    		setHistoryRecord($history);
        }
	}

$telegram['current_status'] = $status;
TelegramManager($telegram);

$history = array('idx'=>$idx, 'task_type'=>25, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'RequestID'=>$RequestID, 'process_id'=>$process_id);
echo json_encode($result);
$db->commit();
exit;
?>