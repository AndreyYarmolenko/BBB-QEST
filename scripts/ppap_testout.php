<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

include('../settings.php');

$error = false;
$message = '';

if (isset($_GET['task']) &&isset($_GET['hash'])) {
    $hash = $_GET['hash'];
    $finish = null;
    if(isset($_GET['fg'])){
        $finish = $_GET['fg'];
    }
    if(strlen($hash)!=32) {echo '{"success":false,"message":"Invalid hash"}'; exit;}
    unset ($_SESSION['idx2']);
    unset ($_SESSION['id_part_number']);
    unset ($_SESSION['task']);
    unset ($_SESSION['outsource_name']);
    unset ($_SESSION['dim_test']);
    unset ($_SESSION['func_test']);
    unset ($_SESSION['qty']);
    unset ($_SESSION['outsource_draft']);
    unset ($_SESSION['files']);

    if(!$finish) $table = '`bb_ppap_review`';
        else $table = "`bb_ppap_finished_good_review`";

    $query = "SELECT COUNT(`idx`), `idx`, `id_part_number`, `outsource_name`, `dim_test`, `func_test`, `qty`, `outsource_draft`, `files` FROM ".$table." WHERE `hash` = '".$hash."' AND `idx` = ".$_GET['task']." ";
           if ($stmt = $db->prepare($query)) {
                $stmt->execute();
                $stmt->bind_result($count, $idx2,  $id_part_number, $outsource_name, $dim_test, $func_test, $qty, $outsource_draft, $files);
                $stmt->fetch();
                $stmt->close();
             if ($count > 0) {
                        $_SESSION['idx2'] = $idx2;
                        $_SESSION['id_part_number'] = $id_part_number;
                        $_SESSION['task'] = $_GET['task'];
                        $_SESSION['outsource_name'] = $outsource_name;
                        $_SESSION['dim_test'] = $dim_test;
                        $_SESSION['func_test'] = $func_test;
                        $_SESSION['qty'] = $qty;
                        $_SESSION['outsource_draft'] = $outsource_draft;
                        $_SESSION['files'] = $files;
						$_SESSION['fg'] = $finish;
                        if(!isset($_SESSION['id'])) {
                            $_SESSION['id'] = 1000000;
                            $_SESSION['rights'] = null;
                        }

             }
             else exit;
                $db->close();
        }
    } else exit;
?>

<!DOCTYPE html>
<html>
    <head>
        <title></title>
<SCRIPT type="text/javascript">
    var task_id = '<?php echo $_SESSION['task'];?>'; 
    var part_number_id = '<?php echo $_SESSION['id_part_number'];?>';
    var outsource_name = '<?php echo $_SESSION['outsource_name'];?>';
    var dim_test = '<?php echo $_SESSION['dim_test'];?>';
    var func_test = '<?php echo $_SESSION['func_test'];?>';
    var qty = '<?php echo $_SESSION['qty'];?>';
    var outsource_draft = '<?php echo $_SESSION['outsource_draft'];?>';
    var files = '<?php echo $_SESSION['files'];?>';
	var finish = '<?php echo $_SESSION['fg'];?>';
</SCRIPT>
<SCRIPT type="text/javascript" src="../jquery.js"></SCRIPT>
<script type="text/javascript" src="../ext-5.1.3/build/ext-all.js"></script> 

<link rel="stylesheet" type="text/css" href="../ext-5.1.3/build/packages/ext-theme-neptune-touch/build/resources/ext-theme-neptune-touch-all.css">
<script type="text/javascript" src="../ext-5.1.3/build/packages/ext-theme-neptune-touch/build/ext-theme-neptune-touch.js"></script>

<link rel="stylesheet" type="text/css" href="../css/css.css" />	
<!-- ===================================================Библиотеки пользовательские====================================================== -->
<SCRIPT type="text/javascript" src="windowstyle.js"></SCRIPT>
<SCRIPT type="text/javascript" src="../lang/lang.en.js"></SCRIPT>
<!--SCRIPT type="text/javascript" src="../lang/lang.es.js"></SCRIPT-->
<SCRIPT type="text/javascript" src="vtypes.js"></SCRIPT>
<SCRIPT type="text/javascript" src="store.js"></SCRIPT>


