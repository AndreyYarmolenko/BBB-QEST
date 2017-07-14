Ext.define('Clients_model', {
    extend: 'Ext.data.Model',
    fields: ['client_id','name','ext_client_id']
});

var clients_store = new Ext.data.Store({
    pageSize: 50,
    model: 'Clients_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Clients.php?clientsShow=true',
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


function show_clients(){
	
	clients_store.load();
        
    var PagingToolbar_clients = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: clients_store,
        displayInfo: true
    });
    	     	
var grid_clients = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_clients_id',
        autoScroll: true,
        store: clients_store,
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
					show_clients_addedit();
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                handler: function(){
					var select = Ext.getCmp('grid_clients_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Clients.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('client_id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_clients_id').store.load();
												Ext.getCmp('grid_clients_id').getView().refresh();
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
            		var select = Ext.getCmp('grid_clients_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_clients_addedit(select.get('client_id'),select);
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
						clients_store.load({
							params: {filter: this.value}
						});
						clients_store.getProxy().url = 'scripts/Clients.php?clientsShow=true&filter=' + this.value;
						clients_store.load();
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
	        width:300,
            dataIndex: 'name', 
            sortable: true
		},
		{
            text: lan.erp, 
	        //text: request_toir.name, 
            dataIndex: 'ext_client_id', 
            sortable: true,
            flex: 1
		}
    ], 
    bbar:[PagingToolbar_clients],
    listeners: {
    	itemdblclick: function(cmp, records) {   
    		var select = Ext.getCmp('grid_clients_id').getView().getSelectionModel().getSelection()[0]; 		
    		show_clients_addedit(select.get('client_id'),records);
    	}
    }
});
	
	return grid_clients;
	
}



var WindowForm_clients = null;
function show_clients_addedit(idrow,select){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_clients){
        
		WindowForm_clients = new Ext.Window({
            width: '80%',
            height: '60%',
            title: texttype+' '+lan.type,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_clients = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_clients',
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
						anchor: '100%'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.erp,
	                    name: 'ext_client_id',
						allowBlank: true,
						anchor: '100%'
					}
				],
				buttons:[
				{ 
                    text:lan.save,
					iconCls:'save',
					handler: function() {			
						
						var form = Ext.getCmp('form_clients').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Clients.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_clients.destroy();
									clients_store.load();
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
                        WindowForm_clients.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_clients.show();
	
	
	var form = Ext.getCmp("form_clients").getForm();
	if(idrow){
		//console.log(select.get('role'));
		form.findField("name").setValue( select.get('name') );
		form.findField("ext_client_id").setValue( select.get('ext_client_id') );
	}
	
	
}

