var WindowProcess = null;

function addGridOperation(inData){
    //time_id, view=false, add_tab=true, pds, rights, out_source_id=null
    var time_id = Date.parse(new Date());
    var rights = all_rights['operation_procedures'];
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;
    var case_type = 'dir';
    var process_btn = true;
    var dir_btn = false;
    var action = 'view';


    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.rights) rights = inData.rights;
        if(inData.case_type) case_type = inData.case_type;
        if(inData.action) action = inData.action;
    }

    if(case_type=='dir'&&action=='view'){
        action='edit';
    }

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    console.log(action);
    console.log(case_type);



    if(case_type=='process_dir'||case_type=='task'||case_type=='task_ecr'){
        action = 'view';
        process_btn = false;
    	dir_btn = true;
    }

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.operation_procedure_id, dataIndex: 'number', sortable: true, hideable: false, width: 200},
        {text: lan.oper_procedure, dataIndex: 'operation_procedure', sortable: true, hideable: true, minWidth: 200, flex:1},
    ];

 var storeProcessGrid = new Ext.data.Store({
        fields: ['id', {type: 'string', name: 'operation_procedure', sortType: 'asLower'}, {type: 'string', name: 'number', sortType: 'asLower'}],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=operation_data',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
        simpleSortMode: true
        }
    });

 var PagingProcessbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storeProcessGrid,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'process'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeProcessGrid,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
            markDirty:false
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                border: false,
                items: [
                    {
                        text: lan.add,
                        iconCls: 'add',
                        minWidth: 110,
                        flex:1,
                        disabled: disable_add,//rights rule
                        hidden: dir_btn,
                        handler: function() {
                            var operation_form = getOperationForm({time_id: time_id, action: 'add'});
                            showObject({id:time_id, title: lan.create_operat, item: operation_form, sizeX: '100%', sizeY: '100%'});
						}
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        minWidth: 110,
                        flex:1,
                        disabled: disable_edit,//rights rule
                        hidden: dir_btn,
                        handler: function() {
                          var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var operation_form = getOperationForm({time_id: time_id, action: 'edit', operation_id: select.get('id')});
                            	showObject({id:time_id, title: 'View/Edit Operation', item: operation_form, sizeX: '100%', sizeY: '100%'});
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        minWidth: 110,
                        flex:1,
                        disabled: disable_delete,//rights rule
                        hidden: dir_btn,
                        handler: function() {
                        	var op_grid = this.up('grid');
                          	var select = op_grid.getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?delOperation=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                op_grid.store.load();
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
                        text: lan.add_to_table,
                        iconCls: 'use',
                        hidden: process_btn,
                        minWidth: 110,
                        flex:1,
                        handler: function() {
                        	var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                            if(select){
                                Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                                if (btn == 'ok'){
                                     if(checkOperationNumber(text, time_id)){
                                        Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                     }
                                     else{
                                         op_number = text;
                                         Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?getOperationData=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                var data =  Ext.decode(response.responseText)[0];
                                                var operation_grid = Ext.getCmp('process_operations_grid'+time_id);
                                               	operation_grid.getStore().add({full: 0, approved:data.approved, id_op:data.id, op_number:op_number, proc_number: data.number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation,tool:data.tools, gage:data.gages, work_st:data.workstations, equip:data.equipments});
                                                operation_grid.getView().refresh();
                                                if(case_type=='task') checkCapex(time_id);
                                                closeWindows(1); 
                                            },
                                            failure: function(response) {
                                                 Ext.MessageBox.alert(lan.error, response.responseText);
                                            }
                                        });
                                     }
                                    }
                                });
                            }
                            else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.view,
                        iconCls: 'showpic',
                        hidden: process_btn,
                        minWidth: 110,
                        flex:1,
                        handler: function() {
                        	var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var operation_form = getOperationForm({time_id: time_id, action: 'view', operation_id: select.get('id'), case_type: case_type});
                            	showObject({id:time_id, title: 'View Operation', item: operation_form, sizeX: '90%', sizeY: '90%'});
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
                    minWidth: 200,
                    flex:3,
                    listeners: {
                        change: function() {
                            var op_store = this.up('grid').getStore();
                            op_store.getProxy().url = 'scripts/datastore.php?func=operation_data&search=' + this.value;
                            op_store.load();
                        }
                    }
                }]
            }
        ],
        bbar: [PagingProcessbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
               if(record.get('id')){
               		var operation_form = getOperationForm({time_id: time_id, action: action, operation_id: record.get('id'), case_type: case_type});
                    showObject({id:time_id, title: 'View/Edit Operation', item: operation_form, sizeX: '100%', sizeY: '100%'});
               }
            }
        }
    }

    return grid;
}

