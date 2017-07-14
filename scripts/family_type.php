<?php  
 //session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	require_once("saveform_func.php");
	include '../lang/langs.php';
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

if (isset($_REQUEST['familyShow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	
	$data = array();
	
	if ($filter) {
		//$filterParam = "AND u.name LIKE '%$filter%'";
		$filterParam = "AND (`family_name` LIKE '%".$filter."%' OR `family_description` LIKE '%".$filter."%')"; 
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(`id`) FROM `bb_family_type` WHERE `deleted` = 0";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT `id`, `family_name`, `family_description` FROM `bb_family_type` WHERE `deleted` = 0 ".$filterParam."  LIMIT ".($start).",".($limit).";";
	
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


if(isset($_REQUEST['action'])){
	$action = $_REQUEST['action'];
	$family_id = $_REQUEST['family_id'];
	$core_attr = JsonToArray($_REQUEST['core_attr']);
	$phys_attr = JsonToArray($_REQUEST['phys_attr']);
	$family_name = $_REQUEST['family_name'];
	$family_description = $_REQUEST['family_description'];
	if($action=='add'){
		$query = "SELECT COUNT(*) FROM `bb_family_type` WHERE `family_name` = '".$family_name."'";
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($count);
                $stmt->fetch();
                $stmt->close();
    	}

    	if($count==0){
    		$family_id = em_insert('bb_family_type', array('family_name'=>$family_name, 'family_description'=>$family_description));
    		
    		setFamilyAttr($core_attr, $family_id, 'core_attr');
    		setFamilyAttr($phys_attr, $family_id, 'phys_attr');
    		$result = array('success'=>true, 'message'=>$answers['family_saved']);
    	}
    	else {
    		$result = array('success'=>false, 'message'=>$answers['family_is_already']);
    	}

	}
	elseif($action=='edit'){
		$where = "`id` = ".$family_id;
		em_update('bb_family_type', array('family_name'=>$family_name, 'family_description'=>$family_description), $where);
		
		updateFamilyAttr($core_attr, $family_id, 'core_attr');
    	updateFamilyAttr($phys_attr, $family_id, 'phys_attr');

		$result = array('success'=>true, 'message'=>$answers['family_updated']);
	}

	echo json_encode($result);
	$db->commit();
    exit;
}


if (isset($_REQUEST['getFamilyData'])) {
	$family_id = $_REQUEST['family_id'];
	$result = getFamilyData($family_id);
	echo json_encode($result);
	exit;
}

if (isset($_REQUEST['getFamilyContent'])) {
	$family_id = $_REQUEST['family_id'];
	$request_id = $_REQUEST['request_id'];
	$result = getFamilyData($family_id);
	$core_data = array();
	$data_stores = array();
	$core_attr = array();

	if($result['core_attr']!=null){
		$core_attr = JsonToArray($result['core_attr']);
	}

	if(count($core_attr)>0){
		$query="SELECT * FROM `bb_res_core_analysis` WHERE  `family_id`=".$family_id." AND `RequestID` =".$request_id;
		if($stmt = $db->query($query)){
			while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
				unset($tmp['RequestID']);
				unset($tmp['id']);
		        $core_data[] = $tmp;
		    }
	    	$stmt->close();
		}

		$columns = "`id`,";
		for ($i=0; $i < count($core_attr); $i++) {
			if($core_attr[$i]['data_type']==2){
				$columns .= "`".$core_attr[$i]['dynamic_id']."`,";
			}
		}

		$columns = substr($columns, 0, -1);
		$core_stores = array();
		$query = "SELECT ".$columns." FROM `bb_family_attr_stores`";
		if($stmt = $db->query($query)){
			while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
		        $core_stores[] = $tmp;
		    }
	    	$stmt->close();
		}

		for($i=0; $i<count($core_stores); $i++){
			foreach($core_stores[$i] as $key => $value) {
				if($key!='id'){
					if($value&&$value!=""){
						$data_stores[$key][]=array('id'=>$core_stores[$i]['id'], 'value'=>$value);
					}
				}
			}
		}
	}

	$result['core_stores'] = (count($data_stores)>0)? json_encode($data_stores):null;
	$result['core_data'] = (count($core_data)>0)? json_encode($core_data):null;
	echo json_encode($result);
	exit;
}

if (isset($_REQUEST['getFamilyPhysAttr'])) {
	$family_id = $_REQUEST['family_id'];
	$request_id = $_REQUEST['request_id'];
	$result = getFamilyData($family_id);
	$phys_data = array();

	$phys_attr = JsonToArray($result['phys_attr']);

	if(count($phys_attr)>0){
		$query="SELECT * FROM `bb_res_phys_attributes` WHERE  `family_id`=".$family_id." AND `RequestID` =".$request_id;
		if($stmt = $db->query($query)){
			while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
				unset($tmp['RequestID']);
				unset($tmp['id']);
		        $phys_data[] = $tmp;
		    }
	    	$stmt->close();
		}

		$columns = "`id`,";
		for ($i=0; $i < count($phys_attr); $i++) {
			if($phys_attr[$i]['data_type']==2){
				$columns .= "`".$phys_attr[$i]['dynamic_id']."`,";
			}
		}

		$columns = substr($columns, 0, -1);
		$phys_stores = array();
		$query = "SELECT ".$columns." FROM `bb_family_attr_stores`";
		if($stmt = $db->query($query)){
			while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
		        $phys_stores[] = $tmp;
		    }
	    	$stmt->close();
		}
		$data_stores = array();
		for($i=0; $i<count($phys_stores); $i++){
			foreach($phys_stores[$i] as $key => $value) {
				if($key!='id'){
					if($value&&$value!=""){
						$data_stores[$key][]=array('id'=>$phys_stores[$i]['id'], 'value'=>$value);
					}
				}
			}
		}
	}

	$result['phys_stores'] = (count($data_stores)>0)? json_encode($data_stores):null;
	$result['phys_data'] = (count($phys_data)>0)? json_encode($phys_data):null;
	echo json_encode($result);
	exit;
}

if (isset($_REQUEST['delete'])) {
    $id = $_REQUEST['id'];
    $query = "UPDATE bb_family_type SET deleted = 1 WHERE `id` = $id";
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