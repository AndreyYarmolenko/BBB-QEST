var BarTitle ='';
var palitra = {"new_task":"#72A6FF", "in_queue":"#FFD651", "in_progress":"#999999", "completed":"#26FF05",  "overdue":"#C45858", "approved":"#26FF05", "rejected":"#C45858", "frc":"#999999"};
var dep_show = false;
var frc_branch = false;
var legendTpl = '<div class="x-legend-container"><img src="./img/frc_legend_'+lang+'.png"></div>';

storeProgressDepartment = new Ext.data.Store({     
        fields: ['id_dep', 'name', 'num'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getDepByStatus=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});
	
storeProgressGridTasks = new Ext.data.Store({     
        fields: ['id', 'bbb_sku', 'task_type', 'id_task_type', 'request_id', 'responsible', 'assigned_to', 'request_date', 'assignment_date', 'due_date', 'complete_date', 'new_due_date'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getProgressTasksofUser=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });


storeProgressStages = new Ext.data.Store({
	fields: ['id_dep', 'name', 'num'],
	proxy: {
		type: 'ajax',
		url: 'scripts/storeChart.php?getProgressTasksByDep=true',
		reader: {
			type: 'json',
			root: 'rows',
			totalProperty: 'total'
		}
	}
});

storeProgressUsers = new Ext.data.Store({
	fields: ['name', 'num', 'id_user'],
	proxy: {
		type: 'ajax',
		url: 'scripts/storeChart.php?getProgressUser=true',
		reader: {
			type: 'json',
			root: 'rows',
			totalProperty: 'total'
		}
	}
});

function getBarTitleProgress(name, store){
	switch (name) {
		case 'new_task':
			BarTitle = lan.new_task+": "+store.new_task;
		break;
		case 'in_progress':
			BarTitle = lan.in_progress+": "+store.in_progress;
		break;
		case 'completed':
			BarTitle = lan.completed+": "+store.completed;
		break;
		case 'overdue':
			BarTitle = lan.overdue+": "+store.overdue;
		break;
		case 'in_queue':
			BarTitle = lan.in_queue+": "+store.in_queue;
		break;
	}
	return BarTitle
}

function getStatusName(field){
	switch (field) {
		case 'new_task':
			BarTitle = lan.new_task;
		break
		case 'in_progress':
			BarTitle = lan.in_progress;
		break
		case 'completed':
			BarTitle = lan.completed;
		break
		case 'overdue':
			BarTitle = lan.overdue;
		break
		case 'in_queue':
			BarTitle = lan.in_queue;
		break
	}
	return BarTitle
}


function getBarTitleFRC(name, store){
	switch (name) {
		case 'approved':
			BarTitle = lan.approved+": "+store.approved;
		break
		case 'frc':
			BarTitle = lan.title_frc+": "+store.frc;
		break
		case 'rejected':
			BarTitle = lan.rejected+": "+store.rejected;
		break
	}
	return BarTitle
}


function setMainTitle(id) {
	var MainTitle = Ext.getCmp('ProgressMainTitle').getValue();
	switch (id) {
		case 'frcBarId':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >>'+lan.frc);
		break
		case 'ProgressBarsId':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >>'+lan.progress);
		break
		case 'ProgressDepartments':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'ProgressBarsId\')" id="progress" href="#">'+lan.progress+'</a> >>'+lan.departments);
		break
		case 'ProgressStages':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'ProgressBarsId\')" id="progressBC" href="#">'+lan.progress+'</a> >> <a onclick="setMainTitleLink(\'ProgressDepartments\')" id="departmentsBC" href="#">'+lan.departments+'</a> >>'+lan.stages);
		break
		case 'ProgressUsers':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'ProgressBarsId\')" id="progressBC" href="#">'+lan.progress+'</a> >> <a onclick="setMainTitleLink(\'ProgressDepartments\')" id="departmentsBC" href="#">'+lan.departments+'</a> >><a onclick="setMainTitleLink(\'ProgressStages\')" id="stagesBC" href="#">'+lan.stages+'</a> >>'+lan.users);
		break
		case 'ProgressGridTasks':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'ProgressBarsId\')" id="progressBC" href="#">'+lan.progress+'</a> >> <a onclick="setMainTitleLink(\'ProgressDepartments\')" id="departmentsBC" href="#">'+lan.departments+'</a> >><a onclick="setMainTitleLink(\'ProgressStages\')" id="stagesBC" href="#">'+lan.stages+'</a> >><a onclick="setMainTitleLink(\'ProgressUsers\')" id="usersBC" href="#">Users</a> >>'+lan.tasksGrid);
		break
		case 'frcapproved':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'frc\')" id="approved" href="#">'+lan.frc+'</a> >>'+lan.approved);
		break
		case 'frcrejected':
			Ext.getCmp('ProgressMainTitle').setValue('<a onclick="setMainTitleLink(\'home\')" id="home" href="#">'+lan.mainPanel+'</a> >> <a onclick="setMainTitleLink(\'frc\')" id="approved" href="#">'+lan.frc+'</a> >>'+lan.rejected);
		break
	}
}

