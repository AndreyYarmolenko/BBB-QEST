Ext.define('family_model', {
    extend: 'Ext.data.Model',
    fields: ['id','name','comment']
});

var family_store = new Ext.data.Store({
    pageSize: 50,
    model: 'family_model',
    proxy: 
    {
      type: 'ajax',
      url: 'scripts/family_type.php?familyShow=true',
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

function isValidAttributes(arr){
    var isValid = true;
    for(var i = 0; i<arr.length; i++){
        var count = 0;
        for(var j=0; j<arr.length; j++){
            if(arr[i]['attr_name']==arr[j]['attr_name']){
                count++;
            }
        }
        if(count>1){
            Ext.MessageBox.alert(lan.error, lan.family_contain+arr[i]['attr_name']);
            isValid = false;
        }
        else {
            count =0;
        }
    }
    return isValid;
}

function moveSelectedRow(grid, direction) {
	var select = grid.getView().getSelectionModel().getSelection()[0];
    if (select) {
		var index = grid.getStore().indexOf(select);
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
		} else {
			index++;
			if (index >= grid.getStore().getCount()) {
				return;
			}
		}

		grid.getStore().remove(select);
		grid.getStore().insert(index, select);
		grid.getSelectionModel().select(index, true);
		grid.getView().refresh();
    } else {
        Ext.MessageBox.alert(lan.error, lan.select_row);
    }
}


function show_family(rights){
	family_store.load();

	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    var PagingToolbar_family = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: family_store,
        displayInfo: true
    });
    	     	
var grid_family = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
        layout: 'fit',
        columnLines: true,
        border: false,
        frame: false,
        id: 'grid_family_id',
        autoScroll: true,
        store: family_store,
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
                	var inData = {action: 'add', disable_edit: false};
					showFamilyPanel(inData);
				}
			},'-',
			{
                text: lan.edit,
                iconCls: 'edit',
                disabled: disable_edit, //rights rule
                handler: function(){
            		var select = Ext.getCmp('grid_family_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                    	var inData = {family_id:select.get('id'), action: 'edit', disable_edit: disable_edit};
                    	showFamilyPanel(inData);
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
					var select = Ext.getCmp('grid_family_id').getView().getSelectionModel().getSelection()[0];
                    if (select) {
                        Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                            if (btn == 'yes') {
                                Ext.Ajax.request({
                                    url: 'scripts/family_type.php',
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
												Ext.getCmp('grid_family_id').store.load();
												Ext.getCmp('grid_family_id').getView().refresh();
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
				xtype: 'textfield',
				name: 'search',
				emptyText: lan.search_placeholder,
				labelWidth: style.input2.labelWidth,
				width: '48%',
				listeners: {
					change: function() {
						family_store.load({
							params: {filter: this.value}
						});
						family_store.getProxy().url = 'scripts/family_type.php?familyShow=true&filter=' + this.value;
						family_store.load();
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
	        width:200,
            dataIndex: 'family_name', 
            sortable: true
		},
		{
            text: lan.Comments, 
            dataIndex: 'family_description', 
            sortable: true,
            flex: 1
		}
    ], 
    bbar:[PagingToolbar_family],
    listeners: {
    	itemdblclick: function(cmp, records) {
    		var inData = {family_id:records.get('id'), action: 'edit', disable_edit: disable_edit};
            showFamilyPanel(inData);
    	}
    }
});
	return grid_family;
}

var getComboPhAttrName = function(cell_record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype:'combobox',
            queryMode: 'remote',
            allowBlank: false,
            typeAhead: true,
            minChars:2,
            triggerAction: 'all',
            lazyRender: true,
            enableKeyEvents: true,
            store: storePhAttrName,
            displayField: 'attr_name',
            valueField: 'attr_name',
            autoSelect: false,
            listeners: {
                beforeselect:function(combo, record, index, eOpts) {
                   var isExist = false;
                   Ext.getCmp('grid_physical_attributes').getStore().each(function(rec){
                        if(rec.get('attr_name')==record.get('attr_name')){
                            isExist = true;
                        }
                   });
                   if(isExist){
                        Ext.MessageBox.alert(lan.error, lan.param_already);
                        return false;
                   }          
                },
                select: function(combo, record, index, eOpts) {
                    cell_record.set('data_type', record.get('data_type'));
                    cell_record.set('comment', record.get('comment'));
                }
            }
        }
    });
}

var getComboCoreAttrName = function(cell_record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype:'combobox',
            queryMode: 'remote',
            allowBlank: false,
            typeAhead: true,
            minChars:2,
            triggerAction: 'all',
            lazyRender: true,
            enableKeyEvents: true,
            store: storeCoreAttrName,
            displayField: 'attr_name',
            valueField: 'attr_name',
            autoSelect: false,
            listeners: {
                beforeselect:function(combo, record, index, eOpts) {
                   var isExist = false;
                   Ext.getCmp('grid_core_attributes').getStore().each(function(rec){
                        if(rec.get('attr_name')==record.get('attr_name')){
                            isExist = true;
                        }
                   });
                   if(isExist){
                        Ext.MessageBox.alert(lan.error, lan.param_already);
                        return false;
                   }          
                },
                select: function(combo, record, index, eOpts) {
                    cell_record.set('data_type', record.get('data_type'));
                    cell_record.set('comment', record.get('comment'));
                }
            }
        }
    });
}

