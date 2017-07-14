<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 06.10.2016
 * Time: 13:45
 */
session_start();
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);


$id_user = $_SESSION['id'];
$login = $_SESSION['login'];
$VALUES = array();
include_once "../../settings.php";
include_once "../saveform_func.php";

if(isset($_REQUEST['edit'])){

    // Значения по умолчанию
    $table = $_REQUEST['table'];

    $where = 'RequestID = '.$_REQUEST['RequestID'];
    if(!empty($_REQUEST['idx'])){
        $where .= " AND idx = ".$_REQUEST['idx'];
    }
    $data = array();
    $data['RequestID'] = $_REQUEST['RequestID'];
    $data['id_user'] = $id_user;

    // Отсеиваем необходимые данные
    switch ($table) {
        case 're_start_pr_epi':
            // Костыль !!!
            $_REQUEST['idx'] = true;
            // <--- --- ---

            $data['material_cost'] = $_REQUEST['material_cost'];

            $data['pc_type'] = $_REQUEST['pc_type'];
            $data['pct_id'] = $_REQUEST['pct_id'];
            $data['pct_lwh'] = $_REQUEST['pct_lwh'];
            $data['pct_wt'] = $_REQUEST['pct_wt'];
            $data['pct_material'] = $_REQUEST['pct_material'];

            $data['d_type'] = $_REQUEST['d_type'];
            $data['dt_id'] = $_REQUEST['dt_id'];
            $data['dt_lwh'] = $_REQUEST['dt_lwh'];
            $data['dt_wt'] = $_REQUEST['dt_wt'];
            $data['dt_material'] = $_REQUEST['dt_material'];

            $data['d_type2'] = $_REQUEST['d_type2'];
            $data['dt2_id'] = $_REQUEST['dt2_id'];
            $data['dt2_lwh'] = $_REQUEST['dt2_lwh'];
            $data['dt2_wt'] = $_REQUEST['dt2_wt'];
            $data['dt2_material'] = $_REQUEST['dt2_material'];

            $data['sc_type'] = $_REQUEST['sc_type'];
            $data['sct_id'] = $_REQUEST['sct_id'];
            $data['sct_lwh'] = $_REQUEST['sct_lwh'];
            $data['sct_wt'] = $_REQUEST['sct_wt'];
            $data['sct_material'] = $_REQUEST['sct_material'];

            $data['p_stack'] = $_REQUEST['p_stack'];
            $data['rpi_method'] = $_REQUEST['rpi_method'];
            $data['pbh_handler'] = $_REQUEST['pbh_handler'];

            $data['sp_quantity'] = $_REQUEST['sp_quantity'];
            $data['no_lc'] = $_REQUEST['no_lc'];
            $data['no_lon'] = $_REQUEST['no_lon'];

            $data['p_weight'] = $_REQUEST['p_weight'];
            $data['pcg_weight'] = $_REQUEST['pcg_weight'];
            $data['scg_weight'] = $_REQUEST['scg_weight'];
            $data['mtc_load'] = $_REQUEST['mtc_load'];
            $data['material_once'] = $_REQUEST['material_once'];

            $filepath = "../../img/rev_eng_start/epi/";
            $fileurl = "./img/rev_eng_start/epi/";

            if (!empty($_FILES['po_photo']['name']))
                $data['photo1'] = em_image_upload($_FILES['po_photo'], $filepath, $fileurl);
            if (!empty($_FILES['dppb_photo']['name']))
                $data['photo2'] = em_image_upload($_FILES['dppb_photo'], $filepath, $fileurl);
            if (!empty($_FILES['psul_photo']['name']))
                $data['photo3'] = em_image_upload($_FILES['psul_photo'], $filepath, $fileurl);

            $flag_name = 'pr_flag';
            break;

        case 're_start_attr_msg':
            $data['bbbNumber'] = $_REQUEST['bbbNumber'];
            $data['status'] = $_REQUEST['status'];
            $data['gm_part'] = $_REQUEST['gm_part'];
            $data['acd_part'] = $_REQUEST['acd_part'];
            $data['sgb_input'] = $_REQUEST['sgb_input'];
            $data['sgb_output'] = $_REQUEST['sgb_output'];
            $data['sgb_mounting'] = $_REQUEST['sgb_mounting'];
            $data['sgb_turns'] = $_REQUEST['sgb_turns'];
            $data['quality_assurance'] = $_REQUEST['quality_assurance'];
            $data['new_components'] = $_REQUEST['new_components'];

            $flag_name = 'attr_flag';
            break;
        case 're_start_attr_psg':
            $data['bbbNumber'] = $_REQUEST['bbbNumber'];
            $data['status'] = $_REQUEST['status'];
            $data['gm_part'] = $_REQUEST['gm_part'];
            $data['acd_part'] = $_REQUEST['acd_part'];
            $data['sgb_input'] = $_REQUEST['sgb_input'];
            $data['sgb_output'] = $_REQUEST['sgb_output'];
            $data['sgb_mounting'] = $_REQUEST['sgb_mounting'];
            $data['sgb_turns'] = $_REQUEST['sgb_turns'];
            $data['quality_assurance'] = $_REQUEST['quality_assurance'];
            $data['new_components'] = $_REQUEST['new_components'];
            $data['psgbl_size'] = $_REQUEST['psgbl_size'];
            $data['hp_type'] = $_REQUEST['hp_type'];
            $data['comments'] = $_REQUEST['comments'];

            $flag_name = 'attr_flag';
            break;
        case 're_start_attr_mrp':
        case 're_start_attr_prp':
            $data['bbbNumber'] = $_REQUEST['bbbNumber'];
            $data['status'] = $_REQUEST['status'];
            $data['gm_part'] = $_REQUEST['gm_part'];
            $data['acd_part'] = $_REQUEST['acd_part'];
            $data['overal_lenght'] = $_REQUEST['overal_lenght'];
            $data['rpis_lenght'] = $_REQUEST['rpis_lenght'];
            $data['rpis_size'] = $_REQUEST['rpis_size'];
            $data['rpm_holes'] = $_REQUEST['rpm_holes'];
            $data['finish'] = $_REQUEST['finish'];
            $data['rack_type'] = $_REQUEST['rack_type'];
            $data['quality_assurance'] = $_REQUEST['quality_assurance'];
            $data['new_components'] = $_REQUEST['new_components'];

            $flag_name = 'attr_flag';
            break;
        case 're_start_attr_pspwr':
        case 're_start_attr_pspwor':
            $data['bbbNumber'] = $_REQUEST['bbbNumber'];
            $data['status'] = $_REQUEST['status'];
            $data['gm_part'] = $_REQUEST['gm_part'];
            $data['acd_part'] = $_REQUEST['acd_part'];

            $data['pspl_size'] = $_REQUEST['pspl_size'];
            $data['psps_type'] = $_REQUEST['psps_type'];
            $data['psgbl_size'] = $_REQUEST['psgbl_size'];
            $data['quality_assurance'] = $_REQUEST['quality_assurance'];
            $data['new_components'] = $_REQUEST['new_components'];
            $data['renew_components'] = $_REQUEST['renew_components'];

            $flag_name = 'attr_flag';
            break;

        // Особый случай
        case 're_start_ce_spci':
            // Костыль !!!
            $_REQUEST['idx'] = true;
            // <--- --- ---

            $data['json_table'] = $_REQUEST['json_table'];
            $flag_name = 'ce_flag';
            break;
        default:
            $json = array('success' => false, 'default' => true);
            echo json_encode($json);
            exit;
    }


    $table = "bb_".$table;

    // Проверка на сущестование записей в таблице
    $query = "SELECT COUNT(*) as `count` FROM ".$table." WHERE ".$where;
    $result = em_query($query);
    $row = $result->fetch_assoc();
    $result->close();

    // Если запись не существует, добавляем
    if($row['count'] < 1 || empty($_REQUEST['idx'])){
        em_insert($table, $data);
    } else {
        em_update($table, $data, $where);
    }

    $parent_table = "bb_reverse_engineering_start";

    if(!em_empty_in_array($data)) $re_start_data[$flag_name] = 0;
    else $re_start_data[$flag_name] = 1;

    $re_start_where = 'RequestID = '.$_REQUEST['RequestID'];
    em_update($parent_table, $re_start_data, $re_start_where);

    // Оповещяем о успешно выполненой работе
    $json = array('success'=>true, 'draft'=>$re_start_data[$flag_name]);
    echo json_encode($json);
    exit;
}

