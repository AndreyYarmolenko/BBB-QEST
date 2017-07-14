google.charts.load('current', {packages:["orgchart"]});

function drawChart(user, branch) {
	Ext.getCmp('current_user_chart').setValue(user);
	Ext.getCmp('admin_branch_button').enable();
	Ext.getCmp('func_branch_button').enable();
    try{
	dataOrgChart = new google.visualization.DataTable();
    dataOrgChart.addColumn('string', 'Name');
    dataOrgChart.addColumn('string', 'Manager');
    dataOrgChart.addColumn('string', 'ToolTip');
	
	Ext.Ajax.request({
			url: 'scripts/OrgChart.php?getUserPositions=true',
			method: 'POST',
			params: { 
				user: user
			},
			success: function(response){
				var data = Ext.decode(response.responseText);
				var rows = [];
				var colors_arr = [];
				var func_bg = '#87CEEB';
				var func_border = '#4169E1';
				var admin_bg = '#98FB98';
				var admin_border = '#008000';
				
    			var name_style = 'style="font-weight:bold; line-height: 0.9em;"';
    			var img_style = 'style="margin-top: 4px; width: 130px; height: 150px; border: 1px solid #FF0000; border-radius: 4px;"';
				for(var i=0; i<data.length; i++){
					var manager = "";
					if(data[i].func_manager){
						manager += data[i].func_manager;
					}
					else if(data[i].admin_manager){
						manager += data[i].admin_manager;
					}

					if(data[i].id==user){
						data[i].branch = branch;

						if(branch=='func'){
							manager = ""+data[i].func_manager;
						}
						else {
							manager = ""+data[i].admin_manager;
						}
					}

					var user_tip = ""+data[i].title;
					if(data[i].branch=='admin'){
						colors_arr[i] = {bg: admin_bg, border: admin_border};
					}
					else {
						colors_arr[i] = {bg: func_bg, border: func_border};
					}

					if(data[i].active!=1){
						colors_arr[i] = {bg: '#A9A9A9', border: '#696969'};
						data[i].title += "<br>"+lan.not_active;
					}

					if(data[i].branch==branch){
						colors_arr[i]['opacity'] = "opacity: 1";
					}
					else {
						colors_arr[i]['opacity'] = "opacity: 0.5";
					}

					var position_style = 'style="color:#FF0000; font-size:11px; font-weight:bold; line-height: 0.9em; width: 150px !important; height: 35px; border-top: 1px solid #FF0000;border-bottom: 1px solid #FF0000; padding: 3px 0; background: linear-gradient(90deg, '+colors_arr[i].bg+' 0%, #fff 30%, #fff 70%, '+colors_arr[i].bg+' 100%);"';
					var buttons = '<div style="clear: both;"></div><a href="#"><img align="left" src="img/Info.png" width="30" height="30" onclick="selectHandler('+data[i].id+')"/><img align="right" src="img/Next.png" width="30" height="30" onclick="drawChart('+data[i].id+', \'func\')"/></a>';
					var user_data = {v: ""+data[i].id, f:'<span '+name_style+'>'+data[i].name+'</span><div '+position_style+'>'+data[i].title+'</div><img '+img_style+'  src="'+data[i].photo+'"/>'+buttons};
					
						rows[i] = [user_data, manager, user_tip];
				}
				dataOrgChart.addRows(rows);
				for(var i=0; i<rows.length; i++){
					dataOrgChart.setRowProperty(i, 'style', 'border: 3px solid '+colors_arr[i].border+'; background: '+colors_arr[i].bg+'; '+colors_arr[i].opacity+';');
				}

				var admin_branch = false;
				var func_branch = false;
				for(var i = 0; i<data.length; i++){
					if(data[i].branch=='admin'){
						admin_branch=true;
					}
					if(data[i].branch=='func'){
						func_branch=true;
					}
					
				}

				if(!admin_branch){
					Ext.getCmp('admin_branch_button').disable();
				}

				if(!func_branch){
					Ext.getCmp('func_branch_button').disable();
				}
				

				orgChart = new google.visualization.OrgChart(document.getElementById('chart_div'));
				orgChart.draw(dataOrgChart, {allowHtml:true});
				
			},
			failure: function(response){
				console.log(response.responseText);
			}
	});
	
	}catch(e){
		alert(lan.error+' ' + e.name + ":" + e.message + "\n" + e.stack);
	}
}


