<?php
$idx = $_REQUEST['idx'];
$VALUES['ProductType'] = $_REQUEST['ProductType'];
$VALUES['ProductLine'] = $_REQUEST['ProductLine'];
$VALUES['bbb_sku'] = $_REQUEST['bbb_sku'];
$VALUES['core_sku'] = $_REQUEST['core_sku'];
$VALUES['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
$VALUES['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
$VALUES['id_part_number'] = $_REQUEST['id_part_number'];
$VALUES['Application'] = $_REQUEST['Application'];
$VALUES['qty'] = $_REQUEST['qty'];
$VALUES['files'] = $_REQUEST['files'];
$VALUES['notes'] = $_REQUEST['notes'];
$VALUES['email'] = $_REQUEST['email'];
$VALUES['outsource_company'] = $_REQUEST['outsource_company'];
$RequestID =$_REQUEST['RequestID'];

$VALUES = array_merge($VALUES, em_get_update_header());
$VALUES = array_merge($VALUES, em_get_insert_header());
$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$draft =$VALUES['draft'];

$telegram = getBaseDataTelegram($idx, 17, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($draft == 1) {
    $where = " `idx` = ".$idx."";
    em_update('bb_'.$table, $VALUES, $where);
    $status = getStatusDraft();
    $reject = 0;
    em_update_order_task_ext(17, $status, $reject, $idx);

    $telegram['current_status'] = $status;
    TelegramManager($telegram);
    $telegram = array();

    $result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'id_part_number'=>$VALUES['id_part_number']);
    echo json_encode($result);
}
else {
    $reject=0;
    $status = 4;
    em_update_order_task_ext(17, $status, $reject, $idx);

    $telegram['current_status'] = $status;
    TelegramManager($telegram);
    $telegram = array();

    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $VALUES['CompletionDate'] = $CompletionDate;
    $where = " `idx` = ".$idx."";
    em_update('bb_'.$table, $VALUES, $where);

    $VALUES['hash']= md5(microtime());
    $VALUES['draft'] = 1;
    $query = "SELECT `reopen` FROM `bb_ppap_test_plan` WHERE `idx` = ".$idx;
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($reopen);
            $stmt->fetch();
            $stmt->close();
        }
    if($reopen==1){
        $VALUES['reopen']= 1;
    }

    unset($VALUES['CompletionDate']);
    unset($VALUES['DueDate']);
    //$VALUES['RequestedDate']= date("Y-m-d H:i:s");

    /*$query = "SELECT `AssignedTo` FROM `bb_npd_request` WHERE `RequestID` = ".$RequestID;
            if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($AssignedTo);
                $stmt->fetch();
                $stmt->close();
            }

    $VALUES['AssignedTo']= $order_v['assignee'] = $AssignedTo;*/
    $VALUES['Responsible']= $order_v['assigned_by'] =$_REQUEST['Responsible'];
    $VALUES['AssignedTo']= $order_v['assignee'] = $_REQUEST['AssignedTo'];
    $VALUES['RequestedDate'] =  $VALUES['AssignmentDate']= transform_complit_date(gmdate("Y-m-d H:i:s"));
    $order_v['requested_date'] = $order_v['assignment_date'] = date('Y-m-d H:i:s');

    /*$content = &$VALUES;
    $code = stripslashes(getPreScript(36));
    eval($code);*/

    $VALUES['AssignmentDate'] = $VALUES['RequestedDate'] = $CompletionDate;

    $outId_task = em_insert('bb_ppap_review', $VALUES);
    $task_id =em_insert_order_task(36, 1, $outId_task, $order_v);
    $history = array('idx'=>$outId_task, 'task_type'=>36, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);

    $query = "UPDATE `bb_bom_components` SET `task_type` = 36, `ppap_review_id` = ".$outId_task." WHERE  `ppap_task_id`= ".$idx." AND `task_type` = 17";
    em_query($query);

    em_update('bb_components', array('comp_status'=>0, 'ppap_task_id'=>$task_id, 'task_type'=>36), " `id` = '".$VALUES['id_part_number']."'");

    $telegram = getBaseDataTelegram(false, 36, $RequestID, 1);
    $telegram['current_assignee'] = $VALUES['AssignedTo'];
    $telegram['current_responsible'] = $VALUES['Responsible'];
    $telegram['task_id'] = $task_id;
    TelegramManager($telegram);

    $path = substr($_SERVER['PHP_SELF'],0,strrpos($_SERVER['PHP_SELF'],"/"));
    //$link = "<a href='http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?task=".$outId_task."&hash=".$VALUES['hash']."'>http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?task=".$outId_task."&hash=".$VALUES['hash']."</a>";
    $link = "<b><p>PPAP TEST OUT has been sent to you Request ID: ".$RequestID."</p></b></br></br><a href='http://".$_SERVER['HTTP_HOST'].$path."/ppap_testout.php?task=".$outId_task."&hash=".$VALUES['hash']."' style='text-decoration: none;'><b><span style='font-size: 16px; color: #000;'><b><span style='color: #fff; display: block; padding: 6px; background: #4169E1; text-align: center; border: 2px solid #000; border-radius: 5px;'>GO TO TASK</span></b></a>";
    $subject = "PPAP Test Plan";
    $headers = "From: \"web\" <bbbinfo@vvtrack.com>\r\n"."Content-Type: text/html; charset=\"utf-8\"\r\n";
    smtpmail($VALUES['email'], $subject, $link, $headers);

    $nextStage = " Out for PPAP";

     $history = array('idx'=>$idx, 'task_type'=>17, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
    setHistoryRecord($history);

    $result = array('success' => true, 'Status' => $status, 'draft' => $draft,'nextStage' => $nextStage, 'link'=> $link, 'id_part_number'=>$VALUES['id_part_number'], 'CompletionDate'=> $CompletionDate);
    echo json_encode($result);
}
$db->commit();
exit;