function getComboDataType(){
	var time_id = Date.parse(new Date());
    var rand1 = Math.floor((Math.random()*1000000) + 1);
    time_id = time_id-rand1;
    var data_type = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            id: 'data_type'+time_id,
            lazyRender:true,
            store: storeFieldTypes,
            displayField: 'value',
            valueField: 'id',
            value :1,
            editable:false,
        });
    return data_type;
}

function getComboDataTypePh(){
	var time_id = Date.parse(new Date());
    var rand1 = Math.floor((Math.random()*1000000) + 1);
    time_id = time_id-rand1;
    var data_type = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            id: 'data_type'+time_id,
            lazyRender:true,
            store: storeFieldTypesPh,
            displayField: 'value',
            valueField: 'id',
            value :1,
            editable:false,
        });
    return data_type;
}

function showFamilyPanel(inData){
	//var inData = {family_id:"family_id", action: 'action', disable_edit: "disable_edit"};
	var family_id = null;
	var action = "view";
	var disable_edit = true;

	if(inData){
	    if(inData.family_id) family_id = inData.family_id;
	    if(inData.action) action = inData.action;
	    if(inData.disable_edit) disable_edit = true;
	    	else disable_edit = false;
	}
	

	var core_attributes_store = new Ext.data.Store({
	    fields: ['basic', 'attr_id', 'attr_name', 'comment', {name:'data_type', type:'int'}, 'dynamic_id', {name:'deleted', type:'int'}],
	    data: [ {'basic': '', 'attr_name': 'Box Label', 'data_type': 1, 'dynamic_id': 'box_label'},
	    		{'basic': '', 'attr_name': 'Part Label/Tag#', 'data_type': 1, 'dynamic_id': 'part_label'}]
	});

	var physical_attributes_store = new Ext.data.Store({
	    fields: ['basic', 'attr_id', 'attr_name', 'comment', {name:'data_type', type:'int'}, 'dynamic_id', {name:'deleted', type:'int'}],
	    data: [ {'basic': '', 'attr_name': 'BBB Number', 'data_type': 2, 'dynamic_id': 'bbb_number'},
	    		{'basic': '', 'attr_name': 'Status', 'data_type': 2, 'dynamic_id': 'phys_status'}]
	});

	storeFieldTypes.load();
	storeFieldTypesPh.load();
	storeCoreAttrName.load();
	storePhAttrName.load();

	var comboPhAttrName = getComboPhAttrName();
	//var comboCoreAttrName = getComboCoreAttrName();
	var comboDataTypePh = getComboDataTypePh();
	var comboDataTypeCr = getComboDataType();

	var core_attributes_grid = Ext.create('Ext.grid.Panel',{
		title: lan.core_attr,
		store: core_attributes_store,
		id: 'grid_core_attributes',
		border: true,
		margin: '5 0 5 0',
		plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
            beforeedit: function(e, editor){
                if(editor.record.data.dynamic_id=="part_label"||editor.record.data.dynamic_id=="box_label"){
                    return false;
                }                
            }
            }})],
		tools: [{
                xtype: 'button',
                text: lan.up,
                disabled: false,
                width: 70,
                handler: function() {
                	var grid = this.up('grid');
                	moveSelectedRow(grid, -1);
                }
            },{
                xtype: 'button',
                text: lan.down,
                disabled: false,
                width: 70,
                handler: function() {
                	var grid = this.up('grid');
                	moveSelectedRow(grid, 1);
                }
            }],
		columns : [{
				text:'№',
	        	xtype: 'rownumberer',
	        	width: 40
	        },{
	            text : lan.param_name,
	        	dataIndex : 'attr_name',
	            flex: 1,
	            sortable: false,
                getEditor: getComboCoreAttrName
	        },{   
	            text : lan.data_type,
	        	dataIndex : 'data_type',
	        	editor: comboDataTypeCr,
	            flex: 1,
	            sortable: false,
	            renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboDataTypeCr), this)
	        },{
	            text : lan.Comments,
	        	dataIndex : 'comment',
	        	editor: {xtype: 'textfield'},
	            flex: 1,
	            sortable: false,
	        },{
	        	xtype:'actioncolumn',
	        	width:30,
	        	dataIndex: 'set_hidden',
	        	items:[{
	        		iconCls: 'delete',
                    handler:function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if(rec.get('dynamic_id')!='part_label'&&rec.get('dynamic_id')!='box_label'){
                        if(family_id&&family_id!=""){
                            if(rec.get('deleted')==1){
                                rec.set('deleted', 0);
                            }
                            else {
                                rec.set('deleted', 1);
                            }
                        }
                        else {
                            core_attributes_store.remove(rec);
                        }
                    }
                    }
	        	}]
	        }],
	    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('deleted') ==1)? 'red_bg':''; 
	        } 
	    },
	    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_new_param,
            disabled: disable_edit, //rights rule
            handler: function() {
                core_attributes_store.add({'basic': ''});
                }
            }]
    		}]
		});

