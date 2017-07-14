function getDueDiligenceItem(time_id){
    var CustomersStore = getCustomersStore(time_id);
    var core_skuStore = getCoreSKUStore(time_id);
    var oe_skuStore = getOESKUStore(time_id);
    var similar_skuStore = getSimilarSKUStore(time_id);
    var reman_sku_upcStore = getRemanSKUStore(time_id);
    var onlyRemanSKU = getOnlyRemanSKU(time_id);
    var Competitors_Store = getCompetitorsStore(time_id);
    var competitor_market_priceStore = getCompMarketPriceStore(time_id);
    var competitor_core_priceStore = getCompCorePriceStore(time_id);
    var comboYESNODD = getComboYESNO(false);

    var container =1;

    var due_diligence = [{
                xtype: 'container',
                layout: 'anchor',
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.ProductLine,
                    name: 'ProductLine',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: data_store_ProductLine,
                    displayField: 'value',
                    valueField: 'id',
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
                    id: 'PotentialCustomers_due_diligence'+time_id,
                    name: 'PotentialCustomers2',
                    queryMode: 'remote',
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
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
                    cls:'disable',
                    margin: '5 0 5 10',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('PotentialCustomers_due_diligence'+time_id).rawValue;
                        var isExist = false;
                        CustomersStore.each(function(record){
                            if(record.get('name')==name){
                                isExist = true;
                            }
                        });
                        if (name.trim() != ''&&!isExist) {
                            Ext.getCmp('PotentialCustomers_due_diligence'+time_id).setValue();
                            CustomersStore.add({name: name});
                            Ext.getCmp('Customers_due_diligence'+time_id).show();
                            Ext.Ajax.request({
                                url: 'scripts/store.php?setPotentialCustomers=true',
                                method: 'POST',
                                params: {
                                    name: name
                                    },
                                success: function (response){
                                   /* var data = Ext.decode(response.responseText);
                                    Ext.MessageBox.alert("", data.message);*/
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
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
                    cls:'disable',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('PotentialCustomers_due_diligence'+time_id).rawValue;
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
                id:'Customers_due_diligence'+time_id,
                border: true,
                hidden:true,
                store: CustomersStore,
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
                        // id:'customer_del',
                       // cls:'disable',
                        items:[{
                                iconCls:'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    CustomersStore.remove(rec);
                                    if(CustomersStore.data.length == 0) {
                                        Ext.getCmp('Customers_due_diligence'+time_id).hide();
                                    }
                                }
                            }]
                    }],
                },
               ]
                },

/***********************************************************************************************************************************************/
    /***************************************** BBB SKU# ******************************************************************/
                {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                    align: 'middle'

                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.bbb_sku,
                    id: 'bbb_sku_due_diligence'+time_id,
                    name: 'bbb_sku',
                    queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: false,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    store: store_bbb_sku,
                    displayField: 'value',
                    valueField: 'id',
                    vtype: 'nameValid',
                    flex: 1,
                    validator: function (val) {
                            errMsg = lan.sku_same_name_exist;
                        return ((store_bbb_sku.find('value', val) !=-1) && Ext.getCmp('newsku'+time_id).getValue()==1) ? errMsg : true;
                    }
                },
                {
                    xtype: 'splitter'
                },{
                    xtype: 'checkbox',
                    boxLabel  : lan.new,
                    name      : 'newsku',
                    inputValue: 1,
                    margin: '0 0 0 10',
                    id        : 'newsku'+time_id,
                    disabled: view,
                    listeners: {
                        change: function(){
                           var val  = Ext.getCmp('newsku'+time_id).getValue();
                            if(val == 1) Ext.getCmp('bbb_sku_due_diligence'+time_id).setConfig('editable', true);
                                else {
                                    Ext.getCmp('bbb_sku_due_diligence'+time_id).setConfig('editable', false);
                                    Ext.getCmp('bbb_sku_due_diligence'+time_id).setValue("");
                            }
                        }
                    }
                }, {
                    xtype: 'splitter'
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.setup,
                    //id: 'set_up1_due_diligence',
                    name: 'set_up_bbb',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    value :'0',                  
                    flex: 1,
                    margin: '0 0 10 5',
                    editable:false,
                }]
                },    

              
