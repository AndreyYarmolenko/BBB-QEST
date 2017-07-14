<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:51
 */
include "../lang/langs.php";

$last_idx = $idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$reject = false;
if ($draft == 3) {
    $reject = true;
    $draft = $_REQUEST['draft_id'] = 0;
}

$telegram = getBaseDataTelegram($idx, 7, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$last_order = null;
$nextStage = null;
$CompletionDate = null;

$task_type = 7;
if ($_REQUEST['draft_id'] == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
}
if ($_REQUEST['draft_id'] == 1) {
    $status = getStatusDraft();
}

// UPDATE
$VALUES = em_get_update_header();
$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$VALUES['CompletionDate'] = $CompletionDate;
$VALUES['ProductLine'] = $_REQUEST['ProductLine'];
$VALUES['ProductType'] = $_REQUEST['ProductType'];
$VALUES['bbb_sku'] = $_REQUEST['bbb_sku'];
$VALUES['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
$VALUES['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
$VALUES['core_sku'] = $_REQUEST['core_sku'];
$VALUES['Application'] = $_REQUEST['Application'];
$VALUES['Annualdemand'] = $_REQUEST['Annualdemand'];
$VALUES['min_order_qty'] = $_REQUEST['min_order_qty'];

$VALUES['EstimatedMaterial'] = $_REQUEST['EstimatedMaterial'];
$VALUES['HoursPerUnit'] = $_REQUEST['HoursPerUnit'];
$VALUES['HourlyLoadedRate'] = $_REQUEST['HourlyLoadedRate'];
$VALUES['Markup'] = $_REQUEST['Markup'];
$VALUES['Years'] = $_REQUEST['Years'];

$VALUES['LoadedCost'] = $_REQUEST['LoadedCost'];
$VALUES['MarkUpCost'] = $_REQUEST['MarkUpCost'];
$VALUES['ToolingAmortization'] = $_REQUEST['ToolingAmortization'];
$VALUES['CostEstimate'] = $_REQUEST['CostEstimate'];

$VALUES['EstimatedTotal'] = $_REQUEST['EstimatedTotal'];

$where = 'idx = ' . $idx;

em_update('bb_cost_estimate', $VALUES, $where);
// <---------------------------

// UPDATE bb_order_task
em_update_order_task($task_type, $status);
// <---------------------------

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();

if ($_REQUEST['draft_id'] == 0) {
    $task_type = 8;
    $nextStage = $tasks['8'];

    // Выбираем значения из базы, для устранения возможной подмены данных в формах
    $query = "SELECT dd.ProductLine, ner.ProductType, sp.bbb_sku, dd.oe_latest_sku,
                          /*dd.oe_reman_sku, dd.core_sku, */ner.Application, dd.first_year_demand, dd.anti_pipe_fill,
                          dd.Annualdemand, dd.est_exch_price, dd.est_core_charge, dd.est_annual_revenue,
                          dd.finish_goods_target_lev,  dd.min_order_qty, ce.CostEstimate AS CostEstimatePerUnit,
                          ce.EstimatedTotal AS EstimatedTotalInvestment
                        FROM bb_new_engineering_req ner
                        LEFT JOIN bb_due_diligence dd ON ner.RequestID = dd.RequestID
                        LEFT JOIN bb_cost_estimate ce ON ner.RequestID = ce.RequestID
                        LEFT JOIN bb_new_product_line npl ON ner.RequestID = npl.RequestID
                        LEFT JOIN bb_sample_procurement sp ON ner.RequestID = sp.RequestID
                        WHERE ner.RequestID = " . $RequestID . " 
                        ORDER BY ce.idx DESC LIMIT 1";
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

    $last_idx = em_insert('bb_preliminary_roi_pm', $array);

    $task_id = em_insert_order_task($task_type, 1, $last_idx);

    $telegram = getBaseDataTelegram(false, 8, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>8, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

$history = array('idx'=>$idx, 'task_type'=>7, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'idx' => $last_idx, 'RequestID' => $last_order, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;