<?php
    session_start();
    header('Content-Type: application/json; charset=utf-8');
    error_reporting(E_ERROR);
    
	if (!isset($_SESSION['id'])) {
    die('{"success":false,"message":""}');
	}

	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";
	include "../logger.php";
	include "function.php";
	require_once("../lang/langs.php");
	include "saveform_func.php";

if (isset($_REQUEST['users'])) {
 
 //$query = $_REQUEST['query'];
 //echo $query;
 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
  $query = "SELECT `id`, `name` FROM `bb_users`  WHERE `active` = 1 ORDER BY `name` ASC;";
 }else{
  $query = "SELECT `id`, `name` FROM `bb_users` WHERE `active` = 1 AND `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
  //echo $query;
  }
 
 if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}
/**************************************************************************************************************************************************/

	if(isset($_REQUEST['task_status']))
    {
		$query = "SELECT `task_status_id`, `name` FROM bb_task_status ORDER BY `name` ASC;";
		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['department']))
    {
    	$filterParam;
		if(isset($_REQUEST['query'])) $filterParam = "WHERE `name` LIKE '%$_REQUEST[query]%'";
		$query = "SELECT `id`, `name` FROM bb_departments $filterParam ORDER BY `name` ASC;";
		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['productLine'])){
			 $query = "SELECT `id`, `name` FROM bb_product_line WHERE `deleted`=0 ORDER BY `name` ASC";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

	if(isset($_REQUEST['productType']))
	    {
			$query = "SELECT `id`, `name` FROM bb_product_type WHERE `deleted`=0 ORDER BY `name` ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

	if(isset($_REQUEST['operations'])) {
				 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
				  $query = "SELECT `id`, `operation_procedure` FROM `bb_operations` WHERE `deleted`=0 ORDER BY `id` ASC;";
				 }else{
				  $query = "SELECT `id`, `operation_procedure` FROM `bb_operations` WHERE `deleted`=0 AND `operation_procedure` LIKE '%".$_REQUEST['query']."%'  ORDER BY `id` ASC;";
				  }
			
				if($stmt = $db->prepare($query)){
		        $stmt->execute();
		        $stmt->bind_result($id,$name);
		        while ($stmt->fetch()){
					$Model[]= array('id'=>$id,'value'=>$name);
				}
				$stmt->close();
				echo'{rows:'.json_encode($Model).'}';
				}else{ echo '{"success":false,"message":""}'; }
				$db->close();
				exit;
}


		if(isset($_REQUEST['getCustomers']))  {
			 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
				  $query = "SELECT `id`, `name` FROM `bb_potential_customers` ORDER BY `name` ASC;";
				 }else{
				  $query = "SELECT `id`, `name` FROM `bb_potential_customers` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
				  //echo $query;
				  }
					if($stmt = $db->prepare($query)){
			        $stmt->execute();
			        $stmt->bind_result($id,$name);
			        while ($stmt->fetch()){
						$Model[]= array('id'=>$id,'value'=>$name);
					}
					$stmt->close();
					echo'{rows:'.json_encode($Model).'}';
					}else{ echo '{"success":false,"message":""}'; }
					$db->close();
					exit;
				}

if(isset($_REQUEST['setPotentialCustomers']))  {
				$query = "SELECT COUNT(*) FROM `bb_potential_customers` WHERE `name` = '".$_REQUEST['name']."'";
			    if ($stmt = $db->prepare($query)) {
			        $stmt->execute();
			        $stmt->bind_result($count);
			        $stmt->fetch();
			        $stmt->close();
			    }
			    if($count == 0){
			    	$query = "INSERT INTO `bb_potential_customers` SET `name` = '".$_REQUEST['name']."'";
					/*if(*/$db->query($query);/*) {echo '{"success":true,"message":"New potential customer added successfully."}';}*/
			    }/*else{ echo '{"success":false,"message":"This potential customer already exists."}'; }*/
			$db->close();
			exit;
		}


		if(isset($_REQUEST['getBBB_SKU']))  {
			 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
				  $query = "SELECT `id`, `name` FROM `bb_bbb_sku` ORDER BY `name` ASC;";
				 }else{
				  $query = "SELECT `id`, `name` FROM `bb_bbb_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
				  //echo $query;
				  }
					if($stmt = $db->prepare($query)){
			        $stmt->execute();
			        $stmt->bind_result($id,$name);
			        while ($stmt->fetch()){
						$Model[]= array('id'=>$id,'value'=>$name);
					}
					$stmt->close();
					echo'{rows:'.json_encode($Model).'}';
					}else{ echo '{"success":false,"message":""}'; }
					$db->close();
					exit;
				}

		if(isset($_REQUEST['setBBB_SKU']))  {
				$query = "INSERT INTO `bb_bbb_sku` SET `name` = '".$_REQUEST['name']."'";
				$db->query($query);

			}


			if(isset($_REQUEST['getCompetitors']))  {
			 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
				  $query = "SELECT `id`, `name` FROM `bb_competitors` ORDER BY `name` ASC;";
				 }else{
				  $query = "SELECT `id`, `name` FROM `bb_competitors` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
				  }
					if($stmt = $db->prepare($query)){
			        $stmt->execute();
			        $stmt->bind_result($id,$name);
			        while ($stmt->fetch()){
						$Model[]= array('id'=>$id,'value'=>$name);
					}
					$stmt->close();
					echo'{rows:'.json_encode($Model).'}';
					}else{ echo '{"success":false,"message":""}'; }
					$db->close();
					exit;
				}

		if(isset($_REQUEST['setCompetitors']))  {
				$query = "INSERT INTO `bb_competitors` SET `name` = '".$_REQUEST['name']."'";
				$db->query($query);

			}

