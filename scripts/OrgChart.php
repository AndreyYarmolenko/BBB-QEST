<?php
    //session_start();
	//error_reporting(0);
    header("Content-Type: text/html; charset=utf-8");
    
	require_once("../settings.php");
	require_once("../logger.php");
	require_once("../lang/langs.php");
	
	$instance = $_SESSION['instance'];
	$id_user = $_SESSION['id'];

// --- 13.09.2016 --- functions full chart --->
	function getBoss(){
		global $db;
		$id = null;
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`,`active` FROM `bb_users` WHERE `boss_id` IS NULL;";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($id,$name,$last_name,$title,$photo,$active);
		while($stmt->fetch()){}
		$stmt->close();
		}
		}
		if($photo || $photo!=""){
			$src = $photo;
		}else{
			$src = "img/noperson.jpg";
		}
		
		if($id){
			//return $id;
			return array(array('v' => (string)$id, 'f' => $name.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title.'</div><img src='.$src.' width="50" height="50" />', 'a' => (string)$active), '', '');
		}else{
			return false;
		}
	}
	
	
	function getUsersByBossId($bossidArray){
		global $db;
		global $tempArray;
		$tempBossidArray = array();
		
		
		foreach($bossidArray as $key=>$value){
			
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`, `active` FROM `bb_users` WHERE `boss_id` = ".$value." ORDER BY `id` ASC;";
		if ($stmt = $db->prepare($query)) {
		if ($stmt->execute()) {
			$stmt->bind_result($id,$name,$last_name,$title,$photo,$active);
			$stmt->store_result();
			if($stmt->num_rows()>0){
			while($stmt->fetch()){
				//echo '-- id -- '.$id.'<br/>';
				$tempBossidArray[] = $id;
				
				if($photo || $photo!=""){
					$src = $photo;
				}else{
					$src = "img/noperson.jpg";
				}
				$tempArray[] = array(array('v' => (string)$id, 'f' => $name.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title.'</div><img src='.$src.' width="50" height="50" />', 'a' => (string)$active), (string)$value, '');
				
				//getUsersAllByBossId($bossid);
			}
			}
			$stmt->close();
		}
		}
			
		}
		
		if(count($tempBossidArray)>0){
		//print_r($tempBossidArray);
		getUsersByBossId($tempBossidArray);
		}
	}
// <--- 13.09.2016 --- functions full chart ---




// --- 13.09.2016 --- full chart, all users --->
if(isset($_REQUEST['show'])){
	
	$tempArray = array();
	$strBoss = getBoss();
	
	$tempArray[] = $strBoss;

	getUsersByBossId( array($tempArray[0][0]['v']) );

	echo json_encode($tempArray);
	
}
// <--- 13.09.2016 --- full chart, all users ---	
	
	




// --- 13.09.2016 --- for user panel details: user info, user tasks --->
if(isset($_REQUEST['showUser'])){
	
		//$query = "SELECT `name`,`last_name`,`title`,`photo`,`boss_id`,`department_id` FROM `bb_users` WHERE id = ".$_REQUEST['showUser'].";";
		$query = "SELECT u.`name`,u.`last_name`,u.`title`,u.`photo`,`boss_id` AS BID, (SELECT `name` FROM `bb_users` WHERE id = BID),d.`id`, u.`active`
FROM `bb_users` u
LEFT JOIN `bb_departments` d ON d.`id` = u.`department_id`
WHERE u.id = ".$_REQUEST['showUser'].";";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($name,$last_name,$title,$photo,$boss_id,$boss,$department_id,$active);
		while($stmt->fetch()){
			$data[]=array(
				'name'=>$name,'last_name'=>$last_name,'title'=>$title,'photo'=>$photo,'boss_id'=>$boss,'department_id'=>$departments[$department_id],'active'=>$active
			);
			
		}
		$stmt->close();
		}
		}
		echo json_encode($data);
}

