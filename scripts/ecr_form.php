<?php
 session_start();
    header('Content-Type: application/json; charset=utf-8');
    error_reporting(E_ERROR);
    
	if (!isset($_SESSION['id'])) {
    die('{"success":false,"message":""}');
	}

	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";
	include "../logger.php";
	include "function.php";
	require_once("../lang/langs.php");
	require_once "saveform_func.php";
	require_once "smtp-func.php";
    include '../lang/langs.php';

$statusTool = array("New", "Approved", "Rejected");
function putFiles($file){
	$pathImage = '../img/components/';
	$pathDoc = '../files/docs/';
	/*if($file["size"] > 1024*2*1024){
        echo '{"success":false,"message":"'.$answers['file_size_ex'].' 2M"}';
        exit;
    }*/

	//$endfile = substr($file['name'],-3, strlen($file['name']));
    $endfile = pathinfo($file['name'], PATHINFO_EXTENSION);
    $end_length = strlen($endfile);

	if($endfile == 'jpg' || $endfile == 'png' || $endfile == 'gif' || $endfile == 'bmp') $path = $pathImage;
		elseif($endfile == 'doc' || $endfile == 'txt' || $endfile == 'xls' || $endfile == 'xlsx' || $endfile == 'docx'||$endfile == 'pdf') $path = $pathDoc;
	$file_in = $file['tmp_name'];

    $personnel_filename = formatToLatin(substr($file['name'],0,$end_length).'_'.time());
	$personnel_filename = $personnel_filename.".".$endfile;
	file_put_contents($path.$personnel_filename, file_get_contents($file_in));
	echo '{"success":true,"message":"'.$personnel_filename.'"}';
}

function put_in_eps($file) {
    $pathImage = '../img/components/';
    $pathDoc = '../files/docs/';

    //$endfile = substr($file['name'],-3, strlen($file['name']));
    $endfile = pathinfo($file['name'], PATHINFO_EXTENSION);
    $end_length = strlen($endfile);

    if($endfile == 'jpg' || $endfile == 'png' || $endfile == 'gif'|| $endfile == 'bmp') $path = $pathDoc;
    elseif($endfile == 'doc' || $endfile == 'txt' || $endfile == 'xls' || $endfile == 'xlsx' || $endfile == 'docx'||$endfile == 'pdf' || $endfile == 'zip' || $endfile == 'rar' || $endfile == 'exe') $path = $pathDoc;
    $file_in = $file['tmp_name'];

    $personnel_filename = formatToLatin(substr($file['name'],0,$end_length).'_'.time());
    $personnel_filename = $personnel_filename.".".$endfile;
    file_put_contents($path.$personnel_filename, file_get_contents($file_in));
    echo '{"success":true,"message":"'.$personnel_filename.'"}';
}

function selectAttrTables($dim, $func, $parts, $deviation){
    global $db;
    $part_ids = "";
    $result=array();
    $func_out =array();
    $dim_out =array();
    $temp = array();

    for($i=0; $i<count($parts); $i++){
            $part_ids .= $parts[$i]['id'].",";
        }
    $part_ids = "(".substr($part_ids, 0, -1).")";

    if($dim){
        $dim_arr = JsonToArray($dim);
        for ($i=0; $i<count($dim_arr); $i++) { 
            if($dim_arr[$i]['metric']==2){
                $dim_arr[$i]['dimension'] = convertInch($dim_arr[$i]['dimension']);
                $dim_arr[$i]['tolerance_plus'] = convertInch($dim_arr[$i]['tolerance_plus']);
                $dim_arr[$i]['tolerance_minus'] = convertInch($dim_arr[$i]['tolerance_minus']);
            }
        }
        $exist =true;
        $query = "SELECT `id`, `component_id`, `dimension_name`, `metric`, `dimension` FROM `bb_dimensional_attributes` WHERE `component_id` IN ".$part_ids;
        if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($id, $component_id, $dimension_name, $metric, $dimension);
            while ($stmt->fetch()){
                if($metric==2){
                    $dimension = convertInch($dimension);
                }
                $temp_arr[$component_id][] = array('id'=>$id, 'dimension_name'=>$dimension_name, 'metric'=>$metric, 'dimension'=>$dimension);
            }
            $stmt->close();
        }
        
        foreach($temp_arr as $key => $value) {
            $count_row = 0;
            for ($i=0; $i<count($value); $i++) { 
                $exist_row = false;
                for ($k=0; $k<count($dim_arr); $k++) {
                    if($value[$i]['dimension_name']==$dim_arr[$k]['dimension_name']&&$value[$i]['metric']==$dim_arr[$k]['metric']){
                        if($dim_arr[$k]['dimension']){
                            if(preg_match("/[34]/", $value[$i]['metric'])){
                                if($value[$i]['dimension']==$dim_arr[$k]['dimension']){
                                    $exist_row = true;
                                }
                            }
                            else {
                                if($dim_arr[$k]['tolerance_plus']||$deviation){
                                    if(!$dim_arr[$k]['tolerance_plus']&&$deviation){
                                        $max = $dim_arr[$k]['dimension']+$dim_arr[$k]['dimension']*$deviation;
                                    }
                                    else {
                                        $max = $dim_arr[$k]['dimension']+$dim_arr[$k]['tolerance_plus'];
                                    }
                                    
                                    if(!$dim_arr[$k]['tolerance_minus']&&$deviation){
                                        $min = $dim_arr[$k]['dimension']-$dim_arr[$k]['dimension']*$deviation;
                                    }
                                    else {
                                        $min = $dim_arr[$k]['dimension']-$dim_arr[$k]['tolerance_minus'];
                                    }
                                    
                                    if($value[$i]['dimension']<$max&&$value[$i]['dimension']>$min){
                                        $exist_row = true;
                                    }
                                }
                                else {
                                    if($value[$i]['dimension']==$dim_arr[$k]['dimension']){
                                        $exist_row = true;
                                    }
                                }
                            }
                        }
                        else {
                            $exist_row = true;
                        }
                    }
                }
                if($exist_row){
                    $exist_row = false;
                    $count_row++;
                }
            }

            if(count($dim_arr)<=$count_row){
                $dim_out[] = $key;
            }
        }
    }
  
    if($func){
        $func_arr = JsonToArray($func);
        $exist =true;
        $query = "SELECT `id`, `component_id`, `value_desc`, `metric`, `nominal` FROM `bb_functional_attributes` WHERE `component_id` IN ".$part_ids;
        if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($id, $component_id, $value_desc, $metric, $nominal);
            while ($stmt->fetch()){
                $temp_arr[$component_id][] = array('id'=>$id, 'value_desc'=>$value_desc, 'metric'=>$metric, 'nominal'=>$nominal);
            }
            $stmt->close();
        }
        
        foreach($temp_arr as $key => $value) {
            $count_row = 0;
            for ($i=0; $i<count($value); $i++) { 
                $exist_row = false;
                for ($k=0; $k<count($func_arr); $k++) {
                    if($value[$i]['value_desc']==$func_arr[$k]['value_desc']&&$value[$i]['metric']==$func_arr[$k]['metric']){
                        if($func_arr[$k]['nominal']){
                            if($func_arr[$k]['tolerance_plus']||$deviation){
                                if(!$func_arr[$k]['tolerance_plus']&&$deviation){
                                    $max = $func_arr[$k]['nominal']+$func_arr[$k]['nominal']*$deviation;
                                }
                                else {
                                    $max = $func_arr[$k]['dimension']+$func_arr[$k]['tolerance_plus'];
                                }
                                
                                if(!$func_arr[$k]['tolerance_minus']&&$deviation){
                                    $min = $func_arr[$k]['nominal']-$func_arr[$k]['nominal']*$deviation;
                                }
                                else {
                                    $min = $func_arr[$k]['nominal']-$func_arr[$k]['tolerance_minus'];
                                }

                                if($value[$i]['nominal']<$max&&$value[$i]['nominal']>$min){
                                    $exist_row = true;
                                }
                            }
                            else {
                                if($value[$i]['nominal']==$func_arr[$k]['nominal']){
                                    $exist_row = true;
                                }
                            }
                        }
                        else {
                            $exist_row = true;
                        }
                    }
                }
                if($exist_row){
                    $exist_row = false;
                    $count_row++;
                }
            }
            if(count($func_arr)<=$count_row){
                $func_out[] = $key;
            }
        }
    }
    
    if(($dim&&count($dim_out)==0)||($func&&count($func_out)==0)){
        $temp = array();
    }
    else {
        if(count($dim_out)==0){
            $temp = $func_out;
        }
        elseif(count($func_out)==0){
            $temp = $dim_out;
        }
        else {
            $temp = array_intersect($dim_out, $func_out);
        }
    }

    for ($i=0; $i <count($parts); $i++) { 
        if(in_array($parts[$i]['id'], $temp)){
            $result[] = $parts[$i];
        }
    }
    return $result;
}

if(isset($_REQUEST['addImage'])) {
    if($_FILES['image1']) putFiles($_FILES['image1']);
	if($_FILES['image_el']) putFiles($_FILES['image_el']);
	if($_FILES['drawing2d']) putFiles($_FILES['drawing2d']);
	if($_FILES['drawing3d']) putFiles($_FILES['drawing3d']);
	if($_FILES['add_imageform']) putFiles($_FILES['add_imageform']);
	if($_FILES['addImages']) putFiles($_FILES['addImages']);
}


if(isset($_REQUEST['addFile'])) {
	if($_FILES['fileform']) putFiles($_FILES['fileform']);
	if($_FILES['add_spec']) putFiles($_FILES['add_spec']);
	if($_FILES['final_test']) put_in_eps($_FILES['final_test']);
	if($_FILES['diagnostic_software']) put_in_eps($_FILES['diagnostic_software']);
}

if(isset($_REQUEST['addDoc'])) {
		$file = $_FILES['fileform'];
		$path = '../files/';
	/*if($file["size"] > 1024*2*1024){
        echo '{"success":false,"message":"File size exceeds 2MБ"}';
        exit;
    }*/

	//$endfile = substr($file['name'],-3, strlen($file['name']));
    $endfile = pathinfo($file['name'], PATHINFO_EXTENSION);
    $end_length = strlen($endfile);
	$file_in = $file['tmp_name'];

	$personnel_filename = substr($file['name'],0,$end_length).'_'.time().".".$endfile;
	file_put_contents($path.$personnel_filename, file_get_contents($file_in));
	echo '{"success":true,"message":"'.$personnel_filename.'"}';
	exit;
}


