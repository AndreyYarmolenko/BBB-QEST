Ext.define('taskStatus_model', {
    extend: 'Ext.data.Model',
    fields: ['task_status_id','name','comment', 'short_name']
});

var taskStatus_store = new Ext.data.Store({
    pageSize: 50,
    model: 'taskStatus_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Task_status.php?tasksShow=true',
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
            property: 'name',
            direction: 'ASC'
	    }
    ]
});


function show_taskStatus(){
	
	taskStatus_store.load();
        
    var PagingToolbar_taskStatus = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: taskStatus_store,
        displayInfo: true
    });
    	     	
var grid_taskStatus = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_taskStatus_id',
        autoScroll: true,
        store: taskStatus_store,
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
					show_taskStatus_addedit();
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                handler: function(){
					var select = Ext.getCmp('grid_taskStatus_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Task_status.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('task_status_id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_taskStatus_id').store.load();
												Ext.getCmp('grid_taskStatus_id').getView().refresh();
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
            		var select = Ext.getCmp('grid_taskStatus_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_taskStatus_addedit(select.get('task_status_id'),select);
					} else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
				}
			},
			{
				xtype: 'textfield',
				name: 'search',
				emptyText: lan.search,
				labelWidth: style.input2.labelWidth,
				width: '48%',
				listeners: {
					change: function() {
						taskStatus_store.load({
							params: {filter: this.value}
						});
						taskStatus_store.getProxy().url = 'scripts/Task_status.php?tasksShow=true&filter=' + this.value;
						taskStatus_store.load();
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
            text: lan.clientName, 
	        //text: request_toir.name, 
            dataIndex: 'name', 
            sortable: true
		},
		{
            text: lan.shortName, 
	        //text: request_toir.name, 
            dataIndex: 'short_name', 
            sortable: true
		},
		{
            text: lan.Comments, 
	        //text: request_toir.name, 
            dataIndex: 'comment', 
            sortable: true,
            flex: 1
		}
    ],
    bbar:[PagingToolbar_taskStatus],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_taskStatus_addedit(records.get('task_status_id'),records);
    	}
    }
});
	
	return grid_taskStatus;
	
}



var WindowForm_taskStatus = null;
function show_taskStatus_addedit(idrow,select){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_taskStatus){
        
		WindowForm_taskStatus = new Ext.Window({
            width: '80%',
            height: '60%',
            title: texttype+' '+lan.status,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_taskStatus = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_taskStatus',
				//frame: true,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.clientName,
	                    name: 'name',
						allowBlank: false,
						anchor: '96%'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.shortName,
	                    name: 'short_name',
						anchor: '96%'
					},
					{
						xtype:'textareafield',
						grow:true,
						name: 'comment',
						fieldLabel: lan.Comments,
						anchor:'96%'
					}
				],
				buttons:[
				{ 
                    text:lan.save,
					iconCls:'save',
					handler: function() {			
						
						var form = Ext.getCmp('form_taskStatus').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Task_status.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_taskStatus.destroy();
									taskStatus_store.load();
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
                        WindowForm_taskStatus.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_taskStatus.show();
	
	
	var form = Ext.getCmp("form_taskStatus").getForm();
	if(idrow){
		//console.log(select.get('role'));
		form.findField("name").setValue( select.get('name') );
		form.findField("comment").setValue( select.get('comment') );
		form.findField("short_name").setValue( select.get('short_name') );
	}
	
	
}

