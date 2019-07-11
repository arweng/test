<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db('users');

$userObjs = $con->getData("SELECT id, firstname, lastname, dep_name FROM users");

echo json_encode($userObjs);


?>