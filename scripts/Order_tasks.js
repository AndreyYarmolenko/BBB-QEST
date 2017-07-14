Ext.define('orderTasks_model', {
    extend: 'Ext.data.Model',
    fields: [
    			'task_id',
    			'order_id',
    			'assignee',
    			'start_date',
    			'finish_date',
    			'status',
    			'comment',
    			'assigned_by',
    			'task_type',
    			'previous_task_id'
    		]
});

var orderTasks_store = new Ext.data.Store({
    pageSize: 50,
    model: 'orderTasks_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Order_tasks.php?orderTasksShow=true',
      reader: 
      {
        type: 'json',
        root: 'rows',
		totalProperty: 'total'
      },
	  simpleSortMode: true
    },
	sorters:[
		{
            property: 'task_id',
            direction: 'ASC'
	    }
    ]
});

Ext.define('OrdersModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var OrdersStore = new Ext.data.Store({
    model: 'OrdersModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order_tasks.php?func=showOrders',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

Ext.define('UsersModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var UsersStore = new Ext.data.Store({
    model: 'UsersModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order.php?func=showUsers',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

Ext.define('TaskStatusModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var TaskStatusStore = new Ext.data.Store({
    model: 'TaskStatusModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order_tasks.php?func=showTaskStatus',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

Ext.define('TaskTypeModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var TaskTypeStore = new Ext.data.Store({
    model: 'TaskTypeModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order_tasks.php?func=showTaskType',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});



function show_orderTasks(){
	
	orderTasks_store.load();
        
    var PagingToolbar_orderTasks = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: orderTasks_store,
        displayInfo: true
    });
    	     	
var grid_orderTasks = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_orderTasks_id',
        autoScroll: true,
        store: orderTasks_store,
        //features: [RequestFilters],
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
			//selectedItemCls: 'red'
        },
		//plugins: [rowEditing],
        dockedItems: 
        [{
            xtype: 'toolbar',
            items: [
            {
                text: lan.add,
                iconCls: 'add',
                handler: function(){
					show_orderTasks_addedit();
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                hidden:true,
                handler: function(){
					var select = Ext.getCmp('grid_orderTasks_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention,  lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Order_tasks.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('task_id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_orderTasks_id').store.load();
												Ext.getCmp('grid_orderTasks_id').getView().refresh();
											}
										}catch(e) {
											Ext.MessageBox.alert(lan.error, lan.error+' ' + e.name + ":" + e.message + "\n" + e.stack);
										}
										}else{
											Ext.MessageBox.alert(lan.error, '');
										}
                                    },
                                    failure: function(response) {
                                        Ext.MessageBox.alert(lan.error, response.responseText);
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
				}
			},'-',
			{
                text: lan.edit,
                iconCls: 'edit',
                handler: function(){
            		var select = Ext.getCmp('grid_orderTasks_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_orderTasks_addedit(select.get('task_id'),select);
					} else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
				}
			}
		]
	}],
    columns:[
  		{
	        text:'№',
            width:40,
            xtype:'rownumberer'
		},
		{
            text: lan.partNumber, 
            dataIndex: 'part_num', 
            sortable: true
		},
		{
            text: lan.executor, 
            dataIndex: 'assignee_name', 
            sortable: true
		},
		{
            text: lan.dateStart, 
            dataIndex: 'start_date', 
            sortable: true
		},
		{
            text: lan.dateFinish, 
            dataIndex: 'finish_date', 
            sortable: true
		},
		{
            text: lan.status, 
            dataIndex: 'status_name', 
            sortable: true
		},
		{
            text: lan.manager, 
            dataIndex: 'assigned_by_name', 
            sortable: true
		},
		{
            text: lan.type, 
            dataIndex: 'task_type_name', 
            sortable: true
		},
		{
            text: lan.Comments, 
            dataIndex: 'comment', 
            sortable: true,
            flex: 1
		}
    ], 
    bbar:[PagingToolbar_orderTasks],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_orderTasks_addedit(select.get('task_id'),records);
    	}
    }
});
	
	return grid_orderTasks;
	
}



var WindowForm_orderTasks = null;
function show_orderTasks_addedit(idrow,select){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_orderTasks){
        
		WindowForm_orderTasks = new Ext.Window({
            width: 350,
            height: 360,
            title: texttype+' '+lan.task,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_orderTasks = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_orderTasks',
				frame: true,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.partNumber,
	                    name: 'order_id',
						allowBlank: false,
						anchor: '100%',
						store: OrdersStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.executor,
	                    name: 'assignee',
						allowBlank: false,
						anchor: '100%',
						store: UsersStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
						xtype:'datefield',
						format: 'Y-m-d H:i',
						altFormats: 'Y-m-d H:i',
						editable: false,
						fieldLabel:lan.dateStart,
						name: 'start_date',
						allowBlank: false,
						anchor:'100%',
						value:new Date()
					},
					{
						xtype:'datefield',
						format: 'Y-m-d H:i',
						altFormats: 'Y-m-d H:i',
						editable: false,
						fieldLabel:lan.dateFinish,
						name: 'finish_date',
						allowBlank: true,
						anchor:'100%'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.status,
	                    name: 'status',
						allowBlank: false,
						anchor: '100%',
						store: TaskStatusStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.manager,
	                    name: 'assigned_by',
						allowBlank: false,
						anchor: '100%',
						store: UsersStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.type,
	                    name: 'task_type',
						allowBlank: false,
						anchor: '100%',
						store: TaskTypeStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
						xtype:'textareafield',
						grow:true,
						name: 'comment',
						fieldLabel: lan.Comments,
						anchor:'100%'
					}
				],
				buttons:[
				{ 
                    text:lan.save,
					iconCls:'save',
					handler: function() {			
						
						var form = Ext.getCmp('form_orderTasks').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Order_tasks.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_orderTasks.destroy();
									orderTasks_store.load();
								},
								failure: function(fp, o) {
									Ext.MessageBox.alert(lan.fail, o.result.message);
								}
							});
						}
					}
                },
				{ 
                    text:lan.cancel,
					iconCls: 'cancel',
                    handler:function(){
                        WindowForm_orderTasks.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_orderTasks.show();
	
	
	var form = Ext.getCmp("form_orderTasks").getForm();
	if(idrow){
		//console.log(select.get('role'));
		form.findField("order_id").setValue( select.get('order_id') );
		form.findField("assignee").setValue( select.get('assignee') );
		form.findField("start_date").setRawValue( select.get('start_date') );
		form.findField("finish_date").setValue( select.get('finish_date') );
		form.findField("status").setValue( select.get('status') );
		form.findField("assigned_by").setValue( select.get('assigned_by') );
		form.findField("task_type").setValue( select.get('task_type') );
		form.findField("comment").setValue( select.get('comment') );
	}
	
	
}

