<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db('school_departmant');

$school_departments = $con->getData("SELECT * FROM school_departmant");

echo json_encode($school_departments);


?>