if(isset($_REQUEST['getPriorityLevel']))
	    {
			$query = "SELECT `id`, `name` FROM bb_priority_levels ORDER BY `name` ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}


if(isset($_REQUEST['getCORE_SKU']))  {
	 if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
		  $query = "SELECT `id`, `name` FROM `bb_core_sku` ORDER BY `name` ASC;";
		 }else{
		  $query = "SELECT `id`, `name` FROM `bb_core_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
		  //echo $query;
		  }
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

if(isset($_REQUEST['getLatest_SKU']))  {
	if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
		$query = "SELECT `id`, `name` FROM `bb_latest_sku` ORDER BY `name` ASC;";
	}else{
		$query = "SELECT `id`, `name` FROM `bb_latest_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
		  //echo $query;
	}
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['getOE_SKU'])) {
	if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
		$query = "SELECT `id`, `name` FROM `bb_oe_sku`";
	}else{
		$query = "SELECT `id`, `name` FROM `bb_oe_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
					  //echo $query;
	}
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[] = array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['getSimilar_SKU'])) {
	if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
		$query = "SELECT `id`, `name` FROM `bb_similar_sku`";
	}else{
		$query = "SELECT `id`, `name` FROM `bb_similar_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
					  //echo $query;
	}
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['getReman_SKU'])) {
	if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
		$query = "SELECT `id`, `name` FROM `bb_reman_sku`";
	}else{
		$query = "SELECT `id`, `name` FROM `bb_reman_sku` WHERE `name` LIKE '%".$_REQUEST['query']."%'  ORDER BY `name` ASC;";
					  //echo $query;
	}
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['setCORE_SKU']))  {
	$query = "SELECT COUNT(*) FROM `bb_core_sku` WHERE `name` = '".$_REQUEST['name']."'";
		    if ($stmt = $db->prepare($query)) {
		        $stmt->execute();
		        $stmt->bind_result($count);
		        $stmt->fetch();
		        $stmt->close();
		    }
		    if($count == 0){
		    	$query = "INSERT INTO `bb_core_sku` SET `name` = '".$_REQUEST['name']."'";
				/*if(*/$db->query($query);/*) {echo '{"success":true,"message":"New CORE SKU added successfully."}';}
		    }else{ echo '{"success":false,"message":"This CORE SKU already exists."}'; */
		}
		$db->close();
		exit;

}

if(isset($_REQUEST['setOE_SKU']))  {
	$query = "SELECT COUNT(*) FROM `bb_oe_sku` WHERE `name` = '".$_REQUEST['name']."'";
		    if ($stmt = $db->prepare($query)) {
		        $stmt->execute();
		        $stmt->bind_result($count);
		        $stmt->fetch();
		        $stmt->close();
		    }
		    if($count == 0){
		    	$query = "INSERT INTO `bb_oe_sku` SET `name` = '".$_REQUEST['name']."'";
				/*if(*/$db->query($query);/*) {echo '{"success":true,"message":"New CORE SKU added successfully."}';}
		    }else{ echo '{"success":false,"message":"This CORE SKU already exists."}'; */
		}
		$db->close();
		exit;

}

