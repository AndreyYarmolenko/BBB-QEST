<?php
session_start();
header('Content-Type: application/json; charset=utf-8');


	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";
	//include "../logger_2.php";
	include "../logger.php";	

if (isset($_REQUEST['edit'])) {
    $editid = $_REQUEST['edit'];
    $table = $_REQUEST['table'];
		
		switch($table){

		case 'bb':
		break;
		
		default:
			$query = "SELECT * FROM `bb_" . $table . "` WHERE `id`=" . $editid . ";";
		}
	
	//writeToLogDB($id_user, $query);
    if (!$stmt = $db->query($query)) {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    } else {
        //$result = $stmt->fetch_all(MYSQLI_ASSOC);
        for ($result = array(); $tmp = $stmt->fetch_array(MYSQL_NUM);)
            $result[] = $tmp;
        $stmt->close();
        echo json_encode($result[0]);
    }

    $db->close();
    exit;
}