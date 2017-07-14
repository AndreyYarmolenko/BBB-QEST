var red = '<b style="color:red;">*</b>';
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

function ce_multiplic($field1, $field2, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    if($value1 !== null && $value2 !== null){
        var res = parseFloat($value1) * parseFloat($value2);
        res = res.toFixed(2);
        Ext.getCmp($field_result).setValue(res);
    }
}
function ce_multiplic_value($value1, $value2, $field_result) {
    if($value1 !== null && $value2 !== null){
        var res = parseFloat($value1) * parseFloat($value2);
        res = res.toFixed(2);
        Ext.getCmp($field_result).setValue(res);
    }
}
function ce_ta_result($field1, $field2, $field3, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;
    if($value1 !== null && $value2 !== null && $value3 !== null){
        var res = parseFloat($value1) / parseFloat($value2) / parseFloat($value3);
        res = res.toFixed(2);
        Ext.getCmp($field_result).setValue(res);
    }
}
function ce_sum_result($field1, $field2, $field3, $field4, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;
    var $value4 = Ext.getCmp($field4).value;

    if($value1 !== null && $value2 !== null && $value3 !== null && $value4 !== null){
        var res = parseFloat($value1) + parseFloat($value2) + parseFloat($value3) + parseFloat($value4);
        res = res.toFixed(2);
        Ext.getCmp($field_result).setValue(res);
    }
}

function gross_profit_per_unit($field1, $field2, $field3, $field4, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;
    var $value4 = Ext.getCmp($field4).value;
    if($value1 !== null && $value2 !== null && $value3 !== null &&  $value4 !== null){
        var res = parseFloat($value1) + parseFloat($value2) - parseFloat($value3) - parseFloat($value4);
        res = +res.toFixed(5);
        Ext.getCmp($field_result).setValue(res);
    }

}

function annualized_investment_amortization($field1, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    if($value1 !== null){
        var res = parseFloat($value1)/5;
         res = +res.toFixed(5);
        Ext.getCmp($field_result).setValue(res);
    }
}

function first_year_gross_profit($field1, $field2, $field3, $field4, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;
    var $value4 = Ext.getCmp($field4).value;
    if($value1 !== null && $value2 !== null && $value3 !== null &&  $value4 !== null){
        var res = parseFloat($value1) * (parseFloat($value2) + parseFloat($value3)) - parseFloat($value4);
         res = +res.toFixed(5);
        Ext.getCmp($field_result).setValue(res);
    }

}

function year_five_gross_profit($field1, $field2, $field3, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;
    if($value1 !== null && $value2 !== null && $value3 !== null){
        var res = parseFloat($value1) * parseFloat($value2) - parseFloat($value3);
         res = +res.toFixed(5);
        Ext.getCmp($field_result).setValue(res);
    }

}

function preliminary_roi($field1, $field2, $field3, $field_result) {
    var $value1 = Ext.getCmp($field1).value;
    var $value2 = Ext.getCmp($field2).value;
    var $value3 = Ext.getCmp($field3).value;

    if($value1 !== null && $value2 !== null && $value3 !== null){
        var res = (parseFloat($value1) + parseFloat($value2)) / 2*5 / parseFloat($value3);
         res = +res.toFixed(5);
        Ext.getCmp($field_result).setValue(res);
    }

}

/*var SampleProcureStore = new Ext.data.Store({     
        fields: ['ETA for Samples', 'OE(original equipment)', 'Core'],
		data: [
			{'id':'1','name':'ETA for Samples'},
			{'id':'2','name':'Recipient name'},
			{'id':'3','name':'Ship to location'},
			{'id':'4','name':'Address'},
			{'id':'5','name':'Supplier'},
			{'id':'6','name':'PO #'},
			{'id':'7','name':'CC Order #'},
			{'id':'8','name':'Tracking #'},
		]
		
    });

	var gridSampleProcure = Ext.create('Ext.grid.Panel', {
        store: SampleProcureStore,
		border:false,
		columns: [
			{ text: 'ETA for Samples', dataIndex: 'name' },
			{ text: 'OE(original equipment)'},
			{ text: 'Core'}
		]
	});*/
	
	var CostEstimatedStore = new Ext.data.Store({     
        fields: ['ETA for Samples', 'OE(original equipment)', 'Core'],
		data: [
			{'id':'1','name':'Estimated Material Cost', 'usd1':'', 'time': 'US$', 'num':'', 'number':'number','usd2':'US Dollars'},
			{'id':'2','name':'', 'usd1':'', 'time': 'Hours Per Unit', 'num':'', 'number':'HPU','usd2':''},
			{'id':'3','name':'', 'usd1':'', 'time': 'Hourly Loaded Rate', 'num':'', 'number':'US Dollars','usd2':''},
			{'id':'4','name':'Loaded Cost', 'usd1':'', 'time': '', 'num':'', 'number':'','usd2':''},
			{'id':'5','name':'Mark Up Cost', 'usd1':'', 'time': 'Markup %', 'num':'', 'number':'','usd2':''},
			{'id':'6','name':'Tooling Amortization', 'usd1':'', 'time': 'Years', 'num':'', 'number':'','usd2':''},
			{'id':'7','name':'Cost Estimate per unit', 'usd1':'', 'time': '', 'num':'', 'number':'','usd2':''},
			{'id':'8','name':'Estimated Total Investment', 'usd1':'', 'time': '', 'num':'', 'number':'','usd2':''},
		]
		
    });

    var storeProjectElements = new Ext.data.Store({
        fields: ['row_id', 'el_id', 'el_type', 'description', 'life_time', 'name', 'number', 'qty', {name: 'total_price', type: 'int'}, 'year', 'quarter', 'op_number'],
         proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getProjectElements=true&capex=1',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var storeProcurementList = new Ext.data.Store({
        fields: ['row_id', 'el_id', 'el_type', 'description', 'name', 'number', 'qty', {name: 'total_price', type: 'int'},{name: 'received', type: 'int'}, 'op_number' ],
         proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getProjectElements=true&capex=1',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var storePurchasingList = new Ext.data.Store({
        fields: ['row_id', 'el_id', 'el_type', 'description', 'name', 'number', 'qty', {name: 'total_price', type: 'int'},{name: 'received', type: 'int'}, 'op_number'],
         proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getProjectElements=true&capex=0',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var storeImplementationList = new Ext.data.Store({
        fields: ['row_id', 'el_id', 'el_type', 'description', 'name', 'number', 'qty', {name: 'total_price', type: 'int'},{name: 'received', type: 'int'},{name: 'implemented', type: 'int'}, 'op_number'],
         proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getProjectElements=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

	var gridCostEstimate = Ext.create('Ext.grid.Panel', {
        store: CostEstimatedStore,
		border:false,
		columns: [
			{ text: lan.costs, dataIndex: 'name', width: 200},
			{ text: lan.us, dataIndex: 'usd1', width: 70},
			{ text: lan.time, dataIndex: 'time', width: 100},
			{ text: '', dataIndex: '', width: 100},
			{ text: '', dataIndex: 'num', width: 100},
			{ text: lan.number, dataIndex: 'number', width: 100},
			{ text: lan.us_dollars, dataIndex: 'usd2', width: 150}
		]
	});

var comboYESNO = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    store: data_store_YESNO,
    displayField: 'value',
    valueField: 'id',
    value :'1',
    editable:false,
});


var storeEquipType= new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:'Tool'},{id:2,value:'Gage'},{id:3,value:'Equipment'},{id:4,value:'Workstation'}]
});

var storeMonth= new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:'January'},{id:2,value:'February'},{id:3,value:'March'},{id:4,value:'April'},{id:5,value:'May'},{id:6,value:'June'},{id:7,value:'July'},{id:8,value:'August'},{id:9,value:'September'},{id:10,value:'October'},{id:11,value:'November'},{id:12,value:'December'}]
});