function getOperationForm(inData){
  var time_id = Date.parse(new Date());
  var operation_id = null;
  var action = 'view';
  var case_type = 'dir';
  var use_btn = true;
  var save_btn = false;
  var op_number = null;

  if(inData){
    if(inData.time_id) time_id = inData.time_id;
    if(inData.action) action = inData.action;
    if(inData.operation_id) operation_id = inData.operation_id;
    if(inData.case_type) case_type = inData.case_type;
    if(inData.op_number) op_number = inData.op_number;
  }
  console.log(action);
  console.log(case_type);

  if(action=='view'){
        save_btn = true;
  }

 if(case_type=='process_dir'||case_type=='task'||case_type=='task_ecr'){
       use_btn = false;
       save_btn = true;
  }

  var GridTools = getToolGrid(time_id);
  var GridGages = getGageGrid(time_id);
  var GridWorkstation = getWorkstationGrid(time_id);
  var GridEquipment = getEquipmentGrid(time_id);
  var UploadDocForm = getUploadDocumentsItem({time_id: time_id, title: lan.work_instruct, readStatus: false, link: 'doc'});

var operation_form = new Ext.create('Ext.form.Panel',
        {
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
            },
            autoScroll: true,
            items:[
            {
                xtype: 'container',
                anchor:'96%',
                layout: 'hbox',
                items:[{
                        xtype:'combobox',
                        fieldLabel: lan.oper_proc_id,
                        labelAlign: 'top',
                        name: 'number',
                        queryMode: 'remote',
                        id: 'number_'+time_id,
                        allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        displayField: 'value',
                        valueField: 'value',
                        autoSelect: true,
                        store: storeOperationNumber,
                        labelWidth: style.input2.labelWidth,
                        flex:1,
                        vtype: 'idValid',
                        listeners:{
                            select:function(name, newValue, oldValue, eOpts){
                               var operation_id = name.displayTplData[0].id;
                               var form = this.up('form').getForm();
    							setOperationFields({time_id:time_id, operation_id: operation_id, form: form});
                            },
                            change: function(){
                                var val_length = 0;
                                if(this.getValue()){
                                    val_length = this.getValue().length;
                                } 
                               
                               if(val_length>1){
                                    this.setConfig('queryMode', 'remote');
                               } 
                                else{
                                    this.setConfig('queryMode', 'local');
                                } 
                            }
                        }
                    },{
                        xtype: 'splitter'
                    },{
                        xtype:'combobox',
                        fieldLabel: lan.operational_proc,
                        labelAlign: 'top',
                        name: 'operation_procedure',
                        queryMode: 'remote',
                        allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        labelWidth: style.input2.labelWidth,
                        store: storeOperationProcedures,
                        displayField: 'value',
                        valueField: 'value',
                        autoSelect: true,
                        id: 'operation_procedure_'+time_id,
                        flex:2,
                        vtype: 'nameValid'
                    }]
    },{
        xtype:'hidden',
        name: 'operation_id',
    },{
    	xtype: 'hidden',
    	name: 'operation_grids_control',
    	id: 'operation_grids_control_'+time_id,
    	value: 0
    },{
        xtype: 'textareafield',
        fieldLabel: lan.description,
        labelAlign: 'top',
        name: 'descriptionOperation',
        id: 'descriptionOperation_'+time_id,
        anchor:'96%',
        labelWidth: style.input2.labelWidth,
    },{
        xtype: 'fieldset',
        title: "<span style='color:#4169E1; font-size: 20px; letter-spacing: 2px;'><b>"+lan.tool+":</b></span>",
        anchor:'96%',
        border: 3,
        items:GridTools
    },{
        xtype: 'fieldset',
        title: "<span style='color:#4169E1; font-size: 20px; letter-spacing: 2px;'><b>"+lan.gages+":</b></span>",
        anchor:'96%',
        border: 3,
        items:GridGages
    },{
        xtype: 'fieldset',
        title: "<span style='color:#4169E1; font-size: 20px; letter-spacing: 2px;'><b>"+lan.workstations+":</b></span>",
        anchor:'96%',
        border: 3,
        items:GridWorkstation
    },{
        xtype: 'fieldset',
        title: "<span style='color:#4169E1; font-size: 20px; letter-spacing: 2px;'><b>"+lan.equipments+":</b></span>",
        anchor:'96%',
        border: 3,
        items:GridEquipment
    },UploadDocForm
    ],
    buttons:[
    	{
        text:lan.add_to_table,
        iconCls:'use_blue',
        minWidth: 150,
        hidden: use_btn,
        handler:function(){
                var form = this.up('form').getForm();
                if(action=='add'){
                    saveOperation({time_id: time_id, form: form, action: action, case_type: case_type});
                }
                else {
               		var fields = form.getFields();
                    var operation_id =  getValueByName(fields, 'operation_id');
                    var operation_procedure = getValueByName(fields, 'operation_procedure');
                    var proc_number = getValueByName(fields, 'number');
                    var descriptionOperation = getValueByName(fields, 'descriptionOperation');
                    var details = getStorePDS(time_id);
                    var operation_grid = Ext.getCmp('process_operations_grid'+time_id);
                    var operation_store = operation_grid.getStore();
                    
                    if(op_number) {
                        operation_store.each(function(record){
                            if(record.get('op_number')==op_number){
                                operation_store.remove(record);
                            }
                        });
                        operation_store.add({full: details.flag, approved:details.approved, id_op:operation_id, op_number:op_number, proc_number: proc_number, operation_procedure:operation_procedure, descriptionOperation:descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                        operation_grid.getView().refresh();
                        closeWindows(1);
                    }
                    else {
                        Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                            if (btn == 'ok'){
                                 if(checkOperationNumber(text, time_id)){
                                    Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                 }
                                 else{
                                    op_number = text;
                                    operation_store.add({full: details.flag, approved:details.approved, id_op:operation_id, op_number:op_number, proc_number: proc_number, operation_procedure:operation_procedure, descriptionOperation:descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                    operation_grid.getView().refresh();
                                    closeWindows(2);
                                 }
                            }
                        });
                    }
                    if(case_type=='task') checkCapex(time_id);
                }

            }
        },{
        text:lan.save,
        iconCls:'save',
        minWidth: 150,
        hidden: save_btn,
        handler:function(){
           		var form = this.up('form').getForm();
            	saveOperation({time_id: time_id, form: form, action: action});
                if(case_type=='task') checkCapex(time_id);
            }
        },
    {
        text:lan.cancel,
        iconCls: 'cancel',
        minWidth: 150,
        handler:function(){
            this.up('window').destroy();        
    }
    }],
    listeners: {
    	afterrender: function(){
    		if(operation_id&&operation_id!==null){
    			var form = this.getForm();
    			setOperationFields({time_id:time_id, operation_id: operation_id, form: form, action: action, case_type:case_type});
    		}
    	}
    }
});
  
return operation_form;
}


function getToolGrid(time_id){
    var storeGridTool = new Ext.data.Store({
        fields: ['tool_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
    });


    var comboStatusEl =  getComboStatusEl();
    var comboCapexTools =  getComboYESNO(view);
    var comboPendingTools =  getComboYESNO(true);

    var SetNumberFieldTool = function(record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype: 'numberfield',
                minValue:0,
                allowExponential: false,
                mouseWheelEnabled: false,
                listeners: {
                    change: function(){
                        var grid = Ext.getCmp('GridTools'+time_id);
                        var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                        record.set(lastCol, this.value);
                        searchOperation(time_id);
                    }
                }
            }
        });
    }

    var GridTools = Ext.create('Ext.grid.Panel', {
    store: storeGridTool,
    id: 'GridTools'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('operation_grids_control_'+time_id).getValue();
                        if(edit_status==1) {
                            return false;
                        }
                    }
                }
            })],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.tool_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.tool_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor: SetNumberFieldTool},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingTools, sortable: false, dataIndex: 'pending_design', width: 120, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingTools), this)},
        {text: lan.capex_req, editor: comboCapexTools, sortable: false, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexTools), this)},
        {xtype:'actioncolumn', width:30, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridTool.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_tool,
            minWidth: 170,
            handler: function() {
                var itemTool = addToolGageGrid(time_id, true, 'tool', false, all_rights['tool_gage'], true);
                showWinProcess(time_id, lan.add_tool, itemTool, storeGridTool, 'tool');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('tool_id')){
                showWindowDirectory("tool", '', time_id, lan.view_tool, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('tool_id'), true, true);
           }
       }
    }
});
    return GridTools;
}

