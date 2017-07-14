<?php  
  //session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	require_once("saveform_func.php");
	include '../lang/langs.php';
	
if (isset($_REQUEST['getPackData'])) {
	$pack_id = $_REQUEST['pack_id'];
	$pack_data = array();
	$query = "SELECT * FROM `bb_pack_requirement` WHERE `id` = ".$pack_id;
	if($stmt = $db->query($query)){
		while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
	        $pack_data[] = $tmp;
	    }
    	$stmt->close();
	}
	$pack_data[0]['pack_id'] = $pack_data[0]['id'];

	unset($pack_data[0]['id']);
	echo json_encode($pack_data[0]);
	$db->close();
	exit;
	
}


if(isset($_REQUEST['action'])){
	$action = $_REQUEST['action'];
	$pack_id = $_REQUEST['pack_id'];
	$pack['name'] = $_REQUEST['name'];
	$pack['description'] = $_REQUEST['description'];
	$pack['number'] = $_REQUEST['number'];
	
	$pack['material_cost'] = $_REQUEST['material_cost'];
	$pack['pc_type'] = $_REQUEST['pc_type'];
	$pack['pct_id'] = $_REQUEST['pct_id'];
	$pack['pct_lwh'] = $_REQUEST['pct_lwh'];
	$pack['pct_wt'] = $_REQUEST['pct_wt'];
	$pack['pct_material'] = $_REQUEST['pct_material'];
	$pack['d_type'] = $_REQUEST['d_type'];
	$pack['dt_id'] = $_REQUEST['dt_id'];
	$pack['dt_lwh'] = $_REQUEST['dt_lwh'];
	$pack['dt_wt'] = $_REQUEST['dt_wt'];
	$pack['dt_material'] = $_REQUEST['dt_material'];
	$pack['d_type2'] = $_REQUEST['d_type2'];
	$pack['dt2_id'] = $_REQUEST['dt2_id'];
	$pack['dt2_lwh'] = $_REQUEST['dt2_lwh'];
	$pack['dt2_wt'] = $_REQUEST['dt2_wt'];
	$pack['dt2_material'] = $_REQUEST['dt2_material'];
	$pack['sc_type'] = $_REQUEST['sc_type'];
	$pack['sct_id'] = $_REQUEST['sct_id'];
	$pack['sct_lwh'] = $_REQUEST['sct_lwh'];
	$pack['sct_wt'] = $_REQUEST['sct_wt'];
	$pack['sct_material'] = $_REQUEST['sct_material'];
	$pack['p_stack'] = $_REQUEST['p_stack'];
	$pack['rpi_method'] = $_REQUEST['rpi_method'];
	$pack['pbh_handler'] = $_REQUEST['pbh_handler'];
	$pack['sp_quantity'] = $_REQUEST['sp_quantity'];
	$pack['no_lc'] = $_REQUEST['no_lc'];
	$pack['no_lon'] = $_REQUEST['no_lon'];
	$pack['p_weight'] = $_REQUEST['p_weight'];
	$pack['pcg_weight'] = $_REQUEST['pcg_weight'];
	$pack['scg_weight'] = $_REQUEST['scg_weight'];
	$pack['mtc_load'] = $_REQUEST['mtc_load'];
	$pack['material_once'] = $_REQUEST['material_once'];
	$pack['part_img'] = $_REQUEST['part_img'];
	$pack['pack_img_primary'] = $_REQUEST['pack_img_primary'];
	$pack['pack_img_secondary'] = $_REQUEST['pack_img_secondary'];
	
	if($action=='add'){
		$query = "SELECT COUNT(*) FROM `bb_pack_requirement` WHERE `number` = '".$pack['number']."'";
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($count);
                $stmt->fetch();
                $stmt->close();
    	}

    	if($count==0){
    		$pack_id = em_insert('bb_pack_requirement', $pack);
    		
    		$result = array('success'=>true, 'message'=>$answers['pack_req_saved'], 'pack_id'=>$pack_id);
    	}
    	else {
    		$result = array('success'=>false, 'message'=>$answers['pack_req_already']);
    	}

	}
	elseif($action=='edit'){
		$where = "`id` = ".$pack_id;
		em_update('bb_pack_requirement', $pack, $where);

		$result = array('success'=>true, 'message'=>$answers['pack_req_update']);
	}

	echo json_encode($result);
	$db->commit();
    exit;
}

if (isset($_REQUEST['delPack'])) {
    $id = $_REQUEST['pack_id'];
    $query = "UPDATE bb_pack_requirement SET deleted = 1 WHERE `id` = ".$id;
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