if(isset($_REQUEST['view'])){

    // Значения по умолчанию
    $table = 'bb_'.$_REQUEST['table'];

    $where = 'RequestID = '.$_REQUEST['RequestID'];
    $data = array();
    $select = $join = null;

    switch ($_REQUEST['table']){
        case 're_start_pr_epi':
            $select = "material_cost,"
                ." pc_type, pct_id, pct_lwh, pct_wt, pct_material,"
                ." d_type, dt_id, dt_lwh, dt_wt, dt_material,"
                ." d_type2, dt2_id, dt2_lwh, dt2_wt, dt2_material,"
                ." sc_type, sct_id, sct_lwh, sct_wt, sct_material,"
                ." p_stack, rpi_method, pbh_handler,"
                ." sp_quantity, no_lc, no_lon,"
                ." p_weight, pcg_weight, scg_weight, mtc_load, material_once,"
                ." photo1, photo2, photo3";
            break;

        case 're_start_attr_msg':
            $select = "idx, bbbNumber, status,"
                ." gm_part, acd_part, sgb_input, sgb_output,"
                ." sgb_mounting, sgb_turns, quality_assurance, new_components";
            break;
        case 're_start_attr_psg':
            $select = "idx, bbbNumber, status,"
                ." gm_part, acd_part, sgb_input, sgb_output,"
                ." sgb_mounting, sgb_turns, quality_assurance, new_components,"
                ." psgbl_size, hp_type, comments";
            break;
        case 're_start_attr_mrp':
        case 're_start_attr_prp':
            $select = "idx, bbbNumber, status,"
                ." gm_part, acd_part, overal_lenght, rpis_lenght,"
                ." rpis_size, rpm_holes, finish, rack_type,"
                ." quality_assurance, new_components";
            break;
        case 're_start_attr_pspwr':
        case 're_start_attr_pspwor':
            $select = "idx, bbbNumber, status,"
                ." gm_part, acd_part, pspl_size, psps_type, psgbl_size,"
                ." quality_assurance, new_components, renew_components";
            break;

        // Особый случай
        case 're_start_ce_spci':
            $select = "json_table";

            // Получаем данные из БД
            $query = "SELECT ".$select." FROM ".$table." ".$join." WHERE ".$where;
            $result = em_query($query);
            $data = $result->fetch_array(MYSQLI_ASSOC);
            $result->close();

            // Оповещяем о успешно выполненой работе
            echo $data['json_table'];
            exit;
            break;
        default:
            $select = "*";
            break;
    }



    // Получаем данные из БД
    $query = "SELECT ".$select." FROM ".$table." ".$join." WHERE ".$where;
    if($result = em_query($query)){
        while($row = $result->fetch_array(MYSQLI_ASSOC)){
            $data[] = $row;
        }
        $result->close();
    } else die($db->error);

    if(empty($data)) $data[] = array('bbbNumber'=>'1');
    // Оповещяем о успешно выполненой работе
    echo json_encode($data);
    exit;
}

