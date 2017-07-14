<?php  
  session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['typesShow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		//$filterParam = "AND u.name LIKE '%$filter%'";
		$filterParam = "AND (`tasks_type` LIKE '%".$filter."%' OR `department_id` LIKE '%".$filter."%' OR `short_name` LIKE '%".$filter."%' OR `comment` LIKE '%".$filter."%' OR `script` LIKE '%".$filter."%')"; 
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`id`) FROM `bb_tasks_type` WHERE `deleted` = 0";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT `id`, `tasks_type`, `comment`, short_name, script FROM `bb_tasks_type` WHERE `deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit).";";
	
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
	$tasks_type = $_REQUEST['tasks_type'];
	$comment = $_REQUEST['comment'];
	$short_name = $_REQUEST['short_name'];
	$script = addslashes(stripslashes($_REQUEST['script']));

	if(isset($idrow) && $idrow!=""){

		$query = "UPDATE `bb_tasks_type` SET `tasks_type` = '".$tasks_type."',`comment` = '".$comment."',  short_name = '".$short_name."', script = '".$script."' WHERE `id` = ".$idrow.";";

	}else{

		$query = "INSERT INTO `bb_tasks_type` (`tasks_type`,`comment`, short_name, script) VALUES ('".$tasks_type."','".$comment."', '".$short_name."', '".$script."');";

	}

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

if (isset($_REQUEST['delete'])) {

	/*$idrow = $_REQUEST['id'];
	
	$query = "DELETE FROM `bb_tasks_type` WHERE `id` = ".$idrow.";";

	writeToLogDB($id_user, $query);

    if ($stmt = $db->prepare($query)) {
	    if ($stmt->execute()) {
			echo '{"success":true,"message":""}';
	    } else {
	        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	    }
	} else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }*/

    $id = $_REQUEST['id'];
    $query = "UPDATE bb_tasks_type SET deleted = 1 WHERE `id` = $id";
	if(!$stmt = $db->prepare($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	else {
		if ($stmt->execute()) {
			echo '{"success":true,"message":""}';
	    } 
	    else {
	        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	    }
	}
    $db->close();
    exit;

}
?>