function CreatePersonalDashBoard(json, selectedValue){
	var formUserOrgChart = new Ext.create('Ext.form.Panel', {
				autoScroll: true,
				bodyPadding: '5 5 5 5',
				border: false,
				frame: false,
				items:[
				
			
			{
            xtype: 'container',
			anchor: '100%',
            layout:'column',
            items:[
				{
                xtype: 'container',
                columnWidth:.2,
                layout: 'anchor',
                items: [
					{
					    xtype: 'image',
					    src: json[0]['photo'],
					    //id:'fotoUser',
						width: 150,
						height: 150
					}
				]
				},{
                xtype: 'container',
                columnWidth:.8,
                layout: 'anchor',
                items: [
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.fullName,
	                    name: 'fullName',
						anchor: '90%',
						readOnly: true,
						value: json[0]['name']
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.manager,
	                    name: 'manager',
						anchor: '90%',
						readOnly: true,
						value: json[0]['boss_id']
					},
					{
					xtype: 'container',
	                // columnWidth:.8,
	                anchor: '90%',
	                margin: '8 0',
	                layout: {
							type: 'hbox',
						},
 /*--------- VIEW JD ---------------*/						
	                items: [
							{
			                    xtype: 'textfield',
			                    fieldLabel: lan.position,
			                    name: 'title',
								anchor: '90%',
								readOnly: true,
								flex: 3,
								value: json[0]['title']
							},
							{
								xtype: 'button',
								text: "View",
								margin: '0 0 0 15',
								cls: 'disable',
								flex: 0.5,
								handler: function (obj) {
	        						var	job_title = json[0]['title'];
									Ext.Ajax.request({
										url: 'scripts/bbb_courier.php?getViewUserJobDescription=true',
										method: 'POST',
										params: {
											job_title:job_title
										},
										success: function (response) {
										var data = Ext.decode(response.responseText);
											if ((!data) || (data == null)) {
												Ext.MessageBox.alert(lan.error, 'View job description impossible');
											}
											else {
												show_jobDescription_view(data.id_job_title);
											}
										},
										failure: function (response) {
											Ext.MessageBox.alert(lan.error, response.responseText);
										}
									});
								
								}
							},
							]
					},
 /*-----------------------*/					
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.department,
	                    name: 'department',
						anchor: '90%',
						readOnly: true,
						value: json[0]['department_id']
					}]
				}]
			}]
	});

