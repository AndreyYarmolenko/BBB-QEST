<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

if (!isset($_SESSION['id'])) {
    die('{"success":false,"message":""}');
}

	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";
	//include "../logger_2.php";	

$pathDoc = '../files/docs/';

if (isset($_REQUEST['func'])) {
    
	$type = $_REQUEST['func'];
    $table = $_REQUEST['table'];
    $idrow = $_REQUEST['idrow'];
    $edited = $_REQUEST['edited'];
	
	/*foreach($_REQUEST as $key => $value) {
		$value = trim($value);
		$value = strip_tags($value);
		//if (get_magic_quotes_gpc()) $value = stripslashes($value);
		if (!get_magic_quotes_gpc()) $value = addslashes($value);
		//$value = htmlspecialchars($value,ENT_QUOTES);
		$value = htmlspecialchars($value,ENT_NOQUOTES);
		//$value = str_replace("\r","",$value);
		$value = str_replace(array("\n","\r\n","\r"), "", $value);
		//$value=str_replace("\n","<br>",$value);
		$_REQUEST[$key] = $value;
	} */
	
	
    

    switch ($table) {
    		case 'locations':
				$name = "'".$_REQUEST['Name']."'";
				$address = "'".$_REQUEST['Address']."'";
				$contact_person = ($_REQUEST['ContactPerson']) ? "'".$_REQUEST['ContactPerson']."'" : 'null';
				$description = ($_REQUEST['Description']) ? "'".$_REQUEST['Description']."'" : 'null';

				
				if ($type == 'add')
				{
					$query = "INSERT INTO `bb_" . $table . "` (`Name`,`Address`,ContactPerson,`Description`) VALUES (".$name.", ".$address.", ".$contact_person.", ".$description." );";
				} else if ($type == 'edit')
				{
					$query = "UPDATE `bb_" . $table . "` SET `Name`=".$name.",`Address`=".$address.",`ContactPerson`=".$contact_person.",`Description`= ".$description." WHERE id = " . $idrow . ";";
				}
				//writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY = '.$query );
				
			break;
			case 'rights':
				$name = "'".$_REQUEST['right_name']."'";
				$description = ($_REQUEST['description']) ? "'".$_REQUEST['description']."'" : 'null';

				
				if ($type == 'add')
				{
					$query = "INSERT INTO `bb_" . $table . "` (`right_name`, `description`) VALUES (".$name.", ".$description." );";
				} else if ($type == 'edit')
				{
					$query = "UPDATE `bb_" . $table . "` SET `right_name`=".$name.", `description`= ".$description." WHERE id = " . $idrow . ";";
				}
			break;
			case 'test_procedure':
				$procedure = "'".$_REQUEST['test_procedure']."'";
				$spec_conditions = ($_REQUEST['spec_conditions']) ? "'".$_REQUEST['spec_conditions']."'" : 'null';
				$description = ($_REQUEST['description']) ? "'".$_REQUEST['description']."'" : 'null';
				if($_FILES['instruction']){
					 $file = $_FILES['instruction'];
					 if($file["size"] > 1024*2*1024){
				        echo '{"success":false,"message":"File size exceeds 2MÁ"}';
				        exit;
				    }
					$file_in = $file['tmp_name'];
					$personnel_filename = $file['name'];
					file_put_contents($pathDoc.$personnel_filename, file_get_contents($file_in));
				}

			
				if ($type == 'add')
				{
					$query = "INSERT INTO `bb_" . $table . "` (`test_procedure`, `spec_conditions`,`description`, `instruction`) VALUES (".$procedure.", ".$spec_conditions.", ".$description.", '".$personnel_filename."' );";
				} else if ($type == 'edit')
				{
					$query = "UPDATE `bb_" . $table . "` SET `test_procedure`=".$procedure.",`spec_conditions`=".$spec_conditions.",`description`= ".$description.", `instruction` = '".$personnel_filename."' WHERE id = " . $idrow . ";";
				}
				//echo $query; exit;
				//writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY = '.$query );
				
			break;
			case 'operational_procedures':
				$name = "'".$_REQUEST['name']."'";
				$description = ($_REQUEST['description']) ? "'".$_REQUEST['description']."'" : 'null';
				if($_FILES['instruction']){
					 $file = $_FILES['instruction'];
					 if($file["size"] > 1024*2*1024){
				        echo '{"success":false,"message":"File size exceeds 2MÁ"}';
				        exit;
				    }
					$file_in = $file['tmp_name'];
					$personnel_filename = $file['name'];
					file_put_contents($pathDoc.$personnel_filename, file_get_contents($file_in));
				}

			
				if ($type == 'add')
				{
					$query = "INSERT INTO `bb_" . $table . "` (`name`, `description`, `file`) VALUES (".$name.", ".$description.", '".$personnel_filename."' );";
				} else if ($type == 'edit')
				{
					$query = "UPDATE `bb_" . $table . "` SET `name`=".$name.", `description`= ".$description.", `file` = '".$personnel_filename."' WHERE id = " . $idrow . ";";
				}
				//echo $query; exit;
				//writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY = '.$query );
				
			break;
			 
	}
		if ($stmt = $db->prepare($query)) {
			if ($stmt->execute()) {
					$stmt->close();
			        //echo '{"success":true,"message":"'.$query.'"}';
					echo '{"success":true,"message":""}';
			 } else {
			        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}'; exit;
			 }
		} else {
			        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}'; exit;
		}
}

