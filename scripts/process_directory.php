<?php
include "../settings.php";
require_once "saveform_func.php";
include '../lang/langs.php';

	if(isset($_REQUEST['getAllProcesses']))  {
		$result = array();
		$search = null;
		if(isset($_REQUEST['search'])&&$_REQUEST['search']!=""){
			$search =$_REQUEST['search'];
		}

		if($search) {
			$query = "SELECT `bbb_sku_id`, bs.`name` AS `bbb_sku`, `create_date`, COUNT(*) AS `count`, pfc.`process_id`, `cell_number`, `revision`, `description`, `last_mod` FROM `bb_process_flow` pf
						INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
						LEFT JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
						WHERE `deleted` = 0 AND (bs.`name` LIKE '%".$search."%' OR `cell_number` LIKE '%".$search."%' OR `cell_number` LIKE '%".$search."%' OR `description` LIKE '%".$search."%') 
						GROUP BY pfc.`process_id`";
		}
		else {
	        $query = "SELECT `bbb_sku_id`, bs.`name` AS `bbb_sku`, `create_date`, COUNT(*) AS `count`, pfc.`process_id`, `cell_number`, `revision`, `description`, `last_mod` FROM `bb_process_flow` pf
						INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
						LEFT JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
						WHERE `deleted` = 0 GROUP BY pfc.`process_id`";
		}

		if($stmt = em_query($query)){
            while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                $result[] = $tmp;
            }
            $stmt->close();
		echo'{rows:'.json_encode($result).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['getCellNumbers']))  {
    	$Model = array();
	    if(isset($_REQUEST['query'])&&$_REQUEST['query']!=""){
	        $query = "SELECT `id`, `cell_number` FROM `bb_process_flow` WHERE `cell_number` LIKE '%".$_REQUEST['query']."%' AND `deleted` = 0 ORDER BY `id` ASC";
	    }
	    else $query = "SELECT `id`, `cell_number` FROM `bb_process_flow` WHERE `deleted` = 0 ORDER BY `id` ASC";

	if($stmt = $db->prepare($query)){
	    $stmt->execute();
	    $stmt->bind_result($id, $cell_number);
	    while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'cell_number'=>$cell_number);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}

if(isset($_REQUEST['getProcessDataById']))  {
	$process_id = $_REQUEST['process_id'];
	        $query = "SELECT `bbb_sku_id`, bs.`name` AS `bbb_sku`, `create_date`, pf.`id` AS `process_id`, `cell_number`, `revision`, `description`, `last_mod` FROM `bb_process_flow` pf
						INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
						LEFT JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
						WHERE pf.`id`=".$process_id." ORDER BY pfc.`id` DESC LIMIT 1";
		if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
		echo json_encode($result);
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

if(isset($_REQUEST['saveProcess'])){
	$action = $_REQUEST['action'];
	$data['process_id'] = $_REQUEST['process_id'];
	$data['process'] = $_REQUEST['process'];

	$data['cell_number'] = $process['cell_number'] = $_REQUEST['cell_number'];
	$data['revision'] = $process['revision'] = $_REQUEST['revision'];
	$data['description'] = $process['description'] = $_REQUEST['description'];
	$data['bbb_sku_id'] = $process['bbb_sku_id'] = $_REQUEST['bbb_sku_id'];
	$process['last_mod'] = date('Y-m-d');

	$check = checkProcess($data);

	if($check['success']===true){
		if($action=='add'){
			/*if($check['exist']){
				$result = array('success'=>false, 'message'=>$check['message']);
			}
			else {*/
				$process['create_date'] = $process['last_mod'];
				$process_id = em_insert('bb_process_flow', $process);
				em_update('bb_bbb_sku', array('process_id'=>$process_id), " `id`=".$data['bbb_sku_id']);
				
				$process_arr = JsonToArray($data['process']);
				
				$count_op = count($process_arr);
				for($i=0; $i<$count_op; $i++){
					$tmp = (array)$process_arr[$i];
					$content['full'] =$tmp['full']? 1:0;
					$content['operation_id'] = $tmp['id'];
					$content['operation_number'] = $tmp['op_number'];
					$content['process_id'] = $process_id;
					em_insert('bb_process_flow_content', $content);
				}
				$result = array('success'=>true, 'process_id'=>$process_id, 'create_date'=>$process['create_date'], 'last_mod'=>$process['last_mod'], 'message'=>'Process saved.');
			//}
		}
		else {
			//if($check['exist']&&$check['this']){
				$where= " `id`=".$data['process_id'];
				em_update('bb_process_flow', $process, $where);

				$process_arr = JsonToArray($data['process']);
				$query = "DELETE FROM `bb_process_flow_content` WHERE `process_id` = ".$data['process_id'];
				em_query($query);

				$count_op = count($process_arr);
				for($i=0; $i<$count_op; $i++){
					$tmp = (array)$process_arr[$i];
					$content['full'] =$tmp['full']? 1:0;
					$content['operation_id'] = $tmp['id'];
					$content['operation_number'] = $tmp['op_number'];
					$content['process_id'] = $data['process_id'];
					em_insert('bb_process_flow_content', $content);
				}
				$result = array('success'=>true, 'process_id'=>$data['process_id'], 'last_mod'=>$process['last_mod'], 'message'=>'Process updated.');
			/*}
			else {
				$result = array('success'=>false, 'message'=>$check['message']);
			}*/
		}
	}
	else {
		$result = array('success'=>false, 'message'=>$check['message']);
	}
	echo json_encode($result);
	$db->commit();
	$db->close();
	exit;
}

if(isset($_REQUEST['deleteProcess']))  {
	$id = $_REQUEST['process_id'];
	$where = "`id`=".$id;
	if(em_update('bb_process_flow', array('deleted'=>1), $where)){
		$result = array('success'=>true, 'message'=> 'Process deleted.');
	}
	else {
		$result = array('success'=>false, 'message'=> 'Process not deleted.');
	}
	echo json_encode($result);
	exit;
}

if(isset($_REQUEST['getProcessBySKU'])){
	$bbb_sku_id = $_REQUEST['bbb_sku_capa'];
	$query = "SELECT `bbb_sku_id`, bs.`name` AS `bbb_sku`, `create_date`, pf.`id` AS `process_id`, `cell_number`, `revision`, `description`, `last_mod` FROM `bb_process_flow` pf
						INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
						LEFT JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
						WHERE pf.`id`=(SELECT `process_id` FROM `bb_bbb_sku` WHERE `id` = ".$bbb_sku_id.") ORDER BY pfc.`id` DESC LIMIT 1";
		if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        
        $Model = getProcessContent($result['process_id']);
        $count_m = count($Model);
        if($count_m>0){
        for($i=0; $i<$count_m; $i++){
            $tmp = selectOperationData($Model[$i]['id_op'], "", $Model[$i]['op_number']);
            if($tmp['success']===true){
                $data = $tmp['result'][0];
                $Model[$i]['approved'] = $data['approved'];
                $Model[$i]['descriptionOperation'] = $data['descriptionOperation'];
            }
        }
        $result['process'] = $Model;
        }
        
    	$result = array('success'=>true, 'process'=>$result);
    }
    else {
    	$result = array('success'=>false, 'message'=> 'No process.');
    }
    echo json_encode($result);
	exit;
}

?>