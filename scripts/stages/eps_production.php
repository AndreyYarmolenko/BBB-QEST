<?php
	include '../lang/langs.php';

	$draft = $_REQUEST['draft_id'];
	//$status = $_REQUEST['Status'];
	$CompletionDate = null;
	$task_type = 45;
	$nextStage = $answers['completed'];

	$idx = $_REQUEST['idx'];
	$VALUES['Responsible'] = $_REQUEST['Responsible'];
	$VALUES['AssignedTo'] = $_REQUEST['AssignedTo'];
	//$VALUES['AssignmentDate'] = $_REQUEST['AssignmentDate'];
	$VALUES['DueDate'] = $_REQUEST['DueDate'];
	$VALUES['NewDueDate'] = $_REQUEST['NewDueDate'];
	$VALUES['final_test'] = $_REQUEST['final_test'];
	$VALUES['id_user'] = $_SESSION['id'];
	$VALUES['diagnostic_software'] = $_REQUEST['diagnostic_software'];
	$VALUES['existing_equipment'] = $_REQUEST['existing_equipment'];
	$VALUES['description'] = $_REQUEST['description'];
	$VALUES['RequestID'] = $_REQUEST['RequestID'];

	$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
	$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);

	$old_data = getOldData($table, $idx);

	$where = 'idx =' . $idx;

	if ($draft == 0){
		$status = 4;
		$CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
		$VALUES['CompletionDate'] = $CompletionDate;
		$VALUES['draft'] = 0;
	}
	elseif($draft == 1) {
		$status = getStatusDraft();
	}

	em_update('bb_eps_production', $VALUES, $where);

	em_update_order_task($task_type, $status);

	$history = array('idx'=>$idx, 'task_type'=>45, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
	setHistoryRecord($history);
	$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=> $CompletionDate);
	echo json_encode($result);
	$db->commit();
	exit;