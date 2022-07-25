<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


  include('config.php');


  switch($_POST["a"]){
    case "1":
        getDirs();
        break;
    case "2":
        saveDir();
        break;
    default: break;

  }


  function getDirs(){
    $conn = mysqli_connect(servername, dbuser, dbpw, dbname);
    $stmt = mysqli_prepare($conn, "SELECT * FROM directories order by `dir_idx` DESC");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC); 
    if ($stmt->affected_rows > 0){
        echo json_encode(array("result"=>true, "directories"=>$result));
    } else {
        echo json_encode(array("result"=>false, "message"=>"Something went wrong...pls contact developers"));

    }
 
    $stmt->close();
  }

  function saveDir() {
    $dirname = trim($_POST["dirName"]);
    $dp = $_POST["parent"];
    $creator = $_POST["creator"];
    $conn = mysqli_connect(servername, dbuser, dbpw, dbname);
    $stmt = mysqli_prepare($conn, "INSERT INTO `directories` (`dir_name`, `dir_parent`, `created_by`) VALUES (?,?,?)");
    mysqli_stmt_bind_param($stmt, 'sii', $dirname, $dp, $creator);
    $stmt->execute();
    if ($stmt->affected_rows > 0){
      $insertDate = date('Y-m-d');
      echo json_encode(array("result"=>true, "message"=>"New Directory has been saved!", 'idx'=>$conn->insert_id, 'insertDate'=> $insertDate));
     } else {
      echo json_encode(array("result"=>false, "message"=>"Something went wrong...pls contact developers"));

    }

  $stmt->close();
  }