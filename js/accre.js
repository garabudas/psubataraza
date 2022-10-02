
var dir = [];
var files = [];
var currentDir = 1;
var prevDir;
var activeArea;
var navArr = [1];
var currentFileArr = [];
var filterredArray = [];
const gallery = new Viewer(document.getElementById('filePort'));  
const imgext = ["jpg", 'jpeg', 'JPG', 'JPEG', 'png', 'PNG', 'webp'];
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

  const getFileType = (ext) =>{
    console.log(ext);
  } 
  function contentPop(f) {
        $.each(f, function(key, val){
            var ext = val.file_ext;
            var pf = accreAreas.find(x=>x.id === parseInt(val.accre_area)).accre_name;
            var ref = (ext === "pdf") ? "ViewerJS/#../" : "";
            var src = (imgext.includes(ext)) ? 'documents/'+activeArea+'/'+val.file_name : 'img/file-icons/'+ext+'.png';
            var attr = (imgext.includes(ext)) ? 'style="width: 100%; height: auto"' : 'height="100" width="100"'
            $("#filePort").append(
                '<div class="col-3 p-3 file-col rounded" id="'+ val.file_idx +'" onclick="fileSummary(id)">'+
           
                  '<div class="w-100 text-center px-4 py-2 position-relative rounded bg-secondary">'+
                  // '<img src="img/icons/pineapple-transparent-cropped.webp" class="col-icon" style="transform: rotate(45deg);" height="80" width="60" alt="pineapple" />'+
                    '<img src="'+src+'" class="file-img mb-2" alt="file icon" '+attr+' />'+
                    '<p class="fw-bold text-white">'+ val.file_name +'</p>'+
                    '<hr class="border-bottom border-light border-3 my-2">'+
                    '<p class="text-white fw-light text-start" style="font-size:12px;">Created at: '+ formatDate(val.created_at) +'</p>'+
                  '</div>'+
                  
                   
                '</div>'
            );    
        });

        $(".file-col").addClass('shown');
        $(".file-col").click(function(){
          $(".file-col").removeClass('active')
          $(this).addClass('active')

        });
        // gallery.update();
  }


  function fileSummary(idx){
    $("#summaryPort").html('');
    var selectedFileArr = currentFileArr.filter(x=> x.file_idx === parseInt(idx));
    console.log(selectedFileArr);
    var f=selectedFileArr[0];
    var desc = (f.file_desc===null || f.file_desc===undefined) ? 'No Description Provided' : f.file_desc;
    var src = (imgext.includes(f.file_ext)) ? 'documents/'+activeArea+'/'+f.file_name : 'img/file-icons/'+f.file_ext+'.png';
    $("#summaryPort").html(
      '<div class="w-100 position-relative p-2 text-center">'+
      // '<img src="img/icons/pineapple-transparent-cropped.webp" class="col-icon" style="transform: rotate(-45deg);" height="80" width="60" alt="pineapple" />'+
      '<img src="'+src+'" class="img-fluid mb-3" />'+
      '<p class="text-white fw-bold mb-3">'+f.file_name+'</p>'+
      '<hr class="border-top border-light my-3">'+
      '<h4 class="text-white text-start mb-3">File Description</h4>'+
      '<p class="text-white text-start fs-6 mb-3">'+desc+'</p>'+
      '<div class="row">'+
        '<div class="col-6">'+
          '<button type="button" class="btn btn-light w-100"><span class="me-2"><img src="img/icons/eye.svg" height="20" width="20" /></span>View</button>'+
        '</div>'+
        '<div class="col-6">'+
          '<button type="button" class="btn btn-light w-100"><span class="me-2"><img src="img/icons/download.svg" height="20" width="20" /></span>Download</button>'+
        '</div>'+
      '</row>'+
      '</div>'
    );

  }

  function resetFilters(){
    clearFilePort();
    $("#summaryPort").html('');
    contentPop(currentFileArr);
    const filterText = 'Showing '+currentFileArr.length+' file(s) under '+activeArea+' area'
    $("#filterText").text(filterText);
  }


  function imagePop(f){
    $.each(f, function(key, val){
      var ext = val.file_ext;
      var pf = accreAreas.find(x=>x.id === parseInt(val.accre_area)).accre_name;
      var ref = (ext === "pdf") ? "ViewerJS/#../" : "";
      $("#filePort").append(
          '<div class="col-3 p-3 file-col rounded" id="'+ val.file_idx +'" onclick="fileSummary(id)">'+
              // '<td><a class="dir-link"  href="'+ref+'documents/'+pf+'/'+val.file_name+'" target="_blank"><img src="img/file-icons/'+ext+'.png" class="me-3" alt="." height="30" width="30">'+ val.file_name +'</a></td>'+
              // '<td>'+ formatDate(val.created_at) +'</td>'+
            '<div class="w-100 text-center px-4 py-2 position-relative rounded bg-secondary">'+
            // '<img src="img/icons/pineapple-transparent-cropped.webp" class="col-icon" style="transform: rotate(45deg);" height="80" width="60" alt="pineapple" />'+
              '<img src="documents/'+activeArea+'/'+val.file_name+'" class="file-img img-fluid mb-2" alt="file icon" />'+
              '<p class="fw-bold text-white">'+ val.file_name +'</p>'+
              '<hr class="border-bottom border-light border-3 my-2">'+
              '<p class="text-white fw-light text-start" style="font-size:12px;">Created at: '+ formatDate(val.created_at) +'</p>'+
            '</div>'+
            
             
          '</div>'
      );  
      
  });
 
  gallery.update();
  $(".file-col").addClass('shown');
  

  }

  function clearFilePort(){
    $("#filePort").html('');
    $("#summaryPort").html('');
  }

  $(".list-group-item").click(function(){
    $(".list-group-item").removeClass('active');
    $(this).addClass('active');
    var i = $(this).data('id');
    
  });

  $("#areas").change(function(){
    $(".file-link").removeClass('active');
    var currentDir = $("#areas")[0].selectedIndex;
    clearFilePort();
    activeArea = accreAreas.find(x=>x.id===currentDir).accre_name;
    currentFileArr = files.filter(x=>x.accre_area===currentDir);
    if (currentFileArr.length > 0) {          
      contentPop(currentFileArr);
      }
      else {
        $("#filePort").append(
          '<div class="w-100 text-center fs-4 fw-light text-white">No Files Under This Directory</div>'
        );
      }
    const filterText = 'Showing '+currentFileArr.length+' file(s) under '+activeArea+' area'
   $("#filterText").text(filterText);
  });



  function filterPort(fileType){
   
    clearFilePort();
    if (currentFileArr.length > 0){
      switch(fileType){
        case "img":
          
          filterredArray = $.grep(currentFileArr, function(v){
              return (imgext.includes(v.file_ext));
          });
          imagePop(filterredArray);
          var filterText = 'Showing '+filterredArray.length+' Image(s) under '+activeArea+' area'
          $("#filterText").text(filterText);
        
          break;
          case 'pdf':
            filterredArray = $.grep(currentFileArr, function(v){
              return (v.file_ext === 'pdf');
          });
          contentPop(filterredArray);
          var filterText = 'Showing '+filterredArray.length+' PDF file(s) under '+activeArea+' area'
          $("#filterText").text(filterText);
        
          break;
         
            case 'doc':
              filterredArray = $.grep(currentFileArr, function(v){
                return (v.file_ext === 'doc' || v.file_ext === 'docx');
            });
            contentPop(filterredArray);
            var filterText = 'Showing '+filterredArray.length+' Word document(s) under '+activeArea+' area'
            $("#filterText").text(filterText);
            break;
  
            case 'xls':
              
              filterredArray = $.grep(currentFileArr, function(v){
                  return (v.file_ext === 'xls' || v.file_ext === 'xlsx');
              });
              contentPop(filterredArray);
              var filterText = 'Showing '+filterredArray.length+' Spreadsheet(s) under '+activeArea+' area'
              $("#filterText").text(filterText);
              break;
  
          default: break;
      }
    } 

  }


  $(".file-link").click(function(){
    $(".file-link").removeClass('active');
    $(this).addClass('active');
    filterPort($(this).data('type'));
  });





  function confirmLogout(){
    if (confirm('Are you sure you want to Log out?')){
        logout();
    }
  }


  $(document).ready(function(){
    
    $("#areas").val("0");
    getFiles();

  });