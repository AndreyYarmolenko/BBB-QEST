<?php
session_start();
error_reporting(0);
header('Content-Type: text/html; charset=utf-8');
require_once("../settings.php");
require_once("../logger.php");
require_once("saveform_func.php");

if(isset($_REQUEST['getTaskProgress'])){
	$task_type = ($_REQUEST['task_type'])? $_REQUEST['task_type']: null;
	$RequestID = ($_REQUEST['RequestID'])? $_REQUEST['RequestID']: null;
	if($task_type&&$RequestID){
		$query = "SELECT tp.`id`, `create_date`, u.`name`, `change_date`, us.`name`, ts.`name`, `task_content` , `changes`
				FROM `bb_task_progress` tp
				INNER JOIN `bb_users` u ON `create_by` = u.`id`
				INNER JOIN `bb_users` us ON `change_by` = us.`id`
				INNER JOIN `bb_task_status` ts ON `status` = ts.`task_status_id`
				WHERE `RequestID` = ".$RequestID." AND `task_type` = ".$task_type." ORDER BY `change_date` DESC";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $create_date, $create_by, $change_date, $change_by, $status, $task_content, $changes);
	while ($stmt->fetch()) {
		if(!strstr($create_date, "-")) $create_date = transform_create_date($create_date);
		if(!strstr($change_date, "-")) $change_date = transform_create_date($change_date);
		$data[] = array('id' => $id, 'create_date' => $create_date, 'create_by' => $create_by, 'change_date'=>$change_date, 'change_by'=>$change_by, 'status'=>$status, 'task_content'=>$task_content, 'changes'=>$changes);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	}
	exit;
}

if(isset($_REQUEST['getTaskHistory'])){
	$RequestID = ($_REQUEST['RequestID'])? $_REQUEST['RequestID']: null;
	if($RequestID){
		$query = "SELECT th.`id`, `create_date`, u.`name`, `change_date`, us.`name`, ts.`name`, `tasks_type`, tt.`id` AS `task_type_id` 
				FROM `bb_tasks_history` th
				INNER JOIN `bb_users` u ON `create_by` = u.`id`
				INNER JOIN `bb_users` us ON `change_by` = us.`id`
				INNER JOIN `bb_tasks_type` tt ON `task_type` = tt.`id`
				INNER JOIN `bb_task_status` ts ON `status` = ts.`task_status_id`
				WHERE `RequestID` = ".$RequestID."
				ORDER BY th.`create_date` DESC";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $create_date, $create_by, $change_date, $change_by, $status, $task_type, $task_type_id);
	while ($stmt->fetch()) {
		if(!strstr($create_date, "-")) $create_date = transform_create_date($create_date);
		if(!strstr($change_date, "-")) $change_date = transform_create_date($change_date);
		$data[] = array('id' => $id, 'create_date' => $create_date, 'create_by' => $create_by, 'change_date'=>$change_date, 'change_by'=>$change_by, 'status'=>$status, 'task_type'=>$task_type, 'task_type_id'=>$task_type_id);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	}
	exit;
}

if(isset($_REQUEST['getTaskName'])){
	$tasks_type = ($_REQUEST['task_type'])? $_REQUEST['task_type']:null;
	$tasks_name = "";
	if($tasks_type){
		$query="SELECT `tasks_type` FROM `bb_tasks_type` WHERE `id` = ".$tasks_type;
		if ($stmt = $db->prepare($query)) {
	        $stmt->execute();
	        $stmt->bind_result($tasks_name);
	        $stmt->fetch();
	        $stmt->close();
		}
	echo $tasks_name;
	$db->close();
	}
	exit;
}

/*if(isset($_REQUEST['getTaskContent'])){
	$id = ($_REQUEST['id'])? $_REQUEST['id']:null;
	if($id){
		$query="SELECT `task_content`, `changes` FROM `bb_task_progress` WHERE `id` = ".$id;
		if ($stmt = $db->prepare($query)) {
	        $stmt->execute();
	        $stmt->bind_result($task_content, $changes);
	        $stmt->fetch();
	        $stmt->close();
		}
	$result = array('task_content'=>$task_content, 'changes'=>$changes);
	echo json_encode($result);
	$db->close();
	}
	exit;
}*/
?>