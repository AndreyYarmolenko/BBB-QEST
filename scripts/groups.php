<?php  
  //session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	include '../lang/langs.php';
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['groupShow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		//$filterParam = "AND u.name LIKE '%$filter%'";
		$filterParam = "AND (`name` LIKE '%".$filter."%' OR `comment` LIKE '%".$filter."%' OR `short_name` LIKE '%".$filter."%' OR `parent_depart` LIKE '%".$filter."%')"; 
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(*) 
		FROM `bb_departments` dep
	 	LEFT JOIN bb_departments pardep ON pardep.`parent_depart` = dep.`id`
		WHERE dep.`deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit);

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT dep.`id`, dep.`name`, dep.`comment`, pardep.`name` AS `parent_depart` /*dep.`parent_depart`*/
	 	FROM `bb_departments` dep
	 	LEFT JOIN bb_departments pardep ON dep.`parent_depart` = pardep.`id`
	 	WHERE dep.`deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit);
	
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
	$parent_depart = $_REQUEST['parent_depart'];

	$same_name = false;

	$query = "SELECT `name` FROM bb_departments";
	$stmt = $db->query($query);
	while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
		if($name == $res['name']) $same_name = true;
	}
	
	if($same_name == true) {
		echo '{"success":false,"message":"'.$answers['name_already_ex'].'"}';
		exit;
	}
	else {
		$query = "INSERT INTO `bb_departments` (`name`,`comment`, `parent_depart`) VALUES ('".$name."','".$comment."', $parent_depart);";

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

if (isset($_REQUEST['param'])) {
	if($_REQUEST['param'] == "edit") { 
		$idrow = $_REQUEST['idrow'];
		$name = $_REQUEST['name'];
		$comment = $_REQUEST['comment'];
		$parent_depart = $_REQUEST['parent_depart'];

		$same_name = false;
		$old_name = false;

		$query = "SELECT `name` FROM bb_departments WHERE `id` = $idrow";
		$stmt = $db->query($query);
		while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
			if($name == $res['name']) $old_name = true;
		}

		if($old_name == false) {
			$query = "SELECT `name` FROM bb_departments";
			$stmt = $db->query($query);
			while($res = $stmt->fetch_array(MYSQLI_ASSOC)) {
				if($name == $res['name']) $same_name = true;
			}
			
			if($same_name == true) {
				echo '{"success":false,"message":"'.$answers['name_already_ex'].'"}';
				exit;
			}
		}
	
		if(isset($idrow) && $idrow!="") {
			$query = "UPDATE `bb_departments` SET `name` = '".$name."',`comment` = '".$comment."', `parent_depart` = ".$parent_depart." WHERE `id` = ".$idrow.";";
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
	}

    $db->close();
    exit;
}

if (isset($_REQUEST['delete'])) {

	/*$idrow = $_REQUEST['id'];
	
	$query = "DELETE FROM `bb_departments` WHERE `id` = ".$idrow.";";

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
    $query = "UPDATE bb_departments SET deleted = 1 WHERE `id` = $id";
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