<?php
include "../lang/langs.php ";

$idx = $_REQUEST['idx'];
$draft = $_REQUEST['draft_id'];
$RequestID = $_REQUEST['RequestID'];

$VALUES_HEADER = em_get_update_header();
$VALUES_HEADER['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$VALUES_HEADER['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$VALUES['estimate_assets'] = $_REQUEST['estimate_assets'];
$VALUES['cost_center'] = $_REQUEST['cost_center'];
$VALUES['included_capex'] = $_REQUEST['included_capex'];
$projectEl = $_REQUEST['projectEl'];
$VALUES_FULL = array_merge($VALUES_HEADER, $VALUES);

$telegram = getBaseDataTelegram($idx, 24, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if($draft == 1) {
    $status = getStatusDraft();
    em_update_order_task(24, $status, $reject=0);
    $where = " `idx` = ".$idx."";
	em_update('bb_'.$table, $VALUES_FULL, $where);
}
else {
	$status = 4;
	$nextStage = $tasks['37'];
	$CompletionDate = $VALUES_FULL['CompletionDate'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
	$where = " `idx` = ".$idx."";
	em_update('bb_'.$table, $VALUES_FULL, $where);
	em_update_order_task(24, $status, $reject=0);
	$query = "SELECT `RequestID`, `process_id`, `business_purpose`, `business_benefit`, `estimate_assets`, `cost_center`, `included_capex`, `total_capital`, `purpose`, `details`, `requested_by`, `analysis`, `ProductType`, `ProductLine`, `bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku` 
		FROM `bb_capex` WHERE `idx` =".$idx."";
	if($stmt = $db->query($query)){
		$result = $stmt->fetch_array(MYSQL_ASSOC);
		$stmt->close();
	}
	$capexApp = $result;
	$capexApp['RequestedDate'] = $CompletionDate;
	$capexApp['id_user'] =$id_user;

	$content = &$capexApp;
    $code = stripslashes(getPreScript(37));
    eval($code);

    $capexApp['AssignmentDate'] = $capexApp['RequestedDate'] = $CompletionDate;

	$last_idx = em_insert('bb_capex_approve', $capexApp);
    $task_id1 = em_insert_order_task(37, 1, $last_idx);

    $telegram1 = getBaseDataTelegram(false, 37, $RequestID, 1);
    $telegram1['current_assignee'] = $capexApp['AssignedTo'];
    $telegram1['current_responsible'] = $capexApp['Responsible'];
    $telegram1['task_id'] = $task_id1;
    TelegramManager($telegram1);

    $history = array('idx'=>$last_idx, 'task_type'=>37, 'status'=>1, 'id_user'=>$id_user);
    setHistoryRecord($history);

}

$telegram['current_status'] = $status;
TelegramManager($telegram);

$projectArr =  json_decode(stripcslashes($projectEl));
$table_op = "";
for($i=0; $i<count($projectArr); $i++){
	$projectArr[$i] = (array)$projectArr[$i];
	switch($projectArr[$i]['el_type']){
		case 1: $table_op = '`bb_tasks_operation_tool`'; break;
		case 2: $table_op = '`bb_tasks_operation_gage`';break;
		case 3: $table_op = '`bb_tasks_operation_equipment`';break;
		case 4: $table_op = '`bb_tasks_operation_workstation`';break;
	}
	$projectArr[$i]['year'] = ($projectArr[$i]['year'])? $projectArr[$i]['year']:'NULL';
	$projectArr[$i]['quarter'] = ($projectArr[$i]['quarter'])? $projectArr[$i]['quarter']:'NULL';
	$query = "UPDATE ".$table_op."SET `year` = ".$projectArr[$i]['year'].", `quarter` = ".$projectArr[$i]['quarter']." WHERE `id` = ".$projectArr[$i]['row_id'];
	em_query($query);
}
$history = array('idx'=>$idx, 'task_type'=>24, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);

$result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'nextStage' => $nextStage, 'CompletionDate'=> $CompletionDate, 'process_id'=>$_REQUEST['process_id'], 'RequestID'=>$_REQUEST['RequestID']);
echo json_encode($result);

$db->commit();
?>