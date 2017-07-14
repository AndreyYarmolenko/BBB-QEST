function refreshDataCharts(time_id){
    var user = Ext.getCmp('users_for_chart'+time_id).getValue();
     var start = Ext.Date.format(Ext.getCmp('StartDate'+time_id).getValue(), 'Y-m-d');
     var end = Ext.Date.format(Ext.getCmp('EndDate'+time_id).getValue(), 'Y-m-d');
     var progress_store_chart = Ext.getCmp('tasks_progress_chart'+time_id).getStore();
     var frc_store_chart = Ext.getCmp('frc_progress_chart'+time_id).getStore();
     var requests_store_chart = Ext.getCmp('requests_progress_chart'+time_id).getStore();
     var due_store_chart = Ext.getCmp('tasks_due_chart'+time_id).getStore();

     progress_store_chart.load({
          params: {
              user:user,
              startDate:start,
              endDate:end
          }
      });

     frc_store_chart.load({
          params: {
              user:user,
              startDate:start,
              endDate:end
          }
      });

     requests_store_chart.load({
          params: {
              user:user,
              startDate:start,
              endDate:end
          }
      });

     due_store_chart.load({
          params: {
              user:user
          }
      });
}


function getBarTitleRequests(name, store){
    switch (name) {
        case 'new_request':
            BarTitle = lan.new_request+": "+store.new_request;
        break;
        case 'in_progress_request':
            BarTitle = lan.in_progress_request+": "+store.in_progress_request;
        break;
        case 'completed_request':
            BarTitle = lan.completed_request+": "+store.completed_request;
        break;
        case 'canceled_request':
            BarTitle = lan.canceled_request+": "+store.canceled_request;
        break;
    }
    return BarTitle
}

function getTasksDueWithin(time_id){
    var tasks_due_store = Ext.create('Ext.data.JsonStore', {
        fields: ['days_within', 'days_within_name', 'num'],
       	autoLoad: true,
        proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getTasksDueWithinData=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
    });

    var tasks_due = Ext.create('Ext.chart.CartesianChart', {
        width:'100%',
        height: 294,
        store: tasks_due_store,
        id: 'tasks_due_chart'+time_id,
        plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
        axes: [{
                type: 'category3d',
                fields: ['days_within_name'],
                position: 'bottom',
                grid: true
            }, {
                type: 'numeric3d',
                fields: ['num'],
                position: 'left',
                title: lan.numOfTasks,
                grid: true,
                minimum: 0,
        }],
        series: [{
		       type: 'bar3d',
		       xField: 'days_within_name',
		       yField: 'num',
		       style: {
		          // fill: "#FFD700"
		       },
		        tips: {
		            trackMouse: true,
		            style: 'background: #FFF',
		            height: 20,
		            renderer: function(storeItem, item) {
		                this.setTitle(lan[storeItem.data.days_within]+": "+storeItem.data.num);
		            }
		        },
            renderer: function(sprite, record, attr, index, store){
              var color=""
              switch(index){
                case 0:
                  color= '#6495ED';
                break;
                case 1:
                  color= '#CD5C5C';
                break;
                case 2:
                  color= '#DC143C';
                break;
                case 3:
                  color= '#FFFF00';
                break;
                case 4:
                  color= '#FFA500';
                break;
                case 5:
                  color= '#00FF7F';
                break;
                case 6:
                  color= '#3CB371';
                break;
                default:
                  color= "#FFFF00";
                break;
              }
               return Ext.apply(attr, {
                  fill: color
               });
            }
		   }],
        listeners: {
            itemclick: function (chart, item, event) {
             	if(Ext.getCmp('tasks_due_panel'+time_id).cls=='active_panel'){
                var user = Ext.getCmp('users_for_chart'+time_id).getValue();
                Ext.getCmp('departments_due_grid'+time_id).getStore().load({
                  params: {
                      within: item.record.data.days_within,
                      user: user
                  }
                });
                 var title = Ext.getCmp('tasks_due_panel'+time_id).title+'. '+lan[item.record.data.days_within];
                  PanelManager(time_id, 'departments_due_panel'+time_id, title);
            }
          }
        }
    });
    return tasks_due;
}

