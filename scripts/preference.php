<?php
    session_start();
    header('Content-Type: application/json; charset=utf-8');
    
	if(!isset($_SESSION['id'])){
		die('{"success":false,"message":""}');
	}
	
	$id_user = $_SESSION['id'];
    
	include "../settings.php";
	include "smtp-func.php";
	
    $db = new mysqli ($DB_HOST,$DB_USER,$DB_PASS,$DB_NAME);
    $db->query("SET CHARSET SET utf8");
    $db->query("SET NAMES 'utf8'");
    if (mysqli_connect_errno()) {
        die('{"success":false,"message":""}');
    }
	include "../logger.php";
	
	if(isset($_POST['lng'])){
		$lng = $_POST['lng'];
		$query = "UPDATE `bb_users` SET `locale`='".$lng."' WHERE `id`=".$id_user.";";
		//echo $query;
		//writeToLogFile(date('Y-m-d H:i:s').' | '.$msg);
		writeToLogDB($id_user, $query);
		if($stmt = $db->prepare($query)){
        $stmt->execute();
		$stmt->close();
		$_SESSION['locale'] = $lng;
		echo '{"success":true,"message":""}';
		}else{ echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}'; }
        $db->close();
		exit;
	}
	/*if(isset($_REQUEST['p1'])){
		$p = $_REQUEST['p1'];
		$query = "UPDATE `es_transporter` SET `password`='".$p."' WHERE `id`=".$id_user.";";
		//echo $query;
		//writeToLogFile(date('Y-m-d H:i:s').' | '.$msg);
		writeToLogDB($id_user, $query);
		if($stmt = $db->prepare($query)){
        $stmt->execute();
		$stmt->close();
		
		$headers =	"From: \"ЄІАС УТІ\" <no-replay@pp.uti.gov.ua>\r\n".
					"Content-Type: text/html; charset=\"utf-8\"\r\n";
		if(isset($_SESSION['email'])){
		smtpmail($_SESSION['email'],'Зміна паролю на порталі ЄІАС УТІ', 'Ваш новий пароль '.$p, $headers);
		}
		echo '{"success":true,"message":""}';
		}else{ echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}'; }
        $db->close();
		exit;
	}*/
?>
