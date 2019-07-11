<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db('users');

$edit = $con->getData("SELECT * FROM users WHERE id = ".$_POST['id']);

echo json_encode($edit[0]);

?>