var storeQuarters= new Ext.data.Store({
    fields: ['id','value'],
    data: [{id:'1',value:'I'},{id:'2',value:'II'},{id:'3',value:'III'},{id:'4',value:'IV'}]
});

var storeApproveDecline= new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:'Approve'},{id:2,value:'Decline'}]
});

var storeCostCenter= new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:'Steering'},{id:2,value:'Calipers'},{id:3,value:'ROEL'}]
});

var epsFinalStore = Ext.create("Ext.data.Store", {
    fields: ['id', 'descr_spec', 'add_spec']
});

var epsDiagnosticStore = Ext.create("Ext.data.Store", {
    fields: ['id', 'descr_spec', 'add_spec']
});

function getNewEngReqItem(time_id){
    data_store_ProductLine.removeAll();
    var CustomersStoreNer = getCustomersStore(time_id);
    var new_engineering_req = [{
                xtype: 'container',
                layout: 'anchor',
                items: [
                {
                    xtype:'textfield',
                    fieldLabel: lan.ERPOrderID,
                    name: 'ERPOrderID',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.ProductType,
                    name: 'ProductType',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    store: data_store_ProductType,
                    displayField: 'value',
                    valueField: 'id',
                    cls: 'toggle-state',
                    editable: false
                },
                {
                    xtype:'textfield',
                   fieldLabel: lan.Application,
                    name: 'Application',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                },  
/***************************************** POTENTIAL CUSTOMERS ******************************************************************/
                {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.PotentialCustomers,
                    id: 'PotentialCustomers_ner'+time_id,
                    queryMode: 'remote',
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_potential_customers,
                    displayField: 'value',
                    valueField: 'id',
                    flex: 3
                },{
                    xtype: 'button',
                    text : lan.add,
                    id: 'new_engineering_req_add_cust'+time_id,
                    cls:'disable',
                    margin: '5 0 5 10',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('PotentialCustomers_ner'+time_id).rawValue;
                        var isExist = false;
                        CustomersStoreNer.each(function(record){
                            if(record.get('name')==name){
                                isExist = true;
                            }
                        });
                        if (name.trim() != ''&&!isExist) {
                            Ext.getCmp('PotentialCustomers_ner'+time_id).setValue();
                            CustomersStoreNer.add({name: name});
                            Ext.getCmp('Customers_ner'+time_id).show();
                            Ext.Ajax.request({
                            url: 'scripts/store.php?setPotentialCustomers=true',
                            method: 'POST',
                            params: {
                                name: name
                                },
                            success: function (response){
                                //var data = Ext.decode(response.responseText);
                               // Ext.MessageBox.alert("", data.message);
                            },
                            failure: function (response){ 
                                Ext.MessageBox.alert('Error', response.responseText);
                            }
                        });
                        }
                        else {
                            Ext.MessageBox.alert(lan.error, lan.can_not_dublic_custom);
                        }
                    }
                }/*,
                {
                    xtype: 'button',
                    text : lan.new,
                    margin: '5 0 15 10',
                    id: 'new_engineering_req_new_cust'+time_id,
                    cls:'disable',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('PotentialCustomers_ner'+time_id).rawValue;
                        if (name != '') {
                           Ext.Ajax.request({
                            url: 'scripts/store.php?setPotentialCustomers=true',
                            method: 'POST',
                            params: {
                                name: name
                                },
                            success: function (response){
                                var data = Ext.decode(response.responseText);
                                Ext.MessageBox.alert("", data.message);
                            },
                            failure: function (response){ 
                                Ext.MessageBox.alert('Error', response.responseText);
                            }
                        });
                       }
                    }
                }*/]

                },{
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'displayfield',
                    name:"",
                    flex: 1
                },
                {
                xtype: 'grid',
                name:'Customers',
                id:'Customers_ner'+time_id,
                border: true,
                hidden:true,
                store: CustomersStoreNer,
                flex: 2,
                margin: '0 0 10 0',
                columns: [{
                           xtype:'rownumberer'
                          },
                            {
                            text: lan.Customers, 
                            dataIndex: 'name',
                            width: '70%',
                            sortable: false
                            }, 
                            {
                        xtype:'actioncolumn',
                        dataIndex: 'set_hidden',
                        width:20,
                        //id:'customer_del_ner'+time_id,
                        items:[{
                                iconCls:'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    CustomersStoreNer.remove(rec);
                                    if(CustomersStoreNer.data.length == 0) {
                                        Ext.getCmp('Customers_ner'+time_id).hide();
                                    }
                                }
                            }]
                    }],
                },
               ]
                },
/***********************************************************************************************************************************************/
                {
                    xtype:'numberfield',
                    fieldLabel: lan.Annualdemand,
                    name: 'Annualdemand',
                    minValue: 0, 
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    allowExponential: false,
                    mouseWheelEnabled: false,
                },
                  {
                    xtype:'textfield',
                    fieldLabel: lan.ReasonforRequest,
                    name: 'ReasonforRequest',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.ExistingProductline,
                    name: 'ExistingProductline',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    cls: 'toggle-state',
                    editable: false,
                    listeners:{
                        change: function(){
                             var val = this.getValue();
                             if (val==1){
                                Ext.getCmp('WhatProductLine'+time_id).enable();
                            }else{
                                Ext.getCmp('WhatProductLine'+time_id).setValue();
                                Ext.getCmp('WhatProductLine'+time_id).disable();        
                            }
                        }
                    }
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.WhatProductLine,
                    name: 'WhatProductLine',
                    id:'WhatProductLine'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    store: data_store_ProductLine,
                    displayField: 'value',
                    valueField: 'id',
                    editable: false
                }]
            }];
    return new_engineering_req;
}


function getNewProductLineItem(time_id){
    var new_product_line = [{
            xtype: 'container',
            layout: 'anchor',
            items: [
            {
                xtype:'textfield',
                fieldLabel: lan.ERPOrderID,
                name: 'ERPOrderID',
                allowBlank: true,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
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
                hidden:false,
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.Application,
                name: 'Application',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.PotentialCustomers,
                name: 'PotentialCustomers',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                readOnly: true
            },
            {
                xtype:'numberfield',
                fieldLabel: lan.Annualdemand,
                name: 'Annualdemand',
                minValue: 0,
                allowExponential: false,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.ReasonforRequest,
                name: 'ReasonforRequest',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                readOnly: true
            },
            {
                xtype:'combobox',
                fieldLabel: lan.ExistingProductline,
                name: 'ExistingProductline',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                store: data_store_YESNO,
                displayField: 'value',
                valueField: 'id',
                hidden:false,
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.Newproductlinename,
                name: 'Newproductlinename',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                vtype: 'nameValid'
}]
}];
    return new_product_line;
}

