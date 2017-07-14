<?php
    session_start();
    header('Content-Type: application/json; charset=utf-8');
    //header('Content-Type: text/plain; charset=utf-8');
	error_reporting(0);

	
	if(!isset($_SESSION['id'])){
		die('{"success":false,"message":""}');
	}
	
	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];
	

	include_once "../settings.php";
	include "../logger.php";
	
	include 'function.php';

	include '../mpdf60/mpdf.php';
	
	if(isset($_GET['func'])){
	
		$table = $_REQUEST['func'];
		$i=0;
		$sort = $_REQUEST['sort'];
		$dir = $_REQUEST['dir'];
		$start = isset($_REQUEST['start']) ? $_REQUEST['start']  :  0;
		$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit']  : 50;
		$filters = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : null;

		
if (is_array($filters)) {
    $encoded = false;
} else {
    $encoded = true;
    $filters = json_decode($filters);
}

$where = '';

switch ($table) 
				{
					case 'product_design':
						$query1 = "SELECT COUNT(d.`idx`)
FROM `bb_product_design` d
INNER JOIN `bb_product_design_component` c ON c.`idx` = d.`idx`
INNER JOIN `bb_product_design_attribute` a ON a.`idc` = c.`id` WHERE d.`deleted` = 0;";
						$query2 = "SELECT d.`idx`,c.`Component`,a.`AttributeName`,a.`AttributeValue`,c.`images`
FROM `bb_product_design` d
INNER JOIN `bb_product_design_component` c ON c.`idx` = d.`idx`
INNER JOIN `bb_product_design_attribute` a ON a.`idc` = c.`id` WHERE d.`deleted` = 0 ORDER BY d.".$sort." ".$dir." LIMIT ".$start.",".$limit.";";
					break;
					
					case 'teardown_request':
						$query1 = "SELECT COUNT(r.`idx`) FROM `bb_teardown_request` r
INNER JOIN `bb_users` u ON u.`id` = r.`id_user`";
						$query2 = "SELECT r.`idx`, r.`name`, r.`datetime`,u.`name` AS `user` FROM `bb_teardown_request` r
INNER JOIN `bb_users` u ON u.`id` = r.`id_user` ORDER BY r.".$sort." ".$dir." LIMIT ".$start.",".$limit.";";
					break;
					
					case 'feasibility':
						$query1 = "SELECT COUNT(f.`idx`) FROM `bb_feasibility` f
INNER JOIN `bb_feasibility_component` fc ON f.`idx` = fc.`idx`
INNER JOIN `bb_users` u ON u.`id` = f.`id_user`";
						$query2 = "SELECT f.`idx`,f.`product_type`,f.`datetime`,fc.`PartDescription`,u.`name` AS user FROM `bb_feasibility` f
INNER JOIN `bb_feasibility_component` fc ON f.`idx` = fc.`idx`
INNER JOIN `bb_users` u ON u.`id` = f.`id_user` ORDER BY f.".$sort." ".$dir." LIMIT ".$start.",".$limit.";";
					break;
					case 'getCountTask':
						$count_new = 0;
						$count_inQue = 0;
						$count_inPr = 0;
						$count_overdue = 0;
						$status_new = 1;
						$status_inQue = 6;
						$status_inPr = 2;
						$status_overdue = 5;
						$query = "SELECT COUNT(t.`task_id`), status FROM `bb_order_tasks` t
								 INNER JOIN `bb_tasks_type` tt ON tt.`id` = t.`task_type`
								 WHERE (assignee IN ($id_user) OR assigned_by IN ($id_user))
								 GROUP BY status ";	 
						 if ($stmt = $db->prepare($query)){
					        $stmt->execute();
					        $stmt->bind_result($count, $status_task);
					        while ( $stmt->fetch()){
					            if($status_task == $status_new){
					                $count_new = $count;
					            }
					            if($status_task == $status_inQue){
					                $count_inQue = $count;
					            }
					            if($status_task == $status_inPr){
					                $count_inPr = $count;
					            }
					            if($status_task == $status_overdue){
					                $count_overdue = $count;
					            }
					        }
					        $stmt->close();
					     }
					     $result = array('success'=>true, 'count_new'=>$count_new, 'count_inQue'=>$count_inQue, 'count_inPr'=>$count_inPr, 'count_overdue'=>  $count_overdue);   
					     echo json_encode($result);
					     exit;    		 
					break;
					
					case 'tasks':
						$arrUsers = array();
			
						array_push($arrUsers, $id_user);

						getUsersId($arrUsers);

						$str_id_users = implode(",", $arrUsers);

						//echo "$str_id_users";
						//var_dump($arrUsers);



						$query1 = "SELECT COUNT(t.`task_id`) FROM `bb_tasks` t
									INNER JOIN `bb_tasks_type` tt ON tt.`id` = t.`task_type`
									INNER JOIN `bb_users` u ON u.`id` = t.`last_changed_by`
									WHERE t.`id_user` IN ($str_id_users);";

						$query2 = "SELECT 
										t.`task_id`,
										tt.`tasks_type`,
										t.`current_status`,
										t.`last_changed`,
										u.`name` AS `last_changed_by` 
									FROM `bb_tasks` t
									INNER JOIN `bb_tasks_type` tt ON tt.`id` = t.`task_type`
									INNER JOIN `bb_users` u ON u.`id` = t.`last_changed_by` WHERE t.`id_user` IN ($str_id_users) ORDER BY t.".$sort." ".$dir." LIMIT ".$start.",".$limit.";";

					break;
					/**************************************************************************************************************************/
					case 'workflow_bbb_sku':
					$bbb_sku = $_REQUEST['bbb_sku'];
					if(isset($bbb_sku)) {
							$query1="SELECT COUNT(*)
							FROM bb_order_tasks ot
							LEFT JOIN bb_users u ON assignee = u.id
							LEFT JOIN bb_users us ON assigned_by = us.id
							LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
							/*LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`*/
							/*INNER JOIN bb_departments d ON u.department_id = d.id*/
							INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
							WHERE bbb_sku_id = $bbb_sku";
							
							$query2 = "SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee , us.name AS assigned_by, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS STATUS
							FROM bb_order_tasks ot
						   LEFT JOIN bb_users u ON assignee = u.id
						   LEFT JOIN bb_users us ON assigned_by = us.id
						   LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
						   LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
						   LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`                           
						   INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
						   WHERE bbb_sku_id = $bbb_sku";
						}
					break;
					case 'workflow':
                     	$add_terms = null;
					    $user = $id_user;
					    $arr_users = getUsersIdByBossId2($user);
						$arr_users[]=$user;
						$str_user = implode(',', $arr_users);
						
                       if(isset($_REQUEST['search'])) {
                            $term = $_REQUEST['search'];
                            $add_terms = " AND (u.name LIKE '%$term%' OR us.name LIKE '%$term%' OR 
                                    ot.`order_id` LIKE '%$term%' OR bs.`name` LIKE '%$term%' OR 
                                    tt.`tasks_type` LIKE '%$term%' OR DATE(ot.`requested_date`) LIKE '%$term%' OR DATE(ot.`assignment_date`) LIKE '%$term%' OR DATE(ot.`due_date`) LIKE '%$term%' OR DATE(ot.`completion_date`) LIKE '%$term%' OR DATE(ot.`new_due_date`) LIKE '%$term%')";
                        }
					
						$status = $_REQUEST['status'];

						if ($status == 'my_tasks'){

						if (isset($_REQUEST['my_task_status']) && $_REQUEST['my_task_status']){
								$my_task_status = $_REQUEST['my_task_status'];
								$AND = " AND ot.status =".$my_task_status;
							}else{
								$AND = " AND ot.status  NOT IN (4)";
							}
							$WHERE = " (assignee IN ($id_user) OR assigned_by IN ($id_user)) ".$AND;
						}else{
							$WHERE = " status =$status AND (assignee IN ($str_user) OR assigned_by IN ($str_user, 0) OR assigned_by IS NULL) ";
						}
						$query1="SELECT COUNT(*)
									FROM bb_order_tasks ot
			                        LEFT JOIN bb_users u ON assignee = u.id
			                        LEFT JOIN bb_users us ON assigned_by = us.id
			                        LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
			                        INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
			                        WHERE ". $WHERE . $add_terms;

						$query2="SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS STATUS
									FROM bb_order_tasks ot
			                        LEFT JOIN bb_users u ON assignee = u.id
			                        LEFT JOIN bb_users us ON assigned_by = us.id
			                        LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
			                        LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
			                        LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`			                        
			                        INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
			                        WHERE  ". $WHERE .$add_terms;
					break;	
					case "get_all_tasks":
						if(isset($_REQUEST['search'])) {
                            $term = $_REQUEST['search'];
                            $add_terms = "AND (u.name LIKE '%$term%' OR us.name LIKE '%$term%' OR 
                                    ot.`order_id` LIKE '%$term%' OR 
                                    tt.`tasks_type` LIKE '%$term%' OR bs.`name` LIKE '%$term%' OR DATE(ot.`requested_date`) LIKE '%$term%' OR DATE(ot.`assignment_date`) LIKE '%$term%' OR DATE(ot.`due_date`) LIKE '%$term%' OR DATE(ot.`completion_date`) LIKE '%$term%' OR DATE(ot.`new_due_date`) LIKE '%$term%')"; //OR bs.`name` LIKE '%$term%'
                        }

                        if (isset($_REQUEST['my_task_status'])) {
                        	$my_task_status = " IN (".$_REQUEST['my_task_status'].") ";
                        }
                        else $my_task_status = " IN (1,2,4,5,6) ";

						$query1="SELECT COUNT(*)
						FROM bb_order_tasks ot
						LEFT JOIN bb_users u ON assignee = u.id
						LEFT JOIN bb_users us ON assigned_by = us.id
						LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
						LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
						LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`
						INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
						WHERE ot.status $my_task_status $add_terms";

						$query2 = "SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS STATUS
						FROM bb_order_tasks ot
						LEFT JOIN bb_users u ON assignee = u.id
						LEFT JOIN bb_users us ON assigned_by = us.id
						LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
						LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
						LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`			                        
						INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
						WHERE ot.status $my_task_status $add_terms LIMIT ".$start.",".$limit;
					break;			
					/***************************************************************************************************************************/
					/**********************************COMPONENT PART NUMBER****************************************************************/
					case 'comp_part_number':
						if(isset($_REQUEST['filter'])){
							$filter = " (".$_REQUEST['filter'].") ";
						}
						else {
							$filter = " (1,2,3,4) ";
						}

						if(isset($_REQUEST['search']) && $_REQUEST['search']!="") {
							$query2="SELECT `id`, `finish_good`, `comp_type`, `part_number`, `description`, `revision`, `image1`, `create_date`  FROM `bb_components` WHERE `description` LIKE '%".$_REQUEST['search']."%' OR `part_number` LIKE '%".$_REQUEST['search']."%' AND `comp_type` IN ".$filter." ORDER BY `id` ASC LIMIT ".$start.",".$limit;
							$query1="SELECT COUNT(*) FROM `bb_components` WHERE `description` LIKE '%".$_REQUEST['search']."%' OR `part_number` LIKE '%".$_REQUEST['search']."%' AND `comp_type` IN ".$filter;
						}
						else {
							$query2="SELECT `id`, `finish_good`, `comp_type`, `part_number`, `description`, `revision`, `image1`, `create_date`  FROM `bb_components` WHERE `comp_type` IN ".$filter." LIMIT ".$start.",".$limit;
							$query1="SELECT COUNT(*) FROM `bb_components` WHERE `comp_type` IN ".$filter;
						}
					break;
					case 'test_procedure':
						$filter = $_REQUEST['filter'];
						$query1="SELECT COUNT(*) FROM bb_test_procedure";
						if(trim($filter)) $filterParam = "AND (`test_procedure` LIKE '%".$filter."%' OR `spec_conditions` LIKE '%".$filter."%' OR `description` LIKE '%".$filter."%' OR `instruction` LIKE '%".$filter."%')";
						$query2="SELECT `id`, `test_procedure`, `spec_conditions`, `description`, `instruction` FROM bb_test_procedure WHERE `deleted` = 0 ".$filterParam.";";
					break;
					case 'tool_gage':
						$filter = "";
						if(isset($_REQUEST['search']) && trim($_REQUEST['search'])!="") {
							$filter .= "AND (`name` LIKE '%".$_REQUEST['search']."%' OR `description` LIKE '%".$_REQUEST['search']."%')";
						}

						$query1="SELECT COUNT(*) FROM bb_tool_gage WHERE `deleted` = 0 ".$filter."";
						$query2="SELECT `id`, `tool_gage_type`, `name`, `description`,`drawing2d`, `number` FROM `bb_tool_gage` WHERE `deleted` = 0 ".$filter."";
					break;
					case 'equip':
						$filter = "";
						if(isset($_REQUEST['search']) && trim($_REQUEST['search'])!="") {
							$filter .= "AND (`name` LIKE '%".$_REQUEST['search']."%' OR `description` LIKE '%".$_REQUEST['search']."%')";
						}

						$query1="SELECT COUNT(*) FROM bb_equipment WHERE `deleted` = 0 ".$filter."";
						$query2="SELECT `id`, `name`, `description`,`drawing2d`, `number` FROM `bb_equipment` WHERE `deleted` = 0 ".$filter."";
					break;
					case 'work_st':
						$filter = "";
						if(isset($_REQUEST['search']) && trim($_REQUEST['search'])!="") {
							$filter .= "AND (`name` LIKE '%".$_REQUEST['search']."%' OR `description` LIKE '%".$_REQUEST['search']."%')";
						}

						$query1="SELECT COUNT(*) FROM bb_workstation WHERE `deleted` = 0 ".$filter."";
						$query2="SELECT `id`, `name`, `description`,`drawing2d`, `number` FROM `bb_workstation` WHERE `deleted` = 0 ".$filter."";
					break;
					case 'operation_data':
						$filter = "";
						if(isset($_REQUEST['search']) && trim($_REQUEST['search'])!="") {
							$filter .= "AND (`id` LIKE '%".$_REQUEST['search']."%' OR `operation_procedure` LIKE '%".$_REQUEST['search']."%' OR `descriptionOperation` LIKE '%".$_REQUEST['search']."%')";
						}

						$query1="SELECT COUNT(*) FROM `bb_operations` WHERE `deleted` = 0 ".$filter."";
						$query2="SELECT `id`, `operation_procedure`, `descriptionOperation`, `number` FROM `bb_operations` WHERE `deleted` = 0 ".$filter."";
					break;
					case 'pack':
						$filter = "";
						if(isset($_REQUEST['search']) && trim($_REQUEST['search'])!="") {
							$filter .= "AND (`name` LIKE '%".$_REQUEST['search']."%' OR `description` LIKE '%".$_REQUEST['search']."%')";
						}

						$query1="SELECT COUNT(*) FROM `bb_pack_requirement` WHERE `deleted` = 0 ".$filter."";
						$query2="SELECT `id`, `name`, `description`, `number` FROM `bb_pack_requirement` WHERE `deleted` = 0 ".$filter."";
					break;
					/****************************************************************************************************************************/
					case 'bom':
						if(isset($_REQUEST['search']) && $_REQUEST['search']!="") {
							$query2="SELECT bs.`id`, bs.`name` AS bbb_sku, pl.`name` AS product_line, pt.`name` AS product_type, `sku_status`, b.`revision` AS `bom_revision`, b.`last_mod`  
										FROM bb_bbb_sku bs
										INNER JOIN bb_bom b ON `bbb_sku_id` = bs.`id`
										INNER JOIN bb_product_line pl ON pl.`id` = `ProductLine`
										INNER JOIN bb_product_type pt ON pt.`id` = `ProductType`
										GROUP BY `bbb_sku_id` 
										HAVING `product_line` LIKE '%".$_REQUEST['search']."%' OR `bbb_sku` LIKE '%".$_REQUEST['search']."%'
										ORDER BY `id` ASC";
							$query1="SELECT COUNT(*) FROM bb_bom b
										INNER JOIN bb_bbb_sku bs ON b.`bbb_sku_id` = bs.`id`
										INNER JOIN bb_product_line pl ON pl.`id` = bs.`ProductLine`
										INNER JOIN bb_product_type pt ON pt.`id` = bs.`ProductType`
										WHERE b.`create_date` IN (SELECT MAX(`create_date`) FROM `bb_bom` GROUP BY `bbb_sku_id`)
										HAVING `product_line` LIKE '%".$_REQUEST['search']."%' OR `bbb_sku` LIKE '%".$_REQUEST['search']."%'
										ORDER BY `id` ASC";
						}
						else {
							$query2="SELECT bs.`id`, bs.`name` AS bbb_sku, pl.`name` AS product_line, pt.`name` AS product_type, `sku_status`, b.`revision` AS `bom_revision`, b.`last_mod`  
										FROM bb_bbb_sku bs
										INNER JOIN bb_bom b ON `bbb_sku_id` = bs.`id`
										INNER JOIN bb_product_line pl ON pl.`id` = `ProductLine`
										INNER JOIN bb_product_type pt ON pt.`id` = `ProductType`
										GROUP BY `bbb_sku_id`";

							$query1="SELECT COUNT(*) FROM bb_bom b
										INNER JOIN bb_bbb_sku bs ON b.`bbb_sku_id` = bs.`id`
										INNER JOIN bb_product_line pl ON pl.`id` = bs.`ProductLine`
										INNER JOIN bb_product_type pt ON pt.`id` = bs.`ProductType`
										WHERE b.`create_date` IN (SELECT MAX(`create_date`) FROM `bb_bom` GROUP BY `bbb_sku_id`)";
							}
					break;
					case 'locations':
						$filter = $_REQUEST['filter'];
						$query1="SELECT COUNT(*) FROM bb_locations WHERE `deleted` = 0";
						if(trim($filter)) $filterParam = "AND (`Name` LIKE '%".$filter."%' OR `Address` LIKE '%".$filter."%' OR `ContactPerson` LIKE '%".$filter."%' OR `Description` LIKE '%".$filter."%')";
						$query2="SELECT `id`, `Name`, `Address`, `Description`, `ContactPerson` FROM bb_locations WHERE `deleted` = 0 ".$filterParam.";";
					break;
					case 'rights':
						$filter = $_REQUEST['filter'];
						$query1="SELECT COUNT(*) FROM bb_rights";
						if(trim($filter)) $filterParam = "AND (`right_name` LIKE '%".$filter."%' OR `description` LIKE '%".$filter."%')";
						$query2="SELECT `id`, `right_name`, `description` FROM bb_rights WHERE `deleted` = 0 ".$filterParam.";";
					break;
					case "bom_pdf":
						if (isset($_REQUEST['dataForPdf'])) $data_json_pdf = stripslashes($_REQUEST['dataForPdf']);
						$decode_for_pdf = json_decode($data_json_pdf);
						$i = 0;
						function image_format($el) {
							$img;
							if($el) {
								$exp_format = explode('.', $el);
								if ($exp_format[1] == "png") $img = "<img src='data:image/png;base64,".mb_convert_encoding(base64_encode(file_get_contents('../img/components/' . $el)), 'UTF-8')."'>";
								elseif($exp_format[1] == "jpg") $img = "<img src='data:image/jpg;base64,".mb_convert_encoding(base64_encode(file_get_contents('../img/components/' . $el)), 'UTF-8')."'>";
								elseif($exp_format[1] == "gif") $img = "<img src='data:image/gif;base64,".mb_convert_encoding(base64_encode(file_get_contents('../img/components/' . $el)), 'UTF-8')."'>";
								else $img = "";
							}
							else $img = "";

							return $img;
						}

						foreach ($decode_for_pdf as $key => $value) {
							$decode_for_pdf[$key] = (array)$decode_for_pdf[$key];
							$bom = $decode_for_pdf[$key]['bbbSkuBom'];
							$prodType = $decode_for_pdf[$key]['prodType'];
							$prodLine = $decode_for_pdf[$key]['prodLine'];
						}
						$html = "
							<style type='text/css'>
								.tg  {border-collapse:collapse;border-spacing:0;}
								.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
								.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
								.tg .tg-yw4l{vertical-align:center}
								span {font-weight: normal}
							</style>

							<h3>BBB SKU#: <span>$bom</span></h3>
							<h3>Product type: <span>$prodType</span></h3>
							<h3>Product line: <span>$prodLine</span></h3>
							<hr>
							<br><br><br>
							<h3>Components:</h3>

							<table class='tg'>
								<tr>
									<td class='tg-yw4l'>№</td>
									<td class='tg-yw4l'>Description</td>
									<td class='tg-yw4l'>Revision</td>
									<td class='tg-yw4l'>QTY</td>
									<!--td class='tg-yw4l'>Image</td>
									<td class='tg-yw4l'>2D drawning</td>
									<td class='tg-yw4l'>3D model</td-->
									<td class='tg-yw4l'>In-Hosue</td>
									<td class='tg-yw4l'>Out Source</td>
									<td class='tg-yw4l'>Reuse from Core</td>
									<!--td class='tg-yw4l'>Additional Specification</td-->
									<td class='tg-yw4l'>PPAP sample size</td>
									<td class='tg-yw4l'>PPAP Results</td>
								</tr>";

						foreach ($decode_for_pdf as $key => $value) {
							$decode_for_pdf[$key] = (array)$decode_for_pdf[$key];
							$description = $decode_for_pdf[$key]['description'];
							$revision = $decode_for_pdf[$key]['revision'];
							$qty = $decode_for_pdf[$key]['qty'];

							/*$image = $decode_for_pdf[$key]['image1'];
							$img = image_format($image);

							$draw_2d = $decode_for_pdf[$key]['drawing2d'];
							$img_2d = image_format($draw_2d);

							$draw_3d = $decode_for_pdf[$key]['drawing3d'];
							$img_3d = image_format($draw_3d);*/
							
							$in_house = $decode_for_pdf[$key]['in_house'];
							if($in_house != "") $in_house = "+";

							$out_source = $decode_for_pdf[$key]['out_source'];
							if($out_source != "") $out_source = "+";

							$reuse_from_core = $decode_for_pdf[$key]['reuse_from_core'];
							if($reuse_from_core != "") $reuse_from_core = "+";

							/*$additional_specification = $decode_for_pdf[$key]['add_spec'];
							if($additional_specification) {
								$additional_specification_link_show = "<a href='../files/docs/".$additional_specification."' target='_blank'>open file</a>";
								$additional_specification_link_download = "<a href='datastore.php?file=../files/docs/".$additional_specification."'>download file</a>";
							}
							else {
								$additional_specification_link_show = '';
								$additional_specification_link_download = '';
							}*/

							$ppap_sample_size = $decode_for_pdf[$key]['ppap'];

							$ppap_result = $decode_for_pdf[$key]['ppap_result'];
							if($ppap_result == 0) $ppap_result = "approved";
							else if($ppap_result == 1) $ppap_result = "rejected";
							else $ppap_result = "in progress";

							$i++;
							$html .= "
								<tr>
									<td>$i</td>
									<td>$description</td>
									<td>$revision</td>
									<td>$qty</td>
									<!--td>$img</td>
									<td>$img_2d</td>
									<td>$img_3d</td-->
									<td>$in_house</td>
									<td>$out_source</td>
									<td>$reuse_from_core</td>
									<!--td>$additional_specification_link_show<br>$additional_specification_link_download</td-->
									<td>$ppap_sample_size</td>
									<td>$ppap_result</td>
								</tr>";
						}
						$html .= "</table><br><br><h3>Images:</h3>";

						$i = 0;
						foreach ($decode_for_pdf as $key => $value) {
							$decode_for_pdf[$key] = (array)$decode_for_pdf[$key];

							$image = $decode_for_pdf[$key]['image1'];
							if($image) $img = image_format($image);
							else $img = "<span style='color: red'>no images</span>";

							$draw_2d = $decode_for_pdf[$key]['drawing2d'];
							if($draw_2d) $img_2d = image_format($draw_2d);
							else $img_2d = "<span style='color: red'>no images</span>";

							$draw_3d = $decode_for_pdf[$key]['drawing3d'];
							if($draw_3d) $img_3d = image_format($draw_3d);
							else $img_3d = "<span style='color: red'>no images</span>";

							$i++;
							$html .= "<p style='color: blue;'>Component № $i</p><p>Image</p>$img<br><p>Drawing 2d</p>$img_2d<br><p>Drawing 3d</p>$img_3d<hr style='color: green'><br><br>";
						}

						//echo $html;	
						$mpdf = new mPDF('utf-8', 'A4', '', '', 5, 5, 5, 5, '', '');
						//$mpdf-> showImageErrors = true;
						$mpdf -> useOnlyCoreFonts = true;
						$mpdf -> SetDisplayMode('fullpage');
						$mpdf -> WriteHTML($html);

						$mpdf -> Output('../files/pdf/bom.pdf', 'F');

						echo '{"success":true,"message":""}';
						exit;
					break;
					default:
						$query1 = "SELECT count(id) FROM `".$DB_PREFIX."".$table."`;";
						$query2 = "SELECT * FROM `".$DB_PREFIX."".$table."` ".$where." ORDER BY ".$sort." ".$dir." LIMIT ".$start.",".$limit.";";
				}
		

				em_writeLog($query1, 'datastore');
		if($stmt = $db->prepare($query1)){
		if($stmt->execute()){
			$stmt->bind_result($total);
			$stmt->fetch();	
			$stmt->close();
		}}

        em_writeLog($query2, 'datastore');
		if(!$stmt = $db->query($query2)){
			echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
		}else{
			for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);)
			{
				switch ($table) 
				{
					case 'part':
						$tmp['PDF'] = '<a href="files/pdf/'.$tmp['PDF'].'" target="_blank" >'.$tmp['PDF'].'</a>';
						$tmp['ImageFileName'] = '<a href="files/images/'.$tmp['ImageFileName'].'" target="_blank" >'.$tmp['ImageFileName'].'</a>';
					break;
					case 'product_design':
						$tmp['images'] = '<a href="mobile/files/images/'.$tmp['images'].'" target="_blank" >'.$tmp['images'].'</a>';
						
					break;
				}
				$result[] = $tmp;
			}
			$stmt->close();
			echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
		}
		
		$db->close();
		exit;
	}

/**********************************сохранение файла спецификации***************************************************/
	$file = $_REQUEST['file'];
	header("Content-type: application/x-download");
	header('Content-Disposition: attachment; filename='.basename($file));
	header('Content-Transfer-Encoding: binary');
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	header('Content-Length: ' . filesize($file));
	readfile($file);
	//exit;
	
/*********************************сохранение пдф****************************************************************/	
	if ($_GET['download'] == 'SaveBomPDF')
	{
	    SaveFile();
	}

	function SaveFile()
	{
	    $File = ('../files/pdf/bom.pdf');
	    if (file_exists($File)) 
	    {
	        header('Content-Description: File Transfer');
	        header('Content-Type: application/octet-stream');
	        header('Content-Disposition: attachment; filename='.basename($File));
	        header('Content-Transfer-Encoding: binary');
	        header('Expires: 0');
	        header('Cache-Control: must-revalidate');
	        header('Pragma: public');
	        header('Content-Length: ' . filesize($File));
	        ob_clean();
	        flush();
	        readfile($File);
	        exit;
	    }
	}
?>