function hideAll() {
	Ext.getCmp('ProgressBarsId').hide();
	Ext.getCmp('ProgressBarsIdTitle').hide();
	Ext.getCmp('frcBarId').hide();
	Ext.getCmp('frcBarIdTitle').hide();
	Ext.getCmp('ProgressDepartments').hide();
	Ext.getCmp('ProgressStages').hide();
	Ext.getCmp('ProgressUsers').hide();
	Ext.getCmp('ProgressGridTasks').hide();
}

function setMainTitleLink(id) {
	//console.log(id);
	switch (id) {
		case 'home':
			hideAll();
			dep_show = false;
			frc_branch = false;
			Ext.getCmp('ProgressBarsId').show();
			Ext.getCmp('frcBarId').show();
			Ext.getCmp('ProgressBarsIdTitle').show();
			Ext.getCmp('frcBarIdTitle').show();
			Ext.getCmp('ProgressMainTitle').setValue('');
		break
		case 'ProgressBarsId':
			hideAll();
			Ext.getCmp('ProgressBarsId').show();
			Ext.getCmp('ProgressBarsIdTitle').show();
			dep_show = false;
			setMainTitle('ProgressBarsId');
		break
		case 'ProgressDepartments':
			hideAll();
			Ext.getCmp('ProgressDepartments').show();
			setMainTitle('ProgressDepartments');
		break
		case 'ProgressStages':
			hideAll();
			Ext.getCmp('ProgressStages').show();
			setMainTitle('ProgressStages');
		break
		case 'ProgressUsers':
			hideAll();
			Ext.getCmp('ProgressUsers').show();
			setMainTitle('ProgressUsers');
		break
		case 'ProgressGridTasks':
			hideAll();
			Ext.getCmp('ProgressGridTasks').show();
			setMainTitle('ProgressGridTasks');
		break
		case 'frc':
			hideAll();
			frc_branch = false;
			Ext.getCmp('frcBarId').show();
			Ext.getCmp('frcBarIdTitle').show();
			setMainTitle('frcBarId');
		break
	}
}


