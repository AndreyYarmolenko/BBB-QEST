<?php  
  session_start();
    header('Content-Type: text/html; charset=utf-8');
    require_once("../settings.php");
    require_once("../scripts/saveform_func.php");
    require_once("../logger.php");

    $id_user = $_SESSION['id'];
    $instance = $_SESSION['instance'];

if (isset($_REQUEST['DescriptionShow'])) {
    $filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
    $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
    $limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
    
    $data = array();
    
    if ($filter) {

        $filterParam = "AND (`job_title` LIKE '%".$filter."%')";
    } else {
        $filterParam = '';
    }
    
    $total = 0;

    $query="SELECT COUNT(`id`) FROM `bb_job_description` WHERE `deleted` = 0";

    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total);
        $stmt->fetch();
        $stmt->close();
    }

    // $query = "SELECT jd.`id`, `job_title`, jd.`revision`, MAX(jd.`revision`) as `max_revision`, `status`, `create_date`, `id_department`, d.`name`, d.`id` as id_dep,`reports_to`, `flsa_status`,
 //                    `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`, 
 //                    `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
 //              FROM `bb_job_description` AS jd
 //              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
 //              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
 //              WHERE jd.`deleted` = 0  ".$filterParam." 
 //              AND `status` NOT LIKE 'Archive' 
 //              GROUP BY `job_title` 
 //              ORDER BY `max_revision` DESC
 //              LIMIT ".($start).",".($limit).";";

    $query = "SELECT jd.`id`, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, d.`id` as id_dep,
            jd.`reports_to`, jd.`flsa_status`, jd.`prepared_by`, jd.`prepared_date`, jd.`summary`, jd.`essential_duties`, jd.`qualifications`,
             jd.`education_experience`, jd.`work_environment`, jd.`summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              WHERE jd.`deleted` = 0  ".$filterParam." 
              AND `status` NOT LIKE 'Archive'
              ORDER BY `job_title` ASC 
              LIMIT ".($start).",".($limit).";";          

    if(!$stmt = $db->query($query)){
            echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
    }else{
            //$result = $stmt->fetch_all(MYSQLI_ASSOC);
            for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);){
                $result[] = $tmp;
            }
            $stmt->close();
            echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
    }
    $db->close();
    exit;

}


if ((isset($_REQUEST['addedit'])) || (isset($_REQUEST['view']))) {

    $query="SELECT id FROM `bb_departments` WHERE `name` ='".$_REQUEST['name']."'";

    $id_dep = "";
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($id_dep);
        $stmt->fetch();
        $stmt->close();
    }

    $id = $_REQUEST['idrow'];
    if($_REQUEST['status']&&$_REQUEST['status']!=''){
        $VALUES['status'] = $_REQUEST['status'];
    }else{
        $VALUES['status'] = 'New';
    }
    $VALUES['job_title'] = $_REQUEST['job_title'];
    $VALUES['revision']             = $_REQUEST['revision'];
    $VALUES['id_department']        = $id_dep;
    $VALUES['create_date']          = date('Y-m-d');
    $VALUES['flsa_status']          = $_REQUEST['flsa_status'];
    $VALUES['reports_to']           = $_REQUEST['reports_to'];
    $VALUES['prepared_by']          = $id_user;
    $VALUES['prepared_date']        = date('Y-m-d');
    $VALUES['summary']              = $_REQUEST['summary'];
    $VALUES['essential_duties']     = $_REQUEST['essential_duties'];
    $VALUES['qualifications']       = $_REQUEST['qualifications'];
    $VALUES['work_environment']     = $_REQUEST['work_environment'];
    $VALUES['education_experience'] = $_REQUEST['education_experience'];
    $VALUES['summary_end']          = $_REQUEST['summary_end'];
    $VALUES['id_user_edit']         = $id_user;
    $VALUES['deleted']              = 0;
    $VALUE['position_name']         = $_REQUEST['job_title'];
    $total_position                 = 0;

    $query="SELECT COUNT(`id`) FROM `bb_positions` WHERE `position_name` ='".$VALUE['position_name']."';";
    
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total_position);
        $stmt->fetch();
        $stmt->close();
    }

    if($total_position==0) {
        $id = 0;
        $VALUE['position_name'] = $_REQUEST['job_title'];
        $position = "SELECT `id` FROM `bb_positions` WHERE `position_name` ='" . $VALUE['position_name'] . "'";
        if ($stmt = $db->prepare($position)) {
            $stmt->execute();
            $stmt->bind_result($id);
            $stmt->fetch();
            $stmt->close();
        }

        $total_position = $id;
        if ($total_position != 0) {
            $result = array('success' => true);
            return $result;
        }
        else {
            em_insert('bb_positions', $VALUE);
            $result = array('success' => true);
        }
    }
    if(isset($id) && $id!=""){
        $where = " `id`=".$id;
        em_update('bb_job_description', $VALUES, $where);
    }else{
        em_insert('bb_job_description', $VALUES);
    }
    exit;
}

if (isset($_REQUEST['add'])) {

    $query="SELECT id FROM `bb_departments` WHERE `name` ='".$_REQUEST['name']."'";

    $id_dep = "";
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($id_dep);
        $stmt->fetch();
        $stmt->close();
    }
    $VALUES['status']               = 'New';
    $VALUES['job_title']            = $_REQUEST['job_title'];
    $VALUES['revision']             = $_REQUEST['revision'];
    $VALUES['id_department']        = $id_dep;
    $VALUES['create_date']          = date('Y-m-d');
    $VALUES['flsa_status']          = $_REQUEST['flsa_status'];
    $VALUES['reports_to']           = $_REQUEST['reports_to'];
    $VALUES['prepared_by']          = $id_user;
    $VALUES['prepared_date']        = date('Y-m-d');
    $VALUES['summary']              = $_REQUEST['summary'];
    $VALUES['essential_duties']     = $_REQUEST['essential_duties'];
    $VALUES['qualifications']       = $_REQUEST['qualifications'];
    $VALUES['work_environment']     = $_REQUEST['work_environment'];
    $VALUES['education_experience'] = $_REQUEST['education_experience'];
    $VALUES['summary_end']          = $_REQUEST['summary_end'];
    $VALUES['id_user_edit']         = $id_user;
    $VALUES['deleted']              = 0;
    $VALUE['position_name']         = $_REQUEST['job_title'];
    $total_position = 0;

    $query="SELECT COUNT(`id`) FROM `bb_positions` WHERE `position_name` ='".$VALUE['position_name']."';";
    
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($total_position);
        $stmt->fetch();
        $stmt->close();
    }

    if($total_position==0) {
        $id = 0;
        $VALUE['position_name'] = $_REQUEST['job_title'];
        $position = "SELECT `id` FROM `bb_positions` WHERE `position_name` ='" . $VALUE['position_name'] . "'";
        if ($stmt = $db->prepare($position)) {
            $stmt->execute();
            $stmt->bind_result($id);
            $stmt->fetch();
            $stmt->close();
        }

        $total_position = $id;
        if ($total_position != 0) {
            $result = array('success' => true);
            return $result;
        }
        else {
            em_insert('bb_positions', $VALUE);
            $result = array('success' => true);
        }
    }
    
    em_insert('bb_job_description', $VALUES);
    
    exit;
}


if (isset($_REQUEST['delete'])) {
    $id = $_REQUEST['id'];
    $query = "UPDATE bb_job_description SET deleted = 1 WHERE `id` = $id";
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
}


if (isset($_REQUEST['approved'])) {

    $id = $_REQUEST['id'];
    $id_to_archive = 0;

    $id_to_change = "SELECT jd1.`id` FROM bb_job_description AS jd1
                    WHERE jd1.`status` = 'Approved'
                     AND jd1.`job_title` = (SELECT jd2.`job_title` FROM bb_job_description AS jd2 WHERE jd2.`id` = $id)";
    if ($stmt = $db->prepare($id_to_change)) {
        $stmt->execute();
        $stmt->bind_result($id_to_archive);
        $stmt->fetch();
        $stmt->close();
        if(isset($id_to_archive)&&$id_to_archive !=''){              
            $query_to_archive = "UPDATE bb_job_description SET `status` = 'Archive' WHERE `id`= $id_to_archive";
                if(!$stmt = $db->prepare($query_to_archive)) echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
                else {
                    if ($stmt->execute()) {
                        // echo '{"success":true,"message":""}';
                    }
                    else {
                        echo '{"success":false,"message":"' . $db->errno . ' ' . $db->error . '"}';
                    }
                }
            }  
        }
    $query = "UPDATE bb_job_description SET `status` = 'Approved' WHERE `id` = $id";
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
}


if (isset($_REQUEST['new_revision'])) {
    $id = $_REQUEST['id'];
    $query = "UPDATE bb_job_description SET `status` = 'Approved' WHERE `id` = $id";
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
}


if (isset($_REQUEST['getUser'])) {
    $id = $_REQUEST['id_user'];
    $query = "SELECT `id`, `name` as user_name FROM bb_users WHERE `id` = $id";
    if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if (isset($_REQUEST['all_revision'])) {
    $filter = isset($_REQUEST['filter']) ? $_REQUEST['filter'] : '';
    $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
    $limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : 50;
    $data = array();
    $total = 0;
    if ($filter) {
        $filterParam = "AND (`job_title` LIKE '%".$filter."%')";
    } else {
        $filterParam = '';
    }

    $query = "SELECT jd.`id`, `job_title`, jd.`revision`, jd.`revision` as `revision`, `status`, `create_date`, `id_department`, d.`name`, d.`id` as id_dep,`reports_to`, `flsa_status`,
                    `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`, 
                    `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              WHERE jd.`deleted` = 0 ".$filterParam."  LIMIT ".($start).",".($limit).";";

    if(!$stmt = $db->query($query)){
        echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
    }else{
        //$result = $stmt->fetch_all(MYSQLI_ASSOC);
        for ($result = array(); $tmp = $stmt->fetch_array(MYSQLI_ASSOC);){
            $result[] = $tmp;
        }
        $stmt->close();
        echo '{"total":"'.$total.'","rows":'.json_encode($result).'}';
    }
    $db->close();
    exit;
}