<script type="text/javascript">
Ext.util.Format.comboRenderer = function(combo){
    return function(value){
        var record = combo.findRecord(combo.valueField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
};
var time_id = Date.parse(new Date());
var readStatus = false;
var view = false;
var winEx = null;
var WindowImage = null;
var WindowItem = null;

function showImage(title, src){
if(!WindowImage){
    WindowImage = new Ext.Window({
        width: '50%',
        height: '60%',
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        modal: true,
        constrainHeader: true,
        listeners: {
            destroy: function(){
               WindowImage = null;
              // WindowComponent.destroy();
            }
        },
        items:[{
                xtype: 'image',
                src: src,
                width: 128,
                height: 128,
        }]
    });
    WindowImage.show();
    }
}

 var setToolGageType = function (value, metaData, record, rowIndex, colIndex, store, view) {
        var val = record.get('tool_gage_type');
        if(val==0) return "Tool";
            else return "Gage";
  };

Ext.define('Image', {
    extend: 'Ext.data.Model',
    fields: [
        { name:'src', type:'string' },
        { name:'caption', type:'string' }
    ]
});

var imagesStoreTool = Ext.create('Ext.data.Store', {
    model: 'Image',
});

function getImageName(src){
    var temp = src.split("/");
    var imageName = temp[temp.length-1];
    return imageName;
}

var imageTplTool = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="uploadStyle">',
            '<div class="caption_title">{caption}</div>',
            '<img src="../{src}" style="max-height:90%; max-width:95%;"/>',
        '</div>',
    '</tpl>'
);

var imageTplEquip = imageTplTool;

var imagesStoreEquip = Ext.create('Ext.data.Store', {
    model: 'Image',
});

var documentGridStoreEquip =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

var storeEquipNumbers = new Ext.data.Store({
        fields: ['id','number'],
        proxy: {
            type: 'ajax',
            url: 'store.php?getEquipNumbers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

function getActionLink(inp){
    var actionLink = {
     getClass: function(value,metadata,record){
      var fileName = record.get(inp);
      if (fileName && fileName!="") {
       return 'list';
      }else{
       return null;              
      }
     },
     handler:function (grid, record, row, colIndex) {
       var file = grid.getStore().data.items[record].get(inp);
        if(file  && file !=""){
            downloadUrl = 'ecr_form.php?downloadFile=true&file='+file;
            var downloadFrame = document.createElement("iframe"); 
            downloadFrame.setAttribute('src',downloadUrl);
            downloadFrame.setAttribute('class',"screenReaderText"); 
            document.body.appendChild(downloadFrame); 
        }
    }
 }
 return actionLink;
}

var documentGridStoreTool =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

function getTestProcedureItem(id, select){
    var test_procedure = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [
            {
                xtype:'textfield',
                fieldLabel: lan.procedure,
                labelAlign: 'top',
                name: 'test_procedure',
                id: 'test_procedure'+id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
            },
            {
                xtype:'textareafield',
                fieldLabel: lan.spec_conditions,
                labelAlign: 'top',
                name: 'spec_conditions',
                id: 'spec_conditions'+id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
            },
            {
                xtype:'textareafield',
                fieldLabel: lan.description,
                labelAlign: 'top',
                name: 'descriptionPro',
                id: 'descriptionPro'+id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
            },{
                xtype:'displayfield',
                fieldLabel: lan.instruct,
                name:"file",
                id:'file'+id,
                style:'margin-bottom:5px; font-size:14px; text-align: center',
            },{
                xtype: 'button',
                text : lan.download,
                cls:'disable',
                margin: '5',
                handler: function() {
                    var file = Ext.getCmp('file'+id).getValue();
                    downloadUrl = 'ecr_form.php?downloadFile=true&doc=true&file='+file;
                    var downloadFrame = document.createElement("iframe"); 
                    downloadFrame.setAttribute('src',downloadUrl);
                    downloadFrame.setAttribute('class',"screenReaderText"); 
                    document.body.appendChild(downloadFrame); 
                    }
                }]
}];

    Ext.Ajax.request({
                url: 'ecr_form.php?getTestProcedureInfo=true',
                method: 'POST',
                params: {
                     id: select
                    },
                success: function (response){
                    if(response) {
                        var data = Ext.decode(response.responseText);
                       Ext.getCmp('test_procedure'+id).setValue(data.rows[0].test_procedure);
                       Ext.getCmp('spec_conditions'+id).setValue(data.rows[0].spec_conditions);
                       Ext.getCmp('descriptionPro'+id).setValue(data.rows[0].description);
                       Ext.getCmp('file'+id).setValue(data.rows[0].file);
                    }
                },
                failure: function (response){ 
                    Ext.MessageBox.alert(lan.error, response.responseText);
                }
            });

return test_procedure;
}

function showItem(title, item, id1, id2){
if(!WindowItem){
    WindowItem = new Ext.Window({
        width: '70%',
        height: '60%',
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        autoScroll: true,
        modal: true,
        constrainHeader: true,
        listeners: {
            destroy: function(){
               WindowItem = null;
            }
        },
        items:item
    });
    WindowItem.show();
    }
}
/**************************************************************************************************************************************/
function convertInch(inch){
    var inch_arr = new Array();
    var inch_arr2 = new Array();
    var mm = 0;
    inch = inch.replace('"', ' ');
    inch = inch.trim();
    if(inch.match(/^\d+(\.\d+)*$/))  mm = inch*25.4;
        else {
            inch_arr = inch.split(" ");
            for(var i=0; i<inch_arr.length; i++){
                if(inch_arr[i].match(/\//)) {
                    inch_arr2 = inch_arr[i].split("/");
                    inch_arr[i] = inch_arr2[0]/inch_arr2[1];
                }
                inch_arr[i] = inch_arr[i]*25.4;
            }
            for(var i=0; i<inch_arr.length; i++){
                mm += inch_arr[i];
            }
        }
   return mm;
}

var setbgDim = function (value, metaData, record, rowIndex, colIndex, store, view) {
    var metric = record.get('metric');
    if(Number(value)==0 || !value || value.trim() == "") { metaData.tdCls = '';}
        else {
            switch(metric) {
                case 1:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    var dimension = Number(record.get('dimension'));
                    var tolerance_plus = Number(record.get('tolerance_plus'));
                    var tolerance_minus = Number(record.get('tolerance_minus'));
                    var val = value;
                    var max = dimension + tolerance_plus;
                    var min = dimension -tolerance_minus;
                   if (val < min || val>max) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
                case 2:
                    var dimension = convertInch(record.get('dimension'));
                    var tolerance_plus = convertInch(record.get('tolerance_plus'));
                    var tolerance_minus = convertInch(record.get('tolerance_minus'));
                    var val = convertInch(value);
                    var max = dimension + tolerance_plus;
                    var min = dimension -tolerance_minus;
                   if (val < min || val>max) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
                default:
                    var dimension = record.get('dimension');
                    if (value != dimension) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
            }
        }
    return value;
}

var setbgFunc = function (value, metaData, record, rowIndex, colIndex, store, view) {
    var max = Number(record.get('nominal')) + Number(record.get('tolerance_plus'));
    var min = Number(record.get('nominal')) -Number(record.get('tolerance_minus'));
          if (value < min || value>max) metaData.tdCls = 'red_bg';
                else metaData.tdCls = 'green_bg';
        if(Number(value)==0 || !value) { metaData.tdCls = ''; value = null;}
        return value
    }
/********************************************************************************************************************************************/
function getFormTool(time_id){
    var formUpload2DImageTool = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: lan.two_d,
        frame: true,
        margin: '5',
        minWidth: 250,
        flex:1,
        height: 250,
        bodyStyle: "background-image:url(../img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'2DImageTool'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "../img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage(lan.Image, src);
                    }
                },
                element: 'body',
                scope: this
            }    
        }
});

var formUpload3DImageTool = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: lan.three_d,
        frame: true,
        margin: '5',
        minWidth: 250,
        flex:1,
        height: 250,
        bodyStyle: "background-image:url(../img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'3DImageTool'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "../img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage(lan.Image, src);
                    }
                },
                element: 'body',
                scope: this
            }    
        }
});



