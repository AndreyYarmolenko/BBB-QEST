<?php
include "../lang/langs.php ";

$nextStage ='';
$last_idx = $idx = $_REQUEST['idx'];
$last_order = $RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];

$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);

$array1['ProductType'] = $_REQUEST['ProductType']; //2
$array1['PotentialCustomers'] = $_REQUEST['PotentialCustomers']; //2

$array2['ERPOrderID'] = $_REQUEST['ERPOrderID']; //n
$array2['Application'] = $_REQUEST['Application']; //n
$array1['Annualdemand'] = ($_REQUEST['Annualdemand']) ? $_REQUEST['Annualdemand'] : 0; //n
$array2['ReasonforRequest'] = $_REQUEST['ReasonforRequest']; //n
$array2['ExistingProductline'] = $_REQUEST['ExistingProductline']; //n

$array3['WhatProductLine']  =  $_REQUEST['WhatProductLine']; //dd
$where = 'idx = '.$idx;

$telegram = getBaseDataTelegram($idx, 1, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$CompletionDate = null;
if ($draft == 1){
    $status = getStatusDraft();
}

if ($draft == 0){
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $status = 4;
}

$telegram['current_status'] = $status;

$array['CompletionDate'] = $CompletionDate;
$array_full = array_merge($array, $array1, $array2, $array3);

if($idx){
    $last_idx = $idx;
    $last_order = $_REQUEST['RequestID'];
    em_update('bb_new_engineering_req',$array_full, $where);
    em_update_order_task($task_type = 1, $status);
    $query = "SELECT `task_id` FROM `bb_order_tasks` WHERE `order_id` = ".$last_order." AND `task_type` =1";
    if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($task_id);
            $stmt->fetch();
            $stmt->close();
        }
    $message = $answers['task_update']." ";
    // <---------------------------


}
else {
    $array_full['id_user'] = $id_user;

    $query = "INSERT INTO `bb_order` (`ext_order_id`,`client_id`,`part_num`,`creation_date`,`created_by`,`order_status`, `task_type_id`) VALUES ('',1,'','".date('Y-m-d H:i:s')."',".$id_user.", 1, 1);";
    writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY = '.$query );
    if ($stmt = $db->prepare($query)) {
        if ($stmt->execute()) {
            $last_order = $db->insert_id;
            $stmt->close();
        }
    }
    $array_full['RequestID'] = $last_order;
    // INSERT bb_new_engineering_req
    $last_idx = em_insert('bb_new_engineering_req', $array_full);

    // INSERT bb_order_task
    $task_id=em_insert_order_task_full($task_type=1, $last_order, $last_idx, $status);
    // <---------------------------
    $telegram['task_id'] = $task_id;
    $telegram['RequestID'] = $last_order;

}

TelegramManager($telegram);
$telegram1 = array();

if($draft==0){
    $array_full = null;

    $array1['RequestID'] = $last_order;
    $array1['id_user'] = $id_user;

    if($_REQUEST['ExistingProductline'] == 0){
        $nextStage = $tasks['3'];
        $task_type = 3;
        $telegram1 = getBaseDataTelegram(false, $task_type, $RequestID, 1);
        $array_full = array_merge($array1, $array2);
        $customers_arr = JsonToArray($array1['PotentialCustomers']);
        $customers ="";
        for($i=0; $i<count($customers_arr); $i++){
           $customers .=$customers_arr[$i]['name'].", ";
        }
        $customers = substr($customers, 0, -2);
        $array_full['PotentialCustomers'] = $customers;
        $table = 'bb_new_product_line';
    }else{
        $nextStage = $tasks['2'];
        $task_type = 2;
        $telegram1 = getBaseDataTelegram(false,$task_type, $RequestID, 1);
        $array_full =  $array1;
        $array_full['ProductLine'] =  $_REQUEST['WhatProductLine'];
        $table = 'bb_due_diligence';
    }
    $_REQUEST['RequestID'] = $last_order;

    unset($array_full['draft']);

    $content = &$array_full;
    $code = stripslashes(getPreScript($task_type));
    eval($code);
    $array_full['RequestedDate'] = $CompletionDate;
    $array_full['AssignmentDate'] = $CompletionDate;
    $idx = em_insert($table, $array_full);
    $task_id=em_insert_order_task($task_type, 1, $idx);
    $telegram1['current_assignee'] = $array_full['AssignedTo'];
    $telegram1['current_responsible'] = $array_full['Responsible'];
    $telegram1['task_id'] = $task_id;
    TelegramManager($telegram1);

    $history = array('idx'=>$idx, 'task_type'=>$task_type, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

$history = array('idx'=>$last_idx, 'task_type'=>1, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'idx' => $last_idx, 'RequestID' => $last_order, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;