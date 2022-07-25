// JS FILE handler for modal events

var dirModal = document.getElementById('dirModal')
dirModal.addEventListener('shown.bs.modal', function (event) {
    var n = dir.find(x=>x.dir_idx === currentDir).dir_name;
    $(".active-dir").text(n);
})

var fileModal = document.getElementById('fileModal')
fileModal.addEventListener('shown.bs.modal', function (event) {
    var n = dir.find(x=>x.dir_idx === currentDir).dir_name;
    $(".active-dir").text(n);
})




function saveDir(){
    $d = $("#dirName");
    $d.removeClass('is-invalid');
    $("#btn-saveDir").prop('disabled', true);
    $("#btn-saveDir").text('Saving...');
    $(".dir-error").text('');
    $(".dir-success").text('');

    var cd = dir.filter(x=>x.dir_parent===currentDir);
    
    console.log(cd);
    if ($d.val() === ""){
        $d.addClass('is-invalid');
        $(".dir-error").text('Please Input a directory name');
        $("#btn-saveDir").prop('disabled', false);
        $("#btn-saveDir").text('Save New Folder');
        return false;
    } else if (cd.filter(e => e.dir_name === $d.val()).length > 0) {
        $d.addClass('is-invalid');
        $(".dir-error").text('A Directory with a similar name already exists');
        $("#btn-saveDir").prop('disabled', false);
        $("#btn-saveDir").text('Save New Folder');
    } else {
        //save the new directory
        $.ajax({
            type: 'POST',
           
            url: 'php/directories.php',
            data: {a:2, dirName: $d.val(), parent: currentDir, creator: activeUser},
            crossDomain: true,
            dataType: 'json',
            success: function(data) {

                if (data.result){
                    console.log(data);
                    
                    var nd = {dir_idx: data.idx, created_by: activeUser, created_at: data.insertDate, dir_name: $d.val(), dir_parent: currentDir}
                    dir.push(nd);
                    contentPop();
                    $(".dir-success").text(data.message);
                } else {
                    $(".dir-error").text(data.message);
                }
                
                
              
            }
    
        }); //END AJAX
        $("#btn-saveDir").prop('disabled', false);
        $("#btn-saveDir").text('Save New Folder');
    }

}


async function saveFile(){
    $(".file-stat").text("");
    var x = document.getElementById('accFile');
    var n = x.files[0].name


    let formData = new FormData(); 
  formData.append("file", x.files[0]);
//   formData.append("fileName", $("#accFileName").val());
  formData.append("accArea", $("#accArea").val());
  formData.append("a", 2);
  formData.append("parent", currentDir);
  formData.append("creator", activeUser);
  await fetch('php/files.php', {
    method: "POST", 
    body: formData
  }).then(response=>response.json())
  .then(data=>{
    if (data.result){
        var f = {accre_area: $("#accArea").val(), created_at: data.insertDate, created_by: activeUser, file_ext: data.ext, file_idx: data.idx, file_name: n, parent_dir: currentDir}
        files.push(f);
        contentPop();
        $(".file-success").text(data.message);
    } else {
        $(".file-error").text(data.message);
    }
  
  }); 
 
}

