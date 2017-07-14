<?php  
  	//session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
	require_once("../logger.php");
	require_once("saveform_func.php");
	include '../lang/langs.php';
	error_reporting(E_ERROR);
	
	$id_user = $_SESSION['id'];
	$instance = $_SESSION['instance'];

	$PATH_TO_IMAGE_DIRECTORY = '../files/photo/';
	 $PATH_TO_IMAGE = 'files/photo/';
	$PATH_TO_THUMBS_DIRECTORY = '../files/foto/thumbs/';

if (isset($_REQUEST['couriershow'])) {
	$filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
	$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
	$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
	$sort = $_REQUEST['sort'];
	$dir = $_REQUEST['dir'];
	
	$data = array();
	
	if ($filter) {
		$filterParam = "AND (u.first_name LIKE '$filter%' OR u.last_name LIKE '$filter%' OR u.title LIKE '$filter%')"; 
		$start = 0;
	} else {
		$filterParam = '';
	}
	
	$total = 0;

	$query="SELECT COUNT(u.`id`) FROM `bb_users` u
	LEFT JOIN bb_roles r ON r.`id` = u.`role`
	LEFT JOIN  bb_departments d ON u.`department_id` = d.`id`
	WHERE  u.`instance` = ".$instance."  $filterParam;";

	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
	}
	
	$query = "SELECT u.`id`, u.`login`, u.`name`, u.`phone`, u.`active`, u.`boss_id`, email, `gmt`, department_id, photo, u.`comment`, d.`name` as department, u.`title`, u.`last_name`, u.`first_name`, `admin_manager`, u.employment_status
	FROM `bb_users` u 
	LEFT JOIN  bb_departments d ON u.`department_id` = d.`id`
	WHERE  u.`instance` = ".$instance."  $filterParam AND u.`deleted` = 0
	ORDER BY `".$sort."` ".$dir." 
	LIMIT ".($start).",".($limit).";";
	
	if(!$stmt = $db->query($query)){
			echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
	}else{
			//$result = $stmt->fetch_all(MYSQLI_ASSOC);
			for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);){
				if($tmp['active'] == 1){
					$tmp['active_colmn'] = '+';
				}else{
					$tmp['active_colmn'] = '-';
				}
				$result[] = $tmp;
			} 
			$stmt->close();
			echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
	}
	$db->close();
	exit;
	
	
}




if (isset($_REQUEST['addedit'])) {
	$idrow = $_REQUEST['idrow'];
	$login = $_REQUEST['login'];
	$password = $_REQUEST['password'];
	$role = $_REQUEST['role'];
	$first_name = $_REQUEST['first_name'];
	$last_name = $_REQUEST['last_name'];
	$employment_status = $_REQUEST['employment_status'];
	$phone = $_REQUEST['phone'];
	$isActive = $_REQUEST['isActive'];
	if(!isset($isActive)) $isActive = 0;
	$manager = $_REQUEST['manager'];
	$admin_manager = ($_REQUEST['admin_manager'])?$_REQUEST['admin_manager']: 'NULL';
	if(isset($_REQUEST['photo'])) {
		if($_REQUEST['photo'] == "img/addfoto.png") $photo = "''";
		else $photo = trim(str_replace(" ", "_", "'".$_REQUEST['photo']."'"));
	}
	$department = $_REQUEST['department'];
	$comment = $_REQUEST['comment'];
	$email = $_REQUEST['email'];
	$title = $_REQUEST['title'];
	$name = $first_name." ".$last_name;
	if(isset($_REQUEST['gmt'])) {
		if($_REQUEST['gmt'] == "(UTC +02:00) Europe") $timezone = "'(UTC +02:00) Europe'";
		elseif($_REQUEST['gmt'] == "(UTC-05:00) Eastern Time (US & Canada)") $timezone = "'(UTC-05:00) Eastern Time (US & Canada)'";
		else $timezone = "'(UTC -06:00) Central Time (US & Canada)'";
	}

	$role_arr = JsonToArray($role);

	$path  = explode("/", $photo);
	if($path[0] == 'img'){
		$photo = '';
	}
	
$query = "SELECT COUNT(*), `id` FROM `bb_users` WHERE `login` = '".$login."'";
	if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($count, $id);
        $stmt->fetch();
        $stmt->close();
    }