/***********************************************************************************************************************************************/
/******************************************************** CORE SKU# ****************************************************************************/
                {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.core_sku,
                    id: 'core_sku_due_diligence'+time_id,
                    name: 'core_sku2',
                    queryMode: 'remote',
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_core_sku,
                    displayField: 'value',
                    valueField: 'id',
                    flex: 3
                },{
                    xtype: 'button',
                    text : lan.add,
                    margin: '0 5',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('core_sku_due_diligence'+time_id).rawValue;
                        var isExist = false;
                        core_skuStore.each(function(record){
                            if(record.get('name')==name){
                                isExist = true;
                            }
                        });
                        if (name.trim() != ''&&!isExist) {
                        Ext.getCmp('core_sku_due_diligence'+time_id).setValue();
                        core_skuStore.add({name: name, setUp: 0});
                        Ext.getCmp('coresku_due_diligence'+time_id).show();
                        Ext.getCmp('coresku_due_diligence'+time_id).getView().refresh();
                        Ext.Ajax.request({
                                url: 'scripts/store.php?setCORE_SKU=true',
                                method: 'POST',
                                params: {
                                    name: name
                                    },
                                success: function (response){
                                    /*var data = Ext.decode(response.responseText);
                                    Ext.MessageBox.alert("", data.message);*/
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                        else {
                            Ext.MessageBox.alert(lan.error, lan.can_not_dublic_sku);
                        }
                    }
                }/*,
                {
                    xtype: 'button',
                    text : lan.new,
                    margin: '0 5',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('core_sku_due_diligence'+time_id).rawValue;
                        if (name != '') {
                              Ext.Ajax.request({
                                url: 'scripts/store.php?setCORE_SKU=true',
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
                name:'core_sku',
                id:'coresku_due_diligence'+time_id,
                border: true,
                hidden:true,
                margin: '10 0',
                store: core_skuStore,
                plugins:[
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })
                    ],
                flex: 2,
                columns: [
                    {
                        xtype:'rownumberer'
                    },
                    {
                        text: lan.core_sku, 
                        dataIndex: 'name',
                        width: '40%',
                        sortable: false
                    }, 
                   {
                        text: lan.setup, 
                        dataIndex: 'setUp',
                        width: '40%',
                        sortable: false,
                        renderer: Ext.util.Format.comboRenderer(comboYESNODD),
                        editor: comboYESNODD              
                    },
                    {
                        xtype:'actioncolumn',
                        width:20,
                        dataIndex: 'set_hidden',
                        items:[{
                                iconCls:'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    core_skuStore.remove(rec);
                                    if(core_skuStore.data.length == 0) {
                                        Ext.getCmp('coresku_due_diligence'+time_id).hide();
                                    }
                                }
                            }]
                    }]
                },
               ]
                },
/***********************************************************************************************************************************************/
                {
                    xtype:'combobox',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    store: latest_sku,
                    displayField: 'value',
                    valueField: 'value',
                    queryMode: 'remote',
                    minChars:2,

                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[
                            {
                                xtype:'textfield',
                                regex: regexDecimal,
                                invalidText: lan.not_number,
                                fieldLabel: lan.oe_list_price,
                                name: 'oe_list_price',
                                allowBlank: false,
                                labelWidth: style.input2.labelWidth,
                                enableKeyEvents: true,
                                vtype: "mmValid",
                                flex:2

                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                labelWidth: style.input2.labelWidth,
                                margin: '0 5 0 5',
                                width: 40
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d', 
                                altFormats: 'Y-m-d',
                               //anchor:'96%',
                                name: 'oe_list_price_date',
                                fieldLabel: lan.oe_list_price,
                                hideLabel: true,
                                height: '100%',
                                //labelWidth: style.input2.labelWidth,
                                flex:1
                            }
                        ] // items
                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[
                            {
                                xtype:'textfield',
                                regex: regexDecimal,
                                invalidText: lan.not_number,
                                fieldLabel: lan.oe_street_price,
                                name: 'oe_street_price',
                                allowBlank: false,
                                labelWidth: style.input2.labelWidth,
                                enableKeyEvents: true,
                                vtype: "mmValid",
                                flex:2

                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                labelWidth: style.input2.labelWidth,
                                margin: '0 5 0 5',
                                width: 40
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d', 
                                altFormats: 'Y-m-d',
                               //anchor:'96%',
                                name: 'oe_street_price_date',
                                fieldLabel: lan.oe_street_price,
                                hideLabel: true,
                                height: '100%',
                                //labelWidth: style.input2.labelWidth,
                                flex:1
                            }
                        ] // items
                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[
                            {
                                xtype:'textfield',
                                regex: regexDecimal,
                                invalidText: lan.not_number,
                                fieldLabel: lan.oe_core_price,
                                name: 'oe_core_price',
                                allowBlank: false,
                                labelWidth: style.input2.labelWidth,
                                enableKeyEvents: true,
                                vtype: "mmValid",
                                flex:2

                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                labelWidth: style.input2.labelWidth,
                                margin: '0 5 0 5',
                                width: 40
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d', 
                                altFormats: 'Y-m-d',
                               //anchor:'96%',
                                name: 'oe_core_price_date',
                                fieldLabel: lan.oe_core_price,
                                hideLabel: true,
                                height: '100%',
                                //labelWidth: style.input2.labelWidth,
                                flex:1
                            }
                        ] // items
                },
//+++++++++++++++++++++++++++++++++ OE SKU  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                 {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.oe_sku,
                    id: 'oe_sku_due_diligence'+time_id,
                    name: 'oe_sku2',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: oe_sku,
                    displayField: 'value',
                    valueField: 'id',
                    queryMode: 'remote',
                    minChars:2,
                    flex: 4
                },{
                    xtype: 'button',
                    text : lan.add,
                    margin: '0 5',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('oe_sku_due_diligence'+time_id).rawValue;
                        var isExist = false;
                        oe_skuStore.each(function(record){
                            if(record.get('name')==name){
                                isExist = true;
                            }
                        });
                        if (name.trim() != ''&&!isExist) {
                        Ext.getCmp('oe_sku_due_diligence'+time_id).setValue();
                        oe_skuStore.add({name: name});
                        console.log(oe_skuStore.getData());
                        Ext.getCmp('oesku_due_diligence'+time_id).show();
                        //Ext.getCmp('oe_sku_due_diligence'+time_id).getView().refresh();
                        Ext.Ajax.request({
                                url: 'scripts/store.php?setOE_SKU=true',
                                method: 'POST',
                                params: {
                                    name: name
                                    },
                                success: function (response){
                                    /*var data = Ext.decode(response.responseText);
                                    Ext.MessageBox.alert("", data.message);*/
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                        else {
                            Ext.MessageBox.alert(lan.error, lan.can_not_dublic_sku);
                        }
                    }
                }]

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
                    id:'oesku_due_diligence'+time_id,
                    border: true,
                    hidden:true,
                    margin: '10 0',
                    store: oe_skuStore,

                    flex: 2,
                    columns: [
                        {
                            xtype:'rownumberer'
                        },
                        {
                            text: lan.oe_sku,
                            dataIndex: 'name',
                            //flex: 1,
                            width:'80%',
                            sortable: false
                        },

                        {
                            xtype:'actioncolumn',
                            dataIndex: 'set_hidden',
                            width:20,
                            items:[{
                                    iconCls:'delete',
                                    handler:function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                       oe_skuStore.remove(rec);
                                        if(oe_skuStore.data.length == 0) {
                                            Ext.getCmp('oesku_due_diligence'+time_id).hide();
                                        }
                                    }
                            }]
                        }]
                },
                ]
                },

