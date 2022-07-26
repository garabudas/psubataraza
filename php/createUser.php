<?php


  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


  include('config.php');


  createUser();

  function createUser(){
    $username = $_POST["user"];
    $pw = decode(trim($_POST["pw"]));
    $pword = password_hash($pw, PASSWORD_DEFAULT);
    $conn = new mysqli(servername, dbuser, dbpw, dbname);
    $sql = "INSERT INTO users_table (`username`, `password`) VALUES ('$username', '$pword')";
 
    if ($conn->query($sql)){
        echo json_encode(array("result"=>true));
    } else {
        echo $conn->error;
    }
    $conn->close();
  }


  function decode($pw) { //decode the encrypted password
    $encoded = base64_decode($pw);
    $decoded = "";
    for( $i = 0; $i < strlen($encoded); $i++ ) {
    $b = ord($encoded[$i]);
    $a = $b ^ 10; 
    $decoded .= chr($a);
    }
    return base64_decode(base64_decode($decoded));
    }