if(isset($_REQUEST['getJobDescriptionById']))  {
    $jd_id = $_REQUEST['id'];
    $query = "SELECT jd.`id`, `job_title`, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, `reports_to`, `flsa_status`,
                     `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`,
                     `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              WHERE jd.`id` = ".$jd_id;
    if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getJobDescriptionByJobTitle']))  {

    $jd_id = $_REQUEST['id'];

    if($jd_id) {
        $query = "SELECT jd.`id`, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, `reports_to`, `flsa_status`,
                     `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`,
                     `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              WHERE jd.`job_title` = (SELECT `job_title` FROM `bb_job_description` WHERE `id` = " . $jd_id . ");";
    }
    else{
        $query = "SELECT jd.`id`, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, `reports_to`, `flsa_status`,
                     `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`,
                     `work_environment`, `summary_end`, u.`name` as user_name, jd.`id_user_edit`
              FROM `bb_job_description` AS jd
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id` 
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              WHERE jd.`job_title` = (SELECT `job_title` FROM `bb_job_description` WHERE `id` = " . $jd_id . ");";
    }
    if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getChangeRevisionJobDescription']))  {
    $revision = $_REQUEST['revision'];
    $job_title = $_REQUEST['job_title'];
    $query = "SELECT jd.`id`, `job_title`, jd.`revision`, `status`, `create_date`, `id_department`, d.`name`, `reports_to`, `flsa_status`,
                     `prepared_by`, `prepared_date`, `summary`, `essential_duties`, `qualifications`, `education_experience`, `work_environment`,
                     `work_environment`, `summary_end`,u.`id`, u.`name` as user_name
              FROM `bb_job_description` AS jd
              JOIN `bb_departments` AS d ON jd.`id_department` = d.`id`
              JOIN `bb_users` AS u ON jd.`id_user_edit` = u.`id`
              WHERE jd.`job_title` = '".$job_title."' AND jd.`revision` = '".$revision."'";
    if($tmp = em_query($query)){
        $result = $tmp->fetch_array(MYSQL_ASSOC);
        echo json_encode($result);
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getJdReportsTo']))  {
    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT `id`, `job_title` FROM `bb_job_description` GROUP BY `job_title`;";
    }else{
        $query = "SELECT `id`, `job_title` FROM `bb_job_description` WHERE `job_title` LIKE '%".$_REQUEST['query']."%'  GROUP BY `job_title`;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id,$reports_to);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$reports_to);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}


if(isset($_REQUEST['getJdRevision']))  {

    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT `revision` FROM `bb_job_description` GROUP BY `revision`";

    }else{
        $query = "SELECT `revision` FROM `bb_job_description` GROUP BY `revision` AND  `revision` LIKE '%".$_REQUEST['query']."%' ;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($revision);
        while ($stmt->fetch()){
            $Model[]= array('value'=>$revision);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getChangeJdRevision']))  {
    $id = $_REQUEST['id'];
    // $create_date = date('Y-m-d');
    $query = "SELECT `job_title`, `revision` FROM `bb_job_description` WHERE `id` = $id";
    if($stmt = $db->prepare($query)){
        $stmt->execute();
         $stmt->bind_result($revision, $job_title);
        while ($stmt->fetch()){
            $Model[]= array('revision'=>$revision, 'job_title'=>$job_title);
        }
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
    }   


if(isset($_REQUEST['getJdTitle']))  {
    if(!isset($_REQUEST['query']) || $_REQUEST['query']==""){
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` as jd_id FROM `bb_positions` as p
                  LEFT JOIN `bb_job_description` as jd ON p.`position_name` = jd.`job_title`   WHERE jd.`id` IS NULL GROUP BY p.`position_name`;";
    }else{
        $query = "SELECT p.`id`, p.`position_name`, jd.`id` as jd_id FROM `bb_positions` as p
                  LEFT JOIN `bb_job_description` as jd ON p.`position_name` = jd.`job_title`   WHERE jd.`id` IS NULL AND p.`position_name` LIKE '%".$_REQUEST['query']."%'  GROUP BY p.`position_name`;";
    }
    if($stmt = $db->prepare($query)){
        $stmt->execute();
        $stmt->bind_result($id, $name,$jd_id);
        while ($stmt->fetch()){
            $Model[]= array('id'=>$id,'value'=>$name, 'jd_id'=>$jd_id);
        }
        // var_dump($Model);
        //     exit;
        $stmt->close();
        echo'{rows:'.json_encode($Model).'}';
    }else{ echo '{"success":false,"message":""}'; }
    $db->close();
    exit;
}

if(isset($_REQUEST['getJdDepartment'])) {
    if (!isset($_REQUEST['query']) || $_REQUEST['query'] == "") {
        $query = "SELECT `id`, `name` FROM `bb_departments` GROUP BY `name`;";
    } else {
        $query = "SELECT `id`, `name` FROM  `bb_departments WHERE `name` LIKE '%" . $_REQUEST['query'] . "%'  GROUP BY d.`name`;";
    }
    if ($stmt = $db->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($id, $name);
        while ($stmt->fetch()) {
            $Model[] = array('id' => $id, 'value' => $name);
        }
        $stmt->close();
        echo '{rows:' . json_encode($Model) . '}';
    } else {
        echo '{"success":false,"message":""}';
    }
    $db->close();
}

?>