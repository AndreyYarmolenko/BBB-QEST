<?php
session_start();
include_once "../settings.php";


unset($_SESSION['locale']);
$_SESSION['locale'] = $_POST['lan'];
$iduser = $_SESSION['id'];

$query = "UPDATE `bb_users` SET `locale` = '".$_POST['lan']."' WHERE id = ".$iduser.";";
		//writeToLogFile( ' -> '.date('Y-m-d H:i:s').' QUERY = '.$query );
		if ($stmt = $db->prepare($query)) {
		if ($stmt->execute()) {
			$stmt->close();
			}
		}
?>