function getDepartmentDueChart(time_id){
    var departments_due_store = new Ext.data.Store({     
        fields: ['id_dep', 'name', 'num'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getDueDepByStatus=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var departments_chart = Ext.create('Ext.chart.CartesianChart', {
       width: '100%',
       height: 450,
       flipXY: true,
       id: 'departments_due_grid'+time_id,
       plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
       store:departments_due_store,
       axes: [{
           type: 'numeric3d',
           position: 'bottom',
           title: {
               text: lan.numOfTasks,
               fontSize: 15
           },
           fields: 'num',
           minimum: 0
       }, {
           type: 'category3d',
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
       type: 'bar3d',
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
        },
        renderer: function(sprite, record, attr, index, store){
          var color=""
          switch(index){
            case 0:
              color= '#6495ED';
            break;
            case 1:
              color= '#CD5C5C';
            break;
            default:
              color= "#FFD700";
            break;
          }
           return Ext.apply(attr, {
              fill: color
           });
        }
   }],
   listeners: {
        itemclick: function (chart, item, event) {
         var user = Ext.getCmp('users_for_chart'+time_id).getValue();
          Ext.getCmp('stages_due_chart'+time_id).getStore().load({
                    params: {
                    dep: item.record.data.id_dep,
                    user: user
                   }
                });
            var title = Ext.getCmp('departments_due_panel'+time_id).title;
            var depName = item.record.data.name;
            PanelManager(time_id, 'stages_due_panel'+time_id, title+", "+depName);
            }
        }
});
    return departments_chart;
}

function getStagesDueChart(time_id){
    var store_stages_due_chart = new Ext.data.Store({
        fields: ['id_dep', 'name', 'num'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getProgressDueTasksByDep=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var stages_chart = Ext.create('Ext.chart.CartesianChart', {
           width: '100%',
           height: 450,
           flipXY: true,
           id: 'stages_due_chart'+time_id,
           plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            },
           store:store_stages_due_chart,
           axes: [{
               type: 'numeric3d',
               position: 'bottom',
               title: {
                   text: lan.numbStages,
                   fontSize: 15
               },
               fields: 'num',
               minimum: 0
           }, {
               type: 'category3d',
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
           type: 'bar3d',
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
             var user = Ext.getCmp('users_for_chart'+time_id).getValue();
             Ext.getCmp('users_due_chart'+time_id).getStore().load({
                        params: {
                        type: item.record.data.id_type,
                        user: user
                       }
                    });

                var title = Ext.getCmp('stages_due_panel'+time_id).title;
                var stages_name = item.record.data.name;
                PanelManager(time_id, 'users_due_panel'+time_id, title+", "+stages_name);
                }
            }
    });
    return stages_chart;
}

function getUsersDueChart(time_id){
    var store_users_due_chart = new Ext.data.Store({
        fields: ['name', 'num', 'id_user'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getProgressDueUser=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var users_chart = Ext.create('Ext.chart.CartesianChart', {
           width: '100%',
           height: 450,
           flipXY: true,
           id: 'users_due_chart'+time_id,
           plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            },
           store:store_users_due_chart,
           axes: [{
               type: 'numeric3d',
               position: 'bottom',
               title: {
                   text: lan.numOfTasks,
                   fontSize: 15
               },
               minimum: 0
           }, {
               type: 'category3d',
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
           type: 'bar3d',
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
            	var store = Ext.getCmp('task_due_table'+time_id).getStore();
            	var store_url = 'scripts/storeChart.php?getDueTasksofUser=true&id_user='+item.record.data.id_user;
              	store.getProxy().setUrl(store_url);
                store.load({
                  params: {
                  	start: 0
                  }
                });
                Ext.getCmp('task_due_table'+time_id).down('pagingtoolbar').doRefresh();
              /*Ext.getCmp('task_due_table'+time_id).getStore().load({
                params: {
                  id_user: item.record.data.id_user
                }
              });*/

                var user_name = item.record.data.name;
                var title = Ext.getCmp('users_due_panel'+time_id).title;
                PanelManager(time_id, 'tasks_due_table_panel'+time_id, title+", "+user_name);
                }
       }
    });
    return users_chart;
}

function getTasksDueTable(time_id){

    var store_task_due_table = new Ext.data.Store({     
        fields: ['id', 'bbb_sku', 'task_type', 'id_task_type', 'request_id', 'responsible', 'assigned_to', 'request_date', 'assignment_date', 'due_date', 'complete_date', 'new_due_date'],
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getDueTasksofUser=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_task_due_table,
        displayInfo: true
    });

    var tasks_due_table = Ext.create('Ext.grid.Panel', {
        store: store_task_due_table,
        height: 500,
        width: '100%',
        id: 'task_due_table'+time_id,
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
        bbar: [PagingToolbar],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
               if ((cellIndex == 2 || cellIndex == 3)&&all_rights['user_driven']) {
                        tabs.items.each(function(item){
                            if(item){
                                if(item.id == 'tabuser_driven'){
                                    tabs.remove(item);
                                }
                            }
                        });

                    var panelOrgChart = addTabOrgChart();
                    var responsible = record.get('responsible_id');
                    var assigned_to = record.get('assigned_to_id');

                    if (cellIndex == 2 && responsible != 0){
                        addTab(true, lan.orgchart ,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(responsible, 'func'));
                    }else if (cellIndex == 3 && assigned_to != 0){
                        addTab(true, lan.orgchart ,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(assigned_to, 'func'));
                    }

                }
                else{
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
                    addTab(true,record.get('task_type'), task_names[id_task], form);
                }
            }
        }
    });
    return tasks_due_table;
}

function getDepartmentTable(time_id){
    var progress_departments_store = new Ext.data.Store({     
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

var departments_chart = Ext.create('Ext.chart.CartesianChart', {
       width: '100%',
       height: 450,
       flipXY: true,
       id: 'progress_departments_grid'+time_id,
       plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
       store:progress_departments_store,
       axes: [{
           type: 'numeric3d',
           position: 'bottom',
           title: {
               text: lan.numOfTasks,
               fontSize: 15
           },
           fields: 'num',
           minimum: 0
       }, {
           type: 'category3d',
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
       type: 'bar3d',
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
        },
        renderer: function(sprite, record, attr, index, store){
          var color=""
          switch(index){
            case 0:
              color= '#6495ED';
            break;
            case 1:
              color= '#CD5C5C';
            break;
            default:
              color= "#FFD700";
            break;
          }
           return Ext.apply(attr, {
              fill: color
           });
        }
   }],
   listeners: {
        itemclick: function (chart, item, event) {
          var user = Ext.getCmp('users_for_chart'+time_id).getValue();
          Ext.getCmp('stages_chart'+time_id).getStore().load({
                    params: {
                    dep: item.record.data.id_dep,
                    user: user
                   }
                });
            var title = Ext.getCmp('departments_panel'+time_id).title;
            var depName = item.record.data.name;
            PanelManager(time_id, 'stages_panel'+time_id, title+", "+depName);
            }
        }
});
    return departments_chart;
}

function getStagesChart(time_id){
    var store_stages_chart = new Ext.data.Store({
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

    var stages_chart = Ext.create('Ext.chart.CartesianChart', {
           width: '100%',
           height: 450,
           flipXY: true,
           id: 'stages_chart'+time_id,
           plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            },
           store:store_stages_chart,
           axes: [{
               type: 'numeric3d',
               position: 'bottom',
               title: {
                   text: lan.numbStages,
                   fontSize: 15
               },
               fields: 'num',
               minimum: 0
           }, {
               type: 'category3d',
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
           type: 'bar3d',
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
              var user = Ext.getCmp('users_for_chart'+time_id).getValue();
             Ext.getCmp('users_chart'+time_id).getStore().load({
                        params: {
                        type: item.record.data.id_type,
                        user: user
                       }
                    });

                var title = Ext.getCmp('stages_panel'+time_id).title;
                var stages_name = item.record.data.name;
                PanelManager(time_id, 'users_panel'+time_id, title+", "+stages_name);
                }
            }
    });
    return stages_chart;
}


function getUsersChart(time_id){
    var store_users_chart = new Ext.data.Store({
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

    var users_chart = Ext.create('Ext.chart.CartesianChart', {
           width: '100%',
           height: 450,
           flipXY: true,
           id: 'users_chart'+time_id,
           plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            },
           store:store_users_chart,
           axes: [{
               type: 'numeric3d',
               position: 'bottom',
               title: {
                   text: lan.numOfTasks,
                   fontSize: 15
               },
               minimum: 0
           }, {
               type: 'category3d',
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
           type: 'bar3d',
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
              var store = Ext.getCmp('task_progress_table'+time_id).getStore();
              var store_url = 'scripts/storeChart.php?getProgressTasksofUser=true&id_user='+item.record.data.id_user;
              store.getProxy().setUrl(store_url);
              store.load({
                  	params: {
                  		start: 0
                  	}
                  });
              Ext.getCmp('task_progress_table'+time_id).down('pagingtoolbar').doRefresh();
              /*Ext.getCmp('task_progress_table'+time_id).getStore().load({
                params: {
                  id_user: item.record.data.id_user
                }
              });*/

                var user_name = item.record.data.name;
                var title = Ext.getCmp('users_panel'+time_id).title;
                PanelManager(time_id, 'tasks_progress_table_panel'+time_id, title+", "+user_name);
                }
       }
    });
    return users_chart;
}

function getTasksProgressTable(time_id){

    var store_task_progress_table = new Ext.data.Store({     
        fields: ['id', 'bbb_sku', 'task_type', 'id_task_type', 'request_id', 'responsible', 'assigned_to', 'request_date', 'assignment_date', 'due_date', 'complete_date', 'new_due_date'],
        pageSize: 25,
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

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_task_progress_table,
        displayInfo: true
    });

    var tasks_progress_table = Ext.create('Ext.grid.Panel', {
        store: store_task_progress_table,
        height: 500,
        width: '100%',
        id: 'task_progress_table'+time_id,
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
        bbar: [PagingToolbar],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                if ((cellIndex == 2 || cellIndex == 3)&&all_rights['user_driven']) {
                        tabs.items.each(function(item){
                            if(item){
                                if(item.id == 'tabuser_driven'){
                                    tabs.remove(item);
                                }
                            }
                        });

                    var panelOrgChart = addTabOrgChart();
                    var responsible = record.get('responsible_id');
                    var assigned_to = record.get('assigned_to_id');

                    if (cellIndex == 2 && responsible != 0){
                        addTab(true, lan.orgchart ,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(responsible, 'func'));
                    }else if (cellIndex == 3 && assigned_to != 0){
                        addTab(true, lan.orgchart ,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(assigned_to, 'func'));
                    }

                }
                else{
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
                    addTab(true,record.get('task_type'), task_names[id_task], form);
                }
            }
        }
    });
    return tasks_progress_table;
}

function getFrcTable(time_id){

    var store_frc_table = new Ext.data.Store({     
        fields: ['id', 'bbb_sku', 'task_type', 'id_task_type', 'request_id', 'responsible', 'assigned_to', 'request_date', 'assignment_date', 'due_date', 'complete_date', 'new_due_date'],
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getFcrFullData=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_frc_table,
        displayInfo: true
    });

    var frc_table = Ext.create('Ext.grid.Panel', {
        store: store_frc_table,
        height: 500,
        width: '100%',
        id: 'frc_table'+time_id,
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
        bbar: [PagingToolbar],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                if ((cellIndex == 2 || cellIndex == 3)&&all_rights['user_driven']) {
                        tabs.items.each(function(item){
                            if(item){
                                if(item.id == 'tabuser_driven'){
                                    tabs.remove(item);
                                }
                            }
                        });

                    var panelOrgChart = addTabOrgChart();
                    var responsible = record.get('responsible_id');
                    var assigned_to = record.get('assigned_to_id');

                    if (cellIndex == 2 && responsible != 0){
                        addTab(true, lan.orgchart, 'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(responsible, 'func'));
                    }else if (cellIndex == 3 && assigned_to != 0){
                        addTab(true, lan.orgchart,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(assigned_to, 'func'));
                    }

                }else if (cellIndex == 1){

                }else{
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
                    addTab(true,record.get('task_type'), task_names[id_task], form);
                }
            }
        }
    });
    return frc_table;
}

function getRequestsProgressTable(time_id){

    var store_request_progress_table = new Ext.data.Store({     
        fields: ['id', 'order_id', 'creation_date', 'completion_date', 'created_by', 'completed_by', 'bbb_sku_id', 'bbb_sku', 'product_line', 'product_type', 'product_family'],
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getRequestsProgressTableData=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_request_progress_table,
        displayInfo: true
    });

    var request_progress_table = Ext.create('Ext.grid.Panel', {
        store: store_request_progress_table,
        height: 500,
        width: '100%',
        id: 'request_progress_table'+time_id,
        margin: '5 10',
        border: false,
        columns: [
            {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
            {text: lan.requestID, sortable: true, dataIndex: 'order_id', width: 120},
            {text: lan.creation_date, sortable: true, dataIndex: 'creation_date', width: 120},
            {text: lan.created_by, sortable: true, dataIndex: 'created_by', width: 120, tdCls:"col-href"},
            {text: lan.cancellation_date, sortable: true, dataIndex: 'completion_date', width: 120},
            {text: lan.canceled_by, sortable: true, dataIndex: 'completed_by', width: 120, tdCls:"col-href"},
            {text: lan.bbb_sku, sortable: true, dataIndex: 'bbb_sku', width: 120},
            {text: lan.family_type, sortable: true, dataIndex: 'product_family', width: 120},
            {text: lan.ProductType, sortable: true, dataIndex: 'product_type', width: 120},
            {text: lan.product_line, sortable: true, dataIndex: 'product_line', width: 120},
        ],
        bbar:[PagingToolbar],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                if((cellIndex == 3 || cellIndex == 5)&&all_rights['user_driven']){
                    tabs.items.each(function(item){
                        if(item){
                            if(item.id == 'tabuser_driven'){
                                tabs.remove(item);
                            }
                        }
                    });
                    var panelOrgChart = addTabOrgChart();
                    var created_by = record.get('created_by_id');
                    var completed_by = record.get('completed_by_id');

                    if (cellIndex == 5 && completed_by != 0){
                        addTab(true, lan.orgchart,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(completed_by, 'func'));
                    }else if (cellIndex == 3 && created_by != 0){
                        addTab(true, lan.orgchart,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(created_by, 'func'));
                    }
                }
                else {
                    
                	var store = Ext.getCmp('request_content_table'+time_id).getStore();
                	var store_url = 'scripts/storeChart.php?getRequestsContentTableData=true&request_id='+record.get('order_id');
                  	store.getProxy().setUrl(store_url);
                    store.load({
                      params: {
                      	start: 0
                      }
                    });
                     Ext.getCmp('request_content_table'+time_id).down('pagingtoolbar').doRefresh();
                    var title = Ext.getCmp('requests_progress_table_panel'+time_id).title;
                    PanelManager(time_id, 'requests_content_table_panel'+time_id, title+", "+lan.requestID+": "+record.get('order_id'));
                }
            }
        }
    });
    return request_progress_table;
}

function getRequestContentTable(time_id){
    var store_request_content_table = new Ext.data.Store({     
        fields: ['id', 'tasks_type', 'id_task_type', 'bbb_sku', {name:'request_id', type: 'int'}, 'assignee', 'assigned_by', 'requested_date', 'assignment_date', 'due_date', 'completion_date', 'new_due_date', 'task_status'],
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getRequestsContentTableData=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_request_content_table,
        displayInfo: true
    });

    var request_content_table = Ext.create('Ext.grid.Panel', {
        store: store_request_content_table,
        height: 500,
        width: '100%',
        id: 'request_content_table'+time_id,
        margin: '5 10',
        border: false,
        columns: [
            {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
            {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, width: 300},
            {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120},
            {text: lan.requestID, dataIndex: 'request_id', sortable: true, hideable: true, width: 120},
            {text: lan.status, dataIndex: 'task_status', sortable: true, hideable: true, width: 120},
            {text: lan.responsible, dataIndex: 'assigned_by', sortable: true, hideable: true, width:200, tdCls:"col-href"},
            {text: lan.assigned_to, dataIndex: 'assignee', sortable: true, hideable: true, width: 150, tdCls:"col-href"},
            {text: lan.requested_date, dataIndex: 'requested_date', sortable: true, hideable: true, width: 150},
            {text: lan.assignment_date, dataIndex: 'assignment_date', sortable: true, hideable: true, width: 150},
            {text: lan.dueDate, dataIndex: 'due_date', sortable: true, hideable: true, width: 150},
            {text: lan.completion_date, dataIndex: 'completion_date', sortable: true, hideable: true, width: 150},
            {text: lan.newDueDate, dataIndex: 'new_due_date', sortable: true, hideable: true, width: 150}
        ],
        bbar:[PagingToolbar],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                var id_task = task_names[record.get('id_task_type')];
                if((cellIndex==5||cellIndex==6)&&all_rights['user_driven']){
                    tabs.items.each(function(item){
                        if(item){
                            if(item.id == 'tabuser_driven'){
                                tabs.remove(item);
                            }
                        }
                    });
                    var panelOrgChart = addTabOrgChart();
                    var responsible = record.get('assigned_by_id');
                    var assigned_to = record.get('assignee_id');

                    if (cellIndex == 5 && responsible != 0){
                        addTab(true, lan.orgchart,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(responsible, 'func'));
                    }else if (cellIndex == 6 && assigned_to != 0){
                        addTab(true, lan.orgchart,'user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(assigned_to, 'func'));
                    }
                }
                else {
                  tabs.items.each(function(item){
                        if(item){
                            if(item.id == 'tab'+id_task){
                                tabs.remove(item);
                            }
                        }
                    });
                  var inData = {task_id:id_task, id_row: record.get('id'), rights: all_rights[id_task]};
                  var form = addForm(inData);
                  addTab(true, record.get('tasks_type'), id_task, form);
                }
            }
        }
    });
    return request_content_table;
}


function PanelManager(time_id, id, new_title) {
    hideAllPanels(time_id);
    var crumbs_el = Ext.getCmp('bread_crumbs'+time_id);
    if(id=='home'){
        var link_data =  getLinkData(crumbs_el);
        for(var i=0; i<link_data.length; i++){
            if(link_data[i].id!='home'){
               Ext.getCmp(link_data[i].id).setConfig('title', link_data[i].title);
            }
        }
        crumbs_el.setValue('');
        showAllPanels(time_id);
    }
    else {
        Ext.getCmp(id).setConfig('height', 500);
        Ext.getCmp(id).setConfig('cls', 'active_panel');
        Ext.getCmp(id).show();
        Ext.getCmp(id).down('panel').setConfig('height', 443);
        if(Ext.getCmp(id).down('panel').legend){
            Ext.getCmp(id).down('panel').getLegend().show();
        }
        var bread_crumbs = getLink(time_id, id, new_title);
        crumbs_el.setValue(bread_crumbs);
    }
}

function hideAllPanels(time_id){
    var panelsChart = Ext.getCmp('main_container'+time_id).query('panel');
    for(var i=0; i<panelsChart.length; i++){
        if(panelsChart[i].xtype=='panel'){
            panelsChart[i].hide();
        }
    }

    var panelsChartSecond = Ext.getCmp('main_container_second'+time_id).query('panel');
    for(var i=0; i<panelsChartSecond.length; i++){
        if(panelsChartSecond[i].xtype=='panel'){
            panelsChartSecond[i].hide();
        }
    }

    var panelsTables = Ext.getCmp('tables_container'+time_id).query('panel');
    for(var i=0; i<panelsTables.length; i++){
        if(panelsTables[i].xtype=='panel'){
            panelsTables[i].hide();
        }
    }
}

function showAllPanels(time_id){
    var panels = Ext.getCmp('main_container'+time_id).query('panel');
    for(var i=0; i<panels.length; i++){
        if(panels[i].xtype=='panel'){
            panels[i].setConfig('height', 350);
            panels[i].setConfig('cls', '');
            if(panels[i].down('panel').legend){
	            panels[i].down('panel').getLegend().hide();
	        }
            panels[i].down('panel').setConfig('height', 294);
            panels[i].show();
        }
    }

    var panels_second = Ext.getCmp('main_container_second'+time_id).query('panel');
    for(var i=0; i<panels_second.length; i++){
        if(panels_second[i].xtype=='panel'){
            panels_second[i].setConfig('height', 350);
            panels_second[i].setConfig('cls', '');
            if(panels_second[i].down('panel')&&panels_second[i].down('panel').legend){
	            panels_second[i].down('panel').getLegend().hide();
	        }
	        if(panels_second[i].down('panel')){
	        	panels_second[i].down('panel').setConfig('height', 294);
            	panels_second[i].show();
	        }
        }
    }

    var panelsTables = Ext.getCmp('tables_container'+time_id).query('panel');
    for(var i=0; i<panelsTables.length; i++){
        if(panelsTables[i].xtype=='panel'){
            panelsTables[i].hide();
        }
    }
}

function getLinkData(crumbs_el){
    var ex_path = crumbs_el.getValue();
    var link_data = [{id: 'home', title: lan.mainPanel}];
    var crumb_data = ex_path.split('>>');
    for(var i=1; i<crumb_data.length; i++){
        var temp = crumb_data[i].split('|');
        var prev_title = temp[2].slice(7, temp[2].length);
        prev_title = prev_title.replace("<\/a>", "").trim();
        link_data.push({id:temp[1], title: prev_title});
    }
    return link_data;
}
 

function getLink(time_id, id, new_title){
    var link = '';
    var isExist = false;
    var crumbs_el = Ext.getCmp('bread_crumbs'+time_id);
    var title =  Ext.getCmp(id).title;
    var link_data = getLinkData(crumbs_el);

    for(var i=0; i<link_data.length; i++){
        if(id==link_data[i].id){
            isExist = true;
        }
    }

    if(isExist){
        var k=0;
        while(link_data[k].id!=id){
            link += '<a onclick="PanelManager('+time_id+', \''+link_data[k].id+'\', \''+link_data[k].title+'\');" href="#"><span style="display:none">|'+link_data[k].id+'|</span>'+link_data[k].title+'</a> >>';
            k++;
        }
        link +='<span style="display:none">|'+link_data[k].id+'|</span>'+link_data[k].title;

        for(var j=k+1; j<link_data.length; j++){
            Ext.getCmp(link_data[j].id).setConfig('title', link_data[j].title);
        }
    }
    else {
        for(var k =0; k<link_data.length; k++){
            link += '<a onclick="PanelManager('+time_id+', \''+link_data[k].id+'\', \''+link_data[k].title+'\');" href="#"><span style="display:none">|'+link_data[k].id+'|</span>'+link_data[k].title+'</a> >>';
        }
        link +='<span style="display:none">|'+id+'|</span>'+title;
        Ext.getCmp(id).setConfig('title', new_title);
    }
    return link;
}


function getTasksProgressChart(time_id){
   var tasks_progress_store = Ext.create('Ext.data.JsonStore', {
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

   var tasks_progress = Ext.create('Ext.chart.CartesianChart', {
    width: '100%',
    height: 294,
    store: tasks_progress_store,
    id: 'tasks_progress_chart'+time_id,
    legend: {
        docked: 'bottom',
        hidden: true
    },
    plugins: {
        ptype: 'chartitemevents',
        moveEvents: true
    },
    axes: [{
            type: 'category3d',
            fields: ['month'],
            position: 'bottom',
            grid: true
        }, {
            type: 'numeric3d',
            fields: ['new_task', 'in_queue', 'in_progress', 'completed', 'overdue'],
            position: 'left',
            title: lan.numOfTasks,
            grid: true,
            minimum: 0,
    }],
    series: [{
        type: 'bar3d',
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
        listeners: {
            itemclick: function (chart, item, event) {

            }
    }
    }],
    listeners: { 
        itemclick: function (chart, item, event) {
         if(Ext.getCmp('tasks_progress_panel'+time_id).cls=='active_panel'){
                var user = Ext.getCmp('users_for_chart'+time_id).getValue();
                 Ext.getCmp('progress_departments_grid'+time_id).getStore().load({
                          params: {
                          status: item.field,
                          month: item.record.data.monthId,
                          year: item.record.data.year,
                          user: user
                         }
                      });
                 
                  var date = item.record.data.month;
                  var statusName = getStatusName(item.field);
                  PanelManager(time_id, 'departments_panel'+time_id, lan.progress+", "+date+", "+statusName);
            }
        }
    }
});
    return tasks_progress;
}

function getRequestProgressChart(time_id){
    var requests_store = Ext.create('Ext.data.JsonStore', {
        fields: ['month', 'new_request', 'in_progress_request', 'completed_request', 'canceled_request'],
        autoLoad: true,
        proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getRequestsProgressData=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
    });

    var requests_progress = Ext.create('Ext.chart.CartesianChart', {
        width:'100%',
        height: 294,
        store: requests_store,
        id: 'requests_progress_chart'+time_id,
        legend: {
            docked: 'bottom',
            hidden: true
        },
        plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
        axes: [{
                type: 'category3d',
                fields: ['month'],
                position: 'bottom',
                grid: true
            }, {
                type: 'numeric3d',
                fields: ['new_request', 'in_progress_request', 'completed_request', 'canceled_request'],
                position: 'left',
                title: 'Number of Projects',
                //title: lan.numOfTasks,
                grid: true,
                minimum: 0,
        }],
        series: [{
            type: 'bar3d',
            xField: 'month',
            yField: ['new_request', 'in_progress_request', 'completed_request', 'canceled_request'],
           title: ['New', lan.in_progress, lan.completed, 'Canceled'],
            axis: 'bottom',
            subStyle: {
                fill: [palitra['new_task'], palitra['in_progress'], palitra['completed'],  palitra['overdue']],
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
                    var BarTitle = getBarTitleRequests(item.field, storeItem.data);
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
                //dep_show = false;
            },
            itemclick: function (chart, item, event) {
              if(Ext.getCmp('requests_progress_panel'+time_id).cls=='active_panel'){
                var user = Ext.getCmp('users_for_chart'+time_id).getValue();
                var store = Ext.getCmp('request_progress_table'+time_id).getStore();
                var store_url = 'scripts/storeChart.php?getRequestsProgressTableData=true&status='+item.field+'&month='+item.record.data.monthId+'&year='+item.record.data.year;
                  if(user){
                  	store_url +='&user='+user;
                  }
                  store.getProxy().setUrl(store_url);
                  store.load({
                  	params: {
                  		start: 0
                  	}
                  });
                  Ext.getCmp('request_progress_table'+time_id).down('pagingtoolbar').doRefresh();
                  //this.getView().down('pagingtoolbar').moveFirst();doRefresh();
                /*Ext.getCmp('request_progress_table'+time_id).getStore().load({
                  params: {
                      status: item.field,
                      month: item.record.data.monthId,
                      year: item.record.data.year,
                      user: user
                  }
                });*/
                 var title = lan.npd_project_progress+'. '+item.record.data.month+", "+lan[item.field];
                  PanelManager(time_id, 'requests_progress_table_panel'+time_id, title);
            }
          }
        }
    });
    return requests_progress;
}

function getFRCProgressChart(time_id){
    var legendTpl = '<div class="x-legend-container"><img src="./img/frc_legend_'+lang+'.png"></div>';

    var frc_store = Ext.create('Ext.data.JsonStore', {
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

    var frc_progress = Ext.create('Ext.chart.CartesianChart', {
        width:'100%',
        height: 294,
        store: frc_store,
        id: 'frc_progress_chart'+time_id,
        legend: {
            xtype: 'legend',
            tpl: [legendTpl],
            docked: 'bottom',
            hidden: true
        },
        plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
        axes: [{
            type: 'category3d',
            fields: 'month',
            position: 'bottom',
            grid: true
        },
        {
            type: 'numeric3d',
            position: 'left',
            title: lan.numOfTasks,
            grid: true,
            minimum: 0,
        },
        {
            type: 'numeric3d',
            id: 'frc-axis'+time_id,
            position: 'right',
            title: lan.title_frc,
            majorTickSteps: 20,
            listeners: {
                rangechange: function (axis, range) {
                    var cAxis = this.getChart().getAxis('frc-axis'+time_id);
                    if (cAxis) {
                        cAxis.setMinimum(0);
                        cAxis.setMaximum(100);
                    }
                }
            }
        }],
        series: [{
            type: 'bar3d',
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
                   var BarTitle = getBarTitleFRC(item.field, storeItem.data);
                   this.setTitle(BarTitle);
                }
            }
        },{
            type: 'bar3d',
            label: {
                },
            xField: 'month',
            yField: ['approved1', 'rejected1', 'frc'],
            yAxis: 'frc-axis'+time_id,
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
                   var BarTitle = getBarTitleFRC(item.field, storeItem.data);
                   this.setTitle(BarTitle);
                }
            }
        }],
        listeners: {
            itemclick: function (chart, item, event) {
              if(Ext.getCmp('frc_progress_panel'+time_id).cls=='active_panel'){
                if(item.field!='frc'){
                   var user = Ext.getCmp('users_for_chart'+time_id).getValue();
                   var store = Ext.getCmp('frc_table'+time_id).getStore();
                  var store_url = 'scripts/storeChart.php?getFcrFullData=true&status='+item.field+'&month='+item.record.data.monthId+'&year='+item.record.data.year;
                  if(user){
                  	store_url +='&user='+user;
                  }
                  store.getProxy().setUrl(store_url);
                  store.load({
	                  	params: {
	                  		start: 0
	                  	}
	                  });
                  Ext.getCmp('frc_table'+time_id).down('pagingtoolbar').doRefresh();
                  /* Ext.getCmp('frc_table'+time_id).getStore().load({
                        params: {
                          status: item.field,
                          month: item.record.data.monthId,
                          year: item.record.data.year,
                          user: user
                        }
                    });*/
                    Ext.getCmp('frc_table_panel'+time_id).setConfig('title', lan[item.field]);
                    var title = Ext.getCmp('frc_progress_panel'+time_id).title;
                    PanelManager(time_id, 'frc_table_panel'+time_id, title+', '+item.record.data.month+', '+lan[item.field]);
                }
            }
          }
        }
    });
    return frc_progress;
}

function getDashboardPanel(){
    var time_id = Date.parse(new Date());

    var requests_progress =  getRequestProgressChart(time_id);
    var tasks_progress = getTasksProgressChart(time_id);
    var frc_progress = getFRCProgressChart(time_id);
    var progress_departments_panel = getDepartmentTable(time_id);
    var stages_chart = getStagesChart(time_id);
    var users_chart = getUsersChart(time_id);
    var tasks_progress_table = getTasksProgressTable(time_id);
    var frc_table = getFrcTable(time_id);
    var requests_progress_table = getRequestsProgressTable(time_id);
    var requests_content_table = getRequestContentTable(time_id);
    var tasks_due_chart = getTasksDueWithin(time_id);
    var department_due_chart = getDepartmentDueChart(time_id);
    var stages_due_chart = getStagesDueChart(time_id);
    var users_due_chart = getUsersDueChart(time_id);
    var tasks_due_table = getTasksDueTable(time_id);

	var dashboard_panel = Ext.create('Ext.Panel',{
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
                    id: 'StartDate'+time_id,
                    fieldLabel: lan.dateStart,
                    labelAlign: 'top',
                    labelWidth: style.input2.labelWidth,
                    flex: 1,
                    margin: '5',
                    value: new Date().getFullYear()+'-01-01',
                    listeners: {
                        change: function(){
                           refreshDataCharts(time_id);
                        }
                    }
                },
                {
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    altFormats: 'Y-m-d',
                    anchor:'96%',
                    name: 'EndDate',
                    id: 'EndDate'+time_id,
                    fieldLabel: lan.endDate,
                    labelAlign: 'top',
                    labelWidth: style.input2.labelWidth,
                    flex: 1,
                    margin: '5',
                    value: new Date,
                    listeners: {
                        change: function(){
                          refreshDataCharts(time_id);
                        }
                    }
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.user,
                    labelAlign: 'top',
                    id: 'users_for_chart'+time_id,
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
                            refreshDataCharts(time_id);
                        }
                    }
                }]
            },
            { 
                xtype: 'container',
                anchor:'100%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'displayfield',
                    id:'bread_crumbs'+time_id,
                    value: '',
                    flex:1,
                    fieldStyle:'font-size:15px; text-align: left; font-weight: bold; margin-left: 15px; color:#4169E1;'
                }]
            },{
                xtype: 'container',
                id: 'main_container'+time_id,
                anchor:'100%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'panel',
                    title: lan.npd_project_progress,
                    id:'requests_progress_panel'+time_id,
                    header: {
                        titleAlign: 'center'
                    },
                    border: true,
                    margin: '5px 5px 5px 5px',
                    bodyStyle: {
                        background: '#B0E0E6',
                        padding: '6px',
                        borderRadius: '0px 0px 10px 10px',
                    },
                    items: requests_progress,
                    flex:1,
                    minWidth: 300,
                    height: 350,
                    listeners: {
                        click: {
                            element: 'el', 
                            fn: function(){
                                if(Ext.getCmp(this.id).cls!='active_panel'){
                                    PanelManager(time_id, this.id, Ext.getCmp(this.id).title);
                                }
                            }
                        }
                    }
                },{
                    xtype: 'panel',
                    title: lan.tasks_progress,
                    id:'tasks_progress_panel'+time_id,
                    header: {
                        titleAlign: 'center'
                    },
                    border: true,
                    margin: '5px 5px 5px 5px',
                    bodyStyle: {
                        background: '#B0E0E6',
                        padding: '6px',
                        borderRadius: '0px 0px 10px 10px',
                    },
                    items: tasks_progress,
                    flex:1,
                    minWidth: 300,
                    height: 350,
                    listeners: {
                        click: {
                            element: 'el', 
                            fn: function(){
                                if(Ext.getCmp(this.id).cls!='active_panel'){
                                    PanelManager(time_id, this.id, Ext.getCmp(this.id).title);
                                }
                            }
                        }
                    }
                }]
            },{
                xtype: 'container',
                id: 'main_container_second'+time_id,
                anchor:'100%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'panel',
                    title: 'Tasks Due Within(days)',
                    id:'tasks_due_panel'+time_id,
                    header: {
                        titleAlign: 'center'
                    },
                    border: true,
                    margin: '5px 5px 5px 5px',
                    bodyStyle: {
                        background: '#B0E0E6',
                        padding: '6px',
                        borderRadius: '0px 0px 10px 10px',
                    },
                    items: tasks_due_chart,
                    flex:1,
                    minWidth: 300,
                    height: 350,
                    listeners: {
                        click: {
                            element: 'el', 
                            fn: function(){
                                if(Ext.getCmp(this.id).cls!='active_panel'){
                                    PanelManager(time_id, this.id, Ext.getCmp(this.id).title);
                                }
                            }
                        }
                    }
                },{
                    xtype: 'panel',
                    title: 'FRC',
                    id:'frc_progress_panel'+time_id,
                    header: {
                        titleAlign: 'center'
                    },
                    border: true,
                    margin: '5px 5px 5px 5px',
                    bodyStyle: {
                        background: '#B0E0E6',
                        padding: '6px',
                        borderRadius: '0px 0px 10px 10px',
                    },
                    items: frc_progress,
                    flex:1,
                    minWidth: 300,
                    height: 350,
                    listeners: {
                        click: {
                            element: 'el', 
                            fn: function(){
                                if(Ext.getCmp(this.id).cls!='active_panel'){
                                    PanelManager(time_id, this.id, Ext.getCmp(this.id).title);
                                }
                            }
                        }
                    }
                }]
              },{
                xtype:'container',
                id: 'tables_container'+time_id,
                anchor:'100%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'panel',
                    title: lan.departments,
                    id:'departments_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: progress_departments_panel,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.stages,
                    id:'stages_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: stages_chart,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.users,
                    id:'users_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: users_chart,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.tasks_table,
                    id:'tasks_progress_table_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: tasks_progress_table,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: '',
                    id:'frc_table_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: frc_table,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.project_content,
                    id:'requests_progress_table_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: requests_progress_table,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.tasks_table,
                    id:'requests_content_table_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: requests_content_table,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.departments,
                    id:'departments_due_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: department_due_chart,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.stages,
                    id:'stages_due_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: stages_due_chart,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.users,
                    id:'users_due_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: users_due_chart,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                },{
                    xtype: 'panel',
                    title: lan.tasks_table,
                    id:'tasks_due_table_panel'+time_id,
                    hidden: true,
                    border: true,
                    margin: '5px 5px 5px 5px',
                    items: tasks_due_table,
                    flex:1,
                    minWidth: 300,
                    height: 500,
                }] 
            }]
           });
	return dashboard_panel;
}