var itemsUploadFormTool = Ext.create('Ext.view.View', {
    store: imagesStoreTool,
    id: 'UploadForm'+time_id,
    tpl: imageTplTool,
    itemSelector: 'div.uploadStyle',
    emptyText: lan.no_images,
    listeners: {
        dblclick: {
            element: 'el', //bind to the underlying body property on the panel
            fn: function(e, t){ 
                var select = itemsUploadFormTool.getSelectionModel().selected.items[0].data;
                showImage(select.caption, select.src);
            }
        }
    }
});

var fileUploadFormTool = Ext.create('Ext.form.Panel', {
       //title: 'Additional Images',
        id: 'fileUploadForm'+time_id,
        //anchor: '96%',
        //margin: '0 0 0 10',
        //hidden: hideStatus,
        bodyPadding: 10,
        frame: false,
        items:itemsUploadFormTool
});

var ImageUploadFormTool = Ext.create('Ext.form.Panel', {
        title: lan.images,
        id: 'ImageUploadForm'+time_id,
        margin: '0 0 0 10',
        //hidden: hideStatus,
        bodyPadding: 10,
        frame: false,
        items:[{
                xtype: 'container',
                //anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [formUpload2DImageTool, formUpload3DImageTool]
        }, fileUploadFormTool]
});

var downloadLink = getActionLink('add_spec');

var DocUploadFormTool = Ext.create('Ext.form.Panel', {
        title: lan.documentstext,
        id: 'DocUploadForm'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_grid'+time_id,
            border: true,
            store: documentGridStoreTool,
            columns: [
                {
                    xtype:'rownumberer',
                    width:20
                },
                {
                    text: lan.description,
                    dataIndex: 'descr_spec',
                    sortable: false,
                    minWidth:200,
                    flex:1
                },
                {
                    text: lan.documentstext,
                    dataIndex: 'add_spec',
                    sortable: false,
                    minWidth:200,
                    flex:1
                },
                {
                    xtype:'actioncolumn',
                    width:40,
                    items:[downloadLink]
                }]
        }]
});

var item_form_tool = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [{
                xtype:'textfield',
                fieldLabel: lan.id,
                name: 'id',
                id: 'id'+time_id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
            },{
                xtype:'combobox',
                fieldLabel: lan.tool_gage,
                labelAlign: 'top',
                name: 'tool_gage_type',
                id: 'tool_gage_type'+time_id,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                store: storeToolGage,
                displayField: 'value',
                valueField: 'id',
                editable: false,
                readOnly: true,
                value: 0 
            },
            {
                xtype:'textfield',
                fieldLabel: lan.name,
                labelAlign: 'top',
                name: 'name',
                id: 'name'+time_id,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                readOnly: true,
                anchor:'96%',
            },
           {
                xtype:'textareafield',
                fieldLabel: lan.description,
                labelAlign: 'top',
                name: 'descriptionWin',
                id: 'descriptionWin'+time_id,
                allowBlank: true,
                labelWidth: style.input2.labelWidth,
                readOnly:true,
                anchor:'96%',
            },ImageUploadFormTool, DocUploadFormTool]
}];
    return item_form_tool;
}



function getEquipmentItem(time_id, id_item){
    storeEquipNumbers.load();
    var formUpload2DImageEquip = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: lan.two_d,
        frame: true,
        margin: '5',
        minWidth: 250,
        flex:1,
        height: 250,
        bodyStyle: "background-image:url(../img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'2DImageEquip'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage(lan.Image, src);
                    }
                },
                element: 'body',
                scope: this
            }    
        }
});

var formUpload3DImageEquip = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: lan.three_d,
        frame: true,
        margin: '5',
        minWidth: 250,
        flex:1,
        height: 250,
        bodyStyle: "background-image:url(../img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'3DImageEquip'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage(lan.Image, src);
                    }
                },
                element: 'body',
                scope: this
            }    
        }
});



var itemsUploadFormEquip = Ext.create('Ext.view.View', {
    store: imagesStoreEquip,
    id: 'UploadForm'+time_id,
    tpl: imageTplEquip,
    itemSelector: 'div.uploadStyle',
    emptyText: lan.no_images,
    listeners: {
        dblclick: {
            element: 'el', //bind to the underlying body property on the panel
            fn: function(e, t){ 
                var select = itemsUploadFormEquip.getSelectionModel().selected.items[0].data;
                showImage(select.caption, select.src);
            }
        }
    }
});

var fileUploadFormEquip = Ext.create('Ext.form.Panel', {
       //title: 'Additional Images',
        id: 'fileUploadForm'+time_id,
        //anchor: '96%',
        //margin: '0 0 0 10',
        //hidden: hideStatus,
        bodyPadding: 10,
        frame: false,
        items:[itemsUploadFormEquip]
});

var ImageUploadFormEquip = Ext.create('Ext.form.Panel', {
        title: lan.images,
        id: 'ImageUploadForm'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
                xtype: 'container',
                //anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [formUpload2DImageEquip, formUpload3DImageEquip]
        }, fileUploadFormEquip]
});

var downloadLink = getActionLink('add_spec');

var DocUploadFormEquip = Ext.create('Ext.form.Panel', {
        title: lan.documentstext,
        id: 'DocUploadForm'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_grid'+time_id,
            border: true,
            hidden: false,
            store: documentGridStoreEquip,
            columns: [
                {
                    xtype:'rownumberer',
                    width:20
                },
                {
                    text: lan.description,
                    dataIndex: 'descr_spec',
                    sortable: false,
                    minWidth:200,
                    flex:1
                },
                {
                    text: lan.documentstext,
                    dataIndex: 'add_spec',
                    sortable: false,
                    minWidth:200,
                    flex:1
                },
                {
                    xtype:'actioncolumn',
                    width:40,
                    items:[downloadLink]
                }]
        }]
});

