<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


  define("servername", "localhost");
  define("dbname", "profile_db");
  define("dbuser",     "root");
  define("dbpw",     "");


  switch ($_POST["a"]){
    case "1":
      saveProfile();
      break;

      default: break;

  }


  
  function saveProfile(){
    
    
    
    
    
    
    
   
    
    
    
    
    
    
    
   
    

    // var_dump($city);
    // exit();

    $conn = mysqli_connect(servername, dbuser, dbpw, dbname);

    $stmt = mysqli_prepare($conn, "INSERT INTO `profile_table`( `region`, `inst_code`, `school`, `serial_no`, `lastname`, `fname`, `mname`, `ext`, `course`, `gender`, `birthday`, `street`, `baranggay`, `city`, `province`, `email`, `phone`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    mysqli_stmt_bind_param($stmt,
     'ssssssssssdssssss',
     $region,
     $instCode,
     $school,
     $serial,
     $lname,
     $fname,
     $mname,
     $ext,
     $course,
     $gender,
     $birthday,
     $street,
     $brgy,
     $city,
     $province,
     $email,
     $phone

  );

  $region = (isset($_POST["npd"]["region"])) ? $_POST["npd"]["region"] : NULL;
  $instCode = (isset($_POST["npd"]["instCode"])) ? $_POST["npd"]["instCode"] : NULL;
  $school = (isset($_POST["npd"]["school"])) ? str_replace("'", "\'",$_POST["npd"]["school"]) : NULL;
  $serial = (isset($_POST["npd"]["serial"])) ? $_POST["npd"]["serial"] : NULL;
  $lname = $_POST["npd"]["lname"];
  $fname = $_POST["npd"]["fname"];
  $mname = (isset($_POST["npd"]["mname"])) ? $_POST["npd"]["mname"] : NULL;
  $ext = (isset($_POST["npd"]["ext"])) ? $_POST["npd"]["ext"] : NULL;
  $course = (isset($_POST["npd"]["course"])) ? str_replace("'", "\'",$_POST["npd"]["course"]) : NULL;
  $gender = (isset($_POST["npd"]["gender"])) ? $_POST["npd"]["gender"] : NULL;
  $birthday = (isset($_POST["npd"]["birthday"])) ? $_POST["npd"]["birthday"] : NULL;
  $street = (isset($_POST["npd"]["street"])) ? $_POST["npd"]["street"] : NULL;
  $brgy = (isset($_POST["npd"]["brgy"])) ? str_replace("'", "\'",$_POST["npd"]["brgy"]) : NULL;
  $city = (isset($_POST["npd"]["city"])) ? str_replace("'", "\'",$_POST["npd"]["city"]) : NULL;
  $province = (isset($_POST["npd"]["province"])) ? str_replace("'", "\'",$_POST["npd"]["province"])  : NULL;
  $email = (isset($_POST["npd"]["email"])) ? $_POST["npd"]["email"] : NULL;
  $phone = (isset($_POST["npd"]["phone"])) ? $_POST["npd"]["phone"] : NULL;

  mysqli_stmt_execute($stmt);

  // printf("%d row inserted.\n", mysqli_stmt_affected_rows($stmt));

  if (mysqli_stmt_affected_rows($stmt) > 0){
    echo json_encode(array("result"=>true, "message"=>"New Profile has been saved!", 'idx'=>$conn->insert_id));
  } else {
    echo json_encode(array("result"=>false, "message"=>"Something went wrong, please contact Ivan Pogi"));
  }
  mysqli_stmt_close($stmt);

  //   $sql = "INSERT INTO `profile_table`( `region`, `inst_code`, `school`, `serial_no`, `lastname`, `fname`, `mname`, `ext`, `course`, `gender`, `birthday`, `street`, `baranggay`, `city`, `province`, `email`, `phone`) VALUES ($region,$instCode,$school,$serial,$lname,$fname,$mname,$ext,$course,$gender,$birthday,$street,$brgy,$city,$province,$email,$phone)";


  //   if ($conn->query($sql)){
  //     echo json_encode(array("result"=>true, "message"=>"New Profile has been saved!", 'idx'=>$conn->insert_id));
  // } else {
  //     
  // }

  // $conn->close();
  }