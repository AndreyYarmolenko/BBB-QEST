var hdadd = true, hdedit = true, hddelete = true, view = false, hdsearch = false, vis = true; 
var WindowComponent = null;
var WindowViewTables = null;

var store_bbb_sku_BOM = new Ext.data.Store({
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

var data_store_ProductType_BOM = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?productType=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_ProductLine_BOM = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?productLine=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_Material_BOM = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getMaterials=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});


var storeBOM= new Ext.data.Store({     
    fields: ['id', 'finish_good', 'comp_type', 'description', 'part_number', 'revision', 'create_date', 'qty', 'image1', 'drawing2d', 'drawing3d', 'in_house', 'out_source', 'reuse_from_core', 'add_spec', 'ppap'],
    proxy: {
        type: 'ajax',
        url: 'scripts/ecr_form.php?getBOMComponents=true',
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    },
    sorters: [{
            property: 'comp_type',
    }]
});

function setTextBOM(value, time_id){
    var text = "";
    if(value == 2) text = 'Rejected';
        else if(value == 1) text = 'Approved';
            else if(!value||value == 0) text = 'In Progress';
            	else if(!value||value == 3) text = 'New';
                	else text = 'N/A';
    return '<div style="float:right; font-size: 13px; line-height: 1em; margin-right: 20px;">'+ text + '</div>';
}

var ppapSampleEditor = function(record){
    var comp_type = Number(record.get('comp_type'));
    var readStatus;
    switch (comp_type){
        case 3: 
        case 4: 
            readStatus = true;
        break;
        default: 
            readStatus = false;
        break;
    }
    
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            maxValue:30,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly:readStatus
        }
    });
}


