storePolarChart = new Ext.data.Store({     
        fields: ['name', 'g1', 'id_status'],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getTasks=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });
	storeCartesianChartDepartment = new Ext.data.Store({     
        fields: ['name', 'g1', 'id_dep'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getDepTasks=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});
	storeCartesianChartDepartmentTasks = new Ext.data.Store({     
        fields: ['name', 'g1', 'id_type'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getTasksByDep=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
	});

    

    storeGridTasks = new Ext.data.Store({     
        fields: ['partNumber', 'assignee', 'manager', 'startDate'],
        proxy: {
            type: 'ajax',
            url: 'scripts/storeChart.php?getUser=1',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

function addChart(){	

var PolarChart = Ext.create('Ext.chart.PolarChart', {
    //renderTo: document.body,
    //width: 500,
    //height: 500,
    store: storePolarChart,
	animate: true,
	shadow: true,
    style:  {
		border: 0
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
    interactions: ['rotate'],
    //configure the legend.
    legend: {
        docked: 'right'
    },
    //describe the actual pie series.
    series: [{
        type: 'pie',
        xField: 'g1',
        label: {
            field: 'name',
            showInLegend: true,
            display: 'rotate',
            fontWeight: 'bold',
            renderer: function (text, sprite, config, rendererData, index) {
                   // console.log(rendererData.store.data.items[index].data);
                 return ""+rendererData.store.data.items[index].data.g1;
             }
        },
		highlight: true,
        donut: 25,
        style: {
            miterLimit: 10,
            lineCap: 'miter',
            //lineWidth: 2
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
        },
		subStyle: {
            fill: ["#FFA500", "#FAFF00", "#FF4772",  "#26FF05", "#FF0000", "#72A6FF"]
        }
    }],
	listeners: { // Listen to itemclick events on all series.
        itemclick: function (chart, item, event) {
            Ext.getCmp("Departments1").expand();
			var store = CartesianChart.getStore();
            storeCartesianChartDepartment.load({
                    params: {
					status: item.record.get('id_status')
                   }
                });

                       // CartesianChart2.redraw();
                }
            }
        });
           
  

var CartesianChart = Ext.create('Ext.chart.CartesianChart', {
    //renderTo: document.body,
    //width: 500,
    //height: 500,
    //flipXY: true,
    store: storeCartesianChartDepartment,
	animate: true,
	shadow: true,
    style:  {
		border: 0
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
    //set legend configuration
    /*legend: {
        docked: 'bottom'
    },*/
    //define the x and y-axis configuration.
    axes: [{
        type: 'category',
        position: 'bottom'
    }, {
        type: 'numeric',
        position: 'left',
        grid: true,
        minimum: 0
    }],

    //define the actual bar series.
    series: [{
        type: 'bar',
        yField: ['g1'],
        xField: 'name',
        //xField: 'name',
        //yField: ['g1', 'g2'],
		//yField: ['g1'],
        //axis: 'bottom',
        // Cycles the green and blue fill mode over 2008 and 2009
        // subStyle parameters also override style parameters
        subStyle: {
            //fill: ["#115fa6", "#94ae0a"]
           // fill: ["#115fa6"]
			fill: ["#87CEEB"]
        },
		label: {
			field: 'g1',
			display: 'insideEnd',
            fontWeight: 'bold'
           /* renderer: function (text, sprite, config, rendererData, index) {
                   console.log(rendererData.store.data.items[index].data);
                 return text
             }*/
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
            Ext.getCmp('tasks1').expand();
            var store = CartesianChart.getStore();
            storeCartesianChartDepartmentTasks.load({
                    params: {
					dep: item.record.get('id_dep')
                   }
                });
        }
    }
});

  

var CartesianChart2 = Ext.create('Ext.chart.CartesianChart', {
    //renderTo: document.body,
    //width: 500,
    //height: 500,
    //flipXY: true,
    store: storeCartesianChartDepartmentTasks,  
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
    //set legend configuration
    /*legend: {
        docked: 'bottom'
    },*/
    //define the x and y-axis configuration.
     axes: [{
        type: 'category',
        position: 'bottom'
    }, {
        type: 'numeric',
        position: 'left',
        grid: true,
        minimum: 0
    }],

    //define the actual bar series.
    series: [{
        type: 'bar',
        yField: ['g1'],
        xField: 'name',
        //xField: 'name',
        //yField: ['g1', 'g2'],
		//yField: ['g1'],
        //axis: 'bottom',
        // Cycles the green and blue fill mode over 2008 and 2009
        // subStyle parameters also override style parameters
        subStyle: {
            //fill: ["#115fa6", "#94ae0a"]
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
            Ext.getCmp('users1').expand();
			var store = grid_tasks.getStore();
             storeGridTasks.load({
                    params: {
					type: item.record.get('id_type')
                   }
                });
			
        }
    }
});
	
var grid_tasks = Ext.create('Ext.grid.Panel', {
        store: storeGridTasks,
		border:false,
		columns: [
			{ text: lan.partNumber, dataIndex: 'partNumber', width: 120 },
			{ text: lan.assignee, dataIndex: 'assignee', width: 120 },
			{ text: lan.manager, dataIndex: 'manager', width: 120 },
			{ text: lan.dateStart, dataIndex: 'startDate', flex: 1 }
		]
	});

	
var panel_dashboard = Ext.create('Ext.Panel',{
		layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
		},
		defaults: {
        frame: true,
		},
		items: [
	{                        
        xtype: 'panel',
        collapsible: false,
		title: lan.statuses,
		id: 'statuses1',
        flex: 4,
		layout: 'fit',
		items:[PolarChart],
        listeners: {
            expand: function (p, eOpts ){
                Ext.getCmp("statuses1").show();
                Ext.getCmp("Departments1").collapse();
                Ext.getCmp("Departments1").show();
                Ext.getCmp('users1').hide();
                Ext.getCmp("tasks1").hide();
            },
            collapse: function (p, eOpts ){
                Ext.getCmp("statuses1").show();
                Ext.getCmp("Departments1").collapse();
                Ext.getCmp("Departments1").show();
                Ext.getCmp('users1').hide();
                Ext.getCmp("tasks1").hide();
            }
        }		
    },{
        xtype: 'panel',
        title: lan.departments,
        id: 'Departments1',
        collapsed: true,
		collapsible: true,
        //hidden: true,
        flex: 4,
		layout: 'fit',
		items:[CartesianChart],
        listeners: {
            expand: function (p, eOpts ){
                Ext.getCmp("statuses1").hide();
                Ext.getCmp("Departments1").show();
                Ext.getCmp('users1').hide();
                Ext.getCmp("tasks1").collapse();
                Ext.getCmp("tasks1").show();
            },
            collapse: function (p, eOpts ){
                Ext.getCmp("statuses1").show();
                Ext.getCmp("Departments1").collapse();
                Ext.getCmp('users1').hide();
                Ext.getCmp("tasks1").hide();
            }
        }
    },{
        xtype: 'panel',
		title: lan.workflow_stages,
		id: 'tasks1',
        collapsed: true,
        collapsible: true,
        hidden: true,         
        flex: 4,
		layout: 'fit',
		items:[CartesianChart2],
        listeners: {
           expand: function (p, eOpts ){
                Ext.getCmp("statuses1").hide();
                Ext.getCmp("Departments1").hide();
                Ext.getCmp('users1').show();
                Ext.getCmp('users1').collapse();
                Ext.getCmp("tasks1").show();
            },
            collapse: function (p, eOpts ){
                Ext.getCmp("statuses1").hide();
                Ext.getCmp("Departments1").show();
                Ext.getCmp('users1').hide();
                Ext.getCmp("tasks1").collapse();
            }
        }
    },{
        xtype: 'panel',
		title: lan.tasks,
		id: 'users1',
        collapsed: true,
        collapsible: true, 
        hidden: true,        
        flex: 4,
		layout: 'fit',
		items:[grid_tasks],
        listeners: {
            expand: function (p, eOpts ){
                Ext.getCmp("statuses1").hide();
                Ext.getCmp("Departments1").hide();
                Ext.getCmp('users1').show();
                Ext.getCmp("tasks1").hide();
            },
            collapse: function (p, eOpts ){
                Ext.getCmp("statuses1").hide();
                Ext.getCmp("Departments1").hide();
                Ext.getCmp('users1').collapse();
                Ext.getCmp("tasks1").show();
            }
        }
    }
		]
	});

return panel_dashboard;
	
}