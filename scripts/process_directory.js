function addProcessGrid(inData) {
	var disable_add = true,
        disable_edit = true,
        disable_delete = true,
        hide_add = false,
        hide_edit = false,
        hide_delete = false,
        hide_use = true,
        case_type  = 'process_dir',
        rights = all_rights['processes_dir'];
    
    
    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.rights) rights = inData.rights;
        if(inData.case_type) case_type = inData.case_type;
    }
    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    var store_process_grid = new Ext.data.Store({
        fields: ['bbb_sku', 'bbb_sku_id', 'create_date', 'count', 'process_id', 'cell_number', 'description', 'revision'],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/process_directory.php?getAllProcesses=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: store_process_grid,
        displayInfo: true
    });

    var UpperToolbar = Ext.create('Ext.toolbar.Toolbar', {
            width: '96%',
            items: [{
                        text: lan.add,
                        iconCls: 'add',
                        width: 110,
                        disabled: disable_add,//rights rule
                        hidden: hide_add,
                        handler: function() {
                            var process_form = getProcessForm({time_id:time_id, case_type: case_type, action: 'add'});
                            showObject({id:time_id, title: 'Create New Process', item: process_form, sizeX: '90%', sizeY: '90%'});
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        width: 110,
                        disabled: disable_edit,//rights rule
                        hidden: hide_edit,
                        handler: function() {
                        	var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                        	if (select) {
                        		var process_form = getProcessForm({time_id:time_id, process_id: select.get('process_id'), case_type: case_type, action: 'edit'});
                            	showObject({id:time_id, title: 'Create New Process', item: process_form, sizeX: '90%', sizeY: '90%'});
                        	}
                        	else {
                        		Ext.MessageBox.alert(lan.error, lan.select_row);
                        	}
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        width: 110,
                        disabled: disable_delete,//rights rule
                        hidden: hide_delete,
                        handler: function() {
                           var process_grid = this.up('grid');
                           var select = process_grid.getView().getSelectionModel().getSelection()[0];
                            Ext.Ajax.request({
                                url: 'scripts/process_directory.php?deleteProcess=true',
                                method: 'POST',
                                params: {
                                    process_id: select.get('process_id')
                                },
                                success: function(response) {
                                    var JSON = response.responseText;
                                    if (JSON) {
                                        var data = Ext.decode(JSON);
                                        Ext.MessageBox.alert(lan.skill, data.message);
                                        process_grid.getStore().load();
                                    }
                                },
                                failure: function(response) {
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                    },{
                        text: lan.add_to_table,
                        iconCls: 'use',
                        width: 110,
                        hidden: hide_use,
                        handler: function() {
                            var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var new_time_id = time_id+1000000;
                                Ext.getCmp('process_box_'+new_time_id).removeAll();
                                var process_form = getProcessForm({time_id:new_time_id, process_id: select.get('process_id'), case_type: case_type, action: 'edit'});
                                Ext.getCmp('process_box_'+new_time_id).add(process_form);
                                closeWindows(1);
                            }
                            else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },{
                    xtype: 'textfield',
                    name: lan.search,
                    emptyText: lan.search,
                    labelWidth: style.input2.labelWidth,
                    flex: 1,
                    minWidth: 200,
                    margin: '0 10px',
                    listeners: {
                        change: function() {
                           var store = Ext.getCmp('processes_grid'+time_id).getStore();
                                store.getProxy().url = 'scripts/process_directory.php?getAllProcesses=true&search=' + this.value;
                                store.load();
                            }
                        }
                    }]
        });

	var processes_grid = Ext.create('Ext.grid.Panel', {
        store: store_process_grid,
        minHeight: 500,
        width: '100%',
        id: 'processes_grid'+time_id,
        margin: '5 10',
        border: false,
        columns: [
            {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
	        {hidden: true, dataIndex: 'process_id'},
	        {text: 'Cell Number', dataIndex: 'cell_number', sortable: true, hideable: false, width: 120},
	        {text: 'Description', dataIndex: 'description', sortable: true, hideable: false, minWidth: 200, flex:1},
	        {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: false, width: 170},
	        {text: lan.create_date, dataIndex: 'create_date', sortable: true, hideable: false, width: 170},
	        {text: 'Last Mod.', dataIndex: 'last_mod', sortable: true, hideable: false, width: 170},
	        {text: 'Revision', dataIndex: 'revision', sortable: true, hideable: false, width: 100},
	        {text: lan.number_of_operations, dataIndex: 'count', sortable: true, hideable: true, width: 130}
        ],
        bbar: [PagingToolbar],
        dockedItems: UpperToolbar,
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
               if (record) {
                    var action = 'edit';
                    var process_form = getProcessForm({time_id:time_id, process_id: record.get('process_id'), case_type: case_type, action: action});
                    showObject({id:time_id, title: 'View/Edit Process', item: process_form, sizeX: '90%', sizeY: '90%'});
                }
            }
        }
    });


return processes_grid;
}


function getProcessForm(inData){
	var time_id = Date.parse(new Date());
	var action = 'view';
	var process_id = null;
    var case_type = 'process_dir';
    var save_btn = false;
    var use_btn = true;
    var cancel_btn = false;
    store_bbb_sku.load();
    
	if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.action) action = inData.action;
        if(inData.process_id) process_id = inData.process_id;
        if(inData.case_type) case_type = inData.case_type;
    }

    if(case_type=='draft'){
        save_btn = true;
        use_btn = false;
    }

    if(case_type=='task_ecr'){
        if(action=='edit'){
            save_btn = true;
            cancel_btn = true;
            use_btn = true;
        }
        else {
            save_btn = true;
            cancel_btn = false;
            use_btn = false;
        }
        
    }

    var operations_grid = getProcessOperationsGrid({time_id:time_id, process_id:process_id, case_type: case_type, action: action});

    var process_form = new Ext.create('Ext.form.Panel',{
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            autoScroll: true,
            items: [{
                    xtype: 'container',
                    layout: 'anchor',
                    items:[{
                        xtype:'combobox',
                        fieldLabel: lan.bbb_sku,
                        labelAlign: 'top',
                        name: 'bbb_sku_id',
                        queryMode: 'remote',
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        allowBlank: false,
                        labelWidth: style.input2.labelWidth,
                        store: store_bbb_sku,
                        displayField: 'value',
                        valueField: 'id',
                        vtype: 'nameValid',
                        anchor:'100%',
                        validator: function (val) {
                                errMsg = 'BBB SKU# name not exist!';
                            return (store_bbb_sku.find('value', val)!==-1)? true:errMsg;
                        }
                    },{
                        xtype:'textareafield',
                        fieldLabel: 'Description',
                        labelAlign: 'top',
                        name: 'description',
                        labelWidth: style.input2.labelWidth,
                        anchor:'100%',
                    },{
                        xtype: 'container',
                        anchor:'100%',
                        layout: {
                            type: 'hbox',
                        },
                        items: [{
                            xtype:'combobox',
                            fieldLabel: 'Cell Number',
                            labelAlign: 'top',
                            name: 'cell_number',
                            typeAhead: false,
                            queryMode: 'remote',
                            minChars:2,
                            triggerAction: 'all',
                            editable: true,
                            enableKeyEvents: true,
                            labelWidth: style.input2.labelWidth,
                            store: store_cell_numbers,
                            displayField: 'cell_number',
                            valueField: 'cell_number',
                            minWidth: 220,
                            flex:3
                        },{
                            xtype:'textfield',
                            fieldLabel: lan.revision+':',
                            labelAlign: 'top',
                            name: 'revision',
                            labelWidth: style.input2.labelWidth,
                            enableKeyEvents: true,
                            margin: '0 0 0 10px',
                            minWidth: 100,
                            readOnly: true,
                            flex:1
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            name: 'create_date',
                            fieldLabel: 'Created Date',
                            labelAlign: 'top',
                            readOnly:true,
                            margin: '0 0 0 10px',
                            minWidth: 120,
                            flex:1
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            name: 'last_mod',
                            fieldLabel: 'Last Mod.',
                            labelAlign: 'top',
                            readOnly:true,
                            margin: '0 0 0 10px',
                            minWidth: 120,
                            flex:1
                        }]
                    },{
	                	xtype: 'hidden',
	                	name: 'process_id'
	                },operations_grid]
            }],
            buttons: [
            {
                text: 'Use',
                iconCls: 'use_blue',
                width: 110,
                hidden: use_btn,
                handler: function(){
                    var new_time_id = time_id+1000000;
                    /*if(case_type=='task_ecr'){
                        Ext.getCmp('process_box_'+new_time_id).removeAll();
                        var process_form = getProcessForm({time_id:new_time_id, process_id: process_id, case_type: case_type, action: 'edit'});
                        Ext.getCmp('process_box_'+new_time_id).add(process_form);
                    }
                    else {*/
                        Ext.getCmp('process_operations_grid'+new_time_id).getStore().load({
                            params:{
                                id:process_id
                            }
                        });
                   // }
                    closeWindows(2);
                }
            },{
                text: 'Save',
                hidden: save_btn,
                iconCls: 'save',
                width: 110,
                handler: function(){
                    var form = this.up('form').getForm();
                    saveProcess({time_id: time_id, form: form, action: action});
                }
            },{
                text: 'Cancel',
                hidden: cancel_btn,
                iconCls: 'cancel',
                width: 110,
                handler: function(){
                    this.up('window').destroy();
                }
            }],
            listeners: {
            	afterrender: function(){
            		if(process_id&&process_id!==null){
            			setProcessFields({time_id: time_id, form:this, process_id:process_id, case_type: case_type, action: action});
            		}
            	}
            }
        });
	return process_form;
}

function getProcessOperationsGrid(inData){
   var time_id = Date.parse(new Date());
   var process_id = null;
   var case_type = 'process_dir';
   var action = 'view';
   var edit_btns = false;

    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.process_id) process_id = inData.process_id;
        if(inData.case_type) case_type = inData.case_type;
        if(inData.action) action = inData.action;
    }

    if(case_type=='task_ecr'){
        if(action=='view'){
            edit_btns = true;
        }
    }

    
  var store_process_operations_grid = new Ext.data.Store({
        fields: ['id', 'id_op', {name:'op_number', sortType: 'asNatural'}, 'proc_number', 'operation_procedure', 'tool', 'gage', 'equip', 'work_st', 'full', 'files', 'descriptionOperation', 'approved'],
         proxy: {
            type: 'ajax',
			url: 'scripts/ecr_form.php?getProcessData=true',
			scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        },
        sorters: [{
               property: 'op_number'
           }]
    });

var gridProcessOperations = {
        xtype: 'grid',
        title: 'Process Operations:',
        layout: 'fit',
        columnLines: true,
        id:'process_operations_grid'+time_id,
        minHeight: 400,
        border: true,
        frame: false,
        autoScroll: true,
        margin: '10px 0',
        store: store_process_operations_grid,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },  
        columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.operation_number, dataIndex: 'op_number', sortable: true, hideable: false, width: 170},
        {dataIndex: 'id', sortable: true, hidden: true},
        {dataIndex: 'id_op', sortable: true, hidden: true},
        {text: lan.operation_procedure_id, dataIndex: 'proc_number', sortable: true, hideable: false, width: 170},
        {text: lan.oper_procedure, dataIndex: 'operation_procedure', sortable: true, hideable: true, minWidth: 200, flex:1},
        {text: lan.checked_problems, sortable: false, dataIndex: 'full', width: 150, renderer: setTextPDS},
        {xtype:'actioncolumn', width:30, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    store_process_operations_grid.remove(rec);
                                    this.up('grid').getView().refresh();
                                }
                            }]
        }],
        dockedItems:[{
        	xtype: 'toolbar',
        	border: false,
        	dock: 'bottom',
            hidden: edit_btns,
            items:[{
	        	xtype: 'button',
	        	text: lan.add_existing_operat,
	        	flex: 1,
	        	handler: function(){
                    var grid = addGridOperation({time_id: time_id, case_type: case_type, action: action});
                    showObject({id:time_id, title: lan.add_operation, item: grid, sizeX: '90%', sizeY: '90%'});
	        	}
	        },{
	        	xtype: 'splitter'
	        },{
	        	xtype: 'button',
	        	text: lan.create_new_operat,
	        	flex: 1,
	        	handler: function(){
	        		var operation_form = getOperationForm({time_id: time_id, action: 'add', case_type: case_type});
                    showObject({id:time_id, title: lan.create_operat, item: operation_form, sizeX: '90%', sizeY: '90%'});
	        	}
	        }]
        }],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                if(cellIndex==1&&action!=='view'){
                    Ext.Msg.prompt(lan.change_number, lan.new_oper_number, function(btn, text){
                        if (btn == 'ok'){
                            if(checkOperationNumber(text, time_id)){
                                Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                 }
                                 else{
                                    var rec = record;
                                    rec.data.op_number = text;
                                    store_process_operations_grid.remove(record);
                                    store_process_operations_grid.add(rec);
                                    Ext.getCmp('process_operations_grid'+time_id).getView().refresh();
                                 }
                            }
                      });
                }
                else {
                    if(record){
                        if(case_type=='task'){
                            action='edit';
                        }
                        else {
                            action= 'view';
                        }
                        var operation_form = getOperationForm({time_id: time_id, action: action, operation_id: record.get('id_op'), case_type:case_type, op_number: record.get('op_number')});
                        showObject({id:time_id, title: 'View Operation', item: operation_form, sizeX: '90%', sizeY: '90%'});
                   }
                }
            }
        }
    }
    return gridProcessOperations;
}