function addProgressChart(){

ProgressDataStore = Ext.create('Ext.data.JsonStore', {
	fields: ['month', 'new_task', 'in_progress', 'completed', 'overdue', 'in_queue'],
	autoLoad: true,
	proxy: {
	type: 'ajax',
	url: 'scripts/store.php?getProgressData=true',
	scope : this,
	reader: {
		type: 'json',
		root: 'rows',
		totalProperty: 'total'
	}
}
});


FrcDataStore = Ext.create('Ext.data.JsonStore', {
	fields: ['month', 'approved', 'rejected', 'frc'],
	autoLoad: true,
	proxy: {
	type: 'ajax',
	url: 'scripts/store.php?getFrcData=true',
	scope : this,
	reader: {
		type: 'json',
		root: 'rows',
		totalProperty: 'total'
	}
}
});

var ProgressBars = Ext.create('Ext.chart.CartesianChart', {
    height: 500,
	flex:1,
    store: ProgressDataStore,
    legend: {
        docked: 'bottom',
    },
	plugins: {
        ptype: 'chartitemevents',
        moveEvents: true
    },
    axes: [{
			type: 'category',
			fields: ['month'],
			/*label: {
				rotate: {
					degrees: 315
				}
			},*/
			//title: 'Month',
			position: 'bottom',
			grid: true
		}, {
			type: 'numeric',
			fields: ['new_task', 'in_queue', 'in_progress', 'completed', 'overdue'],
			position: 'left',
			title: lan.numOfTasks,
			grid: true
    }],
    series: [{
        type: 'bar',
        xField: 'month',
        yField: ['new_task', 'in_queue', 'in_progress', 'completed', 'overdue'],
       title: [lan.new_task, lan.in_queue, lan.in_progress, lan.completed, lan.overdue],
        axis: 'bottom',
        subStyle: {
			fill: [palitra['new_task'], palitra['in_queue'], palitra['in_progress'], palitra['completed'],  palitra['overdue']],
        },
		style: {
			maxBarWidth: 70,
			minGapWidth: 10
		},
		stacked: false,
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				var BarTitle = getBarTitleProgress(item.field, storeItem.data);
				this.setTitle(BarTitle);
			}
        },
		listeners: { // Listen to itemclick events on all series.
			itemclick: function (chart, item, event) {

			}
    }
    }],
	listeners: { // Listen to itemclick events on all series.
		afterrender: function() {
			dep_show = false;
		},
        itemclick: function (chart, item, event) {
           //console.log(item.record.data);
		  storeProgressDepartment.load({
                    params: {
					status: item.field,
					month: item.record.data.monthId,
					year: item.record.data.year
                   }
                });

			var date = item.record.data.month;
			var statusName = getStatusName(item.field);
			hideAll();
			Ext.getCmp('ProgressDepartments').show();
			dep_show = true;
			Ext.getCmp('DepartmentTitle').setValue(lan.progress+', '+date+", "+statusName);
			setMainTitle('ProgressDepartments');
        }
    }
});

var frcBar = Ext.create('Ext.chart.CartesianChart', {
    height: 500,
	flex:1,
    store: FrcDataStore,
    legend: {
	    xtype: 'legend',
	    tpl: [legendTpl],
	    docked: 'bottom'
    },
	plugins: {
        ptype: 'chartitemevents',
        moveEvents: true
    },
    axes: [{
        type: 'category',
		fields: 'month',
        /*label: {
			rotate: {
				degrees: 315
			}
	    },*/
	    position: 'bottom',
		grid: true
    },
	{
	    type: 'numeric',
	    position: 'left',
	    title: lan.numOfTasks,
		grid: true
	},
	{
	    type: 'numeric',
	    id: 'frc-axis',
	    position: 'right',
	    title: lan.title_frc,
        listeners: {
            rangechange: function (axis, range) {
                var cAxis = this.getChart().getAxis('frc-axis');
                if (cAxis) {
                    cAxis.setMinimum(0);
                    cAxis.setMaximum(100);
                }
            }
        }
	}],
    series: [{
        type: 'bar',
		label: {
			},
        xField: 'month',
		yField: ['approved', 'rejected', 'frc1'],
        title: [lan.approved, lan.rejected, lan.title_frc],
		style: {
			maxBarWidth: 40,
			minGapWidth: 20
		},
        subStyle: {
           fill: [palitra['approved'], palitra['rejected'], palitra['frc']],
        },
		stacked: false,
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				//console.log(storeItem.data);
				//console.log(item.field);
				var BarTitle = getBarTitleFRC(item.field, storeItem.data);
				this.setTitle(BarTitle);
			}
        }
    },{
        type: 'bar',
		label: {
			},
        xField: 'month',
		yField: ['approved1', 'rejected1', 'frc'],
		yAxis: 'frc-axis',
		style: {
			maxBarWidth: 40,
			minGapWidth: 20
		},
        subStyle: {
           fill: [palitra['approved'], palitra['rejected'], palitra['frc']],
        },
		stacked: false,
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				//console.log(storeItem.data);
				//console.log(item.field);
				var BarTitle = getBarTitleFRC(item.field, storeItem.data);
				this.setTitle(BarTitle);
			}
        }
    }],
	listeners: { // Listen to itemclick events on all series.
		afterrender: function() {
			frc_branch = false;
		},
        itemclick: function (chart, item, event) {
           //console.log(item);
          frc_branch = true;
		   if (item.field !='frc'){
			   storeProgressGridTasks.load({
               url: 'scripts/storeChart.php?getFcrFullData=true',
                    params: {
					status: item.field,
					month: item.record.data.monthId,
					year: item.record.data.year
                   }
                });
               hideAll();
            Ext.getCmp('ProgressGridTasks').show();
            Ext.getCmp('gridTasksTitle').setValue(lan.frc+', '+item.record.data.month+', '+lan[item.field]);
            setMainTitle('frc'+item.field);
		   }
        }
    }
});