if(isset($_REQUEST['setSimilar_SKU']))  {
	$query = "SELECT COUNT(*) FROM `bb_similar_sku` WHERE `name` = '".$_REQUEST['name']."'";
		    if ($stmt = $db->prepare($query)) {
		        $stmt->execute();
		        $stmt->bind_result($count);
		        $stmt->fetch();
		        $stmt->close();
		    }
		    if($count == 0){
		    	$query = "INSERT INTO `bb_similar_sku` SET `name` = '".$_REQUEST['name']."'";
				/*if(*/$db->query($query);/*) {echo '{"success":true,"message":"New CORE SKU added successfully."}';}
		    }else{ echo '{"success":false,"message":"This CORE SKU already exists."}'; */
		}
		$db->close();
		exit;

}

if(isset($_REQUEST['setReman_SKU']))  {
	$query = "SELECT COUNT(*) FROM `bb_reman_sku` WHERE `name` = '".$_REQUEST['name']."'";
		    if ($stmt = $db->prepare($query)) {
		        $stmt->execute();
		        $stmt->bind_result($count);
		        $stmt->fetch();
		        $stmt->close();
		    }
		    if($count == 0){
		    	$query = "INSERT INTO `bb_reman_sku` SET `name` = '".$_REQUEST['name']."'";
				/*if(*/$db->query($query);/*) {echo '{"success":true,"message":"New CORE SKU added successfully."}';}
		    }else{ echo '{"success":false,"message":"This CORE SKU already exists."}'; */
		}
		$db->close();
		exit;

}

if(isset($_REQUEST['bb_location_name']))
{
	$query = "SELECT `id`, `Name`, `Address` FROM bb_locations WHERE `deleted` = 0 ORDER BY `Name` ASC;";
	if($stmt = $db->prepare($query)){
	    $stmt->execute();
	    $stmt->bind_result($id,$name, $address);
	    while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name, 'address'=>$address);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}			

if(isset($_REQUEST['address']))
{
    $Model = array();
    $query = "SELECT id, Address FROM bb_locations ORDER BY `Name` ASC;";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}
if(isset($_REQUEST['supplier']))
{
    $Model = array();
    if($_REQUEST['query']){
        $query = "SELECT idx, title FROM bb_supplier WHERE `title` LIKE '%".$_REQUEST['query']."%' ORDER BY `title` ASC;";
    } else {
        $query = "SELECT idx, title FROM bb_supplier ORDER BY `title` ASC;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getPredominantMake']))
	    {
			$query = "SELECT `id`, `make` FROM bb_predominant_make ORDER BY `make` ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$name,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}

	if(isset($_REQUEST['getLifecycle']))
	    {
			$query = "SELECT `id`, `lifecycle` FROM bb_lifecycle ORDER BY id ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$name,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
		}	

if(isset($_REQUEST['getToolNumbers']))
	    {
			$query = "SELECT `id`, `number` FROM bb_tool_gage";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$number);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'number'=>$number);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
}

if(isset($_REQUEST['getEquipNumbers']))
	    {
			$query = "SELECT `id`, `number` FROM bb_equipment";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$number);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'number'=>$number);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
}

if(isset($_REQUEST['getWorkStNumbers']))
	    {
			$query = "SELECT `id`, `number` FROM bb_workstation";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$number);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'number'=>$number);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
}
		
