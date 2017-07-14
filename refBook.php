<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 10.11.2016
 * Time: 12:02
 */
require_once 'settings.php';

session_start();
if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit;
}

if(isset($_GET['ProductLine'])){
    $query = "SELECT `id`, `name` FROM bb_product_line";
    $val = $_GET['ProductLine'];
    if(!empty($val) ) $query.= " WHERE name LIKE '%".$val."%'";

    if($result = $db->query($query)){
        echo "<table>";
        while ($row = $result->fetch_array()) {
            echo "<tr><td>".$row['id']."</td><td>".$row['name']."</td></tr>";
        }
        echo "</table>";
    } else {
        echo "Нет данных";
    }
}

if(isset($_GET['ProductType'])){
    $query = "SELECT `id`, `name` FROM bb_product_type";
    $val = $_GET['ProductType'];
    if(!empty($val) ) $query.= " WHERE name LIKE '%".$val."%'";

    if($result = $db->query($query)){
        echo "<table>";
        while ($row = $result->fetch_array()) {
            echo "<tr><td>".$row['id']."</td><td>".$row['name']."</td></tr>";
        }
        echo "</table>";
    } else {
        echo "Нет данных";
    }
}

if(isset($_GET['Users'])){
    $query = "SELECT `id`, `name` FROM bb_users";
    $val = $_GET['Users'];
    if(!empty($val) ) $query.= " WHERE name LIKE '%".$val."%'";

    if($result = $db->query($query)){
        echo "<table>";
        while ($row = $result->fetch_array()) {
            echo "<tr><td>".$row['id']."</td><td>".$row['name']."</td></tr>";
        }
        echo "</table>";
    } else {
        echo "Нет данных";
    }
}