var equipment_item = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [{
                xtype:'textfield',
                name: 'id',
                id: 'id'+time_id,
                hidden: true
            },{
                xtype:'textfield',
                fieldLabel: lan.equip_id+':',
                labelAlign: 'top',
                name: 'number',
                id: 'number'+time_id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true,
            },
            {
                xtype:'textfield',
                fieldLabel: lan.name,
                labelAlign: 'top',
                name: 'name',
                id: 'name'+time_id,
                readOnly: view,
                labelWidth: style.input2.labelWidth,
                readOnly: true,
                anchor:'96%',
            },
            {
                xtype:'textareafield',
                fieldLabel: lan.description,
                labelAlign: 'top',
                name: 'description',
                id: 'descriptionDir'+time_id,
                labelWidth: style.input2.labelWidth,
                readOnly: true,
                anchor:'96%',
            },
            {
                xtype:'numberfield',
                fieldLabel: lan.est_life_time,
                labelAlign: 'top',
                name: 'life_time',
                id: 'life_time'+time_id,
                minValue: 0,
                allowExponential: false,
                labelWidth: style.input2.labelWidth,
                readOnly: true,
                anchor:'96%',
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.pending_des,
                    labelAlign: 'top',
                    name: 'pending_design',
                    id: 'pending_design'+time_id,
                    labelWidth: style.input2.labelWidth,
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    value :'0',                  
                    readOnly: true,
                    anchor:'96%',
                }, ImageUploadFormEquip, DocUploadFormEquip]
}];

    Ext.Ajax.request({
        url: 'ecr_form.php?getDirectoryequip=true',
        method: 'POST',
        params: {
             id: id_item
            },
        success: function (response){
            if(response) {
                var data = Ext.decode(response.responseText);
                if(data.rows!=null){
                    Ext.getCmp('id'+time_id).setValue(data.rows[0].id);
                    Ext.getCmp('number'+time_id).setValue(data.rows[0].number);
                    Ext.getCmp('name'+time_id).setValue(data.rows[0].name);
                    Ext.getCmp('descriptionDir'+time_id).setValue(data.rows[0].description);
                    Ext.getCmp('life_time'+time_id).setValue(data.rows[0].life_time);
                    Ext.getCmp('pending_design'+time_id).setValue(data.rows[0].pending_design);

                    if(data.rows[0].drawing2d){
                        Ext.getCmp('2DImageEquip').up('form').setBodyStyle('background:#fff');
                        Ext.getCmp('2DImageEquip').setSrc('../img/components/'+data.rows[0].drawing2d);
                    }
                    if(data.rows[0].drawing3d){
                       Ext.getCmp('3DImageEquip').up('form').setBodyStyle('background:#fff');
                        Ext.getCmp('3DImageEquip').setSrc('../img/components/'+data.rows[0].drawing3d);
                    }
                    if(data.rows[0].addImages){
                        imagesStoreEquip.loadData(Ext.decode(data.rows[0].addImages));
                    }
                    if(data.rows[0].add_spec){
                        documentGridStoreEquip.loadData(Ext.decode(data.rows[0].add_spec));
                    }
                }
                else return;
           }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
    return equipment_item;
}


var SetCustomField = function(record){
    var metric = record.get('metric');
    var vt;
    switch (metric){
        case 1: vt = 'mmValid'; break;
        case 2: vt = 'inchValid'; break;
		case 5: vt = 'degValid'; break;
        case 6: vt = 'turnValid'; break;
		case 7: vt = 'intValid'; break;
        default: vt = 'threadValid'; break;
    }
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'textfield',
            enableKeyEvents: true,
            readOnly:readStatus,
            vtype: vt,
            listeners:{
            change: function(){
               this.setValue(this.getValue().replace(/\,|\.{2}/, '.'));
               this.setValue(this.getValue().replace(/\"{2}/, '"'));
               this.setValue(this.getValue().replace(/\/{2}/, '/'));
               this.setValue(this.getValue().replace(/\ {2}/, ' '));
               if(vt=='inchValid') {convertInch(this.getValue());}
            }
        }
        }
    });
}

var SetNumberField = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'textfield',
            enableKeyEvents: true,
            readOnly:readStatus,
            vtype: 'mmValid',
        }
    });
}

store_part_number = new Ext.data.Store({
        fields: ['id', 'part_number'],
        proxy: {
            type: 'ajax',
            url: '../scripts/ecr_form.php?getPartNumbers=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

store_description = new Ext.data.Store({     
        fields: ['description'],
        proxy: {
            type: 'ajax',
            url: '../scripts/ecr_form.php?getDescription=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var store_metricDimOUT = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'name', type: 'string'}],
        data: [{id:1,name:'mm'},{id:2,name:'inch'},{id:3,name:'thread(mm)'}, {id:4,name:'thread(inch)'}, {id:5,name:'Grade'}, {id:6,name:'Turns'}, {id:7,name:'qty'}, {id:8,name:'mic'}, {id:9,name:'HRC'}]
});

var store_metricFuncOUT = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'name', type: 'string'}],
        data: [{id:1,name:'V'},{id:2,name:'°F'},{id:3,name:'°C'}, {id:4,name:'A'}, {id:5,name:'cc'}, {id:6,name:'Cycles'}, {id:7,name:'gpm'}, {id:8,name:'Grade'}, {id:9,name:'in/lb'}, {id:10,name:'lb/in'}, {id:11,name:'lb/ft'}, {id:12,name:'Lb/in'}, {id:13,name:'Lbs'}, {id:14,name:'Mg'}, {id:15,name:'N'}, {id:16,name:'Nm'}, {id:17,name:'psi'}, {id:18,name:'S'}]
});

var data_store_Material_BOM = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: '../scripts/ecr_form.php?getMaterials=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeDimesionalPPAPOUT= new Ext.data.Store({
        fields: ['id', 'critical', 'dimension_name', 'metric', 'dimension', 'tolerance_plus', 'tolerance_minus', 'tool_gage', 'tool_gage_id', 'actual1', 'actual2', 'actual3', 'actual4', 'actual5', 'actual6', 'actual7', 'actual8', 'actual9', 'actual10', 'actual11', 'actual12', 'actual13', 'actual14', 'actual15', 'actual16', 'actual17', 'actual18', 'actual19', 'actual20', 'actual21', 'actual22', 'actual23', 'actual24', 'actual25', 'actual26', 'actual27', 'actual28', 'actual29', 'actual30'],
        proxy: {
            type: 'ajax',
            url: '../scripts/ecr_form.php?getDimAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var storeFunctionalPPAPOUT= new Ext.data.Store({
        fields: ['id', 'critical', 'value_desc', 'metric', 'nominal', 'tolerance_plus', 'tolerance_minus', 'equipment', 'equipment_id', 'test_procedure', 'test_procedure_id','actual1', 'actual2', 'actual3', 'actual4', 'actual5', 'actual6', 'actual7', 'actual8', 'actual9', 'actual10', 'actual11', 'actual12', 'actual13', 'actual14', 'actual15', 'actual16', 'actual17', 'actual18', 'actual19', 'actual20', 'actual21', 'actual22', 'actual23', 'actual24', 'actual25', 'actual26', 'actual27', 'actual28', 'actual29', 'actual30'],
        proxy: {
            type: 'ajax',
            url: '../scripts/ecr_form.php?getFuncAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var comboYESNOPPAPOUT = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    store: data_store_YESNO,
    displayField: 'value',
    valueField: 'id',
    readOnly: true,
    value: 1
});
var comboYESNO2PPAPOUT = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    store: data_store_YESNO,
    displayField: 'value',
    valueField: 'id',
    readOnly: true,
    value: 1
});