var ProgressDepartmentsBar = Ext.create('Ext.chart.CartesianChart', {
	   width: 600,
	   height: 500,
	   flipXY: true,
	   flex: 3,
	   plugins: {
			ptype: 'chartitemevents',
			moveEvents: true
		},
	   store:storeProgressDepartment,
	   axes: [{
		   type: 'numeric',
		   position: 'bottom',
		   title: {
			   text: lan.numOfTasks,
			   fontSize: 15
		   },
		   fields: 'num',
		   minimum: 0
	   }, {
		   type: 'category',
		   position: 'left',
		   label: {
				rotate: {
					degrees: 315
				}
			},
		   title: {
			   text: lan.departments,
			   fontSize: 15
		   },
		   fields: 'name'
	   }],
	   series: [{
	   type: 'bar',
	   xField: 'name',
	   yField: 'num',
	   style: {
		   fill: "#6495ED"
	   },
	   label: {
			field: 'num',
			display: 'insideEnd',
			fontWeight: 'bold'
		},
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				this.setTitle(storeItem.data.name +": "+storeItem.data.num);
			}
        }
   }],
   listeners: {
		itemclick: function (chart, item, event) {
			//console.log(item.record.data.name);
		   //console.log(item.record.data.month+" : "+item.field);
		  storeProgressStages.load({
					params: {
					dep: item.record.data.id_dep
				   }
				});
			var title = Ext.getCmp('DepartmentTitle').getValue();
			var depName = item.record.data.name;
			Ext.getCmp('ProgressStages').show();
			Ext.getCmp('StagesTitle').setValue(title+", "+depName);
			Ext.getCmp('ProgressDepartments').hide();
			setMainTitle('ProgressStages');

			}
		}
});

