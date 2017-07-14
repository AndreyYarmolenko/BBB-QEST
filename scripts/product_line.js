Ext.define('prodline_model', {
    extend: 'Ext.data.Model',
    fields: ['id','name','comment']
});

var prodline_store = new Ext.data.Store({
    pageSize: 50,
    model: 'prodline_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/product_line.php?prodlineShow=true',
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


function show_prodline(rights){
	prodline_store.load();
	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    var PagingToolbar_prodline = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: prodline_store,
        displayInfo: true
    });
    	     	
var grid_prodline = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_prodline_id',
        autoScroll: true,
        store: prodline_store,
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
                disabled: disable_add, //rights rule
                handler: function(){
					show_prodline_addedit(null, null, null, "add");
				}
			},'-',
			{
                text: lan.edit,
                iconCls: 'edit',
                disabled: disable_edit, //rights rule
                handler: function(){
            		var select = Ext.getCmp('grid_prodline_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
						show_prodline_addedit(select.get('id'),select, null, "edit");
					} else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
				}
			},'-',
			{
                text: lan.del,
                iconCls: 'delete',
                disabled: disable_delete, //rights rule
                handler: function(){
					var select = Ext.getCmp('grid_prodline_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                //alert(select.get('id'));
                                Ext.Ajax.request({
                                    url: 'scripts/product_line.php',
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
												Ext.getCmp('grid_prodline_id').store.load();
												Ext.getCmp('grid_prodline_id').getView().refresh();
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
						prodline_store.load({
							params: {filter: this.value}
						});
						console.log(prodline_store);
						prodline_store.getProxy().url = 'scripts/product_line.php?prodlineShow=true&filter=' + this.value;
						prodline_store.load();
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
    bbar:[PagingToolbar_prodline],
    listeners: {
    	itemdblclick: function(cmp, records) { 
    		//console.log(records);
    		show_prodline_addedit(records.get('id'),records, disable_edit, "edit");
    	}
    }
});
	
	return grid_prodline;
	
}



var WindowForm_group = null;
function show_prodline_addedit(idrow, select,disable_edit, param){
if(idrow){
	var texttype = lan.edit;
}else{
	var texttype = lan.add;
}


if(!WindowForm_group){
        
		WindowForm_prodline = new Ext.Window({
            width: '80%',
            height: '60%',
            title: texttype+' '+lan.product_line,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_group = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_prodline',
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
	                    name: 'name',
						allowBlank: false,
						anchor: '100%'
					},
					{
						xtype:'textareafield',
						height: 100,
						grow:true,
						name: 'comment',
						fieldLabel: lan.Comments,
						labelAlign: 'top',
						anchor:'100%'
					}
				],
				buttons:[
				{ 
                    text:lan.save,
					iconCls:'save',
					disabled: disable_edit,//rights rule
					handler: function() {			
						
						var form = Ext.getCmp('form_prodline').getForm();
						if(form.isValid()){
						
							form.submit({
								url: 'scripts/product_line.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								params: {'param':param,'idrow':idrow},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_prodline.destroy();
									prodline_store.load();
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
                        WindowForm_prodline.destroy();        
                    }
				}]
			})
			]
		});
}		
		WindowForm_prodline.show();
	
	
	var form = Ext.getCmp("form_prodline").getForm();
	if(disable_edit){//rights rule
		form.getFields().each(function(item){
			item.setConfig('readOnly',true);
		});
	}

	if(idrow){
		form.findField("name").setValue(select.get('name') );
		form.findField("comment").setValue( select.get('comment') );
	}
	
	
}
