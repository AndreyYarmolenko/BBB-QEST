<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

include('settings.php');
include('logger.php');
require_once("scripts/saveform_func.php");

$error = false;
$message = '';

/* if(isset($_COOKIE['_login_eisiu'])){
  $login = $_COOKIE['_login_eisiu'];
  }else{ $login = ""; } */

if (isset($_POST['login'])) {
    $login = trim($_POST['login']);
    $password = trim($_POST['password']);
    //echo $login;
    if (!get_magic_quotes_gpc()) {
        $login = addslashes($login);
        $password = addslashes($password);
    }

	if (($login || $login != '') && ($password || $password != '')) {
        $query = "SELECT COUNT(u.`id`), u.`id`, u.`login`, u.`locale`, u.`instance`, u.`active`, u.`gmt` FROM `bb_users` u WHERE u.`login`='" . $login . "' AND u.`password`='" . md5($password)."'";
            //writeToLogFile(date('Y-m-d H:i:s').' | '.$msg);
            if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($count, $id, $login, $locale, $instance, $active, $gmt);
                $stmt->fetch();
                $stmt->close();
                writeToLogDB($id, $query);
                if ($count > 0) {
                    if($active == 1){
                        $_SESSION['id'] = $id;
                        $_SESSION['login'] = $login;
                        $_SESSION['locale'] = $locale;
                        $_SESSION['instance'] = $instance;
                        $_SESSION['rights'] = json_encode(getRightsByRole(getRolesIds($id)));
                        $_SESSION['gmt'] = $gmt;
                        $db->close();
                        header("Location: index.php");
                        exit;
                    }else{
                        $error = true;
                        $message = 'Login is blocked';
                    }
                } else {
                    $error = true;
                    $login = $login;
                    $message = 'Incorrect login or password';
                }
            } else {
                $db->close();
                $error = true;
                $message = 'Connect error';
            }
        
    }else{
		$error = true;
		$message = 'Incorrect login or password';
	}
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>

        <style type="text/css">
            #wrapper, #container {
                height: 500px;
                width: 465px;
            }

            #wrapper {
                bottom: 50%;
                right: 51%;
                position: absolute;
            }

            #container {
                /*background: url(images/login-box-backg.png) no-repeat left top;*/
                left: 49%;
                padding: 10px;
                position: relative;
                top: 50%;
                padding-top: 112px;
            }

            input{
                width:181px;
				padding: 8px 0px;
                color: #2CAFE3;
                font: bold 15px Calibri, Arial;
                text-align: center;
            }

            #enter{
                width: 181px;
				border:1px solid #15aeec; -webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;
                font-size:15px; font-family:Calibri, Arial; padding: 10px 0px; text-decoration:none; display:inline-block;text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; color: #FFFFFF;
                background-color: #49c0f0; background-image: -webkit-gradient(linear, left top, left bottom, from(#49c0f0), to(#2CAFE3));
                background-image: -webkit-linear-gradient(top, #49c0f0, #2CAFE3);
                background-image: -moz-linear-gradient(top, #49c0f0, #2CAFE3);
                background-image: -ms-linear-gradient(top, #49c0f0, #2CAFE3);
                background-image: -o-linear-gradient(top, #49c0f0, #2CAFE3);
                background-image: linear-gradient(to bottom, #49c0f0, #2CAFE3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#49c0f0, endColorstr=#2CAFE3);
            }

            #enter:hover{
                border:1px solid #1090c3;
                background-color: #1ab0ec; background-image: -webkit-gradient(linear, left top, left bottom, from(#1ab0ec), to(#1a92c2));
                background-image: -webkit-linear-gradient(top, #1ab0ec, #1a92c2);
                background-image: -moz-linear-gradient(top, #1ab0ec, #1a92c2);
                background-image: -ms-linear-gradient(top, #1ab0ec, #1a92c2);
                background-image: -o-linear-gradient(top, #1ab0ec, #1a92c2);
                background-image: linear-gradient(to bottom, #1ab0ec, #1a92c2);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#1ab0ec, endColorstr=#1a92c2);
            }

            .login_tbl{
                /*color:#6FA10A;*/
                text-align:center;
                font: bold 18px Calibri, Arial;
				
            }
			form{
				
			}

        </style>
		
		<script type="text/javascript">
			function valid()
			{
			var tel = document.getElementById("inp_login").value;
			var re = /[^\d]/g;
			if (re.test(tel)){
				var value = tel.replace(re, '');
				document.getElementById("inp_login").value=value;
			}
			}
		</script>
		
    </head>
    <body OnLoad="">

        <div id="wrapper">
            <div id="container">

                <form action="login.php" method="post" name="form1">
                    <table class="login_tbl" cellpadding="2" cellspacing="0" align="center">
                        <tr><td align="center"><img src="img/logoBBB.png" /></td></tr>
                        <tr><td align="center">Login:</td></tr>
                        <tr>
                            <td><input id="inp_login" type="text" tabindex="1" name="login" maxlength="20" size="10" value="" autocomplete="off" ></td>
                        </tr>
                        <tr><td align="center">Password:</td></tr>
                        <tr>
                            <td><input id="inp_pass" type="password" tabindex="2" name="password" value="" autocomplete="off" ></td>
                        </tr>
                        <tr><td align="center">
                                <?php if ($error) {
                                    $error = false; ?>
                                    <!--span style="color: red; font-size:12px;">Неверный логин или пароль</span-->
                                    <span style="color: red; font-size:12px;"><?php echo $message; ?></span>
                                <?php }; ?>

                        <tr>
                            <td colspan="2" style="text-align:center">
                                <div name="enter" onclick="javascript:document.forms[0].submit();">
                                </div>
                                <button id="enter" type="submit" tabindex="3" >Login</button>    
                            </td>
                        </tr>

                        </td></tr>
                        <!--tr><td align="center" style="font-size:12px;" >
                                <img  style="margin:0 0 -9px 0;" src="img/hint.png" /> Увага! При першому вході вказуйте тільки ЄДРПОУ. Пароль залишайте пустим.
                            </td></tr-->

                    </table>
                </form>
            </div>
        </div>                       



    </body>
</html>
