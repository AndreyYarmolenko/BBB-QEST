<?php
//session_start();
//header('Content-Type: text/html; charset=utf-8');
//header('charset=utf-8');

require_once("../settings.php");
require_once("../logger.php");
require_once("../lang/langs.php");
require_once("function.php");


$id_user = $_SESSION['id'];
$instance = $_SESSION['instance'];


function getDueWhere($within){
    $where = "";
    switch ($within) {
        case 'new':
            $where = " `status` =1 AND `due_date` IS NULL ";
        break;
        case 'new_overdue':
            $where = " `status` =5 AND `due_date` IS NULL ";
        break;
        case 'overdue':
            $where = " `status` =5 AND `due_date` IS NOT NULL ";
        break;
        case 'within_7':
            $where = " `status` <>4 AND `due_date` BETWEEN NOW() AND ADDDATE(NOW(),7) ";
        break;
        case 'within_14':
            $where = " `status` <>4 AND `due_date` BETWEEN ADDDATE(NOW(), 7) AND ADDDATE(NOW(), 15) ";
        break;
        case 'within_21':
            $where = " `status` <>4 AND `due_date` BETWEEN ADDDATE(NOW(), 14) AND ADDDATE(NOW(), 22) ";
        break;
        case 'within_30':
            $where = " `status` <>4 AND `due_date` BETWEEN ADDDATE(NOW(), 21) AND ADDDATE(NOW(), 31) ";
        break;
    }
    return $where;
}

if (isset($_REQUEST['responsible'])) {

    $name_user = $_REQUEST['responsible'];
    $idelement = $_REQUEST['idelement'];

    $arrUsers = array();
    $arrUsersName = array();

    array_push($arrUsers, $iduser);
    array_push($arrUsersName, $name_user);

    getUsersId($arrUsers, $arrUsersName);

    $str_id_users = implode(",", $arrUsers);

    $html = "<ul>";
//$query = "SELECT `id`, `name` FROM `bb_users` WHERE `id` IN (".$str_id_users.");";
    $query = "SELECT `id`, `name` FROM `bb_users` WHERE `id` IN (" . $str_id_users . ");";

    if ($stmt = $db->prepare($query)) {
        if ($stmt->execute()) {
            $stmt->bind_result($id, $name);
            $i = 0;
            $json = array();
            while ($stmt->fetch()) {
                $json[$i++] = $name;
                $html .= '<li title="' . $id . '" onclick="setValue(\'' . $idelement . '\',\'' . $name . '\')">' . $name . '</li>';
            }
            $stmt->close();
            $db->close();
            $html .= '</ul>';

            //echo $html;
            echo $debug = json_encode($json,ARRAY_FILTER_USE_BOTH);
            file_put_contents("debug-eni.log", $debug.PHP_EOL, FILE_APPEND);
            exit;
        }
    }

}

if (isset($_REQUEST['getTasksById'])) {
   $id = $_REQUEST['getTasksById'];
    $html = '<tr><td><h3>TYPE OF TASK</h3></td><td><h3>STATUS</h3></td><td><h3>START DATE</h3></td><td><h3>END DATE</h3></td></tr>';
   $query = "SELECT tt.tasks_type, ts.name, ot.start_date, ot.finish_date FROM bb_tasks_type tt 
            INNER JOIN bb_order_tasks ot ON tt.id = ot.task_type 
            INNER JOIN bb_task_status ts ON ot.status= ts.task_status_id
            WHERE assigned_by = $id";
    if ($stmt = $db->prepare($query)) {
        if ($stmt->execute()) {
            $stmt->bind_result($tasks, $status, $start, $finish);
            while ($stmt->fetch()) {
                $html .= '<tr><td>'.$tasks.'</td><td>'.$status.'</td><td>'.$start.'</td><td>'.$finish.'</td></tr>';
            }
            $html = '<table class="ner_info">'.$html.'</table>';
            $stmt->close();
            $db->close();
        }
    }
   
    echo $html;
}

$statusArray = array("new_task" =>1, "in_progress"=>2, "in_queue"=>6, "completed"=>4, "overdue"=>5);
   