//++++++++++++++++++++++++++++++++++++++++ similar sku   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                {    
                    xtype: 'container',
                    anchor:'96%',
                    layout: {
                        type: 'hbox',
                        align:'middle',

                    },
                    items: [{
                        xtype:'combobox',
                        fieldLabel: lan.similar_sku,
                        name: 'similar_sku2',
                        id: 'similar_sku_due_diligence'+time_id,
                        labelWidth: style.input2.labelWidth,
                        store: similar_sku,
                        displayField: 'value',
                        valueField: 'id',
                        queryMode: 'remote',
                        minChars:2,
                        flex: 4
                },{
                        xtype: 'button',
                        text : lan.add,
                        margin: '0 5',
                        flex: 1,
                        handler: function() {
                            var name = Ext.getCmp('similar_sku_due_diligence'+time_id).rawValue;
                            var isExist = false;
                            similar_skuStore.each(function(record){
                                if(record.get('name')==name){
                                    isExist = true;
                                }
                            });
                            if (name.trim() != ''&&!isExist) {
                            Ext.getCmp('similar_sku_due_diligence'+time_id).setValue();
                            similar_skuStore.add({name: name});
                            Ext.getCmp('similarsku_due_diligence'+time_id).show();
                            //Ext.getCmp('oe_sku_due_diligence'+time_id).getView().refresh();
                            Ext.Ajax.request({
                                    url: 'scripts/store.php?setSimilar_SKU=true',
                                    method: 'POST',
                                    params: {
                                        name: name
                                        },
                                    success: function (response){
                                        /*var data = Ext.decode(response.responseText);
                                        Ext.MessageBox.alert("", data.message);*/
                                    },
                                    failure: function (response){ 
                                        Ext.MessageBox.alert(lan.error, response.responseText);
                                    }
                                });
                            }
                            else {
                                Ext.MessageBox.alert(lan.error, lan.can_not_dublic_sku);
                            }
                        }
                }]

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
                        id:'similarsku_due_diligence'+time_id,
                        border: true,
                        hidden:true,
                        margin: '10 0',
                        store: similar_skuStore,

                        flex: 2,
                        columns: [
                            {
                                xtype:'rownumberer'
                            },
                            {
                                text: lan.similar_sku,
                                dataIndex: 'name',
                                width:'80%',
                                sortable: false
                            },

                            {
                                xtype:'actioncolumn',
                                dataIndex: 'set_hidden',
                                width:20,
                                items:[{
                                        iconCls:'delete',
                                        handler:function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex);
                                            similar_skuStore.remove(rec);
                                            if(similar_skuStore.data.length == 0) {
                                                Ext.getCmp('similarsku_due_diligence'+time_id).hide();
                                            }
                                        }
                                }]
                            }]
                    },
                    ]
                    },
 // *********************************** OE REMAN SKU  ***** UPC ****************************************************************                  
                 {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku2',
                    id: 'oe_reman_sku'+time_id,
                    labelWidth: style.input2.labelWidth,
                    margin: '-5 5 0 0',
                    store: reman_sku,
                    displayField: 'value',
                    valueField: 'id',
                    queryMode: 'remote',
                    minChars:2,
                    flex: 2
                },
                {
                    xtype: 'splitter'
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.upc,
                    name: 'upc2',
                    id:'upc'+time_id,
                    labelWidth: 50,
                    flex: 2
                },   
                {
                    xtype: 'button',
                    text : lan.add,
                    margin: '0 5',
                    flex: 1,
                    handler: function() {
                        var reman_sku = Ext.getCmp('oe_reman_sku'+time_id).rawValue;
                        var upc = Ext.getCmp('upc'+time_id).rawValue;
                        if (reman_sku != '' && upc != '') {
                            Ext.getCmp('oe_reman_sku'+time_id).setValue();
                            Ext.getCmp('upc'+time_id).setValue();
                            reman_sku_upcStore.add({reman_sku: reman_sku, upc: upc});
                            Ext.getCmp('reman_sku_upc'+time_id).show();
                        }

                        //var name = Ext.getCmp('oe_reman_sku'+time_id).rawValue;
                        var isExist = false;
                        onlyRemanSKU.each(function(record){
                            if(record.get('name')==name){
                                isExist = true;
                            }
                        });
                        if (reman_sku.trim() != ''&&!isExist) {
                        Ext.getCmp('oe_reman_sku'+time_id).setValue();
                        onlyRemanSKU.add({name: reman_sku});
                        //Ext.getCmp('oe_reman_sku'+time_id).show();
                        //Ext.getCmp('oe_sku_due_diligence'+time_id).getView().refresh();
                        Ext.Ajax.request({
                                url: 'scripts/store.php?setReman_SKU=true',
                                method: 'POST',
                                params: {
                                    name: reman_sku
                                    },
                                success: function (response){
                                    /*var data = Ext.decode(response.responseText);
                                    Ext.MessageBox.alert("", data.message);*/
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                        else {
                            Ext.MessageBox.alert(lan.error, lan.can_not_dublic_sku);
                        }
                    }
                }]
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
                id:'reman_sku_upc'+time_id,
                border: true,
                hidden:true,
                margin: '10 0',
                store: reman_sku_upcStore,
                flex: 2,
                columns: [{
                           xtype:'rownumberer',
                          },
                            {
                            text: lan.oe_reman_sku, 
                            dataIndex: 'reman_sku',
                            width: '40%',
                            sortable: false,
                            },
                            {
                            text: lan.upc,
                            dataIndex: 'upc',
                            width: '40%',
                            sortable: false,
                            },
                            {
                        xtype:'actioncolumn',
                        dataIndex: 'set_hidden',
                        width:20,
                        sortable: false,
                        items:[{
                                iconCls:'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    reman_sku_upcStore.remove(rec);
                                    if(reman_sku_upcStore.data.length == 0) {
                                        Ext.getCmp('reman_sku_upc'+time_id).hide();
                                    }
                                }
                            }]
                    }]
                },
                ]
            },
