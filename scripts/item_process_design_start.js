var readStatus = false;
var hideStatus = false;
var WindowViewTables = null;
var WindowDraft = null;
var WindowProcessView = null;

var storeOperationGrid = new Ext.data.Store({
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

var storeWindowOperationGrid = new Ext.data.Store({
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

var storeDraftProcess = new Ext.data.Store({
        fields: ['bbb_sku', 'bbb_sku_id', 'create_date', 'count', 'process_id'],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getDraftProcessData=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

function getGridDraftProcess(time_id){
    storeDraftProcess.load();
    var draft_grid = {
        xtype: 'grid',
        layout: 'fit',
        columnLines: true,
        id:'draft_grid'+time_id,
        minHeight: 160,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeDraftProcess,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },     
        columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {hidden: true, dataIndex: 'process_id'},
        {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: false, minWidth: 250, flex:1},
        {text: lan.create_date, dataIndex: 'create_date', sortable: true, hideable: false, minWidth: 200, flex:1},
        {text: lan.number_of_operations, dataIndex: 'count', sortable: true, hideable: true, minWidth: 200, flex:1}],
        dockedItems:[{
            xtype: 'toolbar',
            border: false,
            dock: 'bottom',
            items:[{
                xtype: 'button',
                text: lan.add_to_task,
                flex: 1,
                handler: function(){
                    var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                    if(select){
                        Ext.getCmp('process_operations_grid'+time_id).getStore().load({
                            params:{
                                id:select.get('process_id')
                            }
                        });
                        closeWindows(1);
                    }
                    else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
                }
            },{
                xtype: 'splitter'
            },{
                xtype: 'button',
                text: lan.view_operation,
                flex: 1,
                handler: function(){
                    var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                    if(select){
                        var new_time_id = time_id-1000000;
                        console.log(new_time_id);
                        var process_form = getProcessForm({time_id:new_time_id, process_id: select.get('process_id'), case_type: 'draft', action: 'view'});
                        showObject({id:new_time_id, title: 'View', item: process_form, sizeX: '90%', sizeY: '90%'});
                    }
                    else {
                        Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
                }
            }]
        }],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
               if(record){
                    var new_time_id = time_id-1000000;
                    var process_form = getProcessForm({time_id:new_time_id, process_id: record.get('process_id'), case_type: 'draft', action: 'view'});
                    showObject({id:new_time_id, title: 'View', item: process_form, sizeX: '90%', sizeY: '90%'});
                }
            }
        }
    };
    return draft_grid;
}

function getQuestionBlock(time_id, status_view=true, readStatus){
    var comboYESNOCapex = getComboYESNO(readStatus);
    var comboYESNODetails = getComboYESNO(readStatus);
   var storeProjectPurpose = new Ext.data.Store({
        fields: ['id', 'subject', 'result'],
        data:[
        {id: 1, subject: lan.improve_employee_safery},
        {id: 2, subject: lan.redure_product_costs},
        {id: 3, subject: lan.needed_to_replace_equip},
        {id: 4, subject: lan.renovate_improve_build},
        {id: 5, subject: lan.needed_to_meet},
        {id: 6, subject: lan.purchase_of_air},
        {id: 7, subject: lan.project_comp_money},
        {id: 8, subject: lan.will_proj_reduce},
        {id: 9, subject: lan.how_much_annually},
        {id: 10, subject: lan.will_proj_increase},
        {id: 11, subject: lan.investment_require},
        {id: 12, subject: lan.intend_make_citizen},
        {id: 13, subject: lan.corporate_rid}
        ]
    });

var storeProjectDetails = new Ext.data.Store({
        fields: ['id', 'subject', 'result', `qty`],
        data:[
        {id: 1, subject: lan.demolition},
        {id: 2, subject: lan.travel},
        {id: 3, subject: lan.non_capitalizable},
        {id: 4, subject: lan.other_expence}
        ]
    });


   var questionBlock = {
    xtype: 'container',
    margin: '10 0 0 0',
    id: 'questionBlock'+time_id,
    hidden: status_view,
    anchor: '96%',
    layout: 'anchor',
    items: [{
            xtype: 'gridpanel',
            title: lan.details,
            autoScroll: true,
            id: 'details_grid'+time_id,
            store: storeProjectDetails,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            viewConfig: {
                stripeRows: true,
                markDirty:false
            },
            columns: [
                {dataIndex: 'id', hidden: true},
                {text: lan.parameters, dataIndex: 'subject', flex: 1},
                {text: lan.status, editor: comboYESNODetails, dataIndex: 'result', width: 200, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNODetails), this)},
                {text: lan.qty, editor: {xtype: 'numberfield', minValue: 0, allowExponential: false, readOnly: readStatus, mouseWheelEnabled: false}, dataIndex: 'qty', width: 200}
            ]
        },{
            xtype: 'gridpanel',
            title: lan.purpose_project,
            autoScroll: true,
            id: 'purpose_grid'+time_id,
            store: storeProjectPurpose,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            viewConfig: {
                stripeRows: true,
                markDirty:false
            },
            columns: [
                {dataIndex: 'id', hidden: true},
                {text: lan.parameters, dataIndex: 'subject', flex: 1},
                {text: lan.status, editor: comboYESNOCapex, dataIndex: 'result', width: 200, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOCapex), this)}
            ]
        }]
    }
    return questionBlock;
}