if(isset($_REQUEST['getProgressData']))  {
		if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
			$user = $_REQUEST['user'];
			/*$arr_users = getUsersIdByBossId2($user);
			$arr_users[]=$user;
			$str_user = implode(',', $arr_users);*/
			$filterUser = "AND `assignee` =".$user." ";
		} else $filterUser = '';
		if(isset($_REQUEST['startDate'])&&$_REQUEST['startDate']!=null){
			$start = $_REQUEST['startDate'];
		} else $start = date('Y').'-01-01';
		if(isset($_REQUEST['endDate'])&&$_REQUEST['endDate']!=null){
			$end = $_REQUEST['endDate'];
		} else $end = date('Y-m-d');
		
		$array_status = array(1=>'new_task', 2=> 'in_progress', 4=> 'completed',  5=>'overdue',  6=>'in_queue');
				$query = "SELECT MONTH(`snapshot_date`) AS `monthId`, YEAR(`snapshot_date`) AS `year`, ts.`name`, COUNT(*), ts.task_status_id 
					FROM `bb_snapshots` sn
					INNER JOIN bb_task_status ts ON task_status_id = `task_status`
					INNER JOIN bb_order_tasks ot ON ot.task_id = sn.task_id
					WHERE DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) AND
					DATE(`snapshot_date`)>='$start' AND DATE(`snapshot_date`)<= '$end' 
					$filterUser
					 GROUP BY `year`,  MONTH(`snapshot_date`), `task_status`";
		//echo $query; exit;
		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($monthId, $year, $status, $num, $status_id);
        $i=0;
		$prev_month = '';
        while ($stmt->fetch()){
			$name = $months[$monthId].$year;			
			$month = substr($months[$monthId],0, 3);
			$year = substr($year,-2);
			$month = $month.".".$year;
			
			$Model[$name]['month'] = $month;
			$Model[$name]['year'] = $year;
			$Model[$name]['monthId'] = $monthId;
			$Model[$name][$array_status[$status_id]] =  $num;
			
			for($i=0; $i<count($array_status); $i++) {
				if (!isset($Model[$name][$array_status[$i]])) $Model[$name][$array_status[$i]] = 0;
			}

        }

        $stmt->close();
		
		
		$now = date('Y-m-d');
		$name = $months[date('m')].date('Y');
		if($now <= $end && $now >= $start && !$Model[$name]){
			$query = "SELECT MONTH(NOW()) AS `monthId`, YEAR(NOW()) AS `year`, ts.`name`, COUNT(*), `status` FROM bb_order_tasks ot
						INNER JOIN bb_task_status ts ON task_status_id = `status`
						$filterUser
						WHERE `status` NOT IN (4) OR (`status` = 4 AND MONTH(`completion_date`) = MONTH(NOW()))
						GROUP BY `status`";
			if($stmt1 = $db->prepare($query)){
				$stmt1->execute();
				$stmt1->bind_result($monthId, $year, $status, $num, $status_id);
				$i=0;
				$prev_month = '';
				while ($stmt1->fetch()){
					$name = $months[$monthId].$year;			
					$month = substr($months[$monthId],0, 3);
					$year = substr($year,-2);
					$month = $month.".".$year;
					
					$Model[$name]['month'] = $month;
					$Model[$name]['year'] = $year;
					$Model[$name]['monthId'] = $monthId;
					$Model[$name][$array_status[$status_id]] =  $num;
					
					for($i=0; $i<count($array_status); $i++) {
						if (!isset($Model[$name][$array_status[$i]])) $Model[$name][$array_status[$i]] = 0;
					}

				}
				$stmt1->close();
			}
		}
		$progress = array();
		$progress = array_values($Model);

       echo"{rows:".json_encode($progress)."}";
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
	}	
	
	if(isset($_REQUEST['getFrcData']))  {
		/*if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
			$user = $_REQUEST['user'];
			$arr_users = getUsersIdByBossId2($user);
			$arr_users[]=$user;
			$str_user = implode(',', $arr_users);
			$filterUser = "AND assignee IN ($str_user)";
		} else $filterUser = '';*/

		if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
			$user = $_REQUEST['user'];
			$filterUser = "AND `assignee` =".$user." ";
		} else $filterUser = '';

		if(isset($_REQUEST['startDate'])&&$_REQUEST['startDate']!=null){
			$start = $_REQUEST['startDate'];
		} else $start = date('Y').'-01-01';
		if(isset($_REQUEST['endDate'])&&$_REQUEST['endDate']!=null){
			$end = $_REQUEST['endDate'];
		} else $end = date('Y-m-d');
		$array_frc = array(1=>'approved', 2=> 'rejected');
		$query = "SELECT MONTH(`snapshot_date`) AS `monthId`, YEAR(`snapshot_date`) AS `year`, `rejected`, COUNT(*)
				FROM `bb_snapshots` s
				INNER JOIN `bb_order_tasks` ot ON ot.`task_id` = s.`task_id`
				LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
				LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
				WHERE DATE(`snapshot_date`)>='$start' AND DATE(`snapshot_date`)<= '$end' 
				AND DAY(`snapshot_date`) = DAY(LAST_DAY(`snapshot_date`)) 
				$filterUser
				AND s.`task_status` = 4 AND ((s.`task_type` = 36 AND pr.`reopen` = 0)OR(s.`task_type` = 40 AND pfgr.`reopen` = 0))
				GROUP BY MONTH(`snapshot_date`), `rejected`";

       if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($monthId, $year, $rejected, $num);
        $i=0;
        while ($stmt->fetch()){
        	$name = $months[$monthId].$year;
			$month = substr($months[$monthId],0, 3);
			$year = substr($year,-2);
			$month = $month.".".$year;
			
			$Model[$name]['month'] = $month;
			$Model[$name]['year'] = $year;
			$Model[$name]['monthId'] = $monthId;
			$Model[$name][$array_frc[$rejected]] =  $num;
        }
         $stmt->close();

        $now = date('Y-m-d');
		$name = $months[date('m')].date('Y');
		if($now <= $end && $now >= $start && !$Model[$name]){
			$query = "SELECT MONTH(NOW()) AS `monthId`, YEAR(NOW()) AS `year`, `rejected`, COUNT(*)
				FROM `bb_order_tasks` ot
				INNER JOIN `bb_task_status` ts ON `task_status_id` = `status`
				LEFT JOIN `bb_ppap_review` pr ON pr.`idx` = ot.`outID_task`
				LEFT JOIN `bb_ppap_finished_good_review` pfgr ON pfgr.`idx` = ot.`outID_task`
				WHERE `status` = 4 AND MONTH(`completion_date`) = MONTH(NOW()) AND ((`task_type` = 36 AND pr.`reopen` = 0) OR (`task_type` = 40 AND pfgr.`reopen` = 0))
				".$filterUser."
				GROUP BY `rejected`";
			if($stmt1 = $db->prepare($query)){
				$stmt1->execute();
				$stmt1->bind_result($monthId, $year, $rejected, $num);
				$i=0;
				$prev_month = '';
				while ($stmt1->fetch()){
					$name = $months[$monthId].$year;			
					$month = substr($months[$monthId],0, 3);
					$year = substr($year,-2);
					$month = $month.".".$year;
					
					$Model[$name]['month'] = $month;
					$Model[$name]['year'] = $year;
					$Model[$name]['monthId'] = $monthId;
					$Model[$name][$array_frc[$rejected]] =  $num;
					
					for($i=0; $i<count($array_frc); $i++) {
						if (!isset($Model[$name][$array_frc[$i]])) $Model[$name][$array_frc[$i]] = 0;
					}

				}
				$stmt1->close();
			}
		}
		$progress = array();
		$progress = array_values($Model);
         foreach ($Model as $key => $value) {
         	$Model[$key]['frc'] = round($Model[$key]['approved']*100/($Model[$key]['approved']+$Model[$key]['rejected']), 2);
         }
        //print_r($Model);
		$progress = array();
		$progress = array_values($Model);
       	echo"{rows:".json_encode($progress)."}";
        }else{ echo '{"success":false,"message":""}'; }
        $db->close();
        exit;
    }


 if (isset($_REQUEST['getOperators'])) {
  $query = "SELECT u.`id`, `name` 
			FROM `bb_users` u
			INNER JOIN `bb_user_roles` ur ON ur.`user_id` = u.`id`
			WHERE `active` = 1 AND `role_id`IN (17, 18, 19,21) ORDER BY `name` ASC;";
 if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}

