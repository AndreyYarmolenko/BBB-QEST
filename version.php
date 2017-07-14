<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit;
}


include('settings.php');

define("FILE_VERSION", "version.info");
function getVersion(){
    return file_get_contents(FILE_VERSION);
}

function setVersion($value){
    if(preg_match("%^\d\.\d\.\d+$%", $value) === 1) {
        file_put_contents(FILE_VERSION, $value);
        return true;
    } else {
        return false;
    }
}

@$version = $_REQUEST['update'];
if(!empty($version)){
    var_dump(setVersion($version));
    echo getVersion();
} else {
    $query = "SELECT `name` FROM bb_users WHERE id = ".$_SESSION['id'];
    $res = $db->query($query);
    $row = $res->fetch_assoc();
    $arr = array();
    $arr['name'] = $row['name'];
    $arr['version'] = getVersion();
    echo json_encode($arr);
}