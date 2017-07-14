<?php
/**
 * Created by PhpStorm.
 * User: EniMaricone
 * Date: 06.11.2016 23:53
 */
$idx = $_REQUEST['idx'];
$RequestID = $_REQUEST['RequestID'];
$draft = $_REQUEST['draft_id'];
$reject = false;
$nextStage =  $CompletionDate  = $last_order= null;
$task_type = 10;
$customers_res = array();

$telegram = getBaseDataTelegram($idx, 10, $RequestID, $draft);
$old_data = getOldData($table, $idx);

if ($draft == 0){
    $status = 4;
    $CompletionDate = transform_complit_date(gmdate("Y-m-d H:i:s"));
}
if ($draft == 1){
    $status = getStatusDraft();
}
$array = em_get_update_header();
$array['AssignmentDate'] = transform_greenwich($_REQUEST['AssignmentDate']);
$array['RequestedDate'] = transform_greenwich($_REQUEST['RequestedDate']);
$array['CompletionDate'] = $CompletionDate;
$array['stqOE']= $_REQUEST['stqOE'];
$array2['tagNumOE']= $_REQUEST['tagNumOE'];
$array2['SampleCorrectOE']= $_REQUEST['SampleCorrectOE'];
$array['stqCore']= $_REQUEST['stqCore'];
$array2['tagNumCore']= $_REQUEST['tagNumCore'];
$array2['SampleCorrectCore']= $_REQUEST['SampleCorrectCore'];
$array['Note']= $_REQUEST['Note'];

$where = 'idx = '.$idx;

$VALUES = array_merge($array,$array2);
em_update('bb_sample_validation', $VALUES, $where);

// UPDATE bb_order_task
em_update_order_task($task_type, $status, $reject);
// <---------------------------

$telegram['current_status'] = $status;
TelegramManager($telegram);
$telegram = array();


