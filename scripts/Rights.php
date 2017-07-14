<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
require_once("../settings.php");
require_once("../logger.php");


$id_user = $_SESSION['id'];
$instance = $_SESSION['instance'];


if ($_REQUEST['func'] == 'showRight') {
	$i = 0;
	$query = "SELECT `id`, `right_name`, `description`  FROM `bb_rights`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $right_name, $description);
	
	while ($stmt->fetch()) {	
		$data[$i] = array(
			'id' => $id,
			'name' => $right_name,
			'description' => $description,
			'check' => 0	
		);
		$i++;
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
}


if ($_REQUEST['func'] == 'showRoles') {
	$i = 0;

	$query = "SELECT `id` FROM `bb_roles`;";
	//echo $query;
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {

			$data[$i] = array(
								'id' => $id,
								'name' => $roles[$id]
							);
			$i++;
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}


if ($_REQUEST['func'] == 'setRights') {
	$roleID = $_REQUEST['roleID'];
	$i = 0;

	$query = "SELECT `id` FROM `bb_role_rights` WHERE role_id = $roleID LIMIT 1";

	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id);
	$stmt->fetch();
	$stmt->close(); 

	if (!$id) {

		$query = "SELECT `id` FROM `bb_rights`";

		$stmt = $db->prepare($query);
		$stmt->execute();
		$stmt->bind_result($id);

		while ($stmt->fetch()) {
			$data[$i] = $id;
			$i++;
		}
		
		$stmt->close();

		for ($i = 0; $i < count($data); $i++) {
			$query = "INSERT INTO bb_role_rights (`role_id`, `right_id` ) VALUES ($roleID, $data[$i])";

			$stmt = $db->prepare($query);
			$stmt->execute();
			$stmt->close();
		}
	}
	 
	$i = 0;
	$data = array();

	$query = "SELECT r.`id`, r.`right_name`, r.`description`, rr.`state`  FROM `bb_rights` r

	INNER JOIN `bb_role_rights` rr ON rr.right_id = r.id
	WHERE rr.role_id = $roleID
	UNION 
  	SELECT id,`right_name`, description, 0 FROM `bb_rights` WHERE id NOT IN(SELECT `right_id` FROM `bb_role_rights` WHERE `role_id`=$roleID)";
	
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $right_name, $description, $state);
	
	while($stmt->fetch()) {
		$data[$i] = array(
			'id' => $id,
			'name' => $right_name,
			'description' => $description,
			'check' => $state,
		);
		$i++;
	}
	$stmt->close();
	
	echo '{rows:'.json_encode($data).'}';	
}


if ($_REQUEST['func'] == 'saveRights') {
	$roleID = $_REQUEST['roleID'];
	$arrOfRigthID = $_REQUEST['arrOfRigthID'];
	$arrOfStates = $_REQUEST['arrOfStates'];
	
	for ($i = 0; $i < count($arrOfRigthID); $i++) {
		$query = "SELECT id FROM bb_role_rights WHERE role_id = $roleID AND right_id = $arrOfRigthID[$i]";
		$stmt = $db->prepare($query);
		$stmt->execute();
		$stmt->bind_result($id);
		$stmt->fetch();
		$stmt->close();
		if ($id) {
			$query = "UPDATE `bb_role_rights` SET `state`=$arrOfStates[$i] WHERE `role_id`=$roleID AND `right_id` = $arrOfRigthID[$i]";
			$stmt = $db->prepare($query);
			$stmt->execute();
			$stmt->close();
		} else {
			$query = "INSERT INTO  `bb_role_rights` (state, role_id,right_id) VALUES ($arrOfStates[$i], $roleID, $arrOfRigthID[$i])"; 
			//SET `state`=$arrOfStates[$i] WHERE `user_id`=$userID AND `right_id`=$arrOfRigthID[$i]";
			$stmt = $db->prepare($query);
			$stmt->execute();
			$stmt->close();
		}
		
	}
}
