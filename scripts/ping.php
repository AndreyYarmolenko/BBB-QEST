<?php
session_start();    
// unset($_SESSION['id']);

if(!isset($_SESSION['id'])) echo(false);
else echo(true);
?>