if(isset($_REQUEST['getTasks']))  {
    $query = "SELECT ts.`name`, COUNT(*) AS num, ts.task_status_id FROM `bb_order_tasks` 
                    INNER JOIN bb_task_status ts ON task_status_id = status
                    GROUP BY status";
        if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($status, $num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$status,'g1'=>$num, 'id_status'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getDepTasks']))  {
    $status = $_REQUEST['status'];
    // $status = $statusArray[$status];
    $_SESSION['status'] = $status;
    $query = "SELECT d.`name`, COUNT(*) AS num, d.id FROM `bb_order_tasks` ot
                    INNER JOIN bb_users u ON ot.assignee = u.id
                    INNER JOIN bb_departments d ON u.department_id = d.id
                    WHERE `status` = $status
                    GROUP BY d.`id`";
    //echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($name, $num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$name,'g1'=>$num, 'id_dep'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getTasksByDep']))  {
    $dep = $_REQUEST['dep'];
    // $dep=$departArray[$dep];
    $_SESSION['dep'] = $dep;
    $status = $_SESSION['status'];
    //echo $dep."   ".$status;
    $query = "SELECT tt.tasks_type, COUNT(*) AS num, tt.id FROM `bb_order_tasks` 
                    INNER JOIN bb_tasks_type tt ON tt.id = task_type
                    INNER JOIN bb_users u ON assignee = u.id
                    WHERE u.department_id = $dep AND `status` = $status
                    GROUP BY tasks_type ORDER BY tt.id";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($status, $num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$status,'g1'=>$num, 'id_type'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}



if(isset($_REQUEST['getUser']))  {
    $type = $_REQUEST['type'];
    //$type= $typeArray[$type];
    $dep=$_SESSION['dep'];
    $status =$_SESSION['status'];
    //echo $type." : ".$dep;
    $pNum = "";
    $query = "SELECT u.name , us.name, start_date FROM bb_order_tasks ot
                        INNER JOIN bb_users u ON assignee = u.id
                        INNER JOIN bb_users us ON assigned_by = us.id
                        INNER JOIN bb_departments d ON u.department_id = d.id
                        WHERE `task_type` = $type AND d.id = $dep AND `status` = $status";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($assignee, $assigned_by, $start);
        while ($stmt->fetch()){
            $Model[]= array('assignee'=>$assignee,'manager'=>$assigned_by, 'startDate'=>$start);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getDepByStatus']))  {
    $status = $_REQUEST['status'];
    $month = $_REQUEST['month'];

    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';

    if(strlen($month)==1){
        $month = "0".$month;
    }
    $year = "20".$_REQUEST['year'];
    $status = $statusArray[$status];
	 if($status == 4) $and = " AND MONTH(`completion_date`) IN (NULL, MONTH(NOW()))";
        else $and= "";
    $_SESSION['status'] = $status;
    $_SESSION['month'] = $month;
    $_SESSION['year'] = $year;
	$now = date('Y-m');
	if($year."-".$month == $now){
		$query = "SELECT COUNT(*) AS num, d.`id` FROM bb_order_tasks ot
                INNER JOIN bb_tasks_type tt ON ot.task_type = tt.id
                INNER JOIN bb_departments d ON tt.department_id = d.id
                WHERE `status` = ".$status." ".$and." ".$filterUser."
                GROUP BY d.`id`";
	}else{
		$query = "SELECT COUNT(*) AS num, d.`id` FROM bb_snapshots sn
                INNER JOIN bb_order_tasks ot ON ot.`task_id` = sn.`task_id`
                INNER JOIN bb_tasks_type tt ON sn.task_type = tt.id
                INNER JOIN bb_departments d ON tt.department_id = d.id
                WHERE `task_status` = ".$status." AND MONTH(`snapshot_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`))
                AND YEAR(`snapshot_date`) = ".$year." ".$filterUser."
                GROUP BY d.`id`";
	}
	   // echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($num, $id);
        while ($stmt->fetch()){
            $Model[]= array('id_dep'=>$id, 'name'=>$departments[$id],'num'=>$num);
        }
        $stmt->close();
        //print_r($Model);
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;

}
if(isset($_REQUEST['getProgressTasksByDep']))  {
    $status = $_SESSION['status'];
	 if($status == 4) $and = " AND MONTH(`completion_date`) IN (NULL, MONTH(NOW()))";
        else $and= "";
    $month = $_SESSION['month'];
    $year = $_SESSION['year'];
    $dep = $_REQUEST['dep'];
    $_SESSION['dep'] = $dep;
    $now = date('Y-m');

   if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';


	if($year."-".$month == $now){
		$query = "SELECT COUNT(*) AS num, tt.id FROM bb_order_tasks ot
                INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                WHERE `status` = ".$status." AND d.id =  ".$dep." ".$and." ".$filterUser."
                GROUP BY ot.task_type ORDER BY tt.id";
	}else{
		$query = "SELECT COUNT(*) AS num, tt.id FROM bb_snapshots sn
                INNER JOIN bb_order_tasks ot ON ot.`task_id` = sn.`task_id`
                INNER JOIN bb_tasks_type tt ON tt.id = sn.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                WHERE `task_status` = ".$status." AND MONTH(`snapshot_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year." AND d.id =  ".$dep." ".$filterUser."
                GROUP BY sn.task_type ORDER BY tt.id";
	}
    //echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$tasks[$id],'num'=>$num, 'id_type'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getProgressUser']))  {
    $type = $_REQUEST['type'];
    $dep= $_SESSION['dep'];
    $status =$_SESSION['status'];
	 if($status == 4) $and = " AND MONTH(`completion_date`) IN (NULL, MONTH(NOW()))";
        else $and= "";
    $month = $_SESSION['month'];
    $year = $_SESSION['year'];
    $_SESSION['type'] =$type;
    $pNum = "";
    $now = date('Y-m');

    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';

	if($year."-".$month == $now){
		$query = "SELECT IFNULL(u.name, 'NOT ASSIGNEE'), COUNT(*), u.id FROM bb_order_tasks ot
                INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                LEFT JOIN bb_users u ON ot.assignee = u.id
                WHERE `status` = ".$status." ".$and."
                AND d.id = ".$dep." AND ot.task_type = ".$type.$filterUser."
                GROUP BY u.id";
		//echo $query;
	}else{
		$query = "SELECT IFNULL(u.name, 'NOT ASSIGNEE'), COUNT(*), u.id FROM bb_snapshots sn
                INNER JOIN bb_tasks_type tt ON tt.id = sn.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                INNER JOIN bb_order_tasks ot ON ot.task_id = sn.task_id
                INNER JOIN bb_users u ON ot.assignee = u.id
                WHERE `task_status` = ".$status." AND MONTH(`snapshot_date`) =  ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year."
                AND d.id = ".$dep." AND sn.task_type = ".$type.$filterUser."
                GROUP BY u.id";
	}
	//echo $query;
    //writeToLogFile($query,'charts');
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($name, $num, $id);
        while ($stmt->fetch()){
            $Model[] = array('name'=>$name, 'num'=>$num, 'id_user'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getProgressTasksofUser']))  {
    $start = (isset($_REQUEST['start'])) ? $_REQUEST['start']  :  0;
    $limit = (isset($_REQUEST['limit'])) ? $_REQUEST['limit']  : 25;

    $id_user = ($_REQUEST['id_user'])?$_REQUEST['id_user']:0;
    $dep= $_SESSION['dep'];
    $status =$_SESSION['status'];
	if($status == 4) $and = " AND MONTH(`completion_date`) IN (NULL, MONTH(NOW()))";
        else $and= "";
    $month = $_SESSION['month'];
    $year = $_SESSION['year'];
    $type = $_SESSION['type'];

    $pNum = "";
    $now = date('Y-m');
	if($year."-".$month == $now){
		$query = "SELECT ot.task_id, bs.`name` AS bbb_sku, ot.order_id, tt.tasks_type, ot.task_type AS task_type_id,  IFNULL(u.name, 'NOT ASSIGNEE') AS assignee, IFNULL(u.id, 0) AS assignee_id, u.name, IFNULL(us.name, 'NOT ASSIGNEE') AS assigned_by, IFNULL(us.id, 0) AS assigned_by_id, us.name, DATE(requested_date), DATE(assignment_date), DATE(due_date), DATE(completion_date), DATE(new_due_date), assignee, ts.name, ot.status as id_status, assigned_by
                FROM bb_order_tasks ot
                LEFT JOIN bb_users u ON assignee = u.id
                LEFT JOIN bb_users us ON assigned_by = us.id
                INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
                LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
                LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
                WHERE tt.department_id = ".$dep." AND task_type = ".$type." AND `status` = ".$status." ".$and."
                 AND assignee= ".$id_user." 
                ORDER BY tt.id LIMIT ".$start.", ".$limit;

        $query_count = "SELECT COUNT(*)
                FROM bb_order_tasks ot
                LEFT JOIN bb_users u ON assignee = u.id
                LEFT JOIN bb_users us ON assigned_by = us.id
                INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
                INNER JOIN bb_departments d ON tt.department_id = d.id
                INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
                LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
                LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
                WHERE tt.department_id = ".$dep." AND task_type = ".$type." AND `status` = ".$status." ".$and." 
                 AND assignee= ".$id_user;
	}else{
		$query = "SELECT ot.task_id, bs.`name` AS bbb_sku, ot.order_id, tt.tasks_type,  ot.task_type AS task_type_id,  IFNULL(u.name, 'NOT ASSIGNEE')AS assignee, IFNULL(u.id, 0) AS assignee_id, u.name, IFNULL(us.name, 'NOT ASSIGNEE') AS assigned_by, IFNULL(us.id, 0) AS assigned_by_id, us.name, 
        DATE(requested_date), DATE(assignment_date), DATE(due_date), DATE(completion_date), DATE(new_due_date), assignee, ts.name, ot.status AS id_status, 
        assigned_by
        FROM bb_order_tasks ot
        INNER JOIN bb_snapshots sn ON ot.task_id = sn.task_id
        INNER JOIN bb_tasks_type tt ON tt.id = sn.task_type
        INNER JOIN bb_departments d ON tt.department_id = d.id
        INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
        LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
        LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
        LEFT JOIN bb_users u ON assignee = u.id
        LEFT JOIN bb_users us ON assigned_by = us.id
        WHERE `task_status` =".$status." AND MONTH(`snapshot_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year."
        AND d.id = ".$dep." AND sn.task_type = ".$type." AND assignee= ".$id_user." LIMIT ".$start.", ".$limit;

        $query_count = "SELECT COUNT(*)
        FROM bb_order_tasks ot
        INNER JOIN bb_snapshots sn ON ot.task_id = sn.task_id
        INNER JOIN bb_tasks_type tt ON tt.id = sn.task_type
        INNER JOIN bb_departments d ON tt.department_id = d.id
        INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
        LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
        LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
        LEFT JOIN bb_users u ON assignee = u.id
        LEFT JOIN bb_users us ON assigned_by = us.id
        WHERE `task_status` =".$status." AND MONTH(`snapshot_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year." 
        AND d.id = ".$dep." AND sn.task_type = ".$type." AND assignee= ".$id_user;
	}
    $total = 0;
    if($stmt1 = $db->prepare($query_count)){
        if($stmt1->execute()){
            $stmt1->bind_result($total);
            $stmt1->fetch(); 
            $stmt1->close();
        }}

    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($task_id, $bbb_sku, $request_id, $task_type, $id_task_type, $assignee, $assignee_id, $assignee_last_name, $assigned_by, $assigned_by_id, $assigned_by_last_name, $requested_date, $assignment_date, $due_date, $completion_date, $new_due_date, $id_user, $status_name, $id_status, $id_user2);
        while ($stmt->fetch()){
            $Model[] = array(
                'id'=>$task_id,
                'bbb_sku'=>$bbb_sku,
                'task_type'=>$task_type,
                'id_task_type'=>$id_task_type,
                'request_id'=>$request_id,
                'responsible'=>$assigned_by,
                'responsible_id'=>$assigned_by_id,
                'assigned_to'=>$assignee,
                'assigned_to_id'=>$assignee_id,
                'request_date'=>$requested_date,
                'assignment_date'=>$assignment_date,
                'due_date'=>$due_date,
                'complete_date'=>$completion_date,
                'new_due_date'=>$new_due_date,
                'status'=>$status_name,
                'id_status'=>$id_status,
                'id_user'=>$id_user,
                'id_user2'=>$id_user2
            );
        }
        $stmt->close();
        //echo'{rows:'.json_encode($Model).'}';
        echo '{"total":"'.$total.'","rows":'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if (isset($_REQUEST['getFcrFullData'])) {
    if($_REQUEST['status'] == "approved") $reject = 1;
    if($_REQUEST['status'] == "rejected") $reject = 2;

    $start = (isset($_REQUEST['start'])) ? $_REQUEST['start']  :  0;
    $limit = (isset($_REQUEST['limit'])) ? $_REQUEST['limit']  : 25;
    $Model = array();

    $year = "20".$_REQUEST['year'];
    $month = $_REQUEST['month'];
    if(strlen($month)==1){
        $month = "0".$month;
    }
    $pNum = "";
    $now = date('Y-m');

    if(isset($_REQUEST['user'])&&$_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';

    if($year."-".$month == $now){
        $query = "SELECT ot.task_id, bs.name AS bbb_sku, ot.order_id, tt.tasks_type, ot.task_type AS task_type_id, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, requested_date, assignment_date, due_date, completion_date, new_due_date, ot.assigned_by,  ot.assignee
            FROM bb_order_tasks ot
            LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
            LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
            LEFT JOIN bb_users u ON ot.assignee = u.id
            LEFT JOIN bb_users us ON ot.assigned_by = us.id
            LEFT JOIN bb_tasks_type tt ON tt.id = ot.task_type
            LEFT JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            INNER JOIN bb_bbb_sku bs ON ts.`bbb_sku_id` = bs.`id`
            WHERE ot.rejected = ".$reject." AND `status` = 4
            AND ((ot.`task_type` = 36 AND pr.`reopen` = 0)OR(ot.`task_type` = 40 AND pfgr.`reopen` = 0))
            AND MONTH(`completion_date`) = ".$month.$filterUser." AND YEAR(`completion_date`)=".$year." 
            ORDER BY tt.id  LIMIT ".$start.", ".$limit;

        $query_count = "SELECT COUNT(*)
            FROM bb_order_tasks ot
            LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
            LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
            LEFT JOIN bb_users u ON ot.assignee = u.id
            LEFT JOIN bb_users us ON ot.assigned_by = us.id
            LEFT JOIN bb_tasks_type tt ON tt.id = ot.task_type
            LEFT JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            INNER JOIN bb_bbb_sku bs ON ts.`bbb_sku_id` = bs.`id`
            WHERE ot.rejected = ".$reject." AND `status` = 4
            AND ((ot.`task_type` = 36 AND pr.`reopen` = 0)OR(ot.`task_type` = 40 AND pfgr.`reopen` = 0))
            AND MONTH(`completion_date`) = ".$month.$filterUser." AND YEAR(`completion_date`)=".$year;

    }else{
        $query = "SELECT ot.task_id, bs.name AS bbb_sku, ot.order_id, tt.tasks_type, ot.task_type AS task_type_id, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, requested_date, assignment_date, due_date, completion_date, new_due_date, ot.assigned_by,  ot.assignee
            FROM `bb_snapshots` s
            INNER JOIN bb_order_tasks ot ON ot.`task_id` = s.`task_id`
            LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
            LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
            LEFT JOIN bb_users u ON ot.assignee = u.id
            LEFT JOIN bb_users us ON ot.assigned_by = us.id
            LEFT JOIN bb_tasks_type tt ON tt.id = ot.task_type
            LEFT JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            INNER JOIN bb_bbb_sku bs ON ts.`bbb_sku_id` = bs.`id`
            WHERE ot.rejected = ".$reject." AND `status` = 4 AND MONTH(`completion_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year.$filterUser."
            AND ((ot.`task_type` = 36 AND pr.`reopen` = 0)OR(ot.`task_type` = 40 AND pfgr.`reopen` = 0))
            ORDER BY tt.id  LIMIT ".$start.", ".$limit;

            $query_count = "SELECT COUNT(*)
            FROM `bb_snapshots` s
            INNER JOIN bb_order_tasks ot ON ot.`task_id` = s.`task_id`
            LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
            LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
            LEFT JOIN bb_users u ON ot.assignee = u.id
            LEFT JOIN bb_users us ON ot.assigned_by = us.id
            LEFT JOIN bb_tasks_type tt ON tt.id = ot.task_type
            LEFT JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            INNER JOIN bb_bbb_sku bs ON ts.`bbb_sku_id` = bs.`id`
            WHERE ot.rejected = ".$reject." AND `status` = 4 AND MONTH(`completion_date`) = ".$month." AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND YEAR(`snapshot_date`) = ".$year.$filterUser."
            AND ((ot.`task_type` = 36 AND pr.`reopen` = 0)OR(ot.`task_type` = 40 AND pfgr.`reopen` = 0))";
    }

    $total = 0;
    if($stmt1 = $db->prepare($query_count)){
        if($stmt1->execute()){
            $stmt1->bind_result($total);
            $stmt1->fetch(); 
            $stmt1->close();
        }}

    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($task_id, $bbb_sku, $request_id, $task_type, $id_task_type, $assignee, $assignee_id, $assigned_by, $assigned_by_id, $requested_date, $assignment_date, $due_date, $completion_date, $new_due_date, $id_user, $id_user2);
        while ($stmt->fetch()) {
            $Model[] = array(
                'id' => $task_id,
                'bbb_sku' => $bbb_sku,
                'task_type' => $task_type,
                'id_task_type' => $id_task_type,
                'request_id' => $request_id,
                'responsible' => $assigned_by,
                'responsible_id' => $assigned_by_id,
                'assigned_to' => $assignee,
                'assigned_to_id' => $assignee_id,
                'request_date' => $requested_date,
                'assignment_date' => $assignment_date,
                'due_date' => $due_date,
                'complete_date' => $completion_date,
                'new_due_date' => $new_due_date,
                'id_user' => $id_user,
                'id_user2'=>$id_user2);
        }
        $stmt->close();
       // echo '{rows:' . json_encode($Model) . '}';
        echo '{"total":"'.$total.'","rows":'.json_encode($Model).'}';
    } else {
        echo '{"success":false,"message":""}';
    }
    $db->close();
    exit;
}

if(isset($_REQUEST['getRequestsProgressTableData'])){
    $start = (isset($_REQUEST['start'])) ? $_REQUEST['start']  :  0;
    $limit = (isset($_REQUEST['limit'])) ? $_REQUEST['limit']  : 25;

    $status = $_REQUEST['status'];
    $year = "20".$_REQUEST['year'];
    $month = $_REQUEST['month'];
    $where = "";
    if(strlen($month)==1){
        $month = "0".$month;
    }
    $Model = array();
    $now = date('m');

    switch($status){
        case 'new_request':
            $where = " MONTH(`creation_date` ) ='".$month."' AND `task_type_id` =1";
        break;
        case 'in_progress_request':
        if($now==$month){
            $where = " `request_status` NOT IN (3,4) AND `task_type_id` =1 ";
            }
            else {
            $where = " DATE(`creation_date`) < LAST_DAY('".$year."-".$month."-15') AND DATE(`completion_date`) > LAST_DAY('".$year."-".$month."-15')
                AND `task_type_id` =1";
            }
        break;
        case 'completed_request':
            $where = " MONTH(`completion_date` ) ='".$month."' AND `request_status` = 3 AND `task_type_id` =1";
        break;
        case 'canceled_request':
            $where = " MONTH(`completion_date` ) ='".$month."' AND `request_status` = 4 AND `task_type_id` =1";
        break;
    }

    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `created_by` = ".$user." ";
        } else $filterUser = '';

   $query = "SELECT `order_id`, `creation_date`, `completion_date`, u.`name` AS `created_by`, u.`id` AS `created_by_id`, us.`name` AS  `completed_by`, us.`id` AS `completed_by_id`, `bbb_sku_id`, bs.`name` AS `bbb_sku`, pt.`name` AS `ProductType`, pl.`name` AS `ProductLine`, `family_name` AS `ProductFamily` 
        FROM `bb_order` o
        LEFT JOIN bb_users u ON o.created_by = u.id
        LEFT JOIN bb_users us ON o.completed_by = us.id
        LEFT JOIN `bb_tasks_sku` ts ON ts.`RequestID` = order_id
        LEFT JOIN `bb_bbb_sku` bs ON bs.`id` = ts.`bbb_sku_id`
        LEFT JOIN `bb_product_type` pt ON pt.`id` = bs.`ProductType`
        LEFT JOIN `bb_product_line` pl ON pl.`id` = bs.`ProductLine`
        LEFT JOIN `bb_family_type` ft ON ft.`id` = bs.`ProductFamily`
        WHERE ".$where.$filterUser." LIMIT ".$start.",".$limit;
        
        if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($order_id, $creation_date, $completion_date, $created_by, $created_by_id, $completed_by, $completed_by_id, $bbb_sku_id, $bbb_sku, $ProductType, $ProductLine, $ProductFamily);
        while ($stmt->fetch()) {
            $Model[] = array(
                'order_id' => $order_id,
                'creation_date' => $creation_date,
                'completion_date' => $completion_date,
                'created_by' => $created_by,
                'created_by_id' => $created_by_id,
                'completed_by' => $completed_by,
                'completed_by_id' => $completed_by_id,
                'bbb_sku_id' => $bbb_sku_id,
                'bbb_sku' => $bbb_sku,
                'product_type' => $ProductType,
                'product_line' => $ProductLine,
                'product_family' => $ProductFamily
                );
        }
        $stmt->close();

       $query_count = "SELECT COUNT(*)
        FROM `bb_order` o
        LEFT JOIN bb_users u ON o.created_by = u.id
        LEFT JOIN bb_users us ON o.completed_by = us.id
        LEFT JOIN `bb_tasks_sku` ts ON ts.`RequestID` = order_id
        LEFT JOIN `bb_bbb_sku` bs ON bs.`id` = ts.`bbb_sku_id`
        LEFT JOIN `bb_product_type` pt ON pt.`id` = bs.`ProductType`
        LEFT JOIN `bb_product_line` pl ON pl.`id` = bs.`ProductLine`
        LEFT JOIN `bb_family_type` ft ON ft.`id` = bs.`ProductFamily`
        WHERE ".$where.$filterUser;

        $total = 0;
        if($stmt1 = $db->prepare($query_count)){
            if($stmt1->execute()){
                $stmt1->bind_result($total);
                $stmt1->fetch(); 
                $stmt1->close();
            }}

        echo '{"total":"'.$total.'","rows":'.json_encode($Model).'}';
    } else {
        echo '{"success":false,"message":""}';
    }
    $db->close();
    exit;

}

if(isset($_REQUEST['getRequestsContentTableData'])){
    $request_id = $_REQUEST['request_id'];

    $start = (isset($_REQUEST['start'])) ? $_REQUEST['start']  :  0;
    $limit = (isset($_REQUEST['limit'])) ? $_REQUEST['limit']  : 25;

    $query = "SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee, u.`id` AS assignee_id, us.name AS assigned_by, us.`id` AS `assigned_by_id`, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS task_status
            FROM bb_order_tasks ot
            LEFT JOIN bb_users u ON assignee = u.id
            LEFT JOIN bb_users us ON assigned_by = us.id
            LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
            LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`                                    
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            WHERE ot.order_id = ".$request_id." ORDER BY `requested_date` LIMIT ".$start.",".$limit;

    $query_count = "SELECT COUNT(*)
            FROM bb_order_tasks ot
            LEFT JOIN bb_users u ON assignee = u.id
            LEFT JOIN bb_users us ON assigned_by = us.id
            LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
            LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`                                    
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            WHERE ot.order_id = ".$request_id;

    $total = 0;
    if($stmt1 = $db->prepare($query_count)){
        if($stmt1->execute()){
            $stmt1->bind_result($total);
            $stmt1->fetch(); 
            $stmt1->close();
        }}

        if(!$stmt = $db->query($query)){
            echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
        }else{
            for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);) {
                $result[] = $tmp;
            }
            $stmt->close();
           // echo '{rows:' . json_encode($result) . '}';
            echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
        }
        
        $db->close();
        exit;
    }

    if(isset($_REQUEST['getDueDepByStatus']))  {
    $within = $_REQUEST['within'];
    $_SESSION['within'] = $within;
    $Model = array();
    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` = ".$user." ";
        } else $filterUser = '';

    $where = getDueWhere($within);

    $query = "SELECT d.`name`, COUNT(*) AS num, d.id
                    FROM `bb_order_tasks` ot
                    INNER JOIN bb_users u ON ot.assignee = u.id
                    INNER JOIN `bb_tasks_type` tt ON tt.`id` = `task_type`
                    INNER JOIN bb_departments d ON tt.department_id = d.id
                    WHERE ".$where.$filterUser."
                    GROUP BY d.`id`";
    //echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($name, $num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$name,'num'=>$num, 'id_dep'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getProgressDueTasksByDep'])){
    $within = $_SESSION['within'];
    $dep = $_REQUEST['dep'];
    $_SESSION['due_dep'] = $dep;
    $Model = array();

   if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';
    
    $where = getDueWhere($within);

    if($where!=""){
        $where = " AND ".$where." ";
    }

    $query = "SELECT COUNT(*) AS num, tt.id FROM bb_order_tasks ot
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            INNER JOIN bb_departments d ON tt.department_id = d.id
            WHERE d.id =  ".$dep." ".$filterUser." ".$where."
            GROUP BY ot.task_type ORDER BY tt.id";
   // echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($num, $id);
        while ($stmt->fetch()){
            $Model[]= array('name'=>$tasks[$id],'num'=>$num, 'id_type'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getProgressDueUser'])){
    $dep = $_SESSION['due_dep'];
    $type = $_REQUEST['type'];
    $within = $_SESSION['within'];
    $_SESSION['due_type'] = $type;

    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
            $user = $_REQUEST['user'];
            $filterUser = " AND `assignee` =".$user." ";
        } else $filterUser = '';
    
    $where = getDueWhere($within);

    if($where!=""){
        $where = " AND ".$where." ";
    }

    $query = "SELECT IFNULL(u.name, 'NOT ASSIGNEE'), COUNT(*), u.id FROM bb_order_tasks ot
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            INNER JOIN bb_departments d ON tt.department_id = d.id
            LEFT JOIN bb_users u ON ot.assignee = u.id
            WHERE d.id = ".$dep." AND ot.task_type = ".$type.$filterUser.$where."
            GROUP BY u.id";
    //echo $query;
    

    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($name, $num, $id);
        while ($stmt->fetch()){
            $Model[] = array('name'=>$name, 'num'=>$num, 'id_user'=>$id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getDueTasksofUser'])){
    $id_user = ($_REQUEST['id_user'])?$_REQUEST['id_user']:0;

    $start = (isset($_REQUEST['start'])) ? $_REQUEST['start']  :  0;
    $limit = (isset($_REQUEST['limit'])) ? $_REQUEST['limit']  : 25;

    $dep= $_SESSION['due_dep'];
    $within = $_SESSION['within'];
    $type = $_SESSION['due_type'];

    $where = getDueWhere($within);

    if($where!=""){
        $where = " AND ".$where." ";
    }

    $query = "SELECT ot.task_id, bs.`name` AS bbb_sku, ot.order_id, tt.tasks_type, ot.task_type AS task_type_id,  IFNULL(u.name, 'NOT ASSIGNEE') AS assignee, IFNULL(u.id, 0) AS assignee_id, u.name, IFNULL(us.name, 'NOT ASSIGNEE') AS assigned_by, IFNULL(us.id, 0) AS assigned_by_id, us.name, DATE(requested_date), DATE(assignment_date), DATE(due_date), DATE(completion_date), DATE(new_due_date), assignee, ts.name, ot.status as id_status, assigned_by
            FROM bb_order_tasks ot
            LEFT JOIN bb_users u ON assignee = u.id
            LEFT JOIN bb_users us ON assigned_by = us.id
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            INNER JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
            LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
            LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
            WHERE tt.department_id = ".$dep." AND `task_type` = ".$type." AND `assignee`= ".$id_user.$where."
            ORDER BY tt.id LIMIT ".$start.",".$limit;
            //echo $query; exit;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($task_id, $bbb_sku, $request_id, $task_type, $id_task_type, $assignee, $assignee_id, $assignee_last_name, $assigned_by, $assigned_by_id, $assigned_by_last_name, $requested_date, $assignment_date, $due_date, $completion_date, $new_due_date, $id_user, $status_name, $id_status, $id_user2);
        while ($stmt->fetch()){
            $Model[] = array(
                'id'=>$task_id,
                'bbb_sku'=>$bbb_sku,
                'task_type'=>$task_type,
                'id_task_type'=>$id_task_type,
                'request_id'=>$request_id,
                'responsible'=>$assigned_by,
                'responsible_id'=>$assigned_by_id,
                'assigned_to'=>$assignee,
                'assigned_to_id'=>$assignee_id,
                'request_date'=>$requested_date,
                'assignment_date'=>$assignment_date,
                'due_date'=>$due_date,
                'complete_date'=>$completion_date,
                'new_due_date'=>$new_due_date,
                'status'=>$status_name,
                'id_status'=>$id_status,
                'id_user'=>$id_user,
                'id_user2'=>$id_user2
            );
        }
        $stmt->close();

         $query_count = "SELECT COUNT(*)
            FROM bb_order_tasks ot
            LEFT JOIN bb_users u ON assignee = u.id
            LEFT JOIN bb_users us ON assigned_by = us.id
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            INNER JOIN bb_departments d ON tt.department_id = d.id
            INNER JOIN  bb_task_status ts  ON  ot.status = ts.task_status_id
            LEFT JOIN bb_tasks_sku tsku ON tsku.`RequestID` = ot.`order_id`
            LEFT JOIN bb_bbb_sku bs ON bs.`id` = tsku.`bbb_sku_id`
            WHERE tt.department_id = ".$dep." AND `task_type` = ".$type." AND `assignee`= ".$id_user.$where;

        $total = 0;
        if($stmt1 = $db->prepare($query_count)){
            if($stmt1->execute()){
                $stmt1->bind_result($total);
                $stmt1->fetch(); 
                $stmt1->close();
            }}

        //echo'{rows:'.json_encode($Model).'}';
        echo '{"total":"'.$total.'","rows":'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}
?>