function getItemProcessDesignStart(time_id, status_view, readStatus){

var gridOperationProcedures = getProcessOperationsGrid({time_id: time_id, case_type: 'task'});
var questionBlock = getQuestionBlock(time_id, status_view, readStatus);

var storeFilesPDS = new Ext.data.Store({     
        fields: ['name', 'document'],
    });

var DiagramItem = getUploadItem('diagram'+time_id, 'diagram', lan.process_flow_diagram, status_view, storeFilesPDS);
var AnalysisItem = getUploadItem('analysis'+time_id, 'analysis', lan.analysis, status_view, storeFilesPDS);

var filePanelPDS = Ext.create('Ext.panel.Panel', {
    bodyPadding: 5,
    title: lan.files+':',
    anchor:'96%',
    frame: true,
    items: [{
        xtype:'grid',
        hidden: true,
        id: 'hidden_grid_pds_'+time_id,
        store: storeFilesPDS
        },DiagramItem, AnalysisItem]
});

var process_design_start = [{
    xtype: 'container',
    layout: 'anchor',
    items: [{
            xtype:'combobox',
            fieldLabel: lan.ProductLine,
            name: 'ProductLine',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            width:'96%',
            store: data_store_ProductLine,
            displayField: 'value',
            valueField: 'id',
            cls: 'toggle-state',
            readOnly: true
            },
        {
            xtype:'combobox',
            fieldLabel: lan.ProductType,
            name: 'ProductType',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            store: data_store_ProductType,
            displayField: 'value',
            valueField: 'id',
            readOnly: true
        },{
            xtype: 'container',
            anchor:'96%',
            layout: 'hbox',
            margin: '0 0 10 0',
            defaults: {
                 anchor:'96%',
            },
            items:[{
                xtype:'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                flex:2,
                readOnly: true
            },{
            xtype: 'button',
            text: lan.show_bom,
            margin: '0 0 0 10',
            flex:1,
            handler : function() {
                var sku_el = this.up('form').getForm().findField("bbb_sku");
                var bbb_sku_id = sku_el.getValue();
                if(bbb_sku_id){
                    var viewTitle = lan.bbb_sku+": "+sku_el.rawValue;
                    var form_bom = getItemFormBOM({time_id: time_id, bom_id: bbb_sku_id, action: 'view', case_type: 'task'});
                    showObject({id:time_id, title: viewTitle, item: form_bom, sizeX: '90%', sizeY: '90%'});
                }
            }
        }]
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.oe_latest_sku,
            name: 'oe_latest_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly:true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.oe_reman_sku,
            name: 'oe_reman_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly:true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.core_sku,
            name: 'core_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly:true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.Application,
            name: 'Application',
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly:true
        },
        {
            xtype: 'numberfield',
            fieldLabel: lan.annual_demand,
            name: 'Annualdemand',
            minValue: 0,
            allowExponential: false,
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly:true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.SampleLocation,
            name: 'SampleLocation',
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly:true
        },
        {
            xtype: 'panel',
            title: lan.process_flow,
            tools: [{
                xtype: 'button',
                text: lan.draft,
                id: 'process_tool'+time_id,
                disabled: false,
                width: 150,
                handler: function() {
                    var draf_grid = getGridDraftProcess(time_id);
                    showObject({id:time_id, title: lan.draft_process, item: draf_grid, sizeX: '90%', sizeY: '90%'});
                }
            }],
            titlePosition: 2,
            anchor:'96%',
            items:[{
                    xtype: 'textfield',
                    name: 'process_id',
                    id: 'process_id'+time_id,
                    hidden: true
                },{
                    xtype: 'textfield',
                    fieldLabel: lan.identify_cell,
                    name: 'cell_number',
                    margin:'5 0',
                    allowBlank: false,
                    width:'100%',
                    labelWidth: style.input2.labelWidth
                },{
                    xtype: 'textareafield',
                    fieldLabel: lan.description,
                    name: 'description',
                    allowBlank: false,
                    width:'100%',
                    labelWidth: style.input2.labelWidth,
                }]
        },gridOperationProcedures
        ,{
            xtype: 'combobox',
            fieldLabel: lan.capex_req,
            name: 'capex_create',
            typeAhead: true,
            triggerAction: 'all',
            id: 'capex_create'+time_id,
            lazyRender:true,
            store: data_store_YESNO,
            displayField: 'value',
            valueField: 'id',
            value: 0,
            readOnly: true,
            editable:false,
            listeners: {
                change: function(){
                    var val = this.getValue();
                    if(val==1) {
                        Ext.getCmp('questionBlock'+time_id).show();
                    }
                    else {
                        Ext.getCmp('questionBlock'+time_id).hide();
                    }
                }
            }
        }, 
        filePanelPDS, questionBlock]
}];
return process_design_start;
}