var physical_attributes_grid = Ext.create('Ext.grid.Panel',{
		title: lan.phys_attr,
		store: physical_attributes_store,
		id: 'grid_physical_attributes',
		border: true,
		margin: '5 0 5 0',
		plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
            beforeedit: function(e, editor){
                if(editor.record.data.dynamic_id=="bbb_number"||editor.record.data.dynamic_id=="phys_status"){
                    return false;
                }                
            }
            }})],
		tools: [{
                xtype: 'button',
                text: lan.up,
                disabled: false,
                width: 70,
                handler: function() {
                	var grid = this.up('grid');
                	moveSelectedRow(grid, -1);
                }
            },{
                xtype: 'button',
                text: lan.down,
                disabled: false,
                width: 70,
                handler: function() {
                	var grid = this.up('grid');
                	moveSelectedRow(grid, 1);
                }
            }],
		columns : [{
				text:'№',
	        	xtype: 'rownumberer',
	        	width: 40
	        },{   
	            text : lan.param_name,
	        	dataIndex : 'attr_name',
	            flex: 1,
	            sortable: false,
                getEditor: getComboPhAttrName
	        },{   
	            text : lan.data_type,
	        	dataIndex : 'data_type',
	        	editor: comboDataTypePh,
	            flex: 1,
	            sortable: false,
	            renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboDataTypePh), this)
	        },{   
	            text : lan.Comments,
	        	dataIndex : 'comment',
	        	editor: {xtype: 'textfield'},
	            flex: 1,
	            sortable: false,
	        },{
	        	xtype:'actioncolumn',
	        	width:30,
	        	dataIndex: 'set_hidden',
	        	items:[{
	        		iconCls: 'delete',
                    handler:function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if(rec.get('dynamic_id')!='bbb_number'&&rec.get('dynamic_id')!='phys_status'){
                        if(family_id&&family_id!=""){
                        	if(rec.get('deleted')==1){
                        		rec.set('deleted', 0);
                        	}
                        	else {
                        		rec.set('deleted', 1);
                        	}
                        }
                        else {
    	                    physical_attributes_store.remove(rec);
    	                }
	        	      }
                }
                }]
	        }],
	    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('deleted') ==1)? 'red_bg':''; 
	        } 
	    },
	    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_new_param,
            disabled: disable_edit, //rights rule
            handler: function() {
                physical_attributes_store.add({'basic': ''});
                }
            }]
    		}]
		});

	var family_panel = Ext.create('Ext.form.Panel', {
		    bodyPadding: 5,
		    autoScroll: true,
		    buttons:[{
                	xtype: 'button',
		            text: lan.save,
		            handler:function(){
		            	var form = this.up('form');
		            	saveFamilyForm(form, action);
			            }
			         },{
                        xtype: 'splitter'
                    },{
                	xtype: 'button',
		            text: lan.cancel,
		            handler:function(){
		              	this.up('window').destroy();
			            }
			         }],
		    items:[{
                xtype: 'container',
                layout: 'anchor',
                autoScroll: true,
                margin: '0 0 0 10',
                items:[{
                    xtype:'hidden',
                    name: 'family_id'
                },{
                    xtype:'textfield',
                    fieldLabel: lan.family_name,
                    labelAlign: 'top',
                    name: 'family_name',
                    anchor:'100%',
                },{
                    xtype:'textfield',
                    fieldLabel: lan.description,
                    labelAlign: 'top',
                    name: 'family_description',
                    anchor:'100%',
                },core_attributes_grid, physical_attributes_grid
            	]
            }]
        });