if($_REQUEST['draft_id'] == 0){
    if ( $_REQUEST['SampleCorrectOE'] && $_REQUEST['SampleCorrectCore']){
        $task_type = 11;
        $nextStage = "Reverse Engineering Start";
        $array = null;

        // Выбираем значения из базы, для устранения возможной подмены данных в формах
        $query = "SELECT dd.ProductLine, ner.ProductType, npd.bbb_sku, dd.oe_latest_sku,
                            ner.Application,  ner.Annualdemand, npd.RequestedDate, dd.`PotentialCustomers`
                            FROM bb_new_engineering_req ner
                            LEFT JOIN bb_due_diligence dd ON ner.RequestID = dd.RequestID
                            LEFT JOIN bb_npd_request npd ON ner.RequestID = npd.RequestID
                            LEFT JOIN bb_new_product_line npl ON ner.RequestID = npl.RequestID
                            WHERE ner.RequestID = ".$RequestID."  
                            ORDER BY npd.idx DESC LIMIT 1";
        $result = em_query($query);
        $row = $result->fetch_assoc();
        $result->close();
        $row['oe_reman_sku'] = getRemanSku();
        $row['core_sku'] = getCoreSku();
        $row['id_user'] = $id_user;
        // <---------------------------------

        $customers_res = JsonToArray($row['PotentialCustomers']);
        unset($row['PotentialCustomers']);
        for($i=0; $i<count($customers_res); $i++){
            $customers_res[$i]['customer'] = $customers_res[$i]['name'];
            unset($customers_res[$i]['name']);
        }

        $array = em_get_insert_header();
        $array['AssignedTo'] = $order_v['assignee'] = $_REQUEST['AssignedTo'];
        $array['AssignmentDate'] = $order_v['assignment_date'] = $_REQUEST['AssignmentDate'];
        $order_v['requested_date'] = transform_create_date($row['RequestedDate']);

        $VALUES = array_merge($array, $array2, $row);
        $VALUES['pack_req'] = json_encode($customers_res);

        $content = &$VALUES;
        $code = stripslashes(getPreScript($task_type));
        eval($code);

        //переопределяем в метку
        $VALUES['AssignmentDate'] = $CompletionDate;
        $VALUES['RequestedDate'] = $CompletionDate;
        
        $last_idx = em_insert('bb_reverse_engineering_start', $VALUES);

        $task_id =em_insert_order_task($task_type, 1, $last_idx,  $order_v);

        // <---------------------------------

        $telegram = getBaseDataTelegram(false, 11, $RequestID, 1);
        $telegram['current_assignee'] = $VALUES['AssignedTo'];
        $telegram['current_responsible'] = $VALUES['Responsible'];
        $telegram['task_id'] = $task_id;
        TelegramManager($telegram);

        $history = array('idx'=>$last_idx, 'task_type'=>11, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);

        if($row['ProductLine']==58){
            $eps = $row;
            $eps['RequestID'] = $RequestID;
            unset($eps['SampleLocation']);
            unset($eps['stqOE']);
            unset($eps['stqCore']);
            unset($eps['tagNumCore']);
            unset($eps['tagNumOE']);
            unset($eps['SampleCorrectCore']);
            unset($eps['SampleCorrectOE']);
            unset($eps['Note']);
            unset($eps['Annualdemand']);

            $content = &$eps;
            $code = stripslashes(getPreScript($task_type));
            eval($code);

            $eps['AssignmentDate'] = $CompletionDate;
            $eps['RequestedDate'] = $CompletionDate;

            $last_idx = em_insert('bb_eps_production', $eps);
            $task_id1 = em_insert_order_task(45, 1, $last_idx);
            $nextStage .=" AND EPS Production Software";

            $telegram1 = getBaseDataTelegram(false, 45, $RequestID, 1);
            $telegram1['current_assignee'] = $eps['AssignedTo'];
            $telegram1['current_responsible'] =$eps['Responsible'];
            $telegram1['task_id'] = $task_id1;
            TelegramManager($telegram1);

            $history = array('idx'=>$last_idx, 'task_type'=>45, 'status'=>1, 'id_user'=>$id_user);
            setHistoryRecord($history);
        }
       

    }else{
        $task_type = 4;
        $nextStage = "Sample Procurement";
        $array = null;

        $query = "SELECT  dd.ProductLine, dd.ProductType, bbb_sku, core_sku, /*oe_latest_sku, oe_reman_sku,*/ ner.Annualdemand,  ner.Application
                        FROM bb_new_engineering_req ner
                        LEFT JOIN bb_due_diligence dd ON ner.RequestID = dd.RequestID
                        WHERE ner.RequestID = ".$RequestID." LIMIT 1";

        $result = em_query($query);
        $row = $result->fetch_assoc();
        $result->close();
        $row['oe_reman_sku'] = getRemanSku();
        $row['core_sku'] = getCoreSku();
        // <---------------------------------
        $arrayStq = getStq($row['ProductType']);

        $array = em_get_insert_header();
        $VALUES = array_merge($array, $row, $arrayStq);

        $content = &$VALUES;
        $code = stripslashes(getPreScript($task_type));
        eval($code);

        $last_idx = em_insert('bb_sample_procurement', $VALUES);

        $task_id = em_insert_order_task($task_type, 1, $last_idx);

        $telegram = getBaseDataTelegram(false, 4, $RequestID, 1);
        $telegram['current_assignee'] = $VALUES['AssignedTo'];
        $telegram['current_responsible'] = $VALUES['Responsible'];
        $telegram['task_id'] = $task_id;
        TelegramManager($telegram);

        $history = array('idx'=>$last_idx, 'task_type'=>4, 'status'=>1, 'id_user'=>$id_user);
        setHistoryRecord($history);
    }


}

 $history = array('idx'=>$idx, 'task_type'=>10, 'status'=>$status, 'id_user'=>$id_user, 'old_data'=>$old_data);
setHistoryRecord($history);
$result = array('success' => true, 'Status' => $status, 'draft' => $draft, 'CompletionDate'=>$CompletionDate, 'nextStage' => $nextStage);
echo json_encode($result);
$db->commit();
exit;