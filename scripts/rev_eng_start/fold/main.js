/**
 * Created by User on 04.10.2016.
 */
var store_product_family = new Ext.data.Store({
    model: 'data_model_users',
    data: [
        { value: "Manual Steering Gear", id: 1},
        { value: "Power Steering Gear", id: 2},
        { value: "Manual Rack and Pinion", id: 3},
        { value: "Power Rack and Pinion", id: 4},
        { value: "Power Steering Pump with Reservoir", id: 5},
        { value: "Power Steering Pump with out Reservoir", id: 6}
    ]
});

var ca_chats_temp = null;

var reverse_engineering_start = [{
    xtype: 'container',
    layout: 'anchor',
    id: 'reverse_eng_start',
    items: [

        {
            xtype: 'hidden',
            id: 'attr_flag',
            name: 'attr_flag',
            value: false
        },
        {
            xtype: 'hidden',
            id: 'pr_flag',
            name: 'pr_flag',
            value: false
        },
        {
            xtype: 'hidden',
            id: 'ce_flag',
            name: 'ce_flag',
            value: false
        },


        {
            xtype: 'combobox',
            fieldLabel: formLang.ProductLine,
            name: 'ProductLine',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            width: '96%',
            store: data_store_ProductLine,
            displayField: 'value',
            valueField: 'id',
            cls: 'toggle-state',
            readOnly: true,
            listeners:{
                change: function () {
                    var req = Ext.select('*[name=RequestID').elements[0].value;
                    var charts = Ext.getCmp('reverse_eng_start');
                    var flag = Ext.getCmp('ce_flag').getRawValue();

                    if(flag == true){
                        charts.add(get_ca_sample_pump(req, false));
                    }
                }
            }
        },
        {
            xtype: 'combobox',
            fieldLabel: formLang.ProductType,
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
            fieldLabel: formLang.bbb_sku,
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
            fieldLabel: 'OE Latest SKU #',
            name: 'oe_latest_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'OE Reman SKU #',
            name: 'oe_reman_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Core SKU #',
            name: 'core_sku',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Application',
            name: 'Application',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            readOnly: true
        },
        {
            xtype: 'numberfield',
            fieldLabel: 'Mature Annual Demand',
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
                    fieldLabel: 'Sample Type quantities',
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
                    fieldLabel: 'Tag numbers of samples',
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
            id: 'ProductFamily',
            name: 'ProductFamily',
            fieldLabel: 'Product Family',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            store: store_product_family,
            displayField: 'value',
            valueField: 'value',
            editable: false,
            listeners:{
                'change':function (val1,val2,val3) {
                    Ext.getCmp('button_PhysAttrTable').setDisabled(false);
                    Ext.getCmp('button_PackReq').setDisabled(false);
                    Ext.getCmp('button_dtwCoreAnalysis').setDisabled(false);
                }
            }
        },
        {
            xtype: 'textareafield',
            name: 'PartMarking',
            fieldLabel: 'Part Marking',
            labelWidth: style.input2.labelWidth,
            anchor: '96%'
        },
        {
            xtype: 'panel',
            anchor: style.input2.anchor,
            title: 'Dissasamble Unit',
            layout: {
                type: 'vbox',
                align: 'middle'
            },
            items: [
                {
                    xtype: 'displayfield',
                    value: 'Capture images of all components',
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
                    text: 'Physical Attribute Table',
                    id: 'button_PhysAttrTable',
                    disabled: true,
                    handler: function () {
                        var request_id = Ext.select('*[name=RequestID').elements[0].value;
                        var value = Ext.getCmp('ProductFamily').getValue();
                        var table = getAttr_table(value, request_id);
                        res_show_window(value, table);
                    }
                },
                {
                    xtype: 'button',
                    text: 'Packaging Requirements',
                    id: 'button_PackReq',
                    disabled: true,
                    margin: '0 10px',
                    handler: function () {
                        console.log(Ext.select('*[name=RequestID'));
                        var request_id = Ext.select('*[name=RequestID').elements[0].value;
                        var form = get_pr_spi("spi", request_id);
                        res_show_window(this.text, form);
                    }
                },
                {
                    xtype: 'button',
                    text: 'Detailed table with core analysis',
                    id: 'button_dtwCoreAnalysis',
                    disabled: true,
                    handler: function () {
                        var request_id = Ext.select('*[name=RequestID').elements[0].value;
                        var table = get_ca_sample_pump(request_id);
                        res_show_window(this.text, table);
                    }
                }
            ] // items
        }, // container
    ],

}]; // Reverse Eng Start

var res_Window = null;

function res_show_window(title, table) {
        res_Window = new Ext.window.Window({
            title: title,
            width: '95%',
            height: '90%',
            layout: 'fit',
            minWidth: '600px',
            scrollable: true,
            resizable: true,
            closable: true,
            modal: true,
            listeners: {
                beforedestroy: function () {
                    var obj = reverse_engineering_start[0];
                    rowEditing.completeEdit();
                }
            },
            buttons: [
                {
                    text: 'Save',
                    id: 'save',
                    handler:function () {
                        if(table.save()){
                            res_Window.destroy();
                        }
                    },
                    listeners:{
                        afterrender: function () {
                            var resp = Ext.ComponentQuery.query('[name=NewDueDate]')[0];
                            this.disabled = resp.readOnly;  // Ну как то так
                        }
                    }
                }
            ],
            items: table
        }).show();
}