if(isset($_REQUEST['getTasks'])){
		
		$iduser = $_REQUEST['iduser'];
		$data = array();
		
		//$query = "SELECT ts.`name`, COUNT(*) AS `count`, ts.task_status_id FROM `bb_order_tasks` t INNER JOIN bb_task_status ts ON ts.task_status_id = t.`status` WHERE t.`assignee` = ".$iduser." GROUP BY t.`status`";
$query = "SELECT * FROM (
SELECT ts.`name`, COUNT(*), ts.task_status_id
FROM `bb_order_tasks` t
INNER JOIN bb_task_status ts ON ts.task_status_id = t.`status`
WHERE t.`assignee` = ".$iduser." GROUP BY t.`status`

UNION

SELECT ts.`name`, 0, ts.task_status_id
FROM bb_task_status ts 
WHERE ts.task_status_id NOT IN (SELECT `status` FROM `bb_order_tasks` WHERE `assignee` = ".$iduser." GROUP BY `status`) AND `deleted` != 1
) t ORDER BY t.task_status_id ASC"; //change assigned_by on assignee
		$i=0;
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($name,$counttask,$status_id);
		while($stmt->fetch()){
			$data[$i] = array('name'=>$statuses[$status_id],'counttask'=>$counttask,'status_id'=>$status_id);
			$i++;
		}
		}
		}
		$stmt->close();
		echo '{"rows":'.json_encode($data).'}';
		
}
// <--- 13.09.2016 --- for user panel details: user info, user tasks ---



// --- 16.09.2016 --- filter orgChart by Name and show 3-layers model --->
/*if(isset($_REQUEST['filterOrgChart'])){
		
		$tempArray = array();
		
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo` FROM `bb_users` WHERE name LIKE '%".$_REQUEST['filterOrgChart']."%' OR last_name LIKE '%".$_REQUEST['filterOrgChart']."%';";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($id,$name,$last_name,$title,$photo);
		while($stmt->fetch()){
			if($photo || $photo!=""){
			$src = $photo;
			}else{
			$src = "img/noperson.jpg";
			}
			$tempArray[] = array(array('v' => (string)$id, 'f' => $name.' '.$last_name.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title.'</div><img src='.$src.' width="50" height="50" />'), '', '');
			
		}
		$stmt->close();
		}
		}
		
		
		
		
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo` FROM `bb_users` WHERE boss_id = ".$id." ORDER BY `id` ASC;";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($id2,$name2,$last_name2,$title2,$photo2);
		while($stmt->fetch()){
			if($photo2 || $photo2!=""){
			$src2 = $photo2;
			}else{
			$src2 = "img/noperson.jpg";
			}
			$tempArray[] = array(array('v' => (string)$id2, 'f' => $name2.' '.$last_name2.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title2.'</div><img src='.$src2.' width="50" height="50" />'), (string)$id, '');
			
		}
		$stmt->close();
		}
		}
		
		echo json_encode($tempArray);
}*/
// <--- 16.09.2016 --- filter orgChart by Name and show 3-layers model ---



function boss_child($id) {
	global $db;
	$count = "";
	$query = "SELECT COUNT(*) FROM `bb_users` WHERE `boss_id` = $id";
	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    }

    return $count;
}

//echo boss_child(6);









