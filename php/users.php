<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

include('config.php');

switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        getUsers();
        break;
    case "POST":

        break;
    default: break;
}

function getUsers(){
    $conn = new mysqli(servername, dbuser, dbpw, dbname);
    $users = array();
    $sql = "SELECT * FROM users_table order by username ASC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $arr = [
               
                'userid' => $row['userid'],
                'username' => $row['username'],
               
               
                                  
              ];
            array_push($users, $arr);
            
        }
    } 

    echo json_encode(array("users"=>$users));

    $conn->close();
}


