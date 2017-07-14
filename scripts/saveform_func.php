<?php

/*function fStrUpdate($title, $value){
    if(empty($value) && $value != '0') $value = 'NULL';
    elseif (is_int($value));
    else $value = "'$value'";
    return "$title = $value";
}*/

function fStrUpdate($title, $value){
    if(empty($value) && $value != '0') $value = 'NULL';
    elseif (is_int($value));
    else {
        if(preg_match("/\'/", $value)){
            $value = "'".stripslashes(str_replace("'", "''", $value))."'";
        }
        else {
             $value = "'".$value."'";
        }
    } 
    return "$title = $value";
}


function getDataHeader(){
    $VALUES[] =  fStrUpdate('draft', $_REQUEST['draft']);
    $VALUES[] =  fStrUpdate('Responsible', $_REQUEST['Responsible']);
    $VALUES[] =  fStrUpdate('AssignedTo', $_REQUEST['AssignedTo']);
    $VALUES[] =  fStrUpdate('RequestedDate', $_REQUEST['RequestedDate']);
    $VALUES[] =  fStrUpdate('AssignmentDate', $_REQUEST['AssignmentDate']);
    $VALUES[] =  fStrUpdate('CompletionDate', $_REQUEST['CompletionDate']);
    $VALUES[] =  fStrUpdate('NewDueDate', $_REQUEST['NewDueDate']);
    $VALUES[] =  fStrUpdate('DueDate', $_REQUEST['DueDate']);
    $VALUES[] =  fStrUpdate('RequestID', $_REQUEST['RequestID']);

    return $VALUES;
}

function em_insert_order_task_full($task_type, $order_id, $idx, $status = 1){
    $array['order_id'] = $order_id;
    $array['previous_task_id'] = $idx;
    $array['outID_task'] = $idx;
    $array['assignee'] = $_REQUEST['AssignedTo'];
    $array['start_date'] = date("Y-m-d H:i:s");
    $array['status'] = $status;
    $array['assigned_by'] = $_REQUEST['Responsible'];
    $array['task_type'] = $task_type;

    $array['due_date'] = $_REQUEST['DueDate'];
    $array['new_due_date'] = $_REQUEST['NewDueDate'];
    $array['requested_date'] = $_REQUEST['RequestedDate'];
    $array['assignment_date'] = $_REQUEST['AssignmentDate'];
	
	if ($status == 4){
         $array['completion_date'] = date('Y-m-d H:i:s');
    }

    return em_insert('bb_order_tasks', $array);
}


function em_insert_order_task($task_type, $status = 1, $outId_task = NULL, $array2 = array()){
    global $DROP_ARRAY;
    $array['order_id'] = $_REQUEST['RequestID'];
    $array['status'] = $status;
    $array['task_type'] = $task_type;
	$array['previous_task_id'] = 0;
    $array['outID_task'] = $outId_task;

    $array['requested_date'] = date('Y-m-d H:i:s');
    $array = array_merge($array, $array2);

    if($task_type!==36){
         $header = &$array;
        $code = stripslashes(getPreScript($task_type));
        eval($code);
    }
   
    if($task_type==37){
        unset($array['oper_name']);
        unset($array['contr_name']);
        unset($array['cfo_name']);
        unset($array['president_name']);
    }
    return em_insert('bb_order_tasks', $array);
}


function em_update_order_task($task_type, $status = 2, $reject=0){
    $array['assignee'] = $_REQUEST['AssignedTo'];
    $array['assignment_date'] = $_REQUEST['AssignmentDate'];

    $array['status'] = $status;
    $array['assigned_by'] = $_REQUEST['Responsible'];
    $array['task_type'] = $task_type;
    $array['due_date'] = $_REQUEST['DueDate'];
    $array['new_due_date'] = $_REQUEST['NewDueDate'];


    if ($status == 4){
         $array['completion_date'] = date('Y-m-d H:i:s');
    }
    if ($reject){
        $reject = 1;
        $array['rejected'] = $reject;
    }

    $VALUES = array();
    $VALUES[] = fStrUpdate('order_id', $_REQUEST['RequestID']);
    $VALUES[] = fStrUpdate('task_type', $task_type);
    $where = implode(" AND ", $VALUES);

    return em_update('bb_order_tasks', $array, $where);
}


function em_update_order_task_ext($task_type, $status = 2, $reject=null, $idx){
    $array['assignee'] = $_REQUEST['AssignedTo'];
    $array['assignment_date'] = $_REQUEST['AssignmentDate'];

    $array['status'] = $status;
    $array['assigned_by'] = $_REQUEST['Responsible'];
    $array['task_type'] = $task_type;
    $array['due_date'] = $_REQUEST['DueDate'];
    $array['new_due_date'] = $_REQUEST['NewDueDate'];


    if ($status == 4){
         $array['completion_date'] = date('Y-m-d H:i:s');
    }

    $array['rejected'] = $reject;

    $VALUES = array();
    $VALUES[] = fStrUpdate('order_id', $_REQUEST['RequestID']);
    $VALUES[] = fStrUpdate('task_type', $task_type);
    $VALUES[] = fStrUpdate('outID_task', $idx);
    $where = implode(" AND ", $VALUES);

    return em_update('bb_order_tasks', $array, $where);
}

function em_get_insert_header(){
    $array['id_user'] = $_SESSION['id'];
    $array['RequestID'] = $_REQUEST['RequestID'];
    return $array;
}

function em_get_update_header(){
    $array['draft'] = $_REQUEST['draft_id'];
    $array['Responsible'] = $_REQUEST['Responsible'];
    $array['AssignedTo'] = $_REQUEST['AssignedTo'];
    $array['AssignmentDate'] = $_REQUEST['AssignmentDate'];
    $array['CompletionDate'] = $_REQUEST['CompletionDate'];
    $array['NewDueDate'] = $_REQUEST['NewDueDate'];
    $array['DueDate'] = $_REQUEST['DueDate'];
    $array['RequestID'] = $_REQUEST['RequestID'];
    return $array;
}

/**
 * Simple SQL update table
 * @param $table string
 * @param $array_request array
 * @param $where string
 * @return bool|mysqli_result
 */
function em_update($table, $array_request, $where){
    $VALUES = array();
    foreach ($array_request as $key=>$value) $VALUES[] = fStrUpdate($key, $value);
    $VALUES_STR = implode(', ', $VALUES);
    $query = "UPDATE $table SET ".$VALUES_STR." WHERE ".$where;
    return em_query($query);
}

/**
 * Simple SQL insert to table
 * @param $table string
 * @param $array_request array
 * @return int
 */
function em_insert($table, $array_request){
    global $db;

    $VALUES = array();
    foreach ($array_request as $key=>$value) $VALUES[] = fStrUpdate($key, $value);
    $VALUES_STR = implode(', ', $VALUES);
    $query = "INSERT INTO $table SET ".$VALUES_STR;
    em_query($query);
    return $db->insert_id;
}

/**
 * The wrapper of standard sql function with logging
 * @param $query string
 * @return bool|mysqli_result
 */
function em_query($query){
    global $db;

    writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'saveformref');
    if (!$result = $db->query($query)){
        writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'saveformref_error');
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
        exit;
    }
    return $result;
}

function writeToLogFile($message, $filename = 'default'){
    $date = date("Y-m-d");
    $sep = PHP_EOL.PHP_EOL."============================ ".date("H:i:s",time())." ============================".PHP_EOL.PHP_EOL;
    //file_put_contents('logs/'.$date.$filename, $sep.$message.PHP_EOL, FILE_APPEND);
    file_put_contents(dirname(__FILE__).'\/logs/'.$date.$filename, $sep.$message.PHP_EOL, FILE_APPEND);
}


function send_message($user_id, $message){
    $query = "SELECT telegram_id FROM bb_users WHERE id = ".$user_id;
    if($result = em_query($query)){
        $row = $result->fetch_assoc();
        writeToLogFile($query, 'telegram_debug');

        if(!empty($row)){
            $chat_id = $row['telegram_id'];
            //$get_str = 'chat_id='.$chat_id.'&text='.strip_tags($message);
            $get_str = 'chat_id='.$chat_id.'&text='.$message;
            $url = T_API_URL.'sendMessage?'.$get_str;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_REFERER, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            $result = curl_exec($ch);
            curl_close($ch);
            return $result;
        }
    } else {
        writeToLogFile($query, 'telegram_error');
    }
    return null;
}

function insertDueCompetitor($data){
    global $db;
     $competitors= JsonToArray($data);
    for($i=0; $i<count($competitors); $i++){
        $query = "SELECT `name` FROM `bb_competitors` WHERE name = '".$competitors[$i]['name']."'";
            if($stmt = $db->prepare($query)){
                    $stmt->execute();
                    $stmt->store_result();
                    if ($stmt->num_rows ==0){
                        $query = "INSERT INTO `bb_competitors` SET `name` = '".$competitors[$i]['name']."'";
                        em_query($query);
                    }
                    $stmt->close();
            } 
    }
}

function insertDueFromJSON($table, $json){
    $array['RequestID'] = $_REQUEST['RequestID'];
    $array['idTask'] = $_REQUEST['idx'];
    $query = "DELETE FROM $table WHERE RequestID = ". $array['RequestID'];
    em_query($query);
     $json = stripslashes($json);
    $arrayJSON = json_decode($json, true);

    foreach ( $arrayJSON as $key => $value) {
            $array2 = $arrayJSON[$key];
            $VALUES = array_merge($array, $array2);
            em_insert($table, $VALUES);

            if ($table == 'bb_due_core_sku'){
                addSku('bb_core_sku', $array2['core_sku']);
            }
    }

}

function addSku($table, $sku){
     global $db;
     $query = "SELECT `id` FROM $table WHERE name = '".$sku."'";
            if($stmt = $db->prepare($query)){
                    $stmt->execute();
                    $stmt->store_result();
                    if ( $stmt->num_rows ==0){
                        $query = "INSERT INTO $table SET `name` = '".$sku."'";
                        em_query($query);           
                    }
                    $stmt->close();
            }                  
}

function getRemanSku(){
    global $db;
    $result1 = null;

    $query = "SELECT oe_reman_sku FROM bb_due_reman_sku_upc  WHERE `RequestID`= ".$_REQUEST['RequestID'];
                if($stmt = $db->query($query)){
                    while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                        $result1[] = $tmp['oe_reman_sku'];
                    }
                    $stmt->close();
                }
                $result =  implode(', ',$result1);

     return   $result;
}

function getCoreSku(){
    global $db;
    $result1 = null;

    $query = "SELECT core_sku FROM bb_due_core_sku  WHERE `RequestID`= ".$_REQUEST['RequestID'];
                if($stmt = $db->query($query)){
                    while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                        $result1[] = $tmp['core_sku'];
                    }
                    $stmt->close();
                }
                $result =  implode(', ',$result1);

     return   $result;         
}

function getStq($ProductType){
    global $new, $component, $reman, $oe;
    $array = array();
    if ($ProductType == $new || $ProductType == $component){
        $array['stqOE'] = 3;
        $array['stqCore'] = 0;
    }else /*if ($ProductType == $reman || $ProductType == $oe)*/{
        $array['stqOE'] = 1;
        $array['stqCore'] = 10;
    }
    return $array;
}



function convertInch($inch){
    $inch_arr = array();
    $inch_arr2 = array();
    $inch = trim(str_replace('"', ' ', $inch));
    if(preg_match("/^\d*\.{0,1}\d*$/", $inch))  $mm = $inch*25.4;
        else {
            $inch_arr = explode(" ", $inch);
            for($i=0; $i<count($inch_arr); $i++){
                if(preg_match("/\//", $inch_arr[$i])) {
                    $inch_arr2 = explode("/", $inch_arr[$i]);
                    $inch_arr[$i] = $inch_arr2[0]/$inch_arr2[1];
                }
                $inch_arr[$i] = $inch_arr[$i]*25.4;
            }
            $mm = array_sum($inch_arr);
        }
    
    return $mm;
}

function convertMM($mm){
    $mm = round($mm, 5);
    $inch = "";
    $int = floor($mm/25.4);
    $dec = $mm/25.4 - $int;
    $i = 0;
    $ch = 1;
    $min = 1000;
    $temp_dec="";
    while($ch<64){
        $zn = $ch;
        while($zn<1024){
            if(abs($dec - $ch/$zn)<0.000001){
                if($min>($ch+$zn)) {
                    $min = $ch+$zn;
                    $temp_dec = $ch."/".$zn;
                }
            } 
            $zn++;
        }
        $ch++;
    }
    $dec = $temp_dec;
        if($int >0)$inch = $int.' '.$dec;
            elseif($dec!=0) $inch = $dec;
                else $inch = 0;
    return $inch;
}

function getStatusDraft(){
    $id_Responsible = $_REQUEST['Responsible'];
    $id_AssignedTo = $_REQUEST['AssignedTo'];
    $id_user = $_SESSION['id'];
   //if($id_user == $id_Responsible) $status = 6;
    if($id_user == $id_AssignedTo) $status = 2;
        else $status = 6;

    return $status;
}

function getPreScript($task_type){
    $query = 'SELECT script FROM `bb_tasks_type` WHERE id = '.$task_type;
    $result = em_query($query);
    $row = $result->fetch_row();
    return $row[0];
}

