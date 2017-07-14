<?php
include_once "../settings.php";
set_time_limit(240);

function exportExel($data, $sheet_header, $title, $file_name){
  require_once '../import/PHPExcel-1.8/Classes/PHPExcel.php';
  $cell_lit = array("A", "B", "C", "D","E", "F","G", "H","I", "J","K", "L","M", "N","O", "P", "R","S", "T","U", "V","W", "X","Y", "Z");
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

  $column_width = array('tasks_type'=>35, 'bbb_sku'=>15, 'request_id'=>15, 'STATUS'=>15, 'assigned_by'=>20, 'assignee'=>20, 'requested_date'=>20, 'assignment_date'=>20, 'due_date'=>20, 'completion_date'=>20, 'new_due_date'=>20);

  $k=0;
  foreach ($sheet_header as $key => $value) {
      $page->setCellValue($cell_lit[$k]."1", $value);
      $page->getStyle($cell_lit[$k]."1")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
      $page->getStyle($cell_lit[$k]."1")->getFill()->getStartColor()->setRGB('00BFFF');
      $page->getStyle($cell_lit[$k]."1")->getFont()->setSize(14);
      $page->getStyle($cell_lit[$k]."1")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
      $page->getColumnDimension($cell_lit[$k])->setWidth($column_width[$key]);
      $page->getStyle($cell_lit[$k]."1".":".$cell_lit[$k]."2")->applyFromArray($styleArray);
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
              $page->getStyle($order_arr[$key].$ind.":".$order_arr[$key].$ind_next)->applyFromArray($styleArray);
          }
      }
  }
  
  $page->setTitle($title); 

$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
$objWriter->save($file_name.".xlsx");
}

if(isset($_REQUEST['exportExel'])){
    $add_terms = "";
    $filter =  $_REQUEST['filter'];
    if(isset($_REQUEST['search'])){
      $term =  $_REQUEST['search'];
      $add_terms = " AND (u.name LIKE '%".$term."%' OR us.name LIKE '%".$term."%' OR 
            ot.`order_id` LIKE '%".$term."%' OR 
            tt.`tasks_type` LIKE '%".$term."%' OR DATE(ot.`requested_date`) LIKE '%".$term."%' OR DATE(ot.`assignment_date`) LIKE '%".$term."%' OR DATE(ot.`due_date`) LIKE '%".$term."%' OR DATE(ot.`completion_date`) LIKE '%".$term."%' OR DATE(ot.`new_due_date`) LIKE '%".$term."%')"; 
    }

    $query = "SELECT ot.task_id AS id, bs.`name` AS bbb_sku, bs.`id` AS bbb_sku_id, ot.order_id AS request_id, tt.id AS id_task_type, tt.tasks_type, u.name AS assignee, u.id AS assignee_id, us.name AS assigned_by, us.id AS assigned_by_id, DATE(requested_date) AS requested_date, DATE(assignment_date) AS assignment_date, DATE(due_date) AS due_date, DATE(completion_date) AS completion_date, DATE(new_due_date) AS new_due_date, st.name AS STATUS
            FROM bb_order_tasks ot
            LEFT JOIN bb_users u ON assignee = u.id
            LEFT JOIN bb_users us ON assigned_by = us.id
            LEFT JOIN bb_task_status st ON ot.status = st.task_status_id
            LEFT JOIN bb_tasks_sku ts ON ts.`RequestID` = ot.`order_id`
            LEFT JOIN bb_bbb_sku bs ON bs.`id` = ts.`bbb_sku_id`                              
            INNER JOIN bb_tasks_type tt ON tt.id = ot.task_type
            WHERE ot.status IN (".$filter.") ".$add_terms;
    $rows =$db->query($query);
    while ($result = $rows->fetch_array(MYSQL_ASSOC)){
      $data[] = $result;
    }
    $sheet_header = array('tasks_type'=>'Task Type', 'bbb_sku'=>'BBB SKU#', 'request_id'=>'RequestID', 'STATUS'=>'Status', 'assigned_by'=>'Responsible', 'assignee'=>'Assigned To', 'requested_date'=>'Requested Date', 'assignment_date'=>'Assignment Date', 'due_date'=>'Due Date', 'completion_date'=>'Completion Date', 'new_due_date'=>'New Due Date');
    $file_name = "export";
    exportExel($data, $sheet_header, 'All Tasks', $file_name);
    echo  json_encode(array('success'=>true)); 
    exit;
}

if(isset($_REQUEST['downloadExel'])){
  $File = "export.xlsx";
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
?>