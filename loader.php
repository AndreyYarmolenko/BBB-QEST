<?php

$file = null;
$g = $_GET['g'];
switch ($g){
    case 'store':
        $file .= file_get_contents("scripts/store.js");
        $file .= file_get_contents("scripts/functions.js");
        $file .= file_get_contents("scripts/itemformref.js");
        $file .= file_get_contents("scripts/rev_eng_start/main.js");
        $file .= file_get_contents("scripts/rev_eng_start/physical_attr_table.js");
        //$file .= file_get_contents("scripts/rev_eng_start/pack_requirements.js");
        $file .= file_get_contents("scripts/rev_eng_start/core_analasys.js");
        break;
    case 'all':
        $file .= file_get_contents("scripts/addForm.js");
        $file .= file_get_contents("scripts/grid.js");
        $file .= file_get_contents("scripts/windowformref.js");
        $file .= file_get_contents("scripts/bbb_courier.js");
        $file .= file_get_contents("scripts/Rights.js");
        $file .= file_get_contents("scripts/Roles.js");
        $file .= file_get_contents("scripts/Task_status.js");
        $file .= file_get_contents("scripts/Task_type.js");
        $file .= file_get_contents("scripts/groups.js");
        $file .= file_get_contents("scripts/product_types.js");
        $file .= file_get_contents("scripts/product_line.js");
        $file .= file_get_contents("scripts/family_type.js");
        $file .= file_get_contents("scripts/test_procedure.js");
        $file .= file_get_contents("scripts/Order_status.js");
        $file .= file_get_contents("scripts/Clients.js");
        $file .= file_get_contents("scripts/Order.js");
        $file .= file_get_contents("scripts/Order_tasks.js");
        $file .= file_get_contents("scripts/progress.js");
        $file .= file_get_contents("scripts/progress2.js");
        $file .= file_get_contents("scripts/progressworkflow.js");
        $file .= file_get_contents("scripts/item_ECR.js");
        $file .= file_get_contents("scripts/item_reverse_eng.js");
        $file .= file_get_contents("scripts/components.js");
        $file .= file_get_contents("scripts/item_PPAPtest.js");
        $file .= file_get_contents("scripts/bom.js");
        $file .= file_get_contents("scripts/item_process_design_start.js");
        $file .= file_get_contents("scripts/tools_directory.js");
        $file .= file_get_contents("scripts/equipment_directory.js");
        $file .= file_get_contents("scripts/workstation_directory.js");
        //$file .= file_get_contents("scripts/process_operation.js");
        $file .= file_get_contents("scripts/operations_directory.js");
        $file .= file_get_contents("scripts/charts.js");
        $file .= file_get_contents("scripts/workflow.js");
        $file .= file_get_contents("scripts/changePassword.js");
        $file .= file_get_contents("scripts/localization.js");
        $file .= file_get_contents("scripts/form_header.js");
        $file .= file_get_contents("scripts/itemDirectory.js");
        $file .= file_get_contents("scripts/item_due_diligence.js");
        $file .= file_get_contents("scripts/get_tooling_equipment_workstation_request.js");
        $file .= file_get_contents("scripts/history.js");
        $file .= file_get_contents("scripts/getAllTasks.js");
        $file .= file_get_contents("scripts/pack_requirements.js");
        $file .= file_get_contents("scripts/capa_request.js");
        $file .= file_get_contents("scripts/reports/reportsStore.js");
        $file .= file_get_contents("scripts/reports/managerReport.js");
        $file .= file_get_contents("scripts/reports/orgStatus.js");
        $file .= file_get_contents("scripts/reports/userList.js");
        $file .= file_get_contents("scripts/reports/compReport.js");
        $file .= file_get_contents("scripts/process_directory.js");
        $file .= file_get_contents("scripts/job_description.js");
        break;
}
echo $file;