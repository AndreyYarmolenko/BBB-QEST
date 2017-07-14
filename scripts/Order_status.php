<?php  
  session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['ordersShow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		//$filterParam = "AND u.name LIKE '%$filter%'"; 
		$filterParam = "AND (`name` LIKE '%".$filter."%' OR `comment` LIKE '%".$filter."%')";
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`order_status_id`) FROM `bb_order_status`;";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT `order_status_id`, `name`, `comment` FROM `bb_order_status` WHERE `deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit).";";
	
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
	$name = $_REQUEST['name'];
	$comment = $_REQUEST['comment'];
	
	if(isset($idrow) && $idrow!=""){

		$query = "UPDATE `bb_order_status` SET `name` = '".$name."',`comment` = '".$comment."' WHERE `order_status_id` = ".$idrow.";";
		
	}else{
		$query = "INSERT INTO `bb_order_status` (`name`,`comment`) VALUES ('".$name."','".$comment."');";
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
	
	$query = "DELETE FROM `bb_order_status` WHERE `order_status_id` = ".$idrow.";";

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
    $query = "UPDATE bb_order_status SET deleted = 1 WHERE `order_status_id` = $id";
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