function taskCompleted(qty, time_id){
        Ext.getCmp('outsource_name'+time_id).setConfig('readOnly',true);
       Ext.getCmp('save_draft_'+time_id).hide();
       Ext.getCmp('submit_'+time_id).hide();
       readStatus = true;
    }

var metricDimPPAPOUT = new Ext.form.ComboBox({
    allowBlank: true,
    typeAhead: true,
    id: 'metricDimPPAP'+time_id,
    triggerAction: 'all',
    lazyRender: true,
    store: store_metricDimOUT,
    displayField: 'name',
    valueField: 'id',
    readOnly: true,
});

var metricFuncPPAPOUT = new Ext.form.ComboBox({
    typeAhead: true,
    id: 'metricFuncPPAP'+time_id,
    triggerAction: 'all',
    lazyRender: true,
    store: store_metricFuncOUT,
    displayField: 'name',
    valueField: 'id',
    readOnly: true,
    value: 1
});

var gridDimPPAPOUT = Ext.create('Ext.grid.Panel', {
    store: storeDimesionalPPAPOUT,
    id: 'gridDimPPAP'+time_id,
    title: lan.dimension_ppap_require,
    autoScroll: true,
    height: 300,
    margin: '5 0',
    anchor:'100%',
    frame: true,
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
        {text: lan.critical, readOnly: true, editor: comboYESNOPPAPOUT, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOPPAPOUT), this), sortable: false, dataIndex: 'critical', width: 90},
        {text: lan.dimension_name, readOnly: true, dataIndex: 'dimension_name', width: 150},
        {text: lan.units, editor: metricDimPPAPOUT, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(metricDimPPAPOUT), this), sortable: true, dataIndex: 'metric', width: 110},
        {text: lan.dimension, dataIndex: 'dimension', width: 150},
        {text: lan.toler_plus,  dataIndex: 'tolerance_plus', width: 150},
        {text: lan.toler_minus,  dataIndex: 'tolerance_minus', width: 150},
        {text: lan.gage, dataIndex: 'tool_gage', width: 150},
        {dataIndex: 'tool_gage_id', hidden: true},
        {text: lan.actual_value+'1', id: 'avd1', hidden: true, sortable:false, dataIndex: 'actual1', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'2', id: 'avd2', hidden: true,sortable: false, dataIndex: 'actual2', width: 150,getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'3', id: 'avd3', hidden: true,sortable: false, dataIndex: 'actual3', width: 150,getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'4', id: 'avd4', hidden: true,sortable: false, dataIndex: 'actual4', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'5', id: 'avd5', hidden: true,sortable: false, dataIndex: 'actual5', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'6', id: 'avd6', hidden: true,sortable: false, dataIndex: 'actual6', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'7', id: 'avd7', hidden: true,sortable: false, dataIndex: 'actual7', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'8', id: 'avd8', hidden: true, sortable: false, dataIndex: 'actual8', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'9', id: 'avd9', hidden: true, sortable: false, dataIndex: 'actual9', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'10', id: 'avd10', hidden: true, sortable: false, dataIndex: 'actual10', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'11', id: 'avd11', hidden: true, sortable: false, dataIndex: 'actual11', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'12', id: 'avd12', hidden: true, sortable: false, dataIndex: 'actual12', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'13', id: 'avd13', hidden: true, sortable: false, dataIndex: 'actual13', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'14', id: 'avd14', hidden: true, sortable: false, dataIndex: 'actual14', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'15', id: 'avd15', hidden: true, sortable: false, dataIndex: 'actual15', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'16', id: 'avd16', hidden: true, sortable: false, dataIndex: 'actual16', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'17', id: 'avd17', hidden: true, sortable: false, dataIndex: 'actual17', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'18', id: 'avd18', hidden: true, sortable: false, dataIndex: 'actual18', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'19', id: 'avd19', hidden: true, sortable: false, dataIndex: 'actual19', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'20', id: 'avd20', hidden: true, sortable: false, dataIndex: 'actual20', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'21', id: 'avd21', hidden: true, sortable: false, dataIndex: 'actual21', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'22', id: 'avd22', hidden: true, sortable: false, dataIndex: 'actual22', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'23', id: 'avd23', hidden: true, sortable: false, dataIndex: 'actual23', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'24', id: 'avd24', hidden: true, sortable: false, dataIndex: 'actual24', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'25', id: 'avd25', hidden: true, sortable: false, dataIndex: 'actual25', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'26', id: 'avd26', hidden: true, sortable: false, dataIndex: 'actual26', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'27', id: 'avd27', hidden: true, sortable: false, dataIndex: 'actual27', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'28', id: 'avd28', hidden: true, sortable: false, dataIndex: 'actual28', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'29', id: 'avd29', hidden: true, sortable: false, dataIndex: 'actual29', width: 150, getEditor: SetCustomField, renderer: setbgDim},
        {text: lan.actual_value+'30', id: 'avd30', hidden: true, sortable: false, dataIndex: 'actual30', width: 150, getEditor: SetCustomField, renderer: setbgDim}],
        listeners: {
            celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
              if(cellIndex==7){
                    var select = Ext.getCmp('gridDimPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.tool_gage_id;
                    var title = Ext.getCmp('gridDimPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.tool_gage;
                    if(!winEx){
                        items =  getFormTool(time_id);
                        var form_dir = new Ext.create('Ext.form.Panel', {autoScroll: true, items: items});
                        if(select){
                            Ext.Ajax.request({
                            url: 'ecr_form.php?getDirectorytool_gage=true',
                            method: 'POST',
                            params: {
                                 id: select
                                },
                            success: function (response){
                                if(response) {
                                    var data = Ext.decode(response.responseText);
                                    if(data.rows!=null){
                                        Ext.getCmp('id'+time_id).setValue(data.rows[0].id);
                                        Ext.getCmp('name'+time_id).setValue(data.rows[0].name);
                                        Ext.getCmp('tool_gage_type'+time_id).setValue(data.rows[0].tool_gage_type);
                                        Ext.getCmp('descriptionWin'+time_id).setValue(data.rows[0].description);

                                        if(data.rows[0].drawing2d){
                                            Ext.getCmp('2DImageTool').up('form').setBodyStyle('background:#fff');
                                            Ext.getCmp('2DImageTool').setSrc('../img/components/'+data.rows[0].drawing2d);
                                        }
                                        if(data.rows[0].drawing3d){
                                           Ext.getCmp('3DImageTool').up('form').setBodyStyle('background:#fff');
                                            Ext.getCmp('3DImageTool').setSrc('../img/components/'+data.rows[0].drawing3d);
                                        }
                                        if(data.rows[0].addImages){
                                           imagesStoreTool.loadData(Ext.decode(data.rows[0].addImages));
                                        }
                                        if(data.rows[0].add_spec){
                                            documentGridStoreTool.loadData(Ext.decode(data.rows[0].add_spec));
                                        }
                                    }
                                    else return;
                               }
                            },
                            failure: function (response){ 
                                Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                        }
                        winEx = new Ext.Window({
                            width: '90%',
                            height: '90%',
                            title: title,
                            closeAction: 'destroy',
                            layout: 'fit',
                            resizable: true,
                            closable: true,
                            modal: true,
                            constrainHeader: true,
                            buttons: [{
                            text:lan.cancel,
                            iconCls: 'close',
                            handler:function(){
                                winEx.destroy();        
                            }
                            }],
                            listeners: {
                                destroy: function(){
                                    winEx = null;
                                }
                            },
                            items:form_dir
                           });
                        winEx.show();
                    }
                }
            }
        }
});


var gridFuncPPAPOUT = Ext.create('Ext.grid.Panel', {
    store: storeFunctionalPPAPOUT,
    id: 'gridFuncPPAP'+time_id,
    title: lan.func_ppap_require,
    autoScroll: true,
    height: 300,
    margin: '5 0',
    anchor:'100%',
    frame: true,
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.critical, readOnly: true, editor: comboYESNO2PPAPOUT, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNO2PPAPOUT), this), sortable: false, dataIndex: 'critical', width: 90},
        {text: lan.value_desc, readOnly: true, sortable: true, dataIndex: 'value_desc', width: 150},
        {text: lan.units, editor: metricFuncPPAPOUT, sortable: true, dataIndex: 'metric', width: 110, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(metricFuncPPAPOUT), this)},
        {text: lan.nominal, dataIndex: 'nominal', width: 150},
        {text: lan.toler_plus, dataIndex: 'tolerance_plus', width: 150},
        {text: lan.toler_minus, dataIndex: 'tolerance_minus', width: 150},
        {text: lan.equipment, sortable: true, dataIndex: 'equipment', width: 160},
        {dataIndex: 'equipment_id', hidden: true},
        {text: lan.test_procedure, dataIndex: 'test_procedure', width: 150},
        {dataIndex: 'test_procedure_id', hidden: true},
        {text: lan.actual_value+'1', id: 'avf1', hidden: true, sortable: false, dataIndex: 'actual1', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'2', id: 'avf2', hidden: true, sortable: false, dataIndex: 'actual2', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'3', id: 'avf3', hidden: true, sortable: false, dataIndex: 'actual3', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'4', id: 'avf4', hidden: true, sortable: false, dataIndex: 'actual4', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'5', id: 'avf5', hidden: true, sortable: false, dataIndex: 'actual5', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'6', id: 'avf6', hidden: true, sortable: false, dataIndex: 'actual6', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'7', id: 'avf7', hidden: true, sortable: false, dataIndex: 'actual7', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'8', id: 'avf8', hidden: true, sortable: false, dataIndex: 'actual8', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'9', id: 'avf9', hidden: true, sortable: false, dataIndex: 'actual9', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'10', id: 'avf10', hidden: true,  sortable: false, dataIndex: 'actual10', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'11', id: 'avf11', hidden: true, sortable: false, dataIndex: 'actual11', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'12', id: 'avf12', hidden: true, sortable: false, dataIndex: 'actual12', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'13', id: 'avf13', hidden: true, sortable:false, dataIndex: 'actual13', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'14', id: 'avf14', hidden: true, sortable: false, dataIndex: 'actual14', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'15', id: 'avf15', hidden: true, sortable: false, dataIndex: 'actual15', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'16', id: 'avf16', hidden: true, sortable: false, dataIndex: 'actual16', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'17', id: 'avf17', hidden: true,sortable: false, dataIndex: 'actual17', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'18', id: 'avf18', hidden: true, sortable: false, dataIndex: 'actual18', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'19', id: 'avf19', hidden: true, sortable: false, dataIndex: 'actual19', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'20', id: 'avf20', hidden: true, sortable: false, dataIndex: 'actual20', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'21', id: 'avf21', hidden: true, sortable: false, dataIndex: 'actual21', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'22', id: 'avf22', hidden: true, sortable: false, dataIndex: 'actual22', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'23', id: 'avf23', hidden: true, sortable: false, dataIndex: 'actual23', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'24', id: 'avf24', hidden: true, sortable: false, dataIndex: 'actual24', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'25', id: 'avf25', hidden: true, sortable: false, dataIndex: 'actual25', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'26', id: 'avf26', hidden: true, sortable: false, dataIndex: 'actual26', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'27', id: 'avf27', hidden: true, sortable: false, dataIndex: 'actual27', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'28', id: 'avf28', hidden: true, sortable: false, dataIndex: 'actual28', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'29', id: 'avf29', hidden: true, sortable: false, dataIndex: 'actual29', width: 150, renderer: setbgFunc, getEditor:SetNumberField},
        {text: lan.actual_value+'30', id: 'avf30', hidden: true, sortable: false, dataIndex: 'actual30', width: 150, renderer: setbgFunc, getEditor:SetNumberField}],
    listeners: {
        celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
            if(cellIndex==7){
                var select = Ext.getCmp('gridFuncPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.equipment_id;
                var title = Ext.getCmp('gridFuncPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.equipment;
                var item = getEquipmentItem(time_id, select);
                showItem(title, item, null, null, true);
            }
           if(cellIndex==9){
                var select = Ext.getCmp('gridFuncPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.test_procedure_id;
                var title = Ext.getCmp('gridFuncPPAP'+time_id).getView().getSelectionModel().getSelection()[0].data.test_procedure;
                var item = getTestProcedureItem(time_id, select);
                showItem(title, item, null, null, true);
            }
        }
    }
});

