<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:50
 */
include '../lang/langs.php';

$draft = $_REQUEST['draft_id'];
$idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];

$telegram = getBaseDataTelegram($idx, 5, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$array1['ValidationCapability'] =  $_REQUEST['ValidationCapability'];
$array1['notes1'] =  $_REQUEST['notes1'];

$array1['RFEngineeringCapability'] =   $_REQUEST['RFEngineeringCapability'];
$array1['notes2'] =  $_REQUEST['notes2'];

$array2['ProductLine'] = $_REQUEST['ProductLine'];
$array2['ProductType'] =  $_REQUEST['ProductType'];
$array2['bbb_sku'] = $_REQUEST['bbb_sku'];
$array2['oe_latest_sku'] =  $_REQUEST['oe_latest_sku'];
$array2['core_sku'] =   $_REQUEST['core_sku'];
$array2['oe_reman_sku'] =   $_REQUEST['oe_reman_sku'];
$array2['Application'] =  $_REQUEST['Application'];
$array2['Annualdemand'] =  $_REQUEST['Annualdemand'];

$array2['SampleLocation'] =   $_REQUEST['SampleLocation'];

$array_full = array_merge($array, $array1, $array2);
$where = 'idx = '.$idx;
$CompletionDate = null;
$nextStage ='';
$task_type = 5;

if ($draft == 0){
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $array_full['CompletionDate'] = $CompletionDate;

}else{
    $status = getStatusDraft();
}

em_update('bb_feasibility_product_eng',$array_full, $where);

// UPDATE bb_order_task
em_update_order_task($task_type, $status);
// <---------------------------

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();


if ($draft == 0){
    if ($_REQUEST['RFEngineeringCapability'] && $_REQUEST['ValidationCapability']){
        $array = null;
        $array = em_get_insert_header();

        // / Выбираем значения из базы, для устранения возможной подмены данных в формах
        $query = "SELECT dd.ProductLine, dd.ProductType,sp.bbb_sku, dd.oe_latest_sku,
                        ner.Application, sp.SampleLocation, dd.Annualdemand
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


        $array = array_merge($array, $row);
        $task_type = 6;
        $nextStage = $tasks['6'];

        $content = &$array;
        $code = stripslashes(getPreScript($task_type));
        eval($code);

        //переопределяем в метку
        $array['AssignmentDate'] = $CompletionDate;
        $array['RequestedDate'] = $CompletionDate;

        $last_idx = em_insert('bb_feasibility_process_eng', $array);

        $task_id = em_insert_order_task($task_type, 1, $last_idx);
        $telegram = getBaseDataTelegram(false, 6, $RequestID, 1);
        $telegram['current_assignee'] = $array['AssignedTo'];
        $telegram['current_responsible'] = $array['Responsible'];
        $telegram['task_id'] = $task_id;
        TelegramManager($telegram);

        $history = array('idx'=>$last_idx, 'task_type'=>6, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);
    }else{
        em_update('bb_order', array('request_status'=>4, 'completion_date'=>date('Y-m-d H:i:s'), 'completed_by'=>$id_user), '`order_id`='.$RequestID);
        $nextStage = $answers['not_feasible'];
    }
}

$history = array('idx'=>$idx, 'task_type'=>5, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);
$result = array('success' => true, 'Status' => $status, 'draft'=>$draft, 'nextStage'=>$nextStage, 'CompletionDate'=>$CompletionDate);
echo json_encode($result);
$db->commit();
exit;