<?php
	include "../../settings.php";

	if(isset($_REQUEST['first_year'])) {
		$query = "SELECT `idx`, `first_year_demand` FROM bb_due_diligence GROUP BY `first_year_demand` ORDER BY `idx` ASC;";
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

	if(isset($_REQUEST['tasks_type'])) {
		$query = "SELECT `id`, `tasks_type` FROM bb_tasks_type ORDER BY `tasks_type` ASC;";
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

	if(isset($_REQUEST['mat_annual'])) {
		$query = "SELECT `idx`, `Annualdemand` FROM bb_due_diligence GROUP BY `Annualdemand` ORDER BY `idx` ASC;";
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

	if(isset($_REQUEST['annual_revenue'])) {
		$query = "SELECT `idx`, `est_annual_revenue` FROM bb_due_diligence GROUP BY `est_annual_revenue` ORDER BY `idx` ASC;";
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

	if(isset($_REQUEST['vehicle_oper']))
	    {
			$query = "SELECT `idx`, `veh_in_operation` FROM bb_due_diligence GROUP BY `veh_in_operation` ORDER BY idx ASC;";
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

	if(isset($_REQUEST['priority_lvl']))
	    {
			$query = "SELECT `idx`, `PriorityLevel` FROM bb_due_diligence GROUP BY `PriorityLevel` ORDER BY idx ASC;";
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

	if(isset($_REQUEST['title']))
	    {
			$query = "SELECT `id`, `title` FROM bb_users GROUP BY `title` ORDER BY id ASC;";
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

	if(isset($_REQUEST['func_manager']))
	    {
	    	if(!isset($_REQUEST['query']) || $_REQUEST['query']=="") $query = "SELECT `id`, `boss_id`, `name` FROM bb_users WHERE `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			else $query = "SELECT `id`, `boss_id`, `name` FROM bb_users WHERE `name` LIKE '%".$_REQUEST['query']."%' AND `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id,$boss_id,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id,'boss_id'=>$boss_id,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
	}

	if(isset($_REQUEST['admin_manager']))
	    {
	    	if(!isset($_REQUEST['query']) || $_REQUEST['query']=="") $query = "SELECT `id`, `admin_manager`, `name` FROM bb_users WHERE `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			else $query = "SELECT `id`, `admin_manager`, `name` FROM bb_users WHERE `name` LIKE '%".$_REQUEST['query']."%' AND `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($id, $admin_manager,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$id, 'admin_manager'=>$admin_manager,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
	}
	if(isset($_REQUEST['users_need']))
	    {
	    	if(!isset($_REQUEST['query']) || $_REQUEST['query']=="") $query = "SELECT `id`, `name` FROM bb_users WHERE `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			else $query = "SELECT `id`, `name` FROM bb_users WHERE `name` LIKE '%".$_REQUEST['query']."%' AND `department_id` != 14 GROUP BY `name` ORDER BY id ASC;";
			if($stmt = $db->prepare($query)){
	        $stmt->execute();
	        $stmt->bind_result($admin_manager,$name);
	        while ($stmt->fetch()){
				$Model[]= array('id'=>$admin_manager,'value'=>$name);
			}
			$stmt->close();
			echo'{rows:'.json_encode($Model).'}';
			}else{ echo '{"success":false,"message":""}'; }
			$db->close();
			exit;
	}

	if(isset($_REQUEST['roles'])){
		if(!isset($_REQUEST['query']) || $_REQUEST['query']=="") $query = "SELECT `id`, `name` FROM bb_roles WHERE `deleted` != 1 ORDER BY id ASC";
    	else $query = "SELECT `id`, `name` FROM bb_roles WHERE `deleted` != 1 AND `name` LIKE '%".$_REQUEST['query']."%' ORDER BY id ASC";
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

	if(isset($_REQUEST['emp_status'])){
    	$query = "SELECT `id`, `name` FROM bb_employment_status ORDER BY id ASC";
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

	if(isset($_REQUEST['request_id'])){
    	$query = "SELECT `order_id`FROM bb_order ORDER BY order_id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id);
        while ($stmt->fetch()){
			$Model[]= array('order_id'=>$id);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['erp'])){
    	$query = "SELECT `idx`, `ERPOrderID` FROM bb_new_engineering_req WHERE `ERPOrderID` IS NOT NULL GROUP BY `ERPOrderID` ORDER BY idx ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $erp);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$erp);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['part_numb'])){
    	$query = "SELECT `id`, `part_number` FROM bb_components ORDER BY id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $part_numb);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$part_numb);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['revision'])){
    	$query = "SELECT `id`, `revision` FROM bb_components GROUP BY `revision` ORDER BY id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $revision);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$revision);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['create_date_comp'])){
    	$query = "SELECT `id`, `create_date` FROM bb_components GROUP BY `create_date` ORDER BY id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $create_date);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$create_date);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['last_mod_comp'])){
    	$query = "SELECT `id`, `last_mod` FROM bb_components WHERE `last_mod` IS NOT NULL GROUP BY `last_mod` ORDER BY id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $last_mod);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$last_mod);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}

	if(isset($_REQUEST['materials'])){
    	$query = "SELECT `id`, `material` FROM bb_components GROUP BY `material` ORDER BY id ASC";
    	if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $material);
        while ($stmt->fetch()){
			$Model[]= array('id'=>$id, 'value'=>$material);
		}
		$stmt->close();
		echo'{rows:'.json_encode($Model).'}';
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
	}