var StagesBar = Ext.create('Ext.chart.CartesianChart', {
	   width: 600,
	   height: 500,
	   flipXY: true,
	   plugins: {
			ptype: 'chartitemevents',
			moveEvents: true
		},
	   store:storeProgressStages,
	   axes: [{
		   type: 'numeric',
		   position: 'bottom',
		   title: {
			   text: lan.numbStages,
			   fontSize: 15
		   },
		   fields: 'num',
		   minimum: 0
	   }, {
		   type: 'category',
		   position: 'left',
		   label: {
				rotate: {
					degrees: 315
				}
			},
		   title: {
			   text: lan.stages,
			   fontSize: 15
		   },
		   fields: 'name'
	   }],
	   series: [{
	   type: 'bar',
	   xField: 'name',
	   yField: 'num',
	   subStyle: {
		   fill: ["#6495ED", "#FF8C00", "#808080"],
	   },
	   label: {
			field: 'num',
			display: 'insideEnd',
			fontWeight: 'bold'
		},
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				this.setTitle(storeItem.data.name +": "+storeItem.data.num);
			}
        }
   }],
   listeners: {
		itemclick: function (chart, item, event) {
			//console.log(item);
		   //console.log(item.record.data.month+" : "+item.field);
		  storeProgressUsers.load({
					params: {
					type: item.record.data.id_type
				   }
				});

			var title = Ext.getCmp('StagesTitle').getValue();
			var StagesName = item.record.data.name;
			Ext.getCmp('ProgressUsers').show();
			Ext.getCmp('UsersTitle').setValue(title+", "+StagesName);
			Ext.getCmp('ProgressStages').hide();
			setMainTitle('ProgressUsers');
			}
		}
});

var ProgressUsers = Ext.create('Ext.chart.CartesianChart', {
	   width: 600,
	   height: 500,
	   flipXY: true,
	   plugins: {
			ptype: 'chartitemevents',
			moveEvents: true
		},
	   store:storeProgressUsers,
	   axes: [{
		   type: 'numeric',
		   position: 'bottom',
		   title: {
			   text: lan.numOfTasks,
			   fontSize: 15
		   },
		   minimum: 0
	   }, {
		   type: 'category',
		   position: 'left',
		   label: {
				rotate: {
					degrees: 315
				}
			},
		   title: {
			   text: lan.users,
			   fontSize: 15
		   },
	   }],
	   series: [{
	   type: 'bar',
	   xField: 'name',
	   yField: 'num',
	   label: {
			field: 'num',
			display: 'insideEnd',
			fontWeight: 'bold'
		},
	   subStyle: {
		   fill: ["#6495ED", "#FF8C00", "#808080"],
	   },
		tips: {
			trackMouse: true,
			style: 'background: #FFF',
			height: 20,
			renderer: function(storeItem, item) {
				this.setTitle(storeItem.data.name +": "+storeItem.data.num);
			}
        }
   }],
   listeners: {
		itemclick: function (chart, item, event) {
		  storeProgressGridTasks.load({
					params: {
					id_user: item.record.data.id_user
				   }
				});
			var title = Ext.getCmp('UsersTitle').getValue();
			var UserName = item.record.data.name;
			Ext.getCmp('ProgressGridTasks').show();
			Ext.getCmp('gridTasksTitle').setValue(title+", "+UserName);
			Ext.getCmp('ProgressUsers').hide();
			setMainTitle('ProgressGridTasks');
			}
   }
});


