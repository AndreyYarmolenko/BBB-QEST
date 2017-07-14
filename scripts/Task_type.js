Ext.define('taskType_model', {
    extend: 'Ext.data.Model',
    fields: ['id','tasks_type','comment', 'short_name', 'script']
});

var taskType_store = new Ext.data.Store({
    pageSize: 50,
    model: 'taskType_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Task_type.php?typesShow=true',
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


function show_taskType(rights){
	taskType_store.load();

	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }
        
    var PagingToolbar_taskType = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: taskType_store,
        displayInfo: true
    });
    	     	
var grid_taskType = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_taskType_id',
        autoScroll: true,
        store: taskType_store,
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
                disabled: disable_add, //rights rule
                iconCls: 'add',
                handler: function(){
					show_taskType_addedit();
				}
			},'-',
			{
                text: lan.edit,
                disabled: disable_edit, //rights rule
                iconCls: 'edit',
                handler: function(){
            		var select = Ext.getCmp('grid_taskType_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_taskType_addedit(select.get('id'),select);
					} else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
				}
			},'-',
			{
                text: lan.del,
                disabled: disable_delete, //rights rule
                iconCls: 'delete',
                handler: function(){
					var select = Ext.getCmp('grid_taskType_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Task_type.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_taskType_id').store.load();
												Ext.getCmp('grid_taskType_id').getView().refresh();
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
			},
			{
				xtype: 'textfield',
				name: 'search',
				emptyText: lan.search,
				labelWidth: style.input2.labelWidth,
				width: '48%',
				listeners: {
					change: function() {
						taskType_store.load({
							params: {filter: this.value}
						});
						taskType_store.getProxy().url = 'scripts/Task_type.php?typesShow=true&filter=' + this.value;
						taskType_store.load();
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
	        width:200,
            dataIndex: 'tasks_type', 
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
		},
		{
            text: lan.scriptTitle,
            dataIndex: 'script',
            sortable: true,
            flex: 1
		}
    ], 
    bbar:[PagingToolbar_taskType],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_taskType_addedit(records.get('id'),records, disable_edit);
    	}
    }
});
	
	return grid_taskType;
	
}



var WindowForm_taskType = null;
function show_taskType_addedit(idrow,select, disable_edit){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_taskType){
        
		WindowForm_taskType = new Ext.Window({
            //width: 300,
            height: '60%',
            width: '80%',
            title: texttype+' '+lan.taskType,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_taskType = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_taskType',
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
						labelAlign: 'top',
	                    name: 'tasks_type',
						allowBlank: false,
						anchor: '98%'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.shortName,
						labelAlign: 'top',
	                    name: 'short_name',
						anchor: '98%'
					},
					{
						xtype:'textareafield',
						grow:true,
						name: 'comment',
						fieldLabel: lan.Comments,
						labelAlign: 'top',
						anchor:'98%'
					},
					{
						xtype:'textareafield',
						grow:true,
						name: 'script',
						fieldLabel: lan.scriptTitle,
						labelAlign: 'top',
						anchor:'98%'
					}
				],
				buttons:[
				{ 
                    text:lan.save,
                    disabled: disable_edit,//rights rule
					iconCls:'save',
					handler: function() {			
						
						var form = Ext.getCmp('form_taskType').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Task_type.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_taskType.destroy();
									taskType_store.load();
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
                        WindowForm_taskType.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_taskType.show();
	
	
	var form = Ext.getCmp("form_taskType").getForm();

	if(disable_edit){//rights rule
		form.getFields().each(function(item){
			item.setConfig('readOnly',true);
		});
	}
	
	if(idrow){
		//console.log(select.get('role'));
		form.findField("tasks_type").setValue( select.get('tasks_type') );
		form.findField("comment").setValue( select.get('comment') );
		form.findField("script").setValue( select.get('script') );
		form.findField("short_name").setValue( select.get('short_name') );
	}
	
	
}

