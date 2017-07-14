<?php
	$draft = $_REQUEST['draft_id'];
	$idx = $_REQUEST['idx'];
	$RequestID = $_REQUEST['RequestID'];
	$CompletionDate = null;
	$nextStage = "";

	$comp_req['Responsible'] = $_REQUEST['Responsible'];
    $comp_req['AssignedTo'] = $_REQUEST['AssignedTo'];
	$comp_req['AssignmentDate'] = ($_REQUEST['AssignmentDate'])?transform_greenwich($_REQUEST['AssignmentDate']):'NULL';
	$comp_req['DueDate'] = $_REQUEST['DueDate'];
	$comp_req['NewDueDate'] = $_REQUEST['NewDueDate'];

	$comp_req['tasks'] = $_REQUEST['tasks'];
	$comp_req['draft'] = $draft;

	$telegram = getBaseDataTelegram($idx, 46, $RequestID, $draft);
	$old_data = getOldData($table, $idx);
	
	if ($draft == 1){
	    $status = getStatusDraft();
	}

	if ($draft == 0){
	    $CompletionDate = mktime(gmdate("H, i, s, m, d, Y"));
	    $comp_req['CompletionDate'] = $CompletionDate;
	    $nextStage = " Task completed.";
	    $status = 4;
	}

	$telegram['current_status'] = $status;

	if($idx){
		$where = 'idx = '.$idx;
		em_update('bb_new_component_req', $comp_req, $where);
		$order['status'] = $status;
		$order['assigned_by'] = $_REQUEST['Responsible'];
	    $order['assignee'] = $_REQUEST['AssignedTo'];
	    $order['assignment_date'] = $comp_req['AssignmentDate'];
	    $order['completion_date'] = $CompletionDate;
	    $order['due_date'] = $comp_req['DueDate'];
    	$order['new_due_date'] = $comp_req['NewDueDate'];
    	em_update('bb_order_tasks', $order, " `task_type`=46 AND `outID_task` = ".$idx);
	}
	else {
		$query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.",1);";
	    if ($stmt = $db->prepare($query)) {
	        if ($stmt->execute()) {
	            $RequestID = $db->insert_id;
	            $stmt->close();
	        }
	    }

	    $comp_req['RequestID'] = $RequestID;
    	$comp_req['RequestedDate']  = mktime(gmdate("H, i, s, m, d, Y"));
    	$comp_req['id_user'] = $id_user;

    	$idx = em_insert('bb_new_component_req', $comp_req);

	    $order['order_id'] =$RequestID;
	    $order['status'] = $status;
	    $order['task_type'] = 46;
	    $order['previous_task_id'] = 0;
	    $order['outID_task'] = $idx;
	    $order['requested_date'] = $comp_req['RequestedDate'];
	    $order['assigned_by'] = $_REQUEST['Responsible'];
	    $order['assignee'] = $_REQUEST['AssignedTo'];
	    $order['assignment_date'] = $comp_req['AssignmentDate'];
	    $order['completion_date'] = $CompletionDate;
	    $order['due_date'] = $comp_req['DueDate'];
    	$order['new_due_date'] = $comp_req['NewDueDate'];
	    $task_id = em_insert('bb_order_tasks', $order);

	    $telegram['task_id'] = $task_id;
    	$telegram['RequestID'] = $RequestID;
	}

	TelegramManager($telegram);
	$history = array('idx'=>$idx, 'task_type'=>46, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
	setHistoryRecord($history);

	$result = array('success' => true, 'Status' => $status, 'idx' => $idx, 'RequestID' => $RequestID, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=> $CompletionDate);
	echo json_encode($result);
	$db->commit();
    exit;
?>