if (isset($_REQUEST['getControlers'])) {
  $query = "SELECT u.`id`, `name` 
			FROM `bb_users` u
			INNER JOIN `bb_user_roles` ur ON ur.`user_id` = u.`id`
			WHERE `active` = 1 AND `role_id`IN (18, 19,21) ORDER BY `name` ASC;";
 if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}

if (isset($_REQUEST['getCFO'])) {
  $query = "SELECT u.`id`, `name` 
			FROM `bb_users` u
			INNER JOIN `bb_user_roles` ur ON ur.`user_id` = u.`id`
			WHERE `active` = 1 AND `role_id` IN (19,21) ORDER BY `name` ASC;";
 if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}

if (isset($_REQUEST['getPresident'])) {
  $query = "SELECT u.`id`, `name` 
			FROM `bb_users` u
			INNER JOIN `bb_user_roles` ur ON ur.`user_id` = u.`id`
			WHERE `active` = 1 AND `role_id`=21 ORDER BY `name` ASC;";
 if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}

if(isset($_REQUEST['getDirectoryTool'])) {
	$filterParam = "";
	if(isset($_REQUEST['query'])) $filterParam = "AND `name` LIKE '%$_REQUEST[query]%'";
	$query = "SELECT `id`, `name` FROM bb_tool_gage WHERE `approved` != 2 AND `tool_gage_type` = 0 AND `deleted` != 1 $filterParam";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'name'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getDirectoryGage'])) {
	$filterParam = "";
	if(isset($_REQUEST['query'])) $filterParam = "AND `name` LIKE '%$_REQUEST[query]%'";
	$query = "SELECT `id`, `name` FROM bb_tool_gage WHERE `approved` != 2 AND `tool_gage_type` = 1 AND `deleted` != 1 $filterParam";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'name'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getDirectoryEquip'])) {
	$filterParam = "";
	if(isset($_REQUEST['query'])) $filterParam = "AND `name` LIKE '%$_REQUEST[query]%'";
	$query = "SELECT `id`, `name` FROM bb_equipment WHERE `approved` != 2 $filterParam";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'name'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getDirectoryWork'])) {
	$filterParam = "";
	if(isset($_REQUEST['query'])) $filterParam = "AND `name` LIKE '%$_REQUEST[query]%'";
	$query = "SELECT `id`, `name` FROM bb_workstation WHERE `approved` != 2 $filterParam";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'name'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getPhAttrNames'])) {
	$filterParam = "";
	$Model = array();
	if(isset($_REQUEST['query'])) $filterParam = "AND `attr_name` LIKE '%".$_REQUEST['query']."%'";
	$query = "SELECT `id`, `attr_name`, `data_type`, `comment` FROM `bb_family_attr` WHERE `attr_type` = 2 ".$filterParam;
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($attr_id, $attr_name, $data_type, $comment);
		while ($stmt->fetch()){
			$Model[]= array('attr_id'=>$attr_id,'attr_name'=>$attr_name, 'data_type'=>$data_type, 'comment'=>$comment);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['getCoreAttrNames'])) {
	$filterParam = "";
	$Model = array();
	if(isset($_REQUEST['query'])) $filterParam = "AND `attr_name` LIKE '%".$_REQUEST['query']."%'";
	$query = "SELECT `id`, `attr_name`, `data_type`, `comment` FROM `bb_family_attr` WHERE `attr_type` = 1 ".$filterParam;
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($attr_id, $attr_name, $data_type, $comment);
		while ($stmt->fetch()){
			$Model[]= array('attr_id'=>$attr_id,'attr_name'=>$attr_name, 'data_type'=>$data_type, 'comment'=>$comment);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
	exit;
}

if(isset($_REQUEST['getFamilyTypes'])){
		$query = "SELECT `id`, `family_name` FROM `bb_family_type` ORDER BY `family_name` ASC;";
		if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$family_name);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$family_name);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

