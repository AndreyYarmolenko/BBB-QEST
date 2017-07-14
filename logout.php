<?php
session_start();
include ('logger.php');

	//writeToLogDB($_SESSION['id_eisiu'], $_SESSION['locale_eisiu']);
	
	unset($_SESSION['id']);
    unset($_SESSION['login']);
	unset($_SESSION['locale']);
	unset($_SESSION['instance']);
	
	//setcookie('_login_disp', '', 0, "/");
	//setcookie('_password_disp', '', 0, "/");
	
	header("Location: login.php");
	exit;
?>