function compReport(id, rights) {
	var time_id = Date.parse(new Date());
	var grid = null;
	var model_data = [];
    var columns_data = [];
    var url;

   	var hdadd = true, hdedit = true, hddelete = true, hdsearch = true, hdstatus = true, hdmytask  = true;
    var pressed_new_task = false, pressed_in_que = false, pressed_in_pr = false, pressed_overdue = false;
   	var status_btn = null, status;

    model_data = ['id', 'comp_type', 'part_number', 'revision', 'create_date', 'comp_status', 'last_mod', 'active', 'division', 'description', 'material', 'sku'];
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: "Component Type", dataIndex: 'comp_type', sortable: true, hideable: true, width: 150, renderer: setCompType},
        {text: "Component Part Number", dataIndex: 'part_number', sortable: true, hideable: true, width: 250},
		{text: "Revision", dataIndex: 'revision', sortable: true, hideable: true, width: 100},
		{text: "Status", dataIndex: 'comp_status', sortable: true, hideable: true, width: 150, renderer: setBOMStatus},
		{text: "Created Date", dataIndex: 'create_date', sortable: true, hideable: true, width: 150},
        {text: "Last Modified Date", dataIndex: 'last_mod', sortable: true, hideable: true, width: 150},
        {text: "Division", dataIndex: 'division', sortable: true, hideable: true, width: 100, renderer: convertDivision},
        {text: "Description", dataIndex: 'description', sortable: true, hideable: true, width: 150},
        {text: "Material", dataIndex: 'material', sortable: true, hideable: true, width: 150},
        {text: "Used In BOM", dataIndex: 'sku', sortable: true, hideable: true, width: 250},
    ];
    property = 'create_date';
    groupField = 'id';

    url = 'scripts/reports/all_reports.php?compReport=true';

    hdadd = true, hdedit = false, hddelete = false, hdsearch = false;

    Ext.define('data_model', {
        extend: 'Ext.data.Model',
        idProperty: 'my_primary_key',
        fields: model_data,
	});
    var data_store = new Ext.data.Store({
        autoLoad: true,
        autoDestroy: true,
        pageSize: 25,
        model: 'data_model',
        proxy: {
            type: 'ajax',
            //url: url,
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
        },
        sorters: [{
                property: property,
                direction: 'DESC'
        }]
    });

    /*var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: data_store,
        displayInfo: true
    });*/

    var grid = {
        xtype: 'grid',
        //height: 500,
        fileUpload:true,
        //layout: 'fit', 
        columnLines: true,
        border: false,
        frame: false,
        id: id,
        //autoScroll: true,
        store: data_store,
        /*stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },*/
        dockedItems: [
            {
                xtype: 'toolbar',
                border: false,
                items: [
                    
                ]
            }
        ],
        //bbar: [PagingToolbar],
        columns: {
            items: columns_data
        }
    }

    var res_grid = {
        xtype: "panel",
        autoScroll: true,
        layout: {
            type: "vbox",
            align: "stretch"
        },
        items: [
            {
                xtype: "form",
                //title: 'Choose your options:',
                width: "100%",
                items: [
                    {
                        xtype: "container",
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: "container",
                                flex: 1,
                                items: [
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Component Type",
                                        name: "comp_type",
                                        multiSelect: true,
                                        store: storeCompTypes,
                                        queryMode: 'remote',
                                        minChars:2,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "comp_type"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Revision",
                                        name: "revision",
                                        store: storeRevision,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "revision"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Created Date",
                                        name: "create_date",
                                        queryMode: 'remote',
                                        minChars:2,
                                        store: compCreateDateStore,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "create_date"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Division",
                                        name: "division",
                                        //queryMode: 'remote',
                                        //minChars:2,
                                        store: storeDivision,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'name',
                                        id: "division"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Material",
                                        name: "material",
                                        //queryMode: 'remote',
                                        //minChars:2,
                                        store: compMaterials,
                                        //multiSelect: true,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "material"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    }
                                ]
                            },                          
                            {
                                xtype: "container",
                                flex: 1,
                                items: [
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Component Part Number",
                                        store: compPartNumStore,
                                        queryMode: 'remote',
                                        minChars:2,
                                        valueField: 'value',
                                        displayField: 'value',
                                        name: "part_number",
                                        id: "part_number"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Status",
                                        name: "comp_status",
                                        store: storeCompStatuses,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "comp_status"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Last Modified Date",
                                        name: "last_mod",
                                        store: compLastMod,
                                        //multiSelect: true,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "last_mod"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: "Description",
                                        name: "description",
                                        store: store_description,
                                        //multiSelect: true,
                                        //valueField: 'id',
                                        displayField: 'description',
                                        id: "description"+time_id,
                                        width: "90%",
                                        labelWidth: 130,
                                    },
                                    {
                                    	xtype: "checkbox",
                                    	boxLabel: "Include list of BOMs",
                                    	inputValue: "yes",
                                    	margin: 10,
                                    	id: "show_bom"+time_id
                                    }
                                ]
                            },
                        ]
                    },
                    {
                    	xtype: "container",
                    	layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                        	{
                        		xtype: "button",
                        		text: lan.clear_all,
                        		margin: "10 0 10 10",
                        		handler: function() {
                        			if(Ext.getCmp("comp_type"+time_id).getValue() != "") Ext.getCmp("comp_type"+time_id).setValue("");
                        			if(Ext.getCmp("part_number"+time_id).getValue() != "") Ext.getCmp("part_number"+time_id).setValue("");
                        			if(Ext.getCmp("revision"+time_id).getValue() != "") Ext.getCmp("revision"+time_id).setValue("");
                        			if(Ext.getCmp("comp_status"+time_id).getValue() != "") Ext.getCmp("comp_status"+time_id).setValue("");
                        			if(Ext.getCmp("create_date"+time_id).getValue() != "") Ext.getCmp("create_date"+time_id).setValue("");
                        			if(Ext.getCmp("last_mod"+time_id).getValue() != "") Ext.getCmp("last_mod"+time_id).setValue("");
                        			if(Ext.getCmp("division"+time_id).getValue() != "") Ext.getCmp("division"+time_id).setValue("");
                        			if(Ext.getCmp("description"+time_id).getValue() != "") Ext.getCmp("description"+time_id).setValue("");
                        			if(Ext.getCmp("material"+time_id).getValue() != "") Ext.getCmp("material"+time_id).setValue("");
                        		}
                        	},
                        	{
		                        xtype: "button",
		                        text: lan.form,
		                        margin: "10 0 10 300",
		                        width: 200,
		                        handler: function() {
		                        	//console.log(Ext.getCmp("show_bom"+time_id).getValue());
		                        	if(Ext.getCmp("comp_type"+time_id).getValue()) var compType = Ext.getCmp("comp_type"+time_id).getValue().join();
		                        	if(Ext.getCmp("comp_status"+time_id).getValue()) var status = Ext.getCmp("comp_status"+time_id).getValue().join();
		                        	if(Ext.getCmp("division"+time_id).getValue()) var division = Ext.getCmp("division"+time_id).getValue().join();
		                            Ext.Ajax.request({
		                                url: "scripts/reports/all_reports.php?compReport=true",
		                                method: 'POST',
		                                params: {
		                                   compType: compType,
		                                   partNumb: Ext.getCmp("part_number"+time_id).getValue(),
		                                   revision: Ext.getCmp("revision"+time_id).getValue(),
		                                   status: status,
		                                   createDate: Ext.getCmp("create_date"+time_id).getValue(),
		                                   lastMod: Ext.getCmp("last_mod"+time_id).getValue(),
		                                   division: division,
		                                   description: Ext.getCmp("description"+time_id).getValue(),
		                                   material: Ext.getCmp("material"+time_id).getValue(),
		                                   showBom: Ext.getCmp("show_bom"+time_id).getValue()
		                                },
		                                success: function(response) {
		                                    var data = JSON.parse(response.responseText);                     
		                                    data_store.loadData(data.rows)  
		                                },
		                                failure: function(response) {
		                                    Ext.MessageBox.alert(lan.error, response.responseText);
		                                }
		                            });
		                        }
		                    }/*,
		                    {
		                    	xtype: 'button',
		                        text: lan.export_xlsx,
		                        iconCls: 'exel_ico',
		                        width: 150,
		                        margin: "10 0 10 200",
		                        handler: function(){
		                            var box = Ext.MessageBox.wait(lan.mess_file_form, lan.export_xlsx);
		                            Ext.Ajax.request({
		                                url: 'scripts/reports/export_reports_excel.php?exportUserList=true',
		                                method: 'POST',
		                               	params: {
		                                    dataUserList: convertStore(data_store)
		                                },
		                                success: function(response) {
		                                	if(response.responseText == "Not value!") Ext.MessageBox.alert(lan.error, lan.no_data);
		                                    else {
		                                    	var data = JSON.parse(response.responseText); 
			                                    if(data.success) {
			                                        var downloadUrl = 'scripts/reports/export_reports_excel.php?downloadUserList=true';
			                                        var downloadFrame = document.createElement("iframe"); 
			                                        downloadFrame.setAttribute('src',downloadUrl);
			                                        downloadFrame.setAttribute('class',"screenReaderText"); 
			                                        document.body.appendChild(downloadFrame);
			                                        box.hide(); 
			                                	}			                                
		                                	}
		                                },
		                                failure: function(response) {
		                                    box.hide();
		                                    Ext.MessageBox.alert(lan.error, response.responseText);
		                                }
		                            });
		                        }
		                    },
		                    {
		                    	xtype: "button",
		                    	text: lan.creat_pdf,
		                    	margin: "10 0 10 50",
		                    	handler: function() {
		                            Ext.Ajax.request({
		                                url: 'scripts/reports/export_reports_pdf.php?exportUserListPdf=true',
		                                method: 'POST',
		                               	params: {
		                                    dataUserList: convertStore(data_store)
		                                },
		                                success: function(response) {
		                                	if(response.responseText == "Not value!") Ext.MessageBox.alert(lan.error, lan.no_data);
		                                    else {
		                                    	var data = JSON.parse(response.responseText);
			                                    if(data.success) {
			                                        location.href = 'scripts/reports/export_reports_pdf.php?downloadUserListPdf=true';
			                                    }
		                                    }		                                    
		                                },
		                                failure: function(response) {		                                    
		                                    Ext.MessageBox.alert(lan.error, response.responseText);
		                                }
		                            });
		                    	}
		                    }*/
                        ]
                    }                           
                ]
            },
            grid
        ]
    }

    return res_grid;
}