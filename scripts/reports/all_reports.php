<?php
	//include "../function.php";
	include "../../settings.php";

	function getUsersIdByBossId3($bossidArray, $field, $usersTemp=array(), $count = 0){
		global $db;
		
		$tempBossidArray = array();
		$bossidArray = (array) $bossidArray;
		

		//foreach($bossidArray as $key=>$value){
		$str_boss = implode(',', $bossidArray);	

			//$query = "SELECT `id`  FROM `bb_users` WHERE `boss_id` = ".$value." ORDER BY `id` ASC;";
			$query = "SELECT `id`  FROM `bb_users` WHERE $field IN (".$str_boss.") ORDER BY `id` ASC;";
			//echo $query;
			
			if ($stmt = $db->prepare($query)) {
				if ($stmt->execute()) {
					$stmt->bind_result($id);
					$stmt->store_result();
					if($stmt->num_rows()>0){
						while($stmt->fetch()){
							//if ($id !== 1){
								$tempBossidArray[] = $id;
								$usersTemp[]= $id;
							//}
						}
					}
					$stmt->close();
				}
			}

		//}

		if(count($tempBossidArray)>$count){
			$count = count($tempBossidArray);
			return getUsersIdByBossId3($tempBossidArray, $field, $usersTemp, $count);
		}else{
			return $usersTemp;
		}
	}

	function get_child_depart($id_parent, $departs_temp=array(), $count=0) {
		global $db;
		
		$temp_parent_depart = array();
		$id_parent = (array) $id_parent;
		$str_dep = implode(',', $id_parent);

		$query = "SELECT `id`  FROM `bb_departments` WHERE `parent_depart` IN (".$str_dep.") ORDER BY `id` ASC";
		//echo $query;

		if ($stmt = $db->prepare($query)) {
			if ($stmt->execute()) {
				$stmt->bind_result($id);
				$stmt->store_result();
				if($stmt->num_rows()>0){
					while($stmt->fetch()){
						$temp_parent_depart[] = $id;
						$departs_temp[] = $id;
					}
				}
				$stmt->close();
			}
		}

		if(count($departs_temp)>$count){
			$count = count($departs_temp);
			return get_child_depart($temp_parent_depart, $departs_temp, $count);
		}
		else{
			return $departs_temp;
		}
	}

	//var_dump(get_child_depart(8));

	//$start = isset($_REQUEST['start']) ? $_REQUEST['start']  :  0;
	//$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit']  : 50;	

