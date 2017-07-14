<?php
$idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$where_pdr = 'idx = '.$idx;
$pdr = em_get_update_header();
$pdr['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$pdr['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);

$telegram = getBaseDataTelegram($idx, 18, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if ($draft == 1){
    $status = getStatusDraft();
}
else {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $nextStage = "Process Design";

    $query = "SELECT `RequestID`, `ProductLine`, `ProductType`, `bbb_sku`, `oe_latest_sku`, `Application`, `SampleLocation`, `Annualdemand`
                FROM `bb_process_design_request`
                WHERE `RequestID` = ".$RequestID;

    $result_q = em_query($query);
    $row = $result_q->fetch_assoc();
    $result_q->close();
    
    $row['oe_reman_sku'] = getRemanSku();
    $row['core_sku'] = getCoreSku();
   /* $row['id_user'] = $id_user;
    $row['RequestedDate'] = $CompletionDate;

    $pds = $row;*/
    $VALUES = em_get_insert_header();
    $VALUES['AssignedTo'] = $order_v['assignee'] = $_REQUEST['AssignedTo'];
    $VALUES['AssignmentDate'] = $order_v['assignment_date'] = $_REQUEST['AssignmentDate'];
    $VALUES['RequestedDate'] =  $order_v['requested_date'] = $_REQUEST['RequestedDate'];
    $pds = array_merge($VALUES, $row);


    $content = &$pds;
    $code = stripslashes(getPreScript(19));
    eval($code);

    $pds['AssignmentDate'] = $pds['RequestedDate'] = $CompletionDate;

    $last_idx = em_insert('bb_process_design_start', $pds);
    $task_id = em_insert_order_task(19, 1, $last_idx, $order_v);


    /*$content = &$pds;
    $code = stripslashes(getPreScript(19));
    eval($code);

    $last_idx = em_insert('bb_process_design_start', $pds);
    $task_id = em_insert_order_task(19, 1, $last_idx);*/

    $telegram1 = getBaseDataTelegram(false, 19, $RequestID, 1);
    $telegram1['current_assignee'] = $pds['AssignedTo'];
    $telegram1['current_responsible'] = $pds['Responsible'];
    $telegram1['task_id'] = $task_id;
    TelegramManager($telegram1);

    $history = array('idx'=>$last_idx, 'task_type'=>19, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);
}

$pdr['CompletionDate'] = $CompletionDate;
em_update('bb_process_design_request', $pdr, $where_pdr);
em_update_order_task(18, $status);

$telegram['current_status'] = $status;
TelegramManager($telegram);

$history = array('idx'=>$idx, 'task_type'=>18, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'RequestID' => $RequestID, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;