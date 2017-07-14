<?php  
  	session_start();
	error_reporting(0);
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	require_once("saveform_func.php");
	include '../lang/langs.php';

	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];


if (isset($_REQUEST['getEngRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_engineering`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'view'=>0
		);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}

if (isset($_REQUEST['getWorkflowRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_workflow`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'view'=>0, 'change_responsible'=>0, 'change_assignee'=>0, 'change_due_date'=>0, 'change_new_due_date'=>0, 'complete'=>0, 'history'=>0
		);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}

if (isset($_REQUEST['getReportsRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_reports`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'view'=>0);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}


if (isset($_REQUEST['getAdministrationRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_administration`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'view'=>0, 'create'=>0, 'edit'=>0, 'delete'=>0);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}

if (isset($_REQUEST['getCatalogueRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_catalogue`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'view'=>0, 'create'=>0, 'edit'=>0, 'delete'=>0);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}

if (isset($_REQUEST['getManagRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_management`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'aprove'=>0);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}

if (isset($_REQUEST['getHRRights'])) {
	$query = "SELECT `id`, `permission`, `descr`  FROM `bb_rights_hr`";
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $permission, $descr);
	while ($stmt->fetch()) {	
		$data[] = array('id' => $id, 'permission' => $permission, 'descr' => $descr, 'aprove'=>0);
	}
	$stmt->close();
	echo '{rows:'.json_encode($data).'}';
	$db->close();
	exit;
}


if (isset($_REQUEST['saveRole'])) {
	$action = $_REQUEST['action'];
	$role_id=$_REQUEST['role_id'];
	$array['name']=$_REQUEST['name'];
	$array['description']=$_REQUEST['description'];
	$rights_arr[1] = $_REQUEST['eng_rights'];
	$rights_arr[2] = $_REQUEST['workfl_rights'];
	$rights_arr[3] = $_REQUEST['rep_rights'];
	$rights_arr[4] = $_REQUEST['adm_rights'];
	$rights_arr[5] = $_REQUEST['catal_rights'];
	$rights_arr[6] = $_REQUEST['manage_rights'];
	$rights_arr[7] = $_REQUEST['hr_rights'];

	if($action=='add'){
		$query = "SELECT COUNT(*) FROM `bb_roles` WHERE `name` = '".$array['name']."'";
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }

		if($count>0){
	    	$result = array('success'=>false, 'message'=>$answers['role_already_ex']);
		    }
		    else {
		    	$role_id = em_insert('bb_roles', $array);
		    	$result = array('success'=>true, 'message'=>$answers['role_created'].$array['name'], 'role_id'=>$role_id);
		    }
	}
	else{
		$where = "`id`=".$role_id;
		em_update('bb_roles', $array, $where);
		$query = "DELETE FROM `bb_role_rights` WHERE `role_id`=".$role_id;
		em_query($query);
		$result = array('success'=>true, 'message'=>$answers['role_updated'].$array['name'], 'role_id'=>$role_id);
	}

	$query = "SELECT  `id`,  `right_name` FROM  `bb_rights`";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id, $right_name);
		while ($stmt->fetch()) {
			$rights[$right_name] = $id;
		}
		$stmt->close();
	}

	for($i=1; $i<=count($rights_arr); $i++){
		$temp = json_decode(stripcslashes($rights_arr[$i]));
		for($j=0; $j<count($temp);$j++){
			$temp[$j] = (array)$temp[$j];
			$role_right['role_id'] = $role_id;
			$role_right['right_global_group_id'] = $i;
			$role_right['group_right'] = $temp[$j]['id'];
			unset($temp[$j]['id']);
			foreach ($temp[$j] as $key =>$value) {
				if($value==1){
					$role_right['right_id'] = $rights[$key];
					em_insert('bb_role_rights', $role_right);
				}
			}
		}
	}

	echo json_encode($result);
	$db->commit();
	exit;
}


if (isset($_REQUEST['getRightsByRole'])) {
	$role_id = $_REQUEST['role_id'];
	$data = getRightsByRole($role_id);
	echo json_encode($data);
	$db->close();
	exit;
}


if (isset($_REQUEST['roleShow'])) {
	$total = 0;
	$filter = "";
	if(isset($_REQUEST['filter'])) $filter = $_REQUEST['filter'];
	$query1="SELECT COUNT(*) FROM `bb_roles` WHERE `deleted` = 0 AND(`id` LIKE '%".$filter."%' OR `name` LIKE '%".$filter."%' OR `description` LIKE '%".$filter."%')";
	$query2 = "SELECT  `id`,  `name`, description FROM  `bb_roles` WHERE `deleted` = 0 AND(`name` LIKE '%".$filter."%' OR `description` LIKE '%".$filter."%')";
	//echo $query2;

	if ($stmt = $db->prepare($query1)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}

	if($stmt = $db->prepare($query2)){
		$stmt->execute();
		$stmt->bind_result($id, $roles, $description);
		while ($stmt->fetch()) {
			$data[] = array('id' => $id, 'name' => $roles,'description' => $description);
		}
		$stmt->close();
		echo '{total:'.$total.', rows:'.json_encode($data).'}';
	}
	else {
		echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	}
	$db->close();
	exit;
}

if (isset($_REQUEST['delete'])) {
    $id = $_REQUEST['id'];
    $query = "UPDATE bb_roles SET deleted = 1 WHERE `id` =".$id;
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