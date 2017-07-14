<?php
	include '../lang/langs.php';

	$draft = $_REQUEST['draft_id'];
	$CompletionDate = null;
	$task_type = 42;
	$array_full = array_merge($array1, $array2);
	$approved;
	//$nextStage = "Workstation Approval";
	$nextStage = $answers['completed'];

	$idx = $_REQUEST['idx'];
	$tg_id = $_REQUEST['tgId'];
	$VALUES['Responsible'] = $_REQUEST['Responsible'];
	$VALUES['AssignedTo'] = $_REQUEST['AssignedTo'];
	$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
	$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
	$VALUES['DueDate'] = $_REQUEST['DueDate'];
	$VALUES['NewDueDate'] = $_REQUEST['NewDueDate'];
	$VALUES['RequestID'] = $_REQUEST['RequestID'];
	$VALUES['RequestedBy'] = $_REQUEST['RequestedBy'];
	$VALUES['bbb_sku_used'] = $_REQUEST['bbb_sku_used'];
	$VALUES['operation_procedures'] = $_REQUEST['operation_procedures'];
	$VALUES['quantity'] = $_REQUEST['quantity'];
	$VALUES['tool_gage_type'] = $_REQUEST['tool_gage_type'];
	$VALUES['pending_design'] = $_REQUEST['pending_design'];
	$VALUES['id_user'] = $_SESSION['id'];

	$telegram = getBaseDataTelegram($idx, 42, $_REQUEST['RequestID'], $draft);
	$old_data = getOldData($table, $idx);

	$where = 'idx =' . $idx;

	$number = $_REQUEST['number'];

	if ($draft == 0){
		$status = 4;
		$approved = 1;
		$CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
		$VALUES['CompletionDate'] = $CompletionDate;
		$VALUES['workstation_id'] = $tg_id;
		//$last_idx = em_insert('bb_workstation_approval', $VALUES);
		$VALUES['draft'] = 0;
		$VALUES['approved'] = 1;
		$VALUES['alternative_id'] = 0;
    	
    	/*$order['order_id'] = $_REQUEST['RequestID'];;
    	$order['status'] = 1;
    	$order['task_type'] = 44;
    	$order['previous_task_id'] = 0;
    	$order['outID_task'] = $last_idx;
    	$order['requested_date'] = $_REQUEST['RequestedDate'];
    	$order['assignee'] = $_REQUEST['AssignedTo'];
    	$order['assigned_by'] = $_REQUEST['Responsible'];
    	$order['requested_date'] = $_REQUEST['RequestedDate'];
    	$order['assignment_date'] = $_REQUEST['AssignmentDate'];
    	$order['due_date'] = $_REQUEST['DueDate'];
    	$order['completion_date'] = $CompletionDate;
    	$order['new_due_date'] = $_REQUEST['NewDueDate'];
    	em_insert('bb_order_tasks', $order);*/
    	$reject = 1;
    	$alternative = 0;

    	//выборка ID для проверки
		if(substr($number, 0, 12) == "Temporary id") {
			$nextStage = "ID should not be temporary, you need to assign a new!";
			$status = getStatusDraft();
			$VALUES['draft'] = 1;
			$approved = 0;
		}
		
		$query = "SELECT `number` FROM bb_workstation WHERE `request_number` != ".$_REQUEST['RequestID'];
		$res_arr = array();
		if(!$res = $db->query($query)) echo '{"success":false,"message":error select number tool/gage"' . $db->errno . ' ' . $db->error . '"}';
		else {
			while($arr = $res->fetch_array(MYSQLI_NUM)) {
				$res_arr[] = implode(",", $arr);
			}
			for($i = 0; $i < count($res_arr); $i++) {
				if($number == $res_arr[$i]) {
					$nextStage = "This ID already exists!";
					$status = getStatusDraft();
					$VALUES['draft'] = 1;
					$number = "Temporary id: ".date("Y-m-d H:i:s", time());
					$approved = 0;
				}
			}
		}
	}
	elseif($draft == 3) {
		$status = 4;
		$approved = 2;
		$CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
		$VALUES['CompletionDate'] = $CompletionDate;
		$VALUES['workstation_id'] = $tg_id;
		$VALUES['draft'] = 0;
		$VALUES['approved'] = 2;
		$VALUES['alternative_id'] = $_REQUEST['altVar'];
		$reject = 2;
		$alternative = $_REQUEST['altVar'];
	}
	elseif($draft == 1) {
		$status = getStatusDraft();
		$VALUES['alternative_id'] = 0;
		$approved = 0;
		$alternative = 0;
	}

	em_update('bb_workstation_request', $VALUES, $where);

	em_update_order_task_ext($task_type, $status, $reject, $idx);
	$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=> $CompletionDate);
	echo json_encode($result);

	$telegram['current_status'] = $status;
	TelegramManager($telegram);

	$history = array('idx'=>$idx, 'task_type'=>42, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
	setHistoryRecord($history);

	$description = $_REQUEST['description'] ? $_REQUEST['description'] : null;
	//$number = $_REQUEST['number'];
	$name = $_REQUEST['name'];
	$life_time = $_REQUEST['life_time'];
	$pending_design = $_REQUEST['pending_design'];
	$drawing_2d = substr($_REQUEST['draw2d'], 15, strlen($_REQUEST['draw2d']));
	$drawing_3d = substr($_REQUEST['draw3d'], 15, strlen($_REQUEST['draw3d']));
	$add_images = $_REQUEST['addImage'];
	$add_spec = $_REQUEST['addDoc'];
	$estimation_price = $_REQUEST['estimated_unit_price'] ? $_REQUEST['estimated_unit_price'] : 0;
	//$request_number = $_REQUEST['RequestID'] ? $_REQUEST['RequestID'] : 0;
	$query = "UPDATE bb_workstation SET `name` = '$name', description = '$description', `number` = '$number', life_time = '$life_time', pending_design = '$pending_design', drawing2d = '$drawing_2d', drawing3d = '$drawing_3d', addImages = '$add_images', add_spec = '$add_spec', estimated_unit_price = $estimation_price, approved = $approved, alternative_id = $alternative/*, request_number = $request_number*/ WHERE id = $tg_id";
	if(!$db->query($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	//else echo '{"success":true,"message":"}';
	$db->commit();
	exit;