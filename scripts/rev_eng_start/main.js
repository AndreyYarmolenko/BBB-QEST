var store_product_family = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getFamilyTypes=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows'
            }
        }
    });

var ca_chats_temp = null;
var res_Window = null;

var storePack = new Ext.data.Store({
        fields: ['id_pack', 'customer', 'reference', 'name', 'number'],
         proxy: {
            type: 'ajax',
            url: 'scripts/pack_requirement.php?getPackData=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

function getGridPackRequirement(time_id, status_view=false){
store_potential_customers.load();
var customer = new Ext.form.ComboBox({
    queryMode: 'remote',
    typeAhead: true,
    minChars:2,
    triggerAction: 'all',
    lazyRender: true,
    enableKeyEvents: true,
    store: store_potential_customers,
    displayField: 'value',
    valueField: 'value'
});

var gridPackRequirement  = Ext.create('Ext.grid.Panel', {
        xtype: 'grid',
        title: lan.package_require,
        anchor:'96%',
        layout: 'fit',
        columnLines: true,
        id:'pack_requirement_grid'+time_id,
        minHeight: 160,
        border: false,
        frame: false,
        autoScroll: true,
        store: storePack,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var fields_res = Ext.getCmp('reverse_eng_start'+time_id).up('form').getForm().getFields();
                    var draft = getValueByName(fields_res, 'draft');
                    var assignee = Ext.getCmp('Assignedto_reverse_engineering_start'+time_id).getValue();
                    if(draft==0||id_user!=assignee){
                        status_view = true;
                    }

                    if(status_view) {
                        return false;
                    }
                    }
                }
        })],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                xtype: 'button',
                text: lan.add_new,
                minWidth: 200,
                handler : function() {
                    storePack.add({'name':""});
                }
            }]
        }],  
        columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.customer, editor: customer, sortable: false, dataIndex: 'customer', minWidth: 200, flex:1},
        {text: lan.reference, editor: {xtype: 'textfield'}, sortable: false, dataIndex: 'reference', minWidth: 200, flex:1},
        {text: lan.packaging_id, dataIndex: 'number', sortable: true, hideable: false, width: 130},
        {dataIndex: 'id_pack', sortable: true, hidden: true},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, minWidth: 200, flex:1},
        {xtype:'actioncolumn', width:30, hidden: status_view, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storePack.remove(rec);
                                    Ext.getCmp('pack_requirement_grid'+time_id).getView().refresh();
                                }
                            }]
        }],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
               if(cellIndex==3||cellIndex==5){
                    var fields_res = Ext.getCmp('reverse_eng_start'+time_id).up('form').getForm().getFields();
                    var draft = getValueByName(fields_res, 'draft');
                    var assignee = Ext.getCmp('Assignedto_reverse_engineering_start'+time_id).getValue();
                    if(draft==0||id_user!=assignee){
                        status_view = true;
                    }

                    if(status_view){
                        if(record.get('id_pack')&&record.get('id_pack')!=""){
                            showPackRequirement(time_id, record.get('id_pack'), 'view', is_res=false);
                        }
                    }
                    else{
                        var grid = addGridPackRequirement(time_id, all_rights['pack_requirement'], add_btn=true, view = false);
                        inData = {title: lan.package_require, sizeX: '90%', sizeY: '90%', item: grid};
                        showObject(inData);
                    }
                }
            }
        }
    });
    return gridPackRequirement;
}



