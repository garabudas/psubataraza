
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

function createCookie(name, value, years) { //function to save cookie
    var expires;
    if (years) {
        // var date = new Date();
        // date.setTime(date.getTime() + (days * 60 * 1000));
        var CookieDate = new Date;
        CookieDate.setFullYear(CookieDate.getFullYear() + years);

        expires = "; expires=" + CookieDate.toUTCString();

    
        // document.cookie = 'myCookie=to_be_deleted; expires=' + CookieDate.toUTCString() + ';'
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

function encode(str) {
    var encoded = "";
    str = btoa(str);
    str = btoa(str);
    for (i=0; i<str.length;i++) {
    var a = str.charCodeAt(i);
    var b = a ^ 10; // bitwise XOR with any number, e.g. 123
    encoded = encoded+String.fromCharCode(b);
    }
    encoded = btoa(encoded);
    return encoded;
}

        $("#showpw").click(function(){
            var x = document.getElementById("password");
            var g = $(this).children();
      
      if (x.type === "password") {
        x.type = "text";
        g.removeClass('fa-eye');
        g.addClass('fa-eye-slash');
      } else {
        x.type = "password";
        g.removeClass('fa-eye-slash');
        g.addClass('fa-eye');
      }
        });


        $(document).keyup(function(event) {
            if (event.which === 13) {
                $("#login").trigger("click");
            }
        });

        $("#login").click(function(){
            $('.form-control').removeClass('is-invalid');
            $('.text-danger').addClass('invisible');
            $(this).prop('disabled', true);
            $(this).text('Validating...');
            var user = $("#username");
            var pw = $("#password");
            var valid = true;
            //validate inputs
            if (user.val() === ""){
                //email is blank
                user.addClass('is-invalid');
                $("#user-blank").text('This field is required');
                $("#user-blank").removeClass('invisible');
                valid = false;
            }
    
     
    
            if (pw.val() === ""){
                //password is blank
                pw.addClass('is-invalid');
                $("#pw-blank").removeClass('invisible');
                valid = false;
                
            }
    
            if (valid === false) {
                //input validations failed
                $(this).prop('disabled', false);
                $(this).text('Login');
                return false;
            } else {
                //process the logins
                pwx = encode(pw.val());
                postLogin(user.val(), pwx);
            }
    
    
        });
        
     
    
        function postLogin(user, pwx){
         
           
            $.ajax({
            type: 'POST',
        
            url: 'php/user.php',
           
            crossDomain: true,
            data: {'user': user, 'pw': pwx},
            dataType: 'json',
            success: function(data) {
              
             
                if (data.result) {
               
                    var r = $("#flexCheckDefault").prop('checked');
          
                 
                    createCookie('usr_d', user, 5);
                    createCookie('userid', data.id, 5);
                    createCookie('usertype', data.usertype, 5);

                    if (r){
                        
                        createCookie('rmb', true, 5);
                    } else {
                        createCookie('rmb', false, 5);
                    }
                   
                    
                    if (data.usertype === "1"){

                        window.location.href="home";
                    } else {
                        window.location.href="accreditors";
                    }
              
                  
                } else {
                  
                    $("#invalid-login").removeClass('invisible');
                    $("#login").prop('disabled', false);
                    $("#login").text('Login');
                    return false;
                }
            },
            error: function(data, xhr,jqXHR, ajaxOptions, thrownError) {
                $("#invalid-login").removeClass('invisible');
                    $("#login").prop('disabled', false);
                    $("#login").text('Login');
                    return false;
                    console.log(xhr);
            }
    
            }); //end AJAX
        }


        $(document).ready(function(){
            var r = getCookie('rmb');
            var xx =getCookie('usr_d');
            if (r==="true" && xx != ''){
                window.location.href="home";
            } 
        });