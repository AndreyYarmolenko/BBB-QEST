<?php
include "../lang/langs.php ";

$idx = $_REQUEST['idx'];
$draft = $_REQUEST['draft_id'];
$RequestID = $_REQUEST['RequestID'];

$VALUES_HEADER = em_get_update_header();
$VALUES_HEADER['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES_HEADER['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$VALUES['approved_oper'] = $_REQUEST['approved_oper'];
$VALUES['oper_name'] = $_REQUEST['oper_name'];
$VALUES['approved_contr'] = $_REQUEST['approved_contr'];
$VALUES['contr_name'] = $_REQUEST['contr_name'];
$VALUES['approved_cfo'] = $_REQUEST['approved_cfo'];
$VALUES['cfo_name'] = $_REQUEST['cfo_name'];
$VALUES['approved_president'] = $_REQUEST['approved_president'];
$VALUES['president_name'] = $_REQUEST['president_name'];
$VALUES_FULL = array_merge($VALUES_HEADER, $VALUES);

$approve_staff = array('oper_name'=>$VALUES['approved_oper'], 'contr_name'=>$VALUES['approved_contr'], 'cfo_name'=>$VALUES['approved_cfo'], 'president_name'=>$VALUES['approved_president']);

$telegram = getBaseDataTelegram($idx, 37, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($draft == 1) {
    $status = getStatusDraft();
    em_update_order_task(37, $status, $reject=0);
    $where = " `idx` = ".$idx."";
	em_update('bb_'.$table, $VALUES_FULL, $where);
}
else {
	if($approve_staff['oper_name']==1&&$approve_staff['contr_name']==1&&$approve_staff['cfo_name']==1&&$approve_staff['president_name']==1) {
		$status = 4;
		$nextStage = $tasks['23'];
		$CompletionDate = $VALUES_FULL['CompletionDate']= transform_complit_date(gmdate("Y-m-d H:i:s"));
		$where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES_FULL, $where);
		em_update_order_task(37, $status, $reject=0);

		$query = "SELECT `RequestID`, `process_id`, `oper_name`, `contr_name`, `cfo_name`, `president_name`, `requested_by`, `ProductType`, `ProductLine`, `bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku` 
		FROM `bb_capex_approve` WHERE `idx` =".$idx."";
		if($stmt = $db->query($query)){
			$result = $stmt->fetch_array(MYSQL_ASSOC);
			$stmt->close();
		}
		$procurement = $result;
		//$procurement['RequestedDate'] = $CompletionDate;
		$procurement['id_user'] =$id_user;

		$query = "SELECT `AssignedTo` FROM `bb_process_design_request` WHERE `RequestID` = ".$RequestID;
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($AssignedTo);
            $stmt->fetch();
            $stmt->close();
        }

    	$procurement['AssignedTo']= $purchasing['AssignedTo'] = $order_v['assignee'] = $AssignedTo;
    	$procurement['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $procurement['AssignmentDate']= $purchasing['RequestedDate'] = $purchasing['AssignmentDate'] = date('Y-m-d H:i:s');


		$content = &$procurement;
	    $code = stripslashes(getPreScript(23));
	    eval($code);

	    $procurement['AssignmentDate'] = $procurement['RequestedDate'] = $CompletionDate;

		$last_idx = em_insert('bb_procurement_request', $procurement);
	    $task_id1 = em_insert_order_task(23, 1, $last_idx, $order_v);

	   	$telegram1 = getBaseDataTelegram(false, 23, $RequestID, 1);
	    $telegram1['current_assignee'] = $procurement['AssignedTo'];
	    $telegram1['current_responsible'] = $procurement['Responsible'];
	    $telegram1['task_id'] = $task_id1;
	    TelegramManager($telegram1);

	    $history = array('idx'=>$last_idx, 'task_type'=>23, 'status'=>1, 'id_user'=>$id_user);
    	setHistoryRecord($history);

    	if(checkCountCapex($procurement['process_id'], $RequestID)){
    		$nextStage .=" AND ".$tasks['25'];
    		$purchasing['process_id'] = $procurement['process_id'];
		    $purchasing['RequestID'] = $procurement['RequestID'];
		    $purchasing['requested_by'] = $procurement['requested_by'];
		    $purchasing['ProductType'] = $procurement['ProductType'];
		    $purchasing['ProductLine'] = $procurement['ProductLine'];
		    $purchasing['bbb_sku'] = $procurement['bbb_sku'];
		    $purchasing['core_sku'] = $procurement['core_sku'];
		    $purchasing['oe_latest_sku'] = $procurement['oe_latest_sku'];
		    $purchasing['oe_reman_sku'] = $procurement['oe_reman_sku'];
		    $purchasing['id_user'] =$id_user;
		    
		   	$content = &$purchasing;
		    $code = stripslashes(getPreScript(25));
		    eval($code);

		    $purchasing['AssignmentDate'] = $purchasing['RequestedDate'] = $CompletionDate;

		    $last_idx = em_insert('bb_purchasing_request', $purchasing);
		    $task_id2 =em_insert_order_task(25, 1, $last_idx, $order_v);

		   	$telegram2 = getBaseDataTelegram(false, 25, $RequestID, 1);
		    $telegram2['current_assignee'] = $purchasing['AssignedTo'];
		    $telegram2['current_responsible'] = $purchasing['Responsible'];
		    $telegram2['task_id'] = $task_id2;
		    TelegramManager($telegram2);

		    $history = array('idx'=>$last_idx, 'task_type'=>25, 'status'=>1, 'id_user'=>$id_user);
	    	setHistoryRecord($history);
    	}
	}
	elseif($approve_staff['oper_name']==2||$approve_staff['contr_name']==2||$approve_staff['cfo_name']==2||$approve_staff['president_name']==2) {
		$status = 4;
		$nextStage = $answers['task_dec'];
		$CompletionDate = $VALUES_FULL['CompletionDate']= transform_complit_date(date('Y-m-d H:i:s'));
		$where = " `idx` = ".$idx."";
		em_update('bb_'.$table, $VALUES_FULL, $where);
		em_update_order_task(37, $status, $reject=1);
	}
	else{
		$status = 2;
		foreach($approve_staff as $key=>$value) {
			if($approve_staff[$key]==0){
				$VALUES_FULL['AssignedTo'] = $VALUES_FULL[$key];
				break;
			}
		}

	    em_update_order_task(37, $status, $reject=0);

    	$where = "`order_id`=".$_REQUEST['RequestID']." AND `task_type`=37 AND `outID_task`=".$idx;
    	em_update('bb_order_tasks', array('assignee'=>$VALUES_FULL['AssignedTo']), $where);

	    $where = " `idx` = ".$idx."";
	    $VALUES_FULL['draft'] = 1;
		em_update('bb_'.$table, $VALUES_FULL, $where);
		$nextStage = $answers['task_in_progress'];
	}
}

$telegram['current_status'] = $status;
TelegramManager($telegram);

$history = array('idx'=>$idx, 'task_type'=>37, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'process_id'=>$_REQUEST['process_id'], 'RequestID'=>$_REQUEST['RequestID']);
echo json_encode($result);

$db->commit();
?>