<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:49
 */

$last_idx = $idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$reject = false;
if ($draft == 3) {
    $reject = true;
    $draft = $_REQUEST['draft_id'] = 0;
}

$last_order = null;
$nextStage = null;
$CompletionDate = null;

$telegram = getBaseDataTelegram($idx, 4, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$task_type = 4;
if ($_REQUEST['draft_id'] == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
}

// UPDATE bb_sample_procurement

$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$array['ProductLine'] = $_REQUEST['ProductLine'];
$array['ProductType'] = $_REQUEST['ProductType'];
$array['bbb_sku'] = $_REQUEST['bbb_sku'];
$array['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
$array['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
$array['core_sku'] = $_REQUEST['core_sku'];
$array['Application'] = $_REQUEST['Application'];
$array['Annualdemand'] = $_REQUEST['Annualdemand'];
$array['stqOE'] = $_REQUEST['stqOE'];
$array['stqCore'] = $_REQUEST['stqCore'];
$array['ETAforSamples'] = $_REQUEST['ETAforSamples'];
$array['RecipientName'] = $_REQUEST['RecipientName'];
$array['ShipToLocation'] = $_REQUEST['ShipToLocation'];
$array['Address'] = $_REQUEST['Address'];
$array['Supplier'] = trim($_REQUEST['Supplier']);
$query = "SELECT COUNT(*) FROM `bb_supplier` WHERE `title` = '".$array['Supplier']."'";
if ($stmt1 = $db->prepare($query)) {
    if ($stmt1->execute()) {
        $stmt1->bind_result($count);
        $stmt1->fetch();
        $stmt1->close();
    }
}

if($count == 0) {
    em_insert('bb_supplier', array('title'=>$array['Supplier']));
}

$array['po'] = $_REQUEST['po'];
$array['CCOrder'] = $_REQUEST['CCOrder'];
$array['Tracking'] = $_REQUEST['Tracking'];
$array['ActualDate'] = $_REQUEST['ActualDate'];
$array['SampleLocation'] = $_REQUEST['SampleLocation'];

if ($_REQUEST['draft_id'] == 1) {
    $status = getStatusDraft();
}
if ($CompletionDate) $array['CompletionDate'] = $CompletionDate;

$where = 'idx = ' . $idx;

em_update('bb_sample_procurement', $array, $where);
// <---------------------------

// UPDATE bb_order_task
em_update_order_task($task_type, $status);
// <---------------------------

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();

// Проверяем наличие строки в справочнике
$query = "SELECT COUNT(idx) FROM bb_supplier WHERE UPPER(title) = UPPER('" . $_REQUEST['Supplier'] . "')";
$result = em_query($query);
$supplier = $result->fetch_assoc();
$result->close();
// Если не существует добавляем в справочник
if (!$supplier && sizeof($supplier) > 0)
    em_insert('bb_supplier', array('title', $_REQUEST['Supplier']));


if ($_REQUEST['draft_id'] == 0) {
    $task_type = 5;
    $nextStage = "Feasibility - Product Engineering";

    // Выбираем значения из базы, для устранения возможной подмены данных в формах
    $query = "SELECT dd.ProductLine, dd.ProductType, sp.bbb_sku, dd.oe_latest_sku,
                        ner.Application, sp.SampleLocation, dd.Annualdemand
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

    $array = null;
    $array = em_get_insert_header();
    $array = array_merge($array, $row);

    $content = &$array;
    $code = stripslashes(getPreScript($task_type));
    eval($code);

    //переопределяем в метку
    $array['AssignmentDate'] = $CompletionDate;
    $array['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_feasibility_product_eng', $array);

    $task_id = em_insert_order_task($task_type, 1, $last_idx);
    $telegram = getBaseDataTelegram(false, 5, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>5, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);

}

$history = array('idx'=>$idx, 'task_type'=>4, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'idx' => $idx, 'RequestID' => $last_order, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit(); // Если всё ок, сохраняем транзакцию
exit;