function getGageGrid(time_id){

  var comboCapexGages =  getComboYESNO(view);
  var comboPendingGages =  getComboYESNO(true);
  var comboStatusEl =  getComboStatusEl();

  var storeGridGage = new Ext.data.Store({
        fields: ['gage_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

  var SetNumberFieldGage = function(record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype: 'numberfield',
                minValue:0,
                allowExponential: false,
                mouseWheelEnabled: false,
                listeners: {
                    change: function(){
                        var grid = Ext.getCmp('GridGage'+time_id);
                        var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                        record.set(lastCol, this.value);
                        searchOperation(time_id);
                    }
                }
            }
        });
    }

var GridGage = Ext.create('Ext.grid.Panel', {
    store: storeGridGage,
    id: 'GridGage'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('operation_grids_control_'+time_id).getValue();
                            if(edit_status==1) {
                                return false;
                            }
                    }
                }
            })],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.gage_id, sortable: false, dataIndex: 'number', width:160},
        {text: lan.identify_gage, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: true, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldGage},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingGages,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingGages), this)},
        {text: lan.capex_req, editor: comboCapexGages, sortable: false, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexGages), this)},
        {xtype:'actioncolumn', width:30, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridGage.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_gage,
            minWidth: 170,
            handler: function() {
                var itemGage = addToolGageGrid(time_id, true, 'gage', false, all_rights['tool_gage'], true);
                showWinProcess(time_id, lan.add_gage, itemGage, storeGridGage, 'gage');
                }
            }]
    }],
    listeners: {
       itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('gage_id')){
                showWindowDirectory("gage", '', time_id, lan.view_gage, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('gage_id'), true, true);
           }
       }
    }
});

