<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db('users');


if($_POST['id']>0){
	$con->updateObj($_POST, 'id');
} else {
	unset($_POST['id']);
	$con->insertObj($_POST);
}


?>