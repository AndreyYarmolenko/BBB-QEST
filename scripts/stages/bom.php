<?php
$bom['ProductType'] = $_REQUEST['ProductType'];
$bom['ProductLine'] = $_REQUEST['ProductLine'];
$bom['revision'] = $_REQUEST['revision'];
$bom['bom_id'] = $_REQUEST['bom_id'];
$bom['sku_name'] = $_REQUEST['sku_name'];
$bom['sku_id'] = $_REQUEST['sku_id'];
$bom['bom']  = $_REQUEST['bom'];
$action = $_REQUEST['action'];
$case_type = $_REQUEST['case_type'];
$result = saveBOM($bom, $action, $case_type);
echo json_encode($result);
exit;