function setDirectory($data, $dir, $id){
        $dataArr =  json_decode(stripcslashes($data));
        for($i=0; $i<count($dataArr); $i++){
            $dataArrValues = "";
            $dataArr[$i] = (array)$dataArr[$i];
            $array_request =  array($dir.'_id'=>$dataArr[$i][$dir.'_id'], 'qty'=>$dataArr[$i]['qty'], 'operation_id'=>$id);
            $table_dir = "bb_operation_".$dir;
            $id_row = em_insert($table_dir, $array_request);
            switch($dir){
                case 'tool':
                case 'gage':
                    $table_el = "bb_tool_gage";
                break;
                case 'equipment':
                    $table_el = "bb_equipment";
                break;
                case 'workstation':
                    $table_el = "bb_workstation";
                break;
                default:
                    echo "Unknown Directory";
                    exit;
                break;
            }
            em_update($table_el, array('estimated_unit_price'=>$dataArr[$i]['estimated_unit_price']), "`id`=".$dataArr[$i][$dir.'_id']);
        }
    }

    function updateDirectory($data, $dir){
        $dataArr =  json_decode(stripcslashes($data));
        for($i=0; $i<count($dataArr); $i++){
            $dataArr[$i] = (array)$dataArr[$i];
            switch($dir){
                case 'tool':
                case 'gage':
                    $table_el = "bb_tool_gage";
                break;
                case 'equipment':
                    $table_el = "bb_equipment";
                break;
                case 'workstation':
                    $table_el = "bb_workstation";
                break;
                default:
                    echo "Unknown Directory";
                    exit;
                break;
            }
            em_update($table_el, array('estimated_unit_price'=>$dataArr[$i]['estimated_unit_price']), "`id`=".$dataArr[$i][$dir.'_id']);
        }
    }

    function checkOperation($data){
        $exist_row=false;
        $out=array();
        $out1=array();
        $response =array();

        $query="SELECT `id` FROM `bb_operations` WHERE `deleted`=0";
        $result = em_query($query);
        while ($row = $result->fetch_row()){
            $operations[] = $row[0];
        }
        
        foreach ($data as $key => $value) {
           $temp = JsonToArray($value);
            $count_temp = count($temp);

            for($i=0;$i<$count_temp; $i++){
                unset($temp[$i]['estimated_unit_price']);
                unset($temp[$i]['capex']);
                unset($temp[$i]['total_price']);
            }

            for($i=0;$i<count($operations); $i++){
                $bd_arr = array();
                $query = "SELECT `".$key."_id`, `qty` FROM `bb_operation_".$key."` WHERE `operation_id` = ".$operations[$i];
                $rows = em_query($query);
                while ($result = $rows->fetch_array(MYSQL_ASSOC)){
                    $bd_arr[] = $result;
                }
                
               if(count($bd_arr)==$count_temp){
                    $count_row = 0;
                    for($j=0; $j<$count_temp; $j++){
                        for($k=0; $k<$count_temp; $k++){
                           if(count(array_diff_assoc($temp[$j], $bd_arr[$k]))==0){
                                $exist_row = true;
                            }
                        }
                        if($exist_row === false) {
                            continue;
                            }
                            else {
                                $count_row++;
                                $exist_row = false;
                            }
                    }
                   if($count_row==$count_temp){
                        $out[$key][]= $operations[$i];
                    }
                }
            }
        }
        $out1 = array_uintersect($out['tool'], $out['gage'], $out['equipment'], $out['workstation'], "strcasecmp");
        
        if(count($out1)!=0){
           $ids = "";
            foreach ($out1 as $value) {
                $ids .= $value.",";
            }
            
            $ids = "(".substr($ids, 0, -1).")";

            $query="SELECT `id`, `number`, `operation_procedure` FROM `bb_operations` WHERE `id` IN".$ids;
            $result = em_query($query);
            while ($row = $result->fetch_array(MYSQL_ASSOC)){
                $op_data[] = $row;
            }
            $response = array('success'=>true, 'result'=>$op_data);
        }
        else {
             $response = array('success'=>false, 'result'=>"");
        }
        
        return $response;
    }

    function JsonToArray($data){
        $temp = json_decode(stripcslashes($data));
        if(!$temp||count($temp)==0){
            $temp = json_decode($data);
        }
        
        for($i=0; $i<count($temp); $i++){
            $temp[$i]=(array)$temp[$i];
        }
        return $temp;
    }

    function setOperationDetails($data, $dir, $id, $request_id, $number){
       $query = "DELETE FROM `bb_tasks_operation_".$dir."` WHERE `operation_number` = '".$number."' AND `RequestID` = ".$request_id;
           em_query($query);
        $dataArr =  json_decode(stripcslashes($data));
        for($i=0; $i<count($dataArr); $i++){
            $dataArrValues = "";
            $dataArr[$i] = (array)$dataArr[$i];
            unset($dataArr[$i]['pending_design']);
            unset($dataArr[$i]['number']);
            unset($dataArr[$i]['needs']);
            unset($dataArr[$i]['qty']);
            unset($dataArr[$i]['life_time']);
            unset($dataArr[$i]['description']);
            unset($dataArr[$i]['approved']);
            if(!$dataArr[$i]['capex']||$dataArr[$i]['capex']==null){
                $dataArr[$i]['capex'] = 0;
            }
            foreach ($dataArr[$i] as $key => $value) {
                $dataArrValues .= "`".$key."` = '".$value."',";
            }
            $dataArrValues .= "`operation_id` = ".$id.", `RequestID` = ".$request_id.", `operation_number`='".$number."'";
            $query = "INSERT INTO `bb_tasks_operation_".$dir."` SET $dataArrValues";
            em_query($query);
        }
    }


    function getDataBD($values, $table, $where){
        global $db;
        $result = array();
        $str = "";
        if($where !="") $where = "WHERE ".$where;
        for($i=0; $i<count($values); $i++) {
            $str .="`".$values."`, ";
        }
        $str = substr($str, 0, -1);
        $query = "SELECT ".$str." FROM ".$table." ".$where;
        $row = em_query($query);
        $result = $row->fetch();
        return $result;
    }

    function addOperationDetails($dir_arr, $dir, $id_op, $request_id, $number){
        global $db;
            $query = "SELECT `".$dir."_id`, `capex`, `estimated_unit_price`
                FROM `bb_tasks_operation_".$dir."`
                WHERE `operation_number` ='".$number."' AND `RequestID` = ".$request_id;
            $rows = em_query($query);
            while ($result = $rows->fetch_array(MYSQL_ASSOC)){
                $add_arr[] = $result;
            }
            if(count($add_arr)>0){
                for($i=0; $i<count($dir_arr);$i++){
                    for($j=0;$j<count($add_arr); $j++){
                        if($dir_arr[$i][$dir.'_id']==$add_arr[$j][$dir.'_id']){
                        $dir_arr[$i]['capex']=$add_arr[$j]['capex'];
                        if($add_arr[$j]['estimated_unit_price']&&$add_arr[$j]['estimated_unit_price']!=null){
                            $dir_arr[$i]['estimated_unit_price']=$add_arr[$j]['estimated_unit_price'];
                            }
                        }
                    }
                }
            }
            return $dir_arr;
        }

    function addProjectData($dir_arr, $dir, $request_id, $capex){
         global $db;
         $resultArr = array();
         if($capex!=null){
            $capex = " AND `capex` = ".$capex." ";
         }
         else {
            $capex ="";
         }
         $k=0;
         for($i=0; $i<count($dir_arr); $i++){
            $query = "SELECT `id` as `row_id`, `".$dir."_id`, `capex`, `estimated_unit_price`, `year`, `quarter`, `received`, `implemented`
                FROM `bb_tasks_operation_".$dir."`
                WHERE `operation_id`=".$dir_arr[$i]['op_id']." AND `operation_number` ='".$dir_arr[$i]['operation_number']."' AND `RequestID` = ".$request_id." ".$capex." AND `".$dir."_id`=".$dir_arr[$i]['el_id'];
            $rows = em_query($query);
            $result = $rows->fetch_array(MYSQL_ASSOC);
            if(count($result)>0){
                $resultArr[$k]=$dir_arr[$i];
               $resultArr[$k]['total_price']=$result['estimated_unit_price']*$resultArr[$k]['qty'];
                $resultArr[$k]['year']=$result['year'];
                $resultArr[$k]['quarter']=$result['quarter'];
                $resultArr[$k]['received']=$result['received'];
                $resultArr[$k]['implemented']=$result['implemented'];
                $resultArr[$k]['row_id']=$result['row_id'];
                $k++;
            }           
         }
    return $resultArr;
    }

   function searchOperation($data){
        $exist_row=false;
        $out=array();
        $out1=array();
        $response =array();

        $query="SELECT `id` FROM `bb_operations` WHERE `deleted`=0";
        $result = em_query($query);
        while ($row = $result->fetch_row()){
            $operations[] = $row[0];
        }

        foreach ($data as $key => $value) {
           $temp = JsonToArray($value);
            $count_temp = count($temp);
            $select = "";
            $select_arr = $temp[0];
            for($i=0; $i<$count_temp; $i++){
                if(count($temp[$i])>count($select_arr)){
                    $select_arr = $temp[$i];
                }
            }

            if (array_key_exists('qty', $select_arr)) {
                $select = "`".$key."_id`, `qty`";
            }
            else {
                $select = "`".$key."_id`";
            }

            for($i=0;$i<count($operations); $i++){
                $bd_arr = array();
                $query = "SELECT ".$select." FROM `bb_operation_".$key."` WHERE `operation_id` = ".$operations[$i];
                $rows = em_query($query);
                while ($result = $rows->fetch_array(MYSQL_ASSOC)){
                    $bd_arr[] = $result;
                }
                
               if(count($bd_arr)>=$count_temp){
                    $count_row = 0;
                    for($j=0; $j<$count_temp; $j++){
                        for($k=0; $k<$count_temp; $k++){
                           if(count(array_diff_assoc($temp[$j], $bd_arr[$k]))==0){
                                $exist_row = true;
                            }
                        }
                        if($exist_row === false) {
                            continue;
                            }
                            else {
                                $count_row++;
                                $exist_row = false;
                            }
                    }
                   if($count_row==$count_temp){
                        $out[$key][]= $operations[$i];
                    }
                }
            }
            if(count($out[$key])==0){
                $out[$key] = array();
            }
        }

        $out1 = array_shift($out);
        if(count($out)>0){
            foreach ($out as $key=>$value) {
                $out1 = array_uintersect($out1, $out[$key], "strcasecmp");
            }
        }
       
        if(count($out1)!=0){
           $ids = "";
            foreach ($out1 as $value) {
                $ids .= $value.",";
            }
            
            $ids = "(".substr($ids, 0, -1).")";

            $query="SELECT `id`, `number` AS `value` FROM `bb_operations` WHERE `id` IN".$ids;
            $result = em_query($query);
            while ($row = $result->fetch_array(MYSQL_ASSOC)){
                $op_data[] = $row;
            }
            $response = array('success'=>true, 'result'=>$op_data);
        }
        else {
             $response = array('success'=>false, 'result'=>"");
        }
        
        return $response;
    }

    function getBaseDataTelegram($idx, $task_type, $RequestID,$draft){
        global $db;
        $telegram =  array();
        if($idx){
            $query = "SELECT `assigned_by`, `assignee`, `status`, `task_id` FROM `bb_order_tasks` WHERE `task_type` = ".$task_type ." AND `outID_task`= ".$idx." AND `order_id` = ".$RequestID;
            if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($old_responsible, $old_assignee, $old_status, $task_id);
                $stmt->fetch();
                $stmt->close();
            }
            $telegram = array('idx'=>$idx, 'draft'=>$draft,'current_assignee'=>$_REQUEST['AssignedTo'], 'old_assignee'=>$old_assignee, 'current_responsible'=>$_REQUEST['Responsible'], 'old_responsible'=>$old_responsible, 'old_status'=>$old_status, 'RequestID'=>$RequestID, 'task_type'=>$task_type, 'DueDate'=>$_REQUEST['DueDate'], 'task_id'=>$task_id);
        }
        else {
            $telegram = array('draft'=>$draft,'current_assignee'=>$_REQUEST['AssignedTo'], 'current_responsible'=>$_REQUEST['Responsible'], 'old_status'=>1, 'task_type'=>$task_type, 'DueDate'=>$_REQUEST['DueDate'], 'RequestID'=>$RequestID);
        }
        return $telegram;
    }
    
function send_mail($user, $message){
    global $db;

    $query = "SELECT `email` FROM `bb_users` WHERE `id` = ".$user;
    if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($email);
            $stmt->fetch();
            $stmt->close();
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){
        $subject = "BBB Tasks notification";
        $headers = "From: \"web\" <bbbinfo@vvtrack.com>\r\n"."Content-Type: text/html; charset=\"utf-8\"\r\n";
        if(smtpmail($email, $subject, $message, $headers)) {
                $result =true;
            }
            else {
               $result=false;
            }
    }
    else {
           $result=false;
        }
    
     }
     else {
        writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'send_mail');
        $result=false;
     }
     return $result;
}