var ProgressGridTasks = Ext.create('Ext.grid.Panel', {
    store: storeProgressGridTasks,
    height: 500,
    width: '96%',
    margin: '5 10',
    border: false,
    columns: [
		{xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
		{text: lan.bbb_sku, sortable: true, dataIndex: 'bbb_sku', width: 120},
		{text: lan.responsible, sortable: true, dataIndex: 'responsible', width: 120, tdCls:"col-href"},
        {text: lan.assignedTo, sortable: true, dataIndex: 'assigned_to', width: 120, tdCls:"col-href"},
        {text: lan.taskType, sortable: true, dataIndex: 'task_type', width: 120},
        {text: lan.requestID, sortable: true, dataIndex: 'request_id', width: 120},
        {text: lan.requested_date, sortable: true, dataIndex: 'request_date', width: 120},
        {text: lan.assignment_date, sortable: true, dataIndex: 'assignment_date', width: 120},
        {text: lan.dueDate, sortable: true, dataIndex: 'due_date', width: 120},
        {text: lan.completeDate, sortable: true, dataIndex: 'complete_date', width: 120},
        {text: lan.newDueDate, sortable: true, dataIndex: 'new_due_date', width: 120}
    ],
    listeners: {
        celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
			//console.log(record.data);
			//console.log(cellIndex);
            if (cellIndex == 2 || cellIndex == 3) {
					tabs.items.each(function(item){
					    //console.log(item);
						if(item){
							if(item.id == 'tabuser_driven'){
								tabs.remove(item);
							}
						}
					});

				var panelOrgChart = addTabOrgChart();
                var responsible = record.get('responsible');
                var assigned_to = record.get('assigned_to');

				if (cellIndex == 2 && responsible != 0){
                    addTab(true,'OrgChart','user_driven',panelOrgChart);
                    google.charts.setOnLoadCallback(drawChart(responsible));
				}else if (cellIndex == 3 && assigned_to != 0){
                    addTab(true,'OrgChart','user_driven',panelOrgChart);
                    google.charts.setOnLoadCallback(drawChart(assigned_to));
				}

            }else if (cellIndex == 1){

			}else{
				 if(frc_branch != true){
				 	//setMainTitle('ProgressUserFullTasksId');
				 }
					var id_task = record.get('id_task_type');
					tabs.items.each(function(item){
							if(item){
								if(item.id == 'tab'+task_names[id_task]){
									tabs.remove(item);
								}
							}
						});
					var inData = {task_id:task_names[id_task], id_row: record.get('id'), rights: all_rights[task_names[id_task]], id_comp: record.get('id_status')};
					var form = addForm(inData);
					//var form = addForm(task_names[id_task], false, record.get('id'), record.get('id_status'));
					addTab(true,record.get('task_type'), task_names[id_task], form);
			}
        }
    }
});


