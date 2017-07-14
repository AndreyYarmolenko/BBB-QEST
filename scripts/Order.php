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
		$filterParam = "AND u.name LIKE '%$filter%'"; 
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`order_id`) FROM `bb_order`;";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT o.`order_id`, 
					o.`ext_order_id`, 
					o.`client_id`,
					c.`name` AS `client_name`,
					o.`part_num`, 
					o.`creation_date`, 
					o.`created_by`, 
					u.`name` AS `user_name`,
					os.`order_status_id`, 
					os.`name` AS `order_status_name`,
					o.`comment` 
				FROM `bb_order` o
				INNER JOIN `bb_clients` c ON o.`client_id` = c.`client_id`
				INNER JOIN `bb_users` u ON o.`created_by` = u.`id`
				INNER JOIN `bb_order_status` os ON o.`order_status` = os.`order_status_id`
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
	$ext_order_id = $_REQUEST['ext_order_id'];
	$client_name = $_REQUEST['client_name'];
	$part_num = $_REQUEST['part_num'];
	$user_name = $_REQUEST['user_name'];
	$order_status_name = $_REQUEST['order_status_name'];
	$comment = $_REQUEST['comment'];
	$creation_date = date("Y-m-d H:i:s");
	
	if(isset($idrow) && $idrow!=""){

		$query = "UPDATE `bb_order` SET `ext_order_id` = '".$ext_order_id."',`client_id` = ".$client_name.",`part_num` = '".$part_num."',`created_by` = ".$user_name.",`order_status` = ".$order_status_name.",`comment` = '".$comment."' WHERE `order_id` = ".$idrow.";";
		
	}else{
		$query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`,`comment`) VALUES ('".$ext_order_id."',".$client_name.",'".$part_num."','".$creation_date."',".$user_name.",".$order_status_name.",'".$comment."');";
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


if ($_REQUEST['func'] == 'showClients') {

	$i = 0;

	$query = "SELECT `client_id`, `name` FROM `bb_clients`;";
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

if ($_REQUEST['func'] == 'showOrderStatus') {

	$i = 0;

	$query = "SELECT `order_status_id`, `name` FROM `bb_order_status`;";
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