function TelegramManager($data){
        //format array ('idx'=>"", 'draft'=>"",'current_assignee'=>"", 'old_assignee'=>"", 'current_responsible'=>"", 'old_responsible'=>"", 'current_status'=>"", 'old_status'=>"", 'RequestID'=>"", 'task_type'=>"", 'DueDate'=>"", 'task_id'=>"");
        global $db, $answers;
        $users_str = "";
        $addressee = array();

        if($data['current_assignee']){
            $users_str = $data['current_assignee'];
            $addressee = array($data['current_assignee']);
        }

        if($data['current_assignee']){
            if($users_str !=""){
                $users_str .= ", ".$data['current_responsible'];
                $addressee = array($data['current_assignee'], $data['current_responsible']);
            }
            else{
                $users_str = $data['current_responsible'];
                $addressee = array($data['current_responsible']);
            }
            
        }

        if($users_str !=""){
            if($data['old_responsible']){
            $users_str .= ", ".$data['old_responsible'];
        }

        if($data['old_assignee']){
            $users_str .= ", ".$data['old_assignee'];
        }

        $users_str = "(".$users_str.")";

        $query = "SELECT `id`, `name` FROM `bb_users` WHERE `id` IN ".$users_str;
        if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
            $users[$id]= $name;
        }
        $stmt->close();
        }

        $query = "SELECT `tasks_type` FROM `bb_tasks_type` WHERE `id` = ".$data['task_type'];
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($tasks_type);
            $stmt->fetch();
            $stmt->close();
        }

        $status_str = $data['current_status'];

        if($data['old_status']){
            $status_str .= ", ".$data['old_status'];
        }

        $status_str = "(".$status_str.")";
         $query = "SELECT `task_status_id` as `id`, `name` FROM `bb_task_status` WHERE `task_status_id` IN ".$status_str;
        if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
            $status[$id]= $name;
        }
        $stmt->close();
        }
        $message = "Task ".$tasks_type." RequestID: ".$data['RequestID'];
        if($data['idx']){//existing task
            if($data['draft']==1){//draft update
                if(($data['current_assignee']==$data['old_assignee'])&&($data['current_responsible']==$data['old_responsible'])){//any changes in staff
                        $addressee = array();
                    }
                    elseif(($data['current_assignee']!=$data['old_assignee'])&&($data['current_responsible']==$data['old_responsible'])){//change assignee -  new assignee and old assignee and current responsible
                        $addressee = array($data['current_assignee'], $data['old_assignee'], $data['current_responsible']);
                        $message .= $answers['change_assignee'].$users[$data['old_assignee']].$answers['to'].$users[$data['current_assignee']].$answers['due_date_is'].$data['DueDate'].".";
                    }
                    elseif(($data['current_assignee']==$data['old_assignee'])&&($data['current_responsible']!=$data['old_responsible'])) { //change responsible - new responsible and old responsible and current assignee
                        $addressee = array($data['current_assignee'], $data['current_responsible'], $data['old_responsible']);
                        $message .= $answers['changed_responsible'].$users[$data['old_responsible']].$answers['to'].$users[$data['current_responsible']].$answers['due_date_is'].$data['DueDate'].".";
                    }
                    else{//change both sides
                        $addressee = array($data['old_assignee'], $data['current_assignee'], $data['current_responsible'], $data['old_responsible']);
                        $message .= $answers['changed_responsible'].$users[$data['old_responsible']].$answers['to'].$users[$data['current_responsible']].$answers['and_changed_assignee'].$users[$data['old_assignee']].$answers['to'].$users[$data['current_assignee']].$answers['due_date_is'].$data['DueDate'].".";
                    }

                if($data['current_status']!=$data['old_status']){//status changed
                    if(count($addressee)==0){//change status - assignee and responsible
                      $addressee = array($data['current_assignee'], $data['current_responsible']);
                      $message .=$answers['canged_status'].$status[$data['current_status']].$answers['due_date_is'].$data['DueDate'].".";
                    }
                    else {
                        $message .= $answers['status_changed'].$status[$data['current_status']].".";
                    }
                }
            }
            else {//finish task
                //message to responsible
                $addressee = array($data['current_responsible']);
                $message .= $answers['completed'];
            }
        }
        else {
            //new task
            $message .= $answers['created'];
        }

        $addressee = array_unique($addressee);

        if(count($addressee)>0){
            $path = substr($_SERVER['PHP_SELF'],0,strrpos($_SERVER['PHP_SELF'],"/"));
            $path = substr($path,0,strrpos($path,"/"));
            $link = $_SERVER['HTTP_HOST'].$path."?task_id=".$data['task_id'];
            //$message_email = "<a href='http://".$_SERVER['HTTP_HOST'].$path."?task_id=".$data['task_id']."'>".$message."</a>";
            $message_email = "<b><p>".$message."</p></b></br></br><a href='http://".$_SERVER['HTTP_HOST'].$path."?task_id=".$data['task_id']."' style='text-decoration: none;'><b><span style='font-size: 16px; color: #000;'><b><span style='color: #fff; display: block; padding: 6px; background: #4169E1; text-align: center; border: 2px solid #000; border-radius: 5px;'>GO TO TASK</span></b></a>";

            $message = $message." ".$link;

           for($i=0; $i<count($addressee); $i++){
                if($addressee[$i]&&$addressee[$i]!=""&&$addressee[$i]!=0){
                     send_message($addressee[$i], $message);
                     send_mail($addressee[$i], $message_email);
                }
            }
        }
        }
    }

   function getRightsByRole($roles){
        global $db;
        if($roles&&$roles!=""){
            $query = "SELECT `global_group`, `group_right`, `right_name` 
                FROM `bb_role_rights` rr
                INNER JOIN `bb_rights` r ON r.`id` = rr.`right_id`
                INNER JOIN `bb_rights_global_groups` rgg ON rgg.`id` = rr.`right_global_group_id`
                WHERE `role_id` IN (".$roles.")";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $stmt->bind_result($global_group, $group_right, $right_name);
                while ($stmt->fetch()) {
                    $result[$global_group][] = array('id'=>$group_right, 'right'=>$right_name);
                }
                $stmt->close();

        foreach ($result as $key => $value) {
            $right_name = array();
            $table = "`bb_rights_".$key."`";
            $query = "SELECT `id`, `permission` FROM ".$table;
            if($stmt = $db->prepare($query)){
                $stmt->execute();
                $stmt->bind_result($id, $permission);
                while ($stmt->fetch()) {
                    $right_name[$id] = $permission;
                }
                $stmt->close();

                $temp =$result[$key];
                for($i=0; $i<count($temp); $i++){
                    $temp[$i]['permission'] = $right_name[$temp[$i]['id']];
                }
                $result[$key] = $temp;
            }
        }
        return $result;
        }
    }

    function getRolesIds($user_id){
        global $db;
        $query = "SELECT GROUP_CONCAT(`role_id` SEPARATOR ',') FROM `bb_user_roles` WHERE `user_id` = ".$user_id." GROUP BY `user_id`";
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($ids);
            $stmt->fetch();
            $stmt->close();
        }
        return $ids;
    }

function setRevision($old_revision){
    $revisions = array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    $key = array_search($old_revision, $revisions);
    $key++;
    if($key>25) {
        $new_revision = $old_revision."I";
    }
    else {
        $new_revision = $revisions[$key];
    }
    return $new_revision;
}

function checkBOM($bom_data, $bbb_sku_id){
    global $db;
    $bom_components =  array();
    for($i=0; $i<count($bom_data); $i++){
        unset($bom_data[$i]['ppap']);
        unset($bom_data[$i]['in_house']);
        unset($bom_data[$i]['out_source']);
        unset($bom_data[$i]['reuse_from_core']);
        $bom_data[$i]['component_id'] = $bom_data[$i]['id'];
        unset($bom_data[$i]['id']);
    }

    $query = "SELECT COUNT(*) FROM `bb_bom` WHERE `bbb_sku_id` =".$bbb_sku_id;
       if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }

    if($count>0){//boms exists
        $query = "SELECT `id` AS `bom_id`, `revision` FROM `bb_bom` WHERE `bbb_sku_id` =".$bbb_sku_id." ORDER BY `revision` DESC LIMIT 1";
        if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($bom_id, $revision);
                $stmt->fetch();
                $stmt->close();
            }

        $query = "SELECT `id`, `component_id`, `qty` FROM `bb_bom_components` WHERE `bom_id` =".$bom_id;
         if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($id, $component_id, $qty);
            while ($stmt->fetch()){
                $bom_components[] = array('id'=>$id, 'component_id'=>$component_id,'qty'=>$qty);
            }
            $stmt->close();
        }

        $exist_row = false;
        if(count($bom_components)==count($bom_data)){//may be this bom
            $count_row = 0;
            $count = count($bom_components);
            for($j=0;$j<$count; $j++){
                for($k=0;$k<$count;$k++){
                    if(count(array_diff_assoc($bom_data[$j], $bom_components[$k]))==0){
                            $exist_row = true;
                        }
                }
                if($exist_row === false) {
                    continue;
                    }
                    else {
                        $count_row++;
                        $exist_row = false;
                    }
            }
            if($count_row==$count){//this bom
               $result = array('action'=>'update', 'bom_id'=>$bom_id, 'new_bom'=>false, 'revision'=>$revision);
            }
            else {//other bom
                $result = array('action'=>'insert', 'new_bom'=>true, 'revision'=>setRevision($revision));
            }

        }
        else {//not this bom
            $result = array('action'=>'insert', 'new_bom'=>true, 'revision'=>setRevision($revision));
        }
    }
    else {//any bom
        $result = array('action'=>'insert', 'new_bom'=>true, 'revision'=>'A');
    }
    return $result;
}


function saveBOM($bom, $action, $case_type){
    global $db;
    $result = array("success"=>true);
    if((!$bom['sku_name']||trim($bom['sku_name'])=="")&&$case_type=='dir'){
        $result = array("success"=>false, "message"=>"Invalid BBB SKU name!");
    }

   if(!$bom['ProductType']||!preg_match("/^\d+$/", $bom['ProductType'])){
        $result = array("success"=>false, "message"=>"Unknown format Product Type data!");
    }

    if(!$bom['ProductLine']||!preg_match("/^\d+$/", $bom['ProductLine'])){
        $result = array("success"=>false, "message"=>"Unknown format Product Line data!");
    }

    if(!$bom['bom']||$bom['bom']==""){
       $result = array("success"=>false, "message"=>"You can't save BOM without any component!");
    }
    else {
        $bom_data= JsonToArray($bom['bom']);
    }

        $last_mod = date('Y-m-d H:i:s');
    
    if($action=='add'){
        $query = "SELECT `id` FROM `bb_bbb_sku` WHERE `name` = '".$bom['sku_name']."'";
            if($stmt = $db->prepare($query)){
                $stmt->execute();
                $stmt->bind_result($id);
                while ($stmt->fetch()){
                    $tmp[]= $id;
                }
                $stmt->close();
            }
            else{
                $result = array("success"=>false, "message"=>$db->errno);
            }

            $count = count($tmp);

        if($count>0){
            $result = array("success"=>false, "message"=>"The same BBB SKU name is already exist!");
        }
        else {
            $bbb_sku_data =  array('name'=>$bom['sku_name'], 'ProductLine'=>$bom['ProductLine'], 'ProductType'=>$bom['ProductType'], 'sku_status'=>3);
           $id_insert = em_insert('bb_bbb_sku', $bbb_sku_data);
           $bom['sku_id'] = $id_insert;
           $revision = 'A';
           $create_date = date('Y-m-d H:i:s');

           $bom_id = em_insert('bb_bom', array('bbb_sku_id'=>$bom['sku_id'], 'revision'=>$revision, 'create_date'=>$create_date, 'last_mod'=>$last_mod));

           for($i=0; $i<count($bom_data); $i++){
                $array_comp = array();
                $array_comp['bom_id'] = $bom_id;
                $array_comp['component_id'] = $bom_data[$i]['id'];
                $array_comp['qty'] = $bom_data[$i]['qty'];
                $array_comp['in_house'] = $bom_data[$i]['in_house'];
                $array_comp['out_source'] = $bom_data[$i]['out_source'];
                $array_comp['reuse_from_core'] = $bom_data[$i]['reuse_from_core'];
                $array_comp['ppap'] = $bom_data[$i]['ppap'];
                $id_comp = em_insert('bb_bom_components', $array_comp);
            }
           $result = array("success"=>true, 'bom_id'=>$bom_id, "bbb_sku_id"=>$bom['sku_id'], 'revision'=>$revision, 'create_date'=>$create_date, 'action'=>'add_new_bom', "message"=>"New BOM succesfully created.");
        }
    }
    elseif($action=='edit'){
            if($case_type=='dir'){
                $bbb_sku_data =  array('name'=>$bom['sku_name'], 'ProductLine'=>$bom['ProductLine'], 'ProductType'=>$bom['ProductType']);
                em_update('bb_bbb_sku', $bbb_sku_data, "`id` = ".$bom['sku_id']);
            }

            if(preg_match("/^\d+$/", $bom['bom_id'])){
                em_update('bb_bom', array('last_mod'=>$last_mod), " `id`=".$bom['bom_id']);
            }
            else {
                $revision = 'A';
                $create_date = $last_mod = date('Y-m-d H:i:s');
                $bom['bom_id'] = em_insert('bb_bom', array('bbb_sku_id'=>$bom['sku_id'], 'revision'=>$revision, 'create_date'=>$create_date, 'last_mod'=>$last_mod));
            }
            
            
            $query = "DELETE FROM `bb_bom_components` WHERE `bom_id`=".$bom['bom_id'];
            em_query($query);
            for($i=0; $i<count($bom_data); $i++){
                $array_comp = array();
                $array_comp['bom_id'] = $bom['bom_id'];
                $array_comp['component_id'] = $bom_data[$i]['id'];
                $array_comp['qty'] = $bom_data[$i]['qty'];
                $array_comp['in_house'] = $bom_data[$i]['in_house'];
                $array_comp['out_source'] = $bom_data[$i]['out_source'];
                $array_comp['reuse_from_core'] = $bom_data[$i]['reuse_from_core'];
                $array_comp['ppap'] = $bom_data[$i]['ppap'];
                $id_comp = em_insert('bb_bom_components', $array_comp);
            }
            $result = array("success"=>true, 'bom_id'=>$bom['bom_id'], "bbb_sku_id"=>$bom['sku_id'], 'revision'=>$bom['revision'], 'action'=>'update_bom', "message"=>"BOM succesfully updated.");
    }
    $db->commit();
    return $result;
}