function get3LayersModel($filter=null){
		global $db;
		global $tempArray;
		global $id_user;
		
		$id = null;
		$boss_id = null;
		$arr_id = null;
		$id_child = false;

		
		if($filter){
			$iduser = $filter;
		}else{
			$iduser = $id_user;
		}
		
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`,`boss_id`, `active` FROM `bb_users` WHERE `id`=".$iduser.";";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($id,$name,$last_name,$title,$photo,$boss_id,$active);
		while($stmt->fetch()){
			if($photo || $photo!=""){
			$src = $photo;
			}else{
			$src = "img/noperson.jpg";
			}
		}
		$stmt->close();
		}
		}
		
		if($boss_id){
		
		$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`,`active` FROM `bb_users` WHERE id = ".$boss_id." ORDER BY `id` ASC;";
		if($stmt = $db->prepare($query)){
		if($stmt->execute()){
		$stmt->bind_result($id0,$name0,$last_name0,$title0,$photo0,$active0);

		while($stmt->fetch()){
			if($photo0 || $photo0!=""){
			$src0 = $photo0;
			}else{
			$src0 = "img/noperson.jpg";
			}
			$tempArray[] = array(array('v' => (string)$id0, 'f' => $name0.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title0.'</div><img src='.$src0.' width="50" height="50" /><p><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('.$id0.')" /><img onclick="drawChart('.$id0.')" align="right" src="img/Next.png" width="30" height="30" /></p>', 'a' => (string)$active0), '', '');
			
		}
		$stmt->close();
		}
		}
		$tempArray[] = array(array('v' => (string)$id, 'f' => $name.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title.'</div><img src='.$src.' width="50" height="50" /><p><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('.$id.')" /></p>', 'a' => (string)$active), (string)$id0, '');
		
		
		}else{
			$tempArray[] = array(array('v' => (string)$id, 'f' => $name.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title.'</div><img src='.$src.' width="50" height="50" /><p><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('.$id.')" /></p>', 'a' => (string)$active), '', '');
		}
	
			$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`,`active` FROM `bb_users` WHERE boss_id = ".(int)$id." ORDER BY `id` ASC;";
			if($stmt = $db->prepare($query)){
			if($stmt->execute()){
			$stmt->bind_result($id3,$name3,$last_name3,$title3,$photo3,$active3);
			while($stmt->fetch()){
				if($photo3 || $photo3!=""){
					$src3 = $photo3;
				}else{
					$src3 = "img/noperson.jpg";
				}
				
				if($id3 != null) {
					$id_child = true;
					$arr_id[] = $id3;
				}
				else {
					$id_child = false;
					$tempArray[] = array(array('v' => (string)$id3, 'f' => $name3.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title3.'</div><img src='.$src3.' width="50" height="50" /><p><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('.$id3.')" /><img onclick="drawChart('.$id3.')" align="right" src="img/Next.png" width="30" height="30" /></p>', 'a' => (string)$active3), (string)$id, '');
				}
			}
			//var_dump($arr_id);
			if($id_child == true) {
				foreach ($arr_id as $value) {
					$child = boss_child($value);
					$query = "SELECT `id`,`name`,`last_name`,`title`,`photo`,`active`,`boss_id` FROM `bb_users` WHERE `id` = $value ORDER BY `id` ASC;";
					if($stmt = $db->prepare($query)){
						if($stmt->execute()){
							$stmt->bind_result($id4,$name4,$last_name4,$title4,$photo4,$active4,$b_id4);
							while($stmt->fetch()){
								if($photo4 || $photo4!=""){
									$src4 = $photo4;
								}else{
									$src4 = "img/noperson.jpg";
								}
								if($active4 == 0 && $child == 0) $tempArray[] = array(array('v' => '', 'f' => '', 'a' => ''), (string)$id, '');
								else $tempArray[] = array(array('v' => (string)$value, 'f' => $name4.' <div style= "color:red; font-style:italic; font-size:10px;">'.$title4.'</div><img src='.$src4.' width="50" height="50" /><p><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('.$id4.')" /><img onclick="drawChart('.$id4.')" align="right" src="img/Next.png" width="30" height="30" /></p>', 'a' => (string)$active4), (string)$id, '');
							}
						}
					}
				}
			}
			$stmt->close();
			}
			}
			
}


if(isset($_REQUEST['showByUser'])){
	
	$filter = $_REQUEST['showByUserFilter'];
	$tempArray = array();
	
	if($filter!='false'){
		
		if(is_numeric($filter)){
			get3LayersModel($filter);
		}else{
			$query = "SELECT `id` FROM `bb_users` WHERE name LIKE '%".$filter."%' OR last_name LIKE '%".$filter."%';";
			if($stmt = $db->prepare($query)){
			if($stmt->execute()){
			$stmt->bind_result($id);
			while($stmt->fetch()){
			}
			$stmt->close();
			}
			}
			get3LayersModel($id);
		}
		
	}else{
		get3LayersModel();
	}
	
	echo json_encode($tempArray);
}



if(isset($_REQUEST['getTasksByUser'])){
			
			$status = $_REQUEST['status'];
            $assignee = $_REQUEST['iduser'];

           $query = "SELECT tt.tasks_type, COUNT(*) AS num, tt.id FROM `bb_order_tasks` t
                    INNER JOIN bb_tasks_type tt ON tt.id = t.task_type
                    INNER JOIN bb_users u ON t.assignee = u.id
                    WHERE t.assignee = $assignee AND `status` = $status
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




if(isset($_REQUEST['getProgressUser']))  {
        $Model = array();
        
		$type = $_REQUEST['type'];
        $status =$_REQUEST['status'];
        $assignee = $_REQUEST['iduser'];

       $pNum = "";

		$query = "SELECT ot.task_id, tt.`tasks_type`, ot.task_type as id_task_type, ts.`name`, ot.`order_id`, u1.`name` AS `Assignee`, u2.`name` AS `Responsible`, 
                   DATE( ot.`requested_date`), DATE(ot.`assignment_date`), DATE(ot.`due_date`), DATE(ot.`completion_date`), DATE(ot.`new_due_date`),ot.status as id_status
                    FROM bb_order_tasks ot 
                    LEFT JOIN `bb_tasks_type` tt ON ot.`task_type` = tt.`id`
                    LEFT JOIN `bb_task_status` ts ON ot.`status` = ts.`task_status_id`
                    LEFT JOIN `bb_users` u1 ON ot.`assignee` = u1.`id`
                    LEFT JOIN `bb_users` u2 ON ot.`assigned_by` = u2.`id`
                    WHERE ot.assignee = $assignee AND task_type = $type AND status = $status";
					
        if($stmt = $db->prepare($query)){
            $stmt->execute();
            $stmt->bind_result($task_id,$task_type, $id_task_type, $status, $order, $assignee, $responsible, $req_date, $as_date, $due_date, $comp_date, $ndue_date, $id_status);
			while ($stmt->fetch()){
				$Model[] = array(
                    'id'=>$task_id,
					'task_type'=>$task_type,
                    'status'=>$status,
                    'request_id'=>$order,
                    'responsible'=>$responsible,
                    'assigned_to'=>$assignee,
                    'request_date'=>$req_date,
                    'assignment_date'=>$as_date,
                    'due_date'=>$due_date,
                    'complete_date'=>$comp_date,
                    'new_due_date'=>$ndue_date,
                    'id_user'=>$assignee,
					'id_task_type'=>$id_task_type,
					'id_status'=>$id_status
                );
            }
            $stmt->close();
            echo'{rows:'.json_encode($Model).'}';
            }else{ echo '{"success":false,"message":""}'; }
            $db->close();
            exit;
}

if(isset($_REQUEST['getUserPositions'])){
	$user = $_REQUEST['user'];
	if($user){
		$query = "SELECT `id`, `name`, `active`, `title`, `boss_id`, `admin_manager`, `photo`
				FROM `bb_users`
				WHERE `boss_id` =".$user." OR `id` = ".$user." OR `admin_manager` = ".$user." OR `id` = (SELECT `boss_id` FROM `bb_users` WHERE `id` = ".$user.") 
				OR `id` = (SELECT `admin_manager` FROM `bb_users` WHERE `id` = ".$user.")";
		if($stmt = $db->prepare($query)){
			if($stmt->execute()){
				$stmt->bind_result($id, $name, $active, $title, $boss_id, $admin_manager, $photo);
				while($stmt->fetch()){
					$result[] = array('id'=>$id, 'name' => $name, 'active'=>$active, 'title'=>$title, 'func_manager'=>$boss_id, 'admin_manager'=>$admin_manager, 'photo'=>$photo);
				}
			}

		for($i=0; $i<count($result); $i++){
			$result[$i]['name'] = mb_strtoupper($result[$i]['name']);

			if(!$result[$i]['func_manager']){
				$result[$i]['func_manager'] = "";
			}
			if(!$result[$i]['admin_manager']){
				$result[$i]['admin_manager'] = "";
			}
			if($result[$i]['admin_manager']==$user){
				$result[$i]['func_manager'] = "";
			}

			if($result[$i]['func_manager']==$user){
				$result[$i]['admin_manager'] = "";
			}

			if($result[$i]['id']==$user){
				$result[$i]['branch'] = 'func';
				for($k=0; $k<count($result); $k++){
					if($result[$k]['id']==$result[$i]['admin_manager']){
						$result[$k]['branch'] = 'admin';
						$result[$k]['func_manager'] = "";
						$result[$k]['admin_manager'] = "";
					}

					if($result[$k]['id']==$result[$i]['func_manager']){
						$result[$k]['branch'] = 'func';
						$result[$k]['func_manager'] = "";
						$result[$k]['admin_manager'] = "";
					}

					if($result[$k]['func_manager']==$user){
						$result[$k]['branch'] = 'func';
					}

					if($result[$k]['admin_manager']==$user){
						$result[$k]['branch'] = 'admin';
					}
				}
			}
		}

		for($i=0; $i<count($result); $i++){
			if($result[$i]['active']!=1){
				$count=0;
				$query = "SELECT COUNT(*) FROM `bb_users` WHERE `active` =1 AND (`boss_id` = ".$result[$i]['id']." OR `admin_manager` = ".$result[$i]['id'].")";
				if ($stmt1 = $db->prepare($query)) {
			        $stmt1->execute();
			        $stmt1->bind_result($count);
			        $stmt1->fetch();
			        $stmt1->close();
			    }
			    if($count==0){
			    	unset($result[$i]);
			    }
			}
		}

		$result = array_merge(array(), $result);

		$temp = array();
		for($i=0; $i<count($result); $i++){
			if($result[$i]['branch']=='admin'){
				$temp[] = $result[$i];
			}
			else {
				array_unshift($temp, $result[$i]);
			}
		}

		$result = $temp;
		$stmt->close();
	    echo json_encode($result);
	    }else{ echo '{"success":false,"message":""}'; }
	    $db->close();
	}
	exit;
}




?>
