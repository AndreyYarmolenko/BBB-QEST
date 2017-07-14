<?php
include '../lang/langs.php';

$last_idx = $idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$reject = false;
$last_order = null;
$nextStage = null;
$CompletionDate = null;
$newsku = $_REQUEST['newsku'];
$bbb_sku = $_REQUEST['bbb_sku'];

$telegram = getBaseDataTelegram($idx, 2, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($_REQUEST['draft_id'] == 1) {
    $status = getStatusDraft();
}

$task_type = 2;
if($_REQUEST['draft_id'] == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
if($newsku == 1) {
    $query = "SELECT COUNT(*) FROM `bb_bbb_sku` WHERE `name` = '".$bbb_sku;
        if ($stmt1 = $db->prepare($query)) {
            if ($stmt1->execute()) {
                $stmt1->bind_result($count);
                $stmt1->fetch();
                $stmt1->close();
            }
        }
        if($count == 0){
               $array1['bbb_sku'] = em_insert('bb_bbb_sku', array('name'=>$bbb_sku, 'ProductLine'=>$_REQUEST['ProductLine'], 'ProductType'=>$_REQUEST['ProductType'], 'sku_status'=>0));
        } else {
            $array1['bbb_sku'] = $bbb_sku;
        }
    }
    else {
        $array1['bbb_sku'] = $bbb_sku;
        $query = "SELECT `sku_status` FROM `bb_bbb_sku` WHERE `id` = ".$bbb_sku;
        if ($stmt1 = $db->prepare($query)) {
            if ($stmt1->execute()) {
                $stmt1->bind_result($sku_status);
                $stmt1->fetch();
                $stmt1->close();
            }
        }
        
        if($sku_status!=3){
            $sku_statuses = array("In Progress", "Approved", "Rejected", "New", "Canceled");
            $query = "SELECT `sku_status`, `RequestID` FROM `bb_bbb_sku` bs
                    INNER JOIN `bb_tasks_sku`  ts ON bs.`id` = ts.`bbb_sku_id`
                    WHERE `bbb_sku_id` = ".$bbb_sku;
                     $stmt = $db->query($query);
                    while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                        $tasks_sku[] = $tmp;
                    }               
                    $stmt->close();
                    $tasks_list = "";
                    for ($i=0; $i <count($tasks_sku); $i++) {
                        $tasks_list .= "Req.ID: ".$tasks_sku[$i]['RequestID']."(".$sku_statuses[$tasks_sku[$i]['sku_status']]."); ";
                    }
            $result = array('success' => false, 'message' => 'BBB SKU# is already used on other tasks.  '.$tasks_list);
            echo json_encode($result);
            exit;
            
        }
        else {
            em_update('bb_bbb_sku', array('sku_status'=>0), " `id` = ".$bbb_sku);
        }
    }

$query = "SELECT COUNT(*) FROM `bb_tasks_sku` WHERE `RequestID` = '".$RequestID."'";
if ($stmt1 = $db->prepare($query)) {
    if ($stmt1->execute()) {
        $stmt1->bind_result($count);
        $stmt1->fetch();
        $stmt1->close();
    }
}

if($count == 0 ){
    em_insert('bb_tasks_sku', array('RequestID'=>$RequestID, 'bbb_sku_id'=>$array1['bbb_sku']));
    }
       else { 
        $where = "'RequestID'='".$RequestID."'";
        em_update('bb_tasks_sku', array('bbb_sku_id'=>$array1['bbb_sku']), $where);
    }
}




$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$array1['ProductLine'] =  $_REQUEST['ProductLine'];
$array1['ProductType'] =  $_REQUEST['ProductType'];

$array['PotentialCustomers'] =  $_REQUEST['PotentialCustomers'];

