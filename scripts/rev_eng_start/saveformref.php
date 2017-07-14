<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

$id_user = $_SESSION['id'];
$login = $_SESSION['login'];
include_once "../../settings.php";
include_once "../saveform_func.php";


if(isset($_REQUEST['saveCoreAnalysis'])){
    $core_data = $_REQUEST['core_data'];
    $RequestID = $_REQUEST['request_id'];
    $family_id = $_REQUEST['family_id'];
    
    $core = JsonToArray($core_data);    

    $query = "SELECT `data_type`, `dynamic_id` FROM `bb_family_attr`";
    if($stmt = $db->query($query)){
        while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
            $data_types[$tmp['dynamic_id']] = $tmp['data_type'];
        }
        $stmt->close();
    }

    //вынес из цикла
    $query = "DELETE FROM `bb_res_core_analysis` WHERE `RequestID`= ".$RequestID;
    em_query($query);
     
    for($i=0; $i<count($core); $i++){
        foreach ($core[$i] as $key => $value) {
            if($data_types[$key]==2){
                setStoreValue($core[$i][$key], $key);
            }
        }

    /*$query = "DELETE FROM `bb_res_core_analysis` WHERE `RequestID`= ".$RequestID;
    em_query($query);*/

        $core[$i]['RequestID'] = $RequestID;
        $core[$i]['family_id'] = $family_id;
        em_insert('bb_res_core_analysis', $core[$i]);
    }    

    $db->commit();
    exit;
}

if(isset($_REQUEST['savePhysAttributes'])){
    $phys_data = $_REQUEST['phys_data'];
    $RequestID = $_REQUEST['request_id'];
    $family_id = $_REQUEST['family_id'];
    $phys = JsonToArray($phys_data);

    $query = "SELECT `data_type`, `dynamic_id` FROM `bb_family_attr`";
    if($stmt = $db->query($query)){
        while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
            $data_types[$tmp['dynamic_id']] = $tmp['data_type'];
        }
        $stmt->close();
    }

    //вынес из цикла
    $query = "DELETE FROM `bb_res_phys_attributes` WHERE `RequestID`= ".$RequestID;
    em_query($query);

    for($i=0; $i<count($phys); $i++){
        foreach ($phys[$i] as $key => $value) {
            if($data_types[$key]==2){
                setStoreValue($phys[$i][$key], $key);
            }
        }

        /*$query = "DELETE FROM `bb_res_phys_attributes` WHERE `RequestID`= ".$RequestID;
        em_query($query);*/

        $phys[$i]['RequestID'] = $RequestID;
        $phys[$i]['family_id'] = $family_id;
        em_insert('bb_res_phys_attributes', $phys[$i]);
    }
    $db->commit();
    exit;
}

if(isset($_REQUEST['clearRESTables'])){
    $RequestID = $_REQUEST['request_id'];
    $family_id = $_REQUEST['family_id'];
    $query = "DELETE FROM `bb_res_core_analysis` WHERE `RequestID` = ".$RequestID." AND `family_id` =".$family_id;
    em_query($query);
    $query = "DELETE FROM `bb_res_phys_attributes` WHERE `RequestID` = ".$RequestID." AND `family_id` =".$family_id;
    em_query($query);
    echo json_encode(array('success'=>true, 'message'=>'Tables data deleted.'));
    $db->commit();
    exit;
}

function setStoreValue($value, $key){
    global $db;
    $data = array();

   /* $query = "SELECT `".$key."`FROM `bb_family_attr_stores` LIMIT 1";
    if(!$db->query($query)){
        $query = "ALTER TABLE `bb_family_attr_stores` ADD COLUMN `".$dynamic_id."` VARCHAR(100) NULL";
        em_query($query);
    }*/

    $query = "SELECT COUNT(*) FROM `bb_family_attr_stores` WHERE `".$key."` ='".$value."'";
    if($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count_value);
        $stmt->fetch();
        $stmt->close();
    }

    if($count_value==0){
        $query = "SELECT COUNT(*) FROM `bb_family_attr_stores` WHERE `".$key."` IS NOT NULL";
        if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count_key);
            $stmt->fetch();
            $stmt->close();
        }

        $query = "SELECT COUNT(*) FROM `bb_family_attr_stores`";
        if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count_total);
            $stmt->fetch();
            $stmt->close();
        }

        $data[$key] = $value;
        if($count_key<$count_total){
            $query="SELECT `id` FROM `bb_family_attr_stores` WHERE `".$key."` IS NULL ORDER BY `id` LIMIT 1";
            if($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($id);
                $stmt->fetch();
                $stmt->close();
            }
            $where = " `id`=".$id;
            em_update('bb_family_attr_stores', $data, $where);
        }
        else{
            $id = em_insert('bb_family_attr_stores', $data);
        }

        return $id; 
    }
}