function getSampleProcurementItem(time_id){
    var sample_procurement = [{
            xtype: 'container',
            layout: 'anchor',
            items: [
            {
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
            {
                xtype:'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                flex: 1,
                anchor:'96%',
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.oe_latest_sku,
                name: 'oe_latest_sku',
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.oe_reman_sku,
                name: 'oe_reman_sku',
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: true
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.core_sku,
                    name: 'core_sku',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
            {
                xtype:'textfield',
                fieldLabel:lan.Application,
                name: 'Application',
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                hidden:false,
                readOnly: true
                },
                {
                xtype:'numberfield',
                fieldLabel: lan.Annualdemand,
                name: 'Annualdemand',
                minValue: 0,
                allowExponential: false,
                labelWidth: style.input2.labelWidth,
                width:'96%',
                cls: 'toggle-state',
                readOnly: true
                },
                 {
                    xtype: 'panel',
                    title: lan.samples,
                    layout: 'anchor',
                    anchor:'96%',
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '96%',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: lan.stq,
                                    margin: '12 0 0 0',
                                    labelWidth: style.input2.labelWidth,
                                },
                                {
                                    xtype:'numberfield',
                                    fieldLabel: lan.oe,
                                    name: 'stqOE',
                                    labelAlign: 'top',
                                    minValue: 0,
                                    allowExponential: false,
                                    mouseWheelEnabled: false,
                                    allowBlank: false,
                                    flex: 1
                                },
                                {
                                    xtype: 'splitter'
                                },
                                {
                                    xtype:'numberfield',
                                    fieldLabel: lan.core,
                                    labelAlign: 'top',
                                    minValue: 0,
                                    allowExponential: false,
                                    mouseWheelEnabled: false,
                                    name: 'stqCore',
                                    allowBlank: false,
                                    flex: 1
                                }]
                        },


                    ]
                },
                {
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    altFormats: 'Y-m-d',
                    fieldLabel: lan.ETAforSamples,
                    name: 'ETAforSamples',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.RecipientName,
                    name: 'RecipientName',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'combo',
                    fieldLabel: lan.ShipToLocation,
                    name: 'ShipToLocation',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_bb_location_name,
                    displayField: 'value',
                    valueField: 'value',
                    typeAhead: true,
                    minChars:1,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: false,
                    enableKeyEvents: true,
                    forceSelection: true,
                    listeners:{
                        select:function(combo, record, eOpts){
                            var address = record.data.address;
                            Ext.getCmp('address_sp'+time_id).setValue(address);
                        }
                    }
                    
                },
                {
                    xtype:'textareafield',
                    fieldLabel: lan.address,
                    id:"address_sp"+time_id,
                    name: 'Address',
                    labelWidth: style.input2.labelWidth,
                    readOnly: true,
                    anchor:'96%',
                },{
                    xtype:'combobox',
                    fieldLabel: lan.Supplier,
                    name: 'Supplier',
                    id:'supplier'+time_id,
                    queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    store: data_store_Supplier,
                    displayField: 'value',
                    valueField: 'value',
                    anchor:'96%'
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.po,
                    name: 'po',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.CC_Order,
                    name: 'CCOrder',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.Tracking,
                    name: 'Tracking',
                    labelWidth: style.input2.labelWidth,
                    allowBlank: false,
                    anchor:'96%',
                },
                {
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    altFormats: 'Y-m-d',
                    fieldLabel: lan.ActualDate,
                    name: 'ActualDate',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                },
                {
                    xtype:'textareafield',
                    fieldLabel: lan.SampleLocation,
                    name: 'SampleLocation',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    grow:true
                }

    ]
}];
    return sample_procurement;
}

