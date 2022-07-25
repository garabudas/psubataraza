<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


  include('config.php');


  switch($_POST["a"]){
    case "1":
        getFiles();
        break;
    case "2":
      saveFile();
      break;
    default: break;

  }


  function getFiles(){
    $conn = mysqli_connect(servername, dbuser, dbpw, dbname);
    $stmt = mysqli_prepare($conn, "SELECT * FROM accre_files order by `file_idx` DESC");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC); 
    if ($stmt->affected_rows > 0){
        echo json_encode(array("result"=>true, "files"=>$result));
    } else {
        echo json_encode(array("result"=>false, "message"=>"Something went wrong...pls contact developers"));

    }
 
    $stmt->close();
  }


  function saveFile(){
  
      $filename = $_FILES['file']['name'];
    
      $ext = getFileExt($filename);
      // var_dump($filename);
      // exit();
      $accArea = $_POST["accArea"];
      $area = getLoc($accArea);
      $parent = $_POST["parent"];
      $creator = $_POST["creator"];
      $folder = getLoc($accArea);
    
      $loc = "../documents/".$folder."/".$filename;
      if ( move_uploaded_file($_FILES['file']['tmp_name'], $loc) ) { 
        //file upload successful > save to database
       
        
        $conn = mysqli_connect(servername, dbuser, dbpw, dbname);
        $stmt = mysqli_prepare($conn, "INSERT INTO accre_files (`file_name`, `parent_dir`, `created_by`, `file_ext`, `accre_area`) VALUES (?,?,?,?,?)");
        mysqli_stmt_bind_param($stmt, 'siisi', $filename, $parent, $creator, $ext, $accArea);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0){
          $insertDate = date('Y-m-d');
          echo json_encode(array("result"=>true, "message"=>"New File has been uploaded!", 'idx'=>$conn->insert_id, 'insertDate'=> $insertDate, "ext"=>$ext));
         } else {
          echo json_encode(array("result"=>false, "message"=>"Something went wrong...pls contact developers"));
    
        }
     
        $stmt->close();

      } else { 
        echo json_encode(array("result"=>false, "message"=>"something went wrong... contact developers")); 
      }
      
  }


  function getLoc($accArea){
    $conn = mysqli_connect(servername, dbuser, dbpw, dbname);
    $stmt = mysqli_prepare($conn, "SELECT `accre_name` FROM `accre_areas` where `accre_index` = ?");
    mysqli_stmt_bind_param($stmt, 'i', $accArea);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC); 
    // var_dump($result[0]["accre_name"]);
    // exit();
    if ($stmt->affected_rows > 0){
      return $result[0]["accre_name"];
     } else {
      return "others";

    }
    $stmt->close();
  }


  function getFileExt($filename){
    $ext = explode(".", $filename);
    return end($ext);
  }