$tables = array('1'=>'bb_new_engineering_req', '2'=>'bb_due_diligence', '3'=>'bb_new_product_line', '4'=>'bb_sample_procurement', '5'=>'bb_feasibility_product_eng', '6'=>'bb_feasibility_process_eng', '7'=>'bb_cost_estimate', '8'=>'bb_preliminary_roi_pm', '9'=>'bb_npd_request', '10'=>'bb_sample_validation', '11'=>'bb_reverse_engineering_start', '12'=>'bb_reverse_eng_core_analysis', '13'=>'bb_reverse_eng_pack_req', '14'=>'bb_reverse_engineering', '15'=>'bb_reverse_engineering_attribute_tables', '16'=>'bb_ecr_form', '17'=>'bb_ppap_test_plan', '36'=>'bb_ppap_review', '18'=>'bb_process_design_request', '19'=>'bb_process_design_start', '21'=>'bb_tooling_request', '22'=>'bb_tooling_approval', '24'=>'bb_capex', '37'=>'bb_capex_approve', '23'=>'bb_procurement_request', '38'=>'bb_implementation_request', '25'=>'bb_purchasing_request', '39'=>'bb_ppap_finished_good', '40'=>'bb_ppap_finished_good_review', '41'=>'bb_equipment_request', '42'=>'bb_workstation_request', '43'=>'bb_equipment_approval', '44'=>'bb_workstation_approval', '45'=>'bb_eps_production', '46'=>'bb_new_component_req');
function setHistoryRecord($history){
    global $db;
    global $tables;

    $progress_arr = array();
    //$query = "SELECT * FROM `".$tables[$history['task_type']]."` WHERE `idx` = ".$history['idx'];
    $query = "SELECT ner.*, `status`  AS `Status`
                FROM `".$tables[$history['task_type']]."` ner
                INNER JOIN `bb_order_tasks` ot ON ot.`order_id` = ner.`RequestID`
                WHERE `idx` = ".$history['idx']." AND `task_type` = ".$history['task_type']." AND `outID_task` = ".$history['idx'];

    $stmt = $db->query($query);
    while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
            $result[] = $tmp;
    }          
    $stmt->close();

    //$result = getTaskContent($tables[$history['task_type']], $task_id);
    $result =$result[0];
    $old_data =$history['old_data'];

    foreach ($old_data as $key => $value) {
        $old_data[$key] = stripcslashes(trim($value));
    }

    $diff = array_diff_assoc($result, $old_data);
    unset($diff['idx']);
    unset($diff['deleted']);
    unset($diff['name']);
    unset($diff['id_user_edited']);
    unset($diff['datetime_edited']);
    unset($diff['id_user']);
    unset($diff['draft']);

    $changes = array();
    foreach ($diff as $key => $value) {
       //$changes[$key] = "New: ".$result[$key]."; Old: ".$old_data[$key];
       $changes[$key]['new'] = $result[$key];
       $changes[$key]['old'] = $old_data[$key];
    }

    /*foreach ($result as $key => $value) {
        $result[$key] = preg_replace("/\"/", "\'", $value);
    }*/
   
    $progress_arr['RequestID'] = $result['RequestID'];
    $progress_arr['task_type'] = $history['task_type'];
    $progress_arr['create_date'] = ($result['RequestedDate'])? $result['RequestedDate']: date('Y-m-d H:i:s');
    $progress_arr['create_by'] = $result['id_user'];
    $progress_arr['change_date'] = transform_complit_date(gmdate("Y-m-d H:i:s"));
    $progress_arr['change_by'] = $history['id_user'];
    $progress_arr['status'] = $history['status'];
    $progress_arr['outID_task'] = $history['idx'];
    $progress_arr['task_content'] = json_encode($result);
    $progress_arr['changes'] = json_encode($changes);
    em_insert('bb_task_progress', $progress_arr);

    $query = "SELECT COUNT(*) FROM `bb_tasks_history` WHERE `RequestID` = ".$progress_arr['RequestID']." AND `task_type` = ".$progress_arr['task_type']." AND `outID_task` = ".$progress_arr['outID_task'];
    if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();
        }

    unset($progress_arr['task_content']);
    unset($progress_arr['changes']);
    if($count ==0){
       // $progress_arr['create_date'] = date('Y-m-d H:i:s');
        em_insert('bb_tasks_history', $progress_arr);
    }
    else{
        $where = "`RequestID` = ".$progress_arr['RequestID']." AND `task_type` = ".$progress_arr['task_type']." AND `outID_task` = ".$progress_arr['outID_task'];
        unset($progress_arr['RequestID']);
        unset($progress_arr['task_type']);
        unset($progress_arr['create_date']);
        unset($progress_arr['create_by']);
        unset($progress_arr['outID_task']);
        em_update('bb_tasks_history', $progress_arr, $where);
    }
}

function getOldData($table, $idx){
    global $db;
    global $tables;
    $out = array();
    if($idx){
        $task_type = array_search("bb_".$table, $tables);
        //$editid = "(SELECT `task_id` FROM `bb_order_tasks` WHERE `task_type` = ".$task_type." AND `outID_task` = ".$idx.")";
    $query = "SELECT ner.*, `status`  AS `Status`
                FROM `bb_".$table."` ner
                INNER JOIN `bb_order_tasks` ot ON ot.`order_id` = ner.`RequestID`
                WHERE `task_type` = ".$task_type." AND `outID_task` = ".$idx;
        $stmt = $db->query($query);
        while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                $result[] = $tmp;
        }               
        $stmt->close();
        $out = $result[0];
       // $out = getTaskContent($table, $editid, 'array');
    }
    return $out;
}