/*********************************************** COMPETITOR *****************************************************************************/
            {
                xtype: 'container',
                anchor:'96%',
                items: [
                    {
                        xtype: 'container',
                        id: 'competitor_container'+time_id,                       
                        //items: [getCompetitorBlock(time_id)]
                        items: null
                    },{
		                xtype: 'container',
		                anchor:'96%',
		                layout: {
		                    type: 'hbox',
		                },
		                items: [{
		                    xtype:'displayfield',
		                    name:"",
		                    flex: 2
		                },{
		                    xtype: 'button',
		                    text : lan.add_next_competitor,
		                    //id:'add_competitor'+time_id,
		                    margin: '0 0 5 0',
		                    flex: 1,
		                    handler: function() {
		                    	Ext.getCmp('competitor_container'+time_id).add(getCompetitorBlock(time_id));  
		                    }
		                }]
                   }/*, 
                    {
                        xtype: 'container', 
                        anchor:'96%',
                        layout: {
                            type: 'hbox',
                        },                 
                        items: [
                             {
                                xtype:'displayfield',
                                flex: 3
                            },   
                             {
                                xtype: 'button',
                                text : lan.del,
                                id:'delete_competitor'+time_id,
                                hidden:true,
                                margin: '0 5',
                                flex: 1,
                                handler: function() {
                                    Ext.getCmp('competitor_container'+time_id).remove('competitor_block'+container+time_id);
                                    --container;
                                    if (container <=1){
                                        this.hide();    
                                    }
                                }
                            },                   
                            {
                                xtype: 'button',
                                text : lan.add,
                                id:'add_competitor'+time_id,
                                margin: '0 5',
                                flex: 1,
                                handler: function() {
                                    addCompetitorBlock(time_id, container);                       
                                }
                            }
                        ]
                    }, */
                   
                ]
            },