statusGlobalOrgChart = null;
var gridTasksOrgChart = Ext.create('Ext.grid.Panel', {
        store: tasksOrgChartStore,
		border:false,
		columns: [
			{ text: lan.name, dataIndex: 'name', width: 120 },
			{ text: lan.count, dataIndex: 'counttask', flex: 1 }
		],
		listeners: {
		    	itemdblclick: function(cmp, records) {
		    		
		    	},
		    	itemclick: function(cmp, records) {
		    		statusGlobalOrgChart = records.get('status_id');
					storeCartesianOrgChartTasks.load({
                    params: {
						status: statusGlobalOrgChart,
						iduser: selectedValue
					}
					});
					Ext.getCmp("panelTasksChartOrgChart"+selectedValue).expand();
					Ext.getCmp("panelSummaryGridOrgChart"+selectedValue).collapse();
		    	}
		}
	});
	
	
	
	// --- tasks grid ---
	var storePanelTasksGridOrgChart = new Ext.data.Store({     
		fields: ['task_type','status','request_id','responsible','assigned_to','request_date','assignment_date','due_date','complete_date','new_due_date','id_user'],
        proxy: {
            type: 'ajax',
            url: 'scripts/OrgChart.php?getProgressUser=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});

var gridTasksGridOrgChart = Ext.create('Ext.grid.Panel', {
        store: storePanelTasksGridOrgChart,
		border:false,
		columns: [
        {text: lan.taskType, dataIndex: 'task_type', width: 120},
        {text: lan.status, dataIndex: 'status', width: 120},
        {text: lan.requestID, dataIndex: 'request_id', width: 120},
        {text: lan.responsible, dataIndex: 'responsible', width: 120},
        {text: lan.assignedTo, dataIndex: 'assigned_to', width: 120},
        {text: lan.requested_date, dataIndex: 'request_date', width: 120},
        {text: lan.assignment_date, dataIndex: 'assignment_date', width: 120},
        {text: lan.dueDate, dataIndex: 'due_date', width: 120},
        {text: lan.completeDate, dataIndex: 'complete_date', width: 120},
        {text: lan.newDueDate, dataIndex: 'new_due_date', width: 120}
		],
		listeners: {
			itemdblclick: function(View, record, item, index, e, eOpts) {
						var id_task = task_names[record.get('id_task_type')];

						tabs.items.each(function(item){
								if(item){
									if(item.id == 'tab'+id_task){
										tabs.remove(item);
									}
								}
							});
						var inData = {task_id:id_task, id_row: record.get('id'), id_comp: record.get('id_status'), rights: all_rights[id_task]};
						var form = addForm(inData);
						//var form = addForm(id_task, false, record.get('id'), record.get('id_status'));
						addTab(true,record.get('task_type'), id_task, form);
			}
		}
	});
	
	
	// --- chart tasks сartesian
	var storeCartesianOrgChartTasks = new Ext.data.Store({     
        fields: ['name', 'g1', 'id_type'],
        proxy: {
            type: 'ajax',
            url: 'scripts/OrgChart.php?getTasksByUser=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});
	
var CartesianOrgChartTasks = Ext.create('Ext.chart.CartesianChart', {
    store: storeCartesianOrgChartTasks,  
	animate: true,
	shadow: true,
    style:  {
		border: 0,
    },
	insetPadding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        },
	plugins: {
        ptype: 'chartitemevents',
        moveEvents: true
    },
     axes: [{
        type: 'category',
        position: 'bottom',
        label: {
        	rotate: {
        		degrees: 700
        	}
        }
    }, {
        type: 'numeric',
        position: 'left',
        grid: true,
        minimum: 0
    }],

    series: [{
        type: 'bar',
        yField: ['g1'],
        xField: 'name',
        subStyle: {
			fill: ["#98FB98"]
        },
		label: {
			field: 'g1',
			display: 'insideEnd',
            fontWeight: 'bold'
		},
		tips: {
                    trackMouse: true,
                    style: 'background: #FFF',
                    height: 20,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('name') + ': ' + storeItem.get('g1'));
                    }
        },
		listeners: {
            itemmousemove: function (series, item, event) {
                 //console.log('itemmousemove', item.category, item.field);
            }
        }
    }],
	listeners: { // Listen to itemclick events on all series.
        itemclick: function (chart, item, event) {
			//var store = grid_tasks.getStore();
			storePanelTasksGridOrgChart.load({
                    params: {
					type: item.record.get('id_type'),
					status: statusGlobalOrgChart,
					iduser: selectedValue
                   }
            });
			
			Ext.getCmp("panelTasksGridOrgChart"+selectedValue).expand();
			Ext.getCmp("panelTasksChartOrgChart"+selectedValue).collapse();
			
        }
    }
	});
	
	
	
			
			
var itemPanel = Ext.create('Ext.Panel',{
		layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
		},
		defaults: {
        frame: true,
        //bodyPadding: 10
		},
		items: [
	{                        
        xtype: 'panel',
        collapsible: false,
		collapsed: false,
		height: 170,
		//layout: 'fit',
		items:[formUserOrgChart]		
    },{
        xtype: 'panel',
        title: lan.summary,
		id: 'panelSummaryGridOrgChart'+selectedValue,
        collapsed: false,
		collapsible: true,  
        flex: 4,
		layout: 'fit',
		items:[gridTasksOrgChart]
    },{
        xtype: 'panel',
		title: lan.tasks,
		id: 'panelTasksChartOrgChart'+selectedValue,
        collapsed: true,
        collapsible: true,          
        flex: 4,
		layout: 'fit',
		items:[CartesianOrgChartTasks]
    },{
        xtype: 'panel',
		title: lan.TaskDetails,
		id: 'panelTasksGridOrgChart'+selectedValue,
        collapsed: true,
        collapsible: true,          
        flex: 4,
		layout: 'fit',
		items:[gridTasksGridOrgChart]
    }
		]
	});

	return itemPanel;
}




function selectHandler(selectedValue){
	tasksOrgChartStore = new Ext.data.Store({     
        fields: ['name', 'counttask', 'status_id'],
        proxy: {
            type: 'ajax',
            url: 'scripts/OrgChart.php?getTasks=1&iduser='+selectedValue,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});
	tasksOrgChartStore.load();
	
	Ext.Ajax.request({
			url: 'scripts/OrgChart.php',
			method: 'POST',
			params: { 
				showUser: selectedValue
			},
			success: function(obj){
				
			json = JSON.parse(obj.responseText);
			// --- summary task grid ---

			tabs.items.each(function(item){
			      if(item){
			       if(item.id == 'tab'+selectedValue+'_user_orgchart'){
			        tabs.remove(item);
			       }
			      }
			 });

			var itemPanel = CreatePersonalDashBoard(json, selectedValue);
			
			addTab(true,json[0]['name'],selectedValue+'_user_orgchart',itemPanel);
				

			},
			failure: function(obj){
			}
	});
}

function addTabOrgChart(){
 	var item = Ext.create('Ext.Panel',{
		layout: 'fit',
		align: 'stretch',
		defaults: {
        frame: false,
		border:false,
        bodyPadding: 0
		},

	dockedItems:[
	{
    xtype:'toolbar',
    dock:'top',
    items:[
		{
		    xtype: 'button',
		    text: lan.clear,
		    handler: function() {
				Ext.getCmp('filterFieldOrgChart').setValue('');
				drawChart(id_user, 'func');
			}
		},
		'-',
		{
        xtype:'combobox',
        id: 'filterFieldOrgChart',
        name: 'filterFieldOrgChart',
        queryMode: 'remote',
        allowBlank: false,
        typeAhead: true,
        minChars:2,
        triggerAction: 'all',
        lazyRender: true,
        enableKeyEvents: true,
        labelWidth: style.input2.labelWidth,
        anchor: style.input2.anchor,
        store: data_store_users,
        displayField: 'value',
        valueField: 'id',
        autoSelect: true,
        validator: function (val) {
            errMsg = lan.user_not_found;
            return (data_store_users.find('value', val)!=-1) ? true : errMsg;
        }
    },{
    	xtype: 'hidden',
    	id: 'current_user_chart'
    },
		{
		    xtype: 'button',
		    text: lan.submit,
		    handler: function() {         		
		        var filterVal = Ext.getCmp('filterFieldOrgChart').getValue();
				    if (filterVal != "") drawChart(filterVal, 'func');
				    else return;   
			}
		},
		'-'
		
	]
	}
	],

	items: [
	{
        xtype: 'panel',
		//title: 'Tasks',
        collapsed: false,
        collapsible: false,
		layout: 'fit',
		autoScroll: true,
		floatable: false,
		frame: false,
		align: 'stretch',
		defaults: { flex : 1 },
		border:false,
		dockedItems:[{
		    xtype:'toolbar',
		    dock:'top',
		    items:[{
            	xtype: 'button',
            	text: lan.functional_branch,
            	id: 'func_branch_button',
            	flex: 1,
            	handler: function(){
            		var current_user = Ext.getCmp('current_user_chart').getValue();
            		if(!current_user||current_user==""){
            			current_user = id_user;
            		}
            		drawChart(current_user, 'func');
            	}
            },{
                xtype: 'splitter',
            },{
            	xtype: 'button',
            	text: lan.administrative_branch,
            	id: 'admin_branch_button',
            	flex: 1,
            	handler: function(){
            		var current_user = Ext.getCmp('current_user_chart').getValue();
            		if(!current_user||current_user==""){
            			current_user = id_user;
            		}
 					drawChart(current_user, 'admin');
            	}
            	 }]
       }],
		html: '<div id="chart_div" style="padding:15px; border:none;" ></div>',
    }
	]
		});
		
		return item;
	
}