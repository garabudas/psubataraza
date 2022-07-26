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
        
            
            
          
        }

    }); //END AJAX
  }


  function contentPop(id) {
    clearDir();
    var f = files.filter(x=>x.accre_area===parseInt(id));
    if (f.length > 0){
        $.each(f, function(key, val){
            var ext = val.file_ext;
            var pf = accreAreas.find(x=>x.id === parseInt(val.accre_area)).accre_name;
            var ref = (ext === "pdf") ? "ViewerJS/#../" : "";
            $("#files-table > tbody").append(
                '<tr>'+
                    '<td><a class="dir-link"  href="'+ref+'documents/'+pf+'/'+val.file_name+'" target="_blank"><img src="img/file-icons/'+ext+'.png" class="me-3" alt="." height="30" width="30">'+ val.file_name +'</a></td>'+
                    '<td>'+ formatDate(val.created_at) +'</td>'+
              
                  
                   
                '</tr>'
            );    
        });
    }
  }



  $(".list-group-item").click(function(){
    $(".list-group-item").removeClass('active');
    $(this).addClass('active');
    var i = $(this).data('id');
    contentPop(i);
  });


  $(document).ready(function(){
    getFiles();

  });