<?php
	include "../../settings.php";
	include '../../mpdf60/mpdf.php';

	/**************************************************************************orgStatus***********************************************************/
	if(isset($_REQUEST['downloadOrgStatus'])) {
			$File = '../../files/pdf/org_status.pdf';
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
				exit;
			}
	}

	if(isset($_REQUEST['exportOrgPdf'])) {
		if(isset($_REQUEST['dataStore']) && $_REQUEST['dataStore'] != "") $data_store = json_decode(stripcslashes($_REQUEST['dataStore']));
		else {
	    	echo "Not value!";
	    	exit;
	    }
		$total = count($data_store);
		$html = "";
		$i = 0;
		$count_row = 0;

		$html = "
			<style type='text/css'>
				.tg  {border-collapse:collapse;border-spacing:0;}
				.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg .tg-yw4l{vertical-align:center}
				span {font-weight: normal}
				img {float: right; width: 200px;}
			</style>

			<img src='../../img/logo.png'>
			<h3>Report name: <span>Org. Status</span></h3>
			<h3>Report date: <span>".date("Y-m-d H:i:s")."</span></h3>
			<h3>Total Headcount: <span>".$total."</span></h3>

			<table class='tg'>
				<tr>
					<td class='tg-yw4l'>№</td>
					<td class='tg-yw4l'>Employee Name/MPR</td>
					<td class='tg-yw4l'>Title</td>
					<td class='tg-yw4l'>Functional Manager</td>
					<td class='tg-yw4l'>Administrative Manager</td>
					<td class='tg-yw4l'>Department</td>
					<td class='tg-yw4l'>Status FT/PT</td>
					<td class='tg-yw4l'>Active/Inactive</td>
				</tr>";

	    foreach ($data_store as $key => $value) {
	    	if($data_store[$i]->active == 0) $data_store[$i]->active = "Inactive";
	    	else $data_store[$i]->active = "Active";
	    	$count_row++;
	     	$html .= "
	    	<tr>
	    		<td>$count_row</td>
	    		<td>".$data_store[$i]->name."</td>
	    		<td>".$data_store[$i]->title."</td>
	    		<td>".$data_store[$i]->boss_func."</td>
	    		<td>".$data_store[$i]->boss_ad."</td>
	    		<td>".$data_store[$i]->department."</td>
	    		<td>".$data_store[$i]->ft_pt."</td>
	    		<td>".$data_store[$i]->active."</td>
	    	</tr>";
	    	$i++;
	    }
	
	    $html .= "</table>";
	    //echo $html;
	    
	    $mpdf = new mPDF('utf-8', 'A4', '', '', 5, 5, 5, 5, '', '');
		//$mpdf-> showImageErrors = true;
		$mpdf -> useOnlyCoreFonts = true;
		$mpdf -> SetDisplayMode('fullpage');
		$mpdf -> WriteHTML($html);

		$mpdf -> Output('../../files/pdf/org_status.pdf', 'F');

		echo '{"success":true,"message":""}';
	}

	/*******************************************************************userList****************************************************************/
	if(isset($_REQUEST['exportUserListPdf'])) {
		$data_user;
		if(isset($_REQUEST['dataUserList']) && $_REQUEST['dataUserList'] != "") $data_user = json_decode(stripcslashes($_REQUEST['dataUserList']));
		else {
	    	echo "Not value!";
	    	exit;
	    }
		$total = count($data_user);
		$html = "";
		$i = 0;
		$count_row = 0;

		$html = "
			<style type='text/css'>
				.tg  {border-collapse:collapse;border-spacing:0;}
				.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg .tg-yw4l{vertical-align:center}
				span {font-weight: normal}
				img {float: right; width: 200px;}
			</style>

			<img src='../../img/logo.png'>
			<h3>Report name: <span>User list</span></h3>
			<h3>Report date: <span>".date("Y-m-d H:i:s")."</span></h3>
			<h3>Total Headcount: <span>".$total."</span></h3>

			<table class='tg'>
				<tr>
					<td class='tg-yw4l'>№</td>
					<td class='tg-yw4l'>Login</td>
					<td class='tg-yw4l'>Employee Name/MPR</td>
					<td class='tg-yw4l'>Title</td>
					<td class='tg-yw4l'>Roles</td>
					<td class='tg-yw4l'>Functional Manager</td>
					<td class='tg-yw4l'>Administrative Manager</td>
					<td class='tg-yw4l'>Department</td>
					<td class='tg-yw4l'>Status FT/PT</td>
					<td class='tg-yw4l'>Active/Inactive</td>
				</tr>";

		foreach ($data_user as $key => $value) {
	    	if($data_user[$i]->active == 0) $data_user[$i]->active = "Inactive";
	    	else $data_user[$i]->active = "Active";
	    	$count_row++;
	     	$html .= "
	    	<tr>
	    		<td>$count_row</td>
	    		<td>".$data_user[$i]->login."</td>
	    		<td>".$data_user[$i]->name."</td>
	    		<td>".$data_user[$i]->title."</td>
	    		<td>".$data_user[$i]->roles."</td>
	    		<td>".$data_user[$i]->boss_func."</td>
	    		<td>".$data_user[$i]->boss_ad."</td>
	    		<td>".$data_user[$i]->department."</td>
	    		<td>".$data_user[$i]->ft_pt."</td>
	    		<td>".$data_user[$i]->active."</td>
	    	</tr>";
	    	$i++;
	    }
	
	    $html .= "</table>";
	    //echo $html;
	    
	    $mpdf = new mPDF('utf-8', 'A4', '', '', 5, 5, 5, 5, '', '');
		//$mpdf-> showImageErrors = true;
		$mpdf -> useOnlyCoreFonts = true;
		$mpdf -> SetDisplayMode('fullpage');
		$mpdf -> WriteHTML($html);

		$mpdf -> Output('../../files/pdf/user_list.pdf', 'F');

		echo '{"success":true,"message":""}';
	}
	if(isset($_REQUEST['downloadUserListPdf'])) {
			$File = '../../files/pdf/user_list.pdf';
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
				exit;
			}
	}

	/*********************************************************managerReport*****************************************************************/
	if(isset($_REQUEST['exportManagerPdf'])) {
		$data_manager;
		if(isset($_REQUEST['dataStoreManager']) && $_REQUEST['dataStoreManager'] != "") $data_manager = json_decode(stripcslashes($_REQUEST['dataStoreManager']));
		else {
	    	echo "Not value!";
	    	exit;
	    }
		$total = count($data_manager);
		$html = "";
		$i = 0;
		$count_row = 0;

		$html = "
			<style type='text/css'>
				.tg  {border-collapse:collapse;border-spacing:0;}
				.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
				.tg .tg-yw4l{vertical-align:center}
				span {font-weight: normal}
				img {float: right; width: 200px;}
			</style>

			<table class='tg'>
				<tr>
					<td class='tg-yw4l'>№</td>
					<td class='tg-yw4l'>Task Type</td>
					<td class='tg-yw4l'>BBB SKU#</td>
					<td class='tg-yw4l'>Request Id</td>
					<td class='tg-yw4l'>Status</td>
					<td class='tg-yw4l'>Responsible</td>
					<td class='tg-yw4l'>Assigned To</td>
					<td class='tg-yw4l'>Requested Date</td>
					<td class='tg-yw4l'>Assigment Date</td>
					<td class='tg-yw4l'>Due Date</td>
					<td class='tg-yw4l'>Complition Date</td>
					<td class='tg-yw4l'>New Due Date</td>
					<td class='tg-yw4l'>Product Line</td>
					<td class='tg-yw4l'>Product Type</td>
					<td class='tg-yw4l'>First Year Demand</td>
					<td class='tg-yw4l'>Mature Annual Demand</td>
					<td class='tg-yw4l'>Estimated Annual Revenue</td>
					<td class='tg-yw4l'>Lifecycle</td>
					<td class='tg-yw4l'>Predominant Make</td>
					<td class='tg-yw4l'>Vehicles In Operations</td>
					<td class='tg-yw4l'>Priority Level</td>
					<td class='tg-yw4l'>ERP Order ID</td>
				</tr>";

		foreach ($data_manager as $key => $value) {
	    	$count_row++;
	     	$html .= "
	    	<tr>
	    		<td>$count_row</td>
	    		<td>".$data_manager[$i]->tasks_type."</td>
	    		<td>".$data_manager[$i]->bbb_sku."</td>
	    		<td>".$data_manager[$i]->request_id."</td>
	    		<td>".$data_manager[$i]->STATUS."</td>
	    		<td>".$data_manager[$i]->assigned_by."</td>
	    		<td>".$data_manager[$i]->assignee."</td>
	    		<td>".$data_manager[$i]->requested_date."</td>
	    		<td>".$data_manager[$i]->assignment_date."</td>
	    		<td>".$data_manager[$i]->due_date."</td>
	    		<td>".$data_manager[$i]->completion_date."</td>
	    		<td>".$data_manager[$i]->new_due_date."</td>
	    		<td>".$data_manager[$i]->prod_line_name."</td>
	    		<td>".$data_manager[$i]->prod_type_name."</td>
	    		<td>".$data_manager[$i]->first_year_demand."</td>
	    		<td>".$data_manager[$i]->Annualdemand."</td>
	    		<td>".$data_manager[$i]->est_annual_revenue."</td>
	    		<td>".$data_manager[$i]->lifecycle."</td>
	    		<td>".$data_manager[$i]->predominant_make."</td>
	    		<td>".$data_manager[$i]->veh_in_operation."</td>
	    		<td>".$data_manager[$i]->PriorityLevel."</td>
	    		<td>".$data_manager[$i]->ERPOrderID."</td>
	    	</tr>";
	    	$i++;
	    }
	
	    $html .= "</table>";
	    //echo $html;
	    
	    $mpdf = new mPDF('utf-8', 'A4-L', '', '', 5, 5, 5, 5, '', '');
		//$mpdf-> showImageErrors = true;
		$mpdf -> useOnlyCoreFonts = true;
		$mpdf -> SetDisplayMode('fullpage');
		$mpdf -> WriteHTML($html);

		$mpdf -> Output('../../files/pdf/export_manager.pdf', 'F');

		echo '{"success":true,"message":""}';
	}
	if(isset($_REQUEST['downloadManager'])) {
			$File = '../../files/pdf/export_manager.pdf';
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
				exit;
			}
	}