if(isset($idrow) && $idrow!=""){
	if(isset($password) && $password!=""){
			$pwd = ",`password`='".md5($password)."'";
		}else{
			$pwd = "";
		}
	
		$query = "UPDATE `bb_users` SET `locale` = '".$_SESSION['locale']."',`login` = '".$login."',`name` = '".$name."',`first_name`='".$first_name."',`last_name` = '".$last_name."',`phone` = '".$phone."',`active`=".$isActive.",`boss_id`=".$manager." ".$pwd.", email = '".$email."' , comment = '".$comment."', department_id = $department, photo = ".$photo.", title = '".$title."', `admin_manager` = ".$admin_manager.", `gmt` = ".$timezone.", `employment_status` = ".$employment_status." 
		WHERE id = ".$idrow.";";
	}else{
		if($count==0){
			$query = "INSERT INTO `bb_users` (`gmt`,`locale`,`login`,`password`,`name`,`first_name`,`last_name`,`phone`,`active`,`boss_id`,`instance`, email , comment, department_id, photo, title, admin_manager, employment_status) VALUES (".$timezone.", '".$_SESSION['locale']."','".$login."','".md5($password)."', '".$name."','".$first_name."','".$last_name."','".$phone."',".$isActive.",".$manager.", $instance, '".$email."' , '".$comment."', $department,  ".$photo.", '".$title."', ".$admin_manager.", ".$employment_status.");";
		}
		else {
			echo '{"success":false,"message":"'.$answers['same_login_exist'].'"}';
			exit;
		}
		
	}
	writeToLogDB($id_user, $query);
    if ($stmt = $db->prepare($query)) {
    if ($stmt->execute()) {
    	if(!$id_user = $db->insert_id){
    		$id_user = $idrow;
    	}

    	$query = "DELETE FROM `bb_user_roles` WHERE `user_id` = ".$id_user;
    	em_query($query);

    	for($i=0; $i<count($role_arr); $i++){
    		$array = array('user_id'=>$id_user, 'role_id'=>$role_arr[$i]['id']);
    		em_insert('bb_user_roles', $array);
    	}
    	
		echo '{"success":true,"message":""}';
    } else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }
	} else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }
    $db->close();
    exit;
}