function em_empty_in_array($array){
    foreach ($array as $value) if(trim($value) == '') return false;
    return true;
}

function em_image_check($file){
    $max_size = 1024*2*1024;
    $allowedExts = array("gif", "jpeg", "jpg", "png");
    $temp = explode(".",$file['name']);
    $extension = end($temp);

    if($file['size'] > $max_size){
        echo '{"success":false,"message":"File('.$file['name'].') size exceeds '.($max_size/1024).'MB"}';
        exit;
    }
    if(!in_array($extension, $allowedExts)){
        echo '{"success":false,"message":"File('.$file['name'].') does not have the correct extension('.$extension.')"}';
        exit;
    }
    if($file['error'] > 0){
        echo '{"success":false,"message":"Error code of image('.$file['name'].'): '.$file['error'].'"}';
        exit;
    }
    /*
    $file_path = $file_path.$file['name'].'_'.date("ymdHis");
    move_uploaded_file($file['tmp_name'], $file_path);
    echo '{"success":true,"filepath":"'.$file_path.'"}';
    */
    return true;
}
function em_image_upload($file, $file_path, $file_path_url){
    em_image_check($file);
    $filename = str_replace(" ", "_", $file['name']);
    $filename = date("ymdHis")."_".$filename;
    $file_path = $file_path.$filename;
    file_put_contents($file_path, file_get_contents($file['tmp_name']));
    return $file_path_url.$filename;
}