if(isset($_REQUEST['getRequestsProgressData'])){

	if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
			$user = $_REQUEST['user'];
			/*$arr_users = getUsersIdByBossId2($user);
			$arr_users[]=$user;
			$str_user = implode(',', $arr_users);*/
			$filterUser = " AND `created_by` = ".$user." ";
		} else $filterUser = '';

		if(isset($_REQUEST['startDate'])&&$_REQUEST['startDate']!=null){
			$start = $_REQUEST['startDate'];
		} else $start = date('Y').'-01-01';
		if(isset($_REQUEST['endDate'])&&$_REQUEST['endDate']!=null){
			$end = $_REQUEST['endDate'];
		} else $end = date('Y-m-d');

	$query = "SELECT MONTH(`creation_date`) AS `monthId`, YEAR(`creation_date`) AS `year`, COUNT(*)
	FROM `bb_order`
	WHERE `task_type_id` =1 AND DATE(`creation_date`) <='".$end."' AND DATE(`creation_date`) >='".$start."'
	".$filterUser."
	GROUP BY MONTH(`creation_date`)";
	if($stmt1 = $db->prepare($query)){
		$stmt1->execute();
		$stmt1->bind_result($monthId, $year, $count);
		while ($stmt1->fetch()){
			$name = $months[$monthId].$year;			
			$month = substr($months[$monthId],0, 3);
			$year = substr($year,-2);
			$month = $month.".".$year;
			
			$Model[$name]['month'] = $month;
			$Model[$name]['year'] = $year;
			$Model[$name]['monthId'] = $monthId;
			$Model[$name]['new_request'] =  $count;
		}
		$stmt1->close();
	}

	$query = "SELECT MONTH(`completion_date`) AS `monthId`, YEAR(`completion_date`) AS `year`, COUNT(*), rs.`request_status_id` 
			FROM `bb_order` o
			INNER JOIN `bb_request_status` rs ON rs.`id` = o.`request_status`
			WHERE o.`request_status` IN (3,4) AND DATE(`completion_date`) <='".$end."' AND DATE(`completion_date`) >='".$start."'
			".$filterUser."
			GROUP BY MONTH(`completion_date`), rs.`request_status_id`";
	if($stmt1 = $db->prepare($query)){
		$stmt1->execute();
		$stmt1->bind_result($monthId, $year, $count, $request_status);
		while ($stmt1->fetch()){
			$name = $months[$monthId].$year;			
			$month = substr($months[$monthId],0, 3);
			$year = substr($year,-2);
			$month = $month.".".$year;
			
			$Model[$name]['month'] = $month;
			$Model[$name]['year'] = $year;
			$Model[$name]['monthId'] = $monthId;
			$Model[$name][$request_status] =  $count;
		}
		$stmt1->close();
	}

	$now = date('Y-m-d');
	$name = $months[date('m')].date('Y');

	if($now <= $end && $now >= $start && !$Model[$name]){
		$query="SELECT MONTH(NOW()) AS `monthId`, YEAR(NOW()) AS `year`, COUNT(*) FROM `bb_order`
		WHERE `request_status` NOT IN (3,4) AND `task_type_id` =1 ".$filterUser;
		if($stmt1 = $db->prepare($query)){
			$stmt1->execute();
			$stmt1->bind_result($monthId, $year, $count);
			while ($stmt1->fetch()){
				$name = $months[$monthId].$year;			
				$month = substr($months[$monthId],0, 3);
				$year = substr($year,-2);
				$month = $month.".".$year;
				
				$Model[$name]['month'] = $month;
				$Model[$name]['year'] = $year;
				$Model[$name]['monthId'] = $monthId;
				$Model[$name]['in_progress_request'] =  $count;
			}
			$stmt1->close();
		}
	}
	

	foreach ($Model as $key => $value) {
		if(strlen($Model[$key]['monthId'])==1){
			$Model[$key]['monthId'] = "0".$Model[$key]['monthId'];
		}
		if($key!=$name){
			$count = 0;
			$query = "SELECT COUNT(*) FROM `bb_order` 
				WHERE DATE(`creation_date`) < LAST_DAY('20".$Model[$key]['year']."-".$Model[$key]['monthId']."-15') AND DATE(`completion_date`) > LAST_DAY('20".$Model[$key]['year']."-".$Model[$key]['monthId']."-15')
				AND `task_type_id` =1 ".$filterUser;
			if ($stmt = $db->prepare($query)) {
	            $stmt->execute();
	            $stmt->bind_result($count);
	            $stmt->fetch();
	            $stmt->close();
	        }
			$Model[$key]['in_progress_request'] =  $count;
		}
	}

	$progress = array();
	if(count($Model)>0){
		$progress = array_values($Model);
		echo"{rows:".json_encode($progress)."}";
    }
    else
    	{ 
    		echo"{rows:".json_encode($progress)."}";
    	}
    $db->close();
    exit;
}