function  getTaskContent($table, $editid, $response_type='json'){
    global $db;
    $task_content = array();
    switch($table){
        case 'reverse_engineering':
            $query = "SELECT `sku_status`, `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, re.`ProductType`, re.`ProductLine`, re.`bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku`, `SampleCorrectOE`, `SampleCorrectCore`,`tagNumOE`, `tagNumCore`, `Application`, `status` AS `Status`, `bom_id` 
            FROM `bb_reverse_engineering` re
            INNER JOIN bb_order_tasks ON `RequestID` = `order_id`
            INNER JOIN `bb_bbb_sku` bs ON re.`bbb_sku` = bs.`id`
            WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" .$editid.") AND `task_type` = 14";
        break;
        case 'reverse_engineering_start':
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, re.`bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku`, `SampleCorrectOE`, `SampleCorrectCore`,`tagNumOE`, `tagNumCore`, `Application`, `status` AS `Status`, `pack_req`, `ProductFamily`, `Annualdemand`, `PartMarking`
                FROM `bb_reverse_engineering_start` re
                INNER JOIN bb_order_tasks ON `RequestID` = `order_id` 
                WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" .$editid.") AND `task_type` = 11";
        break;
        case 'ppap_test_plan':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductType`, tp.`ProductLine`, tp.`bbb_sku`, tp.`core_sku`, tp.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `id_part_number`, `qty`, `dim_test`, `func_test`, `status` as `Status`, `files`, `email`, `outsource_company`, `notes` FROM `bb_ppap_test_plan` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'ppap_review':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductType`, tp.`ProductLine`, tp.`bbb_sku`, tp.`core_sku`, tp.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `id_part_number`, `qty`, `dim_test`, `func_test`, `status` as `Status`, `files`, `email`, `outsource_company`, `notes`, `outsource_draft` FROM `bb_ppap_review` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'new_component_req':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `status` as `Status`, `tasks`   
            FROM `bb_new_component_req`  ncr
            INNER JOIN bb_order_tasks ON ncr.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'process_design_request':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `bbb_sku`, `core_sku`, `oe_latest_sku`, `oe_reman_sku`,  `Application`, `status` AS `Status`, `Annualdemand`, `SampleLocation` FROM `bb_process_design_request` pdr
            INNER JOIN `bb_order_tasks` ON pdr.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'process_design_start':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, pds.`AssignmentDate`, pds.`DueDate`, pds.`RequestedDate`, pds.`CompletionDate`, pds.`NewDueDate`, pds.`ProductType`, pds.`ProductLine`, pds.`bbb_sku`, pds.`core_sku`, pds.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `status` AS `Status`, `process_id`, IFNULL(pf.`cell_number`, pds.`cell_number`) as `cell_number`, IFNULL(pf.`description`, pds.`description`) as `description`, `Annualdemand`, `SampleLocation`, `demolition`, `travel`, `non_capitalizable`, `other_expense`, `purpose`, `details`, `files`, `capex_create` FROM `bb_process_design_start` pds
            INNER JOIN `bb_order_tasks` ON pds.`idx` = `outID_task`
            LEFT JOIN `bb_process_flow` pf ON pds.`process_id` = pf.`id`
            WHERE `task_id`=" .$editid;
        break;
        case 'capex':
        $query = "SELECT cpx.`idx`, cpx.`RequestID`, cpx.`draft`, cpx.`Responsible`, cpx.`AssignedTo`, cpx.`AssignmentDate`, cpx.`DueDate`, cpx.`RequestedDate`, cpx.`CompletionDate`, cpx.`NewDueDate`,  cpx.`ProductType`, cpx.`ProductLine`, cpx.`bbb_sku`, cpx.`core_sku`, cpx.`oe_latest_sku`, cpx.`oe_reman_sku`, `process_id`, `business_purpose`, `business_benefit`, `status` AS `Status`, `estimate_assets`, `cost_center`, `included_capex`, `demolition`, `travel`, `non_capitalizable`, `other_expense`, `total_capital`, `purpose`, `details`, `requested_by`, `analysis`   
            FROM `bb_capex` cpx
            INNER JOIN bb_order_tasks ON cpx.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'capex_approve':
        $query = "SELECT cpx.`idx`, cpx.`RequestID`, cpx.`draft`, cpx.`Responsible`, cpx.`AssignedTo`, cpx.`AssignmentDate`, cpx.`DueDate`, cpx.`RequestedDate`, cpx.`CompletionDate`, cpx.`NewDueDate`,  cpx.`ProductType`, cpx.`ProductLine`, cpx.`bbb_sku`, cpx.`core_sku`, cpx.`oe_latest_sku`, cpx.`oe_reman_sku`, `process_id`, `business_purpose`, `business_benefit`, `status` AS `Status`, `estimate_assets`, `cost_center`, `included_capex`, `demolition`, `travel`, `non_capitalizable`, `other_expense`, `total_capital`, `purpose`, `details`, `requested_by`, `analysis`, `approved_oper`, `oper_name`, `approved_oper`, `contr_name`, `approved_contr`, `cfo_name`, `approved_cfo`, `president_name`, `approved_president`  
            FROM `bb_capex_approve` cpx
            INNER JOIN bb_order_tasks ON cpx.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'procurement_request':
        $query = "SELECT pr.`idx`, pr.`RequestID`, pr.`draft`, pr.`Responsible`, pr.`AssignedTo`, pr.`AssignmentDate`, pr.`DueDate`, pr.`RequestedDate`, pr.`CompletionDate`, pr.`NewDueDate`,  pr.`ProductType`, pr.`ProductLine`, pr.`bbb_sku`, pr.`core_sku`, pr.`oe_latest_sku`, pr.`oe_reman_sku`, `process_id`, `status` AS `Status`, `requested_by`, `oper_name`, `contr_name`, `cfo_name`, `president_name`, `capex_pdf` 
            FROM `bb_procurement_request` pr
            INNER JOIN bb_order_tasks ON pr.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'purchasing_request':
        $query = "SELECT pr.`idx`, pr.`RequestID`, pr.`draft`, pr.`Responsible`, pr.`AssignedTo`, pr.`AssignmentDate`, pr.`DueDate`, pr.`RequestedDate`, pr.`CompletionDate`, pr.`NewDueDate`,  pr.`ProductType`, pr.`ProductLine`, pr.`bbb_sku`, pr.`core_sku`, pr.`oe_latest_sku`, pr.`oe_reman_sku`, `process_id`, `status` AS `Status`, `requested_by` 
            FROM `bb_purchasing_request` pr
            INNER JOIN bb_order_tasks ON pr.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'implementation_request':
        $query = "SELECT ir.`idx`, ir.`RequestID`, ir.`draft`, ir.`Responsible`, ir.`AssignedTo`, ir.`AssignmentDate`, ir.`DueDate`, ir.`RequestedDate`, ir.`CompletionDate`, ir.`NewDueDate`,  ir.`ProductType`, ir.`ProductLine`, ir.`bbb_sku`, ir.`core_sku`, ir.`oe_latest_sku`, ir.`oe_reman_sku`, `process_id`, `status` AS `Status`, `requested_by`
            FROM `bb_implementation_request` ir
            INNER JOIN bb_order_tasks ON ir.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'ppap_finished_good':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductType`, tp.`ProductLine`, tp.`bbb_sku`, tp.`core_sku`, tp.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `id_part_number`, `qty`, `dim_test`, `func_test`, `status` as `Status`, `files`, `email`, `outsource_company`, `notes` FROM `bb_ppap_finished_good` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'ppap_finished_good_review':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductType`, tp.`ProductLine`, tp.`bbb_sku`, tp.`core_sku`, tp.`oe_latest_sku`, `oe_reman_sku`,  `Application`, `id_part_number`, `qty`, `dim_test`, `func_test`, `status` as `Status`, `files`, `email`, `outsource_company`, `notes`, `outsource_draft` FROM `bb_ppap_finished_good_review` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'capa_request':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku_capa`, `status` as `Status`, `part_number`, `part_name`, `quality_issue`, `problems`, `compliance_enforcement`, `process_issue`, `design_issue`, `issue_comments`  
            FROM `bb_capa_request` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'capa_implementation':
        $query = "SELECT tp.`idx`, tp.`RequestID`, tp.`draft`, tp.`Responsible`, tp.`AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku_capa`, `status` AS `Status`, tp.`approvals`, tp.`part_number`, tp.`part_name`, tp.`quality_issue`, tp.`problems`, tp.`compliance_enforcement`, tp.`process_issue`, tp.`design_issue`, tp.`impl_action`, tp.`root_files`, tp.`corrective_files`, tp.`preventive_files`, tp.`root_imgs`, tp.`corrective_imgs`, tp.`preventive_imgs`, tp.`root_cause`, tp.`corrective_action`, tp.`preventive_action`, tp.`implementation_date`, GROUP_CONCAT(ce.`idx`) AS `task_ids`, GROUP_CONCAT(`approval_status`) AS `statuses`, GROUP_CONCAT(ce.`Responsible`) AS `persons`, GROUP_CONCAT(ce.`draft`) AS `drafts`, tp.`ecr_data`  
            FROM `bb_capa_implementation` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            INNER JOIN `bb_capa_ecr` ce ON ce.`RequestID` = tp.`RequestID`
            WHERE `task_id`=" .$editid;
        break;
        case 'capa':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku_capa`, `status` as `Status`, `part_number`, `part_name`, `quality_issue`, `problems`, `compliance_enforcement`, `process_issue`, `design_issue`, `issue_comments`, `comments`, `root_files`, `corrective_files`, `preventive_files`, `root_imgs`, `corrective_imgs`, `preventive_imgs`, `root_cause`, `corrective_action`, `preventive_action`, `ecr_data`, `is_exist_ecr`, `approvals`  
            FROM `bb_capa` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'capa_ecr':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku_capa`, `status` as `Status`, `part_number`, `part_name`, `quality_issue`, `problems`, `compliance_enforcement`, `process_issue`, `design_issue`, `issue_comments`, `comments`, `root_files`, `corrective_files`, `preventive_files`, `root_imgs`, `corrective_imgs`, `preventive_imgs`, `root_cause`, `corrective_action`, `preventive_action`, `ecr_data`, `is_exist_ecr`, `approvals`, `approval_status`, `comments`  
            FROM `bb_capa_ecr` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
       case 'ecr':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku`, `status` as `Status`, `ecr_type`, `base_date`, `ecr_data`, `approvals`, `initiator`, `department`, `critical_item`, `ProductType`, `ecr_description`, `ecr_reason`, `immediate_ca`, `customer`, `name_position`, `customer_approval`, `customer_recall`, `impact_explain`, `sold_qty`, `recalled_lot`, `corrected_lot`, `recall_date`, `doc_support_imgs`, `doc_support_files`, `files`  
            FROM `bb_ecr` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'ecr_approval':
        $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku`, `status` as `Status`, `ecr_type`, `base_date`, `ecr_data`, `approvals`, `initiator`, `department`, `critical_item`, `ProductType`, `ecr_description`, `ecr_reason`, `immediate_ca`, `customer`, `name_position`, `customer_approval`, `customer_recall`, `impact_explain`, `sold_qty`, `recalled_lot`, `corrected_lot`, `recall_date`, `doc_support_imgs`, `doc_support_files`, `files`, `approval_status`, `notes`  
            FROM `bb_ecr_approval` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'ecr_implementation':
        $query = "SELECT tp.`idx`, tp.`RequestID`, tp.`draft`, tp.`Responsible`, tp.`AssignedTo`, tp.`AssignmentDate`, tp.`DueDate`, tp.`RequestedDate`, tp.`CompletionDate`, tp.`NewDueDate`, tp.`ProductLine`, tp.`bbb_sku`, `status` as `Status`, tp.`ecr_type`, tp.`base_date`, tp.`ecr_data`, tp.`approvals`, tp.`initiator`, tp.`department`, tp.`critical_item`, tp.`ProductType`, tp.`ecr_description`, tp.`ecr_reason`, tp.`immediate_ca`, tp.`customer`, tp.`name_position`, tp.`customer_approval`, tp.`customer_recall`, tp.`impact_explain`, tp.`sold_qty`, tp.`recalled_lot`, tp.`corrected_lot`, tp.`recall_date`, tp.`doc_support_imgs`, tp.`doc_support_files`, tp.`files`, GROUP_CONCAT(ce.`idx`) AS `task_ids`, GROUP_CONCAT(`approval_status`) AS `statuses`, GROUP_CONCAT(ce.`Responsible`) AS `persons`, GROUP_CONCAT(ce.`draft`) AS `drafts`, `impl_action`, `implementation_date`, `signatures` 
            FROM `bb_ecr_implementation` tp
            INNER JOIN bb_order_tasks ON tp.`idx` = `outID_task`
            INNER JOIN `bb_ecr_approval` ce ON ce.`RequestID` = tp.`RequestID`
            WHERE `task_id`=" .$editid;
        break;
        case 'tooling_request':
            $query = "SELECT tr.`idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, tr.`AssignmentDate`, tr.`DueDate`, tr.`RequestedDate`, tr.`CompletionDate`, `NewDueDate`, tr.RequestedBy, tr.bbb_sku_used, tr.operation_procedures, tr.quantity, tr.tool_id, tr.pending_design, tg.`drawing2d`, tg.`drawing3d`, tg.`add_spec`, tg.`addImages`, `status` AS `Status`, tg.`description`, tg.`life_time`, tg.`name`, tg.`number`, tg.`estimated_unit_price`, tg.`id`, tg.`tool_gage_type`, tg.`alternative_id`   
                FROM `bb_tooling_request` tr
                INNER JOIN bb_order_tasks ot ON tr.`idx` = ot.`outID_task`
                LEFT JOIN bb_tool_gage tg ON tg.`id` = tr.`tool_id`
                WHERE `task_id`=" .$editid;
            if (!$stmt = $db->query($query)) {
                echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
            } 
            else {
                $result = $stmt->fetch_array(MYSQLI_ASSOC);
                $req_id = $result['RequestID'];
                $t_g_type = $result['tool_gage_type'];
                $tool_id = $result['tool_id'];
                $stmt->close();
            }

            if($t_g_type == 1) {
                $query_number_qty_id = "SELECT op.`id`, op.`number`, og.`qty` FROM bb_operation_gage og
                    INNER JOIN bb_operations op ON op.`id` = og.`operation_id`
                    WHERE og.`gage_id` = $tool_id";
            }
            if($t_g_type == 0) {
                $query_number_qty_id = "SELECT op.`id`, op.`number`, ot.`qty` FROM bb_operation_tool ot
                    INNER JOIN bb_operations op ON op.`id` = ot.`operation_id`
                    WHERE ot.`tool_id` = $tool_id";
            }

            $query = $query_number_qty_id;
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $id_operation[] = $tmp['id'];
                    $result1[] = $tmp;
                }               
                $stmt->close();
                if ($result1 != null){
                    $result1 =  json_encode($result1);
                    $str_oper = implode(",", $id_operation);
                }
            else $str_oper = 0;

            if($t_g_type == 1) {
                $query_sku = "SELECT DISTINCT(bs.`name`) FROM bb_tasks_operation_gage tog
                    INNER JOIN `bb_tasks_sku` ts ON ts.`RequestID` = tog.`RequestID`
                    INNER JOIN `bb_bbb_sku` bs ON ts.`bbb_sku_id` = bs.`id`
                    WHERE tog.`operation_id` IN ($str_oper)";
            }
            if($t_g_type == 0) {
                $query_sku = "SELECT DISTINCT(bs.`name`) FROM bb_tasks_operation_tool tot
                    INNER JOIN `bb_tasks_sku` ts ON ts.`RequestID` = tot.`RequestID`
                    INNER JOIN `bb_bbb_sku` bs ON ts.`bbb_sku_id` = bs.`id`
                    WHERE tot.`operation_id` IN ($str_oper)";
            }

            $query = $query_sku;
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result2[] = $tmp['name']; 
                }               
                $stmt->close();
                if ($result2){
                    $result2 =  implode(",", $result2);
                }

            $result['number_qty_id'] = $result1;
            $result['sku_name'] = $result2;
            if($response_type=='array') {
                return  $result;
            }
            else {
                echo json_encode($result);
            }
            $db->close();
            exit;
        break;
        case 'equipment_request':
            $query = "SELECT eq.`idx`, eq.`RequestID`, eq.`draft`, eq.`Responsible`, eq.`AssignedTo`, eq.`AssignmentDate`, eq.`DueDate`, eq.`RequestedDate`, eq.`CompletionDate`, eq.`NewDueDate`, eq.`RequestedBy`, eq.equipment_id, eq.operation_procedures, eq.quantity, eq.bbb_sku_used, eq.pending_design, equ.`drawing2d`, equ.`drawing3d`, equ.`add_spec`, equ.`addImages`, `status` AS `Status`, equ.`description`, equ.`life_time`, equ.`name`, equ.`number`, equ.`estimated_unit_price`, equ.`id`, equ.`alternative_id`   
                FROM `bb_equipment_request` eq
                INNER JOIN bb_order_tasks ot ON eq.`idx` = ot.`outID_task`
                LEFT JOIN bb_equipment equ ON equ.`id` = eq.`equipment_id`
                WHERE `task_id`=" .$editid;
            if (!$stmt = $db->query($query)) {
                echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
            } 
            else {
                $result = $stmt->fetch_array(MYSQL_ASSOC);
                $req_id = $result['RequestID'];
                $eq_id = $result['equipment_id'];
                $stmt->close();
            }

            $query = "SELECT op.`id`, op.`number`, oe.`qty` FROM bb_operation_equipment oe
                INNER JOIN bb_operations op ON op.`id` = oe.`operation_id`
                WHERE oe.`equipment_id` = $eq_id";
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $id_operation[] = $tmp['id'];
                    $result1[] = $tmp;
                }               
                $stmt->close();
                if ($result1 != null){
                     $result1 =  json_encode($result1);
                     $str_oper = implode(",", $id_operation);
                }
                else $str_oper = 0;

            $query = "SELECT DISTINCT(bs.`name`) FROM bb_tasks_operation_equipment toe
                INNER JOIN `bb_tasks_sku` ts ON ts.`RequestID` = toe.`RequestID`
                INNER JOIN `bb_bbb_sku` bs ON ts.`bbb_sku_id` = bs.`id`
                WHERE toe.`operation_id` IN ($str_oper)";
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result2[] = $tmp['name'];
                }               
                $stmt->close();
                if ($result2){
                     $result2 =  implode(",", $result2);
                }

            $result['number_qty_id'] = $result1;
            $result['sku_name'] = $result2;
            if($response_type=='array') {
                return  $result;
            }
            else {
                echo json_encode($result);
            }
            $db->close();
            exit;
        break;
        case 'workstation_request':
            $query = "SELECT wkr.`idx`, wkr.`RequestID`, wkr.`draft`, wkr.`Responsible`, wkr.`AssignedTo`, wkr.`AssignmentDate`, wkr.`DueDate`, wkr.`RequestedDate`, wkr.`CompletionDate`, wkr.`NewDueDate`, wkr.`RequestedBy`, wkr.workstation_id, wkr.operation_procedures, wkr.quantity, wkr.bbb_sku_used, wkr.pending_design, wk.`drawing2d`, wk.`drawing3d`, wk.`add_spec`, wk.`addImages`, `status` AS `Status`, wk.`description`, wk.`life_time`, wk.`name`, wk.`number`, wk.`estimated_unit_price`, wk.`id`, wk.`alternative_id`   
                FROM `bb_workstation_request` wkr
                INNER JOIN bb_order_tasks ot ON wkr.`idx` = ot.`outID_task`
                LEFT JOIN bb_workstation wk ON wk.`id` = wkr.`workstation_id`
                WHERE `task_id`=" .$editid;
            if (!$stmt = $db->query($query)) {
                echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
            } 
            else {
                $result = $stmt->fetch_array(MYSQL_ASSOC);
                $work_id = $result['workstation_id'];
                $stmt->close();
            }

            $query = "SELECT op.`id`, op.`number`, ow.`qty` FROM bb_operation_workstation ow
                INNER JOIN bb_operations op ON op.`id` = ow.`operation_id`
                WHERE ow.`workstation_id` = $work_id";
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $id_operation[] = $tmp['id'];
                    $result1[] = $tmp;
                }               
                $stmt->close();
                if ($result1 != null){
                     $result1 =  json_encode($result1);
                     $str_oper = implode(",", $id_operation);
                }
                else $str_oper = 0;

            $query = "SELECT DISTINCT(bs.`name`) FROM bb_tasks_operation_workstation tow
                INNER JOIN `bb_tasks_sku` ts ON ts.`RequestID` = tow.`RequestID`
                INNER JOIN `bb_bbb_sku` bs ON ts.`bbb_sku_id` = bs.`id`
                WHERE tow.`operation_id` IN ($str_oper)";
            $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result2[] = $tmp['name'];
                }               
                $stmt->close();
                if ($result2){
                     $result2 =  implode(",", $result2);
                }

            $result['number_qty_id'] = $result1;
            $result['sku_name'] = $result2;
            if($response_type=='array') {
                return  $result;
            }
            else {
                echo json_encode($result);
            }
            $db->close();
            exit;
        break;
        case 'due_diligence':
            $query = "SELECT tab.*, `order_id` as RequestID, `assignee` as AssignedTo,  `status` as Status, `assigned_by` as Responsible, tab.`RequestedDate`/*`requested_date` as RequestedDate*/, tab.`AssignmentDate`/*`assignment_date` as AssignmentDate*/, DATE(`due_date`) as DueDate , tab.`CompletionDate`/*`completion_date` as CompletionDate*/, DATE(`new_due_date`) as NewDueDate, `newsku`, `competitor`
                FROM bb_order_tasks ot
                LEFT JOIN  `bb_". $table . "` tab ON tab.idx = ot.outID_task
                WHERE  `task_id`=" . $editid;
                //echo $query;
            if (!$stmt = $db->query($query)) {
                echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
            } else {
                $result = $stmt->fetch_array(MYSQL_ASSOC);
                $stmt->close();
            }
            $query = "SELECT core_sku as name, setUp FROM bb_due_core_sku  WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" . $editid . ")";
                $stmt = $db->query($query);
                while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result1[] = $tmp;
                }               
                $stmt->close();
                if ($result1){
                     $result1 =  json_encode($result1);
                }
               

            $query = "SELECT oe_reman_sku as reman_sku, upc FROM bb_due_reman_sku_upc  WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" . $editid . ")";
            $stmt = $db->query($query);
            while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result2[] = $tmp;
            }               
                $stmt->close();
                if ($result2){
                     $result2 =  json_encode($result2);
                }


            /*$query = "SELECT competitor, competitor_cross_ref, competitor_market_price, MarketPriceDate, competitor_core_price, CorePriceDate FROM bb_due_competitor  WHERE `RequestID`= (SELECT `order_id` FROM `bb_order_tasks` WHERE `task_id`=" . $editid . ")";
            $stmt = $db->query($query);
            while( $tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $result3[] = $tmp;
            }               
                $stmt->close();
                if ($result3){
                     $result3 =  json_encode($result3);
                }
                

                $result['competitor_block'] = $result3;*/
                $result['reman_sku_upc'] = $result2;
                $result['core_skuT'] = $result1;
                if($response_type=='array') {
                    return  $result;
                }
                else {
                    echo json_encode($result);
                }
                $db->close();
               exit;
        break;
        case "sample_procurement":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `stqOE`, `stqCore`, `ETAforSamples`, `RecipientName`, `ShipToLocation`, `Address`, `Supplier`, `po`, `CCOrder`, `Tracking`, `ActualDate`, `SampleLocation` FROM `bb_sample_procurement` sp
            INNER JOIN `bb_order_tasks` ot ON sp.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "feasibility_product_eng":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `SampleLocation`, `ValidationCapability`, `notes1`, `RFEngineeringCapability`, `notes2` FROM `bb_feasibility_product_eng` prod
            INNER JOIN `bb_order_tasks` ot ON prod.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "feasibility_process_eng":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `SampleLocation`, `ManufacturingCapability`, `notes1`, `CFSpaceCapability`, `notes2` FROM `bb_feasibility_process_eng` proc
            INNER JOIN `bb_order_tasks` ot ON proc.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "cost_estimate":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `min_order_qty`, `EstimatedMaterial`, `HoursPerUnit`, `HourlyLoadedRate`, `Markup`, `Years`, `LoadedCost`, `MarkUpCost`, `ToolingAmortization`, `CostEstimate`, `EstimatedTotal` FROM `bb_cost_estimate` cost
            INNER JOIN `bb_order_tasks` ot ON cost.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "preliminary_roi_pm":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `min_order_qty`, `first_year_demand`, `anti_pipe_fill`, `est_exch_price`, `est_core_charge`, `est_annual_revenue`, `finish_goods_target_lev`, `CostEstimatePerUnit`, `EstimatedTotalInvestment`, `CorePurchaseCostPerUnit`, `GrossProfitPerUnit`, `AnnualizedInvestmentAmortization`, `FirstYearGrossProfit`, `YearFiveGrossProfit`, `PreliminaryROI`, `PreliminaryROIApproval`, `PreliminaryROIComment`, `PreliminaryROIApprover`, `PreliminaryROIApprovalDate` FROM `bb_preliminary_roi_pm` pre
            INNER JOIN `bb_order_tasks` ot ON pre.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "npd_request":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `Annualdemand`, `SampleLocation` FROM `bb_npd_request` npd
            INNER JOIN `bb_order_tasks` ot ON npd.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "sample_validation":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `SampleLocation`, `stqOE`, `stqCore`, `tagNumOE`, `tagNumCore`, `SampleCorrectOE`, `SampleCorrectCore`, `Note` FROM `bb_sample_validation` val
            INNER JOIN `bb_order_tasks` ot ON val.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case "eps_production":
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `ProductLine`, `status` as Status, `bbb_sku`, `oe_latest_sku`, `oe_reman_sku`, `core_sku`, `Application`, `final_test`, `diagnostic_software`, `existing_equipment`, `description` FROM `bb_eps_production` eps
            INNER JOIN `bb_order_tasks` ot ON eps.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'new_engineering_req':
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `WhatProductLine`, `status` as Status, `ERPOrderID`, `Application`, `PotentialCustomers`, `Annualdemand`, `ReasonforRequest`, `ExistingProductline` FROM `bb_new_engineering_req` eng
            INNER JOIN `bb_order_tasks` ot ON eng.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        case 'new_product_line':
            $query = "SELECT `idx`, `RequestID`, `draft`, `Responsible`, `AssignedTo`, `AssignmentDate`, `DueDate`, `RequestedDate`, `CompletionDate`, `NewDueDate`, `ProductType`, `status` as Status, `ERPOrderID`, `Application`, `PotentialCustomers`, `Annualdemand`, `ReasonforRequest`, `ExistingProductline`, `Newproductlinename` FROM `bb_new_product_line` proline
            INNER JOIN `bb_order_tasks` ot ON proline.`idx` = ot.`outID_task`
            WHERE `task_id`=" .$editid;
        break;
        default:
            if (!$db->query("SELECT * FROM `bb_". $table . "` LIMIT 1")) {
                $query = "SELECT  `order_id` as RequestID, `assignee` as AssignedTo,  `status` as Status, `assigned_by` as Responsible,  `requested_date` as RequestedDate, `assignment_date` as AssignmentDate, DATE(`due_date`) as DueDate , `completion_date` as CompletionDate, DATE(`new_due_date`) as NewDueDate 
                    FROM bb_order_tasks ot
                    WHERE  `task_id`=" . $editid;

            }else{
                $query = "SELECT tab.*, `order_id` as RequestID, `assignee` as AssignedTo,  `status` as Status, `assigned_by` as Responsible,  `requested_date` as RequestedDate, `assignment_date` as AssignmentDate, DATE(`due_date`) as DueDate , `completion_date` as CompletionDate, DATE(`new_due_date`) as NewDueDate 
                FROM bb_order_tasks ot
                LEFT JOIN  `bb_". $table . "` tab ON tab.idx = ot.outID_task
                WHERE  `task_id`=" . $editid;
            }

        }

    if (!$stmt = $db->query($query)) {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
        exit;
    } else {
        for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);)
            $result[] = $tmp;
        $stmt->close();
        $task_content = $result[0];
        $db->commit();
    }

    $db->close();
    return $task_content;
}