/*************************************************************************************************************************/
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
                    editable:false, 
                },{
                    xtype:'textarea',
                    fieldLabel: lan.business_purpose,
                    name: 'business_purpose',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },{
                    xtype:'textarea',
                    fieldLabel: lan.business_case,
                    name: 'business_benefit',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },{
                    xtype:'textarea',
                    fieldLabel: lan.marketinteligence,
                    name: 'market_inteligence',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                    },
                {
                    xtype:'combobox',
                    fieldLabel: lan.catalog_data_ver,
                    name: 'catalog_data_ver',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    width:'96%',
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    value :'1',
                    editable:false,
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.predominant_make,
                    name: 'predominant_make',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_predominant_make,
                    displayField: 'value',
                    valueField: 'id',
                    queryMode: 'local',
                    typeAhead: true,
                    minChars:1,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: true,
                    enableKeyEvents: true,
                },
               /* {
                    xtype:'textfield',
                    regex:regexYear,
                    invalidText:lan.not_year,
                    fieldLabel: lan.aver_veh_mod_year,
                    name: 'aver_veh_mod_year',
                    allowBlank: false,
                    //emptyText: 'Enter Year in format YYYY',
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },*/
                {
                    xtype:'numberfield',
                    invalidText:lan.not_year,
                    fieldLabel: lan.aver_veh_mod_year,
                    name: 'aver_veh_mod_year',
                    allowBlank: false,
                    minValue: 1970,
                    maxValue: new Date().getFullYear(),
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.veh_in_operation,
                    name: 'veh_in_operation',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.lifecycle,
                    name: 'lifecycle',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_lifecycle,
                    displayField: 'value',
                    valueField: 'id',
                    editable: false,
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.demand_in_cur_lifecycle,
                    name: 'demand_in_cur_lifecycle',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.demand_in_mature_lifecycle,
                    name: 'demand_in_mature_lifecycle',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.first_year_demand,
                    name: 'first_year_demand',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.anti_pipe_fill,
                    name: 'anti_pipe_fill',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.Annualdemand,
                    id: 'Annualdemand_due_diligence'+time_id,
                    name: 'Annualdemand',
                    minValue: 0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    //anchor:'96%',
                    width:'96%',
                    listeners: { 
                        change:function(){
                            good_target_level(time_id);
                        },
                        blur: function(){
                            est_annual_revenue_func(time_id);
                           // good_target_level();
                        }
                    }
                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[{
                            xtype:'textfield',
                            regex: regexDecimal,
                            invalidText: lan.not_number,
                            fieldLabel: lan.est_exch_price,
                            id: 'est_exch_price_due_diligence'+time_id,
                            name: 'est_exch_price',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            flex:2,
                            listeners: { 
                                blur: function(){
                                    est_annual_revenue_func(time_id);
                                    }
                                }
                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                margin: '0 5 0 5',
                               //labelWidth: style.input2.labelWidth,
                                width: 40
                            },{
		                        xtype: 'datefield',
		                        format: 'Y-m-d', 
		                        altFormats: 'Y-m-d',
		                       //anchor:'96%',
		                        name: 'est_exch_price_date',
		                        fieldLabel: lan.estimated_price_date,
		                        hideLabel: true,
		                        height: '100%',
		                        //labelWidth: style.input2.labelWidth,
		                        flex:1
		                    }] 
                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[{
                            xtype:'textfield',
                            regex: regexDecimal,
                            invalidText: lan.not_number,
                            fieldLabel: lan.est_core_charge,
                            name: 'est_core_charge',
                            allowBlank: false,
                            labelWidth: style.input2.labelWidth,
                            flex:2,
                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                margin: '0 5 0 5',
                               //labelWidth: style.input2.labelWidth,
                                width: 40
                            },{
		                        xtype: 'datefield',
		                        format: 'Y-m-d', 
		                        altFormats: 'Y-m-d',
		                       //anchor:'96%',
		                        name: 'est_core_charge_date',
		                        fieldLabel: lan.estimated_core_date,
		                        hideLabel: true,
		                        height: '100%',
		                        //labelWidth: style.input2.labelWidth,
		                        flex:1
		                    }] 
                },
                {
                    xtype: 'container',
                    anchor: style.input2.anchor,
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items:[{
                                xtype:'numberfield',
                                fieldLabel: lan.est_annual_revenue,
                                id: 'est_annual_revenue_due_diligence'+time_id,
                                name: 'est_annual_revenue',
                                allowBlank: false,
                                labelWidth: style.input2.labelWidth,
                                readOnly: true,
                                flex:2,
                            },
                            {
                                xtype: "displayfield",                               
                                value: "USD",
                                margin: '0 5 0 5',
                               //labelWidth: style.input2.labelWidth,
                                width: 40
                            },{
		                        xtype: 'datefield',
		                        format: 'Y-m-d', 
		                        altFormats: 'Y-m-d',
		                       //anchor:'96%',
		                        name: 'est_annual_revenue_date',
		                        fieldLabel: lan.estimated_annual_date,
		                        hideLabel: true,
		                        height: '100%',
		                        //labelWidth: style.input2.labelWidth,
		                        flex:1
		                    }]
                },
                {
                    xtype:'numberfield',
                    fieldLabel: lan.finish_goods_target_lev,
                    id:'good_target_level'+time_id,
                    name: 'finish_goods_target_lev',
                    allowBlank: false,
                    allowDecimals: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly: true
                },
                {
                    xtype:'numberfield',
                    minValue:0,
                    allowExponential: false,
                    mouseWheelEnabled: false,
                    fieldLabel: lan.min_order_qty,
                    name: 'min_order_qty',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.spec_pack_req,
                    name: 'spec_pack_req',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.spec_label_req,
                    name: 'spec_label_req',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.spec_mark_req,
                    name: 'spec_mark_req',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.PriorityLevel,
                    name: 'PriorityLevel',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_PriorityLevel,
                    value:'1',
                    displayField: 'value',
                    valueField: 'id',
                    editable: false
    }]
}];
    return due_diligence;
}

