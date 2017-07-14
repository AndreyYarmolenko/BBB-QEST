<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

$oe = "OE Reman";
$new = "New";
$reman = "Aftermarket Reman";
$component = "Component";

if (!isset($_SESSION['id'])) {
    die('{"success":false,"message":""}');
}

	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];
    $gmt = $_SESSION['gmt'];
	$VALUES = array();

	include "../settings.php";
    include_once "saveform_func.php";
    require_once "smtp-func.php";
	
if (isset($_REQUEST['func'])) {
    
	$type = $_REQUEST['func'];
    $table = $_REQUEST['table'];
    $idrow = $_REQUEST['idrow'];
    $edited = $_REQUEST['edited'];
	
	foreach($_REQUEST as $key => $value) {
	$value = trim($value);
	$value = strip_tags($value);
	//if (get_magic_quotes_gpc()) $value = stripslashes($value);
	if (!get_magic_quotes_gpc()) $value = addslashes($value);
	//$value = htmlspecialchars($value,ENT_QUOTES);
	$value = htmlspecialchars($value,ENT_NOQUOTES);
	//$value = str_replace("\r","",$value);
	//$value = str_replace(array("\n","\r\n","\r"), "", $value);
	//$value=str_replace("\n","<br>",$value);
	$_REQUEST[$key] = $value;
	} 


	$Responsible = $_REQUEST['Responsible'];
	$AssignedTo = ($_REQUEST['AssignedTo']) ? $_REQUEST['AssignedTo'] : 'null';
	$AssignmentDate = ($_REQUEST['AssignmentDate']) ? "'". $_REQUEST['AssignmentDate']."'" : 'null';
	$DueDate = ($_REQUEST['DueDate']) ? "'". $_REQUEST['DueDate']."'" : 'null';
	$RequestedDate = ($_REQUEST['RequestedDate']); //? "'". $_REQUEST['RequestedDate']."'" : 'null';		
	$CompletionDate = 'null';
	$NewDueDate = ($_REQUEST['NewDueDate']) ?  "'". $_REQUEST['NewDueDate']."'" : 'null';

    $db->autocommit(false);
    $db->rollback();

   if(isset($_REQUEST['idx'])&&$_REQUEST['idx']!=""&&$table!='bom'&&$table!='component_form'){
       if(isCompleted($table, $_REQUEST['idx'])){
            $result = array('success' => false, 'message'=>'Task is already completed!');
            echo json_encode($result);
            exit;
        }
    }

    $file = "./stages/".$table.".php";
    if(file_exists($file)){
        require_once $file;
    } else {
        die('This is bad');
    }
}

if (isset($_REQUEST['delete'])) {
    $deleteid = $_REQUEST['delete'];
    $table = $_REQUEST['table'];

    $query = "DELETE FROM `bb_" . $table . "` WHERE `idx`=" . $deleteid . ";";
    //writeToLogDB($id_user, $query);
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->close();
        echo '{"success":true,"message":""}';
    } else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }
    $db->close();
    exit;
}

if (isset($_REQUEST['edit'])) {
    $editid = $_REQUEST['edit'];
    $table = $_REQUEST['table'];
    $result = getTaskContent($table, $editid);
		
	echo json_encode($result);	
    exit;
}

?>
