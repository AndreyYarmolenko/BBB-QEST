<?php  
  session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['orderTasksShow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		$filterParam = "AND u.name LIKE '%$filter%'"; 
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`task_id`) FROM `bb_order_tasks`;";

	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT 
					ot.`task_id`, 
					ot.`order_id`,
					o.`part_num`,
					ot.`assignee`, 
					u.`name` AS `assignee_name`, 
					DATE_FORMAT(ot.`start_date`, '%Y-%m-%d %H:%i') AS `start_date`,
					DATE_FORMAT(ot.`finish_date`, '%Y-%m-%d %H:%i') AS `finish_date`,
					ot.`status`, 
					ts.`name` AS `status_name`, 
					ot.`comment`, 
					ot.`assigned_by`, 
					u.`name` AS `assigned_by_name`,
					ot.`task_type`,
					tt.`tasks_type` AS `task_type_name`,
					ot.`previous_task_id` 
				FROM `bb_order_tasks` ot
				INNER JOIN `bb_order` o ON o.`order_id` = ot.`order_id`
				INNER JOIN `bb_users` u ON ot.`assignee` = u.`id`
				INNER JOIN `bb_task_status` ts ON ot.`status` = ts.`task_status_id`
				INNER JOIN `bb_tasks_type` tt ON ot.`task_type` = tt.`id`
				LIMIT ".($start).",".($limit).";";
	
	if(!$stmt = $db->query($query)){
			echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
	}else{
			//$result = $stmt->fetch_all(MYSQLI_ASSOC);
			for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);){
				$result[] = $tmp;
			} 
			$stmt->close();
			echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
	}
	$db->close();
	exit;
	
}

if (isset($_REQUEST['addedit'])) {
	$idrow = $_REQUEST['idrow'];

	$order_id = $_REQUEST['order_id'];
	$assignee = $_REQUEST['assignee'];
	$start_date = $_REQUEST['start_date'];
	$finish_date = ($_REQUEST['finish_date']) ? "'".$_REQUEST['finish_date']."'" : "NULL";
	$status = $_REQUEST['status'];
	$assigned_by = $_REQUEST['assigned_by'];
	$task_type = $_REQUEST['task_type'];
	$comment = $_REQUEST['comment'];
	
	if(isset($idrow) && $idrow!=""){

		$query = "UPDATE `bb_order_tasks` SET `order_id` = ".$order_id.",`assignee` = ".$assignee.",`start_date` = '".$start_date."',`finish_date` = ".$finish_date.",`status` = ".$status.",`assigned_by` = ".$assigned_by.",`task_type` = ".$task_type.",`comment` = '".$comment."' WHERE `task_id` = ".$idrow.";";
	}else{
		$query = "INSERT INTO `bb_order_tasks` (`order_id`,`assignee`,`start_date`,`finish_date`,`status`,`assigned_by`,`task_type`,`comment`) VALUES (".$order_id.",".$assignee.",'".$start_date."',".$finish_date.",".$status.",".$assigned_by.",".$task_type.",'".$comment."');";
	}

	writeToLogDB($id_user, $query);
	//echo $query;
    if ($stmt = $db->prepare($query)) {
	    if ($stmt->execute()) {
			echo '{"success":true,"message":""}';
	    } else {
	        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	    }
	} else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }

    $db->close();
    exit;
}

if (isset($_REQUEST['delete'])) {

	$idrow = $_REQUEST['id'];
	
	$query = "DELETE FROM `bb_order` WHERE `order_id` = ".$idrow.";";

	writeToLogDB($id_user, $query);

    if ($stmt = $db->prepare($query)) {
	    if ($stmt->execute()) {
			echo '{"success":true,"message":""}';
	    } else {
	        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	    }
	} else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }

    $db->close();
    exit;

}


if ($_REQUEST['func'] == 'showOrders') {

	$i = 0;

	$query = "SELECT `order_id`, `part_num` FROM `bb_order`;";
	//echo $query;
	writeToLogDB($id_user, $query);

	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}

if ($_REQUEST['func'] == 'showUsers') {
	
	$i = 0;

	$query = "SELECT `id`, `name` FROM `bb_users` WHERE `instance` = $instance";
	//echo $query;
	writeToLogDB($id_user, $query);
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}

if ($_REQUEST['func'] == 'showTaskStatus') {

	$i = 0;

	$query = "SELECT `task_status_id`, `name` FROM `bb_task_status`;";
	//echo $query;
	writeToLogDB($id_user, $query);
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}

if ($_REQUEST['func'] == 'showTaskType') {

	$i = 0;

	$query = "SELECT `id`, `tasks_type` FROM `bb_tasks_type`;";
	//echo $query;
	writeToLogDB($id_user, $query);
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}

?>