return GridGage
}

function getWorkstationGrid(time_id){

  var comboCapexWorkSt =  getComboYESNO(view);
  var comboPendingWorkSt =  getComboYESNO(true);
  var comboStatusEl =  getComboStatusEl();

   var storeGridWorkstation = new Ext.data.Store({
        fields: ['workstation_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

    var SetNumberFieldWorkSt = function(record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype: 'numberfield',
                minValue:0,
                allowExponential: false,
                mouseWheelEnabled: false,
                listeners: {
                    change: function(){
                        var grid = Ext.getCmp('GridWorkstation'+time_id);
                        var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                        record.set(lastCol, this.value);
                        searchOperation(time_id);
                    }
                }
            }
        });
    }

var GridWorkstation = Ext.create('Ext.grid.Panel', {
    store: storeGridWorkstation,
    id: 'GridWorkstation'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('operation_grids_control_'+time_id).getValue();
                            if(edit_status==1) {
                                return false;
                            }
                    }
                }
            })],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.work_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.work_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldWorkSt},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingWorkSt,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingWorkSt), this)},
        {text: lan.capex_req, editor: comboCapexWorkSt, sortable: false, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexWorkSt), this)},
        {xtype:'actioncolumn', width:30, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridWorkstation.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_work,
            minWidth: 170,
            handler: function() {
                var itemWorkSt = addWorkStGrid(time_id, true, false, all_rights['workstation'], true);
                showWinProcess(time_id, lan.add_work, itemWorkSt, storeGridWorkstation, 'workstation');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('workstation_id')){
                showWindowDirectory("", '', time_id, lan.view_work, 'work_st', imagesStoreWorkSt, documentGridStoreWorkSt, record.get('workstation_id'), true, true);
           }
       }
    }
});
return GridWorkstation;
}

function getEquipmentGrid(time_id){
  var comboCapexEquip =  getComboYESNO(view);
  var comboPendingEquip =  getComboYESNO(true);
  var comboStatusEl =  getComboStatusEl();

  var storeGridEquipment = new Ext.data.Store({
        fields: ['equipment_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

   var SetNumberFieldEquip = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly: view,
            listeners: {
                change: function(){
                    var grid = Ext.getCmp('GridEquipment'+time_id);
                    var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                    record.set(lastCol, this.value);
                    searchOperation(time_id);
                }
            }
        }
    });
}

