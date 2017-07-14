var storePartNumber = new Ext.data.Store({     
        fields: ['id', 'part_number'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getPartNumbers=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var  store_bbb_sku_PPAP = new Ext.data.Store({
       // autoLoad: true,
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

var storeFiles = new Ext.data.Store({     
        fields: ['name', 'document']
    });

function getDimStore(time_id, qty){
    var storeDim= new Ext.data.Store({     
        fields: ['id', 'critical', 'dimension_name', 'metric', 'dimension', 'tolerance_plus', 'tolerance_minus', 'tool_gage', 'actual1', 'actual2', 'actual3', 'actual4', 'actual5', 'actual6', 'actual7', 'actual8', 'actual9', 'actual10', 'actual11', 'actual12', 'actual13', 'actual14', 'actual15', 'actual16', 'actual17', 'actual18', 'actual19', 'actual20', 'actual21', 'actual22', 'actual23', 'actual24', 'actual25', 'actual26', 'actual27', 'actual28', 'actual29', 'actual30'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getDimAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        },
        storeId: 'dim_attr'+time_id,
    });
    return storeDim;

}


function getFuncStore(time_id, qty){
var storeFunc= new Ext.data.Store({    
        fields: ['id', 'critical', 'value_desc', 'metric', 'nominal', 'tolerance_plus', 'tolerance_minus', 'equipment', 'equipment_id', 'test_procedure', 'test_procedure_id'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getFuncAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        },
        storeId: 'func_attr'+time_id,
    });
return storeFunc;
}

function getGridDimPPAP(time_id){
	store_metricDim.load();
	var comboYESNOPPAP = getComboYESNO(true);
	var storeDimesionalPPAP = getDimStore(time_id);

	var metricDimPPAP = new Ext.form.ComboBox({
	    allowBlank: true,
	    typeAhead: true,
	    id: 'metricDimPPAP'+time_id,
	    triggerAction: 'all',
	    lazyRender: true,
	    store: store_metricDim,
	    displayField: 'name',
	    valueField: 'id',
	    readOnly: true,
	    value: 1
	});

	storeGages.load();

	var gageEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeGages,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                	var tool_gage = this.component.value;
                	var re = /^[1-9]+[0-9]*/;
                  	if(tool_gage&&re.test(tool_gage)){
                        showWindowDirectory("", 'view', time_id, lan.view_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool, tool_gage, true, true);
                    }
                }
            }
        }
    });

	var gridDimPPAP = Ext.create('Ext.grid.Panel', {
	    store: storeDimesionalPPAP,
	    id: 'gridDimPPAP'+time_id,
	    title: lan.dimension_ppap_require,
	    height: 300,
	    anchor: '96%',
	    margin: '5 0',
	    frame: true,
	    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
	    columns: [
	        {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
	        {text: lan.critical, readOnly: true, editor: comboYESNOPPAP, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNOPPAP), this), sortable: false, dataIndex: 'critical', width: 90},
	        {text: lan.dimension_name, readOnly: true, dataIndex: 'dimension_name', width: 150},
	        {text: lan.units, editor: metricDimPPAP, sortable: true, dataIndex: 'metric', renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(metricDimPPAP), this), width: 110},
	        {text: lan.dimension, dataIndex: 'dimension', width: 150},
	        {text: lan.toler_plus,  dataIndex: 'tolerance_plus', width: 150},
	        {text: lan.toler_minus,  dataIndex: 'tolerance_minus', width: 150},
	        {text: lan.gage, editor: gageEditor, dataIndex: 'tool_gage_id', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(gageEditor), this)},
	        {text: lan.actual_value+'1', id: 'avd1'+time_id, hidden: true, sortable: false, dataIndex: 'actual1', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'2', id: 'avd2'+time_id, hidden: true,sortable: false, dataIndex: 'actual2', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'3', id: 'avd3'+time_id, hidden: true,sortable: false, dataIndex: 'actual3', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'4', id: 'avd4'+time_id, hidden: true,sortable: false, dataIndex: 'actual4', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'5', id: 'avd5'+time_id, hidden: true,sortable: false, dataIndex: 'actual5', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'6', id: 'avd6'+time_id, hidden: true,sortable: false, dataIndex: 'actual6', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'7', id: 'avd7'+time_id, hidden: true,sortable: false, dataIndex: 'actual7', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'8', id: 'avd8'+time_id, hidden: true,sortable: false, dataIndex: 'actual8', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'9', id: 'avd9'+time_id, hidden: true,sortable: false, dataIndex: 'actual9', width: 150, renderer: setbgDim},
	       	{text: lan.actual_value+'10', id: 'avd10'+time_id, hidden: true,sortable: false, dataIndex: 'actual10', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'11', id: 'avd11'+time_id, hidden: true,sortable: false, dataIndex: 'actual11', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'12', id: 'avd12'+time_id, hidden: true,sortable: false, dataIndex: 'actual12', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'13', id: 'avd13'+time_id, hidden: true,sortable: false, dataIndex: 'actual13', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'14', id: 'avd14'+time_id, hidden: true,sortable: false, dataIndex: 'actual14', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'15', id: 'avd15'+time_id, hidden: true,sortable: false, dataIndex: 'actual15', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'16', id: 'avd16'+time_id, hidden: true,sortable: false, dataIndex: 'actual16', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'17', id: 'avd17'+time_id, hidden: true,sortable: false, dataIndex: 'actual17', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'18', id: 'avd18'+time_id, hidden: true,sortable: false, dataIndex: 'actual18', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'19', id: 'avd19'+time_id, hidden: true,sortable: false, dataIndex: 'actual19', width: 150, renderer: setbgDim},
	       	{text: lan.actual_value+'20', id: 'avd20'+time_id, hidden: true,sortable: false, dataIndex: 'actual20', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'21', id: 'avd21'+time_id, hidden: true,sortable: false, dataIndex: 'actual21', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'22', id: 'avd22'+time_id, hidden: true,sortable: false, dataIndex: 'actual22', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'23', id: 'avd23'+time_id, hidden: true,sortable: false, dataIndex: 'actual23', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'24', id: 'avd24'+time_id, hidden: true,sortable: false, dataIndex: 'actual24', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'25', id: 'avd25'+time_id, hidden: true,sortable: false, dataIndex: 'actual25', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'26', id: 'avd26'+time_id, hidden: true,sortable: false, dataIndex: 'actual26', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'27', id: 'avd27'+time_id, hidden: true,sortable: false, dataIndex: 'actual27', width: 150, renderer: setbgDim},
	        {text: lan.actual_value+'28', id: 'avd28'+time_id, hidden: true,sortable: false, dataIndex: 'actual28', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'29', id: 'avd29'+time_id, hidden: true,sortable: false, dataIndex: 'actual29', width: 150, renderer: setbgDim},
			{text: lan.actual_value+'30', id: 'avd30'+time_id, hidden: true,sortable: false, dataIndex: 'actual30', width: 150, renderer: setbgDim}],
	       /* listeners: {
	            celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
	                if(cellIndex==7){
	                	showWindowDirectory("", 'view', time_id, lan.view_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('tool_gage_id'), true, true);
	                }
	            }
	        }*/
	});
	return gridDimPPAP;
}

