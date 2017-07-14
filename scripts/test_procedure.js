Ext.apply(Ext.data.SortTypes, {
    asLower: function (str) {
        return str.toLowerCase();
    }
});
var storeTestProcedure = new Ext.data.Store({
    pageSize: 50,
    fields: ['id', {type: 'string', name: 'test_procedure', sortType: 'asLower'}, {type: 'string', name: 'spec_conditions', sortType: 'asLower'}, {type: 'string', name: 'description', sortType: 'asLower'}, 'instruction'],
    proxy: 
    {
      type: 'ajax',
      //url: 'scripts/datastore.php?func=test_procedure',
      url: 'scripts/test_procedure.php?getTestProcedures=true',
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
            property: 'test_procedure',
	    }
    ]
});

function getTestProcedureGrid(time_id, rights){
	storeTestProcedure.load();
	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

var actionLink2 = getActionLink('instruction', "doc");

var PagingToolbar_test_procedure = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: storeTestProcedure,
        displayInfo: true
    });
    	     	
var grid_test_procedure = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
        layout: 'fit', 
        columnLines: true,
        border: false,
        frame: false,
        autoScroll: true,
        id: 'test_procedure_grid'+time_id,
        store: storeTestProcedure,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },
        dockedItems: 
        [{
            xtype: 'toolbar',
            items: [
            {
                text: lan.add,
                iconCls: 'add',
                disabled: disable_add, //rights rule
                handler: function(){
                	var inData = {id:time_id, action: 'add', edit: disable_edit};
					showTestProcedure(inData);
				}
			},'-',
			{
                text: lan.edit,
                iconCls: 'edit',
                disabled: disable_edit, //rights rule
                handler: function(){
            		var select = Ext.getCmp('test_procedure_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                    if (select) {
						var inData = {id:time_id, action: 'edit', edit: disable_edit, el_id: select.get('id')};
						showTestProcedure(inData);
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
					var select = Ext.getCmp('test_procedure_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                               Ext.Ajax.request({
                                    url: 'scripts/test_procedure.php?deleteProcedure=true',
                                    method: 'POST',
									params: {el_id: select.get('id')},
                                    success: function(response) {
                                        var JSON = response.responseText;
										if (JSON) {
										try{
										var decoded = Ext.decode(JSON);
											if(decoded.success == false){
												Ext.MessageBox.alert(lan.error, decoded.message);
											}else{
												Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
												Ext.getCmp('test_procedure_grid'+time_id).store.load();
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
						storeTestProcedure.load({
							params: {filter: this.value}
						});
						storeTestProcedure.getProxy().url = 'scripts/test_procedure.php?getTestProcedures=true&filter=' + this.value;
						storeTestProcedure.load();
					}
				}
			}
		]
	}],
    columns:[
    	{xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
    	{text: lan.procedure, dataIndex: 'test_procedure', sortable: true, hideable: true, width: 150},
    	{text: lan.spec_conditions, dataIndex: 'spec_conditions', sortable: true,  width: 150},
    	{text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
    	{text: lan.instruct, xtype:'actioncolumn', sortable: false, dataIndex: 'instruction', width: 200, items:[actionLink2]}
	], 
    bbar:[PagingToolbar_test_procedure],
    listeners: {
    	itemdblclick: function(cmp, record) { 
    		var inData = {id:time_id, action: 'edit', edit: disable_edit, el_id: record.get('id')};
			showTestProcedure(inData);
    	}
    }
});
	return grid_test_procedure;
}


function showTestProcedure(inData){
//inData = {id:'id', action: 'action', el_id: 'el_id', edit: 'edit'};
var id = 'form_test';
var action = 'view';
var el_id;
var disable_edit = false;

if(inData){
	if(inData.id) id = id+inData.id;
	if(inData.action) action = inData.action;
	if(inData.el_id) el_id = inData.el_id;
	if(inData.edit) disable_edit = inData.edit;
}

var storeFilesTestProcedure = new Ext.data.Store({     
        fields: ['name', 'document']
    });

var action_text = lan[action] + ' Test Procedure';
var InstructionItem = getUploadItem('instruction_'+id, 'instruction', lan.instruct, disable_edit, storeFilesTestProcedure);

var test_form = new Ext.create('Ext.form.Panel', {
				autoScroll: true,
				bodyPadding: '2 2 2 2',
				border: false,
				id: id,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[{
	                    xtype:'hidden',
	                    name:'el_id',
	                },
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.name,
	                    labelAlign: 'top',
	                    name: 'test_procedure',
						allowBlank: false,
						anchor: '96%',
					},
					{
						xtype:'textareafield',
						height: 100,
						name: 'description',
						fieldLabel: lan.description,
						labelAlign: 'top',
						anchor:'96%',
					},
					{
						xtype:'textareafield',
						height: 100,
						name: 'spec_conditions',
						fieldLabel: lan.spec_conditions,
						labelAlign: 'top',
						anchor:'96%',
						margin: '0 0 15 0',
					},
					{
						xtype: 'container',
						anchor:'96%',
						items: InstructionItem
					}
				],
				buttons:[{ 
                    text:lan.save,
					iconCls:'save',
					disabled: disable_edit,//rights rule
					handler: function() {
						var form = this.up('form').getForm();
						if(form.isValid()){
							var instruction = Ext.getCmp('instruction_'+id).getValue();
							form.submit({
								url: 'scripts/test_procedure.php?'+action+'Procedure=true',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								params: {instruction: instruction},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									var windowObject = this.up('window');
                    				windowObject.destroy(); 
									storeTestProcedure.load();
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
                    	var windowObject = this.up('window');
                    	windowObject.destroy();  
                    }
				}]
			});
if(el_id){
	Ext.Ajax.request({
        url: 'scripts/test_procedure.php?getProcedureById=true',
        method: 'POST',
        params: {el_id: el_id},
        success: function (response){
            if(response) {
                var data = Ext.decode(response.responseText);
                if(data){
                var fields = test_form.getForm().getFields();
                	fields.each(function(item){
					for (var key in data){
						if(item.getName() == key && data[key]!=null){
							item.setValue(data[key]);
						}
					}
				});
                }
           }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

if(disable_edit){//rights rule
		test_form.getForm().getFields().each(function(item){
			item.setConfig('readOnly',true);
		});
	}

showObject({title: action_text, sizeY: '50%', item: test_form});
}