function checkDynamicID($dynamicID){
    global $db;
    $result = false;
    $query = "SELECT COUNT(*) FROM `bb_family_attr` WHERE `dynamic_id` = '".$dynamicID."'";
    if($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if($count==0){
            $result =  true;
        }
    }
    return $result;
}


function getDynamicID($str){
    $dynamicID = "";
    $str = (string) $str;
    $str = strip_tags($str);
    $str = str_replace(array("\n", "\r"), " ", $str);
    $str = preg_replace("/\s+/", ' ', $str);
    $str = trim($str);
    $str = mb_strtolower($str, 'utf-8');
    $str = preg_replace("/[^0-9a-z-_ ]/i", "", $str);
    $str = str_replace(" ", "_", $str);
    $str = str_replace("-", "_", $str);
    while(!checkDynamicID($str)){
        $str .="I";
    }
    return $str;
}

function setFamilyAttr($data, $family_id, $type){
    global $db;
    if(count($data)>0){
        for($i=0; $i<count($data); $i++){
        	$data[$i]['attr_name'] = trim($data[$i]['attr_name']);
            if(!$data[$i]['dynamic_id']||$data[$i]['dynamic_id']==""){
                $data[$i]['dynamic_id'] = getDynamicID($data[$i]['attr_name']);
            }

            if(!$data[$i]['attr_id']||$data[$i]['attr_id']==""){
                $query = "SELECT COUNT(*) FROM `bb_family_attr` WHERE `attr_name` = '".$data[$i]['attr_name']."' AND `attr_type` = ".$data[$i]['attr_type'];

                if($stmt = $db->prepare($query)) {
                    $stmt->execute();
                    $stmt->bind_result($count);
                    $stmt->fetch();
                    $stmt->close();
                }

               if($count==0){
                    $data[$i]['attr_id'] = em_insert('bb_family_attr', array('attr_type'=>$data[$i]['attr_type'], 'attr_name'=>$data[$i]['attr_name'], 'data_type'=>$data[$i]['data_type'], 'comment'=>$data[$i]['comment'], 'dynamic_id'=>$data[$i]['dynamic_id']));

                   if($data[$i]['data_type']==2){
                   		$query = "SELECT `".$data[$i]['dynamic_id']."`FROM `bb_family_attr_stores` LIMIT 1";
                   		if(!$db->query($query)){
                   			$query = "ALTER TABLE `bb_family_attr_stores` ADD COLUMN `".$data[$i]['dynamic_id']."` TEXT NULL";
                        	em_query($query);
                   		}
                    }

                    if($type=='core_attr'){
                        $attr_table = 'bb_res_core_analysis';
                    }
                    else {
                        $attr_table = 'bb_res_phys_attributes';
                    }

                    $query = "SELECT `".$data[$i]['dynamic_id']."`FROM `".$attr_table."` LIMIT 1";
                    if(!$db->query($query)){
               			$query = "ALTER TABLE `".$attr_table."` ADD COLUMN `".$data[$i]['dynamic_id']."` TEXT NULL";
                    	em_query($query);
               		}

                }
                else {
                     $query = "SELECT `id` FROM `bb_family_attr` WHERE `attr_name` = '".$data[$i]['attr_name']."' AND `attr_type` = ".$data[$i]['attr_type']." LIMIT 1";
                        if($stmt = $db->prepare($query)) {
                            $stmt->execute();
                            $stmt->bind_result($attr_id);
                            $stmt->fetch();
                            $stmt->close();
                        }

                        $data[$i]['attr_id'] =$attr_id;
                }
            }

            em_insert('bb_family_type_content', array('family_type_id'=>$family_id, 'attr_id'=>$data[$i]['attr_id'], 'deleted'=>$data[$i]['deleted'], 'order_col'=>$data[$i]['order_col']));
        }
    }
}

function updateFamilyAttr($data, $family_id, $type){
    global $db;
    if(count($data)>0){
        $new_data = array();
        for($i=0; $i<count($data); $i++){
            if($data[$i]['attr_id']&&$data[$i]['attr_id']!=""){
                $where = "`id` = ".$data[$i]['attr_id'];
                em_update('bb_family_attr', array('attr_name'=>$data[$i]['attr_name'], 'comment'=>$data[$i]['comment']), $where);
                $where = "`family_type_id` = ".$family_id." AND `attr_id`= ".$data[$i]['attr_id'];
                em_update('bb_family_type_content', array('deleted'=>$data[$i]['deleted'], 'order_col'=>$data[$i]['order_col']), $where);
            }
            else {
                $new_data[]=$data[$i];
            }
        }
        if(count($new_data)>0){
            setFamilyAttr($new_data, $family_id, $type);
        }
    }
}

function getFamilyData($family_id){
    global $db;
    $phys_attr = array();
    $phys_data = array();
    $core_attr = array();
    $core_data = array();
    $attr = array();

    if($family_id&&$family_id!=""){
        $query = "SELECT `family_name`, `family_description` FROM `bb_family_type` WHERE `id` = ".$family_id;
        if ($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($family_name, $family_description);
            $stmt->fetch();
            $stmt->close();
        }

        $query="SELECT `attr_id`, `attr_name`, `data_type`, `comment`, `attr_type`, `dynamic_id`, `deleted`, `order_col` FROM `bb_family_type_content` ftc
            INNER JOIN `bb_family_attr` fa ON fa.`id` = ftc.`attr_id`
            WHERE `family_type_id` =".$family_id." ORDER BY `order_col` ASC";
            if($stmt = $db->query($query)){
                while($tmp = $stmt->fetch_array(MYSQL_ASSOC)){
                    $attr[] = $tmp;
                }
            }
            $stmt->close();

         for ($i=0; $i<count($attr); $i++) {
                if($attr[$i]['attr_type']==1){
                    unset($attr[$i]['attr_type']);
                    $core_attr[] = $attr[$i];
                }
                elseif($attr[$i]['attr_type']==2){
                    unset($attr[$i]['attr_type']);
                    $phys_attr[] = $attr[$i];
                }
            }

        $result = array('family_id'=>$family_id, 'family_name'=>$family_name, 'family_description'=>$family_description, 'phys_attr'=>(count($phys_attr)>0)? json_encode($phys_attr):null, 'core_attr'=>(count($core_attr)>0)? json_encode($core_attr):null, 'phys_attr'=>(count($phys_attr)>0)? json_encode($phys_attr):null);
        return $result;
    }
}