$array1['oe_latest_sku'] =  $_REQUEST['oe_latest_sku'];
$array['oe_list_price'] =  $_REQUEST['oe_list_price'];
$array['oe_street_price'] =  $_REQUEST['oe_street_price'];
$array['oe_core_price'] =  $_REQUEST['oe_core_price'];
$array['oe_sku'] =  $_REQUEST['oe_sku'];
$array['similar_sku'] =  $_REQUEST['similar_sku'];
$array['market_inteligence'] =  $_REQUEST['market_inteligence'];
$array['catalog_data_ver'] =  $_REQUEST['catalog_data_ver'];
$array['predominant_make'] =   $_REQUEST['predominant_make'];
$array['aver_veh_mod_year'] =  $_REQUEST['aver_veh_mod_year'];
$array['veh_in_operation'] =   $_REQUEST['veh_in_operation'];
$array['lifecycle'] = $_REQUEST['lifecycle'];
$array['competitor'] = $_REQUEST['competitors'];
$array['demand_in_cur_lifecycle'] = $_REQUEST['demand_in_cur_lifecycle'];
$array['demand_in_mature_lifecycle'] =  $_REQUEST['demand_in_mature_lifecycle'];
$array['first_year_demand'] =  $_REQUEST['first_year_demand'];
$array['anti_pipe_fill'] =  $_REQUEST['anti_pipe_fill'];
$array1['Annualdemand'] =  $_REQUEST['Annualdemand'];
$array['est_exch_price'] =  $_REQUEST['est_exch_price'];
$array['est_core_charge'] = $_REQUEST['est_core_charge'];
$array['est_annual_revenue'] = $_REQUEST['est_annual_revenue'];
$array['est_exch_price_date'] =  $_REQUEST['est_exch_price_date'];
$array['est_core_charge_date'] = $_REQUEST['est_core_charge_date'];
$array['est_annual_revenue_date'] = $_REQUEST['est_annual_revenue_date'];
$array['finish_goods_target_lev'] =   $_REQUEST['finish_goods_target_lev'];
$array['min_order_qty'] =  $_REQUEST['min_order_qty'];
$array['spec_pack_req'] =  $_REQUEST['spec_pack_req'];
$array['spec_label_req'] =   $_REQUEST['spec_label_req'];
$array['spec_mark_req'] =   $_REQUEST['spec_mark_req'];
$array['PriorityLevel'] =  $_REQUEST['PriorityLevel'];
$array['set_up_bbb'] =  $_REQUEST['set_up_bbb'];
$array['bbb_sku'] = $bbb_sku;
$array['newsku'] = $_REQUEST['newsku'];
$array['business_benefit'] = $_REQUEST['business_benefit'];
$array['business_purpose'] = $_REQUEST['business_purpose'];
$array['cost_center'] = $_REQUEST['cost_center'];
$array['CompletionDate'] = $CompletionDate;
$array['oe_core_price_date'] = $_REQUEST['oe_core_price_date'];
$array['oe_street_price_date'] = $_REQUEST['oe_street_price_date'];
$array['oe_list_price_date'] = $_REQUEST['oe_list_price_date'];
$where = 'idx = '.$idx;

$array =  array_merge($array, $array1);

insertDueCompetitor($array['competitor']);
insertDueFromJSON('bb_due_reman_sku_upc', $_REQUEST['reman_sku_upc']);
insertDueFromJSON('bb_due_core_sku', $_REQUEST['core_sku']);

//запсиь нового predominant
$predom_arr['make'] = $_REQUEST['predominant_make'];
if($predom_arr['make']&&$predom_arr['make']!=""){
    em_insert('bb_predominant_make', $predom_arr);
}

//запись нового latest_sku
$query = "SELECT COUNT(*) FROM `bb_latest_sku` WHERE `name` = '".$_REQUEST['oe_latest_sku']."'";
if ($stmt = $db->prepare($query)) {
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
}
if($count == 0){
    $query = "INSERT INTO `bb_latest_sku` SET `name` = '".$_REQUEST['oe_latest_sku']."'";
    $db->query($query);
}
//db->close();

em_update('bb_'.$table, $array, $where);
// <---------------------------

// UPDATE bb_order_task
em_update_order_task($task_type, $status);
// <---------------------------
$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();

if ($draft == 0){
    $query = "SELECT  ner.Application
                        FROM bb_new_engineering_req ner
	                        WHERE ner.RequestID = ".$RequestID." LIMIT 1";
    $result = em_query($query);
    $row = $result->fetch_assoc();
    $result->close();
    $row['oe_reman_sku'] = getRemanSku();
    $row['core_sku'] = getCoreSku();

    $array = null;
    $arrayStq = getStq($array1['ProductType']);

    $array = array_merge($array1, $row, $arrayStq);
    $array['RequestID'] = $_REQUEST['RequestID'];
    $array['id_user'] = $id_user;



    $task_type = 4;
    $nextStage = $tasks['4'];

    $content = &$array;
    $code = stripslashes(getPreScript($task_type));
    eval($code);

    //переопределяем перед записью в б/д
    $array['AssignmentDate'] = $CompletionDate;
    $array['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_sample_procurement', $array);

    $task_id = em_insert_order_task($task_type, 1, $last_idx);
    $telegram = getBaseDataTelegram(false, 4, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>$task_type, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

$history = array('idx'=>$idx, 'task_type'=>2, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=>$CompletionDate);
echo json_encode($result);
$db->commit();



exit;