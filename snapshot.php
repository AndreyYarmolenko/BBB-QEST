<?php
include_once "settings.php";
include_once "scripts/saveform_func.php";
	set_time_limit(240);

	if(isset($_REQUEST['snapshot_date'])) $snapshot_date = date('Y-m-d H:i:s', $_REQUEST['snapshot_date']);
		else $snapshot_date = date('Y-m-d H:i:s');

	$overdue = array();

	$count_err_read = 0;
	$count_err_insert = 0;
	$count_insert = 0;
	$count_err_change_status = 0;
	$count_change_status = 0;

	$query = "SELECT `order_id`, `status`, `task_type`, `task_id`, `due_date`, `new_due_date`, `requested_date` FROM bb_order_tasks WHERE `status` NOT IN (4) OR (`status` = 4 AND MONTH(`completion_date`) = MONTH(NOW()))";
	$i=0;
	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($RequestID, $status, $task_type, $task_id, $due_date, $new_due_date, $requested_date);
        while ($stmt->fetch()){
        	if(($due_date)&&((($snapshot_date > $due_date) && $status !=4 && !$new_due_date) || (($snapshot_date > $new_due_date) && $status !=4 && $new_due_date))) {
        		$status = 5;
				$overdue[$i] = $task_id;
				$i++;
        		}
        		elseif(!$due_date&&((getMKTime($snapshot_date)-getMKTime($requested_date))>432000)){
        			$status = 5;
					$overdue[$i] = $task_id;
					$i++;
        		}
			$Model[]= array('RequestID'=>$RequestID,'task_status'=>$status, 'task_type'=>$task_type, 'snapshot_date' =>$snapshot_date, 'task_id'=>$task_id);
		}
		$stmt->close();
		}else{
			$count_err_read++;
			writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'snapshot_error_read');
			//echo '{"success":false,"message":""}'; 
		}
	$values = "";
	for($i=0; $i<count($Model); $i++) {
		foreach ($Model[$i] as $key => $value) {
			$values .= "`".$key."` = '".$value."',";
		}
		$values = substr($values, 0, -1);
		$query = "INSERT INTO bb_snapshots SET ".$values;
		if(!$result = $db->query($query)){
			$count_err_insert++;
			writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'snapshot_error_write');
            //echo "<div>Ошибка записи снепшотов".$query."</div>";
		}
		else{
			$count_insert++;
		}
		$values = "";
	}
	for($i=0; $i< count($overdue); $i++){
			$query = "UPDATE bb_order_tasks SET `status` = 5 WHERE `task_id` = ".$overdue[$i];
        		if(!$result = $db->query($query)){
        			$count_err_change_status++;
        			writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY: '.PHP_EOL.$query.PHP_EOL, 'snapshot_error_status_change');
        		}
        		else{
					$count_change_status ++;
        		}
				//echo "<div> Ошибка обновления заданий".$query."</div>";
		}
		$total_err = $count_err_read+$count_err_insert+$count_err_change_status;
		echo "OPERATION COMPLETED.<br>PROCESSED RECORDS: ".$count_insert."<br>UPDATE STATUSES: ".$count_change_status."<br>TOTAL ERRORS: ".$total_err;
	$db->close();
	exit;
?>