function checkResTables($RequestID){
    include '../lang/langs.php';
    global $db;
    $msg = "";
    $query = "SELECT COUNT(*) FROM `bb_res_core_analysis` WHERE `RequestID` = ".$RequestID;
        if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count_core);
            $stmt->fetch();
            $stmt->close();
        }
        else{
            $count_core = 0;
        }

   if($count_core==0){
        $msg .= $answers['detail_table_core_not_filled'];
    }

    $query = "SELECT COUNT(*) FROM `bb_res_phys_attributes` WHERE `RequestID` = ".$RequestID;
        if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($count_phys);
            $stmt->fetch();
            $stmt->close();
        }
        else{
            $count_phys = 0;
        }

  if($count_phys==0){
         $msg .= $answers['physical_attr_not_filled'];
    }

    if($count_core==0||$count_phys==0){
        $result = array('success'=>false, 'message'=>$msg);
    }
    else {
        $result = array('success'=>true);
    }

    return $result;
}

function checkCountCapex($process_id, $RequestID){
    global $db;
    $count = 0;
    $check_result = false;
    $arr_elem = array('tool', 'gage', 'equipment', 'workstation');
    $operations = "";
    $query = "SELECT GROUP_CONCAT(`operation_id`) FROM `bb_process_flow_content` WHERE `process_id`=".$process_id;
    if($stmt = $db->prepare($query)) {
            $stmt->execute();
            $stmt->bind_result($operations);
            $stmt->fetch();
            $stmt->close();
        }
    if($operations!==""){
        for($i=0; $i<count($arr_elem); $i++){
         $query="SELECT COUNT(*) FROM `bb_tasks_operation_".$arr_elem[$i]."` 
            WHERE `RequestID` = ".$RequestID." AND `capex`=0 AND `operation_id` IN (".$operations.")";
            if($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($temp_count);
                $stmt->fetch();
                $stmt->close();
                $count+=$temp_count;
            }
        }
    }
    
    if($count>0){
        $check_result = true;
    }
    return $check_result;
}

function isCompleted($table, $idx){
    global $db;
    $draft = 0;
    $result = true;
    $query="SELECT `draft` FROM `bb_".$table."` WHERE `idx` = ".$idx;
    if($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($draft);
        $stmt->fetch();
        $stmt->close();
        $count+=$temp_count;
    }

    if($draft==1){
        $result = false;
    }
    else {
        $result = true;
    }
    return $result;
}

function formatToLatin($str){
    $str =trim(stripcslashes($str));
    $str = preg_replace("/\ /", "_", $str);
    $str = mb_strtolower(preg_replace("/[^a-zA-Z0-9_]/", "", $str));
    return $str;
}

function getMKTime($date){
    $date_mk = "";
    $date_arr = explode(" ", $date);
    $date_dmy = explode("-", $date_arr[0]);
    $date_time = explode(":", $date_arr[1]);
    $hours = ($date_time[0])? $date_time[0]: '00';
    $min = ($date_time[1])? $date_time[1]: '00';
    $sec = ($date_time[2])? $date_time[2]: '00';
    
    $year = ($date_dmy[0])? $date_dmy[0]: null;
    $month = ($date_dmy[1])? $date_dmy[1]: null;
    $day = ($date_dmy[2])? $date_dmy[2]: null;
    if($year&&$month&&$day){
        $date_mk = mktime($hours, $min, $sec, $month, $day, $year);
    }
    return $date_mk;
}

function transform_greenwich($date) {
    global $gmt;
    $utc = 0;
    if($gmt == "(UTC +02:00) Europe") $utc = -3;
    elseif($gmt == "(UTC-05:00) Eastern Time (US & Canada)") $utc = 4;
    else $utc = 5;
    $parse_date = date_parse($date);
    $year = $parse_date['year'];
    $month = $parse_date['month']/* + 1*/;
    $day = $parse_date['day'];
    $hour = $parse_date['hour'] + $utc;
    $minute = $parse_date['minute'];
    $second = $parse_date['second'];

    $time_stamp = mktime($hour, $minute, $second, $month, $day, $year);

    return $time_stamp;
}

function transform_complit_date($date) {
    $parse_date = date_parse($date);
    $year = $parse_date['year'];
    $month = $parse_date['month']/* + 1*/;
    $day = $parse_date['day'];
    $hour = $parse_date['hour'];
    $minute = $parse_date['minute'];
    $second = $parse_date['second'];

    $time_stamp = mktime($hour, $minute, $second, $month, $day, $year);
    return $time_stamp;
}


    function checkKitContent($comp_arr){
        global $db;
        $result = array();
        $out =  array();
        if($comp_arr['kit_data']){
            $temp_kit = JsonToArray($comp_arr['kit_data']);
            for($i=0; $i<count($temp_kit); $i++){
                foreach ($temp_kit[$i] as $key => $value) {
                   if($key=='comp_id'||$key=='qty'){
                        $kit[$i][$key] = $value;
                   }
                }
            }

        $query = "SELECT `component_id`, `kit_part_id`, `qty` FROM `bb_kit_content`";
            if($stmt = $db->prepare($query)){
                $stmt->execute();
                $stmt->bind_result($component_id, $kit_part_id, $qty);
                while ($stmt->fetch()){
                    $kit_bd[$component_id][]= array('comp_id'=>$kit_part_id, 'qty'=>$qty);
                }
                $stmt->close();
                }
            foreach($kit_bd as $key=>$value) {
                if(count($kit)==count($value)){
                    for ($i=0; $i<count($value); $i++) {
                        $count_row = 0;
                        $exist_row = false;
                        $count = count($value);

                        for($j=0; $j<$count; $j++){
                            for($k=0; $k<$count; $k++){
                                if(count(array_diff_assoc($kit[$j], $value[$k]))==0){
                                        $exist_row = true;
                                    }
                                if($exist_row === false) {
                                    continue;
                                    }
                                    else {
                                        $count_row++;
                                        $exist_row = false;
                                    }
                            }
                            if($count_row==$count){
                                $out[]= $key;
                            }
                        }
                    }
                }
            }
            
            $out = array_unique($out);
            $num_comp =  count($out);
            if($num_comp ==1 && $comp_arr['comp_id']==$out[0])  {
                $result = array('exist'=>true, 'this'=>true, 'message'=>"");
            }
            elseif($num_comp==0){
                $result = array('exist'=>false, 'this'=>false, 'message'=>"");
            }
            else {
                $ids = "";
                foreach ($out as $value) {
                    $ids .= $value.",";
                }
                $ids = "(".substr($ids, 0, -1).")";

                $query="SELECT `id`, `part_number`, `division` FROM `bb_components` WHERE `id` IN ".$ids;
                $result = em_query($query);
                while ($row = $result->fetch_array(MYSQL_ASSOC)){
                    $op_data[] = $row;
                }
                $comp_list = "";
                for ($i=0; $i<count($op_data); $i++) {
                    $division = ($op_data[$i]['division']==1)?'AMAM':'OES';
                    $comp_list .= $op_data[$i]['part_number']."(".$division."); ";
                }

                $message = "Components with the same content are already exists ".$comp_list;
                $result = array('exist'=>true, 'this'=>false, 'message'=>$message);
            }
        }
        return $result;
    }

    function checkAttrTables($comp_arr){
        global $db;

        $dim = array();
        $func = array();
        $out = array();
        if($comp_arr['dim_attr']&&$comp_arr['dim_attr']!=""){
            $temp_dim = JsonToArray($comp_arr['dim_attr']);
            for($i=0; $i<count($temp_dim); $i++){
                foreach ($temp_dim[$i] as $key => $value) {
                   if($key=='dimension_name'||$key=='dimension'||$key=='metric'){
                        $dim[$i][$key] = $value;
                   }
                }
            }

            $query = "SELECT `component_id`, `dimension_name`, `metric`, `dimension` FROM `bb_dimensional_attributes`";
            if($stmt = $db->prepare($query)){
                $stmt->execute();
                $stmt->bind_result($component_id, $dimension_name, $metric, $dimension);
                while ($stmt->fetch()){
                    $dim_bd[$component_id][]= array('dimension_name'=>$dimension_name, 'metric'=>$metric, 'dimension'=>$dimension);
                }
                $stmt->close();
                }

            foreach($dim_bd as $key=>$value) {
                if(count($dim)==count($value)){
                    for ($i=0; $i<count($value); $i++) {
                        $count_row = 0;
                        $exist_row = false;
                        $count = count($value);

                        for($j=0; $j<$count; $j++){
                            for($k=0; $k<$count; $k++){
                                if(count(array_diff_assoc($dim[$j], $value[$k]))==0){
                                        $exist_row = true;
                                    }
                                if($exist_row === false) {
                                    continue;
                                    }
                                    else {
                                        $count_row++;
                                        $exist_row = false;
                                    }
                            }
                            if($count_row==$count){
                                $out['dim'][]= $key;
                            }
                        }
                    }
                }
            }
            if($out['dim']) {
                if($comp_arr['func_attr']&&$comp_arr['func_attr']!=""){
                    $temp_func = JsonToArray($comp_arr['func_attr']);
                    for($i=0; $i<count($temp_func); $i++){
                        foreach ($temp_func[$i] as $key => $value) {
                           if($key=='value_desc'||$key=='nominal'||$key=='metric'){
                                $func[$i][$key] = $value;
                           }
                        }
                    }

                    $query = "SELECT `component_id`, `value_desc`, `metric`, `nominal` FROM `bb_functional_attributes`";
                    if($stmt = $db->prepare($query)){
                        $stmt->execute();
                        $stmt->bind_result($component_id, $value_desc, $metric, $nominal);
                        while ($stmt->fetch()){
                            $func_bd[$component_id][]= array('value_desc'=>$value_desc, 'metric'=>$metric, 'nominal'=>$nominal);
                        }
                        $stmt->close();
                        }

                    foreach($func_bd as $key=>$value) {
                        if(count($func)==count($value)){
                            for ($i=0; $i<count($value); $i++) {
                                $count_row = 0;
                                $exist_row = false;
                                $count = count($value);

                                for($j=0; $j<$count; $j++){
                                    for($k=0; $k<$count; $k++){
                                        if(count(array_diff_assoc($func[$j], $value[$k]))==0){
                                                $exist_row = true;
                                            }
                                        if($exist_row === false) {
                                            continue;
                                            }
                                            else {
                                                $count_row++;
                                                $exist_row = false;
                                            }
                                    }
                                    if($count_row==$count){
                                        $out['func'][]= $key;
                                    }
                                }
                            }
                        }
                    }
                    if(!$out['func']) $out['func'] = null;
                }
            }
        }

        

    if($out['func']&&$out['dim']){
        $out1 = array_uintersect($out['func'], $out['dim'], "strcasecmp");
    }
    elseif(!$out['func']&&$out['dim']){
        $out1 = $out['dim'];
    }
    else {
        $out1 = array();
    }
    $out1 = array_unique($out1);
   
    $num_comp =  count($out1);
    $tmp_out = $out1;
    if($num_comp ==1 && $comp_arr['comp_id']==array_shift($tmp_out))  {
        $result = array('exist'=>true, 'this'=>true, 'message'=>"");
    }
    elseif($num_comp==0){
        $result = array('exist'=>false, 'this'=>false, 'message'=>"");
    }
    else {
        $ids = "";
        foreach ($out1 as $value) {
            $ids .= $value.",";
        }
        $ids = "(".substr($ids, 0, -1).")";

        $query="SELECT `id`, `part_number`, `division` FROM `bb_components` WHERE `id` IN ".$ids;
        $result = em_query($query);
        while ($row = $result->fetch_array(MYSQL_ASSOC)){
            $op_data[] = $row;
        }
        $comp_list = "";
        for ($i=0; $i<count($op_data); $i++) {
            $division = ($op_data[$i]['division']==1)?'AMAM':'OES';
            $comp_list .= $op_data[$i]['part_number']."(".$division."); ";
        }

        $message = "Components with the same attributes are already exists ".$comp_list;
        $result = array('exist'=>true, 'this'=>false, 'message'=>$message);
    }
    return $result;
 }

 function isExistKit($comp_arr) {
    global $db;
    $query = "SELECT `id` FROM `bb_components` WHERE `part_number` = '".$comp_arr['part_number']."'";
    
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id);
        while ($stmt->fetch()){
            $tmp[]= $id;
        }
        $stmt->close();
    }
    $count = count($tmp);
    if($count==0){
        $check_attr = checkKitContent($comp_arr);
        $result = array('exist'=>$check_attr['exist'], 'this'=>$check_attr['this'], 'message'=>$check_attr['message']);
    }
    elseif($count==1&&$tmp[0]==$comp_arr['comp_id']){
        $result = array('exist'=>true, 'this'=>true, 'message'=>"");
    }
    else {
        $result = array('exist'=>true, 'this'=>false, 'message'=>"Component/Kit with the same number is already exist.");
    }
    return $result;
 }

 function isExistComp($comp_arr){
    global $db;
    $query = "SELECT `id` FROM `bb_components` WHERE `part_number` = '".$comp_arr['part_number']."' AND `division`=".$comp_arr['division']."";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id);
        while ($stmt->fetch()){
            $tmp[]= $id;
        }
        $stmt->close();
    }
    $count = count($tmp);
    if($count==0){
        if($comp_arr['dim_attr']==""&&$comp_arr['func_attr']==""){
            if($comp_arr['comp_type']==4){
                $result = array('exist'=>false, 'this'=>false, 'message'=>"");
            }
            else {
                $result = array('exist'=>true, 'this'=>false, 'message'=> "Compinent can't to be without any attributes!");
            }
        }
        else {
            $check_attr = checkAttrTables($comp_arr);
            $result = array('exist'=>$check_attr['exist'], 'this'=>$check_attr['this'], 'message'=>$check_attr['message']);
        }
    }
    elseif($count==1&&$tmp[0]==$comp_arr['comp_id']){
        $check_attr = checkAttrTables($comp_arr);
        $result = array('exist'=>$check_attr['exist'], 'this'=>$check_attr['this'], 'message'=>$check_attr['message']);
    }
    else {
        $result = array('exist'=>true, 'this'=>false, 'message'=>"Component with the same number is already exist in this division.");
    }
    return $result;
 }

