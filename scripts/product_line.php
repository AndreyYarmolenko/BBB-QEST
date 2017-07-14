<?php  
  //session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	include '../lang/langs.php';
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['prodlineShow'])) {
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

	$query="SELECT COUNT(`id`) FROM `bb_product_line` WHERE `deleted` = 0";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT `id`, `name`, `comment` FROM `bb_product_line` WHERE `deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit).";";
	
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

if (isset($_REQUEST['param']) && $_REQUEST['param'] == "add") {
	$idrow = $_REQUEST['idrow'];
	$name = $_REQUEST['name'];
	$comment = $_REQUEST['comment'];

	$same_name = false;

	$query = "SELECT `name` FROM bb_product_line";
	$stmt = $db->query($query);
	while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
		if($name == $res['name']) $same_name = true;
	}
	
	if($same_name == true) echo '{"success":false,"message":"'.$answers['name_already_ex'].'"}';
	
	else {
		$query = "INSERT INTO `bb_product_line` (`name`,`comment`) VALUES ('".$name."','".$comment."');";
	
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
	}

    $db->close();
    exit;
}

if (isset($_REQUEST['param']) && $_REQUEST['param'] == "edit") {
	$idrow = $_REQUEST['idrow'];
	$name = $_REQUEST['name'];
	$comment = $_REQUEST['comment'];

	$same_name = false;
	$old_name = false;

	$query = "SELECT `name` FROM bb_product_line WHERE `id` = $idrow";
	$stmt = $db->query($query);
	while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
		if($name == $res['name']) $old_name = true;
	}

	if($old_name == false) {
		$query = "SELECT `name` FROM bb_product_line";
		$stmt = $db->query($query);
		while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
			if($name == $res['name']) $same_name = true;
		}
		if($same_name == true) {
			echo '{"success":false,"message":"'.$answers['name_already_ex'].'"}';
			exit;
		}
	}
		
	if(isset($idrow) && $idrow!=""){
		$query = "UPDATE `bb_product_line` SET `name` = '".$name."',`comment` = '".$comment."' WHERE `id` = ".$idrow.";";
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
    $id = $_REQUEST['id'];
    $query = "UPDATE bb_product_line SET deleted = 1 WHERE `id` = $id";
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