var progressboard = Ext.create('Ext.Panel',{
        layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch',
        },
        defaults: {
        frame: true,
        },
        autoScroll: true,
        items: [{
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    altFormats: 'Y-m-d',
                    anchor:'96%',
                    name: 'StartDate',
                    id: 'StartDate',
                    fieldLabel: lan.dateStart,
                    labelAlign: 'top',
                    labelWidth: style.input2.labelWidth,
                    flex: 1,
                    margin: '5',
                    value: '2016-01-01',
                    listeners: {
                        change: function(){
                            var user = Ext.getCmp('users_for_chart').getValue();
                            var start = Ext.Date.format(Ext.getCmp('StartDate').getValue(), 'Y-m-d');
                            var end = Ext.Date.format(Ext.getCmp('EndDate').getValue(), 'Y-m-d');
                            ProgressDataStore.load({
                                params: {
                                    user:user,
                                    startDate:start,
                                    endDate:end
                                }
                            });
							FrcDataStore.load({
                                params: {
                                    user:user,
                                    startDate:start,
                                    endDate:end
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    altFormats: 'Y-m-d',
                    anchor:'96%',
                    name: 'EndDate',
                    id: 'EndDate',
                    fieldLabel: lan.endDate,
                    labelAlign: 'top',
                    labelWidth: style.input2.labelWidth,
                    flex: 1,
                    margin: '5',
                    value: new Date,
                    listeners: {
                        change: function(){
                            var user = Ext.getCmp('users_for_chart').getValue();
                            var start = Ext.Date.format(Ext.getCmp('StartDate').getValue(), 'Y-m-d');
                            var end = Ext.Date.format(Ext.getCmp('EndDate').getValue(), 'Y-m-d');
                            ProgressDataStore.load({
                                params: {
                                    user:user,
                                    startDate:start,
                                    endDate:end
                                }
                            });
							FrcDataStore.load({
                                params: {
                                    user:user,
                                    startDate:start,
                                    endDate:end
                                }
                            });
                        }
                    }
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.user,
                    labelAlign: 'top',
                    id: 'users_for_chart',
                    queryMode: 'remote',
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    flex: 1,
                    margin: '5',
                    listeners: {
                        change: function(){
                            var user = Ext.getCmp('users_for_chart').getValue();
                            var start = Ext.getCmp('StartDate').getValue();
                            var end = Ext.getCmp('EndDate').getValue();
                            ProgressDataStore.load({
                                params: {
                                    user:user,
                                    startDate:start,
                                    endDate:end
                                }
                            });
                        }
                    }
                }]
            },
			{
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
					xtype:'displayfield',
					id:'ProgressMainTitle',
                    value: '',
                    anchor:'96%',
                    flex:1,
                    fieldStyle:'font-size:15px; text-align: left; font-weight: bold; margin-left: 15px; color: #191970;'
				}]
			},
            {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
					xtype:'displayfield',
                    value: lan.progress,
					id:'ProgressBarsIdTitle',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 3,
                    fieldStyle:'font-size:20px; text-align: center; font-weight: bold;'
                },{
                    xtype:'displayfield',
					id:'frcBarIdTitle',
                    value: lan.frc,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 3,
                    fieldStyle:'font-size:20px; text-align: center; font-weight: bold;'
                }]
           },{
			   xtype: 'container',
                anchor:'96%',
				layout: {
                    type: 'hbox',
                },
                items: [
					{
					xtype: 'container',
					//anchor:'96%',
					items:  ProgressBars,
					id:'ProgressBarsId',
					flex:3,
					listeners: {
						click: {
							element: 'el', //bind to the underlying el property on the panel
							fn: function(){
								if(dep_show === false) {
									Ext.getCmp('frcBarId').hide();
									Ext.getCmp('frcBarIdTitle').hide();
									setMainTitle('ProgressBarsId');
								}
							}
						},
						dblclick: {
							element: 'body', //bind to the underlying body property on the panel
							fn: function(){ console.log('dblclick body'); }
						}
					}
					},
					{
					xtype: 'container',
					//anchor:'96%',
					items: frcBar,
					id:'frcBarId',
					flex:3,
					listeners: {
						click: {
							element: 'el', //bind to the underlying el property on the panel
							fn: function(){
								if(frc_branch === false) {
									Ext.getCmp('ProgressBarsId').hide();
									Ext.getCmp('ProgressBarsIdTitle').hide();
									setMainTitle('frcBarId');
								}
							}
						},
						dblclick: {
							element: 'body', //bind to the underlying body property on the panel
							fn: function(){ console.log('dblclick body'); }
						}
					}
					}
					]
		   },{
			   xtype: 'container',
				anchor:'96%',
				hidden: true,
				id: 'ProgressDepartments',
				layout: {
					type: 'vbox',
				},
				items: [{
                    xtype:'displayfield',
					id:'DepartmentTitle',
                    value: '',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 1,
                    fieldStyle:'font-size:15px; text-align: center; margin-left: 15px;'
                },ProgressDepartmentsBar]
		   },{
			   xtype: 'container',
				anchor:'96%',
				hidden: true,
				id: 'ProgressStages',
				layout: {
					type: 'vbox',
				},
				items:[{
                    xtype:'displayfield',
					id:'StagesTitle',
                    value: '',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 1,
                    fieldStyle:'font-size:15px; text-align: center; margin-left: 15px;'
                }, StagesBar]
		   },{
			   xtype: 'container',
				anchor:'96%',
				hidden: true,
				id: 'ProgressUsers',
				layout: {
					type: 'vbox',
				},
				items:[{
                    xtype:'displayfield',
					id:'UsersTitle',
                    value: '',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 1,
                    fieldStyle:'font-size:15px; text-align: center; margin-left: 15px;'
                },  ProgressUsers]
		   },{
			   xtype: 'container',
				anchor:'96%',
				hidden: true,
				id: 'ProgressGridTasks',
				layout: {
					type: 'vbox',
				},
				items: [{
                    xtype:'displayfield',
					id:'gridTasksTitle',
                    value: '',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    flex: 1,
                    fieldStyle:'font-size:15px; text-align: center; margin-left: 15px;'
                }, ProgressGridTasks]
		   }]
});

return progressboard;
}