store_part_number.load();
store_description.load();
data_store_Material_BOM.load();

var filePanel = Ext.create('Ext.panel.Panel', {
    bodyPadding: 5,
    title: lan.files+':',
    anchor:'100%',
    frame: true,
    items: [{
                xtype:'displayfield',
                fieldLabel: lan.pfmea,
                name: 'pfmea',
                id: 'pfmea',
                labelWidth: style.input2.labelWidth,
                style:'font-size:14px; text-align: center; cursor: pointer; text-decoration: underline;',
                flex:1,
                listeners: {
                    afterrender: function(component) {
                        component.getEl().on('click', function() { 
                        if(arguments[0].target.nodeName!='LABEL') {
                            var file = Ext.getCmp('pfmea').getValue();
                            downloadUrl = 'ecr_form.php?downloadFile=true&doc=true&file='+file;
                            var downloadFrame = document.createElement("iframe"); 
                            downloadFrame.setAttribute('src',downloadUrl);
                            downloadFrame.setAttribute('class',"screenReaderText"); 
                            document.body.appendChild(downloadFrame); 
                        }
                    });
                }
            }
            },{
                xtype:'displayfield',
                fieldLabel: lan.dfmea,
                name:'dfmea', 
                id: 'dfmea',
                labelWidth: style.input2.labelWidth,
                style:'font-size:14px; text-align: center; cursor: pointer; text-decoration: underline;',
                flex:1,
                listeners: {
                    afterrender: function(component) {
                        component.getEl().on('click', function() { 
                        if(arguments[0].target.nodeName!='LABEL') {
                            var file = Ext.getCmp('dfmea').getValue();
                            downloadUrl = 'ecr_form.php?downloadFile=true&doc=true&file='+file;
                            var downloadFrame = document.createElement("iframe"); 
                            downloadFrame.setAttribute('src',downloadUrl);
                            downloadFrame.setAttribute('class',"screenReaderText"); 
                            document.body.appendChild(downloadFrame); 
                        }
                    });
                }
            }
            },{
                xtype:'displayfield',
                fieldLabel: lan.control_plan,
                name: 'contr_plan', 
                id: 'contr_plan', 
                labelWidth: style.input2.labelWidth,
                style:'font-size:14px; text-align: center; cursor: pointer; text-decoration: underline;',
                flex:1,
                listeners: {
                    afterrender: function(component) {
                        component.getEl().on('click', function() { 
                        if(arguments[0].target.nodeName!='LABEL') {
                            var file = Ext.getCmp('contr_plan').getValue();
                            downloadUrl = 'ecr_form.php?downloadFile=true&doc=true&file='+file;
                            var downloadFrame = document.createElement("iframe"); 
                            downloadFrame.setAttribute('src',downloadUrl);
                            downloadFrame.setAttribute('class',"screenReaderText"); 
                            document.body.appendChild(downloadFrame); 
                        }
                    });
                }
            }
            },{
                xtype:'displayfield',
                fieldLabel: lan.materials_certificate,
                name: 'mat_cert',
                id:'mat_cert',
                labelWidth: style.input2.labelWidth,
                style:'font-size:14px; text-align: center; cursor: pointer; text-decoration: underline;',
                flex:1,
                listeners: {
                    afterrender: function(component) {
                        component.getEl().on('click', function() { 
                        if(arguments[0].target.nodeName!='LABEL') {
                            var file = Ext.getCmp('mat_cert').getValue();
                            downloadUrl = 'ecr_form.php?downloadFile=true&doc=true&file='+file;
                            var downloadFrame = document.createElement("iframe"); 
                            downloadFrame.setAttribute('src',downloadUrl);
                            downloadFrame.setAttribute('class',"screenReaderText"); 
                            document.body.appendChild(downloadFrame); 
                        }
                    });
                }
            }
            }]
});
		