function addBOMGrid(inData) {
    var time_id = Date.parse(new Date());
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;
    var case_type = 'dir';

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

    var data_store = new Ext.data.Store({
        fields: ['id', {type: 'string', name: 'bbb_sku'}, {type: 'string', name: 'product_line'}, {type: 'string', name: 'product_type'}, 'bom_revision', 'last_mod'],
        autoLoad: true,
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=bom',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: data_store,
        displayInfo: true
    });

    var grid = {
        xtype: 'grid',
        layout: 'fit',
        columnLines: true,
        id: 'bom_grid_'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: data_store,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },
        dockedItems: [{
                xtype: 'toolbar',
                border: false,
                items: [{
                        text: lan.add,
                        iconCls: 'add',
                        width: 110,
                        disabled:disable_add,//rights rule
                        handler: function() {
                            var form_bom = getItemFormBOM({time_id: time_id, action: 'add', case_type: case_type});
                            showObject({id:time_id, title: lan.create_new_bom, item: form_bom, sizeX: '100%', sizeY: '100%'});
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        width: 110,
                        disabled:disable_edit,//rights rule
                        handler: function() {
                           var select = this.up('grid').getView().getSelectionModel().getSelection()[0];
                            if(select){
                                var viewTitle = lan.bbb_sku+":  "+select.get('bbb_sku');
                                var form_bom = getItemFormBOM({time_id: time_id, bom_id: select.get('id'), action: 'edit', case_type: case_type});
                                showObject({id:time_id, title: viewTitle, item: form_bom, sizeX: '100%', sizeY: '100%'});
                                }
                                else Ext.MessageBox.alert(lan.error, lan.select_row);
                        }
                    },{
                        text: lan.del,
                        iconCls: 'delete',
                        width: 110,
                        disabled: disable_delete,//rights rule
                        handler: function() {
                           var select = Ext.getCmp('bom_grid_'+time_id).getView().getSelectionModel().getSelection()[0];
                            Ext.Ajax.request({
                                url: 'scripts/ecr_form.php?deleteSKU=true',
                                method: 'POST',
                                params: {
                                	sku_id: select.get('id')
                                },
                                success: function(response) {
                                    var JSON = response.responseText;
                                    if (JSON) {
                                        var data = Ext.decode(JSON);
                                        Ext.MessageBox.alert(lan.skill, data.message);
                                        Ext.getCmp('bom_grid_'+time_id).getStore().load();
                                    }
                                },
                                failure: function(response) {
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'search',
                        emptyText: lan.search,
                        hidden: hdsearch,
                        labelWidth: style.input2.labelWidth,
                        width: '48%',
                        listeners:{
                            change: function () {
                                var val = this.value;
                                    data_store.load({
                                    params: {search: val}
                                });
                            }
                        }
                    }
                ]
        }],
        bbar: [PagingToolbar],
        columns: [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false, width: 40},
                {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, flex: 1},
                {text: 'Status', dataIndex: 'sku_status', sortable: true, flex: 1, renderer: setBOMStatus},
                {text: lan.product_line, dataIndex: 'product_line', sortable: true, flex: 2},
                {text: lan.product_type, dataIndex: 'product_type', sortable: true, flex: 2},
                {text: lan.revision, dataIndex: 'bom_revision', sortable: true, flex: 1},
                {text: lan.last_vers, dataIndex: 'last_mod', sortable: true, flex: 1}],
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                if(record){
                    var viewTitle = lan.bbb_sku+":  "+record.get('bbb_sku');
                    var form_bom = getItemFormBOM({time_id: time_id, bom_id: record.get('id'), action: 'edit', case_type: case_type});
                    showObject({id:time_id, title: viewTitle, item: form_bom, sizeX: '100%', sizeY: '100%'});
                    }
                    else Ext.MessageBox.alert(lan.error, lan.select_row);
            }
        }
    }
    return grid;
}

function getGridBOM(time_id, titleBOM, view, case_type='bom'){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(all_rights.bom&&!view){//rights rule
        var rights = all_rights.bom;
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    var actioncolumn1 = getActionColumn('image1');
    var actioncolumn2d = getActionColumn('drawing2d');
    var actioncolumn3d = getActionColumn('drawing3d');
    var actionLink = getActionLink('add_spec');
    var actionTask = getActionTask('ppap_result');
    storeBOM.removeAll();
    var gridBOM = Ext.create('Ext.grid.Panel', {
    store: storeBOM,
    id: 'gridbom'+time_id,
    title: titleBOM,
    minHeight: '350',
    width: '100%',
    border: true,
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        listeners: {
            beforeedit: function(e, editor){
                var sku_status = Ext.getCmp('sku_status'+time_id).getValue();
                        if(sku_status==1) {
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
            text: 'Add Existing Component',
            id: 'bom_add'+time_id,
            hidden: view,
            disabled: disable_edit,//rights rule
            flex: 1,
            handler: function() {
                var new_time_id = time_id-100000;
                var comp_grid = addComponentsGrid({time_id: new_time_id, case_type: case_type, rights: all_rights['comp_part_number']});
                var buttons = Ext.getCmp('UpperToolbar'+new_time_id).query('button');
                for(var i = 0; i<buttons.length; i++){
                    if(buttons[i].iconCls=='showpic'||buttons[i].iconCls=='work'){
                        buttons[i].setConfig('hidden', false);
                    }
                    else {
                        buttons[i].setConfig('hidden', true);
                    }
                }
                 showObject({id:time_id, title: 'Select Component', item: comp_grid, sizeX: '90%', sizeY: '90%'});
                }
            },{ 
            xtype: 'button',
            text: lan.create_new_comp,
            id: 'bom_create'+time_id,
            hidden: view,
            disabled: disable_add,//rights rule
            flex: 1,
            handler: function() {
               var new_time_id = time_id - 100000;
                    var dialog_win = getDialogWin({time_id:new_time_id, case_type:'bom'});
                    showObject({id:new_time_id, title: 'Select Component Type', item: dialog_win, sizeX: 300, sizeY: 200});
                }
            }]
    }],
    columns: [
        {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
        {text: 'TYPE', sortable: true, dataIndex: 'comp_type', width: 100, renderer: setCompType},
        {text: lan.description, sortable: false, dataIndex: 'description', width: 200},
        {text: lan.comp_p_n, sortable: true, dataIndex: 'part_number', width: 150},
        {text: lan.revision, sortable: true, dataIndex: 'revision', width: 100},
        {text: lan.create_date, sortable: true, dataIndex: 'create_date', width: 100},
        {text: lan.qty, editor: {xtype: 'numberfield', minValue:0, allowExponential: false, readOnly: view,mouseWheelEnabled: false}, sortable: true, dataIndex: 'qty', width: 110},
        {text: lan.Image,xtype:'actioncolumn',dataIndex: 'image1',width:80,sortable:true,items:[actioncolumn1]},
        {text: lan.two_d,xtype:'actioncolumn',dataIndex: 'drawing2d',width:120,sortable:true,items:[actioncolumn2d]},
        {text: lan.three_d,xtype:'actioncolumn',dataIndex: 'drawing3d',width:120,sortable:true,items:[actioncolumn3d]},
        {text: lan.in_house,xtype: 'checkcolumn', dataIndex: 'in_house', disabled:view, width: 110},
        {text: lan.out_sourse, xtype: 'checkcolumn', dataIndex: 'out_source', disabled:view,width: 110},
        {text: lan.reuse_core, xtype: 'checkcolumn', dataIndex: 'reuse_from_core', disabled:view, width: 150},
        {text: lan.ppap_sample_size, sortable: true, dataIndex: 'ppap', width: 200, getEditor: ppapSampleEditor},
        {text: lan.ppap_res, xtype:'actioncolumn', sortable: false, dataIndex: 'ppap_result', width: 120, items:[actionTask], renderer: function(value) {return setTextBOM(value);}},
        {xtype:'actioncolumn', width:30, hidden: false, dataIndex: 'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                   if(view ===false){
                                        var rec = grid.getStore().getAt(rowIndex);
                                        if(rec.get('comp_type')==1) storeBOM.removeAll();
                                        	else storeBOM.remove(rec);
                                   } 
                                 }
                            }]
        }
     ],
    listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
               if (record) {
                    var comp_type = record.get('comp_type');
                    var comp_type_name = "";
                    storeCompTypes.each(function(rec){
                        if(rec.get('id')==comp_type){
                            comp_type_name = rec.get('value');
                        }
                    });

                    var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type, name: comp_type_name}, action: 'view', comp_id:record.get('id'), case_type: 'bom'});
                    setBlockForm(comp_form, time_id);
                    if(comp_type==3){
                        setColumnHidden('kit_table'+time_id);
                    }
                    else {
                        setColumnHidden('dim_attr_table'+time_id);
                        setColumnHidden('func_attr_table'+time_id);
                    }
                    showObject({id:time_id, title: 'View Component', item: comp_form, sizeX: '100%', sizeY: '100%'});
                } else {
                    Ext.MessageBox.alert(lan.error, lan.select_row);
                }
        }
    }
});
    return gridBOM;
}