function saveComponent($comp_arr, $action){
    global $db;
    $count =0;
    $result = array('success'=>false, 'message'=>'Invalid saving data.');
    $check = isExistComp($comp_arr);
    if($action=='add'){
        if($check['exist']){
            $result = array('success'=>false, 'message'=>$check['message']);
        }
        else {
            $comp_arr['create_date'] = $comp_arr['last_mod'] = date('Y-m-d');
            $comp_arr['revision'] = 'A';
            $dim_attr = $comp_arr['dim_attr'];
            $func_attr = $comp_arr['func_attr'];
            
            unset($comp_arr['dim_attr']);
            unset($comp_arr['func_attr']);
            unset($comp_arr['comp_id']);

            $comp_id = em_insert('bb_components', $comp_arr);
            DimDataManagement($dim_attr, $comp_id);
            FuncDataManagement($func_attr, $comp_id);
            $result = array('success' => true, 'comp_id'=>$comp_id, 'comp_type'=>$comp_arr['comp_type'], 'message'=>'Component '.$comp_arr['part_number'].' created.');
        }
    }
    elseif($action=='edit'){
        if(($check['exist']&&$check['this'])||(!$check['exist']&&!$check['this'])){
            $comp_arr['last_mod'] = date('Y-m-d');
            $comp_arr['revision'] = setRevision($comp_arr['revision']);

            $dim_attr = $comp_arr['dim_attr'];
            $func_attr = $comp_arr['func_attr'];
            $comp_id = $comp_arr['comp_id'];
            $where = "`id` = ".$comp_id;

            unset($comp_arr['dim_attr']);
            unset($comp_arr['func_attr']);
            unset($comp_arr['comp_id']);

            em_update('bb_components', $comp_arr, $where);
            DimDataManagement($dim_attr, $comp_id);
            FuncDataManagement($func_attr, $comp_id);
            $result = array('success' => true, 'comp_id'=>$comp_id, 'comp_type'=>$comp_arr['comp_type'], 'message'=>'Component '.$comp_arr['part_number'].' updated.');
        }
        else {
            $result = array('success'=>false, 'message'=>$check['message']);
        }
    }
    $db->commit();
    return $result;
}

function saveKit($comp_arr, $action){
    global $db;
    $count =0;
    $result = array('success'=>false, 'message'=>'Invalid saving data.');
    $check = isExistKit($comp_arr);    
    $kit_data = $comp_arr['kit_data'];
    $comp_arr['last_mod'] = date('Y-m-d');
    unset($comp_arr['kit_data']);

    if($action=='add'){
        if($check['exist']){
            $result = array('success'=>false, 'message'=>$check['message']);
        }
        else {
            unset($comp_arr['comp_id']);
            $comp_arr['create_date'] = $comp_arr['last_mod'] = date('Y-m-d');
            $comp_id = em_insert('bb_components', $comp_arr);
            $kit_arr = JsonToArray($kit_data);
            for ($i=0; $i <count($kit_arr); $i++) { 
                em_insert('bb_kit_content', array('component_id'=>$comp_id, 'kit_part_id'=>$kit_arr[$i]['comp_id'], 'qty'=>$kit_arr[$i]['qty']));
            }
            $result = array('success'=>true, 'comp_id'=>$comp_id, 'comp_type'=>$comp_arr['comp_type'], 'message'=>'Kit successfully created.');
        }
    }
    elseif($action=='edit'){
        if($check['exist']&&$check['this']){
            $comp_arr['last_mod'] = date('Y-m-d');
            $comp_id = $comp_arr['comp_id'];
            $where = "`id` = ".$comp_id;
            unset($comp_arr['comp_id']);

            em_update('bb_components', $comp_arr, $where);
            
            $query = "DELETE FROM `bb_kit_content` WHERE `component_id` = ".$comp_id;
            em_query($query);

            $kit_arr = JsonToArray($kit_data);
            for ($i=0; $i <count($kit_arr); $i++) { 
                em_insert('bb_kit_content', array('component_id'=>$comp_id, 'kit_part_id'=>$kit_arr[$i]['comp_id'], 'qty'=>$kit_arr[$i]['qty']));
            }
            $result = array('success' => true, 'comp_id'=>$comp_id, 'comp_type'=>$comp_arr['comp_type'], 'message'=>'KIT '.$comp_arr['part_number'].' updated.');
        }
        else {
            $result = array('success'=>false, 'message'=>$check['message']);
        }
    }

    $db->commit();
    return $result;
}


function DimDataManagement($dataDim, $id_comp){
        $query = "DELETE FROM `bb_dimensional_attributes` WHERE `component_id` = ".$id_comp;
        em_query($query);

        $DimAttr =  json_decode(stripcslashes($dataDim));

        for($i=0; $i<count($DimAttr); $i++){
            $DimAttrValues = "";
            $DimAttr[$i] = (array)$DimAttr[$i];

            foreach ($DimAttr[$i] as $key => $value) {
                $DimAttrValues .= "`".$key."` = '".$value."',";
            }

           $DimAttrValues .= "`component_id` = ".$id_comp;
           $query = "INSERT INTO `bb_dimensional_attributes` SET ".$DimAttrValues;
           em_query($query);
        }
    }

    function FuncDataManagement($dataFunc, $id_comp){
        $query = "DELETE FROM `bb_functional_attributes` WHERE `component_id` = ".$id_comp;
        em_query($query);

        $FuncAttr =  json_decode(stripcslashes($dataFunc));

        for($i=0; $i<count($FuncAttr); $i++){
            $FuncAttrValues = "";
            $FuncAttr[$i] = (array)$FuncAttr[$i];

            foreach ($FuncAttr[$i] as $key => $value) {
                $FuncAttrValues .= "`".$key."` = '".$value."',";
            }

            $FuncAttrValues .= "`component_id` = ".$id_comp;
            $query = "INSERT INTO `bb_functional_attributes` SET ".$FuncAttrValues;
            em_query($query);
        }
    }

function transform_create_date($date) {
    $gmt = $_SESSION['gmt'];
    $utc = 0; 
    if($gmt == "(UTC +02:00) Europe") $utc = 3 * 3600;
    elseif($gmt == "(UTC-05:00) Eastern Time (US & Canada)") $utc = -(4 * 3600);
    else $utc = -(5 * 3600);

    $prev_create_date = date("Y-m-d H:i:s", $date);
    $parse_date = date_parse($prev_create_date);
    $year = $parse_date['year'];
    $month = $parse_date['month']/* - 1*/;
    $day = $parse_date['day'];
    $hour = $parse_date['hour'];
    $minute = $parse_date['minute'];
    $second = $parse_date['second'];

    $time_stamp = mktime($hour, $minute, $second, $month, $day, $year);
    $create_date = date("Y-m-d H:i:s", $time_stamp + $utc);

    return $create_date;
}

function checkProcess($data){
    global $db;
    $result = array('success'=>false);
    $tmp = array();

    $query = "SELECT `id` FROM `bb_process_flow` WHERE `bbb_sku_id` = ".$data['bbb_sku_id']." AND `is_temporary` = 0 AND `deleted`=0";

    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id);
        while ($stmt->fetch()){
            $tmp[]= $id;
        }
        $stmt->close();
    }
    $count = count($tmp);

    if($count==0){
        $result = array('success'=>true);
    }
    elseif($count==1&&$data['process_id']==$tmp[0]){
        $result = array('success'=>true);
    }
    else {
        $message = "Process with the same BBB SKU# is already exist!";
        $result = array('success'=>false, 'message'=>$message);
    }
    

    /*if($count==0){
        $result = array('success'=>true, 'exist'=>false, 'this'=>false);
    }
    elseif($count==1&&$data['process_id']==$tmp[0]){
        $result = array('success'=>true, 'exist'=>true, 'this'=>true);
    }
    else {
        $message = "Process with the same BBB SKU# is already exist!";
        $result = array('success'=>true, 'exist'=>true, 'this'=>false, 'message'=>$message);
    }*/

    return $result;
}


 function getProcessContent($id){
    global $db;
    $content = array();
    $query = "SELECT pfc.`id`, `operation_number`, `operation_id`, o.`number`, `operation_procedure`, `full` FROM bb_process_flow_content pfc
            INNER JOIN bb_operations o ON o.`id` = `operation_id` WHERE `process_id` = ".$id;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $op_number, $id_op, $proc_number, $operation_procedure, $full);
        while ($stmt->fetch()){
            $content[]= array('id_op'=>$id_op, 'op_number'=>$op_number, 'proc_number'=>$proc_number, 'operation_procedure'=>$operation_procedure, 'full'=>($full==1)?1:0);
        }
        $stmt->close();
    }
    return $content;
}

function saveCustomer($name){
    global $db;
    $query = "SELECT COUNT(*) FROM `bb_potential_customers` WHERE `name` = '".$name."'";
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    }
    if($count==0){
        em_insert('bb_potential_customers', array('name'=>$name));
    }
}

function selectOperationData($id, $request_id, $op_number){
    global $db;
    $approved = 0;
    $tool =  array();
    $gage =  array();
    $equipment =  array();
    $workstation =  array();
    
    $query = "SELECT `id`, `operation_procedure`, `descriptionOperation`, `files`, `number` FROM bb_operations WHERE `id` = ".$id."";
        if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $operation_procedure, $descriptionOperation, $files, $number);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id, 'operation_procedure'=>$operation_procedure, 'descriptionOperation'=>$descriptionOperation, 'files'=>$files, 'number'=>$number);
        }
        $stmt->close();
            $query1 = "SELECT ot.`tool_id`, `qty`, tg.`estimated_unit_price`, `life_time`, `name` AS `needs`, `number`, `description`, `pending_design`, `approved`
                    FROM `bb_operation_tool` ot
                    INNER JOIN `bb_tool_gage` tg ON tg.`id`=ot.`tool_id` 
                    WHERE ot.`operation_id` =".$id;
        $rows1 = em_query($query1);
        while ($result1 = $rows1->fetch_array(MYSQL_ASSOC)){
            $tool[] = $result1;
            if($result1['approved'] !=1){
                $approved++;
            }
        }
        if(count($tool)>0&&$request_id!="") {
            $tool=addOperationDetails($tool, 'tool', $id, $request_id, $op_number);
        }

        if(count($tool)>0) $Model[0]['tools'] = json_encode($tool);
        $query2 = "SELECT og.`gage_id`, `qty`, tg.`estimated_unit_price`, `life_time`, `name` AS `needs`, `number`, `description`, `pending_design`, `approved`
                        FROM `bb_operation_gage` og
                        INNER JOIN `bb_tool_gage` tg ON tg.`id`=og.`gage_id` 
                        WHERE og.`operation_id` =".$id;
        $rows2 = em_query($query2);
        while ($result2 = $rows2->fetch_array(MYSQL_ASSOC)){
            $gage[] = $result2;
            if($result2['approved'] !=1){
                $approved++;
            }
        }

        if(count($gage)>0&&$request_id!="") {
            $gage=addOperationDetails($gage, 'gage', $id, $request_id, $op_number);
        }
        if(count($gage)>0) $Model[0]['gages'] =json_encode($gage);

            $query3 = "SELECT oe.`equipment_id`, `qty`, te.`estimated_unit_price`, `life_time`, `name` AS `needs`, `number`, `description`, `pending_design`, `approved`
                    FROM `bb_operation_equipment` oe
                    INNER JOIN `bb_equipment` te ON te.`id`=oe.`equipment_id` 
                    WHERE oe.`operation_id` =".$id;
            $rows3 = em_query($query3);
        while ($result3 = $rows3->fetch_array(MYSQL_ASSOC)){
            $equipment[] = $result3;
            if($result3['approved'] !=1){
                $approved++;
            }
        }
        if(count($equipment)>0&&$request_id!="") {
            $equipment=addOperationDetails($equipment, 'equipment', $id, $request_id, $op_number);
        }
        if(count($equipment)>0) $Model[0]['equipments'] =json_encode($equipment);
        
        $query4 = "SELECT ow.`workstation_id`, `qty`, tw.`estimated_unit_price`, `life_time`, `name` AS `needs`, `number`, `description`, `pending_design`, `approved`
                    FROM `bb_operation_workstation` ow
                    INNER JOIN `bb_workstation` tw ON tw.`id`=ow.`workstation_id`  
                    WHERE ow.`operation_id` =".$id;
        $rows4 = em_query($query4);
        while ($result4 = $rows4->fetch_array(MYSQL_ASSOC)){
            $workstation[] = $result4;
            if($result4['approved'] !=1){
                $approved++;
            }
        }
        if(count($workstation)>0&&$request_id!="") {
            $workstation=addOperationDetails($workstation, 'workstation', $id, $request_id, $op_number);
        }
        if(count($workstation)>0) $Model[0]['workstations'] = json_encode($workstation);
        $Model[0]['approved']=$approved;
        $result_operation = array('success'=>true, 'result'=>$Model);
        }else{ $result_operation = array('success'=>false,'result'=>"");}

    return $result_operation;
}