var ppap_test = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [{
                    xtype:'textfield',
                    fieldLabel: lan.name,
					id: 'outsource_name'+time_id,
                    name: 'name',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%'
                },{
                    xtype: 'datefield',
                    format: 'Y-m-d H:i:s',
                    altFormats: 'Y-m-d H:i:s',
                    fieldLabel: lan.date,
                    name: 'test_date',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    value: new Date(),
                    readOnly: true

                }, {
                    xtype:'combobox',
                    fieldLabel: lan.comp_part_number+':',
                    id: 'part_number'+time_id,
                    name: 'part_number',
                    allowBlank: false,
                    typeAhead: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_part_number,
                    displayField: 'part_number',
                    valueField: 'id',
                    readOnly: true
                },{
                    xtype:'combobox',
                    fieldLabel: lan.description+':',
                    id: 'description'+time_id,
                    name: 'description',
                    allowBlank: false,
                    typeAhead: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_description,
                    displayField: 'description',
                    valueField: 'description',
                    readOnly: true
                },
                {                       
                xtype:'combobox',
                fieldLabel: lan.material,
                id: 'material'+time_id,
                name: 'material',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                store: data_store_Material_BOM,
                displayField: 'name',
                valueField: 'name',
                 cls: 'toggle-state',
                anchor: '96%',
                readOnly: true
            },{
            xtype:'textfield',
            fieldLabel: lan.ppap_sample_size,
            id: 'ppap_qty'+time_id,
            name: 'qty',
            allowBlank: true,
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly:true,
            listeners:{
                change: function(){
                    var qty = Ext.getCmp('ppap_qty'+time_id).getValue();
                    for(var i=1; i<=qty; i++){
                        Ext.getCmp('avf'+i).show();
                        Ext.getCmp('avd'+i).show();
                    }
                }
            }
            },gridDimPPAPOUT, gridFuncPPAPOUT,filePanel]
}];

