<?php
    $componentArr['part_number'] = $_REQUEST['part_number'];
    $componentArr['division'] = $_REQUEST['division'];
    $componentArr['finish_good'] = $_REQUEST['finish_good'];
    $componentArr['revision'] =  $_REQUEST['revision'];
    $componentArr['description'] =  $_REQUEST['description'];
    $componentArr['material'] =  $_REQUEST['material'];
    $componentArr['image1'] =  $_REQUEST['image1'];
    $componentArr['drawing2d'] =  $_REQUEST['drawing2d'];
    $componentArr['drawing3d'] =  $_REQUEST['drawing3d'];
    $componentArr['add_spec'] =  $_REQUEST['add_spec'];
    $componentArr['addImages'] =  $_REQUEST['addImages'];
    $dim_js = $_REQUEST['DimAttr'];
    $func_js = $_REQUEST['FuncAttr'];

$result = saveComponent($componentArr, $dim_js, $func_js, false);
echo json_encode($result);
exit;