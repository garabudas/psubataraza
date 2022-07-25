<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');
  header('Access-Control-Max-Age: 1000');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


  define("servername", "localhost");
  define("dbname", "dtest_db");
  define("dbuser",     "root");
  define("dbpw",     "");

switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        getTests();
        break;
    case "POST":
        if ($_POST["a"] === '1'){
            newTest();
        }
        break;
    default: break;
}

function getTests(){
    $conn = new mysqli(servername, dbuser, dbpw, dbname);
    $tests = array();
    $sql = "SELECT * FROM dtest_main order by testdate DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $arr = [
               
                'testid' => $row['testid'],
                'testdate' => $row['testdate'],
                'firstname' => $row['firstname'],
                'middlename' => $row['middlename'],
                'lastname' => $row['lastname'],
                'gender' => $row['gender'],
                'result' => $row['result'],
               
                                  
              ];
            array_push($tests, $arr);
            
        }
    } 

    echo json_encode(array("tests"=>$tests));

    $conn->close();
}


function newTest(){
   $dd = strtotime($_POST["ntd"]["testdate"]);
    $tdate = date('Y-m-d', $dd);
    $fname = $_POST["ntd"]["firstname"];
    $mname = $_POST["ntd"]["middlename"];
    $lname = $_POST["ntd"]["lastname"];
    $gender = $_POST["ntd"]["gender"];
    $result = $_POST["ntd"]["result"];
    $conn = new mysqli(servername, dbuser, dbpw, dbname);

    $sql = "INSERT INTO dtest_main (`testdate`, `firstname`, `middlename`, `lastname`,`gender`, `result`) VALUES ('$tdate', '$fname', '$mname', '$lname','$gender', '$result')";

    if ($conn->query($sql)){
        echo json_encode(array("result"=>true, "message"=>"New test result has been saved!", 'idx'=>$conn->insert_id));
    } else {
        echo json_encode(array("result"=>false, "message"=>"Something went wrong, please contact the developer"));
    }

    $conn->close();
}