if(isset($_REQUEST['getPartNumbers']))  {
            $Model = array();
            if($_REQUEST['query'] && $_REQUEST['query']!=""){
                $query = "SELECT `id`, `part_number`, `description` FROM bb_components WHERE `part_number` LIKE '%".$_REQUEST['query']."%' ORDER BY `id` ASC;";
            }
            else $query = "SELECT `id`, `part_number`, `description` FROM bb_components ORDER BY `id` ASC;";

    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$part_number, $part_name);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'part_number'=>$part_number, 'part_name'=>$part_name);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
}

		if(isset($_REQUEST['getDimAttributes']))  {
			$id_part =  $_REQUEST['id'];
			$query = "SELECT `id`, `critical`, `dimension_name`, `metric`, `dimension`, `tolerance_plus`, `tolerance_minus`, `tool_gage`, `tool_gage_id` FROM bb_dimensional_attributes 
			WHERE `component_id` = $id_part 
			ORDER BY `id` ASC;";

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id, $critical, $dimension_name, $metric, $dimension, $tolerance_plus, $tolerance_minus, $tool_gage, $tool_gage_id);
	        while ($stmt->fetch()){
	        	/*if($metric ==2) {
	        		$dimension = convertMM($dimension);
	        		$tolerance_plus = convertMM($tolerance_plus);
	        		$tolerance_minus = convertMM($tolerance_minus);
	        	}*/
				$Model[]= array('id'=>$id,'critical'=>$critical, 'dimension_name'=> $dimension_name, 'metric'=>$metric, 'dimension'=>$dimension, 'tolerance_plus'=>$tolerance_plus, 'tolerance_minus'=>$tolerance_minus, 'tool_gage'=>$tool_gage, 'tool_gage_id'=>$tool_gage_id);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

		if(isset($_REQUEST['getFuncAttributes']))  {
			$id_part =  $_REQUEST['id'];
			$query = "SELECT `id`, `critical`, `value_desc`, `metric`, `nominal`, `tolerance_plus`, `tolerance_minus`, `test_procedure`, `test_procedure_id`, `equipment`, `equipment_id` FROM bb_functional_attributes
			WHERE `component_id` = $id_part 
			ORDER BY `id` ASC;";

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id, $critical, $value_desc, $metric, $nominal, $tolerance_plus, $tolerance_minus, $test_procedure, $test_procedure_id, $equipment, $equipment_id);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'critical'=>$critical, 'value_desc'=> $value_desc, 'metric'=>$metric, 'nominal'=>$nominal, 'tolerance_plus'=>$tolerance_plus, 'tolerance_minus'=>$tolerance_minus, 'test_procedure'=>$test_procedure, 'test_procedure_id'=>$test_procedure_id, 'equipment'=>$equipment, 'equipment_id'=>$equipment_id);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

		if(isset($_REQUEST['getCompInfo']))  {
			$id_part =  $_REQUEST['id'];
			$query = "SELECT `revision`, `part_number`, `division`, `finish_good`, `description`, `material`, `image1`, `drawing2d`, `drawing3d`, `addImages`, `add_spec` FROM bb_components WHERE `id` = ".$id_part;
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($revision, $part_number, $division, $finish_good, $description, $material, $image1, $drawing2d, $drawing3d, $addImages, $add_spec);
	        while ($stmt->fetch()){
	        	$Model[]= array('revision'=>$revision, 'part_number'=>$part_number, 'division'=>$division, 'description'=>$description, 'material'=>$material, 'image1'=>$image1, 'drawing2d'=>$drawing2d, 'drawing3d'=>$drawing3d, 'addImages'=>$addImages, 'add_spec'=>$add_spec, 'finish_good'=>$finish_good);
	        }
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

		if(isset($_REQUEST['getQTY']))  {
			$id_row =  $_REQUEST['id_row'];
			$query = "SELECT `qty`  FROM `bb_ppap_test_plan` WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" .$id_row.")";
			//echo $query;
			if ($stmt = $db->prepare($query)) {
					$stmt->execute();
					$stmt->bind_result($qty);
					$stmt->fetch();
					$stmt->close();
			$Model = array('qty'=>$qty);
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}
if(isset($_REQUEST['getDescription'])) {
	    	$Model = array();
		    if($_REQUEST['query']){
		        $query = "SELECT DISTINCT(`description`) FROM bb_components WHERE `description` LIKE '%".$_REQUEST['query']."%' ORDER BY `id` ASC;";
		    } else {
		        $query = "SELECT DISTINCT(`description`) FROM bb_components ORDER BY `description` ASC";
		    }
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($description);
	        while ($stmt->fetch()){
				$Model[]= array('description'=>$description);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

		if(isset($_REQUEST['getDimensionName'])){
			if($_REQUEST['query']&&!$_REQUEST['description']){
				$query = "SELECT DISTINCT(`dimension_name`) FROM `bb_dimensional_attributes` WHERE `dimension_name` LIKE '%".$_REQUEST['query']."%'";
			}
			elseif($_REQUEST['query']&&$_REQUEST['description']){
				$query = "SELECT DISTINCT(`dimension_name`) 
						FROM `bb_dimensional_attributes` da
						INNER JOIN `bb_components` c ON c.`id` = da.`component_id`
						WHERE `dimension_name` LIKE '%".$_REQUEST['query']."%' AND `description` = '".$_REQUEST['description']."'";
			}
			elseif(!$_REQUEST['query']&&$_REQUEST['description']){
				$query = "SELECT DISTINCT(`dimension_name`) 
						FROM `bb_dimensional_attributes` da
						INNER JOIN `bb_components` c ON c.`id` = da.`component_id`
						WHERE `description` = '".$_REQUEST['description']."'";
			}
			else {
				$query = "SELECT DISTINCT(`dimension_name`) FROM `bb_dimensional_attributes`";
			}

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($dimension_name);
	        while ($stmt->fetch()){
				$Model[]= array('dimension_name'=>$dimension_name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

		if(isset($_REQUEST['getValueDesc']))  {
			if($_REQUEST['query']&&!$_REQUEST['description']){
				$query = "SELECT DISTINCT(`value_desc`) FROM `bb_functional_attributes` WHERE `value_desc` LIKE '%".$_REQUEST['query']."%'";
			}
			elseif($_REQUEST['query']&&$_REQUEST['description']){
				$query = "SELECT DISTINCT(`value_desc`) 
						FROM `bb_functional_attributes` fa
						INNER JOIN `bb_components` c ON c.`id` = fa.`component_id`
						WHERE `value_desc` LIKE '%".$_REQUEST['query']."%' AND `description` = '".$_REQUEST['description']."'";
			}
			elseif(!$_REQUEST['query']&&$_REQUEST['description']){
				$query = "SELECT DISTINCT(`value_desc`) 
						FROM `bb_functional_attributes` fa
						INNER JOIN `bb_components` c ON c.`id` = fa.`component_id`
						WHERE `description` = '".$_REQUEST['description']."'";
			}
			else {
				$query = "SELECT DISTINCT(`value_desc`) FROM `bb_functional_attributes`";
			}

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($value_desc);
	        while ($stmt->fetch()){
				$Model[]= array('value_desc'=>$value_desc);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

if(isset($_REQUEST['getBOMComponents']))  {
            $idx = "";
            if($_REQUEST['bom']){
                $id_comp= json_decode(stripcslashes($_REQUEST['bom']));
            }elseif($_REQUEST['bbb_sku']){
                $bbb_sku =  $_REQUEST['bbb_sku'];
                $query = "SELECT `component_id`, `qty`, `ppap`, `in_house`, `out_source`, `reuse_from_core`,`task_type`, `ppap_task_id`  
                FROM bb_bom_components bc
                WHERE `bom_id` = (SELECT `id` FROM `bb_bom` WHERE `bbb_sku_id` =".$bbb_sku." ORDER BY `revision` DESC LIMIT 1)";
                if ($stmt = $db->prepare($query)) {
                    $stmt->execute();
                    $stmt->bind_result($component_id, $qty, $ppap, $in_house, $out_source, $reuse_from_core, $task_type, $ppap_task_id);
                    while ($stmt->fetch()){
                        $id_comp[]= array('id'=>$component_id, 'qty'=>$qty, 'ppap'=>$ppap, 'in_house'=>$in_house, 'out_source'=>$out_source, 'reuse_from_core'=>$reuse_from_core, 'task_type'=>$task_type, 'ppap_task_id'=>$ppap_task_id, 'ppap_result'=>$ppap_result);
                    }
                    $stmt->close();

                }
            }
            $qty = array();
            $ppap= array();
            $in_house = array();
            $out_source = array();
            $reuse_from_core = array();
            $ppap_task_id = array();
            $ppap_result = array();

            for ($i=0; $i < count($id_comp); $i++) {
                $id_comp[$i] = (array)$id_comp[$i];
                //print_r($id_comp[$i]);
                $idx .=$id_comp[$i]['id'].",";
                $qty["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['qty'];
                $ppap["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['ppap'];
                $in_house["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['in_house'];
                $out_source["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['out_source'];
                $reuse_from_core["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['reuse_from_core'];
                $ppap_task_id["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['ppap_task_id'];
                $ppap_result["'".$id_comp[$i]['id']."'"] = $id_comp[$i]['ppap_result'];

            }
            //print_r($qty);
            $idx = "(".substr($idx, 0, -1).")";
            //if(count($id_comp))
            $query = "SELECT `id`, `finish_good`, `comp_type`, `description`, `part_number`, `revision`, `image1`, `add_spec`, `drawing2d`, `drawing3d`, `create_date`, `comp_status`  FROM bb_components WHERE `id` IN ".$idx;
            //echo $query;
            if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($id, $finish_good, $comp_type, $description, $part_number, $revision, $image1, $add_spec, $drawing2d, $drawing3d, $create_date, $comp_status);
            while ($stmt->fetch()){
                $Model[]= array('id'=>$id, 'finish_good'=>$finish_good, 'comp_type'=>$comp_type, 'description'=>$description, 'part_number'=>$part_number, 'revision'=>$revision, 'qty'=>$qty["'".$id."'"], 'ppap'=>$ppap["'".$id."'"],'image1'=>$image1, 'in_house'=>$in_house["'".$id."'"], 'out_source'=>$out_source["'".$id."'"], 'reuse_from_core'=>$reuse_from_core["'".$id."'"], 'add_spec'=>$add_spec, 'drawing2d'=>$drawing2d, 'drawing3d'=>$drawing3d, 'ppap_task_id'=>$ppap_task_id["'".$id."'"], 'ppap_result'=>$ppap_result["'".$id."'"], 'create_date'=>$create_date, 'ppap_result'=>$comp_status);
            }
            $stmt->close();
            echo'{rows:'.json_encode($Model).'}';
            }else{ echo '{"success":false,"message":""}'; }
            $db->close();
            exit;
        }

	if(isset($_REQUEST['getBOMDescription'])){
        $query = "SELECT bs.`id` AS `sku_id`, `name` AS `sku_name`, `ProductLine`, `ProductType`, `revision`, `create_date`, `last_mod`, `sku_status`, b.`id`  AS `bom_id` 
                FROM bb_bbb_sku bs
                INNER JOIN `bb_bom` b ON bs.`id` = b.`bbb_sku_id`
                WHERE bs.`id` = ".$_REQUEST['id_sku']."
                ORDER BY `revision` DESC
                LIMIT 1";
        if($stmt = $db->query($query)){
        while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                $result[] = $tmp;
        }               
        $stmt->close();
        echo json_encode($result[0]);
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
    }

	if(isset($_REQUEST['downloadFile'])){
		if(isset($_REQUEST['doc'])) $File = "../files/".$_REQUEST['file'];
			else $File = "../files/docs/".$_REQUEST['file'];
	     if (file_exists($File)) {
	        header('Content-Description: File Transfer');
	        header('Content-Type: application/octet-stream');
	        header('Content-Disposition: attachment; filename='.basename($File));
	        header('Content-Transfer-Encoding: binary');
	        header('Expires: 0');
	        header('Cache-Control: must-revalidate');
	        header('Pragma: public');
	        header('Content-Length: ' . filesize($File));
	        ob_clean();
	        flush();
	        readfile($File);
	    	}
		exit;
	}

if(isset($_REQUEST['getMaterials'])) {
		if($_REQUEST['query']&&!$_REQUEST['description']){
		        $query = "SELECT DISTINCT(`material`) FROM bb_components WHERE `material` LIKE '%".$_REQUEST['query']."%' ORDER BY `id` ASC;";
		    } elseif($_REQUEST['description']&&(!$_REQUEST['query']||$_REQUEST['query']==""))  {
		        $query = "SELECT DISTINCT(`material`) FROM bb_components WHERE `description` LIKE '%".$_REQUEST['description']."%' ORDER BY `id` ASC;";
		    }
		    elseif($_REQUEST['query']!=""&&$_REQUEST['description']){
		    	$query = "SELECT DISTINCT(`material`) FROM bb_components WHERE `description` LIKE '%".$_REQUEST['description']."%' AND `material` LIKE '".$_REQUEST['query']."'";
		    }
		    else {
		    	$query = "SELECT DISTINCT(`material`) FROM bb_components";
		    }

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($name);
	        while ($stmt->fetch()){
				$Model[]= array('name'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

    if(isset($_REQUEST['getDataSelect']))  {
            $where = "";
            $result = array();
            if($_REQUEST['description']) {
                $where .=" `description` = '".$_REQUEST['description']."' ";
            }
            
            if($_REQUEST['material']) {
                if($where !="") $where .=" AND `material` = '".$_REQUEST['material']."' ";
                    else $where .="`material` = '".$_REQUEST['material']."' ";
            }

            if($_REQUEST['division']) {
                if($where !="") $where .=" AND `division` = '".$_REQUEST['division']."' ";
                    else $where .="`division` = '".$_REQUEST['division']."' ";
            }

            if($where !=""){
                $query = "SELECT `id`, `part_number` FROM bb_components WHERE ".$where;
            }
            else {
                $query = "SELECT `id`, `part_number` FROM bb_components";
            }

            if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($id, $part_number);
            while ($stmt->fetch()){
                $parts[]= array('id'=>$id, 'part_number'=>$part_number);
                }
            $stmt->close();
            }

            if(count($parts)>0){
                if($_REQUEST['dim_attr']) {
                    $dim_attr = $_REQUEST['dim_attr'];
                }
                
                if($_REQUEST['func_attr']) {
                    $func_attr = $_REQUEST['func_attr'];
                }

                if($dim_attr||$func_attr){
                    if($_REQUEST['deviation']) {
                        $deviation = (int)$_REQUEST['deviation']/100;
                    }else {
                        $deviation = null;
                    }
                
                    $parts=selectAttrTables($dim_attr, $func_attr, $parts, $deviation);
                    $result = array('success'=>true, 'result'=>json_encode($parts), 'count'=>count($parts));
                }
                else {
                    $result = array('success'=>true, 'result'=>json_encode($parts), 'count'=>count($parts));
                }
            }
            else {
                $result = array('success'=>true, 'result'=>null, 'count'=>0);
            }

        echo json_encode($result);
        $db->close();
        exit;
    }

	if(isset($_REQUEST['getToolGageInfo'])) {
			$id = $_REQUEST['id'];
		        $query = "SELECT `id`, `tool_gage`, `description`, `instruction` FROM bb_tool_gage WHERE `id` = ".$id."";

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id, $tool_gage, $description, $instruction);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id, 'tool_gage'=>$tool_gage, 'description'=>$description, 'file'=>$instruction);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

	if(isset($_REQUEST['getTestProcedureInfo'])) {
			$id = $_REQUEST['id'];
		        $query = "SELECT `id`, `test_procedure`, `spec_conditions`, `description`, `instruction` FROM bb_test_procedure WHERE `id` = ".$id."";

			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id, $test_procedure, $spec_conditions, $description, $instruction);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id, 'test_procedure'=>$test_procedure, 'description'=>$description, 'file'=>$instruction);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

	if(isset($_REQUEST['SendToOutsourcer'])) {
			$task = $_REQUEST['task'];
			$email = $_REQUEST['email'];
			//$email = 'tur-slv@ukr.net';
		      
			$hash = md5(microtime());
			$query = "UPDATE bb_ppap_test_plan SET `hash` = '".$hash."' WHERE `idx` = ".$task."";
			if (!$result = $db->query($query)){
		        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
		        exit;
		    }
		    else {
		    	$path = substr($_SERVER['PHP_SELF'],0,strrpos($_SERVER['PHP_SELF'],"/"));
			$link = "<a href='http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?task=".$task."&hash=".$hash."'>http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?task=".$task."&hash=".$hash."</a>";
			$subject = "PPAP Test Plan";
			$headers = "From: \"web\" <bbbinfo@vvtrack.com>\r\n"."Content-Type: text/html; charset=\"utf-8\"\r\n";
			if(smtpmail($email, $subject, $link, $headers)) {
				echo '{"success":true,"message":"'.$answers['mail_sent'].$link.'"}';
				}
				else echo '{"success":false,"message":"'.$answers['mail_no_send'].'"}';
		    }
			$db->close();
			exit;
		}
		
	if(isset($_REQUEST['savePPAPOut'])) {
		$finish = $_REQUEST['fg'];
		if(!$finish) $table = 'bb_ppap_review';
        	else $table = "bb_ppap_finished_good_review";

		$VALUES['outsource_name'] = $_REQUEST['name'];
		$VALUES['outsource_date'] = $_REQUEST['test_date'];
		$VALUES['dim_test'] = $_REQUEST['dim_test'];
		$VALUES['func_test'] = $_REQUEST['func_test'];
		$VALUES['outsource_draft'] = $_REQUEST['draft_id'];
		$task_id = $_REQUEST['task_id'];
		$where = "`idx` = ".$task_id."";
		
		if(em_update($table, $VALUES, $where)){
			echo '{"success":true,"message":""}';
			}
			else echo '{"success":false,"message":"'.$answers['data_not_saved'].'"}';
	    exit;
	}

if(isset($_REQUEST['tool_gage']))  {
		$action = $_REQUEST['action'];
		$VALUES['drawing2d'] = $_REQUEST['drawing2d'];
		$VALUES['drawing3d'] = $_REQUEST['drawing3d'];
		$VALUES['addImages'] = $_REQUEST['addImages'];
		$VALUES['add_spec'] = $_REQUEST['add_spec'];
		$VALUES['tool_gage_type'] = $_REQUEST['tool_gage_type'];
		$VALUES['name'] = $_REQUEST['name'];
		$VALUES['description'] = $_REQUEST['description'];
		$VALUES['life_time'] = $_REQUEST['life_time'];
		$VALUES['pending_design'] = $_REQUEST['pending_design'];
		$number = trim($_REQUEST['number']) ? trim($_REQUEST['number']) : "Temporary id: ".date("Y-m-d H:i:s", time());
		$VALUES['estimated_unit_price'] = $_REQUEST['estimated_unit_price'];

		if($action=='add'){
			$query = "SELECT COUNT(*) FROM `bb_tool_gage` WHERE `number` = ".$number;
			if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($count);
	            $stmt->fetch();
	            $stmt->close();
	        }
	        if($count==0){
	        	$VALUES['number'] = $number;
	        	$id = em_insert('bb_tool_gage', $VALUES);
	        	if($id) {
	        		$toolArr = array();
	        		$query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.",1);";
		            if ($stmt = $db->prepare($query)) {
		                if ($stmt->execute()) {
		                    $last_order = $db->insert_id;
		                    $stmt->close();
		                }
		            }
                    $code = stripslashes(getPreScript(21));
                    eval($code);
			        $toolArr['RequestID'] = $last_order;
			        $toolArr['RequestedDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
                    $toolArr['AssignmentDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
			        $toolArr['id_user'] = $id_user;
			        $toolArr['tool_id'] = $id;
                    $toolArr['tool_gage_type'] = $_REQUEST['tool_gage_type'];
                    $toolArr['RequestedBy'] = $id_user;
			        $last_idx = em_insert('bb_tooling_request', $toolArr);

                    $req_id['request_number'] = $last_order;
                    em_update('bb_tool_gage', $req_id, "`number` = '$number'");

			        $order['order_id'] =$last_order;
				    $order['status'] = 1;
				    $order['task_type'] = 21;
					$order['previous_task_id'] = 0;
				    $order['outID_task'] = $last_idx;
				    $order['requested_date'] = date('Y-m-d H:i:s');
                    $order['assignment_date'] = date('Y-m-d H:i:s');
				    em_insert('bb_order_tasks', $order);

	        		$result = array("success"=>true, "message"=>$answers['task_tool_req'].$last_order);
	        	}
	        	else {
	        		$result =array("success"=>false, "message"=>$answers['data_not_saved']);
	        	}
	        }
	        else {
	        	$result =array("success"=>false, "message"=>$answers['same_numb_already']);
	        }

		}
		else {
			$id = $_REQUEST['id'];
			$where = "`id`=".$id;
			if(em_update('bb_tool_gage', $VALUES, $where)) {
				$result = array("success"=>true, "message"=>$answers['data_updated']);
			}
			else {
				$result =array("success"=>false, "message"=>$answers['data_not_updated']);
			}
		}

		echo json_encode($result);
		$db->close();
		exit;

}


	if(isset($_REQUEST['getDirectorytool_gage']))  {
		$id = $_REQUEST['id'];
	        $query = "SELECT `id`, `drawing2d`, `drawing3d`, `addImages`, `add_spec`, `tool_gage_type`, `name`, `description`, `life_time`, `pending_design`, `number`, `estimated_unit_price`, `approved`, alternative_id, request_number FROM bb_tool_gage WHERE `id` = ".$id."";

		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $drawing2d, $drawing3d, $addImages, $add_spec, $tool_gage_type, $name, $description, $life_time, $pending_design, $number, $estimated_unit_price, $approved, $alternative_id, $request_number);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'drawing2d'=>$drawing2d, 'drawing3d'=>$drawing3d, 'addImages'=>$addImages, 'add_spec'=>$add_spec, 'tool_gage_type'=>$tool_gage_type, 'name'=>$name, 'description'=>$description, 'life_time'=>$life_time, 'pending_design'=>$pending_design, 'number'=>$number, 'estimated_unit_price'=>$estimated_unit_price, 'approved'=>$statusTool[$approved], 'alternative_id'=>$alternative_id, 'request_number'=>$request_number);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['delToolGage']))  {
		$id = $_REQUEST['id'];
		$where = "`id`=".$id;
		if(em_update('bb_tool_gage', array('deleted'=>1), $where)) $result = '{"success":true,"message":"'.$answers['t_g_del'].'"}';
			else $result = '{"success":false,"message":"'.$answers['t_g_not_del'].'"}';

		echo $result;
		$db->close();
		exit;
	}


	if(isset($_REQUEST['equip']))  {
		$action = $_REQUEST['action'];
		$VALUES['drawing2d'] = $_REQUEST['drawing2d'];
		$VALUES['drawing3d'] = $_REQUEST['drawing3d'];
		$VALUES['addImages'] = $_REQUEST['addImages'];
		$VALUES['add_spec'] = $_REQUEST['add_spec'];
		$VALUES['name'] = $_REQUEST['name'];
		$VALUES['description'] = $_REQUEST['description'];
		$VALUES['life_time'] = $_REQUEST['life_time'];
		$VALUES['pending_design'] = $_REQUEST['pending_design'];
		$number = trim($_REQUEST['number']) ? trim($_REQUEST['number']) : "Temporary id: ".date("Y-m-d H:i:s", time());
		$VALUES['estimated_unit_price'] = $_REQUEST['estimated_unit_price'];

		if($action=='add'){
			$query = "SELECT COUNT(*) FROM `bb_equipment` WHERE `number` = ".$number;
			if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($count);
	            $stmt->fetch();
	            $stmt->close();
	        }
	        if($count==0){
	        	$VALUES['number'] = $number;
	        	$id = em_insert('bb_equipment', $VALUES);
	        	if($id) {
	        		$equipmentArr = array();
	        		$query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.",1);";
		            if ($stmt = $db->prepare($query)) {
		                if ($stmt->execute()) {
		                    $last_order = $db->insert_id;
		                    $stmt->close();
		                }
		            }
                    $code = stripslashes(getPreScript(41));
                    eval($code);
			        $equipmentArr['RequestID'] = $last_order;
			        $equipmentArr['RequestedDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
                    $equipmentArr['AssignmentDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
			        $equipmentArr['id_user'] = $id_user;
			        $equipmentArr['equipment_id'] = $id;
                    $equipmentArr['RequestedBy'] = $id_user;
			        $last_idx = em_insert('bb_equipment_request', $equipmentArr);

                    $req_id['request_number'] = $last_order;
                    em_update('bb_equipment', $req_id, "`number` = '$number'");

			        $order['order_id'] =$last_order;
				    $order['status'] = 1;
				    $order['task_type'] = 41;
					$order['previous_task_id'] = 0;
				    $order['outID_task'] = $last_idx;
				    $order['requested_date'] = date('Y-m-d H:i:s');
                    $order['assignment_date'] = date('Y-m-d H:i:s');
				    em_insert('bb_order_tasks', $order);
	        		$result = array("success"=>true, "message"=>$answers['task_equip_req'].$last_order);
	        	}
	        	else {
	        		$result =array("success"=>false, "message"=>$answers['data_not_saved']);
	        	}
	        }
	        else {
	        	$result =array("success"=>false, "message"=>$answers['same_numb_already']);
	        }

		}
		else {
			$id = $_REQUEST['id'];
			$where = "`id`=".$id;
			if(em_update('bb_equipment', $VALUES, $where)) {
				$result = array("success"=>true, "message"=>$answers['data_updated']);
			}
			else {
				$result =array("success"=>false, "message"=>$answers['data_not_updated']);
			}
		}

		echo json_encode($result);
		$db->close();
		exit;
}


	if(isset($_REQUEST['getDirectoryequip']))  {
		$id = $_REQUEST['id'];
	        $query = "SELECT `id`, `drawing2d`, `drawing3d`, `addImages`, `add_spec`, `name`, `description`, `life_time`, `pending_design`, `number`, `estimated_unit_price`, `approved`, alternative_id, request_number FROM bb_equipment WHERE `id` = ".$id."";

		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $drawing2d, $drawing3d, $addImages, $add_spec, $name, $description, $life_time, $pending_design, $number, $estimated_unit_price, $approved, $alternative_id, $request_number);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'drawing2d'=>$drawing2d, 'drawing3d'=>$drawing3d, 'addImages'=>$addImages, 'add_spec'=>$add_spec, 'name'=>$name, 'description'=>$description, 'life_time'=>$life_time, 'pending_design'=>$pending_design, 'number'=>$number, 'estimated_unit_price'=>$estimated_unit_price, 'approved'=>$statusTool[$approved], 'alternative_id'=>$alternative_id, 'request_number'=>$request_number);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['delEquip']))  {
		$id = $_REQUEST['id'];
		$where = "`id`=".$id;
		if(em_update('bb_equipment', array('deleted'=>1), $where)) $result = '{"success":true,"message":"'.$answers['equip_del'].'"}';
			else $result = '{"success":false,"message":"'.$answers['equip_not_del'].'"}';

		echo $result;
		$db->close();
		exit;
	}


if(isset($_REQUEST['work_st'])) {
		$action = $_REQUEST['action'];
		$VALUES['drawing2d'] = $_REQUEST['drawing2d'];
		$VALUES['drawing3d'] = $_REQUEST['drawing3d'];
		$VALUES['addImages'] = $_REQUEST['addImages'];
		$VALUES['add_spec'] = $_REQUEST['add_spec'];
		$VALUES['name'] = $_REQUEST['name'];
		$VALUES['description'] = $_REQUEST['description'];
		$VALUES['life_time'] = $_REQUEST['life_time'];
		$VALUES['pending_design'] = $_REQUEST['pending_design'];
		$number = trim($_REQUEST['number']) ? trim($_REQUEST['number']) : "Temporary id: ".date("Y-m-d H:i:s", time());
		$VALUES['estimated_unit_price'] = $_REQUEST['estimated_unit_price'];

		if($action=='add'){
			$query = "SELECT COUNT(*) FROM `bb_workstation` WHERE `number` = ".$number;
			if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($count);
	            $stmt->fetch();
	            $stmt->close();
	        }
	        if($count==0){
	        	$VALUES['number'] = $number;
	        	$id = em_insert('bb_workstation', $VALUES);
	        	if($id) {
	        		$workstArr = array();
	        		$query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.",1);";
		            if ($stmt = $db->prepare($query)) {
		                if ($stmt->execute()) {
		                    $last_order = $db->insert_id;
		                    $stmt->close();
		                }
		            }
                    $code = stripslashes(getPreScript(42));
                    eval($code);
			        $workstArr['RequestID'] = $last_order;
			        $workstArr['RequestedDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
                    $workstArr['AssignmentDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
			        $workstArr['id_user'] = $id_user;
			        $workstArr['workstation_id'] = $id;
                    $workstArr['RequestedBy'] = $id_user;
			        $last_idx = em_insert('bb_workstation_request', $workstArr);

                    $req_id['request_number'] = $last_order;
                    em_update('bb_workstation', $req_id, "`number` = '$number'");

			        $order['order_id'] =$last_order;
				    $order['status'] = 1;
				    $order['task_type'] = 42;
					$order['previous_task_id'] = 0;
				    $order['outID_task'] = $last_idx;
				    $order['requested_date'] = date('Y-m-d H:i:s');
                    $order['assignment_date'] = date('Y-m-d H:i:s');
				    em_insert('bb_order_tasks', $order);
	        		$result = array("success"=>true, "message"=>$answers['task_work_req'].$last_order);
	        	}
	        	else {
	        		$result =array("success"=>false, "message"=>$answers['data_not_saved']);
	        	}
	        }
	        else {
	        	$result =array("success"=>false, "message"=>$answers['same_numb_already']);
	        }

		}
		else {
			$id = $_REQUEST['id'];
			$where = "`id`=".$id;
			if(em_update('bb_workstation', $VALUES, $where)) {
				$result = array("success"=>true, "message"=>$answers['data_updated']);
			}
			else {
				$result =array("success"=>false, "message"=>$answers['data_not_updated']);
			}
		}

		echo json_encode($result);
		$db->close();
		exit;
}

	if(isset($_REQUEST['getDirectorywork_st']))  {
		$id = $_REQUEST['id'];
	        $query = "SELECT `id`, `drawing2d`, `drawing3d`, `addImages`, `add_spec`, `name`, `description`, `life_time`, `pending_design`, `number`, `estimated_unit_price`, `approved`, `alternative_id`, `request_number` FROM bb_workstation WHERE `id` = ".$id."";

		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $drawing2d, $drawing3d, $addImages, $add_spec, $name, $description, $life_time, $pending_design, $number, $estimated_unit_price, $approved, $alternative_id, $request_number);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'drawing2d'=>$drawing2d, 'drawing3d'=>$drawing3d, 'addImages'=>$addImages, 'add_spec'=>$add_spec, 'name'=>$name, 'description'=>$description, 'life_time'=>$life_time, 'pending_design'=>$pending_design, 'number'=>$number, 'estimated_unit_price'=>$estimated_unit_price, 'approved'=>$statusTool[$approved], 'alternative_id'=>$alternative_id, 'request_number'=>$request_number);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['delWorkSt']))  {
		$id = $_REQUEST['id'];
		$where = "`id`=".$id;
		if(em_update('bb_workstation', array('deleted'=>1), $where)) $result = '{"success":true,"message":"'.$answers['work_del'].'"}';
			else $result = '{"success":false,"message":"'.$answers['work_not_del'].'"}';

		echo $result;
		$db->close();
		exit;
	}

if(isset($_REQUEST['saveOperational'])) {
		$msg="";
		$id_arr = array();
		$out_msg= array();
		$action = $_REQUEST['action'];
		$VALUES['operation_procedure'] = $_REQUEST['operation_procedure'];
        $VALUES['descriptionOperation'] = $_REQUEST['descriptionOperation'];
		$tools = $_REQUEST['tools'];
		$gages = $_REQUEST['gages'];
		$workstations = $_REQUEST['workstations'];
		$equipments = $_REQUEST['equipments'];
		$VALUES['files'] = $_REQUEST['files'];
		$VALUES['number'] = $_REQUEST['number'];

		$data = array('tool'=>$tools, 'gage'=>$gages, 'equipment'=>$equipments, 'workstation'=>$workstations);
		$check_result = checkOperation($data);

		if($check_result['success']===true){
			for($i=0;$i<count($check_result['result']); $i++){
				$temp = $check_result['result'][$i];
				$msg .= "No: <b>".$temp['number']."</b>; Name: <b>".$temp['operation_procedure']."</b><br>";
				$id_arr[] = $temp['id'];
			}
			$out_msg =array("success"=>false, "message"=>$answers['operation_with_same'].$msg);
		}
        
		if($action=='add'){
			if($check_result['success']===true){
				$result = $out_msg;
			}
			else{
				$query = "SELECT COUNT(*) FROM `bb_operations` WHERE `number` = '".$VALUES['number']."'";
				if ($stmt = $db->prepare($query)) {
		            $stmt->execute();
		            $stmt->bind_result($count);
		            $stmt->fetch();
		            $stmt->close();
		        }
		        if($count==0){
		        	$id = em_insert('bb_operations', $VALUES);
		        	setDirectory($tools, 'tool', $id);
					setDirectory($gages, 'gage', $id);
					setDirectory($workstations, 'workstation', $id);
					setDirectory($equipments, 'equipment', $id);
					$result = array("success"=>true, "message"=>$answers['data_saved'], "id_op"=>$id, "proc_number"=>$VALUES['number'], "operation_procedure"=>$VALUES['operation_procedure'], 'descriptionOperation'=>$VALUES['descriptionOperation']);
		        }
		        else {
		        	$result =array("success"=>false, "message"=>$answers['oper_numb_already']);
		        }
			}
		}
		else {
			$id = $_REQUEST['operation_id'];
			if($check_result['success']===true&&in_array($id, $id_arr)){
				$where = "`id`=".$id;
				if(em_update('bb_operations', $VALUES, $where)) {
					updateDirectory($tools, 'tool');
					updateDirectory($gages, 'gage');
					updateDirectory($workstations, 'workstation');
					updateDirectory($equipments, 'equipment');
					$result = array("success"=>true, "message"=>$answers['data_updated'], "id_op"=>$id, "proc_number"=>$VALUES['number'], "operation_procedure"=>$VALUES['operation_procedure'], 'descriptionOperation'=>$VALUES['descriptionOperation']);
				}
				else {
					$result =array("success"=>false, "message"=>$answers['data_not_updated']);
				}
			}
			elseif($check_result['success']===true&&!in_array($id, $id_arr)){
					$result = $out_msg;
				}
				else {
					$result = array("success"=>false, "message"=>$answers['change_critical_par'], "critical"=>true);
				}
		}

		echo json_encode($result);
		$db->close();
		exit;

}

if(isset($_REQUEST['getOperationData']))  {
        $id = $_REQUEST['id'];
        $result = selectOperationData($id, "");
        if($result['success']===true){
            $Model = $result['result'];
            echo json_encode($Model);
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
    }

	if(isset($_REQUEST['delOperation']))  {
		$id = $_REQUEST['id'];
		$where = "`id`=".$id;
		if(em_update('bb_operations', array('deleted'=>1), $where)) $result = '{"success":true,"message":"'.$answers['oper_del'].'"}';
			else $result = '{"success":false,"message":"'.$answers['oper_not_del'].'"}';
		echo $result;
		exit;
	}

	if(isset($_REQUEST['getDirInfo']))  {
		$table = $_REQUEST['dir'];
		if($table =='tool' || $table=='gage') $table = 'tool_gage';
		$id = $_REQUEST['id'];
	        $query = "SELECT `id`, `number`, `description`, `name`, `pending_design`, `life_time`, `estimated_unit_price`, `approved` FROM bb_".$table." WHERE `id` = ".$id."";

		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $number, $description, $name, $pending_design, $life_time, $estimated_unit_price, $approved);
        while ($stmt->fetch()){
			$Model[]= array('description'=>$description, 'name'=>$name, 'pending_design'=>$pending_design, 'life_time'=>$life_time, 'number'=>$number, 'estimated_unit_price'=>$estimated_unit_price, 'approved'=>$approved);
			$Model[0][$_REQUEST['dir'].'_id'] = $id;
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

if(isset($_REQUEST['getProcessData']))  {
        $id = $_REQUEST['id'];
        $new_process = false;
        if(isset($_REQUEST['request_id'])){
            $request_id = $_REQUEST['request_id'];
        }
        else {
            $new_process = true;
            $request_id = null;
        }

        $Model = getProcessContent($id);
        $count_m = count($Model);
        if($count_m>0){
        for($i=0; $i<$count_m; $i++){
            $result = selectOperationData($Model[$i]['id_op'], $request_id, $Model[$i]['op_number']);
            if($result['success']===true){
                $data = $result['result'][0];
                $Model[$i]['files'] = $data['files'];
                $Model[$i]['approved'] = $data['approved'];
                $Model[$i]['descriptionOperation'] = $data['descriptionOperation'];
                $Model[$i]['tool'] = $data['tools'];
                $Model[$i]['gage'] = $data['gages'];
                $Model[$i]['equip'] = $data['equipments'];
                $Model[$i]['work_st'] = $data['workstations'];
            }
        }
        echo'{rows:'.json_encode($Model).'}';
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
    }

	if(isset($_REQUEST['getDraftProcessData']))  {
	       /* $query = "SELECT `bbb_sku_id`, bs.`name`, `create_date`, COUNT(*), `process_id` 
                        FROM `bb_process_flow` pf
						INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
						INNER JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
                        WHERE `deleted` = 0
						GROUP BY `process_id`";*/
		$query = "SELECT `bbb_sku_id`, bs.`name`, `create_date`, COUNT(*), pf.`id` AS `process_id` 
                    FROM `bb_process_flow` pf
                    INNER JOIN `bb_bbb_sku` bs ON `bbb_sku_id`= bs.`id`
                    INNER JOIN `bb_process_flow_content` pfc ON pfc.`process_id` = pf.`id`
                    WHERE `deleted` = 0
                    GROUP BY pfc.`process_id`";

        if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($bbb_sku_id, $bbb_sku, $create_date, $count, $process_id);
        while ($stmt->fetch()){
			$Model[]= array('bbb_sku_id'=>$bbb_sku_id, 'bbb_sku'=>$bbb_sku, 'create_date'=>$create_date, 'count'=>$count, 'process_id'=>$process_id);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}


	if(isset($_REQUEST['getProjectElements']))  {
		$project_id = $_REQUEST['id'];
		$request_id = $_REQUEST['request_id'];
		if(isset($_REQUEST['capex'])) {
			$capex = $_REQUEST['capex'];
		}
		else {
			$capex = null;
		}
		
	    $query1 = "SELECT o.`id` AS `op_id`, `tool_id` AS `el_id`, tg.`number`, ot.`qty`, tg.`name`, tg.`life_time`, tg.`description`, o.`number` AS `op_number`, `operation_number`
			FROM bb_operations o
			INNER JOIN `bb_process_flow_content` pfc ON pfc.`operation_id` = o.`id`
			INNER JOIN `bb_operation_tool` ot ON ot.`operation_id` = o.`id`
			INNER JOIN `bb_tool_gage` tg ON tg.`id` = `tool_id`
			WHERE pfc.`process_id` = ".$project_id;
		$i=0;
		$rows = em_query($query1);
		while ($result = $rows->fetch_array(MYSQL_ASSOC)){
			$tool[$i] = $result;
			$tool[$i]['el_type'] = 1;
			$i++;
		}
		if(count($tool)>0){
			$tool=addProjectData($tool, 'tool', $request_id, $capex);
			$Model = $tool;
		} 
		
		$query2 = "SELECT o.`id` AS `op_id`, `gage_id` as `el_id`, tg.`number`, og.`qty`, tg.`name`, tg.`life_time`, tg.`description`, o.`number` as `op_number`, `operation_number`
					FROM bb_operations o
					INNER JOIN `bb_process_flow_content` pfc ON pfc.`operation_id` = o.`id`
					INNER JOIN `bb_operation_gage` og ON og.`operation_id` = o.`id`
					INNER JOIN `bb_tool_gage` tg ON tg.`id` = `gage_id`
					WHERE pfc.`process_id` = ".$project_id;
		$i=0;
		$rows = em_query($query2);
		while ($result = $rows->fetch_array(MYSQL_ASSOC)){
			$gage[$i] = $result;
			$gage[$i]['el_type'] = 2;
			$i++;
		}
		
		if(count($gage)>0){
			$gage=addProjectData($gage, 'gage', $request_id, $capex);
			$Model = array_merge($Model, $gage);
		} 

		$query3 = "SELECT o.`id` AS `op_id`, `equipment_id` AS `el_id`, e.`number`, oe.`qty`, e.`name`, e.`life_time`, e.`description`, o.`number` as `op_number`, `operation_number`
					FROM bb_operations o
					INNER JOIN `bb_process_flow_content` pfc ON pfc.`operation_id` = o.`id`
					INNER JOIN `bb_operation_equipment` oe ON oe.`operation_id` = o.`id`
					INNER JOIN `bb_equipment` e ON e.`id` = `equipment_id`
					WHERE pfc.`process_id` = ".$project_id;
		$i=0;
		$rows = em_query($query3);
		while ($result = $rows->fetch_array(MYSQL_ASSOC)){
			$equipment[$i] = $result;
			$equipment[$i]['el_type'] = 3;
			$i++;
		}

		if(count($equipment)>0){
			$equipment=addProjectData($equipment, 'equipment', $request_id, $capex);
			$Model = array_merge($Model, $equipment);
		}

		$query4 = "SELECT o.`id` AS `op_id`, `workstation_id` AS `el_id`, w.`number`, ow.`qty`, w.`name`, w.`life_time`, w.`description`, o.`number` as `op_number`, `operation_number`
					FROM bb_operations o
					INNER JOIN `bb_process_flow_content` pfc ON pfc.`operation_id` = o.`id`
					INNER JOIN `bb_operation_workstation` ow ON ow.`operation_id` = o.`id`
					INNER JOIN `bb_workstation` w ON w.`id` = `workstation_id`
					WHERE pfc.`process_id` =  ".$project_id;
		$i=0;
		$rows = em_query($query4);
		while ($result = $rows->fetch_array(MYSQL_ASSOC)){
			$workstation[$i] = $result;
			$workstation[$i]['el_type'] = 4;
			$i++;
		}

		if(count($workstation)>0){
			$workstation=addProjectData($workstation, 'workstation', $request_id, $capex);
			$Model = array_merge($Model, $workstation);
		}

		echo'{rows:'.json_encode($Model).'}';
		$db->close();
		exit;
	}

if(isset($_REQUEST['resendEmail'])) {
        $RequestID = $_REQUEST['RequestID'];
        $id_part_number = $_REQUEST['id_part_number'];
        $idx = $_REQUEST['idx'];
        $email = $_REQUEST['email'];
        $query = "SELECT `finish_good` FROM `bb_components` WHERE `id` = ".$id_part_number;
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($finish_good);
                $stmt->fetch();
                $stmt->close();
            }
        
        $path = substr($_SERVER['PHP_SELF'],0,strrpos($_SERVER['PHP_SELF'],"/"));
        if($finish_good==1){
            $table='bb_ppap_finished_good_review';
            $get = "fg=true&";
        }
        else {
            $table='bb_ppap_review';
            $get = "";
        }

        $query = "SELECT `hash` FROM ".$table." WHERE `idx` = ".$idx;
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($hash);
                $stmt->fetch();
                $stmt->close();
            }

        em_update($table, array('email'=>$email), " `idx` = ".$idx);
        
        //$link = "<a href='http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?".$get."task=".$idx."&hash=".$hash."'>http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?".$get."task=".$idx."&hash=".$hash."</a>";
        $link = "<b><p>PPAP TEST OUT has been sent to you Request ID: ".$RequestID."</p></b></br></br><a href='http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?".$get."task=".$idx."&hash=".$hash."' style='text-decoration: none;'><b><span style='font-size: 16px; color: #000;'></br></br> <b><span style='color: #fff; display: block; padding: 6px; background: #4169E1; text-align: center; border: 2px solid #000; border-radius: 5px;'>GO TO TASK</span></b></a>";
        $subject = "PPAP Test Plan";
        $headers = "From: \"web\" <bbbinfo@vvtrack.com>\r\n"."Content-Type: text/html; charset=\"utf-8\"\r\n";
        //$email = 'vyacheslav.tur@innotech-ua.com';
        if(smtpmail($email, $subject, $link, $headers)) {
            echo '{"success":true, "message":"'.$answers['email_sent'].'"}';
            }
            else {
                echo '{"success":false,"message":"'.$answers['email_no_sent'].'"}';
            }
        $db->close();
        exit;
    }

if(isset($_REQUEST['searchOperation'])) {
     $data = array();
    if(isset($_REQUEST['tools'])){
        $data['tool'] = $_REQUEST['tools'];
    }

    if(isset($_REQUEST['gages'])){
        $data['gage'] = $_REQUEST['gages'];
    }
    if(isset($_REQUEST['workstations'])){
        $data['workstation'] = $_REQUEST['workstations'];
    }
    if(isset($_REQUEST['equipments'])){
        $data['equipment'] = $_REQUEST['equipments'];
    }

    $check_result = searchOperation($data);
    if($check_result['success']){
        echo '{"success":true, "count":'.count($check_result['result']).', "operations": '.json_encode($check_result['result']).'}';
    }
    else {
        echo '{"success":false, "count":"0"}';
    }
    exit;
}

if(isset($_REQUEST['getOperationNumber'])) {
 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
  $query = "SELECT `id`, `number` FROM `bb_operations`  WHERE `deleted` = 0 ORDER BY `number`";
 }else{
  $query = "SELECT `id`, `number` FROM `bb_operations` WHERE `deleted` = 0 AND `number` LIKE '%".$_REQUEST['query']."%'  ORDER BY `number`";
  }
 
 if($stmt = $db->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($id,$number);
    while ($stmt->fetch()){
        $Model[]= array('id'=>$id,'value'=>$number);
    }
    $stmt->close();
    echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getTaskInfo'])) {
    $task_id = $_REQUEST['task_id'];
$query = "SELECT `task_type` AS `type_id`,  `tasks_type` AS `type_name`
                FROM `bb_order_tasks` ot
                INNER JOIN `bb_tasks_type` tt ON tt.`id` = ot.`task_type`
                WHERE `task_id` = ".$task_id;
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($type_id, $type_name);
                $stmt->fetch();
                $stmt->close();
    $result = array("success"=>true, 'type_id'=>$type_id, 'type_name'=>$type_name);
    echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['dd_competitor'])){
    $query = "SELECT `idx`, `RequestID` FROM `bb_due_diligence` WHERE `competitor` IS NULL";
    if($stmt = $db->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($idx,$RequestID);
    while ($stmt->fetch()){
        $tasks_comp[]= array('idx'=>$idx,'RequestID'=>$RequestID);
    }
    $stmt->close();
    }

    for($i=0; $i<count($tasks_comp); $i++){
        $query = "SELECT competitor, competitor_cross_ref, competitor_market_price, MarketPriceDate, competitor_core_price, CorePriceDate FROM bb_due_competitor  WHERE `RequestID`= ".$tasks_comp[$i]['RequestID'];
            $stmt = $db->query($query);
            while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result[] = array('name'=>$tmp['competitor'], 'cross_ref'=>$tmp['competitor_cross_ref'],'market_price'=>$tmp['competitor_market_price'],'market_price_date'=>$tmp['MarketPriceDate'],'comp_core_price'=>$tmp['competitor_core_price'],'comp_core_price_date'=>$tmp['CorePriceDate']);
            }               
            $stmt->close();
            if ($result){
                $str =  stripcslashes(json_encode($result));
                $query = "UPDATE `bb_due_diligence` SET `competitor` = '".$str."' WHERE `idx` =".$tasks_comp[$i]['idx'];
                em_query($query);
            }
    }
$db->close();
exit;                
}

if(isset($_REQUEST['getCompContent']))  {
    $comp_id =  $_REQUEST['comp_id'];
    $dim =  array();
    $func = array();
    $query = "SELECT * FROM `bb_components` WHERE `id` = ".$comp_id;
    if($tmp = em_query($query)){
    $result = $tmp->fetch_assoc();
    $tmp->close();

    if(preg_match("/[124]/", $result['comp_type'])){
        $query = "SELECT * FROM `bb_dimensional_attributes`  WHERE `component_id` = ".$result['id']." ORDER BY `id`";
        if($stmt = em_query($query)){
            while($tmp_dim = $stmt->fetch_array(MYSQL_ASSOC)){
                $dim[] = $tmp_dim;
            }
            $stmt->close();
            if(count($dim)>0){
                $result['dim_attr'] = $dim;
            }
        }

        $query = "SELECT * FROM `bb_functional_attributes`  WHERE `component_id` = ".$result['id']." ORDER BY `id`";
        if($stmt = em_query($query)){
            while($tmp_func = $stmt->fetch_array(MYSQL_ASSOC)){
                $func[] = $tmp_func;
            }
            $stmt->close();
            if(count($func)>0){
                $result['func_attr'] = $func;
            }
        }
        if(preg_match("/[12]/", $result['comp_type'])){
            if($result['comp_type']==2){
                $table="bb_ppap_review";
                $task_type = 36;
            }
            elseif($result['comp_type']==1){
                $table="bb_ppap_finished_good_review";
                $task_type = 40;
            }
        
            $query= "SELECT `task_id`, `idx`, `RequestID` AS `request_id`, `requested_date`, `completion_date`, u.name AS `assigned_to`, us.name AS `responsible`, `rejected` AS `ppap_result` 
                        FROM `".$table."` pr
                        INNER JOIN `bb_order_tasks` ot ON pr.`idx` = ot.`outID_task`
                        LEFT JOIN bb_users u ON assignee = u.id
                        LEFT JOIN bb_users us ON assigned_by = us.id
                        WHERE `id_part_number` = ".$comp_id." AND `task_type` = ".$task_type;
            if($stmt = em_query($query)){
                while($tmp_ppap = $stmt->fetch_array(MYSQL_ASSOC)){
                    $tmp_ppap['task_type'] = $task_type;
                    $tmp_ppap['task_type_name'] =  $tasks[$task_type];
                    $ppap[] = $tmp_ppap;
                }
                $stmt->close();
                if(count($ppap)>0){
                    $result['ppap_results'] = $ppap;
                }
            }
        }
    }
    elseif($result['comp_type']==3){
        $ids = "";
        $query = "SELECT GROUP_CONCAT(`kit_part_id`) FROM `bb_kit_content` kt WHERE `component_id` = ".$comp_id;
          if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($ids);
                $stmt->fetch();
                $stmt->close();
            } 

        if($ids&&$ids!=""){
            $query = "SELECT c.`id`, `part_number`, kt.`qty`, `description`, `image1`, `addImages`, `drawing2d`,  `drawing3d`, `comp_type`  FROM `bb_kit_content`  kt 
            INNER JOIN `bb_components` c ON c.`id` =kt.`kit_part_id`
            WHERE c.`id` IN (".$ids.")";
            if($stmt = em_query($query)){
                while($tmp_comp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $comp[] = $tmp_comp;
                }
                $stmt->close();
                if(count($comp)>0){
                    $result['kit_data'] = $comp;
                }
            }
        }
        

    }
    $result['comp_id'] = $result['id'];
    unset($result['id']);

    echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}
/*
if(isset($_REQUEST['saveComponentForm'])){
    $action = $_REQUEST['action'];
    $comp_arr['comp_type'] = $_REQUEST['comp_type'];
    $comp_arr['comp_id'] = $_REQUEST['comp_id'];
    $comp_arr['part_number'] = $_REQUEST['part_number'];
    $comp_arr['description'] =  $_REQUEST['description'];
    $comp_arr['image1'] =  $_REQUEST['image1'];
    $comp_arr['drawing2d'] =  $_REQUEST['drawing2d'];
    $comp_arr['drawing3d'] =  $_REQUEST['drawing3d'];
    $comp_arr['add_spec'] =  $_REQUEST['docs'];
    $comp_arr['addImages'] =  $_REQUEST['img_galery'];

    if(preg_match("/[124]/", $comp_arr['comp_type'])){
        $comp_arr['division'] = $_REQUEST['division'];
        $comp_arr['revision'] =  $_REQUEST['revision'];
        $comp_arr['description'] =  $_REQUEST['description'];
        $comp_arr['comp_comments'] =  $_REQUEST['comp_comments'];
        $comp_arr['material'] =  $_REQUEST['material'];
        $comp_arr['image1'] =  $_REQUEST['image1'];
        $comp_arr['drawing2d'] =  $_REQUEST['drawing2d'];
        $comp_arr['drawing3d'] =  $_REQUEST['drawing3d'];
        $comp_arr['add_spec'] =  $_REQUEST['docs'];
        $comp_arr['addImages'] =  $_REQUEST['img_galery'];
        $comp_arr['dim_attr'] =  $_REQUEST['dim_attr'];
        $comp_arr['func_attr'] =  $_REQUEST['func_attr'];
        $result = saveComponent($comp_arr, $action);
    }
    else {
        $comp_arr['kit_data'] = $_REQUEST['kit_data'];
        $comp_arr['kit_bom_number'] = $_REQUEST['kit_bom_number'];
        $comp_arr['kit_bom_title'] = $_REQUEST['kit_bom_title'];
        $result = saveKit($comp_arr, $action);
    }
   echo json_encode($result);
   exit;
}*/

if(isset($_REQUEST['saveComponentForm'])){
    $action = $_REQUEST['action'];
    $comp_arr['comp_type'] = $_REQUEST['comp_type'];
    $comp_arr['comp_id'] = $_REQUEST['comp_id'];
    $comp_arr['part_number'] = $_REQUEST['part_number'];
    $comp_arr['description'] =  $_REQUEST['description'];
    $comp_arr['image1'] =  $_REQUEST['image1'];
    $comp_arr['drawing2d'] =  $_REQUEST['drawing2d'];
    $comp_arr['drawing3d'] =  $_REQUEST['drawing3d'];
    $comp_arr['add_spec'] =  $_REQUEST['docs'];
    $comp_arr['addImages'] =  $_REQUEST['img_galery'];

    if(preg_match("/[124]/", $comp_arr['comp_type'])){
        $comp_arr['division'] = $_REQUEST['division'];
        $comp_arr['revision'] =  $_REQUEST['revision'];
        $comp_arr['description'] =  $_REQUEST['description'];
        $comp_arr['comp_comments'] =  $_REQUEST['comp_comments'];
        $comp_arr['material'] =  $_REQUEST['material'];
        $comp_arr['image1'] =  $_REQUEST['image1'];
        $comp_arr['drawing2d'] =  $_REQUEST['drawing2d'];
        $comp_arr['drawing3d'] =  $_REQUEST['drawing3d'];
        $comp_arr['add_spec'] =  $_REQUEST['docs'];
        $comp_arr['addImages'] =  $_REQUEST['img_galery'];
        $comp_arr['dim_attr'] =  $_REQUEST['dim_attr'];
        $comp_arr['func_attr'] =  $_REQUEST['func_attr'];
        $result = saveComponent($comp_arr, $action);

        if($_REQUEST['ppap_set_reject']&&$result['success']){
        switch ($_REQUEST['task_type']) {
            case 36:
                $task_table = 'bb_ppap_review';
                $task_prev_table = 'bb_ppap_test_plan';
                $task_prev_type = 17;
            break;
            case 40:
                $task_table = 'bb_ppap_finished_good_review';
                $task_prev_table = 'bb_ppap_finished_good';
                $task_prev_type = 39;
            break;
            default:
                $task_table = null;
                $task_prev_table = null;
                $task_prev_type = null;
            break;
        }
        if($task_table){
            $query = "SELECT tp.`idx`, `RequestID`, `Responsible`, `AssignedTo`, tp.`ProductType`, tp.`ProductLine`, tp.`bbb_sku`, tp.`core_sku`, tp.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `id_part_number`, `qty`, `files`, `email`, `outsource_company`, `notes` FROM `".$task_table."` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=".$_REQUEST['ppap_task_id'];

            $tmp = em_query($query);
            $ppap = $tmp->fetch_array(MYSQL_ASSOC);
            $idx = $ppap['idx'];
            unset($ppap['idx']);

            $old_data = getOldData(substr($task_table, 3, strlen($task_table)), $idx);

            $ppap['RequestedDate'] = $ppap['AssignmentDate'] = $review['CompletionDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
            $ppap['id_user'] =  $id_user;
            $order_v['order_id'] = $ppap['RequestID'];
            $order_v['assignee'] = $ppap['AssignedTo'];
            $order_v['assigned_by'] = $ppap['Responsible'];
            $order_v['requested_date'] = $order_v['assignment_date'] = date('Y-m-d H:i:s');
            $outId_task = em_insert($task_prev_table, $ppap);
            $task_id = em_insert_order_task($task_prev_type, 1, $outId_task, $order_v);
            
            $history = array('idx'=>$outId_task, 'task_type'=>$task_prev_type, 'status'=>1, 'id_user'=>$id_user);
            setHistoryRecord($history);

            em_update('bb_bom_components', array('task_type'=>$task_prev_type, 'ppap_task_id'=>$outId_task, 'ppap_result'=>2), " `ppap_review_id`= ".$idx." AND `task_type` = ".$_REQUEST['task_type']);
            em_update('bb_components', array('comp_status'=>2, 'ppap_task_id'=>$task_id, 'task_type'=>$task_prev_type), " `id`= ".$ppap['id_part_number']);

            $review['ppap_result'] = 2;
            $review['draft'] = 0;
            $where = " `idx` = ".$idx."";
            em_update($task_table, $review, $where);

            $history = array('idx'=>$idx, 'task_type'=>$_REQUEST['task_type'], 'status'=>4, 'id_user'=>$id_user, 'old_data'=>$old_data);
            setHistoryRecord($history);
            em_update('bb_order_tasks', array('status'=>4, 'rejected'=>2, 'completion_date'=>date('Y-m-d H:i:s')), " `task_type` = ".$_REQUEST['task_type']." AND `outID_task` = ".$idx);
            $db->commit();
        }
    }
    }
    else {
        $comp_arr['kit_data'] = $_REQUEST['kit_data'];
        $comp_arr['kit_bom_number'] = $_REQUEST['kit_bom_number'];
        $comp_arr['kit_bom_title'] = $_REQUEST['kit_bom_title'];
        $result = saveKit($comp_arr, $action);
    }
   echo json_encode($result);
   exit;
}

if(isset($_REQUEST['deleteComponent'])){
    $comp_id = $_REQUEST['comp_id'];
    $query = "SELECT bs.`name`, `revision`
                FROM `bb_bom_components` bc
                INNER JOIN `bb_bom` b ON b.`id` = bc.`bom_id`
                INNER JOIN `bb_bbb_sku` bs ON bs.`id` = `bbb_sku_id`
                WHERE `component_id` = ".$comp_id;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($bbb_sku, $revision);
        while ($stmt->fetch()){
            $tmp[]= array('bbb_sku'=>$bbb_sku,'revision'=>$revision);
        }
        $stmt->close();
    }
        if(count($tmp)>0){
            $bbb_sku_list = "";
            for ($i=0; $i<count($tmp); $i++) { 
               $bbb_sku_list.=$tmp[$i]['bbb_sku']."(".$tmp[$i]['revision']."); ";
            }

            $result = array('success'=>false, 'message'=>'Component cannot be deleted becouse it used on BBB SKU#: '.$bbb_sku_list);
        }
        else {
            $query = "DELETE FROM `bb_components` WHERE `id` =".$comp_id;
            em_query($query);
            $query = "DELETE FROM `bb_dimensional_attributes` WHERE `component_id` =".$comp_id;
            em_query($query);
            $query = "DELETE FROM `bb_functional_attributes` WHERE `component_id` =".$comp_id;
            em_query($query);
            $result = array('success'=>true, 'message'=>'Component succefully deleted.');
        }

    echo json_encode($result);
    exit;
}

if(isset($_REQUEST['isUseComponent'])){
    $comp_id = $_REQUEST['comp_id'];
    $query = "SELECT bs.`name`, `revision`
                FROM `bb_bom_components` bc
                INNER JOIN `bb_bom` b ON b.`id` = bc.`bom_id`
                INNER JOIN `bb_bbb_sku` bs ON bs.`id` = `bbb_sku_id`
                WHERE `component_id` = ".$comp_id;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($bbb_sku, $revision);
        while ($stmt->fetch()){
            $tmp[]= array('bbb_sku'=>$bbb_sku,'revision'=>$revision);
        }
        $stmt->close();
    }
    if(count($tmp)>0){
            $bbb_sku_list = "";
            for ($i=0; $i<count($tmp); $i++) { 
               $bbb_sku_list.=$tmp[$i]['bbb_sku']."(".$tmp[$i]['revision']."); ";
            }

        $result = array('success'=>false, 'message'=>'Component type cannot be changed becouse it used on BBB SKU#: '.$bbb_sku_list);
    }
    else {
        $result = array('success'=>true);
    }

    echo json_encode($result);
    exit;
}


if(isset($_REQUEST['startPPAP'])){
    $comp_id = $_REQUEST['comp_id'];
    $comp_type = $_REQUEST['comp_type'];
    $ppap_sample_size = $_REQUEST['ppap_sample_size'];
    $responsible = $_REQUEST['responsible'];

    $equipmentArr = array();
    $query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.",1);";
    if ($stmt = $db->prepare($query)) {
        if ($stmt->execute()) {
            $last_order = $db->insert_id;
            $stmt->close();
        }
    }

    if($comp_type==2){
        $table="bb_ppap_review";
        $task_table = "bb_ppap_test_plan";
        $task_type = 17;
    }
    elseif($comp_type==1){
        $table="bb_ppap_finished_good_review";
        $task_table = "bb_ppap_finished_good";
        $task_type = 39;
    }

    $query = "SELECT `files` FROM `".$table."` WHERE `id_part_number` = ".$comp_id." ORDER BY `RequestedDate` DESC LIMIT 1";
      if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($files);
            $stmt->fetch();
            $stmt->close();
            $ppap['files'] = $files;
        }

    $ppap['RequestID'] = $last_order;
    $ppap['RequestedDate']  = $ppap['AssignmentDate'] = mktime(gmdate("H, i, s, m, d, Y"));
    $ppap['id_user'] = $id_user;
    $ppap['Responsible'] = $ppap['AssignedTo'] = $responsible;
    $ppap['id_part_number'] = $comp_id;
    $ppap['qty'] = $ppap_sample_size;
    $last_idx = em_insert($task_table, $ppap);

    $order['order_id'] =$last_order;
    $order['status'] = 1;
    $order['task_type'] = $task_type;
    $order['previous_task_id'] = 0;
    $order['outID_task'] = $last_idx;
    $order['requested_date'] = date('Y-m-d H:i:s');
    $order['assigned_by'] = $order['assignee'] = $responsible;
    $ppap_task_id = em_insert('bb_order_tasks', $order);

    if($last_idx){
        em_update('bb_components', array('comp_status'=>0, 'ppap_task_id'=>$ppap_task_id, 'task_type'=>$task_type), " `id` = '".$comp_id."'");
    }
    
    $result = array("success"=>true, "message"=>"PPAP Test Plan RequestID ".$last_order." created.");
    echo json_encode($result);
    exit;
}

if(isset($_REQUEST['getComponentStatuses'])){
    $comp_ids = $_REQUEST['comp_ids'];
    $query = "SELECT `id`, `comp_status` FROM `bb_components`  WHERE `id` IN (".$comp_ids.")";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $comp_status);
        while ($stmt->fetch()){
            $tmp[$id]= $comp_status;
        }
        $stmt->close();
    }
    echo json_encode($tmp);
    exit;
}

if(isset($_REQUEST['deleteSKU'])){
   $sku_id = $_REQUEST['sku_id'];
    $query = "SELECT `RequestID` FROM `bb_tasks_sku` WHERE `bbb_sku_id` = ".$sku_id;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($request_id);
        while ($stmt->fetch()){
            $tmp[]= $request_id;
        }
        $stmt->close();
    }
        if(count($tmp)>0){
            $request_list = "";
            for ($i=0; $i<count($tmp); $i++) { 
               $request_list.=$tmp[$i]."; ";
            }

            $result = array('success'=>false, 'message'=>'BOM cannot be deleted becouse it used on Tasks RequestID: '.$request_list);
        }
        else {
            $query = "DELETE FROM `bb_bom_components` WHERE `bom_id` IN (SELECT GROUP_CONCAT(`id`) FROM `bb_bom` WHERE `bbb_sku_id` =".$sku_id.")";
            em_query($query);
            $query = "DELETE FROM `bb_bbb_sku` WHERE `id` =".$sku_id;
            em_query($query);
            $query = "DELETE FROM `bb_bom` WHERE `bbb_sku_id` =".$sku_id;
            em_query($query);
            $result = array('success'=>true, 'message'=>'BOM succefully deleted.');
        }

    echo json_encode($result);
    exit;
}

if(isset($_REQUEST['getPPAPProgress'])){
    $ppap_task_id = $_REQUEST['ppap_task_id'];
    $task_type = $_REQUEST['task_type'];
    $check_result = false;

    switch ($task_type) {
        case 36:
            $task_table = 'bb_ppap_review';
        break;
        case 40:
            $task_table = 'bb_ppap_finished_good_review';
        break;
        default:
            $task_table = null;
        break;
    }
    
    if($task_table){
        $dim_test = "";
        $func_test = "";

        $query="SELECT `dim_test`, `func_test`
                FROM `".$task_table."` tp
                INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
                WHERE `task_id`= ".$ppap_task_id;
        if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($dim_test, $func_test);
            $stmt->fetch();
            $stmt->close();
        }

        if(strlen($dim_test)>0||strlen($func_test)>0){
            $check_result = true;
        }
    }
    echo $check_result;
    exit;
}

if(isset($_REQUEST['setECRImplemented'])){
    $idx = $_REQUEST['idx'];
    $result = array('success'=>false, "message"=>"Process can't implemented.");
    $query = "SELECT `ecr_data`, `bbb_sku` FROM `bb_ecr_implementation` WHERE `idx` = ".$idx;
    if($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($ecr_data, $bbb_sku);
        $stmt->fetch();
        $stmt->close();
        
    
    $ecr_arr = (array)json_decode($ecr_data);
    $ecr_arr['revision'] = setRevision($ecr_arr['revision']);
    $old_process = $ecr_arr['process_id'];
    unset($ecr_arr['base_data']);
    unset($ecr_arr['process_id']);
    $ecr_arr['bbb_sku_id'] = $bbb_sku;
    $ecr_arr['last_mod'] = $ecr_arr['create_date'] = date('Y-m-d');
    $process_arr = $ecr_arr['process'];
    unset($ecr_arr['process']);

    $process_id = em_insert('bb_process_flow', $ecr_arr);
    em_update('bb_bbb_sku', array('process_id'=>$process_id), " `process_id`=".$old_process);

    $count_op = count($process_arr);
    for($i=0; $i<$count_op; $i++){
        $tmp = (array)$process_arr[$i];
        $content['full'] =$tmp['full']? 1:0;
        $content['operation_id'] = $tmp['id'];
        $content['operation_number'] = $tmp['op_number'];
        $content['process_id'] = $process_id;
        em_insert('bb_process_flow_content', $content);
    }
    $implementation_date = date('Y-m-d');
    $query = "UPDATE `bb_ecr_implementation` SET `impl_action`=1, `implementation_date`= '".$implementation_date."' WHERE `idx` = ".$idx;
    em_query($query);

    $result = array('success'=>true, "message"=>"Process succesfully implemented.", 'impl_action'=>1, 'implementation_date'=>$implementation_date);
    }
    echo json_encode($result);
    exit;
}

if(isset($_REQUEST['sendECNMessage'])){
    $signatures = json_decode($_REQUEST['signatures']);
    $idx = $_REQUEST['idx'];
    $message = "<h2>ENGINEERING CHANGE NOTICE (ECN)</h2><br>";
    $query = "SELECT `RequestID`, pl.`name` AS `ProductLine`, pt. `name` AS `ProductType`, bs.`id` AS `bbb_sku`, `ecr_type`, `approvals`,us.`name` AS `initiator`, d.`name` AS `department`, `critical_item`, `ecr_description`, `ecr_reason`, `customer`, `impl_action`, `implementation_date` 
        FROM `bb_ecr_implementation` ei
        INNER JOIN `bb_product_line` pl ON ei.`ProductLine` = pl.`id`
        INNER JOIN `bb_product_type` pt ON ei.`ProductType` = pt.`id`
        INNER JOIN `bb_bbb_sku` bs ON ei.`bbb_sku` = bs.`id`
        INNER JOIN `bb_users` us ON ei.`initiator` = us.`id`
        INNER JOIN `bb_departments` d ON ei.`department` = d.`id`
        WHERE `idx` =".$idx;
    if($tmp = em_query($query)){
        $result = $tmp->fetch_assoc();
        $tmp->close();
        switch ($result['ecr_type']) {
            case 1:
                $result['ecr_type'] = 'BOM';
            break;
            case 2:
                $result['ecr_type'] = 'Component';
            break;
            case 3:
                $result['ecr_type'] = 'Process';
            break;
            case 4:
                $result['ecr_type'] = 'Operation';
            break;
        }

        $result['critical_item'] = ($result['critical_item']==1)? 'YES': 'NO';
        $result['impl_action'] = ($result['impl_action']==1)? 'YES': 'NO';

        $message .="RequestID: ".$result['RequestID'];
        $message .="BBB SKU#: ".$result['bbb_sku'];
        $message .="Product Line: ".$result['ProductLine'];
        $message .="Product Type: ".$result['ProductType'];
        $message .="ECR Type: ".$result['ecr_type'];
        $message .="Initiator: ".$result['initiator'];
        $message .="Department: ".$result['department'];
        $message .="Critical Item: ".$result['critical_item'];
        $message .="ECR Description: ".$result['ecr_description'];
        $message .="ECR Reason: ".$result['ecr_reason'];
        $message .="Customer: ".$result['customer'];
        $message .="Implemented: ".$result['customer'];
        $message .="implementation_date: ".$result['implementation_date'];
    }

    $subject = "ENGINEERING CHANGE NOTICE (ECN)";
    $headers = "From: \"web\" <bbbinfo@vvtrack.com>\r\n"."Content-Type: text/html; charset=\"utf-8\"\r\n";
        //$email = 'vyacheslav.tur@innotech-ua.com';
    for ($i=0; $i<count($signatures); $i++) { 
       $link = "<br><br><a href='http://".$_SERVER['HTTP_HOST'].$path."/ecr_form.php?ecn=true&task=".$idx."&user=".$signatures[$i]['person_id']."' style='text-decoration: none;'><b><span style='font-size: 16px; color: #000;'></br></br> <b><span style='color: #fff; display: block; padding: 6px; background: #4169E1; text-align: center; border: 2px solid #000; border-radius: 5px;'>APPROVE</span></b></a>";
       smtpmail($email, $subject, $message.$link, $headers); 
    }
    $db->close();
    exit;
}

?>