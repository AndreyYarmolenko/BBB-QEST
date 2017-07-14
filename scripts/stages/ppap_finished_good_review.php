<?php
    include "../lang/langs.php";

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
$VALUES['notes'] = $_REQUEST['notes'];
$VALUES['email'] = $_REQUEST['email'];
$VALUES['files'] = $_REQUEST['files'];
$VALUES['outsource_company'] = $_REQUEST['outsource_company'];

$VALUES = array_merge($VALUES, em_get_update_header());
$VALUES = array_merge($VALUES, em_get_insert_header());
$VALUES['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$draft =$VALUES['draft'];
$RequestID =$_REQUEST['RequestID'];

$telegram = getBaseDataTelegram($idx, 40, $RequestID, $draft);
$old_data = getOldData($table, $idx);

$query = "SELECT `dim_test`, `func_test` FROM `bb_ppap_finished_good_review` WHERE `RequestID` = ".$_REQUEST['RequestID'];
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($dim_test, $func_test);
        $stmt->fetch();
        $stmt->close();
    }

if($draft == 1) {
    $where = " `idx` = ".$idx."";
    em_update('bb_'.$table, $VALUES, $where);
    $status = getStatusDraft();
    $reject = 0;

    $telegram['current_status'] = $status;
    TelegramManager($telegram);

    em_update_order_task_ext(40, $status, $reject, $idx);
    $result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'id_part_number'=>$VALUES['id_part_number'], 'dim_test'=>$dim_test, 'func_test'=>$func_test);
}
else {
    if($VALUES['ProductType']==2){
        $count = 0;
    }
    else {
        $query ="SELECT COUNT(*) FROM `bb_components`
                WHERE `id` IN (SELECT GROUP_CONCAT(`component_id`) FROM `bb_bom_components`
                WHERE `bom_id`  = (SELECT `id` FROM `bb_bom` WHERE `bbb_sku_id` =".$VALUES['bbb_sku']." ORDER BY `id` DESC LIMIT 1)
                AND `component_id` <> ".$VALUES['id_part_number'].")
                AND `comp_status` <> 1";
       /* $query = "SELECT COUNT(*) FROM bb_bom_components bc
        WHERE `bom_id` = (SELECT `id` FROM `bb_bom` WHERE `bbb_sku_id` =".$VALUES['bbb_sku']." ORDER BY `id` DESC LIMIT 1) AND `ppap_result` <>1 AND `component_id` <>".$VALUES['id_part_number'];*/

        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }
    }
    
    if($count>0){
        $result = array('success' => false, 'message' => $answers['not_all_prev_ppap_completed']);
    }
    else {
        $status = 4;
    if($draft == 0) {
        $reject=1;
        //set sign approve to component
        $query = "UPDATE `bb_bom_components` SET `ppap_result` = 1 WHERE  `ppap_review_id`= ".$idx." AND `task_type` = 40";
        em_query($query);

        /*$query = "UPDATE `bb_components` SET `comp_status` = 1, `ppap_complete` =1 WHERE  `id`= ".$VALUES['id_part_number'];
            em_query($query);*/
        em_update('bb_components', array('comp_status'=>1, 'ppap_complete'=>1), " `id` = '".$VALUES['id_part_number']."'");

        if($count == 0){//set approve date if all components approved
            $query = "UPDATE `bb_bom` SET `approved_date` = '".date('Y-m-d H:i:s')."' WHERE  `id` = (SELECT `bom_id` FROM `bb_bom_components` WHERE `task_type` = 40 AND `ppap_task_id` = ".$idx.")";
            em_query($query);
        }
        em_update('bb_order', array('request_status'=>3, 'completion_date'=>date('Y-m-d H:i:s'), 'completed_by'=>$id_user), '`order_id`='.$RequestID);
        
        $nextStage = $answers['ppap_approved'];;
    }
    else {
        $reject=2;
        $nextStage = $answers['and_reopen'];
        $array_ppap['id_part_number'] = $VALUES['id_part_number'];
        $array_ppap['qty'] = $VALUES['qty'];
        $array_ppap['RequestedDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
        $array_ppap['RequestID'] = $VALUES['RequestID'];
        $array_ppap['id_user'] = $id_user;
        $array_ppap['ProductType'] =$VALUES['ProductType'];
        $array_ppap['ProductLine'] =$VALUES['ProductLine'];
        $array_ppap['bbb_sku'] =$VALUES['bbb_sku'];
        $array_ppap['core_sku'] =$VALUES['core_sku'];
        $array_ppap['oe_latest_sku'] =$VALUES['oe_latest_sku'];
        $array_ppap['oe_reman_sku'] =$VALUES['oe_reman_sku'];
        $array_ppap['Application'] =$VALUES['Application'];
        $array_ppap['files'] =$VALUES['files'];
        $array_ppap['reopen'] =1;

        $query = "SELECT `AssignedTo` FROM `bb_npd_request` WHERE `RequestID` = ".$RequestID;
            if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($AssignedTo);
                $stmt->fetch();
                $stmt->close();
            }

        $array_ppap['AssignedTo']= $order_v['assignee'] = $AssignedTo;
        $array_ppap['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $array_ppap['AssignmentDate']= date('Y-m-d H:i:s');

        $content = &$array_ppap;
        $code = stripslashes(getPreScript(39));
        eval($code);

        $array_ppap['RequestedDate'] = $array_ppap['AssignmentDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));

        $outId_task = em_insert('bb_ppap_finished_good', $array_ppap);
        $task_id1 = em_insert_order_task(39, 1, $outId_task, $order_v);

        $query = "UPDATE `bb_bom_components` SET `task_type` = 39, `ppap_task_id` = ".$outId_task.", `ppap_result` = 2 WHERE  `ppap_review_id`= ".$idx." AND `task_type` = 40";
        em_query($query);

        /*$query = "UPDATE `bb_components` SET `comp_status` = 2 WHERE  `id`= ".$VALUES['id_part_number'];
        em_query($query);*/

        em_update('bb_components', array('comp_status'=>2, 'ppap_task_id'=>$task_id1, 'task_type'=>39), "`id`= ".$VALUES['id_part_number']);

        $telegram1 = getBaseDataTelegram(false, 39, $RequestID, 1);
        $telegram1['current_assignee'] = $array_ppap['AssignedTo'];
        $telegram1['current_responsible'] = $array_ppap['Responsible'];
        $telegram1['task_id'] = $task_id1;
        TelegramManager($telegram1);

        $history = array('idx'=>$outId_task, 'task_type'=>39, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);
    }
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $VALUES['CompletionDate'] = $CompletionDate;
    $where = " `idx` = ".$idx."";

    em_update('bb_'.$table, $VALUES, $where);
    if($VALUES['bbb_sku']&&$VALUES['bbb_sku']!==""){
        em_update('bb_bbb_sku', array('sku_status'=>$reject), " `id`=".$VALUES['bbb_sku']);
    }

    $telegram['current_status'] = $status;
    TelegramManager($telegram);
    
    em_update_order_task_ext(40, $status, $reject, $idx);
    $result = array('success' => true, 'Status' => $status, 'draft' => $draft,'nextStage' => $nextStage, 'id_part_number'=>$VALUES['id_part_number'], 'dim_test'=>$dim_test, 'func_test'=>$func_test, 'CompletionDate'=> $CompletionDate);
    
    }
}

 $history = array('idx'=>$idx, 'task_type'=>40, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);
echo json_encode($result);
$db->commit();
exit;