<?php
$idx = $_REQUEST['idx'];
$nextStage = "";
$VALUES['ProductType'] = $_REQUEST['ProductType'];
$VALUES['ProductLine'] = $_REQUEST['ProductLine'];
$VALUES['bbb_sku'] = $_REQUEST['bbb_sku'];
$VALUES['core_sku'] = $_REQUEST['core_sku'];
$VALUES['oe_latest_sku'] = $_REQUEST['oe_latest_sku'];
$VALUES['oe_reman_sku'] = $_REQUEST['oe_reman_sku'];
$VALUES['Application'] = $_REQUEST['Application'];
$VALUES['Annualdemand'] = $_REQUEST['Annualdemand'];
$VALUES['SampleLocation'] = $_REQUEST['SampleLocation'];
$VALUES['process_id'] = $_REQUEST['process_id'];
$VALUES['purpose'] = $_REQUEST['purpose'];
$VALUES['details'] = $_REQUEST['details'];
$cell_number = $VALUES['cell_number'] = $_REQUEST['cell_number'];
$process_description =$VALUES['description'] = $_REQUEST['description'];
$VALUES['files'] = $_REQUEST['files'];
$capex_create = $VALUES['capex_create'] = $_REQUEST['capex_create'];
$operations = $_REQUEST['operations'];
$process_id = $VALUES['process_id'];
$VALUES_HEADER = em_get_update_header();
$VALUES_HEADER['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES_HEADER['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$draft =$VALUES_HEADER['draft'];
$RequestID = $_REQUEST['RequestID'];

$telegram = getBaseDataTelegram($idx, 19, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($process_id&&$process_id!=""){
    $query = "SELECT `operation_id`, `operation_number` FROM `bb_process_flow_content` WHERE `process_id` = ".$process_id;
if($stmt = $db->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($operation_id, $operation_number);
    while ($stmt->fetch()){
        $delArr[]= "`operation_id`=".$operation_id." AND `operation_number`='".$operation_number."' AND `RequestID`=".$_REQUEST['RequestID'];
    }
    $stmt->close();
    $arrayEl = array('tool','gage', 'equipment', 'workstation');
    for($j=0;$j<count($arrayEl); $j++){
        for($i=0;$i<count($delArr);$i++){
            $query = "DELETE FROM `bb_tasks_operation_".$arrayEl[$j]."` WHERE ".$delArr[$i];
            em_query($query);
        }
    }
    }
    $query = "DELETE FROM `bb_process_flow_content` WHERE `process_id` = ".$process_id;
    em_query($query);
}


$dataArr =  json_decode(stripcslashes($operations));
if($dataArr&&count($dataArr)!=0){
    $query = "SELECT COUNT(*) FROM `bb_process_flow` WHERE `id` = ".$process_id."";
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }

        
    $processArr = array('bbb_sku_id'=>$VALUES['bbb_sku'], 'cell_number'=>$cell_number, 'description'=>$process_description, 'create_date'=>date('Y-m-d H:i:s'), 'revision'=>'A');

        if($count>0){
            $where = "`id` = ".$process_id."";
            em_update('bb_process_flow',$processArr, $where);
        }
        else {
            $process_id = em_insert('bb_process_flow', $processArr);
            $VALUES['process_id'] =  $process_id;
        }

            for($i=0; $i<count($dataArr); $i++){
                $dataArr[$i] = (array)$dataArr[$i];
                $full=$dataArr[$i]['full']?$dataArr[$i]['full']:0;
                $query = "INSERT INTO `bb_process_flow_content` SET `operation_id` = ".$dataArr[$i]['id'].", `operation_number` = '".$dataArr[$i]['op_number']."', `process_id` = ".$process_id.", `full`=".$full;
                em_query($query);

                setOperationDetails($dataArr[$i]['tool'], 'tool', $dataArr[$i]['id'], $_REQUEST['RequestID'], $dataArr[$i]['op_number']);
                setOperationDetails($dataArr[$i]['gage'], 'gage', $dataArr[$i]['id'], $_REQUEST['RequestID'], $dataArr[$i]['op_number']);
                setOperationDetails($dataArr[$i]['equip'], 'equipment', $dataArr[$i]['id'], $_REQUEST['RequestID'], $dataArr[$i]['op_number']);
                setOperationDetails($dataArr[$i]['work_st'], 'workstation', $dataArr[$i]['id'], $_REQUEST['RequestID'], $dataArr[$i]['op_number']);
            }
}

if($draft ==1){
	$status = getStatusDraft();
}
else {
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $VALUES['CompletionDate'] = $CompletionDate;
    $capex['RequestID'] = $_REQUEST['RequestID'];
    $capex['RequestedDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $capex['process_id'] = $process_id;
    $capex['requested_by'] = $_REQUEST['AssignedTo'];
    $capex['ProductType'] =$VALUES['ProductType'];
    $capex['ProductLine'] =$VALUES['ProductLine'];
    $capex['bbb_sku'] =$VALUES['bbb_sku'];
    $capex['core_sku'] =$VALUES['core_sku'];
    $capex['oe_latest_sku'] =$VALUES['oe_latest_sku'];
    $capex['oe_reman_sku'] =$VALUES['oe_reman_sku'];
    $capex['id_user'] =$id_user;
    $query = "SELECT `AssignedTo` FROM `bb_process_design_request` WHERE `RequestID` = ".$capex['RequestID'];
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($AssignedTo);
            $stmt->fetch();
            $stmt->close();
        }

    $capex['AssignedTo']= $order_v['assignee'] = $AssignedTo;
    $capex['RequestedDate'] =  $order_v['requested_date'] = $order_v['assignment_date'] = $capex['AssignmentDate']= date('Y-m-d H:i:s');
    
    if($capex_create==1){
        $capex['purpose'] =  $VALUES['purpose'];
        $capex['details'] =  $VALUES['details'];
        $capex['analysis'] = $_REQUEST['analysis'];
        $query="SELECT `business_purpose`, `business_benefit`, `cost_center` FROM `bb_due_diligence` WHERE `RequestID` = ".$capex['RequestID'];
        $result = em_query($query);
        $row = $result->fetch_assoc();
        $result->close();
        $capex['business_purpose'] = $row['business_purpose'];
        $capex['business_benefit'] = $row['business_benefit'];
        $capex['cost_center'] = $row['cost_center'];

        $content = &$capex;
        $code = stripslashes(getPreScript(24));
        eval($code);

        $capex['AssignmentDate'] = $capex['RequestedDate'] = $CompletionDate;

        $last_idx = em_insert('bb_capex', $capex);
        $task_id1 = em_insert_order_task(24, 1, $last_idx, $order_v);

        $telegram1 = getBaseDataTelegram(false, 24, $RequestID, 1);
        $telegram1['current_assignee'] = $capex['AssignedTo'];
        $telegram1['current_responsible'] = $capex['Responsible'];
        $telegram1['task_id'] = $task_id1;
        TelegramManager($telegram1);

        $history = array('idx'=>$last_idx, 'task_type'=>24, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);

        $nextStage = "Capex Generated";
    }
    else {

        $content = &$capex;
        $code = stripslashes(getPreScript(25));
        eval($code);

        $capex['AssignmentDate'] = $capex['RequestedDate'] = $CompletionDate;

        $last_idx = em_insert('bb_purchasing_request', $capex);
        $task_id1 = em_insert_order_task(25, 1, $last_idx, $order_v);

        $telegram1 = getBaseDataTelegram(false, 25, $RequestID, 1);
        $telegram1['current_assignee'] = $capex['AssignedTo'];
        $telegram1['current_responsible'] = $capex['Responsible'];
        $telegram1['task_id'] = $task_id1;
        TelegramManager($telegram1);

        $history = array('idx'=>$last_idx, 'task_type'=>25, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);

        $nextStage = " Purchasing Request";
    }
}



$VALUES = array_merge($VALUES_HEADER, $VALUES);
$where1 = "`idx` = ".$idx."";
em_update('bb_process_design_start',$VALUES, $where1);
em_update_order_task($task_type = 19, $status);

$telegram['current_status'] = $status;
TelegramManager($telegram);

$history = array('idx'=>$idx, 'task_type'=>19, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft' => $draft,'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate);
echo json_encode($result);
$db->commit();
exit;
?>