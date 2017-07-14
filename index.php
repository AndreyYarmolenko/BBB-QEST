<?php
	session_start();
	header('Content-Type: text/html; charset=utf-8');

	if(isset($_REQUEST['task_id'])){
		$_SESSION['task_id'] = $_REQUEST['task_id'];
	}
	
	if(!isset($_SESSION['id'])){
		header("Location: login.php");
		exit;
	}

	include('settings.php');
	//echo $_SESSION['email'];
		
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
    <meta charset="utf-8">
	
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="msapplication-tap-highlight" content="no"/>

    <!-- запретить кеширование
    <meta http-equiv="Cache-control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="-1">
    <!-- запретить кеширование -->

<SCRIPT type="text/javascript">
var lang = '<?php echo $_SESSION['locale']; ?>';
//console.log(lang);
var id_user = <?php echo $_SESSION['id']; ?>;

var task_id = "";
<?php if(isset($_SESSION['task_id'])) {?>
	task_id = '<?php echo $_SESSION['task_id'];?>';
<?php } ?>
<?php unset($_SESSION['task_id']); ?>

var login = '<?php echo $_SESSION['login']; ?>';
var user_rights = '<?php echo $_SESSION['rights']; ?>';
var gmt = '<?php echo $_SESSION['gmt']; ?>';
</SCRIPT>

<!-- =================================================== js ====================================================== -->

<SCRIPT type="text/javascript" src="jquery.js"></SCRIPT>
<script type="text/javascript" src="ext-5.1.3/build/ext-all.js"></script> 
<!--link rel="stylesheet" type="text/css" href="ext-5.1.3/build/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script type="text/javascript" src="ext-5.1.3/build/packages/ext-theme-classic/build/ext-theme-classic.js"></script-->

<link rel="stylesheet" type="text/css" href="ext-5.1.3/build/packages/ext-theme-neptune-touch/build/resources/ext-theme-neptune-touch-all.css">
<script type="text/javascript" src="ext-5.1.3/build/packages/ext-theme-neptune-touch/build/ext-theme-neptune-touch.js"></script>

<link rel="stylesheet" type="text/css" href="css/css.css" />

<script type="text/javascript" src="ext-5.1.3/build/packages/sencha-charts/build/sencha-charts.js"></script>
<link rel="stylesheet" type="text/css" href="ext-5.1.3/build/packages/sencha-charts/build/classic/resources/sencha-charts-all.css">


 <?php $d = "?t=".time() ?>
<!-- =================================================== locale ====================================================== -->
<?php if($_SESSION['locale']=='en'){ ?>
<SCRIPT type="text/javascript" src="ext-5.1.3/packages/ext-locale/build/ext-locale-en.js<?=$d?>"></SCRIPT>
<SCRIPT type="text/javascript" src="lang/lang.en.js<?=$d?>"></SCRIPT>
<?php }elseif($_SESSION['locale']=='es'){ ?>
<SCRIPT type="text/javascript" src="ext-5.1.3/packages/ext-locale/build/ext-locale-es.js<?=$d?>"></SCRIPT>
<SCRIPT type="text/javascript" src="lang/lang.es.js<?=$d?>"></SCRIPT>
<?php } ?>

<!-- ===================================================Библиотеки пользовательские====================================================== -->
<SCRIPT type="text/javascript" src="scripts/windowstyle.js<?=$d?>"></SCRIPT>
<SCRIPT type="text/javascript" src="tree-data.js<?=$d?>"></SCRIPT>
<SCRIPT type="text/javascript" src="scripts/vtypes.js<?=$d?>"></SCRIPT>

<SCRIPT type="text/javascript" src="loader.php?g=store&<?=$d?>"></SCRIPT>
<SCRIPT type="text/javascript" src="loader.php?g=all&<?=$d?>"></SCRIPT>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js<?=$d?>"></script>
<SCRIPT type="text/javascript" src="scripts/OrgChart.js<?=$d?>"></SCRIPT>

<SCRIPT type="text/javascript" src="scripts/ping.js<?=$d?>"></SCRIPT>


<SCRIPT type="text/javascript">
var interval = 60000;
if(lang=='ru'){
  var lua = false;
  var len = false;
  var lru = true;
}else if(lang=='ua'){
  var lua = true;
  var len = false;
  var lru = false;
}else{
  var lua = false;
  var len = true;
  var lru = false;
}

Ext.require([
	'*',
]);

var worflowItems = new Array("new_task", "in_progress", "completed", "overdue", "in_queue", "my_tasks");
var permissions = [];

function logout(){ 
window.document.location.href = 'logout.php';
}

function setCountForBtn(btn, text, count){
		btn.setText(text +'  '+'('+ count +')');
}

