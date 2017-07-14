<?php
  function writeToLogDB($userid, $actiontext){
	global $db;
	/*if(!isset($db)){
		include "../../settings.php";
		$db = new mysqli ($DB_HOST,$DB_USER,$DB_PASS,$DB_NAME);
		$db->query("SET CHARSET SET utf8");
		$db->query("SET NAMES 'utf8'");
		if (mysqli_connect_errno()){ echo "Error connecting to DB"; exit; }
    }*/
	
	$query = "INSERT INTO `bb_logs` (`iduser`,`actionfunc`,`actiontext`,`ip`,`sysname`) VALUES (".$userid.", '".$_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF'].$_SERVER['REQUEST_METHOD'].$_SERVER['QUERY_STRING']."', '".addslashes($actiontext)."', '".$_SERVER['REMOTE_ADDR']."', '".$_SERVER['HTTP_USER_AGENT']."')";
	//echo $query;
	if($stmt = $db->prepare($query)){
	    if($stmt->execute()){
	    	$stmt->close();
		}
	}
	//$db->close();
	//return false;
  }
  function em_writeLog($query, $filename){
      $filename = date("Y-m-d").'_'.$filename.'.log';
      $content = "==== ==== ==== ==== ==== ".date('H:i:s')." ==== ==== ==== ==== ====".PHP_EOL;
      $content .=$query.PHP_EOL.PHP_EOL;
      file_put_contents('./logs/'.$filename, $content, FILE_APPEND);
  }
?>