function getItemFormBOM(inData){
    if(inData.time_id){
        var time_id = inData.time_id;
    }
    else {
        return;
    }

    var action = 'view';
    if(inData.action){
        action = inData.action;
    }

    var case_type = 'dir';
    if(inData.case_type){
        case_type = inData.case_type;
    }

    store_bbb_sku_BOM.load();
    data_store_ProductType_BOM.load();
    data_store_ProductLine_BOM.load();
    
    if(action=='view'){
        var view = true;
    }
    var gridBOM = getGridBOM(time_id, lan.components, view);

    var form_bom_item = [{
            xtype: 'container',
            layout: 'anchor',
            items: [{
                xtype: 'container',
                anchor:'100%',
                margin: '10',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.bbb_sku,
                    labelAlign: 'top',
                    name: 'sku_name',
                    allowBlank: false,
                    typeAhead: true,
                    lazyRender: true,
                    store: store_bbb_sku_BOM,
                    displayField: 'value',
                    valueField: 'value',
                    vtype: 'nameValid',
                    minWidth: 150,
                    flex:1,
                   /* validator: function (val) {
                        var newbom = Ext.getCmp('newbom'+time_id).getValue();
                            errMsg = lan.bbb_sku_is_exist;
                        return (newbom==1&&store_bbb_sku_BOM.find('value', val)!=-1) ? errMsg : true;
                    },
                    listeners:{
                        select: function(){
                           var val = Ext.getCmp('bbb_sku_bom'+time_id).getValue();
                            storeBOM.load({
                                params:{
                                    bbb_sku: val
                                }
                            });
                        }
                    }*/
                        },{
                        	xtype: 'hidden',
                        	name: 'sku_id'
                        },{
                            xtype:'textfield',
                            fieldLabel: lan.revision+':',
                            labelAlign: 'top',
                            name: 'revision',
                            enableKeyEvents: true,
                            margin: '0 0 0 10px',
                            readOnly:true,
                            minWidth: 100,
                            flex:1
                        },{
                            xtype:'combobox',
                            fieldLabel: 'Status:',
                            id: 'sku_status'+time_id,
                            labelAlign: 'top',
                            name: 'sku_status',
                            store: storeCompStatuses,
                            displayField: 'value',
                            valueField: 'id',
                            margin: '0 0 0 10px',
                            readOnly:true,
                            minWidth: 100,
                            flex:1,
                            listeners: {
                                change: function(){
                                    var sku_status = this.getValue();
                                    var color_bg = "";
                                    switch(sku_status){
                                        case 0:
                                            color_bg = "#808080";
                                        break;
                                        case 1:
                                            color_bg = "#008000";
                                        break;
                                        case 2:
                                            color_bg = "#CD5C5C";
                                        break;
                                        case 3:
                                            color_bg = "#4169E1";
                                        break;
                                    }
                                    this.setConfig("fieldStyle", "text-align: center; color:#FFF; background: "+color_bg+";");
                                }
                            }
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
                        xtype:'combobox',
                        fieldLabel: lan.product_type,
                        name: 'ProductType',
                        allowBlank: false,
                        labelWidth: style.input2.labelWidth,
                        store: data_store_ProductType_BOM,
                        displayField: 'value',
                        valueField: 'id',
                        editable: false,
        				anchor: '100%',
        				margin: '10px'
                    },{                       
                        xtype:'combobox',
                        fieldLabel: lan.product_line,
                        name: 'ProductLine',
                        allowBlank: false,
                        labelWidth: style.input2.labelWidth,
                        store: data_store_ProductLine_BOM,
                        displayField: 'value',
                        valueField: 'id',
                        editable: false,
        				anchor: '100%',
        				margin: '10px'
                    },{
                    	xtype:'hidden',
                    	name: 'bom_id'
                    }, gridBOM]
            }];

    var form_bom = new Ext.create('Ext.form.Panel', {
                    id:'bom_form'+time_id,
                    bodyPadding: 10,
                    defaults: {
                        anchor: '100%',
                        labelWidth: 100
                    },
                    autoScroll: true,
                    items:form_bom_item,
                    buttons: [{
                        xtype: 'button',
                        text: lan.save_bom,
                        id: 'bom_form_save_btn'+time_id,
                        handler: function() {
                            var form = this.up('form').getForm();
                            var validForm = true;
                            if(storeBOM.data.length==0){
                                validForm =  false;
                                Ext.MessageBox.alert(lan.error, lan.can_not_save_bom);
                            }
                            else {
                                storeBOM.each(function(record){
                                    if(record.get('qty')==null || record.get('qty')==0) {
                                        Ext.MessageBox.alert(lan.error, lan.qty_not_fil);
                                        validForm = false;
                                    }
                                });
                            }
                            if(form.isValid() && validForm) {
                                var bomJS = getStoreBOM(time_id);
                                var params = {
                                	func:'add', 
                                	table:'bom', 
                                	action: action, 
                                	bom: bomJS, 
                                	case_type: case_type
                                };

                                form.submit({
                                    url: 'scripts/saveformref.php',
                                    waitMsg: lan.saving,
                                    wait: true,
                                    scope: this,
                                    method: 'post',
                                    params: params,
                                    success: function(form, action) {
                                        store_bbb_sku_BOM.load();
                                        Ext.getCmp('bom_grid_'+time_id).getStore().load();
                                        Ext.WindowMgr.each(function(win){
				                            win.destroy();
				                        });
                                    },
                                    failure: function(form, action) {
                                        var data = Ext.decode(action.response.responseText);
                                        var msg = lan.savingErr;
                                        if(data){
                                            msg = data.message;
                                        }
                                        Ext.MessageBox.alert(lan.error, msg);
                                    }
                                });

                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: lan.creat_pdf,
                        hidden: vis,
                        id: "pdf",
                        handler: function() {
                            var prodType = Ext.getCmp('ProductType'+time_id).rawValue;
                            var prodLine = Ext.getCmp('ProductLine'+time_id).rawValue;
                            var bbbSkuBom = Ext.getCmp('bbb_sku_bom'+time_id).rawValue;
                            Ext.Ajax.request({
                            url: 'scripts/datastore.php?func=bom_pdf',
                            method: 'POST',
                            params: {
                                //prodType: prodType,
                                //prodLine: prodLine,
                                //bbbSkuBom: bbbSkuBom,
                                dataForPdf: getStoreBomAll()
                            },
                            success: function(response) {
                                var obj = JSON.parse(response.responseText);
                                if(obj.success){
                                     location.href = 'scripts/datastore.php?download=SaveBomPDF';
                                }   
                            },
                            failure: function(response) {
                                Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                            function getStoreBomAll() {
                                var bom = [];
                                //bom.push({prodType: prodType, prodLine: prodLine, bbbSkuBom: bbbSkuBom});
                                storeBOM.each(function(record){
                                   bom.push({prodType: prodType, prodLine: prodLine, bbbSkuBom: bbbSkuBom, id:record.get('id'), description: record.get('description'), part_number: record.get('part_number'), revision: record.get('revision'), qty: record.get('qty'), image1: record.get('image1'), drawing2d: record.get('drawing2d'), drawing3d: record.get('drawing3d'), in_house: record.get('in_house'), out_source: record.get('out_source'), reuse_from_core: record.get('reuse_from_core'), add_spec: record.get('add_spec'), ppap: record.get('ppap'), ppap_result: record.get('ppap_result')});
                                });
                                if(bom.length !=0) {
                                    var bomJS = JSON.stringify(bom);
                                }
                                else bomJS= null;   
                                return bomJS;
                            }
                        }
                    }
                    ],
                    listeners: {
                        afterrender: function(){
                            if(inData.bom_id){
                                setBOMForm({time_id: time_id, bom_id:inData.bom_id, action: action});
                            }
                        }
                    }
            });

    return form_bom;
}

function setBOMForm(inData){
    if(inData.time_id&&inData.bom_id){
        storeCompStatuses.load();
        var action = 'edit';
        if(inData.action){
            action = inData.action;
        }

        Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getBOMDescription=true',
            method: 'POST',
            params: {
                id_sku: inData.bom_id
            },
            success: function(response) {
                var JSON = response.responseText;
                if (JSON) {
                    var data = Ext.decode(JSON);
                    var fields = Ext.getCmp('bom_form'+inData.time_id).getForm().getFields();
                    
                    fields.each(function(item){
                        for (var k in data){
                            if(item.getName() == k && data[k]!=null){
                                item.setValue(data[k]);
                                }
                            }
                    });
                    var sku_status = Ext.getCmp('sku_status'+inData.time_id).getValue();
                    if(sku_status==1||action=='view'){
                        fields.each(function(item){
                            item.setConfig('readOnly', true);
                        });
                        setBOMReadOnly(inData.time_id);
                        Ext.get('bom_form_save_btn'+inData.time_id).hide();
                    }
                    

                    Ext.getCmp('gridbom'+inData.time_id).getStore().load({
                        params: {
                            bbb_sku: inData.bom_id
                        }
                    });
                    //Ext.MessageBox.alert(lan.skill, data.message);
                }
            },
            failure: function(response) {
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
    }
}
