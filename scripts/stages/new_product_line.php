<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:49
 */
include '../lang/langs.php';
$last_idx = $idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];

$telegram = getBaseDataTelegram($idx, 3, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$reject = false;
if ($draft == 3) {
    $reject = true;
    $draft = $_REQUEST['draft_id'] = 0;
}

$last_order = null;
$nextStage = null;
$CompletionDate = null;

$task_type = 3;
if ($_REQUEST['draft_id'] == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
}

if ($draft == 1){
    //$data[] = $_REQUEST['Newproductlinename'];
    $status = getStatusDraft();
}

// UPDATE bb_new_product_line
$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$array['CompletionDate'] = $CompletionDate;
$array['Newproductlinename'] = $_REQUEST['Newproductlinename'];
$where = 'idx = ' . $idx;

em_update('bb_new_product_line', $array, $where);
// <---------------------------

// UPDATE bb_order_task
em_update_order_task($task_type, $status);
// <---------------------------
$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();

if ($_REQUEST['draft_id'] == 0 && !$reject) {
    $task_type = 2;
    $nextStage = $tasks['2'];

    // Выбираем значения из базы, для устранения возможной подмены данных в формах
    $query = "SELECT ner.ProductType, ner.Annualdemand, PotentialCustomers
                        FROM bb_new_engineering_req ner
                        WHERE ner.RequestID = " . $RequestID . " LIMIT 1";
    $result = em_query($query);
    $row = $result->fetch_assoc();
    $result->close();

    $array = null;
    $array = em_get_insert_header();

    $array['ProductLine'] = em_insert('bb_product_line', array('name'=>$_REQUEST['Newproductlinename']));
    $array = array_merge($array, $row);

    $content = &$array;
    $code = stripslashes(getPreScript($task_type));
    eval($code);

    $array['AssignmentDate'] = $CompletionDate;
    $array['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_due_diligence', $array);

    $task_id=em_insert_order_task($task_type, 1, $last_idx);
    $telegram = getBaseDataTelegram(false, 2, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>2, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

if($reject === true) {
    $nextStage = "";
    em_update('bb_order', array('request_status'=>4, 'completion_date'=>date('Y-m-d H:i:s'), 'completed_by'=>$id_user), '`order_id`='.$RequestID);
}

$history = array('idx'=>$idx, 'task_type'=>3, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'idx' => $last_idx, 'RequestID' => $last_order, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;