function getCompetitorBlock(time_id){
    var  competitorBlock = {
                   // xtype: 'container',
                    xtype: 'fieldset',
                    title: lan.competitor,
                    //defaultType: 'textfield',
                    layout: 'anchor',
                    anchor: '96%', 
                    //id:'competitor_block'+container+time_id,
                    items: [{
                        xtype:'combobox',
                        fieldLabel: lan.competitor,
                        //id: 'competitor' + container+time_id,
                        //name: 'competitor[]',
                        name: 'competitor_name',
                        queryMode: 'remote',
                        //allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        editable: true,
                        enableKeyEvents: true,
                        labelWidth: style.input2.labelWidth,
                       // anchor:'96%',
                        store: store_competitor,
                        displayField: 'value',
                        valueField: 'value',
                        anchor: '100%', 
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: lan.competitor_cross_ref,
                        //id: 'competitor_cross_ref'+  container+time_id,
                        //name: 'competitor_cross_ref[]',
                        name: 'competitor_cross_ref',
                        //allowBlank: false,
                        labelWidth: style.input2.labelWidth,
                        anchor: '100%',
                    },
                    {
                        xtype: 'container',
                        anchor:'100%',
                        layout: 'hbox',
                        margin: '0 0 5 0',
                        items:[{
                                    xtype:'textfield',
                                    regex: regexDecimal,
                                    invalidText: lan.not_number,
                                    fieldLabel: lan.competitor_market_price,
                                    //id: 'competitor_market_price' + container+time_id,
                                    //name: 'competitor_market_price[]',
                                    name: 'competitor_market_price',
                                    //allowBlank: false,
                                    labelWidth: style.input2.labelWidth,
                                    //anchor:'96%',
                                    flex:2

                                },{
	                                xtype: "displayfield",                               
	                                value: "USD",
	                                margin: '0 5 0 5',
	                               //labelWidth: style.input2.labelWidth,
	                                width: 40
	                            },{
				                    xtype: 'datefield',
                                	format: 'Y-m-d',
                                	altFormats: 'Y-m-d',
			                        //id: 'MarketPriceDate'+ container+time_id,
			                       //anchor:'96%',
			                        //name: 'MarketPriceDate[]',
			                        name: 'MarketPriceDate',
			                        fieldLabel: lan.market_price_date,
			                        hideLabel: true,
			                        height: '100%',
			                        //labelWidth: style.input2.labelWidth,
			                        flex:1
			                    }]
                    },
                     {
                        xtype: 'container',
                        anchor:'100%',
                        layout: 'hbox',
                        margin: '0 0 5 0',
                        items:[
                                {
                                    xtype:'textfield',
                                    regex: regexDecimal,
                                    invalidText: lan.not_number,
                                    fieldLabel:lan.competitor_core_price,
                                    //id:  'competitor_core_price' + container+time_id,
                                    //name: 'competitor_core_price[]',
                                    name: 'competitor_core_price',
                                    //allowBlank: false,
                                    labelWidth: style.input2.labelWidth,
                                    //anchor:'96%',
                                    flex:2
                                },{
	                                xtype: "displayfield",                               
	                                value: "USD",
	                                margin: '0 5 0 5',
	                               //labelWidth: style.input2.labelWidth,
	                                width: 40
	                            },{
			                        xtype: 'datefield',
	                                format: 'Y-m-d',
	                                altFormats: 'Y-m-d',
			                        //id: 'CorePriceDate'+ container+time_id,
			                       //anchor:'96%',
			                        //name: 'CorePriceDate[]',
			                        name: 'CorePriceDate',
			                        fieldLabel: lan.core_price_date,
			                        hideLabel: true,
			                        height: '100%',
			                        //labelWidth: style.input2.labelWidth,
			                        flex:1
			                    }]
                    },
                    {
                    	xtype: 'button',
                        text : lan.del,
                        //id:'delete_competitor'+time_id,
                        margin: '0 0 5 0',
                        width: '20%',
                        handler: function() {
                        	var el = this.up('fieldset');
                        	Ext.getCmp('competitor_container'+time_id).remove(el);
                        }	
                    }]
                    }
                           
       return   competitorBlock;
}