inData = {title: lan.family, sizeX: '90%', sizeY: '90%', item: family_panel};
showObject(inData);

if(action=="edit"){
	Ext.Ajax.request({
		url: 'scripts/family_type.php?getFamilyData=true',
		method: 'POST',
		params: {family_id:family_id},
		success: function (response){
			var JSON = response.responseText;
			if(JSON){
				var data = Ext.decode(JSON);
				var fields = family_panel.getForm().getFields();
				fields.each(function(item){
				for (var k in data){
					if(item.getName() == k && data[k]!=null){
						item.setValue(data[k]);
					}
				}
			});
			if(data.core_attr){
				var core_data = Ext.decode(data.core_attr);
				core_attributes_store.loadData(core_data);
			}
			if(data.phys_attr){
				var phys_data = Ext.decode(data.phys_attr);
				physical_attributes_store.loadData(phys_data);
			}
			}
		},
		failure: function (response){ 
			Ext.MessageBox.alert(lan.error, response.responseText);
		}
	});
}
}

function saveFamilyForm(form, action){
	var dim_core_attr = [];
	var dim_phys_attr = [];

	var core_attrJS = null;
	var phys_attrJS = null;
    var isValidCore = true;
    var isValidPhys = true;

	var form = form.getForm();

	var core_attributes_store = Ext.getCmp('grid_core_attributes').getStore();
	var physical_attributes_store = Ext.getCmp('grid_physical_attributes').getStore();

	core_attributes_store.each(function(record){
		if(record.get('attr_name')&&record.get('attr_name')!=""){
			dim_core_attr.push({attr_type:1, attr_id:(record.get('attr_id'))?record.get('attr_id'):null, attr_name:record.get('attr_name'), data_type: record.get('data_type'), comment:(record.get('comment'))?record.get('comment'):null, deleted:(record.get('deleted'))?record.get('deleted'):0, order_col: core_attributes_store.indexOf(record), dynamic_id: (record.get('dynamic_id'))?record.get('dynamic_id'):null});
		}
	});

	physical_attributes_store.each(function(record){
		if(record.get('attr_name')&&record.get('attr_name')!=""){
			dim_phys_attr.push({attr_type:2, attr_id:(record.get('attr_id'))?record.get('attr_id'):null, attr_name:record.get('attr_name'), data_type: record.get('data_type'), comment:(record.get('comment'))?record.get('comment'):null, deleted:(record.get('deleted'))?record.get('deleted'):0, order_col: physical_attributes_store.indexOf(record), dynamic_id: (record.get('dynamic_id'))?record.get('dynamic_id'):null});
		}
	});

    isValidCore = isValidAttributes(dim_core_attr);
    isValidPhys = isValidAttributes(dim_phys_attr);



    if (dim_core_attr.length > 0){
		core_attrJS = JSON.stringify(dim_core_attr);
	}

	if (dim_phys_attr.length > 0){
		phys_attrJS = JSON.stringify(dim_phys_attr);
	}

	var params = {
		'core_attr' : core_attrJS,
		'phys_attr' : phys_attrJS,
		'action': action
	};

	if(form.isValid()&&isValidCore&&isValidPhys){
		form.submit({
			url: 'scripts/family_type.php',
			waitMsg: lan.saving,
			wait: true,
			scope: this,
			method: 'post',
			params: params,
			success: function(form, action) {
				if(action.response.responseText){
					var data = Ext.decode(action.response.responseText);
					Ext.MessageBox.show({
                        title: lan.succ,
                        cls: 'msgbox',
                        msg: data.message,
                        buttons: Ext.MessageBox.YES,
                        width:300,                       
                        closable:false,
                        fn: function(btn) {
                               if (btn == 'yes') {
                               	Ext.WindowMgr.each(function(win){
				              		win.destroy();
				              	});
				              	Ext.getCmp('grid_family_id').getStore().load();
                               }
                           }
                        
                        });
				}
			},
			failure: function(form, action) {
				var data = Ext.decode(action.response.responseText);
				Ext.MessageBox.show({
                        title:/*'Success'*/lan.succ,
                        cls: 'msgbox',
                        msg: data.message,
                        buttons: Ext.MessageBox.YES,
                        width:300,                       
                        closable:false,
                        fn: function(btn) {
                               if (btn == 'yes') {
                               	Ext.WindowMgr.each(function(win){
				              		win.destroy();
				              	});
				              	Ext.getCmp('grid_family_id').getStore().load();
                               }
                           }
                        
                        });
            }
		});
	}
	
}