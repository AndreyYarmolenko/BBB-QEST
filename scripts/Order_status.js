Ext.define('orderStatus_model', {
    extend: 'Ext.data.Model',
    fields: ['order_status_id','name','comment']
});

var orderStatus_store = new Ext.data.Store({
    pageSize: 50,
    model: 'orderStatus_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/Order_status.php?ordersShow=true',
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


function show_orderStatus(){
	
	orderStatus_store.load();
        
    var PagingToolbar_orderStatus = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: orderStatus_store,
        displayInfo: true
    });
    	     	
var grid_orderStatus = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_orderStatus_id',
        autoScroll: true,
        store: orderStatus_store,
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
					show_orderStatus_addedit();
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                handler: function(){
					var select = Ext.getCmp('grid_orderStatus_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention,  lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/Order_status.php',
                                    method: 'POST',
									params: { 'delete':true, "id": select.get('order_status_id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('grid_orderStatus_id').store.load();
												Ext.getCmp('grid_orderStatus_id').getView().refresh();
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
            		var select = Ext.getCmp('grid_orderStatus_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_orderStatus_addedit(select.get('order_status_id'),select);
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
						orderStatus_store.load({
							params: {filter: this.value}
						});
						orderStatus_store.getProxy().url = 'scripts/Order_status.php?ordersShow=true&filter=' + this.value;
						orderStatus_store.load();
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
            text: lan.Comments, 
	        //text: request_toir.name, 
            dataIndex: 'comment', 
            sortable: true,
            flex: 1
		}
    ],
    bbar:[PagingToolbar_orderStatus],
    listeners: {
    	itemdblclick: function(cmp, records) { 
    		var select = Ext.getCmp('grid_orderStatus_id').getView().getSelectionModel().getSelection()[0];   		
    		show_orderStatus_addedit(select.get('order_status_id'),records);
    	}
    }
});
	
	return grid_orderStatus;
	
}



var WindowForm_orderStatus = null;
function show_orderStatus_addedit(idrow,select){

if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_orderStatus){
        
		WindowForm_orderStatus = new Ext.Window({
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
                    WindowForm_orderStatus = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_orderStatus',
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
						
						var form = Ext.getCmp('form_orderStatus').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/Order_status.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_orderStatus.destroy();
									orderStatus_store.load();
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
                        WindowForm_orderStatus.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_orderStatus.show();
	
	
	var form = Ext.getCmp("form_orderStatus").getForm();
	if(idrow){
		//console.log(select.get('role'));
		form.findField("name").setValue( select.get('name') );
		form.findField("comment").setValue( select.get('comment') );
	}
	
	
}

