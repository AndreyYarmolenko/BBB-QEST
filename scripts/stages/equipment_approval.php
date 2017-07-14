<?php
	/*$draft = $_REQUEST['draft_id'];
	$task_type = 43;
	$tgId = $_REQUEST['tgId'];
	$CompletionDate = null;
	//$nextStage = "Complited";
	$status = null;
	$where = $_REQUEST['RequestID'];
	$query = null;
	$nextStage = " Completed";

	if($draft == 3) {
		$status = 4;
		$approved = 2;
		$CompletionDate = date("Y-m-d H:i:s");
		//$approved = 2;
		$query = "UPDATE bb_equipment_approval SET approved = $approved,  draft = 0 WHERE RequestID = $where";
		if(!$db->query($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
		$db->commit();
	}
	elseif($draft == 0) {
		$status = 4;
		$approved = 1;
		$CompletionDate = date("Y-m-d H:i:s");
		//$approved = 1;
		$query= "UPDATE bb_equipment_approval SET approved = $approved,  draft = 0 WHERE RequestID = $where";
		if(!$db->query($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
		$db->commit();
	}
	
	//echo $draft;
	$query_approved = "UPDATE bb_equipment SET `approved` = $approved WHERE `id` = $tgId";
	if(!$db->query($query_approved)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	$db->commit();

	$query = "UPDATE bb_order_tasks SET `status` = 4 WHERE task_type = 43";
	if(!$db->query($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	$db->commit();

	$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=> $CompletionDate);
	echo json_encode($result);*/