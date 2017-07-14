<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:52
 */
$idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$reject = false;
$PreliminaryROIApproval = null;
$last_order = null;
$nextStage = "";
$CompletionDate = null;
$PreliminaryROIApprover = null;
$PreliminaryROIApprovalDate = null;
$task_type = 8;

$telegram = getBaseDataTelegram($idx, 8, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($draft == 3) {
    $reject = true;
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $PreliminaryROIApproval = 0;
    $PreliminaryROIApprover =  $id_user;
    $PreliminaryROIApprovalDate = $CompletionDate;
    $array['PreliminaryROIApprover'] = $PreliminaryROIApprover;
    $array['PreliminaryROIApprovalDate'] = $PreliminaryROIApprovalDate;
    $array['PreliminaryROIApproval'] = $PreliminaryROIApproval;
    em_update('bb_order', array('request_status'=>4, 'completion_date'=>date('Y-m-d H:i:s'), 'completed_by'=>$id_user), '`order_id`='.$RequestID);
}

if ($draft == 1){
    $status = getStatusDraft();
}
$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);

if($_REQUEST['draft_id'] == 0) {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    if (!$reject){
        $PreliminaryROIApproval = 1;
        $PreliminaryROIApprover =  $id_user;
        $PreliminaryROIApprovalDate = $CompletionDate;
        $array['PreliminaryROIApprover'] = $PreliminaryROIApprover;
        $array['PreliminaryROIApprovalDate'] = $PreliminaryROIApprovalDate;
    }
    $array['PreliminaryROIApproval'] = $PreliminaryROIApproval;
}


$array['CorePurchaseCostPerUnit'] = $_REQUEST['CorePurchaseCostPerUnit'];
$array['GrossProfitPerUnit'] = $_REQUEST['GrossProfitPerUnit'];
$array['AnnualizedInvestmentAmortization'] = $_REQUEST['AnnualizedInvestmentAmortization'];
$array['FirstYearGrossProfit'] = $_REQUEST['FirstYearGrossProfit'];
$array['YearFiveGrossProfit'] = $_REQUEST['YearFiveGrossProfit'];
$array['PreliminaryROI'] = $_REQUEST['PreliminaryROI'];

$array['PreliminaryROIComment'] = $_REQUEST['PreliminaryROIComment'];
//$array['PreliminaryROIApprover'] = $_REQUEST['PreliminaryROIApprover'];
//$array['PreliminaryROIApprovalDate'] = $_REQUEST['PreliminaryROIApprovalDate'];

$array['CompletionDate'] = $CompletionDate;
$where = 'idx = '.$idx;

em_update('bb_'.$table, $array, $where);

// UPDATE bb_order_task
em_update_order_task($task_type, $status, $reject);
// <---------------------------

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();


if ($draft == 0 && !$reject){
    $array = null;
    $task_type = 9;
    $nextStage = 'NPD Request';

    $array = em_get_insert_header();

    /*$array['RequestID'] = $_REQUEST['RequestID'];
    $array['id_user'] = $id_user;*/
    /*$array['ProductLine'] = $_REQUEST['ProductLine'];
    $array['ProductType'] = $_REQUEST['ProductType'];
    $array['bbb_sku'] = $_REQUEST['bbb_sku'];
    $array['core_sku'] = $_REQUEST['core_sku'];
    $array['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
    $array['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
    $array['Application'] = $_REQUEST['Application'];
    $array['Annualdemand'] = $_REQUEST['Annualdemand'];*/

    // Выбираем значения из базы, для устранения возможной подмены данных в формах
    $query = "SELECT dd.ProductLine, ner.ProductType, sp.bbb_sku, dd.oe_latest_sku,
                          /*dd.oe_reman_sku, dd.core_sku, */ner.Application, sp.SampleLocation, ner.Annualdemand
                        FROM bb_new_engineering_req ner
                        LEFT JOIN bb_due_diligence dd ON ner.RequestID = dd.RequestID
                        LEFT JOIN bb_sample_procurement sp ON ner.RequestID = sp.RequestID
                        LEFT JOIN bb_new_product_line npl ON ner.RequestID = npl.RequestID
                        WHERE ner.RequestID = ".$RequestID." 
                        ORDER BY sp.idx DESC LIMIT 1";
    $result = em_query($query);
    $row = $result->fetch_assoc();
    $result->close();
    $row['oe_reman_sku'] = getRemanSku();
    $row['core_sku'] = getCoreSku();
    // <---------------------------------

    $array = array_merge($array, $row);

    $content = &$array;
    $code = stripslashes(getPreScript($task_type));
    eval($code);

    //переопределяем в метку
    $array['AssignmentDate'] = $CompletionDate;
    $array['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_npd_request', $array);

    $task_id = em_insert_order_task($task_type, 1, $last_idx);

    $telegram = getBaseDataTelegram(false, 9, $RequestID, 1);
    $telegram['current_assignee'] = $array['AssignedTo'];
    $telegram['current_responsible'] = $array['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $history = array('idx'=>$last_idx, 'task_type'=>9, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

$history = array('idx'=>$idx, 'task_type'=>8, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=>$CompletionDate, 'PreliminaryROIApproval'=> $PreliminaryROIApproval, 'PreliminaryROIApprovalDate'=>$PreliminaryROIApprovalDate, 'PreliminaryROIApprover'=>$PreliminaryROIApprover);
echo json_encode($result);
$db->commit();
exit;