if(isset($_REQUEST['getTasksDueWithinData'])){
	//$temp = array('New'=>0, 'New(Overdue)'=>0, 'Overdue'=>0, '0-7'=>0, '8-14'=>0, '15-21'=>0, '22-30'=>0);
	$temp = array('new'=>0, 'new_overdue'=>0, 'overdue'=>0, 'within_7'=>0, 'within_14'=>0, 'within_21'=>0, 'within_30'=>0);
    if(isset($_REQUEST['user'])&& $_REQUEST['user']!=null){
			$user = $_REQUEST['user'];
			$filterUser = " AND `assignee` =".$user." ";
		} else $filterUser = '';

    $query = "SELECT `due_date`, `status` FROM `bb_order_tasks` WHERE `status` <>4 ".$filterUser;
    //echo $query;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($due_date, $status);
        while ($stmt->fetch()){
            $Model[]= array('due_date'=>getMKTime($due_date),'status'=>$status);
        }
        $stmt->close();
        //$now = time();
        $now = getMKTime(date('Y-m-d'));
        for($i=0; $i<count($Model); $i++){
        	$diff = $Model[$i]['due_date']-$now;
        	if($Model[$i]['status']==5&&$Model[$i]['due_date']!=""){
        		$temp['overdue']++;
        	}
        	if($Model[$i]['status']==1&&$Model[$i]['due_date']==""){
        		$temp['new']++;
        	}
        	if($Model[$i]['status']==5&&$Model[$i]['due_date']==""){
        		$temp['new_overdue']++;
        	}
        	if($Model[$i]['status']<>5&&$Model[$i]['status']<>1&&$diff<=604800&&$diff>=0){
        		$temp['within_7']++;
        	}
        	if($Model[$i]['status']<>5&&$Model[$i]['status']<>1&&$diff<=1209600&&$diff>604800){
        		$temp['within_14']++;
        	}
        	if($Model[$i]['status']<>5&&$Model[$i]['status']<>1&&$diff<=1814400&&$diff>1209600){
        		$temp['within_21']++;
        	}
        	if($Model[$i]['status']<>5&&$Model[$i]['status']<>1&&$diff<=2592000&&$diff>1814400){
        		$temp['within_30']++;
        	}
        }
        $j=0;
        foreach ($temp as $key => $value) {
        	$result[$j]['days_within'] = $key;
        	$result[$j]['num'] = $value;
        	$result[$j]['days_within_name'] = $within_names[$key];
        	$j++;
        }
        echo'{rows:'.json_encode($result).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getAllToolGage'])) {
	$query = "SELECT `id`, `name` FROM bb_tool_gage";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id, $name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getAllEquipment'])) {
	$query = "SELECT `id`, `name` FROM bb_equipment";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getAllTestProcedure'])) {
	$query = "SELECT `id`, `test_procedure` FROM bb_test_procedure";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['employStatus'])) {
	$query = "SELECT `id`, `name` FROM bb_employment_status";
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($id,$name);
		while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'value'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
	}
	else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getCAPAApprovals'])){
	$filterParam = "";
	if(isset($_REQUEST['query'])&&$_REQUEST['query']!=="") $filterParam = " AND `name` LIKE '%".$_REQUEST['query']."%'";

	$query = "SELECT `id` AS `person_id`, `name`, `title` AS `position` FROM `bb_users` WHERE `active`=1 AND `deleted` = 0 ".$filterParam;
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($person_id, $name, $position);
		while ($stmt->fetch()){
			$Model[]= array('person_id'=>$person_id,'name'=>$name, 'position'=>$position);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

if(isset($_REQUEST['getSKUData']))  {
	$filterParam = "";
	if(isset($_REQUEST['query'])&&$_REQUEST['query']!=="") $filterParam = " WHERE `name` LIKE '%".$_REQUEST['query']."%'";

	$query = "SELECT `id`, `name`, `productLine`, `productType` FROM `bb_bbb_sku` ".$filterParam." ORDER BY `name`";
	if($stmt = $db->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($id,$name, $productLine, $productType);
    while ($stmt->fetch()){
		$Model[]= array('id'=>$id,'value'=>$name, 'product_line'=>$productLine, 'product_type'=>$productType);
	}
	$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
	}else{ 
		echo '{"success":false,"message":""}';
	}
	$db->close();
	exit;
}


if(isset($_REQUEST['getJdTitle']))  {
    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT `id`, `position_name` FROM `bb_positions` GROUP BY `position_name`;";
    }else{
        $query = "SELECT `id`, `position_name` FROM  `bb_positions` WHERE `position_name` LIKE '%".$_REQUEST['query']."%'  GROUP BY `position_name`;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
}


if(isset($_REQUEST['getAllJdTitle']))  {
    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` AS jd_id FROM `bb_positions` AS p
                  LEFT JOIN `bb_job_description` AS jd ON p.`position_name` = jd.`job_title` GROUP BY p.`position_name`;";
    }else{
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` AS jd_id FROM `bb_positions` AS p
                  LEFT JOIN `bb_job_description` AS jd ON p.`position_name` = jd.`job_title` LIKE '%".$_REQUEST['query']."%' GROUP BY `position_name`;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name, $jd_id);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name, 'jd_id'=>$jd_id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
}


if(isset($_REQUEST['getSignPersons'])){
	$filterParam = "";
	if(isset($_REQUEST['query'])&&$_REQUEST['query']!=="") $filterParam = " AND `name` LIKE '%".$_REQUEST['query']."%'";

	$query = "SELECT `id` AS `person_id`, `name`, `title` AS `position`, `department_id`, `email` FROM `bb_users` WHERE `active`=1 AND `deleted` = 0 ".$filterParam;
	if($stmt = $db->prepare($query)){
		$stmt->execute();
		$stmt->bind_result($person_id, $name, $position, $department_id, $email);
		while ($stmt->fetch()){
			$Model[]= array('person_id'=>$person_id,'name'=>$name, 'position'=>$position, 'department_id'=>$department_id, 'email'=>$email);
		}
		$stmt->close();
		echo json_encode($Model);
	}else{ echo '{"success":false,"message":""}'; }
	$db->close();
}

?>