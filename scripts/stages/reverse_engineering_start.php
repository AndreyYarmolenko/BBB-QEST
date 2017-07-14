<?php
$idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$nextStage = "";
$CompletionDate = null;
$task_type = 11;

$telegram = getBaseDataTelegram($idx, $task_type, $RequestID, $draft);
$old_data = getOldData($table, $idx);


$res = em_get_update_header();
$res['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$res['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$res['SampleCorrectOE'] = $_REQUEST['SampleCorrectOE'];
$res['SampleCorrectCore'] = $_REQUEST['SampleCorrectCore'];
$res['tagNumCore'] = $_REQUEST['tagNumCore'];
$res['tagNumOE'] = $_REQUEST['tagNumOE'];
$res['ProductFamily'] = $_REQUEST['ProductFamily'];
$res['PartMarking'] = $_REQUEST['PartMarking'];
$res['pack_req'] = $_REQUEST['pack_req'];


if($draft==0){
    $check_tabs = checkResTables($RequestID);
    if($check_tabs['success']!=true){
        $result = array('success' => false, 'message'=>$check_tabs['message']);
    }
    else {
        $status = 4;
        $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
        $res['CompletionDate'] = $CompletionDate;
        $nextStage = "Reverse Engineering";
        $r_eng = em_get_insert_header();
        $r_eng['oe_reman_sku'] = getRemanSku();
        $r_eng['core_sku'] = getCoreSku();
        $r_eng['ProductLine'] = $_REQUEST['ProductLine'];
        $r_eng['ProductType'] = $_REQUEST['ProductType'];
        $r_eng['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
        $r_eng['Application'] = $_REQUEST['Application'];
        $r_eng['SampleCorrectOE'] = $res['SampleCorrectOE'];
        $r_eng['SampleCorrectCore'] = $res['SampleCorrectCore'];
        $r_eng['tagNumCore'] = $res['tagNumCore'];
        $r_eng['tagNumOE'] = $res['tagNumOE'];
        $r_eng['bbb_sku'] = $_REQUEST['bbb_sku'];


        $r_eng['AssignedTo'] = $order_v['assignee'] = $res['AssignedTo'];
        $r_eng['AssignmentDate'] = $order_v['assignment_date'] = $CompletionDate;
        $r_eng['RequestedDate'] =  $order_v['requested_date'] = transform_create_date($CompletionDate);

        $content = &$array;
        $code = stripslashes(getPreScript(14));
        eval($code);

        $r_eng['AssignmentDate'] = $CompletionDate;
        $r_eng['RequestedDate'] = $CompletionDate;

        $last_idx = em_insert('bb_reverse_engineering', $r_eng);
        $task_id=em_insert_order_task(14, 1, $last_idx, $order_v);
        
        $telegram = getBaseDataTelegram(false, 14, $RequestID, 1);
        $telegram['current_assignee'] = $r_eng['AssignedTo'];
        $telegram['current_responsible'] = $r_eng['Responsible'];
        $telegram['task_id'] = $task_id;
        TelegramManager($telegram);

        $history = array('idx'=>$last_idx, 'task_type'=>14, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);

        $result = array('success' => true, 'Status' => $status, 'idx' => $idx, 'RequestID' =>$RequestID, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'ProductFamily'=>$res['ProductFamily']);
    }
}
else{
    $status = getStatusDraft();
    $result = array('success' => true, 'Status' => $status, 'idx' => $idx, 'RequestID' =>$RequestID, 'draft' => $draft, 'nextStage' => "", 'CompletionDate'=> null, 'ProductFamily'=>$res['ProductFamily']);
}

if($result['success']===true){
    $where = 'idx = '.$idx;
    em_update('bb_reverse_engineering_start', $res, $where);
    em_update_order_task($task_type, $status);

    $telegram['current_status'] = $status;
    TelegramManager($telegram);

    $history = array('idx'=>$idx, 'task_type'=>11, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
    setHistoryRecord($history);
}

echo json_encode($result);
$db->commit();
exit;