<?php
$VALUES['ProductType'] = $_REQUEST['ProductType'];
$VALUES['ProductLine'] = $_REQUEST['ProductLine'];
$VALUES['bbb_sku'] = $_REQUEST['bbb_sku'];
$VALUES['core_sku'] = $_REQUEST['core_sku'];
$VALUES['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
$VALUES['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
$VALUES['Application'] = $_REQUEST['Application'];
$VALUES_HEADER = em_get_update_header();
$VALUES_HEADER['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES_HEADER['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);

$bom['ProductType'] = $VALUES['ProductType'];
$bom['ProductLine'] = $VALUES['ProductLine'];
$bom['sku_id'] = $VALUES['bbb_sku'];
$bom['bom']  = $_REQUEST['bom'];
$bom['bom_id'] = $_REQUEST['bom_id'];
$bom_result =  saveBOM($bom, 'edit', 'task');

$draft = $VALUES_HEADER['draft'];
$RequestID = $VALUES_HEADER['RequestID'];
$idx = $_REQUEST['idx'];

$telegram = getBaseDataTelegram($idx, 14, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($draft == 1) {
    $status = getStatusDraft($data);
    em_update_order_task(14, $status, $reject=0);

    $telegram['current_status'] = $status;
    TelegramManager($telegram);
    $telegram = array();

    $result = array('success' => true, 'Status' => $status, 'draft' => $draft);
}
elseif($draft == 0) {
    //проверяем статус eps production
    $query = "SELECT `status` FROM bb_order_tasks WHERE `order_id` = $RequestID AND `task_type` = 45";
    $stmt = $db->query($query);
    while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
        $eps_status = $tmp['status'];
    }               
    $stmt->close();
    if($eps_status != 4 && $eps_status != null) {
        $nextStage = "Before this action, you must finished EPS Production Software!";
        $status = $_REQUEST['Status'];
        $draft = 1;
        $result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
        echo json_encode($result);
        exit;
    }
	else {
        $query = "SELECT `AssignedTo` FROM `bb_npd_request` WHERE `RequestID` = ".$RequestID;
            if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($AssignedTo);
                $stmt->fetch();
                $stmt->close();
            }

        $nextStage = "";
        $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
        $VALUES['CompletionDate'] =$CompletionDate;
        em_update_order_task(14, $status = 4, $reject=0);

        $telegram['current_status'] = $status;
        TelegramManager($telegram);
        $telegram = array();

        $bom_data= json_decode(stripcslashes($bom['bom']));
        if($VALUES['ProductType']!=2){
            for ($i=0; $i < count($bom_data); $i++) {
                $array_ppap = array();
                $bom_data[$i] = (array)$bom_data[$i];
                $id_comp =$bom_data[$i]['id'];
                $query = "SELECT `comp_type` FROM `bb_components` WHERE `id` = ".$id_comp."";
                if ($stmt = $db->prepare($query)) {
                    $stmt->execute();
                    $stmt->bind_result($comp_type);
                    $stmt->fetch();
                    $stmt->close();
                }
                $ppap = (int)$bom_data[$i]['ppap'];

                 if($ppap==0&&(int)$comp_type!=1){
                    em_update('bb_components', array('comp_status'=>1), "`id` = '".$id_comp."'");
                }
                
                if($ppap > 0&&(int)$comp_type!=1){
                    $array_ppap['id_part_number'] = $id_comp;
                    $array_ppap['qty'] = $ppap;//ppap qty
                    //$array_ppap['RequestedDate'] = date('Y-m-d H:i:s');
                    $array_ppap['RequestID'] = $RequestID;
                    $array_ppap['id_user'] = $id_user;
                    unset($VALUES['CompletionDate']);
                    $array_ppap = array_merge($VALUES, $array_ppap);

                    $array_ppap['AssignedTo']= $order_v['assignee'] = $AssignedTo;
                    $array_ppap['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $array_ppap['AssignmentDate']= date('Y-m-d H:i:s');

                    $content = &$array_ppap;
                    $code = stripslashes(getPreScript(17));
                    eval($code);

                    $array_ppap['AssignmentDate'] = $array_ppap['RequestedDate'] = $CompletionDate;

                    $outId_task = em_insert('bb_ppap_test_plan', $array_ppap);
                    $task_id= em_insert_order_task(17, 1, $outId_task, $order_v);

                    $query = "UPDATE `bb_bom_components` SET `task_type` = 17, `ppap_task_id` = ".$outId_task.", `ppap_result` = 0 WHERE `bom_id` =".$bom_result['bom_id']." AND `component_id`= ".$id_comp;
                    em_query($query);

                    em_update('bb_components', array('comp_status'=>0, 'ppap_task_id'=>$task_id, 'task_type'=>17), "`id` = '".$id_comp."'");

                    $telegram = getBaseDataTelegram(false, 17, $RequestID, 1);
                    $telegram['current_assignee'] = $array_ppap['AssignedTo'];
                    $telegram['current_responsible'] =$array_ppap['Responsible'];
                    $telegram['task_id'] = $task_id;
                    TelegramManager($telegram);

                    $history = array('idx'=>$outId_task, 'task_type'=>17, 'status'=>1, 'id_user'=>$id_user);
                    setHistoryRecord($history);

                    $nextStage = 'PPAP Test Plan';
                }
                elseif($nextStage!='PPAP Test Plan') {$nextStage = 'Task Completed';}
            }

            
                $query = "SELECT `Annualdemand`, `SampleLocation` FROM `bb_npd_request` WHERE `RequestID` = ".$RequestID."";
                if ($stmt = $db->prepare($query)) {
                    $stmt->execute();
                    $stmt->bind_result($Annualdemand, $SampleLocation);
                    $stmt->fetch();
                    $stmt->close();
                }
                $process_design_request = $VALUES;
                $process_design_request['core_sku'] = getCoreSku();
                $process_design_request['RequestID'] = $RequestID;
                $process_design_request['Annualdemand'] = $Annualdemand;
                $process_design_request['SampleLocation'] = $SampleLocation;
                $process_design_request['id_user'] = $id_user;

                $process_design_request['AssignedTo']= $order_v['assignee'] = $AssignedTo;
                $process_design_request['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $process_design_request['AssignmentDate']= date('Y-m-d H:i:s');

                $content = &$process_design_request;
                $code = stripslashes(getPreScript(18));
                eval($code);

                $process_design_request['AssignmentDate'] = $process_design_request['RequestedDate'] = $CompletionDate;
                unset($process_design_request['CompletionDate']);

                $outId_task = em_insert('bb_process_design_request', $process_design_request);
                $task_id = em_insert_order_task(18, 1, $outId_task, $order_v);

                $telegram = getBaseDataTelegram(false, 18, $RequestID, 1);
                $telegram['current_assignee'] = $process_design_request['AssignedTo'];
                $telegram['current_responsible'] = $process_design_request['Responsible'];
                $telegram['task_id'] = $task_id;
                TelegramManager($telegram);

                $history = array('idx'=>$outId_task, 'task_type'=>18, 'status'=>1, 'id_user'=>$id_user);
                setHistoryRecord($history);

                if($nextStage !=""){
                    $nextStage .= ' AND Process Design Request';
                }
                else {
                    $nextStage = ' Process Design Request';
                }
                
        }
        else {
            for ($i=0; $i < count($bom_data); $i++) {
                $array_ppap = array();
                $bom_data[$i] = (array)$bom_data[$i];
                $id_comp =$bom_data[$i]['id'];
                $query = "SELECT `comp_type` FROM `bb_components` WHERE `id` = ".$id_comp."";
                if ($stmt = $db->prepare($query)) {
                    $stmt->execute();
                    $stmt->bind_result($comp_type);
                    $stmt->fetch();
                    $stmt->close();
                }
                $ppap = (int)$bom_data[$i]['ppap'];
                if($ppap > 0&&(int)$comp_type==1){
                    $array_ppap['id_part_number'] = $id_comp;
                    $array_ppap['qty'] = $ppap;
                    //$array_ppap['RequestedDate'] = date('Y-m-d H:i:s');
                    $array_ppap['RequestID'] = $RequestID;
                    $array_ppap['id_user'] = $id_user;
                    unset($VALUES['CompletionDate']);
                    $array_ppap = array_merge($VALUES, $array_ppap);

                    $array_ppap['AssignedTo']= $order_v['assignee'] = $AssignedTo;
                    $array_ppap['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $array_ppap['AssignmentDate']= date('Y-m-d H:i:s');

                    $content = &$array_ppap;
                    $code = stripslashes(getPreScript(39));
                    eval($code);

                    $array_ppap['AssignmentDate'] = $array_ppap['RequestedDate'] = $CompletionDate;

                    $outId_task = em_insert('bb_ppap_finished_good', $array_ppap);
                    $task_id = em_insert_order_task(39, 1, $outId_task, $order_v);

                    $query = "UPDATE `bb_bom_components` SET `task_type` = 39, `ppap_task_id` = ".$outId_task.", `ppap_result` = 0 WHERE `bom_id` =".$bom_result['bom_id']." AND `component_id`= ".$id_comp;
                    em_query($query);

                    em_update('bb_components', array('comp_status'=>0, 'ppap_task_id'=>$task_id, 'task_type'=>39), " `id` = '".$id_comp."'");

                    $telegram = getBaseDataTelegram(false, 39, $RequestID, 1);
                    $telegram['current_assignee'] = $array_ppap['AssignedTo'];
                    $telegram['current_responsible'] = $array_ppap['Responsible'];
                    $telegram['task_id'] = $task_id;
                    TelegramManager($telegram);

                    $history = array('idx'=>$outId_task, 'task_type'=>39, 'status'=>1, 'id_user'=>$id_user);
                    setHistoryRecord($history);

                    $nextStage = 'Finished Good BBB SKU PPAP Validation';
                }
                
            }
        }

        $result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
    }
}



$VALUES['SampleCorrectOE'] = $_REQUEST['SampleCorrectOE'];
$VALUES['SampleCorrectCore'] = $_REQUEST['SampleCorrectCore'];
$VALUES['tagNumOE'] = $_REQUEST['tagNumOE'];
$VALUES['tagNumCore'] = $_REQUEST['tagNumCore'];
$VALUES['bom_id'] = $bom_result['bom_id'];
$VALUES_FULL = array_merge($VALUES, $VALUES_HEADER);
if($draft == 0) $VALUES_FULL['CompletionDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
$where = " `idx` = ".$idx."";

em_update('bb_'.$table, $VALUES_FULL, $where);

$history = array('idx'=>$idx, 'task_type'=>14, 'status'=>$status, 'bom_id'=>$VALUES['bom_id'], 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

echo json_encode($result);
$db->commit();
exit;