function getFeasibilityProductEngItem(time_id){
        var feasibility_product_eng = [{
                xtype: 'container',
                layout: 'anchor',
                items: [
                    {
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
                   {
                    xtype:'combobox',
                    fieldLabel: lan.bbb_sku,
                    name: 'bbb_sku',
                    allowBlank: false,
                    typeAhead: true,
                    labelWidth: style.input2.labelWidth,
                    store: store_bbb_sku,
                    displayField: 'value',
                    valueField: 'id',
                    anchor:'96%',
                    readOnly: true
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
                },
                 {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
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
                    fieldLabel: lan.Application,
                    name: 'Application',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //anchor:'96%',
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.SampleLocation,
                    name: 'SampleLocation',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.Annualdemand,
                    name: 'Annualdemand',
                    minValue: 0,
                    allowExponential: false, 
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype: 'panel',
                    title: lan.ProductEngineering,
                    layout: 'anchor',
                    anchor:'96%',
                    items:[{
                            xtype:'combobox',
                            fieldLabel: lan.ValidationCapability,
                            name: 'ValidationCapability',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            anchor:'96%',
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            editable: false
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            labelWidth: style.input2.labelWidth,
                            name: 'notes1',
                            fieldLabel: lan.notes,
                            anchor:'100%',
                        },
                        {
                            xtype:'combobox',
                            fieldLabel: lan.RFEngineeringCapability,
                            name: 'RFEngineeringCapability',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            anchor:'96%',
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            editable: false
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            labelWidth: style.input2.labelWidth,
                            name: 'notes2',
                            fieldLabel: lan.notes,
                            anchor:'100%',
                        }],
                    
                }]
}];
    return feasibility_product_eng;
}

function getFeasibilityProcessEngItem(time_id){
    var feasibility_process_eng = [{
                xtype: 'container',
                layout: 'anchor',
                items: [
                 {
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
                    {
                    xtype:'combobox',
                    fieldLabel: lan.bbb_sku,
                    name: 'bbb_sku',
                    allowBlank: false,
                    typeAhead: true,
                    labelWidth: style.input2.labelWidth,
                    store: store_bbb_sku,
                    displayField: 'value',
                    valueField: 'id',
                    anchor:'96%',
                    readOnly: true
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
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
                    fieldLabel: lan.Application,
                    name: 'Application',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.SampleLocation,
                    name: 'SampleLocation',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.Annualdemand,
                    name: 'Annualdemand',
                    minValue: 0,
                    allowExponential: false, 
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    cls: 'toggle-state',
                    readOnly:true,
                },
                {
                    xtype: 'panel',
                    title: lan.ProcessEngineering,
                    id: 'panel'+time_id,
                    layout: 'anchor',
                    anchor:'96%',
                    items:[{
                            xtype:'combobox',
                            fieldLabel: lan.ManufacturingCapability,
                            name: 'ManufacturingCapability',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            anchor:'96%',
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            editable: false
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            labelWidth: style.input2.labelWidth,
                            name: 'notes1',
                            fieldLabel: lan.notes,
                            anchor:'100%',
                        },
                        {
                            xtype:'combobox',
                            fieldLabel: lan.CFSpaceCapability,
                            name: 'CFSpaceCapability',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            anchor:'96%',
                            store: data_store_YESNO,
                            displayField: 'value',
                            valueField: 'id',
                            editable: false
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            labelWidth: style.input2.labelWidth,
                            name: 'notes2',
                            fieldLabel: lan.notes,
                            anchor:'100%',
                        }],
                    
                }]
}];
    return feasibility_process_eng;
}

function getCostEstimateItem(time_id){
    var cost_estimate = [{
    xtype: 'container',
    layout: 'anchor',
    items: [
        {
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.oe_latest_sku,
            name: 'oe_latest_sku',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.oe_reman_sku,
            name: 'oe_reman_sku',
            //allowBlank: false,
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.core_sku,
            name: 'core_sku',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.Application,
            name: 'Application',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            cls: 'toggle-state',
            readOnly: true
        },
        {
            xtype: 'numberfield',
            fieldLabel: lan.Annualdemand,
            name: 'Annualdemand',
            id: 'Annualdemand'+time_id,
            minValue: 0,
            allowExponential: false,
            mouseWheelEnabled: false,
            labelWidth: style.input2.labelWidth,
            allowBlank: false,
            width: '96%',
            cls: 'toggle-state',
            listeners: {
                change: function () {
                    ce_ta_result('EstimatedTotal'+time_id, 'Years'+time_id, 'Annualdemand'+time_id, 'ToolingAmortization'+time_id);
                }
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: lan.min_order_qty,
            name: 'min_order_qty',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            hidden: false,
            readOnly: true
        },
        {
            xtype: 'fieldset',
            title: lan.calculating,
            defaultType: 'textfield',
            layout: 'anchor',
            anchor: '96%',
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: lan.EstimatedMaterial,
                    name: 'EstimatedMaterial',
                    id: 'EstimatedMaterial'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    hidden: false,
                    listeners: {
                        change: function () {
                            var val1 = Ext.getCmp('EstimatedMaterial'+time_id).value;
                            var val2 = Ext.getCmp('Markup'+time_id).value * 0.01;
                            ce_multiplic_value(val1, val2, 'MarkUpCost'+time_id);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: lan.HoursPerUnit,
                    name: 'HoursPerUnit',
                    id: 'HoursPerUnit'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    hidden: false,
                    listeners: {
                        change: function () {
                            ce_multiplic('HoursPerUnit'+time_id, 'HourlyLoadedRate'+time_id, 'LoadedCost'+time_id);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: lan.HourlyLoadedRate,
                    name: 'HourlyLoadedRate',
                    id: 'HourlyLoadedRate'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    hidden: false,
                    listeners: {
                        change: function () {
                            ce_multiplic('HoursPerUnit'+time_id, 'HourlyLoadedRate'+time_id, 'LoadedCost'+time_id);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: lan.Markup,
                    name: 'Markup',
                    id: 'Markup'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    hidden: false,
                    listeners: {
                        change: function () {
                            var val1 = Ext.getCmp('EstimatedMaterial'+time_id).value;
                            var val2 = Ext.getCmp('Markup'+time_id).value * 0.01;
                            ce_multiplic_value(val1, val2, 'MarkUpCost'+time_id);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: lan.Years,
                    name: 'Years',
                    id: 'Years'+time_id,
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    hidden: false
                },

                // Поля для подсчёта
                {
                    xtype: 'textfield',
                    fieldLabel: lan.LoadedCost,
                    name: 'LoadedCost',
                    id: 'LoadedCost'+time_id,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    hidden: false,
                    readOnly: true,
                    value: 0,
                    listeners: {
                        change: function () {
                            ce_sum_result('ToolingAmortization'+time_id, 'MarkUpCost'+time_id, 'EstimatedMaterial'+time_id, 'LoadedCost'+time_id, 'CostEstimate'+time_id);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: lan.MarkUpCost,
                    name: 'MarkUpCost',
                    id: 'MarkUpCost'+time_id,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    hidden: false,
                    readOnly: true,
                    value: 0,
                    listeners: {
                        change: function () {
                            ce_sum_result('ToolingAmortization'+time_id, 'MarkUpCost'+time_id, 'EstimatedMaterial'+time_id, 'LoadedCost'+time_id, 'CostEstimate'+time_id);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: lan.ToolingAmortization,
                    name: 'ToolingAmortization',
                    id: 'ToolingAmortization'+time_id,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    hidden: false,
                    readOnly: true,
                    value: 0,
                    listeners: {
                        change: function () {
                            ce_sum_result('ToolingAmortization'+time_id, 'MarkUpCost'+time_id, 'EstimatedMaterial'+time_id, 'LoadedCost'+time_id, 'CostEstimate'+time_id);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: lan.CostEstimate,
                    name: 'CostEstimate',
                    id: 'CostEstimate'+time_id,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    hidden: false,
                    readOnly: true,
                    value: 0
                },
                // <---------

                {
                    xtype: 'numberfield',
                    fieldLabel: lan.EstimatedTotal,
                    name: 'EstimatedTotal',
                    id: 'EstimatedTotal'+time_id,
                    labelWidth: style.input2.labelWidth,
                    anchor: '100%',
                    allowBlank: false,
                    hidden: false,
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    listeners: {
                        change: function () {
                            ce_ta_result('EstimatedTotal'+time_id, 'Years'+time_id, 'Annualdemand'+time_id, 'ToolingAmortization'+time_id);
                        }
                    }

                }
            ] // Calculating
        }
    ] // container
}]; // Cost Estimate
    return cost_estimate;
}

function getPreliminaryROIPMItem(time_id){
    var preliminary_roi_pm = [{
                xtype: 'container',
                layout: 'anchor',
                items: [
                {
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
            {
                xtype:'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                anchor:'96%',
                readOnly: true
            },
                {
                    xtype:'textfield',
                    fieldLabel: lan.core_sku,
                    name: 'core_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.Application,
                    name: 'Application',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.first_year_demand,
                    name: 'first_year_demand',
                    id:'first_year_demand'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.anti_pipe_fill,
                    name: 'anti_pipe_fill',
                    id: 'anti_pipe_fill'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.Annualdemand,
                    name: 'Annualdemand',
                    id:'Annualdemand_roi'+time_id,
                    //minValue: 0,
                    allowExponential: false, 
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //anchor:'96%',
                    width:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.est_exch_price,
                    id:'est_exch_price'+time_id,
                    name: 'est_exch_price',
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.est_core_charge,
                    name: 'est_core_charge',
                    id:'est_core_charge'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                   readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.est_annual_revenue,
                    name: 'est_annual_revenue',
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.finish_goods_target_lev,
                    name: 'finish_goods_target_lev',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.min_order_qty,
                    name: 'min_order_qty',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //minValue: 0,
                    allowExponential: false,
                    anchor:'96%',
                   readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.CostEstimate,
                    name: 'CostEstimatePerUnit',
                    id:'CostEstimatePerUnit'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //minValue: 0,
                    allowExponential: false,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.EstimatedTotal,
                    name: 'EstimatedTotalInvestment',
                    id: 'EstimatedTotalInvestment'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    listeners:{
                        change:function(){
                            annualized_investment_amortization('EstimatedTotalInvestment'+time_id, 'AnnualizedInvestmentAmortization'+time_id);
                        }
                    }
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.core_purchase_cost_unit,
                    name: 'CorePurchaseCostPerUnit',
                    id:'CorePurchaseCostPerUnit'+time_id,
                    allowBlank: false,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    mouseWheelEnabled: false,
                    listeners:{
                        change:function(){
                            gross_profit_per_unit('est_exch_price'+time_id, 'est_core_charge'+time_id, 'CostEstimatePerUnit'+time_id, 'CorePurchaseCostPerUnit'+time_id, 'GrossProfitPerUnit'+time_id);
                        }
                    }
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.gross_profit_unit,
                    name: 'GrossProfitPerUnit',
                    id:'GrossProfitPerUnit'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    listeners:{
                        change:function(){
                            year_five_gross_profit('GrossProfitPerUnit'+time_id, 'Annualdemand_roi'+time_id, 'AnnualizedInvestmentAmortization'+time_id, 'YearFiveGrossProfit'+time_id);
                            first_year_gross_profit('GrossProfitPerUnit'+time_id, 'first_year_demand'+time_id, 'anti_pipe_fill'+time_id, 'AnnualizedInvestmentAmortization'+time_id, 'FirstYearGrossProfit'+time_id);
                             preliminary_roi('FirstYearGrossProfit'+time_id, 'YearFiveGrossProfit'+time_id, 'EstimatedTotalInvestment'+time_id, 'PreliminaryROI'+time_id);
                        }
                    }
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.annualized_amortizat,
                    name: 'AnnualizedInvestmentAmortization',
                    id:'AnnualizedInvestmentAmortization'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    /*listeners:{
                        change:function(){
                           first_year_gross_profit('GrossProfitPerUnit', 'first_year_demand', 'anti_pipe_fill', 'AnnualizedInvestmentAmortization', 'FirstYearGrossProfit');
                        }
                    }*/

                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.first_year_profit,
                    name: 'FirstYearGrossProfit',
                    id: 'FirstYearGrossProfit'+time_id,
                    allowBlank: false,
                    //minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.year_five_gross,
                    name: 'YearFiveGrossProfit',
                    id: 'YearFiveGrossProfit'+time_id,
                    allowBlank: false,
                   // minValue: 0,
                    allowExponential: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    listeners:{
                      /*  change:function(){
                           preliminary_roi('FirstYearGrossProfit', 'YearFiveGrossProfit', 'EstimatedTotalInvestment', 'PreliminaryROI');
                        }*/
                    }
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.preliminary_roi,
                    name: 'PreliminaryROI',
                    id: 'PreliminaryROI'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.preliminary_roi_approv,
                    name: 'PreliminaryROIApproval',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true
                },
                {
                    xtype:'textareafield',
                    grow:true,
                    labelWidth: style.input2.labelWidth,
                    name: 'PreliminaryROIComment',
                    fieldLabel: lan.preliminary_roi_com,
                    anchor:'96%'
                },
                {
                   /* xtype:'textfield',
                    fieldLabel: 'Preliminary ROI Approver',
                    name: 'PreliminaryROIApprover',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false*/
                     xtype:'combobox',
                    fieldLabel: lan.prelim_roi_approver,
                    name: 'PreliminaryROIApprover',
                    queryMode: 'local',
                    //allowBlank: false,
                    typeAhead: true,
                    triggerAction: 'all',
                    //forceSelection: true,
                    lazyRender: true,
                    editable: false,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true,
                },
                {
                    xtype: 'textfield',
                    //format: 'Y-m-d H:i:s', 
                    //altFormats: 'Y-m-d H:i:s',
                    anchor:'96%',
                    //allowBlank: false,
                    id: "PreliminaryROIApprovalDate"+time_id,
                    name: 'PreliminaryROIApprovalDate',
                    //startDay: 1,
                    fieldLabel: lan.prelim_roi_app_date,
                    labelWidth: style.input2.labelWidth,
                    //value:null,
                    readOnly:true
                },
            ]
}];
    return preliminary_roi_pm;
}


function getNPDReqItem(time_id){
    var npd_request = [{
    xtype: 'container',
    layout: 'anchor',
    items: [
             {xtype:'combobox',
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        }]
}];
    return npd_request;
}

function getSampleValidationItem(time_id){
    var sample_validation = [{
                xtype: 'container',
                layout: 'anchor',
                items: [
                {xtype:'combobox',
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
            {
                xtype:'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                anchor:'96%',
                readOnly: true
            },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly: true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly: true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.core_sku,
                    name: 'core_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly: true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.Application,
                    name: 'Application',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //anchor:'96%',
                    width:'96%',
                    readOnly: true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.SampleLocation,
                    name: 'SampleLocation',        
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //anchor:'96%',
                    width:'96%',
                    readOnly: true,
                },
               {
                    xtype: 'panel',
                    title: lan.samples,
                    layout: 'anchor',
                    anchor:'96%',
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '96%',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    flex: 1
                                },
                                {
                                    xtype:'displayfield',
                                    value: 'OE',
                                    flex: 1
                                },
                                {
                                    xtype: 'splitter'
                                },
                                {
                                    xtype:'displayfield',
                                    value: 'CORE',
                                    flex: 1
                                }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '96%',
                            items: [
                              {
                                    xtype: 'displayfield',
                                    fieldLabel: lan.SampleTypeQuantities,
                                    labelWidth: style.input2.labelWidth,
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel: lan.stqOE,
                                    hideLabel: true,
                                    name: 'stqOE',
                                    allowBlank: false,
                                    //labelWidth: style.input2.labelWidth,
                                    flex: 1
                                },
                                {
                                    xtype: 'splitter'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel: lan.stqCore,
                                    hideLabel: true,
                                    name: 'stqCore',
                                    allowBlank: false,
                                    //labelWidth: style.input2.labelWidth,
                                    flex: 1
                                }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaults: {
                                anchor:'96%'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: lan.tag_numb_of_samp,
                                    labelWidth: style.input2.labelWidth,
                                },
                                {
                                    xtype:'textareafield',
                                    allowBlank: false,
                                    fieldLabel: lan.tagNumOE,
                                    hideLabel: true,
                                    grow:true,
                                    name: 'tagNumOE',
                                    flex: 1
                                },
                                {
                                    xtype: 'splitter'
                                },
                                {
                                    xtype:'textareafield',
                                    allowBlank: false,
                                    fieldLabel: lan.tagNumCore,
                                    hideLabel: true,
                                    grow:true,
                                    name: 'tagNumCore',
                                    flex: 1
                                }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaults: {
                                anchor:'96%'
                            },
                            items: [
                               {
                                    xtype: 'displayfield',
                                    fieldLabel: lan.sample_correct,
                                    labelWidth: style.input2.labelWidth,
                                },
                                {
                                    xtype:'combobox',
                                    name: 'SampleCorrectOE',
                                    fieldLabel: lan.SampleCorrectOE,
                                    hideLabel: true,
                                    allowBlank: false,
                                    store: data_store_YESNO,
                                    displayField: 'value',
                                    valueField: 'id',
                                    editable: false,
                                    flex: 1
                                },
                                {
                                    xtype: 'splitter'
                                },
                                {
                                    xtype:'combobox',
                                    name: 'SampleCorrectCore',
                                    fieldLabel: lan.SampleCorrectCore,
                                    hideLabel: true,
                                    allowBlank: false,
                                    labelWidth: style.input2.labelWidth,
                                    store: data_store_YESNO,
                                    displayField: 'value',
                                    valueField: 'id',
                                    editable: false,
                                    flex: 1
                                }]
                        }
                    ]
                },


                        {
                            xtype:'textareafield',
                            grow:true,
                            name: 'Note',
                            labelWidth: style.input2.labelWidth,
                            fieldLabel: lan.notes+':',
                            width:'96%',
                        }

                ]
}];
    return sample_validation;
}


/*
var test_procedure = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [
            {
                xtype:'textfield',
                fieldLabel: 'Procedure',
                labelAlign: 'top',
                name: 'test_procedure',
                allowBlank: true,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
            },
            {
                xtype:'textareafield',
                fieldLabel: 'Special Condition',
                labelAlign: 'top',
                name: 'spec_conditions',
                allowBlank: false,
               // height: '30%',
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
            },
            {
                xtype:'textareafield',
                fieldLabel: 'Description',
                labelAlign: 'top',
                name: 'description',
               // height: '40%',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
            },{
                xtype:'displayfield',
                fieldLabel: 'Instruction',
                name:"file",
                id:'file',
                style:'margin-bottom:5px; font-size:14px; text-align: center',
            },{
                xtype: 'button',
                text : 'Download',
                cls:'disable',
                margin: '5',
                handler: function() {
                    var file = Ext.getCmp('file').getValue();
                    downloadUrl = 'scripts/ecr_form.php?downloadFile=true&file='+file;
                    var downloadFrame = document.createElement("iframe"); 
                    downloadFrame.setAttribute('src',downloadUrl);
                    downloadFrame.setAttribute('class',"screenReaderText"); 
                    document.body.appendChild(downloadFrame); 
                    }
                },{
                xtype: 'filefield',
                id: 'instruction',
                name: 'instruction',
                msgTarget: 'side',
                anchor: '96%',
                buttonText: 'Add New File',
                defaults: {
                    fileUpload: true
                },
                listeners: {
                    change: function(val, value, eOpts, editor){
                        var extn = value.split('.').pop();
                            if((extn!=='doc') && (extn!=='txt') && (extn!=='xls') && (extn!=='xlsx') && (extn!=='docx')&&(extn!=='pdf')){
                                val.setValue(''); val.setRawValue('');
                                Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " + lan.available +': (.doc, .txt, .xls, .xlsx, .docx, .pdf)');
                            }
                    }
                }
            }]
}];*/

/*var rights = [{
    xtype: "container",
    layout: "anchor",
    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Name',
            name: 'right_name',
            labelWidth: style.input2.labelWidth,
            anchor: '96%'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Description',
            name: 'description',
            labelWidth: style.input2.labelWidth,
            anchor: '96%'
        }
    ]
}];*/

function getProcessDesignReqItem(time_id){
    var process_design_request = [{
    xtype: 'container',
    layout: 'anchor',
    items: [
             {xtype:'combobox',
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        }]
}];
    return process_design_request;
}

var download = getActionLink('add_spec');
function epsProduction(time_id) {
    epsFinalStore.removeAll();
    epsDiagnosticStore.removeAll();
    var eps_production = [{
        xtype: 'container',
        layout: 'anchor',
        items: [
           /* {
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },*/
            {
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
            {
                xtype:'combobox',
                fieldLabel: lan.bbb_sku,
                name: 'bbb_sku',
                allowBlank: false,
                typeAhead: true,
                labelWidth: style.input2.labelWidth,
                store: store_bbb_sku,
                displayField: 'value',
                valueField: 'id',
                anchor:'96%',
                readOnly: true
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
                xtype:'combobox',
                fieldLabel: lan.exist_equip,
                name: 'existing_equipment',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                store: data_store_YESNO,
                displayField: 'value',
                valueField: 'id',
                value :'1',                  
                editable:false,
                anchor:'96%',
            },
            {
                xtype:'textareafield',
                fieldLabel: lan.description,
                name: 'description',
                allowBlank: true,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
            },
            {
                xtype: "form",
                title: lan.final_func_test_soft,
                id: "final" + time_id,
                margin: '0 0 0 10',
                bodyPadding: 10,
                frame: false,
                items: [
                    {
                        xtype: 'filefield',
                        name: 'final_test',
                        id: "finalBut" + time_id,
                        buttonText: lan.add_file,
                        width: "50%",
                        defaults: {
                            fileUpload: true
                        },
                        buttonOnly: true,
                        listeners: {
                            change: function(val, value, eOpts, editor) {
                                Ext.Msg.prompt(lan.file, lan.file_descript, function(btn, text){
                                    if (btn == 'ok'){
                                        /*var extn = value.split('.').pop();
                                        if((extn!=='doc') && (extn!=='txt') && (extn!=='xls') && (extn!=='xlsx') && (extn!=='docx')){
                                            val.setValue(''); val.setRawValue('');
                                            Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " + lan.available +': (.doc, .txt, .xls, .xlsx, .docx)');
                                        }
                                        else {*/
                                            var form = Ext.getCmp("final" + time_id).getForm();
                                            if(form.isValid()){
                                                form.submit({
                                                    url: 'scripts/ecr_form.php',
                                                    waitMsg: lan.upload_file,
                                                    params: {"addFile":'true'},
                                                    success: function(fp, o) {
                                                        //console.log(o.result.message);
                                                        epsFinalStore.add({id: epsFinalStore.data.length+1, descr_spec: text, add_spec: o.result.message});
                                                    }
                                                });
                                            }
                                        //}
                                    }
                                });
                            }
                        }
                    },
                    {
                        xtype: "grid",
                        id: "final_grid"+time_id,
                        store: epsFinalStore,
                        columns: [
                            {
                                xtype:'rownumberer',
                                width:20
                            },
                            {
                                text: lan.description,
                                dataIndex: 'descr_spec',
                                sortable: false,
                                minWidth:200,
                                flex:1
                            },
                            {
                                text: lan.documentstext,
                                dataIndex: 'add_spec',
                                sortable: false,
                                minWidth:200,
                                flex:1
                            },
                            {
                                xtype:'actioncolumn',
                                width:40,
                                items:[download]
                            },
                            {
                                xtype:'actioncolumn',
                                width:40,
                                id: "finalDel" + time_id,
                                dataIndex:'set_hidden',
                                items:[{
                                    iconCls:'delete',
                                    handler:function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        epsFinalStore.remove(rec);
                                    }
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: "form",
                title: lan.diagnost_soft,
                id: "diagnostic" + time_id,
                margin: '0 0 0 10',
                bodyPadding: 10,
                frame: false,
                items: [
                    {
                        xtype: 'filefield',
                        name: 'diagnostic_software',
                        id: "diagnosticBut" + time_id,
                        buttonText: lan.add_file,
                        width: "50%",
                        //allowBlank: false,
                        defaults: {
                            fileUpload: true
                        },
                        buttonOnly: true,
                        listeners: {
                            change: function(val, value, eOpts, editor) {
                                Ext.Msg.prompt(lan.file, lan.file_descript, function(btn, text){
                                    if (btn == 'ok'){
                                        /*var extn = value.split('.').pop();
                                        if((extn!=='doc') && (extn!=='txt') && (extn!=='xls') && (extn!=='xlsx') && (extn!=='docx')){
                                            val.setValue(''); val.setRawValue('');
                                            Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " + lan.available +': (.doc, .txt, .xls, .xlsx, .docx)');
                                        }
                                        else {*/
                                            var form = Ext.getCmp("diagnostic" + time_id).getForm();
                                            if(form.isValid()){
                                                form.submit({
                                                    url: 'scripts/ecr_form.php',
                                                    waitMsg: lan.upload_file,
                                                    params: {"addFile":'true'},
                                                    success: function(fp, o) {
                                                        //console.log(o.result.message);
                                                        epsDiagnosticStore.add({id: epsDiagnosticStore.data.length+1, descr_spec: text, add_spec: o.result.message});
                                                    }
                                                });
                                            }
                                        //}
                                    }
                                });
                            }
                        }
                    },
                    {
                        xtype: "grid",
                        id: "diagnostic_grid"+time_id,
                        store: epsDiagnosticStore,
                        columns: [
                            {
                                xtype:'rownumberer',
                                width:20
                            },
                            {
                                text: lan.description,
                                dataIndex: 'descr_spec',
                                sortable: false,
                                minWidth:200,
                                flex:1
                            },
                            {
                                text: lan.documentstext,
                                dataIndex: 'add_spec',
                                sortable: false,
                                minWidth:200,
                                flex:1
                            },
                            {
                                xtype:'actioncolumn',
                                width:40,
                                items:[download]
                            },
                            {
                                xtype:'actioncolumn',
                                width:40,
                                id: "diagnosticDel" + time_id,
                                dataIndex:'set_hidden',
                                items:[{
                                    iconCls:'delete',
                                    handler:function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        epsDiagnosticStore.remove(rec);
                                    }
                                }]
                            }
                        ]
                    }
                ]
            }
        ]
    }];
    return eps_production;
}

function getComboEquipmentType(time_id){
    var comboEquipmentType = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        id: 'et'+time_id,
        store: storeEquipType,
        displayField: 'value',
        valueField: 'id',
        value :1,
        readOnly: true
    });
    return comboEquipmentType;
}

function getNumberYear(time_id, readStatus){
    var min = new Date();
        min = min.getFullYear();
    var max = min+20;
    var numberYear = {
        xtype: 'numberfield',
        id: 'ny'+time_id,
        minValue: min,
        maxValue: max,
        allowDecimal: false,
        allowExponential: false,
        mouseWheelEnabled: false,
        labelWidth: style.input2.labelWidth,
        anchor: '96%',
        readOnly: readStatus
    }
    return numberYear;
}


function getQuarter(time_id, readStatus){
    var comboQuarter = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        id: 'quarter'+time_id,
        store: storeQuarters,
        displayField: 'value',
        valueField: 'id',
        editable: false,
        readOnly: readStatus
    });
    return comboQuarter;
}

function setDecision(user, commission, time_id){
        Ext.getCmp(user+"_name"+time_id).setValue(id_user);
        var sub_users = commission[user];
        var user_id = Ext.getCmp(user+"_name"+time_id).getValue();
        var decision = Ext.getCmp("approved_"+user+time_id).getValue();

        for(var i = 0; i<sub_users.length; i++){
            var el = Ext.getCmp("approved_"+sub_users[i]+time_id);
            if(el.getValue()!=1&&el.getValue()!=2){
                Ext.getCmp(sub_users[i]+"_name"+time_id).setValue(user_id);
                el.setValue(decision);
            }

            if(Ext.getCmp(sub_users[i]+"_name"+time_id).getValue()==user_id){
                el.setValue(decision);
            }
        }
    }
/*
function getCapexItem(time_id, status_view, readStatus){
    var comboEquipmentType = getComboEquipmentType(time_id);
    var comboYESNOCapex = getComboYESNO(false);
    var numberYear = getNumberYear(time_id, readStatus);
    var comboQuarter = getQuarter(time_id, readStatus);

    var oper = ['oper'];
    var contr = ['contr'];
    var cfo = ['cfo', 'contr'];
    var president = ['president','cfo', 'contr','oper'];

    var commission = {oper: oper, contr: contr, cfo:cfo,  president: president};

    var questionBlock = getQuestionBlock(time_id, false, true);
    
    var capex = [{
    xtype: 'container',
    layout: 'anchor',
    items: [{
            xtype:'hidden',
            name:'process_id',
        },{
            xtype:'combobox',
            fieldLabel: lan.req_by,
            name: 'requested_by',
            triggerAction: 'all',
            lazyRender: true,
            labelWidth: style.input2.labelWidth,
            store: data_store_users,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
        },{
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        },{
            xtype:'textarea',
            fieldLabel: lan.business_purpose,
            name: 'business_purpose',
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly: true
        },{
            xtype:'textarea',
            fieldLabel: lan.business_case,
            name: 'business_benefit',
            labelWidth: style.input2.labelWidth,
            anchor:'96%',
            readOnly: true
        },
        {
            xtype:'combobox',
            fieldLabel: lan.estimate_asset_service,
            name: 'estimate_assets',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: storeMonth,
            displayField: 'value',
            valueField: 'id',
            editable: false,
            anchor:'96%',
            readOnly: readStatus
        },
        {
            xtype: 'combobox',
            fieldLabel: lan.cost_depreciation,
            name: 'cost_center',
            allowBlank: false,
            labelWidth: style.input2.labelWidth,
            store: storeCostCenter,
            anchor: '96%',
            displayField: 'value',
            valueField: 'id',
            readOnly: true
        },
        {
            xtype:'combobox',
            fieldLabel: lan.project_include_capex_budget,
            name: 'included_capex',
            labelWidth: style.input2.labelWidth,
            anchor: '96%',
            allowBlank: false,
            store: data_store_YESNO,
            displayField: 'value',
            valueField: 'id',
            editable:false, 
            readOnly: readStatus
        },{
            xtype: 'gridpanel',
            title: lan.list_major_elem,
            autoScroll: true,
            store: storeProjectElements,
            id: 'gridProjectElements'+time_id,
            minHeight: 200,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            margin:'0 0 10 0',
            features: [{
                ftype: 'summary'
            }],
            columns: [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {dataIndex: 'el_id', hidden: true},
                {text: lan.operation, editor: comboEquipmentType, dataIndex: 'op_number', width: 150},
                {text: lan.equip_type, editor: comboEquipmentType, dataIndex: 'el_type', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboEquipmentType), this)},
                {text: lan.name+':', dataIndex: 'name', width: 150},
                //{text: 'Description of the equipment', dataIndex: 'description', width: 200},
                {text: lan.est_life_time, dataIndex: 'life_time', width: 150},
                {text: lan.partNumber, dataIndex: 'number', width: 150},
                {text: lan._Quantity, dataIndex: 'qty', width: 150},
                {text: lan.total_cost, xtype: 'numbercolumn', dataIndex: 'total_price', width: 150,summaryType: 'sum',summaryRenderer: function(value, summaryData, dataIndex) {return '<b>Total:</b> '+value}},
                {text: lan.year, editor: numberYear, dataIndex: 'year', width: 150},
                {text: lan.quarter, editor: comboQuarter, dataIndex: 'quarter', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboQuarter), this)}
            ]
        },
        questionBlock
        ,{
            xtype:'hidden',
            name:'analysis',
            id: 'analysis'+time_id,
            listeners: {
                change: function(){
                    var val = this.getValue();
                    if(val&&val!="") Ext.getCmp('button_analysis'+time_id).setConfig('disabled', false);
                }
            }
        },{
            xtype: 'button',
            text: lan.analysis,
            margin: '10 0 0 0',
            disabled: true,
            id: 'button_analysis'+time_id,
            width: 300,
            handler:function(){
              var file = Ext.getCmp('analysis'+time_id).getValue();
              downloadUrl = 'scripts/ecr_form.php?downloadFile=true&doc=true&file='+file;
            var downloadFrame = document.createElement("iframe"); 
            downloadFrame.setAttribute('src',downloadUrl);
            downloadFrame.setAttribute('class',"screenReaderText"); 
            document.body.appendChild(downloadFrame); 
            }
        },{
            xtype: 'fieldset',
            title: lan.approv_signatures,
            anchor:'96%',
            layout: 'hbox',
            border: 3,
            padding: '10',
            hidden: status_view,
            //margin: '0 0 10 0',
            items:[{
            xtype: 'container',
            layout: 'vbox',
            margin: '0 5',
            flex:1,
            items:[{
                xtype:'combobox',
                fieldLabel: lan.operations,
                labelAlign: 'top',
                name: 'oper_name',
                id: 'oper_name'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeOperators,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                readOnly: true
            },{
                xtype:'combobox',
                name: 'approved_oper',
                id: 'approved_oper'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeApproveDecline,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                editable:false,
                readOnly: true
            }]
        }, {
            xtype: 'container',
            layout: 'vbox',
            margin: '0 5',
            flex:1,
            items:[{
                xtype:'combobox',
                fieldLabel: 'Controller*',
                labelAlign: 'top',
                name: 'contr_name',
                id: 'contr_name'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeControlers,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                readOnly: true
            },{
                xtype:'combobox',
                name: 'approved_contr',
                id: 'approved_contr'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeApproveDecline,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                editable:false,
                readOnly: true,
                listeners: {
                    select: function(){
                        setDecision('contr', commission, time_id);
                    }
                }
                
            }]
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '0 5',
            flex:1,
            items:[{
                xtype:'combobox',
                fieldLabel: lan.cfo,
                labelAlign: 'top',
                name: 'cfo_name',
                id: 'cfo_name'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeCFO,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                readOnly: true
            },{
                xtype:'combobox',
                name: 'approved_cfo',
                id: 'approved_cfo'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeApproveDecline,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                editable:false,
                readOnly: true,
                listeners: {
                    select: function(){
                        setDecision('cfo', commission, time_id);
                    }
                }
            }]
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '0 5',
            flex:1,
            items:[{
                xtype:'combobox',
                fieldLabel: lan.president+'*',
                labelAlign: 'top',
                name: 'president_name',
                id: 'president_name'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storePresidents,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                readOnly: true
            },{
                xtype:'combobox',
                name: 'approved_president',
                id: 'approved_president'+time_id,
                labelWidth: style.input2.labelWidth,
                store: storeApproveDecline,
                width:'100%',
                displayField: 'value',
                valueField: 'id',
                editable:false,
                readOnly: true,
                listeners: {
                    select: function(){
                        setDecision('president', commission, time_id);
                    }
                }
            }]
        }]
    }]
}];
    return capex;
}*/


function getProcurementRequestItem(time_id){
    var comboYESNOProcurement = getComboYESNO(false);
    var comboEquipmentType = getComboEquipmentType(time_id);
    var procurement_request = [{
        xtype: 'container',
        layout: 'anchor',
        items: [/*{
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },*/{
            xtype:'hidden',
            name:'process_id',
        },{
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        },{
            xtype: 'gridpanel',
            title: lan.procur_req_list,
            autoScroll: true,
            store: storeProcurementList,
            id: 'gridProcurementList'+time_id,
            minHeight: 200,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            margin:'0 0 10 0',
            features: [{
                ftype: 'summary'
            }],
            columns: [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {dataIndex: 'el_id', hidden: true},
                {text: lan.operation, dataIndex: 'op_number', width: 150},
                {text: lan.equip_type, editor: comboEquipmentType, dataIndex: 'el_type', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboEquipmentType), this)},
                {text: lan.name+':', dataIndex: 'name', width: 150},
                //{text: 'Description of the equipment', dataIndex: 'description', width: 200},
                {text: lan.partNumber, dataIndex: 'number', width: 150},
                {text: lan._Quantity, dataIndex: 'qty', width: 150},
                {text: lan.total_cost, xtype: 'numbercolumn', dataIndex: 'total_price', width: 150,summaryType: 'sum',summaryRenderer: function(value, summaryData, dataIndex) {return '<b>Total:</b> '+value}},
                {text: lan.received, editor: comboYESNOProcurement, dataIndex: 'received', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOProcurement), this)},
            ]
        },{
            xtype: 'panel',
            title: lan.capex_approve_by,
            anchor: '96%',
            items:[{
                xtype: 'container',
                layout: 'hbox',
                items:[{
                    xtype:'combobox',
                    fieldLabel: lan.operations,
                    labelAlign: 'top',
                    name: 'oper_name',
                    id: 'oper_name'+time_id,
                    labelWidth: style.input2.labelWidth,
                    allowBlank: false,
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly: true,
                    margin: '0 5',
                    flex:1
                },{
                    xtype:'combobox',
                    fieldLabel: lan.controller,
                    labelAlign: 'top',
                    name: 'contr_name',
                    id: 'contr_name'+time_id,
                    labelWidth: style.input2.labelWidth,
                    allowBlank: false,
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    margin: '0 5',
                    readOnly: true,
                    flex:1
                },{
                    xtype:'combobox',
                    fieldLabel: lan.cfo,
                    labelAlign: 'top',
                    name: 'cfo_name',
                    id: 'cfo_name'+time_id,
                    labelWidth: style.input2.labelWidth,
                    allowBlank: false,
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly: true,
                    margin: '0 5',
                    flex:1
                },{
                    xtype:'combobox',
                    fieldLabel: lan.president+'*',
                    labelAlign: 'top',
                    name: 'president_name',
                    id: 'president_name'+time_id,
                    labelWidth: style.input2.labelWidth,
                    allowBlank: false,
                    store: data_store_users,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly: true,
                    margin: '0 5',
                    flex:1
                }]
            },{
                    xtype:'hidden',
                    name:'capex_pdf',
                    id: 'capex_pdf'+time_id,
                    listeners: {
                        change: function(){
                            var val = this.getValue();
                            if(val&&val!="") Ext.getCmp('button_capex_pdf'+time_id).setConfig('disabled', false);
                        }
                    }
                },{
                    xtype: 'button',
                    text: lan.capex_pdf,
                    margin: '10 0 0 0',
                    disabled: true,
                    id: 'button_capex_pdf'+time_id,
                    width: 300,
                    handler:function(){
                      var file = Ext.getCmp('capex_pdf'+time_id).getValue();
                      downloadUrl = 'scripts/ecr_form.php?downloadFile=true&doc=true&file='+file;
                        var downloadFrame = document.createElement("iframe"); 
                        downloadFrame.setAttribute('src',downloadUrl);
                        downloadFrame.setAttribute('class',"screenReaderText"); 
                        document.body.appendChild(downloadFrame); 
                    }
                }]
        }]
    }];
    return procurement_request;
}


function getImplementationRequestItem(time_id){
    var comboYESNOImplemented = getComboYESNO(false);
    var comboYESNOReceived = getComboYESNO(true);
    var comboEquipmentType = getComboEquipmentType(time_id);
    var implementation_request = [{
        xtype: 'container',
        layout: 'anchor',
        items: [/*{
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },*/{
            xtype:'hidden',
            name:'process_id',
            id: 'process_id'+time_id
        },{
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        },{
            xtype: 'gridpanel',
            title: lan.implement_req_list,
            autoScroll: true,
            store: storeImplementationList,
            id: 'gridImplementationList'+time_id,
            minHeight: 200,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            margin:'0 0 10 0',
            features: [{
                ftype: 'summary'
            }],
            columns: [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {dataIndex: 'el_id', hidden: true},
                {text: lan.operation, dataIndex: 'op_number', width: 150},
                {text: lan.equip_type, editor: comboEquipmentType, dataIndex: 'el_type', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboEquipmentType), this)},
                {text: lan.name+':', dataIndex: 'name', width: 150},
                //{text: 'Description of the equipment', dataIndex: 'description', width: 200},
                {text: lan.partNumber, dataIndex: 'number', width: 150},
                {text: lan._Quantity, dataIndex: 'qty', width: 150},
                {text: lan.total_cost, xtype: 'numbercolumn', dataIndex: 'total_price', width: 150,summaryType: 'sum',summaryRenderer: function(value, summaryData, dataIndex) {return '<b>Total:</b> '+value}},
                {text: lan.received, editor: comboYESNOReceived, dataIndex: 'received', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOReceived), this)},
                {text: lan.implemented, editor: comboYESNOImplemented, dataIndex: 'implemented', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOImplemented), this)},
            ]
        }]
    }];
    return implementation_request;
}


function getPurchasingRequestItem(time_id){
    var comboYESNOPurchasing = getComboYESNO(false);
    var comboEquipmentType = getComboEquipmentType(time_id);
    var purchasing_request = [{
        xtype: 'container',
        layout: 'anchor',
        items: [/*{
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },*/{
            xtype:'hidden',
            name:'process_id',
            id: 'process_id'+time_id
        },{
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
        {
            xtype:'combobox',
            fieldLabel: lan.bbb_sku,
            name: 'bbb_sku',
            allowBlank: false,
            typeAhead: true,
            labelWidth: style.input2.labelWidth,
            store: store_bbb_sku,
            displayField: 'value',
            valueField: 'id',
            anchor:'96%',
            readOnly: true
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
        },{
            xtype: 'gridpanel',
            title: lan.purchas_req_list,
            autoScroll: true,
            store: storePurchasingList,
            id: 'gridPurchasingList'+time_id,
            minHeight: 200,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            margin:'0 0 10 0',
            features: [{
                ftype: 'summary'
            }],
            columns: [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {dataIndex: 'el_id', hidden: true},
                {text: lan.operation, dataIndex: 'op_number', width: 150},
                {text: lan.equip_type, editor: comboEquipmentType, dataIndex: 'el_type', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboEquipmentType), this)},
                {text: lan.name+':', dataIndex: 'name', width: 150},
                //{text: 'Description of the equipment', dataIndex: 'description', width: 200},
                {text: lan.partNumber, dataIndex: 'number', width: 150},
                {text: lan._Quantity, dataIndex: 'qty', width: 150},
                {text: lan.total_cost, xtype: 'numbercolumn', dataIndex: 'total_price', width: 150,summaryType: 'sum',summaryRenderer: function(value, summaryData, dataIndex) {return '<b>Total:</b> '+value}},
                {text: lan.received, editor: comboYESNOPurchasing, dataIndex: 'received', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOPurchasing), this)},
            ]
        }]
    }];
    return purchasing_request;
}