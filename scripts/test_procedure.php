<?php  
  session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	require_once("saveform_func.php");
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['getTestProcedures'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		$filterParam = "AND (`test_procedure` LIKE '%".$filter."%' OR `description` LIKE '%".$filter."%')";
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`id`) FROM `bb_test_procedure`WHERE `deleted` = 0 ".$filterParam;
	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT `id`, `test_procedure`, `description`, `spec_conditions`, `instruction` FROM `bb_test_procedure` WHERE `deleted` = 0 ".$filterParam." LIMIT ".($start).",".($limit).";";
	
	if(!$stmt = $db->query($query)){
			echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
	}else{
			for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);){
				$result[] = $tmp;
			} 
			$stmt->close();
			echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
	}
	$db->close();
	exit;
}

if(isset($_REQUEST['addProcedure'])) {
	$test_data['test_procedure']=$_REQUEST['test_procedure'];
	$test_data['description']=$_REQUEST['description'];
	$test_data['spec_conditions']=$_REQUEST['spec_conditions'];
	$test_data['instruction']=$_REQUEST['instruction'];

	$insert_id = em_insert('bb_test_procedure', $test_data);
	if($insert_id){
		$result = array('success'=> true, 'el_id'=>$insert_id);
	}
	else {
		$result = array('success'=> false, 'message'=>'Data not saved!');
	}
	echo json_encode($result);
	$db->close();
	exit;
}

if(isset($_REQUEST['getProcedureById']))  {
	$el_id = $_REQUEST['el_id'];
	$query = "SELECT `id`, `test_procedure`, `description`, `spec_conditions`, `instruction` FROM `bb_test_procedure` WHERE `id` = ".$el_id;

	if($stmt = $db->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($id, $test_procedure, $description, $spec_conditions, $instruction);
    while ($stmt->fetch()){
    	$Model[]= array('el_id'=>$id, 'test_procedure'=>$test_procedure, 'description'=>$description, 'spec_conditions'=>$spec_conditions, 'instruction'=>$instruction);
    }
	$stmt->close();
	echo json_encode($Model[0]);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['editProcedure'])) {
	$el_id = $_REQUEST['el_id'];
	$test_data['test_procedure']=$_REQUEST['test_procedure'];
	$test_data['description']=$_REQUEST['description'];
	$test_data['spec_conditions']=$_REQUEST['spec_conditions'];
	$test_data['instruction']=$_REQUEST['instruction'];

	$where = "`id` = ".$el_id;

	if(em_update('bb_test_procedure', $test_data, $where)){
		$result = array('success'=> true, 'el_id'=>$el_id);
	}
	else {
		$result = array('success'=> false, 'message'=>'Data not saved!');
	}
	echo json_encode($result);
	$db->close();
	exit;
}

if (isset($_REQUEST['deleteProcedure'])) {
    $el_id = $_REQUEST['el_id'];
    $query = "UPDATE `bb_test_procedure` SET deleted = 1 WHERE `id` = ".$el_id;
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