function getCountTask(){
	Ext.Ajax.request({
		   	url: 'scripts/datastore.php?func=getCountTask',
		   	method: 'POST',		   
			success: function(res){
				var result = Ext.decode(res.responseText);
				var new_button = Ext.getCmp('new_task_count');
				var inQue_button = Ext.getCmp('in_queue_count');
				var inPr_button = Ext.getCmp('in_progress_count');
				var overdue_button = Ext.getCmp('overdue_count');
				setCountForBtn(new_button, lan.new_task, result.count_new);
				setCountForBtn(inQue_button, lan.in_queue, result.count_inQue);
				setCountForBtn(inPr_button, lan.in_progress, result.count_inPr);
				setCountForBtn(overdue_button, lan.overdue, result.count_overdue);			   
			},
		});
}

function addTabMyTaskStatus(status_task){
	var id = 'my_tasks';
	tabs.items.each(function(item){
		if(item){
			if(item.id == 'tab'+id){
				tabs.remove(item);
			}
		}
	});
	
	var grid = addGridWorkFlow(id, status_task);
	addTab(true, lan.my_tasks,id,grid);
}

function getSystemInfo() {
    Ext.Ajax.request({
        url: 'version.php',
        method: 'POST',
        success: function(res){
            var result = Ext.decode(res.responseText);
            var top_block = Ext.getCmp('main-menu');
            var bottom_block = Ext.getCmp('version-block');
            top_block.setTitle(result['name']);
            bottom_block.setValue("ver. "+result['version']);
        },
    });
}

    
var all_rights = getUserRights(user_rights);
var tabs = Ext.create('Ext.tab.Panel', {
        resizeTabs: true,
        enableTabScroll: true,
		border:true,
		frame:false,
		activeTab: 0,
		layout: 'fit',
		collapsible: false,
		region: 'center',
		margins: '5 5 5 0',
        items:[],
        tools: [
	        {
	            xtype: 'button',
	            text : lan.new_task,
	            id:'new_task_count',
	            value:1,
	            handler:function(){
	            	addTabMyTaskStatus(1);
	            }
	        },
	        {
	            xtype: 'button',
	            text : lan.in_queue,
	            id:'in_queue_count',
	            value:6,
	            handler:function(){
	            	addTabMyTaskStatus(6);
	            }
	        },
	        {
	            xtype: 'button',
	            text : lan.in_progress,
	            id:'in_progress_count',
	            value:2,
	            handler:function(){
	            	addTabMyTaskStatus(2);
	            }
	        },
	        {
	            xtype: 'button',
	            text : lan.overdue,
	            id:'overdue_count',
	            value:5,
	            handler:function(){
	            	addTabMyTaskStatus(5);
	            }
	        },
        	{
				      xtype: 'combobox',
				      value: lang,
				      fixed:true,
				      layout:'fit',
				      style : {
		                  textAlign: 'center',
		                  top:0,
		                  right:0
				      },
				      width:80,
				      store: new Ext.data.Store({fields: ['myId','myLan'],
				                data:[
										{myId:'en', myLan:'EN'},
		    							{myId:'es', myLan:'ES'}
						]}),
					    valueField:'myId',
					    displayField:'myLan',
					    queryMode:'local',
					    editable: false,
					    listeners: {
			               	select: function() { 
			                    lang  =  this.getValue();
			                    setLang(lang);
			                }
			            }
			},
        ],
        listeners:{
        	afterRender:function(){
        		getCountTask();
				setInterval(function(){
					 getCountTask()
				  }, interval);
        	}
        }

	});

var index = 0;
    function addTab(closable,text,id,grid){
        ++index;
		tabs.add({
            closable: !!closable,
			layout: 'fit',
			autoScroll: false,
			floatable: false,
			align: 'stretch',
			defaults: { flex : 1 },
			border:false,
			id: 'tab'+id,
            title: text,
			items: [grid],
			listeners: {
				beforeclose: function(tab, eOpts) {
					Ext.MessageBox.confirm(lan.attention, lan.want_close, function(btn) {
						if (btn == 'yes') tab.destroy();
					});
					return false;
				}
			}
        }).show();
    }

	function addTabHTML(closable,text,id,html){
        ++index;
		tabs.add({
            closable: !!closable,
			layout: 'fit',
			autoScroll: true,
			floatable: false,
			frame: false,
			align: 'stretch',
			defaults: { flex : 1 },
			border:false,
			id: 'tab'+id,
			html: '<div id="chart_div" style="padding:15px; border:none;" ></div>',
            title: text
        }).show();
    }


