<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');



  include('config.php');


  $un = trim($_POST["user"]);
  $pw = trim($_POST["pw"]); //encrypted password from login page
  $pwx = decode($pw); 

  userLogin($un, $pwx);



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




    function userLogin($un, $pwx){ //check user login details
       
        $pws = "";
        $userid = '';
        $usertype = "";
        $conn = new mysqli(servername, dbuser, dbpw, dbname);
        $sql = "SELECT * from users_table where username = '$un'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $pws = $row['password'];
            $usertype = $row['usertype'];
            $userid = intval($row["userid"]);
            
        }
        if (password_verify("$pwx", "$pws")) {
            echo json_encode(array("result"=>true, "message"=>"Login Success", "id"=>$userid, "usertype"=>$usertype));
        } else {

            echo json_encode(array("result"=>false, "message"=>"Invalid Username/Password"));
        }
    
            } else {
        echo json_encode(array("result"=>false, "message"=>"Invalid Username/Password"));
        }
    $conn->close();
          
    }