/******************************************************managerReport**************************************************************/
	if(isset($_REQUEST['reportRequest'])) {
		$where = "";

		if(isset($_REQUEST['tasksStatus']) && $_REQUEST['tasksStatus'] != "") $tasks_status = "ot.status =".$_REQUEST['tasksStatus'];
		else $tasks_status = "";

		if(isset($_REQUEST['tasksType']) && $_REQUEST['tasksType'] != "") $tasks_type = " AND ot.task_type IN(".$_REQUEST['tasksType'].")";
		else $tasks_type = "";

		if(isset($_REQUEST['prodLine']) && $_REQUEST['prodLine'] != "") $prod_line = " AND dd.`ProductLine` IN(".$_REQUEST['prodLine'].")";
		else $prod_line = "";

		if(isset($_REQUEST['prodType']) && $_REQUEST['prodType'] != "") $prod_type = " AND dd.`ProductType` IN(".$_REQUEST['prodType'].")";
		else $prod_type = "";

		if(isset($_REQUEST['firstYearMin']) && $_REQUEST['firstYearMin'] != "") $first_year_min = " AND dd.`first_year_demand` >".$_REQUEST['firstYearMin'];
		else $first_year_min = "";

		if(isset($_REQUEST['firstYearMax']) && $_REQUEST['firstYearMax'] != "") $first_year_max = " AND dd.`first_year_demand` <".$_REQUEST['firstYearMax'];
		else $first_year_max = "";

		if(isset($_REQUEST['matAnnualDemMin']) && $_REQUEST['matAnnualDemMin'] != "") $mat_annual_min = " AND dd.`Annualdemand` >".$_REQUEST['matAnnualDemMin'];
		else $mat_annual_min = "";

		if(isset($_REQUEST['matAnnualDemMax']) && $_REQUEST['matAnnualDemMax'] != "") $mat_annual_max = " AND dd.`Annualdemand` <".$_REQUEST['matAnnualDemMax'];
		else $mat_annual_max = "";

		if(isset($_REQUEST['estAnnualRevMin']) && $_REQUEST['estAnnualRevMin'] != "") $est_annual_min = " AND dd.`est_annual_revenue` >".$_REQUEST['estAnnualRevMin'];
		else $est_annual_min = "";

		if(isset($_REQUEST['estAnnualRevMax']) && $_REQUEST['estAnnualRevMax'] != "") $est_annual_max = " AND dd.`est_annual_revenue` <".$_REQUEST['estAnnualRevMax'];
		else $est_annual_max = "";

		if(isset($_REQUEST['lifecycle']) && $_REQUEST['lifecycle'] != "") {
			$arr_life_prev = explode(",",$_REQUEST['lifecycle']);
			foreach ($arr_life_prev as $value) {
				$arr_life_res[] = "'".$value."'";
			}
			//var_dump(implode(",", $arr_life2));
			$lifecycle = " AND life.`lifecycle` IN(".implode(",", $arr_life_res).")";
		}
		else $lifecycle = "";

		if(isset($_REQUEST['predoMake']) && $_REQUEST['predoMake'] != "") $predom_make = " AND dd.`predominant_make` LIKE '%".$_REQUEST['predoMake']."%'";
		else $predom_make = "";

		if(isset($_REQUEST['vehicleOperMin']) && $_REQUEST['vehicleOperMin'] != "") $vehicle_oper_min = " AND dd.`veh_in_operation` >".$_REQUEST['vehicleOperMin'];
		else $vehicle_oper_min = "";

		if(isset($_REQUEST['vehicleOperMax']) && $_REQUEST['vehicleOperMax'] != "") $vehicle_oper_max = " AND dd.`veh_in_operation` <".$_REQUEST['vehicleOperMax'];
		else $vehicle_oper_max = "";

		if(isset($_REQUEST['priorityLvl']) && $_REQUEST['priorityLvl'] != "") $priority_lvl = " AND dd.`PriorityLevel` IN(".$_REQUEST['priorityLvl'].")";
		else $priority_lvl = "";

		if(isset($_REQUEST['reqDateFrom']) && $_REQUEST['reqDateFrom'] != "") $req_date_from = " AND DATE_FORMAT(ot.`requested_date`, '%Y-%m-%d') >'".substr($_REQUEST['reqDateFrom'], 0, 10)."'";
		else $req_date_from = "";

		if(isset($_REQUEST['reqDateTo']) && $_REQUEST['reqDateTo'] != "") $req_date_to = " AND DATE_FORMAT(ot.`requested_date`, '%Y-%m-%d') <'".substr($_REQUEST['reqDateTo'], 0, 10)."'";
		else $req_date_to = "";

		if(isset($_REQUEST['bbbSku']) && $_REQUEST['bbbSku'] != "") $bbb_sku = " AND bs.`name` LIKE'%".$_REQUEST['bbbSku']."%'";
		else $bbb_sku = "";

		if(isset($_REQUEST['requestId']) && $_REQUEST['requestId'] != "") $request_id = " AND ot.`order_id` LIKE'%".$_REQUEST['requestId']."%'";
		else $request_id = "";

		if(isset($_REQUEST['erp']) && $_REQUEST['erp'] != "") $erp = " AND new.`ERPOrderID` ='".$_REQUEST['erp']."'";
		else $erp = "";

		//$and = " AND ";
		$where = "WHERE ";
		$res_string = $where.$tasks_status.$tasks_type.$prod_line.$prod_type.$first_year_min.$first_year_max.$mat_annual_min.$mat_annual_max.$est_annual_min.$est_annual_max.$lifecycle.$predom_make.$vehicle_oper_min.$vehicle_oper_max.$priority_lvl.$req_date_from.$req_date_to.$bbb_sku.$request_id.$erp;
		if(str_replace(" " , "", $res_string) == "WHERE") $res_string = "";
		//if(substr($res_string, -5, 5) == " AND ") $res_string = substr($res_string, 0, -5);
		if(substr($res_string, 0, 10) == "WHERE  AND") $res_string = str_replace("WHERE  AND", "WHERE", $res_string);

		$query1="SELECT COUNT(*)
		FROM bb_order_tasks ot
		LEFT JOIN bb_users u ON assignee = u.id
		LEFT JOIN bb_users us ON assigned_by = us.id
		LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
		LEFT JOIN bb_due_diligence dd ON dd.`RequestID` = ot.`order_id`
		LEFT JOIN bb_product_line prod ON dd.`ProductLine` = prod.`id`
		LEFT JOIN bb_product_type protype ON dd.`ProductType` = protype.`id`
		LEFT JOIN bb_lifecycle life ON dd.`lifecycle` = life.`lifecycle`
		LEFT JOIN bb_new_engineering_req new ON new.`RequestID` = ot.`order_id`
		/*LEFT JOIN bb_predominant_make predom ON dd.`predominant_make` = predom.`make`*/
		INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type $res_string";
		//WHERE ot.status = $tasks_status AND ot.task_type = $tasks_type

		$query2 = "SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS STATUS, prod.`name` AS prod_line_name, protype.name AS prod_type_name, dd.`first_year_demand`, dd.`Annualdemand`, dd.`est_annual_revenue`, life.`lifecycle`, /*predom.`make`*/dd.`predominant_make`, dd.`veh_in_operation`, dd.`PriorityLevel`, new.`ERPOrderID`
		FROM bb_order_tasks ot
		LEFT JOIN bb_users u ON assignee = u.id
		LEFT JOIN bb_users us ON assigned_by = us.id
		LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
		LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
		LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`
		LEFT JOIN bb_due_diligence dd ON dd.`RequestID` = ot.`order_id`
		LEFT JOIN bb_product_line prod ON dd.`ProductLine` = prod.`id`
		LEFT JOIN bb_product_type protype ON dd.`ProductType` = protype.`id`
		LEFT JOIN bb_lifecycle life ON dd.`lifecycle` = life.`lifecycle`
		LEFT JOIN bb_new_engineering_req new ON new.`RequestID` = ot.`order_id`
		/*LEFT JOIN bb_predominant_make predom ON dd.`predominant_make` = predom.`make`*/			                        
		INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type $res_string";
		//WHERE ot.status IN ($tasks_status) AND ot.task_type IN ($tasks_type);
		//echo $query2;
	}

	/*************************************************************orgStatus**************************************************************/
	if(isset($_REQUEST['orgStatus'])) {
		$where = "";

		if(isset($_REQUEST['empName']) && $_REQUEST['empName'] != "") $emp_name = " AND us.`name` LIKE '%".$_REQUEST['empName']."%'";
		else $emp_name = "";

		if(isset($_REQUEST['title']) && $_REQUEST['title'] != "") $title = " AND us.`title` LIKE '%".$_REQUEST['title']."%'";
		else $title = "";

		if(isset($_REQUEST['funcManager']) && $_REQUEST['funcManager'] != "") {
			$arr_users = getUsersIdByBossId3($_REQUEST['funcManager'], "`boss_id`");
			$str_user = implode(',', $arr_users);
			if($str_user == "") $str_user = 0;
			//echo "/ ".$str_user." /";
			//$func_manager = " AND ufunc.`name` LIKE '%".$_REQUEST['funcManager']."%'";
			$func_manager = " AND us.`id` IN($str_user)";
		}
		else $func_manager = "";

		if(isset($_REQUEST['adminManager']) && $_REQUEST['adminManager'] != "") {
			$arr_users = getUsersIdByBossId3($_REQUEST['adminManager'], "`admin_manager`");
			$str_user = implode(',', $arr_users);
			if($str_user == "") $str_user = 0;
			//echo "/ ".$str_user." /";
			$admin_manager = " AND us.`id` IN($str_user)";
			//$admin_manager = " AND uad.`name` LIKE '%".$_REQUEST['adminManager']."%'";
		}
		else $admin_manager = "";

		if(isset($_REQUEST['depart']) && $_REQUEST['depart'] != "") {
			//$depart = " AND dep.`id` IN(".$_REQUEST['depart'].")";
			$arr_dep = get_child_depart($_REQUEST['depart']);
			$str_dep = implode(',', $arr_dep);
			$sign = ",";
			if($str_dep == "") {
				//$str_dep = 0;
				$sign = "";
				$str_dep = $_REQUEST['depart'];
			}
			else $str_dep .= $sign.$_REQUEST['depart'];
			$depart = " AND dep.`id` IN(".$str_dep.")";
		} 
		else $depart = "";

		if(isset($_REQUEST['active']) && $_REQUEST['active'] != "") {
			$active = " AND us.`active` IN(".$_REQUEST['active'].")";
		} 
		else $active = " AND us.`active` = 1";

		$where = "WHERE us.`department_id` != 14";
		$res_string = $where.$emp_name.$title.$func_manager.$admin_manager.$depart.$active;
		if(str_replace(" " , "", $res_string) == "WHERE") $res_string = "";
		//if(substr($res_string, -5, 5) == " AND ") $res_string = substr($res_string, 0, -5);
		if(substr($res_string, 0, 10) == "WHERE  AND") $res_string = str_replace("WHERE  AND", "WHERE", $res_string);

		$query1 = "SELECT COUNT(*) 
			FROM bb_users us
			LEFT JOIN bb_departments dep ON dep.`id` = us.`department_id`
			LEFT JOIN bb_users ufunc ON ufunc.`id` = us.`boss_id`
			LEFT JOIN bb_employment_status emp ON emp.`id` = us.`employment_status` 
			LEFT JOIN bb_users uad ON uad.`id` = us.`admin_manager` $res_string";

		$query2 = "SELECT us.`id`, us.`name`, us.`title`, ufunc.`name` AS boss_func, dep.`name` AS department, uad.`name` AS boss_ad, us.`active`, emp.`name` AS ft_pt 
			FROM bb_users us
			LEFT JOIN bb_departments dep ON dep.`id` = us.`department_id`
			LEFT JOIN bb_users ufunc ON ufunc.`id` = us.`boss_id`
			LEFT JOIN bb_employment_status emp ON emp.`id` = us.`employment_status`
			LEFT JOIN bb_users uad ON uad.`id` = us.`admin_manager` $res_string";

		//echo $query2;	
	}

/********************************************************userList****************************************************************************/
	if(isset($_REQUEST['userList'])) {
		$where = "";

		if(isset($_REQUEST['empName']) && $_REQUEST['empName'] != "") $emp_name = " AND us.`name` LIKE '%".$_REQUEST['empName']."%'";
		else $emp_name = "";

		if(isset($_REQUEST['title']) && $_REQUEST['title'] != "") $title = " AND us.`title` LIKE '%".$_REQUEST['title']."%'";
		else $title = "";

		if(isset($_REQUEST['funcManager']) && $_REQUEST['funcManager'] != "") {
			$arr_users = getUsersIdByBossId3($_REQUEST['funcManager'], "`boss_id`");
			$str_user = implode(',', $arr_users);
			if($str_user == "") $str_user = 0;
			//echo "/ ".$str_user." /";
			//$func_manager = " AND ufunc.`name` LIKE '%".$_REQUEST['funcManager']."%'";
			$func_manager = " AND us.`id` IN($str_user)";
		}
		else $func_manager = "";

		if(isset($_REQUEST['adminManager']) && $_REQUEST['adminManager'] != "") {
			$arr_users = getUsersIdByBossId3($_REQUEST['adminManager'], "`admin_manager`");
			$str_user = implode(',', $arr_users);
			if($str_user == "") $str_user = 0;
			//echo "/ ".$str_user." /";
			$admin_manager = " AND us.`id` IN($str_user)";
			//$admin_manager = " AND uad.`name` LIKE '%".$_REQUEST['adminManager']."%'";
		}
		else $admin_manager = "";

		if(isset($_REQUEST['depart']) && $_REQUEST['depart'] != "") {
			$depart = " AND dep.`id` IN(".$_REQUEST['depart'].")";
		} 
		else $depart = "";

		if(isset($_REQUEST['active']) && $_REQUEST['active'] != "") {
			$active = " AND us.`active` IN(".$_REQUEST['active'].")";
		} 
		else $active = " AND us.`active` = 1";

		if(isset($_REQUEST['roles']) && $_REQUEST['roles'] != "") {
			$roles = " AND rol.`id` IN(".$_REQUEST['roles'].")";
		} 
		else $roles = "";

		if(isset($_REQUEST['empStatus']) && $_REQUEST['empStatus'] != "") {
			$emp_status = " AND us.`employment_status` =".$_REQUEST['empStatus'];
		} 
		else $emp_status = "";

		$where = "WHERE us.`department_id` != 14";
		$res_string = $where.$emp_name.$title.$func_manager.$admin_manager.$depart.$active.$roles.$emp_status;
		if(str_replace(" " , "", $res_string) == "WHERE") $res_string = "";
		//if(substr($res_string, -5, 5) == " AND ") $res_string = substr($res_string, 0, -5);
		if(substr($res_string, 0, 10) == "WHERE  AND") $res_string = str_replace("WHERE  AND", "WHERE", $res_string);

		$query1 = "SELECT COUNT(*) 
			FROM bb_users us
			LEFT JOIN bb_departments dep ON dep.`id` = us.`department_id`
			LEFT JOIN bb_users ufunc ON ufunc.`id` = us.`boss_id`
			LEFT JOIN bb_user_roles usrol ON usrol.`user_id` = us.`id`
			LEFT JOIN bb_roles rol ON rol.`id` = usrol.`role_id`
			LEFT JOIN bb_employment_status emp ON emp.`id` = us.`employment_status` 
			LEFT JOIN bb_users uad ON uad.`id` = us.`admin_manager` $res_string";

		$query2 = "SELECT us.`id`, us.`login`, us.`name`, us.`title`, ufunc.`name` AS boss_func, dep.`name` AS department, uad.`name` AS boss_ad, us.`active`, rol.name AS roles, emp.`name` AS ft_pt 
			FROM bb_users us
			LEFT JOIN bb_departments dep ON dep.`id` = us.`department_id`
			LEFT JOIN bb_users ufunc ON ufunc.`id` = us.`boss_id`
			LEFT JOIN bb_user_roles usrol ON usrol.`user_id` = us.`id`
			LEFT JOIN bb_roles rol ON rol.`id` = usrol.`role_id`
			LEFT JOIN bb_employment_status emp ON emp.`id` = us.`employment_status`
			LEFT JOIN bb_users uad ON uad.`id` = us.`admin_manager` $res_string";

		//echo $query2;	
	}

	/**************************************************************compReport*************************************************************/
	if(isset($_REQUEST['compReport'])) {
		$where = "";

		if(isset($_REQUEST['compType']) && $_REQUEST['compType'] != "") $comp_type = "comp.`comp_type` IN (".$_REQUEST['compType'].")";
		else $comp_type = "";

		if(isset($_REQUEST['partNumb']) && $_REQUEST['partNumb'] != "") $part_numb = " AND comp.`part_number` = '".$_REQUEST['partNumb']."'";
		else $part_numb = "";

		if(isset($_REQUEST['revision']) && $_REQUEST['revision'] != "") $revision = " AND comp.`revision` = '".$_REQUEST['revision']."'";
		else $revision = "";

		if(isset($_REQUEST['status']) && $_REQUEST['status'] != "") $status = " AND comp.`comp_status` IN (".$_REQUEST['status'].")";
		else $status = "";

		if(isset($_REQUEST['createDate']) && $_REQUEST['createDate'] != "") $create_date = " AND comp.`create_date` = '".$_REQUEST['createDate']."'";
		else $create_date = "";

		if(isset($_REQUEST['lastMod']) && $_REQUEST['lastMod'] != "") $last_mod = " AND comp.`last_mod` = '".$_REQUEST['lastMod']."'";
		else $last_mod = "";

		if(isset($_REQUEST['division']) && $_REQUEST['division'] != "") $division = " AND comp.`division` IN (".$_REQUEST['division'].")";
		else $division = "";

		if(isset($_REQUEST['description']) && $_REQUEST['description'] != "") $descript = " AND comp.`description` = '".$_REQUEST['description']."'";
		else $descript = "";

		if(isset($_REQUEST['material']) && $_REQUEST['material'] != "") $material = " AND comp.`material` = '".$_REQUEST['material']."'";
		else $material = "";

		if(isset($_REQUEST['showBom']) && $_REQUEST['showBom'] != "") {
			$show_bom = "";
			$part = "";
			$group = "";
			if($_REQUEST['showBom'] === "true") {
				$show_bom = ", sku.`name` AS sku";
				$part = "LEFT JOIN bb_bom_components bomcomp ON bomcomp.`component_id` = comp.`id`
					LEFT JOIN bb_bom bom ON bom.`id` = bomcomp.bom_id
					LEFT JOIN bb_bbb_sku sku ON sku.`id` = bom.`bbb_sku_id`";
				//$group = "GROUP BY bom.bbb_sku_id";
			}
		}

		$where = "WHERE ";
		$res_string = $where.$comp_type.$part_numb.$revision.$status.$create_date.$last_mod.$division.$descript.$material;
		if(str_replace(" " , "", $res_string) == "WHERE") $res_string = "";
		if(substr($res_string, 0, 10) == "WHERE  AND") $res_string = str_replace("WHERE  AND", "WHERE", $res_string);

		$query1 = "SELECT COUNT(*)
			FROM bb_components comp
			$part $res_string";
		//echo $query1."\n";

		$query2 = "SELECT comp.`id`, comp.`comp_type`, comp.`part_number`, comp.`revision`, comp.`comp_status`, comp.`create_date`, comp.`last_mod`, comp.`division`, comp.`description`, comp.`material` $show_bom
			FROM bb_components comp
			$part $res_string";

		//echo $query2;
	}

/******************************************************обработка всех запросов**************************************************************/
	$total = 0;
	if($stmt = $db->prepare($query1)){
		if($stmt->execute()){
			$stmt->bind_result($total);
			$stmt->fetch();	
			$stmt->close();
		}
	}

	if(!$stmt = $db->query($query2)){
		echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
	}
	else {
		for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);) {
			$result[] = $tmp;
		}
		$stmt->close();
		echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
	}

