<?php
	include "../../settings.php";

	/**************************************************orgStatus************************************************************************/
	function export_org_status($data, $sheet_header, $title, $file_name, $rep_date, $head_count){
		require_once '../../import/PHPExcel-1.8/Classes/PHPExcel.php';
		$cell_lit = array("A", "B", "C", "D","E", "F","G", "H","I", "J","K", "L","M", "N","O", "P", "R","S", "T","U", "V","W", "X","Y", "Z");
		$phpexcel = new PHPExcel();
		$page = $phpexcel->setActiveSheetIndex(0);
		$order_arr = array();

		$styleArray = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
					)
				)
			);

		$column_width = array('name'=>30, 'title'=>40, 'boss_func'=>30, 'department'=>30, 'boss_ad'=>30, 'ft_pt'=>15, 'active'=>20);

		$k=0;
		foreach ($sheet_header as $key => $value) {
			$page->setCellValue($cell_lit[$k]."1", $value);
			$page->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
			$page->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('00BFFF');
			$page->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
			$page->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$page->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
			$page->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
			$order_arr[$key] = $cell_lit[$k];
			$k++;
		}
		//var_dump($data);
		for($i=0; $i<count($data); $i++){
			$ind=$i+2;
			foreach($data[$i] as $key => $value) {
				if(isset($order_arr[$key])){
					$page->setCellValue($order_arr[$key].$ind, $value);
					$page->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
					//$ind_next = $ind+1;
					$page->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
				}
			}
		}

		$page->setTitle($title);
		$page->insertNewRowBefore(1, 6);
		$page->setCellValueByColumnAndRow(0, 1, "Report name:");
		$page->setCellValueByColumnAndRow(0, 2, "Report date:");
		$page->setCellValueByColumnAndRow(0, 3, "Total Headcount:");

		$page->setCellValueByColumnAndRow(1, 1, "Org. status");
		$page->setCellValueByColumnAndRow(1, 2, $rep_date);
		$page->setCellValueByColumnAndRow(1, 3, $head_count);
		$page->getStyle('B3')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

		$url = "../../img/logo.png";
		$logo = new PHPExcel_Worksheet_Drawing();
		$logo->setPath($url);
		$logo->setWorksheet($page);
		$logo->setCoordinates("D1");

		$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
		$objWriter->save($file_name.".xlsx");
	}

	if(isset($_REQUEST['exportOrg'])){
		if(isset($_REQUEST['dataStore']) && $_REQUEST['dataStore'] != "") $data_store = json_decode(stripcslashes($_REQUEST['dataStore']));
		else {
	    	echo "Not value!";
	    	exit;
	    }
	    $i = 0;
	    foreach ($data_store as $key => $value) {
	    	$data_prev['id'] = $data_store[$i]->id;
	    	$data_prev['name'] = $data_store[$i]->name;
	    	$data_prev['title'] = $data_store[$i]->title;
	    	$data_prev['boss_func'] = $data_store[$i]->boss_func;
	    	$data_prev['department'] = $data_store[$i]->department;
	    	$data_prev['boss_ad'] = $data_store[$i]->boss_ad;
	    	$data_prev['ft_pt'] = $data_store[$i]->ft_pt;
	    	$data_prev['active'] = $data_store[$i]->active;
	    	if($data_prev['active'] == 0) $data_prev['active'] = "Inactive";
	    	else $data_prev['active'] = "Active";
	    	$data[] = $data_prev;
	    	$i++;
	    }
	    $sheet_header = array('name'=>'Employee Name/MPR', 'title'=>'Title', 'boss_func'=>'Functional Manager', 'boss_ad'=>'Administrative Manager', 'department'=>'Department', 'ft_pt'=>'Status FT/PT', 'active'=>'Active/Inactive');
	    $file_name = "Org. Status";
	    export_org_status($data, $sheet_header, 'Org. Status', $file_name, date("Y-m-d H:i:s"), count($data));
	    echo  json_encode(array('success'=>true)); 
	    exit;
	}
	if(isset($_REQUEST['downloadOrg'])){
  		$File = "Org. Status.xlsx";
  		if (file_exists($File)) {
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
  		}
  		exit;
  	}

  	/****************************************************************userList**********************************************************************/
  	function export_user_list($data, $sheet_header, $title, $file_name, $rep_date, $head_count){
		require_once '../../import/PHPExcel-1.8/Classes/PHPExcel.php';
		$cell_lit = array("A", "B", "C", "D","E", "F","G", "H","I", "J","K", "L","M", "N","O", "P", "R","S", "T","U", "V","W", "X","Y", "Z");
		$phpexcel = new PHPExcel();
		$page = $phpexcel->setActiveSheetIndex(0);
		$order_arr = array();

		$styleArray = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
					)
				)
			);

		$column_width = array('name'=>30, 'login'=>30, 'title'=>40, 'boss_func'=>30, 'department'=>30, 'boss_ad'=>30, 'ft_pt'=>15, 'active'=>20, 'roles'=>30);

		$k=0;
		foreach ($sheet_header as $key => $value) {
			$page->setCellValue($cell_lit[$k]."1", $value);
			$page->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
			$page->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('00BFFF');
			$page->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
			$page->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$page->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
			$page->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
			$order_arr[$key] = $cell_lit[$k];
			$k++;
		}
		for($i=0; $i<count($data); $i++){
			$ind=$i+2;
			foreach($data[$i] as $key => $value) {
				if(isset($order_arr[$key])){
					$page->setCellValue($order_arr[$key].$ind, $value);
					$page->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
					//$ind_next = $ind+1;
					$page->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
				}
			}
		}

		$page->setTitle($title);
		$page->insertNewRowBefore(1, 6);
		$page->setCellValueByColumnAndRow(0, 1, "Report name:");
		$page->setCellValueByColumnAndRow(0, 2, "Report date:");
		$page->setCellValueByColumnAndRow(0, 3, "Total Headcount:");

		$page->setCellValueByColumnAndRow(1, 1, "User list");
		$page->setCellValueByColumnAndRow(1, 2, $rep_date);
		$page->setCellValueByColumnAndRow(1, 3, $head_count);
		$page->getStyle('B3')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

		$url = "../../img/logo.png";
		$logo = new PHPExcel_Worksheet_Drawing();
		$logo->setPath($url);
		$logo->setWorksheet($page);
		$logo->setCoordinates("D1");

		$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
		$objWriter->save("../../files/docs/".$file_name.".xlsx");
	}

	if(isset($_REQUEST['exportUserList'])){
		$data_user;
	    if(isset($_REQUEST['dataUserList']) && $_REQUEST['dataUserList'] != "") $data_user = json_decode(stripcslashes($_REQUEST['dataUserList']));
	    else {
	    	echo "Not value!";
	    	exit;
	    }
	    $i = 0;
	    foreach ($data_user as $key => $value) {
	    	$data_prev['id'] = $data_user[$i]->id;
	    	$data_prev['login'] = $data_user[$i]->login;
	    	$data_prev['name'] = $data_user[$i]->name;
	    	$data_prev['title'] = $data_user[$i]->title;
	    	$data_prev['roles'] = $data_user[$i]->roles;
	    	$data_prev['boss_func'] = $data_user[$i]->boss_func;
	    	$data_prev['department'] = $data_user[$i]->department;
	    	$data_prev['boss_ad'] = $data_user[$i]->boss_ad;
	    	$data_prev['ft_pt'] = $data_user[$i]->ft_pt;
	    	$data_prev['active'] = $data_user[$i]->active;
	    	if($data_prev['active'] == 0) $data_prev['active'] = "Inactive";
	    	else $data_prev['active'] = "Active";
	    	$data[] = $data_prev;
	    	$i++;
	    }
	    $sheet_header = array('login'=>'Login','name'=>'Employee Name/MPR', 'title'=>'Title', 'roles'=>'Roles', 'boss_func'=>'Functional Manager', 'boss_ad'=>'Administrative Manager', 'department'=>'Department', 'ft_pt'=>'Status FT/PT', 'active'=>'Active/Inactive');
	    $file_name = "User list";
	    export_user_list($data, $sheet_header, 'User list', $file_name, date("Y-m-d H:i:s"), count($data));
	    echo  json_encode(array('success'=>true)); 
	    exit;
	}
	if(isset($_REQUEST['downloadUserList'])){
  		$File = "../../files/docs/User list.xlsx";
  		if (file_exists($File)) {
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
  		}
  		exit;
  	}

  	/*************************************************************managerReport*************************************************************/
  	function export_manager($data, $sheet_header, $title, $file_name){
		require_once '../../import/PHPExcel-1.8/Classes/PHPExcel.php';
		$cell_lit = array("A", "B", "C", "D","E", "F","G", "H","I", "J","K", "L","M", "N","O", "P","Q", "R","S", "T","U", "V","W", "X","Y", "Z");
		$phpexcel = new PHPExcel();
		$page = $phpexcel->setActiveSheetIndex(0);
		$order_arr = array();

		$styleArray = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
					)
				)
			);

		$column_width = array('tasks_type'=>30, 'bbb_sku'=>30, 'request_id'=>40, 'STATUS'=>30, 'assigned_by'=>30, 'assignee'=>30, 'requested_date'=>15, 'assignment_date'=>20, 'due_date'=>30, 'completion_date'=>30, 'new_due_date'=>30, 'prod_line_name'=>30, 'prod_type_name'=>30, 'first_year_demand'=>30, 'Annualdemand'=>30, 'est_annual_revenue'=>30, 'lifecycle'=>30, 'predominant_make'=>30, 'veh_in_operation'=>30, 'PriorityLevel'=>30, 'ERPOrderID'=>30);

		$k=0;
		foreach ($sheet_header as $key => $value) {
			$page->setCellValue($cell_lit[$k]."1", $value);
			$page->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
			$page->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('00BFFF');
			$page->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
			$page->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$page->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
			$page->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
			$order_arr[$key] = $cell_lit[$k];
			$k++;
		}
		for($i=0; $i<count($data); $i++){
			$ind=$i+2;
			foreach($data[$i] as $key => $value) {
				if(isset($order_arr[$key])){
					$page->setCellValue($order_arr[$key].$ind, $value);
					$page->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
					//$ind_next = $ind+1;
					$page->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
				}
			}
		}

		$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
		$objWriter->save("../../files/docs/".$file_name.".xlsx");
	}

	if(isset($_REQUEST['exportManager'])){
		$data_user;
	    if(isset($_REQUEST['dataStoreManager']) && $_REQUEST['dataStoreManager'] != "") $data_manager = json_decode(stripcslashes($_REQUEST['dataStoreManager']));
	    else {
	    	echo "Not value!";
	    	exit;
	    }
	    $i = 0;
	    foreach ($data_manager as $key => $value) {
	    	$data_prev['tasks_type'] = $data_manager[$i]->tasks_type;
	    	$data_prev['bbb_sku'] = $data_manager[$i]->bbb_sku;
	    	$data_prev['request_id'] = $data_manager[$i]->request_id;
	    	$data_prev['STATUS'] = $data_manager[$i]->STATUS;
	    	$data_prev['assigned_by'] = $data_manager[$i]->assigned_by;
	    	$data_prev['assignee'] = $data_manager[$i]->assignee;
	    	$data_prev['requested_date'] = $data_manager[$i]->requested_date;
	    	$data_prev['assignment_date'] = $data_manager[$i]->assignment_date;
	    	$data_prev['due_date'] = $data_manager[$i]->due_date;
	    	$data_prev['completion_date'] = $data_manager[$i]->completion_date;
	    	$data_prev['new_due_date'] = $data_manager[$i]->new_due_date;
	    	$data_prev['prod_line_name'] = $data_manager[$i]->prod_line_name;
	    	$data_prev['prod_type_name'] = $data_manager[$i]->prod_type_name;
	    	$data_prev['first_year_demand'] = $data_manager[$i]->first_year_demand;
	    	$data_prev['Annualdemand'] = $data_manager[$i]->Annualdemand;
	    	$data_prev['est_annual_revenue'] = $data_manager[$i]->est_annual_revenue;
	    	$data_prev['lifecycle'] = $data_manager[$i]->lifecycle;
	    	$data_prev['predominant_make'] = $data_manager[$i]->predominant_make;
	    	$data_prev['veh_in_operation'] = $data_manager[$i]->veh_in_operation;
	    	$data_prev['PriorityLevel'] = $data_manager[$i]->PriorityLevel;
	    	$data_prev['ERPOrderID'] = $data_manager[$i]->ERPOrderID;
	    	$data[] = $data_prev;
	    	$i++;
	    }
	    $sheet_header = array('tasks_type'=>'Task Type', 'bbb_sku'=>'BBB SKU#', 'request_id'=>'Request Id', 'STATUS'=>'Status', 'assigned_by'=>'Responsible', 'assignee'=>'Assignee To', 'requested_date'=>'Requested Date', 'assignment_date'=>'Assigment Date', 'due_date'=>"Due Date", 'completion_date'=>'Completion Date', 'new_due_date'=>'New Due Date', 'prod_line_name'=>'Product Line', 'prod_type_name'=>'Product Type', 'first_year_demand'=>'First Year Demand', 'Annualdemand'=>'Mature Annual Demand', 'est_annual_revenue'=>'Estimated Annual Revenue', 'lifecycle'=>'Lifecicle', 'predominant_make'=>'Predominant Make', 'veh_in_operation'=>'Vehicles In Operation', 'PriorityLevel'=>'Priority Level', 'ERPOrderID'=>'ERP Order ID');
	    $file_name = "Manager report";
	    export_manager($data, $sheet_header, 'Manager report', $file_name);
	    echo  json_encode(array('success'=>true)); 
	    exit;
	}
	if(isset($_REQUEST['downloadManager'])){
  		$File = "../../files/docs/Manager report.xlsx";
  		if (file_exists($File)) {
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
  		}
  		exit;
  	}