function getGridFuncPPAP(time_id){
	 store_metricFunc.load();

	 storeTestProc.load();
    storeEquipment.load();

	var comboYESNO2PPAP = getComboYESNO(true);
	var metricFuncPPAP = new Ext.form.ComboBox({
	    typeAhead: true,
	    id: 'metricFuncPPAP'+time_id,
	    triggerAction: 'all',
	    lazyRender: true,
	    store: store_metricFunc,
	    displayField: 'name',
	    valueField: 'id',
	    readOnly: true,
	    value: 1
	});

	var equipmentEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeEquipment,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                    var equip = this.component.value;
                	var re = /^[1-9]+[0-9]*/;
                  	if(equip&&re.test(equip)){
                        showWindowDirectory("", 'view', time_id, lan.edit_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, equip, true, true);
                    }
                }
            }
        }
    });	

   var testProcEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeTestProc,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                    var test_procedure = this.component.value;
                	var re = /^[1-9]+[0-9]*/;
                  	if(test_procedure&&re.test(test_procedure)){
                        var inData = {id:time_id, el_id: test_procedure, edit: true};
                    	showTestProcedure(inData);
                    }
                }
            }
        }
    });

var storeFunctionalPPAP = getFuncStore(time_id);

var gridFuncPPAP = Ext.create('Ext.grid.Panel', {
	    store: storeFunctionalPPAP,
	    id: 'gridFuncPPAP'+time_id,
	    title: lan.func_ppap_require,
	    height: 300,
	    anchor: '96%',
	    margin: '5 0',
	    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
	    frame: true,
	    columns: [
	        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
	        {text: lan.critical, readOnly: true, editor: comboYESNO2PPAP, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNO2PPAP), this), sortable: false, dataIndex: 'critical', width: 90},
	        {text: lan.value_desc, readOnly: true, sortable: true, dataIndex: 'value_desc', width: 150},
	        {text: lan.units, editor: metricFuncPPAP, sortable: true, dataIndex: 'metric', width: 110, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(metricFuncPPAP), this)},
	        {text: lan.nominal, dataIndex: 'nominal', width: 150},
	        {text: lan.toler_plus, dataIndex: 'tolerance_plus', width: 150},
	        {text: lan.toler_minus, dataIndex: 'tolerance_minus', width: 150},
	        {text: lan.equipment, editor:equipmentEditor, sortable: true, dataIndex: 'equipment_id', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(equipmentEditor), this)},
	        {text: lan.test_procedure, editor: testProcEditor, dataIndex: 'test_procedure_id', width: 150, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(testProcEditor), this)},
	        {text: lan.actual_value+'1', id: 'avf1'+time_id, hidden: true, sortable: true, dataIndex: 'actual1', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'2', id: 'avf2'+time_id, hidden: true, sortable: true, dataIndex: 'actual2', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'3', id: 'avf3'+time_id, hidden: true, sortable: true, dataIndex: 'actual3', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'4', id: 'avf4'+time_id, hidden: true, sortable: true, dataIndex: 'actual4', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'5', id: 'avf5'+time_id, hidden: true, sortable: true, dataIndex: 'actual5', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'6', id: 'avf6'+time_id, hidden: true, sortable: true, dataIndex: 'actual6', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'7', id: 'avf7'+time_id, hidden: true, sortable: true, dataIndex: 'actual7', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'8', id: 'avf8'+time_id, hidden: true, sortable: true, dataIndex: 'actual8', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'9', id: 'avf9'+time_id, hidden: true, sortable: true, dataIndex: 'actual9', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'10', id: 'avf10'+time_id, hidden: true, sortable: true, dataIndex: 'actual10', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'11', id: 'avf11'+time_id, hidden: true, sortable: true, dataIndex: 'actual11', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'12', id: 'avf12'+time_id, hidden: true, sortable: true, dataIndex: 'actual12', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'13', id: 'avf13'+time_id, hidden: true, sortable: true, dataIndex: 'actual13', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'14', id: 'avf14'+time_id, hidden: true, sortable: true, dataIndex: 'actual14', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'15', id: 'avf15'+time_id, hidden: true, sortable: true, dataIndex: 'actual15', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'16', id: 'avf16'+time_id, hidden: true, sortable: true, dataIndex: 'actual16', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'17', id: 'avf17'+time_id, hidden: true, sortable: true, dataIndex: 'actual17', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'18', id: 'avf18'+time_id, hidden: true, sortable: true, dataIndex: 'actual18', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'19', id: 'avf19'+time_id, hidden: true, sortable: true, dataIndex: 'actual19', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'20', id: 'avf20'+time_id, hidden: true, sortable: true, dataIndex: 'actual20', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'21', id: 'avf21'+time_id, hidden: true, sortable: true, dataIndex: 'actual21', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'22', id: 'avf22'+time_id, hidden: true, sortable: true, dataIndex: 'actual22', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'23', id: 'avf23'+time_id, hidden: true, sortable: true, dataIndex: 'actual23', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'25', id: 'avf25'+time_id, hidden: true, sortable: true, dataIndex: 'actual25', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'26', id: 'avf26'+time_id, hidden: true, sortable: true, dataIndex: 'actual26', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'27', id: 'avf27'+time_id, hidden: true, sortable: true, dataIndex: 'actual27', width: 150, renderer: setbgFunc},
	        {text: lan.actual_value+'28', id: 'avf28'+time_id, hidden: true, sortable: true, dataIndex: 'actual28', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'29', id: 'avf29'+time_id, hidden: true, sortable: true, dataIndex: 'actual29', width: 150, renderer: setbgFunc},
			{text: lan.actual_value+'30', id: 'avf30'+time_id, hidden: true, sortable: true, dataIndex: 'actual30', width: 150, renderer: setbgFunc}],
	   /* listeners: {
	        celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
	            if(cellIndex==7){
	            	showWindowDirectory("", 'view', time_id, lan.view_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, record.get('equipment_id'));
	            }
	            if(cellIndex==9){
	            	var inData = {id:time_id, el_id: record.get('test_procedure_id'), edit: true};
                    showTestProcedure(inData);
	            }
	        }
	    }*/
	});
	return gridFuncPPAP;
}