function getReverseEngStartItem(time_id) {
    var view = false;
    store_product_family.load();
    var gridPackRequirement =getGridPackRequirement(time_id);

    var analysis_panel = getAnalysisPanel(time_id+'main_form', sizeX=700);
    var reverse_engineering_start = [{
        xtype: 'container',
        layout: 'anchor',
        id: 'reverse_eng_start'+time_id,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: lan.ProductLine,
                name: 'ProductLine',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                width: '96%',
                store: data_store_ProductLine,
                displayField: 'value',
                valueField: 'id',
                cls: 'toggle-state',
                readOnly: true
            },
            {
                xtype: 'combobox',
                fieldLabel: lan.ProductType,
                name: 'ProductType',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                store: data_store_ProductType,
                displayField: 'value',
                valueField: 'id',
                readOnly: true
            },
            {
                xtype: 'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'textfield',
                fieldLabel: lan.oe_latest_sku,
                name: 'oe_latest_sku',
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'textfield',
                fieldLabel: lan.oe_reman_sku,
                name: 'oe_reman_sku',
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'textfield',
                fieldLabel: lan.core_sku,
                name: 'core_sku',
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'textfield',
                fieldLabel: lan.Application,
                name: 'Application',
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'numberfield',
                fieldLabel: lan.Annualdemand,
                name: 'Annualdemand',
                minValue: 0,
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                readOnly: true
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                anchor:'96%',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: lan.SampleTypeQuantities,
                        margin: '12 0 0 0',
                        labelWidth: style.input2.labelWidth,
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: 'OE',
                        name: 'SampleCorrectOE',
                        labelAlign: 'top',
                        allowBlank: false,
                        flex: 1
                    },
                    {
                        xtype: 'splitter'
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: 'Core',
                        labelAlign: 'top',
                        name: 'SampleCorrectCore',
                        allowBlank: false,
                        flex: 1
                    }]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                anchor:'96%',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: lan.tag_numb_of_samp,
                        labelWidth: style.input2.labelWidth,
                    },
                    {
                        xtype:'textareafield',
                        grow:true,
                        name: 'tagNumOE',
                        allowBlank: false,
                        flex: 1
                    },
                    {
                        xtype: 'splitter'
                    },
                    {
                        xtype:'textareafield',
                        grow:true,
                        name: 'tagNumCore',
                        allowBlank: false,
                        flex: 1
                    }]
            },
            {
                xtype: 'combobox',
                id: 'ProductFamily'+time_id,
                name: 'ProductFamily',
                fieldLabel: lan.product_family,
                labelWidth: style.input2.labelWidth,
                anchor: '96%',
                store: store_product_family,
                displayField: 'value',
                valueField: 'id',
                editable: false,
                listeners:{
                    click: {
                        element: 'el',
                        fn: function(){
                            var fields_res = Ext.getCmp('ProductFamily'+time_id).up('form').getForm().getFields();
                            var request_id = getValueByName(fields_res, 'RequestID');
                            var  value = Ext.getCmp('ProductFamily'+time_id).getValue();
                            if (value&&value!="") {
                                if (Ext.getCmp('ProductFamily'+time_id).canContinue) {
                                    Ext.Ajax.request({
                                        url: 'scripts/rev_eng_start/saveformref.php?clearRESTables=true',
                                        method: 'POST',
                                        params: {request_id: request_id, family_id: value},
                                        success: function (response){
                                            Ext.getCmp('scrap_chart'+time_id+'main_form').getStore().removeAll();
                                            Ext.getCmp("scrap_table_" + time_id+'main_form').getStore().removeAll();
                                            Ext.getCmp("sample_table_" + time_id+'main_form').getStore().removeAll();
                                            Ext.getCmp('UploadForm'+time_id+'main_form'+'total').getStore().removeAll();
                                        },
                                        failure: function (response){
                                             Ext.MessageBox.alert(lan.error, response.responseText);
                                        }
                                    });
                                    Ext.getCmp('ProductFamily'+time_id).canContinue = false;
                                    return true;
                                } else {
                                    Ext.Msg.confirm(lan.attention+"'", lan.warning_product_family,
                                        function(buttonId) {
                                            if (buttonId === 'yes') {
                                                Ext.getCmp('ProductFamily'+time_id).canContinue = true;
                                            } else {
                                                Ext.getCmp('ProductFamily'+time_id).canContinue = false;
                                            }
                                        },
                                        Ext.getCmp('ProductFamily'+time_id)
                                    );
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    select:function () {
                        Ext.getCmp('button_PhysAttrTable'+time_id).setDisabled(false);
                        Ext.getCmp('button_dtwCoreAnalysis'+time_id).setDisabled(false);
                    }
                }
            },
            {
                xtype: 'textareafield',
                name: 'PartMarking',
                fieldLabel: lan.part_marking,
                labelWidth: style.input2.labelWidth,
                anchor: '96%'
            },
             gridPackRequirement,
            {   
                xtype: 'panel',
                anchor: style.input2.anchor,
                title: lan.dissasamble_unit,
                layout: {
                    type: 'vbox',
                    align: 'middle'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        value: lan.capture_images
                    }
                ]
            },
            {
                xtype: 'container',
                anchor: style.input2.anchor,
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'button',
                        text: lan.physic_attr,
                        id: 'button_PhysAttrTable'+time_id,
                        disabled: true,
                        flex:1,
                        handler: function () {
                            var fields_res = this.up('form').getForm().getFields();
                            var draft = getValueByName(fields_res, 'draft');
                            var request_id = getValueByName(fields_res, 'RequestID');
                            var family_id = Ext.getCmp('ProductFamily'+time_id).getValue();
                            var assignee = Ext.getCmp('Assignedto_reverse_engineering_start'+time_id).getValue();
                            if(draft==0||id_user!=assignee){
                                view = true;
                            }
                            showPhysAttributeTable(time_id, family_id, request_id, view);
                        }
                    },{
                        xtype: 'splitter'
                    },
                    {
                        xtype: 'button',
                        text: lan.table_core_analysis,
                        id: 'button_dtwCoreAnalysis'+time_id,
                        disabled: true,
                        flex:1,
                        handler: function () {
                            var family_id = Ext.getCmp('ProductFamily'+time_id).getValue();
                            var fields_res = this.up('form').getForm().getFields();
                            var draft = getValueByName(fields_res, 'draft');
                            var request_id = getValueByName(fields_res, 'RequestID');
                            var assignee = Ext.getCmp('Assignedto_reverse_engineering_start'+time_id).getValue();
                            if(draft==0||id_user!=assignee){
                                view = true;
                            }
                            showCoreAnalysisTable(time_id, family_id, request_id, view);
                        }
                    }
                ]
            },{
                xtype: 'container',
                anchor: '96%',
                margin:'15 0 0 0',
                items: analysis_panel
            } 
        ]

    }];
    return reverse_engineering_start;
}
