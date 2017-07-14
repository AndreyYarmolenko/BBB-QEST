<?php
session_start();
header('Content-Type: application/json; charset=utf-8');


	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";
	include "../logger_2.php";

if (isset($_REQUEST['delete'])) {
    $deleteid = $_REQUEST['delete'];
    $table = $_REQUEST['table'];

    
    /*if($table == 'operational_procedures') {
        $query = "UPDATE `bb_" . $table . "` SET `deleted` = 1 WHERE `id`=" . $deleteid . ";";
    }
    else {
        $query = "DELETE FROM `bb_" . $table . "` WHERE `id`=" . $deleteid . ";";
    }*/
    
    $query = "UPDATE `bb_" . $table . "` SET `deleted` = 1 WHERE `id`=" . $deleteid . ";";
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