function setProcessFields(inData){
    var time_id = Date.parse(new Date());
    var form = null;
    var process_id = null;
    var case_type = 'dir';
    var action = 'edit';

    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.form) form = inData.form;
        if(inData.case_type) case_type = inData.case_type;
        if(inData.action) action = inData.action;
        if(inData.process_id) {
            process_id = inData.process_id;
            Ext.getCmp('process_operations_grid'+time_id).getStore().load({
                id: process_id
            });
        }
    }

    Ext.Ajax.request({
        url: 'scripts/process_directory.php?getProcessDataById=true',
        method: 'POST',
        params: {
            process_id: process_id
        },
        success: function(response) {
            var data =  Ext.decode(response.responseText);
            var fields = form.getForm().getFields();
            fields.each(function(item){
                for (var k in data){
                    if(item.getName() == k && data[k]!=null){
                        item.setValue(data[k]);
                    }
                }
            });
        },
        failure: function(response) {
             Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

function saveProcess(inData){
    if(inData){
        var time_id = inData.time_id;
        var form = inData.form;
        var action = inData.action;
        var data_out = [];
        var full_store = true;
        var order=0;
        var store =  Ext.getCmp('process_operations_grid'+time_id).getStore();

       if(store.data.length>0){
            store.each(function(record){
                order++;
                data_out.push({order: order, id:record.get('id_op'), full: record.get('full'), op_number: record.get('op_number'), tool: record.get('tool'), gage: record.get('gage'), equip:record.get('equip'), work_st:record.get('work_st')});
                if(record.get('full')==0){full_store=false;}
            });
       }
       else {
            Ext.MessageBox.alert(lan.error, "You can't save process without any operation!");
            return;
       }
       

        /*if(full_store===false&&draft == 0){
            Ext.MessageBox.alert(lan.error, lan.operat_not_ready);
            return
        }*/

        var processJS = JSON.stringify(data_out);

        var params = {
            'process': processJS,
            'action': action
        };

        if(form.isValid()) {
            form.submit({
                url: 'scripts/process_directory.php?saveProcess=true',
                waitMsg: lan.saving,
                wait: true,
                scope: this,
                method: 'post',
                params: params,
                success: function(form, action) {
                    var data = Ext.decode(action.response.responseText);
                    closeWindows(1);
                    if(data.message){
                       Ext.MessageBox.alert(lan.succ, data.message);
                    }
                    Ext.getCmp('processes_grid'+time_id).getStore().load();
                 },
                failure: function(form, action) {
                    var data = Ext.decode(action.response.responseText);
                    Ext.MessageBox.alert(lan.savingErr, data.message);
                }
            });
        } else {
            Ext.MessageBox.alert(lan.savingErr, lan.not_filled);
        }
    }
}