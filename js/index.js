var dir = [];
var files = [];
var currentDir = 1;
var prevDir;

var navArr = [1];

const accreAreas = [
    {id:1,accre_name:'Vision & Mission, Goals & Objectives'},
    {id:2,accre_name:'Faculty'},
    {id:3,accre_name:'Curriculum'},
    {id:4,accre_name:'Student Support'},
    {id:5,accre_name:'Research'},
    {id:6,accre_name:'Extension'},
    {id:7,accre_name:'Library'},
    {id:8,accre_name:'Physical Plants Facilities'},
    {id:9,accre_name:'Laboratories'},
    {id:10,accre_name:'Administration'}
]
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


function formatDate(str){
    var d = new Date(str);
    var dx = months[d.getMonth()] + ' ' + d.getDate()+', '+ d.getFullYear();
    return dx;
  }

function getCookie(c_name) {
    if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
    return "";
    }

    function logout(){
        document.cookie = 'usr_d=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'rmb=false; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
        window.location.href="index";
    }

    var activeUser = getCookie('userid');
    var xx =getCookie('usr_d');
   

    
        if (xx == ''){
            //there is no user logged in
            window.location.href="index"
        } else {

            $("#logged-user").text(xx);
        
        }
    
function clearDir(){
    $('#files-table > tbody').html('');
    $('#files-table').dataTable().fnClearTable();
    $('#files-table').dataTable().fnDestroy();
}

  $(".navi-link").click(function () { 
    $(".navi-link").removeClass('active');
    $(".db-section").removeClass('active');
    $(this).addClass('active');
    let div = "#"+$(this).data('div');

    $(div).addClass('active');
  });



  $(document).ready(function () {
    getFiles();
    getDirs();
    clearDir();
    $("#accArea").val(0);
      $('#newProfileForm').trigger("reset");
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $("#tdate").val(today);


   
  });

  const contentPop = () => {
   
    clearDir();


   
    

    var dirs = dir.filter(x=>x.dir_parent === currentDir);
    var f = files.filter(x=>x.parent_dir===currentDir);
    
   
     //populate for directories
    if (dirs.length > 0){
        $.each(dirs, function(key, val){
            $("#files-table > tbody").append(
                '<tr>'+
                    '<td><a class="dir-link" onclick="openDir('+val.dir_idx+')" href="javascript:void(0);"><img src="img/file-icons/folder.png" class="me-3" alt="." height="20" width="30">'+ val.dir_name +'</a></td>'+
                    '<td>'+ formatDate(val.created_at) +'</td>'+
              
                    '<td class="text-end"><button class="btn btn-danger btn-sm mb-3 mb-sm-0 me-0 me-sm-3">Delete</button><button class="btn btn-primary btn-sm">Rename</button></td>'+
                   
                '</tr>'
            );    
        });
     
    }
    //populate for files
    if (f.length > 0){
        $.each(f, function(key, val){
            var ext = val.file_ext;
            var pf = accreAreas.find(x=>x.id === parseInt(val.accre_area)).accre_name;
            var ref = (ext === "pdf") ? "ViewerJS/#../" : "";
            $("#files-table > tbody").append(
                '<tr>'+
                    '<td><a class="dir-link"  href="'+ref+'documents/'+pf+'/'+val.file_name+'" target="_blank"><img src="img/file-icons/'+ext+'.png" class="me-3" alt="." height="30" width="30">'+ val.file_name +'</a></td>'+
                    '<td>'+ formatDate(val.created_at) +'</td>'+
              
                    '<td class="text-end"><button class="btn btn-danger btn-sm mb-3 mb-sm-0 me-0 me-sm-3">Delete</button><button class="btn btn-primary btn-sm">Rename</button></td>'+
                   
                '</tr>'
            );    
        });
    }
    if (currentDir != 1){

        navBreads();
        $("#backButton").removeClass('invisible');
    } else {
        $("#backButton").addClass('invisible');
    }


  
    $('#files-table').DataTable({
        order: [[2, 'asc']],
    });
  

  }

  function getDirFiles(){

  }


  function navBreads(){
    
      $("#breadcrumbs").html('');
      var p = navArr.slice(-1)[0];
      $.each(navArr, function(key, val){
        // console.log(val);
        var dn = dir.find(x=>x.dir_idx === parseInt(val)).dir_name;
      
        var active = (parseInt(val) === p) ? "active" : "";
        $("#breadcrumbs").append(
            '<li class="breadcrumb-item '+active+'">'+dn+'</li>'
        );
      });
  }


  function openDir(id){
    navArr.push(id);
    console.log(navArr);
    prevDir = currentDir;
    currentDir = parseInt(id);
    var cd = dir.find(x=>x.dir_idx===id).dir_name;
    

    $("#current-dir").text(cd);
    contentPop();
  }

  $("#backButton").click(function(){
    navArr.pop();
    currentDir = navArr.slice(-1)[0];
    console.log(navArr);
    if (currentDir == 1){
        navBreads();
    }
    contentPop();
  });



  function getDirs(){
    
    $.ajax({
        type: 'POST',
       
        url: 'php/directories.php',
        data: {a:1},
        crossDomain: true,
        dataType: 'json',
        success: function(data) {
            if (data.result){
                dir = data.directories;
                console.log(dir);
            }
            
            
          
        }

    }); //END AJAX
  }
  

  function getFiles(){
    
    $.ajax({
        type: 'POST',
       
        url: 'php/files.php',
        data: {a:1},
        crossDomain: true,
        dataType: 'json',
        success: function(data) {
            if (data.result){
                files = data.files;
                    console.log(files);
            }
            console.log(files.length);
            
            
          
        }

    }); //END AJAX
  }

  

  function getUsers(){
    $('#users-table').DataTable().clear().destroy();
    $.ajax({
        type: 'GET',
    
        url: 'php/users.php',
       
        crossDomain: true,
        dataType: 'json',
        success: function(data) {
            console.log(data.users.length);
            
            if (data.users.length > 0){
                users = data.users;
                userPop();
            }
        }

    }); //END AJAX
  }


  function userPop(){
    console.log(users);
    $('#users-table > tbody').html('');
    $('#users-table').dataTable().fnClearTable();
    $('#users-table').dataTable().fnDestroy();
    $.each(users, function(key, val){
        $("#users-table > tbody").append(
            '<tr>'+
                '<td class="fs-2">'+ val.username+
                '</td>'+
                '<td class="text-center"><button type="button" class="btn btn-danger">Delete</button></td>'+
               
            '</tr>'
        );
    });
    $('#users-table').DataTable()
  }


    


  