function getStorePPAPOut(){
    var dim_ppap = [];
    var func_ppap = [];
    storeDimesionalPPAPOUT.each(function(record){
            var row = {'critical': record.get('critical'),  'dimension_name': record.get('dimension_name'), 'metric':record.get('metric'), 'dimension': record.get('dimension'), 'tolerance_plus': record.get('tolerance_plus'), 'tolerance_minus': record.get('tolerance_minus'), 'tool_gage': record.get('tool_gage'), 'tool_gage_id': record.get('tool_gage_id')};
            for(var i=1; i<=30; i++){
                row['actual'+i] = record.get('actual'+i);
            }
            dim_ppap.push(row);
        });
    storeFunctionalPPAPOUT.each(function(record){
            var row = {'critical': record.get('critical'),  'value_desc': record.get('value_desc'), 'metric':record.get('metric'), 'nominal': record.get('nominal'), 'tolerance_plus': record.get('tolerance_plus'), 'tolerance_minus': record.get('tolerance_minus'), 'equipment': record.get('equipment'), 'equipment_id': record.get('equipment_id'), 'test_procedure': record.get('test_procedure'), 'test_procedure_id': record.get('test_procedure_id')};
            for(var i=1; i<=30; i++){
                row['actual'+i] = record.get('actual'+i);
            }
            func_ppap.push(row);
        });
        dim_ppapJS = JSON.stringify(dim_ppap);
        func_ppapJS = JSON.stringify(func_ppap);

    var params2 = {
                'dim_test': dim_ppapJS,
                'func_test': func_ppapJS
            };

    return params2;
}


function saveFormOutSource(form, task_id, draft, time_id){
    var msg ='';
    storeValid = true;
    var fields = form.getFields();
    var params2 = getStorePPAPOut();
    var isZero = false;
    
    if (draft ==0){
        storeDimesionalPPAPOUT.each(function(record){
            for(var i =1; i<=qty; i++){
                if(record.get('actual'+i)==null || !record.get('actual'+i)) storeValid = false;
                if(record.get('actual'+i)&&record.get('actual'+i)==0) {
                    isZero = true;
                    storeValid = false;
                }
            }
        });
    storeFunctionalPPAPOUT.each(function(record){
        for(var i =1; i<=qty; i++){
                if(record.get('actual'+i)==null || !record.get('actual'+i)) storeValid = false;
                if(record.get('actual'+i)&&record.get('actual'+i)==0) {
                    isZero = true;
                    storeValid = false;
                }
            }

        });
    
        if(isZero){
            Ext.MessageBox.alert(lan.error, lan.not_be_zero);
        }

    }

    if(form.isValid() && storeValid) {
        if(draft == 0){
            taskCompleted(qty, time_id);
        }
        var params = {task_id:task_id, draft_id:draft};
        params = $.extend({}, params,params2);
 
        form.submit({
            url: 'ecr_form.php?savePPAPOut=true&fg='+finish,
            waitMsg: lan.saving,
            wait: true,
            scope: this,
            method: 'post',
            params: params,
            success: function(form, action) {
                Ext.MessageBox.alert(lan.succ, lan.data_saved);
            },
            failure: function(form, action) {
               var data = Ext.decode(action.response.responseText);
                var msg =  lan.savingErr;
                Ext.getCmp('message_'+ iddoc).setValue('<b class= "message" style="color:red">'+msg+'</b>');
            }
        });
        
            
        
    } else {
        msg = lan.formNotFilled;
        Ext.MessageBox.alert(lan.error, msg);
    }

        
}
        store_metricDimOUT.load();
        store_metricFuncOUT.load();
        storeDimesionalPPAPOUT.removeAll();
        storeFunctionalPPAPOUT.removeAll();
        if(dim_test == null || !dim_test){
            storeDimesionalPPAPOUT.load({
                params:{
                    id: part_number_id
                }
            });
        }
        else {
            var data2 = Ext.decode(dim_test);
            storeDimesionalPPAPOUT.loadData(data2);
        }

        if(func_test == null || !func_test){
            storeFunctionalPPAPOUT.load({
                params:{
                    id: part_number_id
                }
            });
        }
        else {
                var data3 = Ext.decode(func_test);
                storeFunctionalPPAPOUT.loadData(data3);
        }

	Ext.onReady(function(){
		Ext.create('Ext.form.Panel', {
		    bodyPadding: 10,
		    width: '100%',
		    title: lan.ppap_test,
            autoScroll: true,
		    items: ppap_test,
            buttons:[
                {
                    text: lan.save_draft,
                    id:'save_draft_'+time_id,
                    handler:function(){ 
                        var form = this.up('form').getForm();
                        saveFormOutSource(form, task_id, 1, time_id);                                                  
                    }
                },
                {
                    text: lan.submit,
                    id:'submit_'+time_id,
                    handler:function(){
                        var form = this.up('form').getForm();
                        saveFormOutSource(form, task_id, 0, time_id);
                    }
                }],
		    renderTo: Ext.getBody()
			});

    Ext.Ajax.request({
            url: '../scripts/ecr_form.php?getCompInfo=true',
            method: 'POST',
            params: {
                 id: part_number_id
                },
            success: function (response){
                if(response) {
                    var data = Ext.decode(response.responseText);
                    Ext.getCmp('description'+time_id).setValue(data.rows[0].description);
                    Ext.getCmp('part_number'+time_id).setValue(data.rows[0].part_number);
                    Ext.getCmp('material'+time_id).setValue(data.rows[0].material);
                    Ext.getCmp('ppap_qty'+time_id).setValue(qty);
                    Ext.getCmp('outsource_name'+time_id).setValue(outsource_name);
                    if(files){
                        var data = Ext.decode(files);
                        for(var i=0; i<data.length; i++){
                            Ext.getCmp(data[i]['name']).setValue(data[i]['document']);
                        }
                    }

                    if(outsource_draft == 0){
                        taskCompleted(qty, time_id);
                    }
               }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
});

</script>
		
    </head>
    <body OnLoad="">
    </body>
</html>
