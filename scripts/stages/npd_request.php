<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:52
 */

$last_order = $CompletionDate = $nextStage = null;
$reject = false;
$last_idx = $idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];

if ($draft == 1){
    $status = getStatusDraft();
}
$task_type = 9;

if ($draft == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
}

$telegram = getBaseDataTelegram($idx, 9, $RequestID, $draft);
$old_data = getOldData($table, $idx);

// UPDATE
$VALUES = em_get_update_header();
$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$VALUES['CompletionDate'] = $CompletionDate;
$where = 'idx = '.$idx;
em_update('bb_npd_request', $VALUES, $where);
// <---------------------------------
em_update_order_task($task_type, $status);

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();

if ($_REQUEST['draft_id'] == 0) {
    $task_type = 10;
    $nextStage = "Sample Validation";

    // Выбираем значения из базы, для устранения возможной подмены данных в формах
    $query = "SELECT ner.RequestID, IFNULL(ner.WhatProductLine, npl.Newproductlinename) AS ProductLine, ner.ProductType,sp.bbb_sku, dd.oe_latest_sku,
						/*dd.oe_reman_sku, dd.core_sku,*/ ner.Application, sp.SampleLocation, sp.stqOE, sp.stqCore
						FROM bb_new_engineering_req ner
						LEFT JOIN bb_due_diligence dd ON ner.RequestID = dd.RequestID
						LEFT JOIN bb_sample_procurement sp ON ner.RequestID = sp.RequestID
						LEFT JOIN bb_new_product_line npl ON ner.RequestID = npl.RequestID
						WHERE ner.RequestID = " . $RequestID . "
						ORDER BY sp.idx DESC LIMIT 1";
    $result = em_query($query);
    $row = $result->fetch_assoc();
    $result->close();
    $row['oe_reman_sku'] = getRemanSku();
    $row['core_sku'] = getCoreSku();
    // <---------------------------------

    $VALUES = em_get_insert_header();
    $VALUES['AssignedTo'] = $order_v['assignee'] = $_REQUEST['AssignedTo'];
    $VALUES['AssignmentDate'] = $order_v['assignment_date'] = $_REQUEST['AssignmentDate'];
    $VALUES['RequestedDate'] =  $order_v['requested_date'] = $_REQUEST['RequestedDate'];
    $array = array_merge($VALUES, $row);


    $content = &$array;
    $code = stripslashes(getPreScript($task_type));
    eval($code);

    //переопределяем в метку
    $array['AssignmentDate'] = $CompletionDate;
    $array['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_sample_validation', $array);
    $task_id = em_insert_order_task($task_type, 1, $last_idx, $order_v);

    $telegram = getBaseDataTelegram(false, 10, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>10, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);

}

 $history = array('idx'=>$idx, 'task_type'=>9, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);
$result = array('success' => true, 'Status' => $status, 'idx' => $last_idx, 'RequestID' => $last_order, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;