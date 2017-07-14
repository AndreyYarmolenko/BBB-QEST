<?php
	session_start();
	$id_user = $_SESSION['id'];
	$login = $_SESSION['login'];

	include "../settings.php";

	if(isset($_REQUEST['currentPassword'])) {
		if(trim($_REQUEST['current'])) {
			$cur = md5($_REQUEST['current']);
			$query = "SELECT `password` FROM `bb_users` WHERE `id` = $id_user";
			if(!$stmt = $db->query($query)) echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
			else {
				while($result = $stmt->fetch_array(MYSQLI_ASSOC)) {
					$res = $result['password'];
				}
				if($cur == $res) echo '{"success":true,"message":""}';
				else echo '{"success":false,"message":""}';
			}
			$stmt->close();
		}
		$db->close();
		exit;
	}

	if(isset($_REQUEST['saveNewPass'])) {
		if(trim($_REQUEST['newPass']) == trim($_REQUEST['repeatPass'])) {
			$repeat_pass = md5($_REQUEST['repeatPass']);
			$query = "UPDATE `bb_users` SET `password` = '$repeat_pass' WHERE `id` = $id_user";
			$db->query($query);
			$db->close();
			echo '{"success":true,"message":""}';
		}
		else echo '{"success":false,"message":""}'; 
	}