Ext.onReady(function(){
	var store = Ext.create('Ext.data.TreeStore', {
        root: tree_data
    });
    		
	var treePanel = Ext.create('Ext.tree.Panel', {
        id: 'tree-panel',
		allowDeselect: true,
        split: true,
		border: false,
        height: '100%',
        width: '100%',
		layout: 'fit',
		align: 'stretch',
        rootVisible: false,
		singleExpand: true,
        autoScroll: false,
        store: store,
		listeners:{
			afterrender: function(){
				menuRightsManager(user_rights);
			},
			itemclick: function(s,r) {
				 r.expand();
			},
			select: function(tree, record){
				 if(record.get('leaf')){
					var id = record.get('id');
					var text = record.get('text');
					tabs.items.each(function(item){
						if(item){
							if(item.id == 'tab'+id){
								tabs.remove(item);
							}
						}
					});

					if(record.get('id')=='workflow_driven'){
						var paneldashboard = addChart();
						addTab(true,text,id,paneldashboard);
					}else if(record.get('id')=='progress'){
						var dashboard_panel = getDashboardPanel();
						addTab(true,lan.dashboard,id,dashboard_panel);
					}else if(record.get('id')=='progress_workflow'){
						var progressworkflow = addProgressWorkflow();
						addTab(true,text,id,progressworkflow);
					}else if(record.get('id')=='exit'){
						Ext.MessageBox.show({
							title:lan.exit,
							cls: 'msgbox',
							msg: lan.sure,
							buttons: Ext.MessageBox.YESNO,
							width:300,                       
							closable:false,
							fn: function(btn) {
								   if (btn == 'yes') logout();
							   }
							
							});
					}else if(record.get('id')=='localization'){
						var localization = addLocalization();
						addTab(true,text,id,localization);
					}else if(record.get('id')=='change_password') {
						var changePass = changePassword();
						addTab(true,text,id,changePass);
					}else if(record.get('id')=='manager_report') {
						var manReport = managerReport(id);
						addTab(true,text,id,manReport);
					}else if(record.get('id')=='org_status') {
						var orgStatus = statusOrg();
						addTab(true,text,id,orgStatus);
					}else if(record.get('id')=='user_list') {
						var userList = listUser();
						addTab(true,text,id,userList);
					}else if(record.get('id')=='comp_report') {
						var comp = compReport(id);
						addTab(true,text,id,comp);
					}else if (record.get('id')=='new_engineering_req'){	
						var inData = {task_id:id, type: true, rights: all_rights[id]};
						//var form = addForm(id, true, 0, null, all_rights[id]);
						var form = addForm(inData);
						addTab(true,text,id,form);
					}else if (record.get('id')=='new_component_req'){	
						var inData = {task_id:id, type: true, rights: all_rights[id]};
						var form = addForm(inData);
						addTab(true,text,id,form);
					}else if (worflowItems.indexOf(record.get('id'))!=-1){	
						var form = addGridWorkFlow(id, all_rights);
						addTab(true,text,id,form);
					}else if (record.get('id')=='user_driven'){
						var panelOrgChart = addTabOrgChart();
						addTab(true,text,id,panelOrgChart);
						//google.charts.setOnLoadCallback(drawChart(false));
						google.charts.setOnLoadCallback(drawChart(id_user, 'func'));
					}else{
						var grid = addGrid(id, all_rights[id]);
						addTab(true,text,id,grid);
					}
				 }
			},
			selectionchange: function(tree, record){
				treePanel.getSelectionModel().deselectAll();
				treePanel.getView().refresh();
			}
		}
    });
	

	function onItemCheck(item, checked){
		if(checked){
			Ext.request({
				url: 'scripts/preference.php',
				method: 'POST',
				params: {"lng":item.value},
				success: function (response){
					window.location.reload(true);
				},
				failure: function (response){ 
				}
			});
		}
    }
	
    Ext.create('Ext.Viewport', {
        layout: 'border',
		bodyBorder: true,
		items: [
		{
				region: 'north',
				border: false,
        },
		{
			//title: topmenu.menu,
			title: lan.main_menu,
			region:'west',
			floatable: false,
			split: true,
			collapsible: true,
			margins: '5 0 5 5',
			width: 200,
			minWidth: 200,
			maxWidth: 210,
            height: '100%',
			autoScroll: true,
            id: 'main-menu',
			items: [treePanel,
                {
                    xtype: 'displayfield',
                    cls: 'version',
                    id: "version-block",
                    listeners:{
                        afterrender: function () {
                            getSystemInfo();
                        }
                    }
                },]
		},
		tabs
		],
        renderTo: Ext.getBody(),

    });
	
	if(task_id){
		Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getTaskInfo=true',
            method: 'POST',
            params: {
                 task_id: task_id
                },
            success: function (response){
                if(response) {
                	var data = Ext.decode(response.responseText);
                	if(data){
                		var inData = {task_id:task_names[data.type_id], id_row: task_id, rights: all_rights[task_names[data.type_id]]};
                		//var form = addForm(task_names[data.type_id], null, task_id);
                		var form = addForm(inData);
						addTab(true,data.type_name,task_names[data.type_id],form);
                	}
               }
            },
            failure: function (response){ 
                Ext.MessageBox.alert('Error', response.responseText);
            }
        });
	}
	else {
		if(permissions.indexOf("engineering_root")!=-1){
			var dashboard_panel = getDashboardPanel();
			addTab(true,lan.dashboard,'progress',dashboard_panel);
		}
	}
	
});
</SCRIPT>

</head>
<body onload="">

</body>
</html>
