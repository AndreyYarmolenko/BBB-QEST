var WindowImage = null;
var WindowViewTables = null;
var bom = [];
/*var storeBOMdescription = new Ext.data.Store({     
        fields: ['id', 'description'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getBOMDescription=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var comboDescription = new Ext.form.ComboBox({
    //id: 'descriptionCell',
    //name: 'description',
    queryMode: 'remote',
    //allowBlank: false,
    typeAhead: true,
    minChars:2,
    triggerAction: 'all',
    lazyRender: true,
    editable: true,
    enableKeyEvents: true,
    labelWidth: style.input2.labelWidth,
    anchor:'96%',
    store: storeBOMdescription,
    displayField: 'description',
    valueField: 'id',
    editable:false,
    });*/

var store_bbb_sku_RE = new Ext.data.Store({
    fields: ['id', 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getBBB_SKU=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

/**************************************************************************************************************************************************/
function getItemReverseEng(time_id, rights){
var comboYESNO = getComboYESNO(false);
var comboYESNO2 = getComboYESNO(false);
var gridBOM = getGridBOM(time_id, lan.bom, false, 'task');
var storeBOM = gridBOM.getStore();

var reverse_eng = [{
                xtype: 'container',
                layout: 'anchor',
                items: [/*{
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },*/{
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
            },
                 /***************************************** BBB SKU# ******************************************************************/
               {
                    xtype:'combobox',
                    fieldLabel: lan.bbb_sku,
                    id: 'bbb_sku_reverse_eng'+time_id,
                    name: 'bbb_sku',
                    //allowBlank: false,
                    typeAhead: true,
                    lazyRender: true,
                    editable: true,
                    //enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_bbb_sku_RE,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true,
                    listeners:{
                        select: function(){
                            var val = Ext.getCmp('bbb_sku_reverse_eng'+time_id).getValue();
                            storeBOM.load({
                                params:{
                                    bbb_sku: val
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'hidden',
                    name: 'bom_id'
                },
                {
                    xtype: 'hidden',
                    name: 'sku_status',
                    id: 'sku_status'+time_id
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.core_sku,
                    name: 'core_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    },
                    {
                    xtype:'textfield',
                    fieldLabel: lan.Application,
                    name: 'Application',
                    allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    },
                    {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        anchor:'90%'
                    },
                    items: [{
                            xtype:'combobox',
                            fieldLabel: lan.SampleCorrectOE,
                            labelAlign: 'top',
                            name: 'SampleCorrectOE',
                            allowBlank: false,
                            editable: false,
                            labelWidth: style.input2.labelWidth,
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            readOnly:true,
                            flex: 1
                        },
                        {
                            xtype: 'splitter'
                        },
                        {
                            xtype:'combobox',
                            fieldLabel: lan.SampleCorrectCore,
                            labelAlign: 'top',
                            name: 'SampleCorrectCore',
                            allowBlank: false,
                            editable: false,
                            labelWidth: style.input2.labelWidth,
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            readOnly:true,
                            flex: 1
                        }]
                        },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    anchor:'90%'
                },
                items: [{
                        xtype:'textareafield',
                        grow:true,
                        name: 'tagNumOE',
                        allowBlank: false,
                        fieldLabel: lan.tagNumOE,
                        labelAlign: 'top',
                        readOnly:true,
                        // width:'96%',
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
                        fieldLabel: lan.tagNumCore,
                        labelAlign: 'top',
                        readOnly:true,
                        flex: 1
                    }]
                        }, gridBOM]
    }];
    return reverse_eng
}