function getPPAPitem(time_id, review){
	var show_review =  true;
    data_store_YESNO.load();
    var readStatus = false;
    var hideStatus = false;
    var gridDimPPAP = getGridDimPPAP(time_id);
    var gridFuncPPAP = getGridFuncPPAP(time_id);

var pfmeaItem = getUploadItem('pfmea'+time_id, 'pfmea', lan.pfmea, review, storeFiles);
var dfmeaItem = getUploadItem('dfmea'+time_id, 'dfmea', lan.dfmea, review, storeFiles);
var contr_planItem = getUploadItem('contr_plan'+time_id, 'contr_plan', lan.control_plan, review, storeFiles);
var mat_certItem = getUploadItem('mat_cert'+time_id, 'mat_cert', lan.materials_certificate, review, storeFiles);

var filePanel = Ext.create('Ext.panel.Panel', {
    bodyPadding: 5,
    title: lan.files+':',
    anchor:'96%',
    frame: true,
    items: [pfmeaItem, dfmeaItem, contr_planItem, mat_certItem]
});

if(review) {
	show_review =false;
}

var ppap_item = [{
                xtype:'hidden',
                name:'time_id',
                id: 'time_id'+time_id
            },{
                xtype: 'container',
                layout: 'anchor',
                id: 'ppap_item'+time_id,
                items: [{
                xtype:'combobox',
                fieldLabel: lan.ProductLine,
                name: 'ProductLine',
                //allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
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
                //allowBlank: false,
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
                    id: 'bbb_sku_reverse_eng'+time_id,
                    name: 'bbb_sku',
                    typeAhead: true,
                    lazyRender: true,
                    editable: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_bbb_sku_PPAP,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.core_sku,
                    name: 'core_sku',
                    //allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    hidden:false,
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_latest_sku,
                    name: 'oe_latest_sku',
                    //allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.oe_reman_sku,
                    name: 'oe_reman_sku',
                    //allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    },
                    {
                    xtype:'textfield',
                    fieldLabel: lan.Application,
                    name: 'Application',
                    id: 'app'+time_id,
                    //allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
                    },
					{
                    xtype:'combobox',
                    fieldLabel: lan.comp_part_number+':',
                    id: 'part_number'+time_id,
                    name: 'id_part_number',
                    typeAhead: true,
                    lazyRender: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: storePartNumber,
                    displayField: 'part_number',
                    valueField: 'id',
                    readOnly:true,
					},
                    {
                    xtype:'textfield',
                    fieldLabel: lan.ppap_sample_size,
					id: 'ppap_qty'+time_id,
                    name: 'qty',
                    allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:true,
					listeners:{
						change: function(){
                            if(review === true) {
                                var qty = Ext.getCmp('ppap_qty'+time_id).getValue();
                            for(var i=1; i<=qty; i++){
                            	if(Ext.getCmp('avf'+i+time_id)){Ext.getCmp('avf'+i+time_id).show();}
                            	if(Ext.getCmp('avd'+i+time_id)){Ext.getCmp('avd'+i+time_id).show();}
                                }
                            }
						}
					}
                    },{
                    xtype:'combobox',
                    fieldLabel: lan.external_data,
                    id: 'outsource_draft'+time_id,
                    name: 'outsource_draft',
                    typeAhead: true,
                    lazyRender: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: data_store_NOYES,
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true,
                    hidden: show_review,
                    },gridDimPPAP, gridFuncPPAP, filePanel,
                    {
                    xtype:'textfield',
                    fieldLabel: lan.outsourcer_company+':',
                    name: 'outsource_company',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    readOnly:review
                    },{   
                        xtype: 'textfield',
                        fieldLabel: lan.email,
                        name: 'email',
                        id: 'email'+time_id,
                        labelWidth: style.input2.labelWidth,
                        allowBlank: false,
                        vtype:'email',
                        anchor:'96%',
                        //readOnly:review
                    },{
                        xtype:'textareafield',
                        grow:true,
                        labelWidth: style.input2.labelWidth,
                        name: 'notes',
                        fieldLabel: lan.notes,
                        anchor:'96%',
                        readOnly:review
                    },
                {
                    xtype: 'button',
                    text : lan.resend_email,
                    hidden: show_review,
                    handler: function() {
                       var email = Ext.getCmp('email'+time_id).getValue();
                       var RequestID = this.up('form').getForm().findField("RequestID").getValue();
                       var idx = this.up('form').getForm().findField("idx").getValue();
                       var id_part_number = Ext.getCmp('part_number'+time_id).getValue();
                        if (email&&email.trim()!='') {
                              Ext.Ajax.request({
                                url: 'scripts/ecr_form.php?resendEmail=true',
                                method: 'POST',
                                params: {
                                    RequestID: RequestID,
                                    id_part_number: id_part_number,
                                    idx: idx,
                                    email: email
                                    },
                                success: function (response){
                                   var data = Ext.decode(response.responseText);
                                   Ext.MessageBox.alert(lan.succ, data.message);
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                          }
            		}
            	},
            	{
            		xtype: "button",
            		iconCls: 'exel_ico',
            		text: lan.export_xlsx,
            		hidden: show_review,
            		margin: "0 0 0 10",
            		disabled: false,
            		id: "export_ppap"+time_id,
            		handler: function() {
            			var box = Ext.MessageBox.wait(lan.mess_file_form, lan.export_xlsx);
            			var storeDimesionalPPAP = Ext.getCmp('gridDimPPAP'+time_id).getStore();
            			var storeFunctionalPPAP = Ext.getCmp('gridFuncPPAP'+time_id).getStore();
            			Ext.Ajax.request({
            				method: "POST",
            				url: "scripts/export_ppap.php?exportPPAP=true",
            				params: {
            					storeDim: convertStore(storeDimesionalPPAP),
            					storeFunc: convertStore(storeFunctionalPPAP),
            					app: Ext.getCmp('app'+time_id).getValue(),
            					partNumb: Ext.getCmp('part_number'+time_id).rawValue
            				},
            				success: function (response){
            					var data = Ext.decode(response.responseText);
            					if(data.success) {
            						var downloadUrl = 'scripts/export_ppap.php?downloadPPAP=true';
            						var downloadFrame = document.createElement("iframe"); 
            						downloadFrame.setAttribute('src',downloadUrl);
            						downloadFrame.setAttribute('class',"screenReaderText"); 
            						document.body.appendChild(downloadFrame);
            						box.hide();
            					}           					
            				},
            				failure: function (response){
            					box.hide(); 
            					Ext.MessageBox.alert(lan.error, response.responseText);
            				}
            			});
            		}
            	}
            ]
    }];
    return ppap_item
}