var GridEquipment = Ext.create('Ext.grid.Panel', {
    store: storeGridEquipment,
    id: 'GridEquipment'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('operation_grids_control_'+time_id).getValue();
                            if(edit_status==1) {
                                return false;
                            }
                    }
                }
            })],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.equip_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.equip_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldEquip},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingEquip,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingEquip), this)},
        {text: lan.capex_req, editor: comboCapexEquip, sortable: false, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexEquip), this)},
        {xtype:'actioncolumn', width:30, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridEquipment.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_equip,
            minWidth: 170,
            handler: function() {
                var itemEquip = addEquipGrid(time_id, true, false, all_rights['equipment'], true);
                showWinProcess(time_id, lan.add_equip, itemEquip, storeGridEquipment, 'equipment');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('equipment_id')){
                showWindowDirectory("", '', time_id, lan.view_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, record.get('equipment_id'), true, true);
           }
       }
    }
});
 return GridEquipment;
}

function showWinProcess(time_id, title, item, store, dir){
if(!WindowProcess){
    WindowProcess = new Ext.Window({
        width: '90%',
        height: '90%',
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        autoScroll: true,
        modal: true,
        constrainHeader: true,
        buttons: [{
            text: lan.add_to_table,
            handler:function(){
                var select = Ext.getCmp(item.id).getView().getSelectionModel().getSelection()[0];
                if(select){
                    var id = select.get('id');
                    var isExists = false;
                    store.each(function(record){
                        if(record.get(dir+'_id')==id) {
                            isExists = true;
                        }
                    });
                    if(isExists===false) {
                        Ext.Ajax.request({
                            url: 'scripts/ecr_form.php?getDirInfo=true',
                            method: 'POST',
                            params: {dir: dir, id: id},
                            success: function(response) {
                                var data = Ext.decode(response.responseText);
                                data = data.rows[0];
                               var rec2;
                               var rec1 = {number: data.number, needs:data.name, description: data.description, pending_design: data.pending_design, life_time: data.life_time, estimated_unit_price:data.estimated_unit_price, approved: data.approved};
                               switch(dir){
                                case 'tool': rec2 = {tool_id: id}; break;
                                case 'gage': rec2 = {gage_id: id}; break;
                                case 'workstation': rec2 = {workstation_id: id}; break;
                                case 'equipment': rec2 = {equipment_id: id}; break;
                               }
                               var rec = $.extend({}, rec2,rec1);
                               store.add(rec);
                               searchOperation(time_id);
                               WindowProcess.destroy();
                            },
                            failure: function(response) {
                                 Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                    }
                    else {
                        Ext.MessageBox.alert(lan.error, lan.this_is+' '+title.slice(3)+' '+lan.is_already);
                    }
                }
                else Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
        }],
        listeners: {
            destroy: function(){
               WindowProcess = null;
            }
        },
        items:item
    });
    WindowProcess.show();
    }
}

function searchOperation(time_id){
    var tool = [];
    var gage = [];
    var work_st = [];
    var equip = [];
    var storeGridTool = Ext.getCmp('GridTools'+time_id).getStore();
    var storeGridGage = Ext.getCmp('GridGage'+time_id).getStore();
    var storeGridWorkstation = Ext.getCmp('GridWorkstation'+time_id).getStore();
    var storeGridEquipment = Ext.getCmp('GridEquipment'+time_id).getStore();

    storeGridTool.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            tool.push({tool_id:record.get('tool_id'), qty:record.get('qty')});
        }
        else {
            tool.push({tool_id:record.get('tool_id')});
        }
        
    });

    storeGridGage.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            gage.push({gage_id:record.get('gage_id'), qty:record.get('qty')});
        }
        else {
            gage.push({gage_id:record.get('gage_id')});
        }
    });

    storeGridWorkstation.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            work_st.push({workstation_id:record.get('workstation_id'), qty:record.get('qty')});
        }
        else {
            work_st.push({workstation_id:record.get('workstation_id')});
        }
    });

    storeGridEquipment.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            equip.push({equipment_id:record.get('equipment_id'), qty:record.get('qty')});
        }
        else {
            equip.push({equipment_id:record.get('equipment_id')});
        }
    });

    var params ={};
    if(tool.length>0){
        toolJS = JSON.stringify(tool);
        params = $.extend({tools: toolJS}, params);
    }

    if(gage.length>0){
        gageJS = JSON.stringify(gage);
        params = $.extend({gages: gageJS}, params);
    }
    
     if(work_st.length>0){
        work_stJS = JSON.stringify(work_st);
        params = $.extend({workstations: work_stJS}, params);
    }
    
     if(equip.length>0){
        equipJS = JSON.stringify(equip);
        params = $.extend({equipments: equipJS}, params);
    }

    Ext.Ajax.request({
        url: 'scripts/ecr_form.php?searchOperation=true',
        method: 'POST',
        params: params,
        success: function(response) {
            var data = Ext.decode(response.responseText);
            if(data){
                storeOperationNumber.removeAll();
                var num = 0;
                if(data.count){
                    num = data.count;
                }
                Ext.getCmp('number_'+time_id).setConfig('fieldLabel',  lan.operation_procedure_id+': ('+num+'):');
           
                if(data.count>0){
                    storeOperationNumber.loadData(data.operations);
                }
            }
        },
        failure: function(response) {
             Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

function saveOperation(inData){
   //action, time_id, form, create_btn=true, pds, request_id, op_number, out_source_id
   	if(inData.time_id&&inData.form){
   		var time_id = inData.time_id;
   		var form = inData.form;
        var case_type = 'dir';

   		var action = 'edit';
        if(inData.action) action = inData.action;
   		if(inData.case_type) case_type = inData.case_type;

   		var result;
   		var tool = [];
	    var gage = [];
	    var work_st = [];
	    var equip = [];
	    var files = [];
   		if(isFullOperation(time_id)){
   			result = checkElementStore(time_id, 'tool');
   			if (result.table_full){
   				tool = result.el_arr;
   			}
   			else {
   				return
   			}

   			result = checkElementStore(time_id, 'gage');
   			if (result.table_full){
   				gage = result.el_arr;
   			}
   			else {
   				return
   			}

   			result = checkElementStore(time_id, 'workstation');
   			if (result.table_full){
   				work_st = result.el_arr;
   			}
   			else {
   				return
   			}

   			result = checkElementStore(time_id, 'equipment');
   			if (result.table_full){
   				equip = result.el_arr;
   			}
   			else {
   				return
   			}

   			Ext.getCmp('doc_grid'+time_id).getStore().each(function(record){
		        files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
		    });

   			

   			var toolJS = JSON.stringify(tool);
		    var gageJS = JSON.stringify(gage);
		    var work_stJS = JSON.stringify(work_st);
		    var equipJS = JSON.stringify(equip);
		    var filesJS = JSON.stringify(files);

		    var params = {
		        'tools' : toolJS,
		        'gages' : gageJS,
		        'workstations' : work_stJS,
		        'equipments' : equipJS,
		        'files' : filesJS,
		        'action' : action
		    };

		    if(form.isValid()) {
		        form.submit({
		            url: 'scripts/ecr_form.php?saveOperational=true',
		            waitMsg: lan.saving,
		            wait: true,
		            scope: this,
		            method: 'post',
		            params: params,
		            success: function(form, action) {
		                var data = Ext.decode(action.response.responseText);
	                    if(case_type=='process_dir'||case_type=='task'||case_type=='task_ecr'){
                            var fields = form.getFields();
                            var operation_id =  data.id_op;
                            var operation_procedure = data.operation_procedure;
                            var proc_number = data.proc_number;
                            var descriptionOperation = data.descriptionOperation;
                            var details = getStorePDS(time_id);
                            var operation_grid = Ext.getCmp('process_operations_grid'+time_id);
                            var operation_store = operation_grid.getStore();
                            
                            Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                                if (btn == 'ok'){
                                     if(checkOperationNumber(text, time_id)){
                                        Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                     }
                                     else{
                                        op_number = text;
                                        operation_store.add({full: details.flag, approved:details.approved, id_op:operation_id, op_number:op_number, proc_number: proc_number, operation_procedure:operation_procedure, descriptionOperation:descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                        operation_grid.getView().refresh();
                                        if(case_type=='task') checkCapex(time_id);
                                        closeWindows(1);
                                     }
                                }
                            });
                        }
                        else {
                            closeWindows(1);
                            if(data.message){
                               Ext.MessageBox.alert(lan.succ, data.message);
                            }
                            Ext.getCmp('process'+time_id).getStore().load();
                        }
		             },
		            failure: function(form, action) {
		                var data = Ext.decode(action.response.responseText);
		                Ext.MessageBox.alert(lan.error, data.message);
		            }
		        });
		    } else {
		        Ext.MessageBox.alert(lan.savingErr, lan.not_filled);
		    }   

   		}
   		else {
   			Ext.MessageBox.alert(lan.error, lan.can_not_empty);
        	return
   		}
   	}
 }

 function isFullOperation(time_id){
 	var isFull = true;
 	var count = 0;
 	 var elements_ids = ['GridTools', 'GridGage', 'GridEquipment', 'GridWorkstation'];
 	 for (var i=0; i<elements_ids.length; i++){
 	 	if(Ext.getCmp(elements_ids[i]+time_id).getStore().data.length==0) count++;
 	 }
 	 if(count==elements_ids.length) isFull =false;
 	 return isFull;
 }

 function checkElementStore(time_id, el){
    	var elements_ids = {tool:'GridTools', gage:'GridGage', equipment:'GridEquipment', workstation:'GridWorkstation'};
    	var store = Ext.getCmp(elements_ids[el]+time_id).getStore();
    	var table_full = true;
    	var el_arr = [];
    	var msg_qty = "";
    	var msg_price = "";
    	switch(el){
        	case 'tool':
        		msg_qty = lan.incorrect_qty_tool;
        		msg_price = lan.not_estimated_price;
        	break;
        	case 'gage':
        		msg_qty = lan.incorrect_qty_gage;
        		msg_price = lan.not_spec_estimated_price;
        	break;
        	case 'workstation':
        		msg_qty = lan.incorrect_qty_work;
        		msg_price = lan.not_spec_price_work;
        	break;
        	case 'equipment':
        		msg_qty = lan.incorrect_qty_equip;
        		msg_price = lan.not_spec_price_equip;
        	break;
        }

    	store.each(function(record){
	        if(record.get('qty')>0) {
	            if((record.get('estimated_unit_price')<=0||!record.get('estimated_unit_price'))){
	                Ext.MessageBox.alert(lan.error, msg_price);
	                table_full =  false
	            }
	            else {
	            	var row = {qty:record.get('qty'), estimated_unit_price: record.get('estimated_unit_price')};
	            	row[el+"_id"] = record.get(el+'_id');
	            	el_arr.push(row);
	            }
	        }
	        else {
	            Ext.MessageBox.alert(lan.error, msg_qty);
	            table_full =  false
	        }
	    });
	    var result = {table_full: table_full, el_arr: el_arr};
    	return result;
    }

function setOperationFields(inData){
	var time_id = inData.time_id;
	var operation_id = inData.operation_id;
	var action = inData.action;
	var form = inData.form;
    var fields = form.getFields();
	var case_type = inData.case_type;
	var request_id = null;

	if(inData.request_id) request_id = inData.request_id;

	Ext.Ajax.request({
        url: 'scripts/ecr_form.php?getOperationData=true',
        method: 'POST',
        params:{
            id: operation_id,
            request_id: request_id
        },
        success: function (response){
            var data = Ext.decode(response.responseText)[0];
            if(data){
                fields.each(function(item){
					for (var k in data){
						if(item.getName() == k && data[k]!=null){
							item.setValue(data[k]);
						}
					}
					if(item.getName() == 'operation_id') item.setValue(data['id']);
				});

                if(data.tools){
                    var tools = Ext.decode(data.tools);
                    Ext.getCmp('GridTools'+time_id).getStore().loadData(tools);
                }
                if(data.gages){
                    var gages = Ext.decode(data.gages);
                    Ext.getCmp('GridGage'+time_id).getStore().loadData(gages);
                }
                if(data.workstations){
                    var workstations = Ext.decode(data.workstations);
                    Ext.getCmp('GridWorkstation'+time_id).getStore().loadData(workstations);
                }
                if(data.equipments){
                    var equipments = Ext.decode(data.equipments);
                    Ext.getCmp('GridEquipment'+time_id).getStore().loadData(equipments);
                }
                if(data.files){
                    var files = Ext.decode(data.files);
                    Ext.getCmp('doc_grid'+time_id).getStore().loadData(files);
                }
            }

            if(action=='view'){
				setBlockOperationForm({time_id: time_id, form: form,case_type: case_type});
			}
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}


function setBlockOperationForm(inData){
	if(inData){
		var time_id = inData.time_id;
        var form = inData.form;
		var case_type = inData.case_type;

		var el = Ext.getCmp('operation_grids_control_'+time_id);
		el.setValue(1);

		form.getFields().each(function(item){
			item.setConfig('readOnly', true);
		});

		setColumnHidden('GridTools'+time_id);
		setColumnHidden('GridGage'+time_id);
		setColumnHidden('GridWorkstation'+time_id);
		setColumnHidden('GridEquipment'+time_id);

		var form_obj = el.up('form');
		var buttons = form_obj.query('button');
		var file_fields = form_obj.query('filefield');
        //var btn_contr_array = new Array('save', 'cancel', 'use_blue');
		var btn_contr_array = new Array();
        if(case_type=='process_dir'||case_type=='task'||case_type=='task_ecr'){
            btn_contr_array = ['cancel', 'use_blue'];
        }
        else {
            btn_contr_array = ['save', 'cancel'];
        }

		Ext.Array.each(buttons, function(button) {
			if(btn_contr_array.indexOf(button.iconCls)==-1){
				button.setDisabled(true);
			}
      });
		Ext.Array.each(file_fields, function(file_field) {
          file_field.setDisabled(true);
      });
	}
}

function checkOperationNumber(text, time_id){
    var exist_number=false;
     Ext.getCmp('process_operations_grid'+time_id).getStore().each(function(record){
        if(record.get('op_number')==text){
            exist_number = true;
        }
     });
     return exist_number;
}



function getStorePDS(time_id){
    	var elements_ids = {tool:'GridTools', gage:'GridGage', equipment:'GridEquipment', workstation:'GridWorkstation'};
    	var flag = 1;
    	var approved = 0;
    	var temp_arr;
    	var data_arr = [];

    	for(var k in elements_ids){
    		temp_arr = [];
    		var store = Ext.getCmp(elements_ids[k]+time_id).getStore();
    		store.each(function(record){
		        var row = {number:record.get('number'), needs:record.get('needs'), description:record.get('description'), qty:record.get('qty'), life_time:record.get('life_time'), estimated_unit_price:record.get('estimated_unit_price'), total_price:record.get('estimated_total_price'), pending_design:record.get('pending_design'), capex:record.get('capex'), approved:record.get('approved')};
		        row[k+"_id"] = record.get(k+'_id');
		        temp_arr.push(row);
		        if(!record.get('estimated_unit_price')){
		            flag=0;
		        }
		        if(record.get('approved')!=1){
		            approved++;
		        }
		    });
    		data_arr[k] = getJS(temp_arr);
    	}

        temp_arr = [];
    	Ext.getCmp('doc_grid'+time_id).getStore().each(function(record){
	        temp_arr.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
	    });
    	
    	data_arr['files'] = getJS(temp_arr);
    	
	     if(approved!=0){
	        flag = 0;
	    }
    
    var result = {'flag':flag, 'approved':approved, 'tool':data_arr['tool'], 'gage':data_arr['gage'], 'equip': data_arr['equipment'], 'work_st':data_arr['workstation'], files: data_arr['files']};
    return result;
    }


function checkCapex(time_id){
    var capex_flag = false;
    var el = [];
    Ext.getCmp('process_operations_grid'+time_id).getStore().each(function(record){
        if(record.get('tool')){
            el['tool'] = Ext.decode(record.get('tool'));
            for(var i =0; i<el.tool.length; i++){
                    if(el.tool[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('gage')){
            el['gage'] = Ext.decode(record.get('gage'));
            for(var i =0; i<el.gage.length; i++){
                    if(el.gage[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('equip')){
            el['equip'] = Ext.decode(record.get('equip'));
            for(var i =0; i<el.equip.length; i++){
                    if(el.equip[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('work_st')){
            el['work_st'] = Ext.decode(record.get('work_st'));
            for(var i =0; i<el.work_st.length; i++){
                    if(el.work_st[i].capex==1){
                        capex_flag=true
                    }
                }
        }
    });
    if(capex_flag===true){
        Ext.getCmp('capex_create'+time_id).setValue(1);
    }
    else {
        Ext.getCmp('capex_create'+time_id).setValue(0);
        Ext.getCmp('purpose_grid'+time_id).getStore().each(function(record){
            record.data.result="";
        });
        Ext.getCmp('details_grid'+time_id).getStore().each(function(record){
            record.data.result="";
            record.data.qty="";
        });
    }
}