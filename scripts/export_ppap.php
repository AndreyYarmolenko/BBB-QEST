<?php
	include_once "../settings.php";

/************************************************export PPAP Rewiev****************************************************************/
    function export_ppap($data, $sheet_header, $data_func=null, $sheet_header_func, $title, $file_name, $partNumb=null, $app=null, $descript_comp, $image1=null, $drawing2d=null, $drawing3d=null, $add_img=array(), $result_test_proc=array(), $sheet_header_proc){
      require_once '../import/PHPExcel-1.8/Classes/PHPExcel.php';
      $cell_lit = array("A", "B", "C", "D","E", "F","G", "H","I", "J","K", "L","M", "N","O", "P","Q", "R","S", "T","U", "V","W", "X","Y", "Z", "AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM");
      $phpexcel = new PHPExcel();
      $page = $phpexcel->setActiveSheetIndex(0);
      $order_arr = array();

      $styleArray = array(
          'borders' => array(
            'allborders' => array(
              'style' => PHPExcel_Style_Border::BORDER_THIN
            )
          )
        );

      //dimen. attr
      if(isset($data) && $data != null) {
          $column_width = array('critical'=>20, 'dimension_name'=>35, 'metric'=>15, 'dimension'=>15, 'tolerance_plus'=>20, 'tolerance_minus'=>20, 'tool_gage'=>20, 'procedure'=>20, 'actual1'=>10, 'actual2'=>10, 'actual3'=>10, 'actual4'=>10, 'actual5'=>10, 'actual6'=>10, 'actual7'=>10, 'actual8'=>10, 'actual9'=>10, 'actual10'=>10,'actual11'=>10, 'actual12'=>10, 'actual13'=>10, 'actual14'=>10, 'actual15'=>10, 'actual16'=>10, 'actual17'=>10, 'actual18'=>10, 'actual19'=>10, 'actual20'=>10, 'actual21'=>10, 'actual22'=>10, 'actual23'=>10, 'actual24'=>10, 'actual25'=>10, 'actual26'=>10, 'actual27'=>10, 'actual28'=>10, 'actual29'=>10, 'actual30'=>10);

          $k=0;
          foreach ($sheet_header as $key => $value) {
              $page->setCellValue($cell_lit[$k]."1", $value);
              $page->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
              $page->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('ff8000');
              $page->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
              $page->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
              $page->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
              $page->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
              $order_arr[$key] = $cell_lit[$k];
              $k++;
          }
          for($i=0; $i<count($data); $i++){
              $ind=$i+2;
              foreach($data[$i] as $key => $value) {
                  if(isset($order_arr[$key])){
                      $page->setCellValue($order_arr[$key].$ind, $value);
                      $page->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                      $ind_next = $ind+1;
                      $page->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
                  }
              }
          }
          
          $page->setTitle($title);
          $page->insertNewRowBefore(1, 17);

          $url = "../img/logo.png";
          $logo = new PHPExcel_Worksheet_Drawing();
          $logo->setPath($url);
          $logo->setWorksheet($page);
          $logo->setCoordinates("B1");
          
          //actual_value background
          for ($i = 0; $i < count($cell_lit); $i++) { 
              if($i > 7 && $page->getCell($cell_lit[$i]."18")->getValue() != "") {
                $page->getStyle($cell_lit[$i]."18")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $page->getStyle($cell_lit[$i]."18")->getFill()->getStartColor()->setRGB('ffbf00');           
              }
          }

          $page->setCellValueByColumnAndRow(4, 7, "BBB PPAP TESTPLAN");
          $page->getStyle('E7')->getFont()->setSize(16);
          $page->getStyle('A7:Z7')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('A7:Z7')->getFill()->getStartColor()->setRGB('ff8000');

          $page->setCellValueByColumnAndRow(0, 10, "BBB PART#");
          $page->setCellValueByColumnAndRow(1, 10, $partNumb);
          $page->setCellValueByColumnAndRow(0, 11, "Cardone PART#");
          $page->setCellValueByColumnAndRow(0, 12, "Applications");
          $page->setCellValueByColumnAndRow(1, 12, $app);
          $page->setCellValueByColumnAndRow(0, 13, "Revised by");
          $page->setCellValueByColumnAndRow(0, 14, "Part# where apply");
          $page->getStyle('A10:A14')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('A10:A14')->getFill()->getStartColor()->setRGB('ff8000');

          $page->setCellValueByColumnAndRow(3, 10, "Description");
          $page->setCellValueByColumnAndRow(4, 10, $descript_comp);
          $page->setCellValueByColumnAndRow(3, 11, "Supplier#");
          $page->setCellValueByColumnAndRow(3, 12, "Supplier Name");
          $page->setCellValueByColumnAndRow(3, 13, "Supplier Part#");
          $page->setCellValueByColumnAndRow(3, 14, "Disposition");
          $page->getStyle('D10:D14')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('D10:D14')->getFill()->getStartColor()->setRGB('ff8000');

          $page->setCellValueByColumnAndRow(6, 10, "PO#");
          $page->setCellValueByColumnAndRow(6, 11, "Evaluation Date");
          $page->setCellValueByColumnAndRow(6, 12, "Evaluation#");
          $page->setCellValueByColumnAndRow(6, 13, "Quality Approval#");
          $page->getStyle('G10:G13')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('G10:G13')->getFill()->getStartColor()->setRGB('ff8000');

          $page->setCellValueByColumnAndRow(3, 17, "Dimensional Attribute Table");
          $page->getStyle('D17')->getFont()->setSize(16);
          $page->getStyle('A17:H17')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('A17:H17')->getFill()->getStartColor()->setRGB('ff8000');

          $page->setCellValueByColumnAndRow(8, 17, "SAPPLIER SAMPLES:");
          $page->getStyle('I17')->getFont()->setSize(16);
          $page->getStyle('I17:K17')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page->getStyle('I17:K17')->getFill()->getStartColor()->setRGB('ffbf00');

          //img
          $position = $page->getHighestRow() + 5;
          $url = "../img/components/";

            if($image1 != "") {
                $page->setCellValueByColumnAndRow(3, $position, "Image1:");
                $page->getStyle('D'.$position)->getFont()->setSize(16);
                $img_1 = new PHPExcel_Worksheet_Drawing();
                $img_1->setPath($url.$image1);
                $img_1->setWorksheet($page);
                //$img_1->setHeight(100);
                $page->getRowDimension($position + 2)->setRowHeight($img_1->getHeight());
                $img_1->setCoordinates("C".($position + 2));
            }

            if($drawing2d != "") {
                $position = $page->getHighestRow() + 3;
                $page->setCellValueByColumnAndRow(3, $position, "Drawing 2d:");
                $page->getStyle('D'.$position)->getFont()->setSize(16);
                $draw_2 = new PHPExcel_Worksheet_Drawing();
                $draw_2->setPath($url.$drawing2d);
                $draw_2->setWorksheet($page);
                //$draw_2->setHeight(100);
                $page->getRowDimension($position + 2)->setRowHeight($draw_2->getHeight());
                $draw_2->setCoordinates("C".($position + 2));
            }

            if($drawing3d != "") {
                $position = $page->getHighestRow() + 3;
                $page->setCellValueByColumnAndRow(3, $position, "Drawing 3d:");
                $page->getStyle('D'.$position)->getFont()->setSize(16);
                $draw_3 = new PHPExcel_Worksheet_Drawing();
                $draw_3->setPath($url.$drawing3d);
                $draw_3->setWorksheet($page);
                //$draw_3->setHeight(100);
                $page->getRowDimension($position + 2)->setRowHeight($draw_3->getHeight());
                $draw_3->setCoordinates("C".($position + 2));
            }

          if(isset($add_img) && $add_img != null) {
            $position = $page->getHighestRow() + 3;
            $page->setCellValueByColumnAndRow(3, $position, "Other images:");
            $page->getStyle('D'.$position)->getFont()->setSize(16);
            for ($i = 0; $i < count($add_img); $i++) { 
                $add = new PHPExcel_Worksheet_Drawing();
                $add->setPath("../".$add_img[$i]);
                $add->setWorksheet($page);
                $page->getRowDimension($position + 2)->setRowHeight($add->getHeight());
                $add->setCoordinates("C".($position + 2));
                $position = $page->getHighestRow() + 3;
            }
          }
      }

      //func. attr
      if(isset($data_func) && $data_func != null) {
          $phpexcel->createSheet();
          $page_func = $phpexcel->setActiveSheetIndex(1);
          $page_func->setTitle("Functional");
          $styleArray = array(
              'borders' => array(
                'allborders' => array(
                  'style' => PHPExcel_Style_Border::BORDER_THIN
                )
              )
            );

          $column_width = array('critical'=>20, 'value_desc'=>35, 'metric'=>15, 'nominal'=>15, 'tolerance_plus'=>20, 'tolerance_minus'=>20, 'equipment'=>20, 'test_procedure'=>20, 'actual1'=>10, 'actual2'=>10, 'actual3'=>10, 'actual4'=>10, 'actual5'=>10, 'actual6'=>10, 'actual7'=>10, 'actual8'=>10, 'actual9'=>10, 'actual10'=>10,'actual11'=>10, 'actual12'=>10, 'actual13'=>10, 'actual14'=>10, 'actual15'=>10, 'actual16'=>10, 'actual17'=>10, 'actual18'=>10, 'actual19'=>10, 'actual20'=>10, 'actual21'=>10, 'actual22'=>10, 'actual23'=>10, 'actual24'=>10, 'actual25'=>10, 'actual26'=>10, 'actual27'=>10, 'actual28'=>10, 'actual29'=>10, 'actual30'=>10);

          $k=0;
          foreach ($sheet_header_func as $key => $value) {
              $page_func->setCellValue($cell_lit[$k]."1", $value);
              $page_func->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
              $page_func->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('ff8000');
              $page_func->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
              $page_func->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
              $page_func->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
              $page_func->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
              $order_arr[$key] = $cell_lit[$k];
              $k++;
          }
          for($i=0; $i<count($data_func); $i++){
              $ind=$i+2;
              foreach($data_func[$i] as $key => $value) {
                  if(isset($order_arr[$key])){
                      $page_func->setCellValue($order_arr[$key].$ind, $value);
                      $page_func->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                      $ind_next = $ind+1;
                      $page_func->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
                  }
              }
          }

          $page_func->insertNewRowBefore(1, 1);

          //actual_value background
          for ($i = 0; $i < count($cell_lit); $i++) { 
              if($i > 7 && $page_func->getCell($cell_lit[$i]."2")->getValue() != "") {
                $page_func->getStyle($cell_lit[$i]."2")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $page_func->getStyle($cell_lit[$i]."2")->getFill()->getStartColor()->setRGB('ffbf00');           
              }
          }

          $page_func->setCellValueByColumnAndRow(4, 1, "Functional Test");
          $page_func->setCellValueByColumnAndRow(1, 1, $partNumb);
          $page_func->getStyle('B1')->getFont()->setSize(16);
          $page_func->getStyle('E1')->getFont()->setSize(16);
          $page_func->getStyle('A1:H1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page_func->getStyle('A1:H1')->getFill()->getStartColor()->setRGB('ff8000');

          $page_func->setCellValueByColumnAndRow(8, 1, "SAPPLIER SAMPLES:");
          $page_func->getStyle('I1')->getFont()->setSize(16);
          $page_func->getStyle('I1:K1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page_func->getStyle('I1:K1')->getFill()->getStartColor()->setRGB('ffbf00');
        }

      //test procedures
      if(isset($result_test_proc) && $result_test_proc != null) {
          $phpexcel->createSheet();
          $page_test_proc = $phpexcel->setActiveSheetIndex(2);
          $page_test_proc->setTitle("Test Procedures");
          $styleArray = array(
              'borders' => array(
                'allborders' => array(
                  'style' => PHPExcel_Style_Border::BORDER_THIN
                )
              )
            );

        $column_width = array('test_procedure'=>20, 'spec_conditions'=>35, 'description'=>20, 'instruction'=>20);

          $k=0;
          foreach ($sheet_header_proc as $key => $value) {
              $page_test_proc->setCellValue($cell_lit[$k]."1", $value);
              $page_test_proc->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
              $page_test_proc->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('ff8000');
              $page_test_proc->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
              $page_test_proc->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
              $page_test_proc->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
              $page_test_proc->getStyle($cell_lit[$k]."1"/*.":".$cell_lit[$k]."2"*/)->applyFromArray($styleArray);
                if($cell_lit[$k] > "H") {
                    $page_test_proc->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                    $page_test_proc->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('ffbf00');
                }
              $order_arr[$key] = $cell_lit[$k];
              $k++;
          }
          for($i=0; $i<count($result_test_proc); $i++){
              $ind=$i+2;
              foreach($result_test_proc[$i] as $key => $value) {
                  if(isset($order_arr[$key])){
                      $page_test_proc->setCellValue($order_arr[$key].$ind, $value);
                      $page_test_proc->getStyle($order_arr[$key].$ind)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                      $ind_next = $ind+1;
                      $page_test_proc->getStyle($order_arr[$key].$ind/*.":".$order_arr[$key].$ind_next*/)->applyFromArray($styleArray);
                  }
              }
          }

          $page_test_proc->insertNewRowBefore(1, 1);
          $page_test_proc->setCellValueByColumnAndRow(1, 1, "Test Procedures");
          $page_test_proc->getStyle('B1')->getFont()->setSize(16);
          $page_test_proc->getStyle('A1:D1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
          $page_test_proc->getStyle('A1:D1')->getFill()->getStartColor()->setRGB('ff8000');
          $page_test_proc->getStyle('B1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

          $count = 3;
          $cell_func = 0;
          $cell_test = 0;
          for($i = 0; $i < count($data_func); $i++) {
                //$page_func->getCell('H'.$count)->getHyperlink()->setUrl("sheet://Test Procedures!A".$count);
                $val_func = $page_func->getCell('H'.$count)->getValue();
                $val_test = $page_test_proc->getCell('A'.$count)->getValue();
                if($val_func != "") $cell_func = $count;
                if($val_test != "") $cell_test = $count;

                if($page_func->getCell('H'.$cell_func)->getValue() == $page_test_proc->getCell('A'.$cell_test)->getValue()) $page_func->getCell('H'.$cell_func)->getHyperlink()->setUrl("sheet://Test Procedures!A".$cell_test);
                $count++;
          }
      }

      $objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
      $objWriter->save("../files/docs/".$file_name.".xlsx");
    }

    //обработка реквеста
    if(isset($_REQUEST['exportPPAP'])) {
        $func_store = "";
        $dim_store = "";
        if(isset($_REQUEST['storeDim']) && $_REQUEST['storeDim'] != "") $dim_store = json_decode(stripcslashes($_REQUEST['storeDim']));
        if(isset($_REQUEST['storeFunc']) && $_REQUEST['storeFunc'] != "") $func_store = json_decode(stripcslashes($_REQUEST['storeFunc']));
        if(isset($_REQUEST['app'])) $app = $_REQUEST['app'];
        if(isset($_REQUEST['partNumb'])) $partNumb = $_REQUEST['partNumb'];

        $query_img = "SELECT `description`, `image1`, `drawing2d`, `drawing3d`, `addImages` FROM bb_components WHERE `part_number` = '".$partNumb."'";
        if(!$stmt = $db->query($query_img)) echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
        else {
            $result = $stmt->fetch_array(MYSQL_ASSOC);
            $descript_comp = $result['description'];
            $image1 = $result['image1'];
            $drawing2d = $result['drawing2d'];
            $drawing3d = $result['drawing3d'];
            $add_img = $result['addImages'];
            $stmt->close();
        }
        $res_img = array();
        if($add_img != "") {
            $arr_add_img = json_decode(stripcslashes($add_img));
            if(count($arr_add_img) > 0) {
              foreach ($arr_add_img as $key => $value) {
                  foreach ($value as $key_img => $value_img) {
                      $data_prev_img[$key_img] = $value_img;
                  }
                  $data_img[] = $data_prev_img;
              }
              foreach ($data_img as $key => $value) {
                  foreach ($value as $key_res => $value_res) {
                      if($key_res == "src") $prev_res = $value_res;
                  }
                  $res_img[] = $prev_res;
              }
            }
        }

        //dimen. attr
        $data = array();
        $sheet_header = array('critical'=>'Critical','dimension_name'=>'Dimension Name', 'dimension'=>'Dimension', 'tolerance_plus'=>'Tolerance+', 'tolerance_minus'=>'Tolerance-', 'metric'=>'Units', 'tool_gage'=>'Tool/Gage', 'procedure'=>'Procedure(Links)', 'actual1'=>'Actual1', 'actual2'=>'Actual2', 'actual3'=>'Actual3', 'actual4'=>'Actual4', 'actual5'=>'Actual5', 'actual6'=>'Actual6', 'actual7'=>'Actual7', 'actual8'=>'Actual8', 'actual9'=>'Actual9', 'actual10'=>'Actual10','actual11'=>'Actual11', 'actual12'=>'Actual12', 'actual13'=>'Actual13', 'actual14'=>'Actual14', 'actual15'=>'Actual15', 'actual16'=>'Actual16', 'actual17'=>'Actual17', 'actual18'=>'Actual18', 'actual19'=>'Actual19', 'actual20'=>'Actual20', 'actual21'=>'Actual21', 'actual22'=>'Actual22', 'actual23'=>'Actual23', 'actual24'=>'Actual24', 'actual25'=>'Actual25', 'actual26'=>'Actual26', 'actual27'=>'Actual27', 'actual28'=>'Actual28', 'actual29'=>'Actual29', 'actual30'=>'Actual30');
        if($dim_store != "") {
            foreach ($dim_store as $key => $value) {
                foreach ($value as $key_obj => $value_obj) {
                    $data_prev[$key_obj] = $value_obj;
                    $data_prev['procedure'] = "";
                }
                if($data_prev['critical'] == 1) $data_prev['critical'] = "yes";
                else $data_prev['critical'] = "no";
                switch ($data_prev['metric']) {
                    case 1:
                    $data_prev['metric'] = "mm";
                    break;
                    case 2:
                    $data_prev['metric'] = "inch";
                    break;
                    case 3:
                    $data_prev['metric'] = "thread(mm)";
                    break;
                    case 4:
                    $data_prev['metric'] = "thread(inch)";
                    break;
                    case 5:
                    $data_prev['metric'] = "Grade";
                    break;
                    case 6:
                    $data_prev['metric'] = "Turns";
                    break;
                    case 7:
                    $data_prev['metric'] = "qty";
                    break;
                    case 8:
                    $data_prev['metric'] = "mic";
                    break;
                    case 9:
                    $data_prev['metric'] = "HRC";
                    break;
                }
                $data[] = $data_prev;
            }
            $sheet_diff = array_diff_key($sheet_header, $data[0]);
            foreach ($sheet_diff as $key => $value) {
                unset($sheet_header[$key]);
            }
        }
        
        //func. attr
        $test_proc = array();
        $data_func = array();
        $sheet_header_func = array('critical'=>'Critical','value_desc'=>'Value Desc', 'nominal'=>'Nominal', 'tolerance_plus'=>'Tolerance+', 'tolerance_minus'=>'Tolerance-', 'metric'=>'Units', 'equipment'=>'Equipment', 'test_procedure'=>'Test Procedure', 'actual1'=>'Actual1', 'actual2'=>'Actual2', 'actual3'=>'Actual3', 'actual4'=>'Actual4', 'actual5'=>'Actual5', 'actual6'=>'Actual6', 'actual7'=>'Actual7', 'actual8'=>'Actual8', 'actual9'=>'Actual9', 'actual10'=>'Actual10','actual11'=>'Actual11', 'actual12'=>'Actual12', 'actual13'=>'Actual13', 'actual14'=>'Actual14', 'actual15'=>'Actual15', 'actual16'=>'Actual16', 'actual17'=>'Actual17', 'actual18'=>'Actual18', 'actual19'=>'Actual19', 'actual20'=>'Actual20', 'actual21'=>'Actual21', 'actual22'=>'Actual22', 'actual23'=>'Actual23', 'actual24'=>'Actual24', 'actual25'=>'Actual25', 'actual26'=>'Actual26', 'actual27'=>'Actual27', 'actual28'=>'Actual28', 'actual29'=>'Actual29', 'actual30'=>'Actual30');
        if($func_store != "") {
            foreach ($func_store as $key => $value) {
                foreach ($value as $key_obj => $value_obj) {
                    $data_prev[$key_obj] = $value_obj;
                }
                if($data_prev['critical'] == 1) $data_prev['critical'] = "yes";
                else $data_prev['critical'] = "no";
                if($data_prev['test_procedure_id']) $test_proc[] = $data_prev['test_procedure_id'];
                switch ($data_prev['metric']) {
                    case 1:
                    $data_prev['metric'] = "V";
                    break;
                    case 2:
                    $data_prev['metric'] = "°F";
                    break;
                    case 3:
                    $data_prev['metric'] = "°C";
                    break;
                    case 4:
                    $data_prev['metric'] = "A";
                    break;
                    case 5:
                    $data_prev['metric'] = "cc";
                    break;
                    case 6:
                    $data_prev['metric'] = "Cycles";
                    break;
                    case 7:
                    $data_prev['metric'] = "gpm";
                    break;
                    case 8:
                    $data_prev['metric'] = "Grade";
                    break;
                    case 9:
                    $data_prev['metric'] = "in/lb";
                    case 10:
                    $data_prev['metric'] = "lb/in";
                    break;
                    case 11:
                    $data_prev['metric'] = "lb/ft";
                    break;
                    case 12:
                    $data_prev['metric'] = "Lb/in";
                    break;
                    case 13:
                    $data_prev['metric'] = "Lbs";
                    break;
                    case 14:
                    $data_prev['metric'] = "Mg";
                    break;
                    case 15:
                    $data_prev['metric'] = "N";
                    break;
                    case 16:
                    $data_prev['metric'] = "Nm";
                    break;
                    case 17:
                    $data_prev['metric'] = "psi";
                    break;
                    case 18:
                    $data_prev['metric'] = "S";
                    break;
                }
                $data_func[] = $data_prev;
            }
            $sheet_diff_func = array_diff_key($sheet_header_func, $data_func[0]);
            foreach ($sheet_diff_func as $key => $value) {
                unset($sheet_header_func[$key]);
            }
        }

        //test proced.
        if($test_proc != "") {
            $result_test_proc = array();
            foreach ($test_proc as $key => $value) {
                $query_test = "SELECT `test_procedure`, `spec_conditions`, `description`, `instruction` FROM bb_test_procedure WHERE `id` = $value";

                if(!$stmt = $db->query($query_test)) echo '{"success":false,"message":"'.$db->errno.' '.$db->error.'"}';
                else {
                    $result = $stmt->fetch_array(MYSQL_ASSOC);
                    $result_test_proc[] = $result;
                    $stmt->close();
                }
            }
        }

        $sheet_header_proc = array('test_procedure'=>'Name', 'spec_conditions'=>'Conditions', 'description'=>'Description', 'instruction'=>'Instruction');

        $file_name = "PPAP";
        export_ppap($data, $sheet_header, $data_func, $sheet_header_func, 'Dimensional', $file_name, $partNumb, $app, $descript_comp, $image1, $drawing2d, $drawing3d, $res_img, $result_test_proc, $sheet_header_proc);
        echo  json_encode(array('success'=>true)); 
        exit;
    }
    if(isset($_REQUEST['downloadPPAP'])){
        $File = "../files/docs/PPAP.xlsx";
        if (file_exists($File)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename='.basename($File));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($File));
            ob_clean();
            flush();
            readfile($File);
        }
        exit;
    }