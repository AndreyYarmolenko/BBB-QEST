Ext.define('order_model', {
    extend: 'Ext.data.Model',
    fields: ['order_id','ext_order_id','client_id','client_name','part_num','creation_date','created_by','user_name','order_status_id','order_status_name','comment']
});

var order_store = new Ext.data.Store({
    pageSize: 50,
    model: 'order_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Order.php?ordersShow=true',
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
            property: 'order_id',
            direction: 'ASC'
	    }
    ]
});

Ext.define('ClientsModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var ClientsStore = new Ext.data.Store({
    model: 'ClientsModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order.php?func=showClients',
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

Ext.define('OrderStatusModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var OrderStatusStore = new Ext.data.Store({
    model: 'OrderStatusModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Order.php?func=showOrderStatus',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});



function show_order(){
	
	order_store.load();
        
    var PagingToolbar_order = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: order_store,
        displayInfo: true
    });
    	     	
var grid_order = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_order_id',
        autoScroll: true,
        store: order_store,
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
					show_order_addedit();
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                handler: function(){
					var select = Ext.getCmp('grid_order_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention,  lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Order.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('order_id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_order_id').store.load();
												Ext.getCmp('grid_order_id').getView().refresh();
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
            		var select = Ext.getCmp('grid_order_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_order_addedit(select.get('order_id'),select);
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
            text: lan.erp, 
	        //text: request_toir.name, 
            dataIndex: 'ext_order_id', 
            sortable: true
		},
		{
            text: lan.client_name, 
	        //text: request_toir.name, 
            dataIndex: 'client_name', 
            sortable: true
		},
		{
            text: lan.partNumber, 
	        //text: request_toir.name, 
            dataIndex: 'part_num', 
            sortable: true
		},
		{
            text: lan.dateCreation, 
	        //text: request_toir.name, 
            dataIndex: 'creation_date', 
            sortable: true
		},
		{
            text: lan.user, 
	        //text: request_toir.name, 
            dataIndex: 'user_name', 
            sortable: true
		},
		{
            text: lan.status, 
	        //text: request_toir.name, 
            dataIndex: 'order_status_name', 
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
    bbar:[PagingToolbar_order],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_order_addedit(select.get('order_id'),records);
    	}
    }
});
	
	return grid_order;
	
}



var WindowForm_order = null;
function show_order_addedit(idrow,select){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_order){
        
		WindowForm_order = new Ext.Window({
            width: 350,
            height: 290,
            title: texttype+' '+lan.type,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_order = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_order',
				frame: true,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.erp,
	                    name: 'ext_order_id',
						allowBlank: false,
						anchor: '100%'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.client_name,
	                    name: 'client_name',
						allowBlank: false,
						anchor: '100%',
						store: ClientsStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.partNumber,
	                    name: 'part_num',
						allowBlank: false,
						anchor: '100%'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.user,
	                    name: 'user_name',
						allowBlank: false,
						anchor: '100%',
						store: UsersStore,
						displayField: 'name',
	                    valueField: 'id'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.status,
	                    name: 'order_status_name',
						allowBlank: false,
						anchor: '100%',
						store: OrderStatusStore,
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
						
						var form = Ext.getCmp('form_order').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Order.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_order.destroy();
									order_store.load();
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
                        WindowForm_order.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_order.show();
	
	
	var form = Ext.getCmp("form_order").getForm();
	if(idrow){
		//console.log(select.get('role'));
		form.findField("ext_order_id").setValue( select.get('ext_order_id') );
		form.findField("client_name").setValue( select.get('client_id') );
		form.findField("part_num").setValue( select.get('part_num') );
		form.findField("user_name").setValue( select.get('created_by') );
		form.findField("order_status_name").setValue( select.get('order_status_id') );
		form.findField("comment").setValue( select.get('comment') );
	}
	
	
}