if (isset($_REQUEST['delete'])) {
	/*$idrow = $_REQUEST['id'];
	
	$query = "DELETE FROM `bb_users` WHERE `id` = ".$idrow.";";
	writeToLogDB($id_user, $query);
    if ($stmt = $db->prepare($query)) {
    if ($stmt->execute()) {
		echo '{"success":true,"message":""}';
    } else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }
	} else {
        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
    }*/

    $id = $_REQUEST['id'];
    $query = "UPDATE bb_users SET deleted = 1, active=0 WHERE `id` = ".$id;
	if(!$stmt = $db->prepare($query)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	else {
		if ($stmt->execute()) {
			echo '{"success":true,"message":""}';
	    } 
	    else {
	        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	    }
	}
    $db->close();
    exit;

}

if ($_REQUEST['func'] == 'showManager') {
	$filterParam;
	if(isset($_REQUEST['query'])) $filterParam = "AND `name` LIKE '%$_REQUEST[query]%'";
	$i = 0;

	$query = "SELECT `id`, `name` FROM `bb_users` WHERE `instance` = $instance AND `active` = 1 $filterParam";
	//echo $query;
	writeToLogDB($id_user, $query);
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}

if ($_REQUEST['func'] == 'showRoles') {
	$i = 0;

	$query = "SELECT `id`, `name` FROM `bb_roles`WHERE `deleted`= 0 ORDER BY `name`";
	//echo $query;
	writeToLogDB($id_user, $query);
	$stmt = $db->prepare($query);
	$stmt->execute();
	$stmt->bind_result($id, $name);

	while ($stmt->fetch()) {
		$data[$i] = array(
							'id' => $id,
							'name' => $name
						);
		$i++;		
	}

	$stmt->close();

	echo '{rows:'.json_encode($data).'}';
}


if(isset($_REQUEST['addFoto'])) {
	$idrow = $_REQUEST['idrow'];
	//$filename_personnel_number = $_REQUEST['personnel_number'];
	if (is_uploaded_file($_FILES['foto_employee']['tmp_name'])) {
		  if($_FILES['foto_employee']["size"] > 1024*2*1024){
			  
		        echo '{"success":false,"message":"'.$answers['file_size_ex'].' 2M"}';
		        exit;
    	  }

	$filename_personnel_number = formatToLatin(substr($_FILES['foto_employee']['name'],0,-4).'_'.time());
	
    //Ставим допустимые форматы изображений для загрузки
    if(preg_match('/[.](jpg)|(JPG)|(gif)|(png)$/', $_FILES['foto_employee']['name']))
     {
        //$filename_date = date("d_m_Y-H_i_s-");//дата и время загрузки            
           	
     	$endfile = substr($_FILES['foto_employee']['name'],-3,strlen($_FILES['foto_employee']['name']));
       	$filename = trim(str_replace(" ", "_", $filename_personnel_number)).'.'.$endfile;
        $source = $_FILES['foto_employee']['tmp_name'];
        $target = $PATH_TO_IMAGE_DIRECTORY.$filename;
        $fullname = $PATH_TO_IMAGE.$filename;
       // $path_to_thumbs_directory = '../files/foto/thumbs/';
       if(move_uploaded_file($source, $target)){
       		 if ($idrow){
	        	$query = "SELECT photo FROM bb_users WHERE id = $idrow";
	        	if ($stmt = $db->prepare($query)){
	        		$stmt->execute();
	        		$stmt->bind_result($link_to_photo);
	        		$stmt->fetch();
	        		$stmt->close();
	        	}
	        	


	        	$query = "UPDATE bb_users  SET photo = '".$fullname."' WHERE id = $idrow";
	        	if ($stmt = $db->prepare($query)){
	        		$stmt->execute();
	        		$stmt->close();
	        	}else{
	        		echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
	        		exit;
	        	}
	        	/*if ($link_to_photo){
	        		unlink("../".$link_to_photo);
	        	}*/
      		}
      		echo '{"success":true,"message":"'.$fullname.'"}';

       }else{
       		echo '{"success":false,"message":"'.$answers['error'].'"}';
       }
   }

		   
	} else {
		 switch($_FILES['foto_employee']['error']){
		    case 0: //no error; possible file attack!
		      $msg = $answers['problem_with_upload'];
		      break;
		    case 1: //uploaded file exceeds the upload_max_filesize directive in php.ini
		      //$msg = "The file you are trying to upload is too big.";
		    	$msg = $answers['file_size_ex']." ". ini_get(upload_max_filesize);
		      break;
		    case 2: //uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the html form
		     $msg = $answers['file_to_big'];
		      break;
		    case 3: //uploaded file was only partially uploaded
		      $msg = $answers['file_only_partially'];
		      break;
		    case 4: //no file was uploaded
		      $msg = $answers['select_image'];
		      break;
		    default: //a default error, just in case!  :)
		      $msg = $answers['problem_with_upload'];
		      break;
}
		   //print_r($_FILES['foto_employee']['error']);
		   echo  '{"success":false,"message":"'.$msg.'"}';
		  // echo "filename '". $_FILES['foto_employee']['tmp_name'] . "'.";
	}


	
}

if(isset($_REQUEST['getRoles'])) {
	$user_id = $_REQUEST['user_id'];
	$query="SELECT `role_id`, `name`
			FROM `bb_user_roles` ur
			INNER JOIN `bb_roles` r ON r.`id`=ur.`role_id`
			WHERE `user_id` =".$user_id;
	if($stmt = $db->prepare($query)){
	    $stmt->execute();
	    $stmt->bind_result($id,$name);
	    while ($stmt->fetch()){
			$Model[]= array('id'=>$id,'name'=>$name);
		}
		$stmt->close();
		echo json_encode($Model);
		}else{ echo '{"success":false,"message":""}'; }
		$db->close();
		exit;
}


if(isset($_REQUEST['getViewUserJobDescription'])) {
    $job_title = $_REQUEST['job_title'];
    $query = "SELECT jd.`id` as id_job_title, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, d.`id` as id_dep,`reports_to`, `flsa_status`, `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`,
    	`education_experience`, `work_environment`, `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              WHERE jd.`deleted` = 0 AND `job_title` = '" . $job_title . "' AND `status` = 'Approved'
              GROUP BY `job_title`
              ORDER BY `revision` DESC;";

    if ($tmp = em_query($query)) {
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        echo json_encode($result);
    } else {
        echo '{"success":false,"message":""}';
    }
    $db->close();
    exit;
}

if(isset($_REQUEST['getPosition'])) {
    $job_title = $_REQUEST['job_title'];
    $user_id = $_REQUEST['user_id'];
    $query="SELECT *
    	FROM `bb_job_description`
		WHERE `job_title` =".$job_title;
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$name);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'job_title'=>$job_title);
        }
        $stmt->close();
        echo json_encode($Model);
    }else{
        echo '{"success":false,"message":""}';
    }
    $db->close();
    exit;
}

if(isset($_REQUEST['getJdTitle']))  {
    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` as jd_id FROM `bb_positions` as p
                  LEFT JOIN `bb_job_description` as jd ON p.`position_name` = jd.`job_title` GROUP BY p.`position_name`;";
    }else{
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` as jd_id FROM `bb_positions` as p
                  LEFT JOIN `bb_job_description` as jd ON p.`position_name` = jd.`job_title` WHERE p.`position_name` LIKE '%".$_REQUEST['query']."%'  GROUP BY p.`position_name`;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name,$jd_id);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name, 'jd_id'=>$jd_id);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

