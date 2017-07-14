function managerReport(id, rights) {
    var time_id = Date.parse(new Date());
	var grid = null;
	var model_data = [];
    var columns_data = [];
    var url;

   	var hdadd = true, hdedit = true, hddelete = true, hdsearch = true, hdstatus = true, hdmytask  = true;
    var pressed_new_task = false, pressed_in_que = false, pressed_in_pr = false, pressed_overdue = false;
   	var status_btn = null, status;

    model_data = ['id', 'tasks_type', 'bbb_sku', {name:'request_id', type: 'int'}, 'STATUS', 'assignee', 'assigned_by', 'requested_date', 'assignment_date', 'due_date', 'completion_date', 'new_due_date', 'prod_line_name', 'prod_type_name', 'first_year_demand', 'Annualdemand', 'est_annual_revenue', 'lifecycle', 'predominant_make', 'veh_in_operation', `PriorityLevel`];
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, width: 300},
        {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120/*, tdCls:"col-href"*/},
		{text: lan.requestID, dataIndex: 'request_id', sortable: true, hideable: true, width: 120},
		{text: lan.status, dataIndex: 'STATUS', sortable: true, hideable: true, width: 120/*, hidden:hdstatus*/},
        {text: lan.responsible, dataIndex: 'assigned_by', sortable: true, hideable: true, width:200/*, tdCls:"col-href"*/},
        {text: lan.assigned_to, dataIndex: 'assignee', sortable: true, hideable: true, width: 150/*, tdCls:"col-href"*/},
        {text: lan.requested_date, dataIndex: 'requested_date', sortable: true, hideable: true, width: 150},
        {text: lan.assignment_date, dataIndex: 'assignment_date', sortable: true, hideable: true, width: 150},
        {text: lan.dueDate, dataIndex: 'due_date', sortable: true, hideable: true, width: 150},
        {text: lan.completion_date, dataIndex: 'completion_date', sortable: true, hideable: true, width: 150},
        {text: lan.newDueDate, dataIndex: 'new_due_date', sortable: true, hideable: true, width: 150},
        {text: lan.product_line, dataIndex: 'prod_line_name', sortable: true, hideable: true, width: 150},
        {text: lan.product_type, dataIndex: 'prod_type_name', sortable: true, hideable: true, width: 150},
        {text: lan.first_year_demand, dataIndex: 'first_year_demand', sortable: true, hideable: true, width: 150},
        {text: lan.Annualdemand, dataIndex: 'Annualdemand', sortable: true, hideable: true, width: 150},
        {text: lan.est_annual_revenue, dataIndex: 'est_annual_revenue', sortable: true, hideable: true, width: 150},
        {text: lan.lifecycle, dataIndex: 'lifecycle', sortable: true, hideable: true, width: 150},
        {text: lan.predominant_make, dataIndex: 'predominant_make', sortable: true, hideable: true, width: 150},
        {text: lan.veh_in_operation, dataIndex: 'veh_in_operation', sortable: true, hideable: true, width: 150},
        {text: lan.PriorityLevel, dataIndex: 'PriorityLevel', sortable: true, hideable: true, width: 150},
        {text: lan.ERPOrderID, dataIndex: 'ERPOrderID', sortable: true, hideable: true, width: 150}
    ];
    property = 'requested_date';
    groupField = 'idx';

    //url = 'scripts/datastore.php?func=get_all_tasks';
    url = 'scripts/reports/all_reports.php?reportRequest=true';

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
        height: 500,
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
        },
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                var id_task = task_names[select.get('id_task_type')];  
                /*if ((cellIndex == 5 || cellIndex == 6 || cellIndex == 2)&&all_rights['user_driven']) { //rights rule
                        tabs.items.each(function(item){
                            //console.log(item);
                            if(item){
                                if(item.id == 'tabuser_driven'){
                                    tabs.remove(item);
                                }
                            }
                        });

                    var panelOrgChart = addTabOrgChart();
                    var responsible = record.get('assigned_by_id');
                    var assigned_to = record.get('assignee_id');
                    if (cellIndex == 5 && responsible != 0){
                        addTab(true,'OrgChart','user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(responsible, 'func'));
                    }else if (cellIndex == 6 && assigned_to != 0){
                        addTab(true,'OrgChart','user_driven',panelOrgChart);
                        google.charts.setOnLoadCallback(drawChart(assigned_to, 'func'));
                    }
                    else if (cellIndex == 2) {
                        var bbb_sku_id = select.get('bbb_sku_id');
                        tabs.items.each(function(item){
                            if(item){
                                if(item.id.substring(0, 10) + bbb_sku_id == 'tabbbb_sku' + bbb_sku_id){
                                    tabs.remove(item);
                                }
                            }
                        });
                        var itemTabBbb = bbbSkuTab(bbb_sku_id);
                        addTab(true, lan.bbb_sku+" " + select.get('bbb_sku'), 'bbb_sku'+bbb_sku_id, itemTabBbb);
                        Ext.Ajax.request({
                            url: 'scripts/ecr_form.php?getBOMDescription=true',
                            method: 'POST',
                            params: {
                                id_sku: bbb_sku_id,
                            },
                            success: function(response) {
                                var val = Ext.decode(response.responseText);
                                Ext.getCmp('prodLineTab').setValue(val.rows['0'].ProductLine);
                                Ext.getCmp('prodTypeTab').setValue(val.rows['0'].ProductType);
                                Ext.getCmp('bomTab').setValue(val.rows['0'].bbb_sku);
                            },
                            failure: function(response) {
                                Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                    }
                }
                else {*/
                    tabs.items.each(function(item){
                        if(item){
                            if(item.id == 'tab'+id_task){
                                tabs.remove(item);
                            }
                            //console.log(item.id + " / " + 'tab'+id_task);
                        }
                    });
                var inData = {task_id:id_task, id_row: select.get('id'), rights: all_rights[id_task]};
                //var form = addForm(id_task, false, select.get('id'), null, all_rights[id_task]); //rights rule
                var form = addForm(inData); //rights rule
                addTab(true,select.get('tasks_type'), id_task, form);
                //}
            }
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
                                        fieldLabel: lan.status_tasks,
                                        name: "status_tasks",
                                        //editable: false,
                                        store: store_task_status,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "status_tasks"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.type_tasks,
                                        name: "type_tasks",
                                        //editable: false,
                                        store: tasks_type_store,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "type_tasks"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "fieldset",
                                        title: lan.first_year_demand,
                                        layout: 'hbox',
                                        padding: 5,
                                        width: '89%',
                                        margin: 10,
                                        padding: 5,
                                        items: [
                                            {
                                                xtype: "combobox",
                                                fieldLabel: lan.min,
                                                name: "first_year_dem_min",
                                                store: first_year_dem_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "first_year_dem_min"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                            {
                                                xtype: "combobox",
                                                margin: "0 0 0 10",
                                                fieldLabel: lan.max,
                                                name: "first_year_dem_max",
                                                store: first_year_dem_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "first_year_dem_max"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                        ]
                                    },
                                    {
                                        xtype: "fieldset",
                                        title: lan.est_annual_revenue,
                                        layout: 'hbox',
                                        padding: 5,
                                        width: '89%',
                                        margin: 10,
                                        padding: 5,
                                        items: [
                                            {
                                                xtype: "combobox",
                                                fieldLabel: lan.min,
                                                name: "annual_revenue_min",
                                                store: est_annual_revenue,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "annual_revenue_min"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                            {
                                                xtype: "combobox",
                                                margin: "0 0 0 10",
                                                fieldLabel: lan.max,
                                                name: "annual_revenue_max",
                                                store: est_annual_revenue,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "annual_revenue_max"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                        ]
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.predominant_make,
                                        name: "predominant",
                                        //editable: false,
                                        store: store_predominant_make,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "predominant"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {   xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.PriorityLevel,
                                        name: "priority_lvl",
                                        //editable: false,
                                        store: priority_lvl_store,
                                        multiSelect: true,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "priority_lvl"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {   xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.bbb_sku,
                                        name: "bbb_sku",
                                        //editable: false,
                                        store: store_bbb_sku,
                                        queryMode: 'remote',
                                        minChars:2,
                                        //multiSelect: true,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "bbb_sku"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {   xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.ERPOrderID,
                                        name: "erp",
                                        //editable: false,
                                        store: storeErp,
                                        queryMode: 'remote',
                                        minChars:2,
                                        //multiSelect: true,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "erp"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    }
                                ]
                            },                          
                            {
                                xtype: "container",
                                flex: 1,
                                items: [
                                    {
                                        xtype: "container",
                                        margin: 5,
                                        width: "90%",
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: "fieldset",
                                                title: lan.requested_date,
                                                layout: 'hbox',
                                                padding: 5,
                                                width: '100%',
                                                items: [
                                                    {
                                                        xtype: 'datefield',
                                                        format: 'Y-m-d',
                                                        altFormats: 'Y-m-d',
                                                        fieldLabel: lan.fromtext,
                                                        flex: 1,
                                                        labelWidth: 50,
                                                        name: "req_from",
                                                        id: "req_from"+time_id
                                                    },
                                                    {
                                                        xtype: 'datefield',
                                                        format: 'Y-m-d',
                                                        altFormats: 'Y-m-d',
                                                        fieldLabel: lan.totext,
                                                        flex: 1,
                                                        labelWidth: 30,
                                                        margin: "0 0 0 10",
                                                        name: "req_to",
                                                        id: "req_to"+time_id
                                                    }
                                                ]
                                            }                                                                                    
                                        ]
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.ProductLine,
                                        store: data_store_ProductLine,
                                        valueField: 'id',
                                        multiSelect: true,
                                        displayField: 'value',
                                        name: "prod_line",
                                        id: "prod_line"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.ProductType,
                                        name: "prod_type",
                                        store: data_store_ProductType,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "prod_type"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "fieldset",
                                        title: lan.Annualdemand,
                                        layout: 'hbox',
                                        padding: 5,
                                        width: '89%',
                                        margin: 10,
                                        padding: 5,
                                        items: [
                                            {
                                                xtype: "combobox",
                                                fieldLabel: lan.min,
                                                name: "mat_annual_min",
                                                store: mat_annual_dem_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "mat_annual_min"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                            {
                                                xtype: "combobox",
                                                margin: "0 0 0 10",
                                                fieldLabel: lan.max,
                                                name: "mat_annual_max",
                                                store: mat_annual_dem_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "mat_annual_max"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                        ]
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.lifecycle,
                                        name: "lifecycle",
                                        store: store_lifecycle,
                                        valueField: 'id',
                                        multiSelect: true,
                                        displayField: 'value',
                                        id: "lifecycle"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "fieldset",
                                        title: lan.veh_in_operation,
                                        layout: 'hbox',
                                        padding: 5,
                                        width: '89%',
                                        margin: 10,
                                        padding: 5,
                                        items: [
                                            {
                                                xtype: "combobox",
                                                fieldLabel: lan.min,
                                                name: "vehicle_oper_min",
                                                store: vehicle_in_oper_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "vehicle_oper_min"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                            {
                                                xtype: "combobox",
                                                margin: "0 0 0 10",
                                                fieldLabel: lan.max,
                                                name: "vehicle_oper_max",
                                                store: vehicle_in_oper_store,
                                                valueField: 'value',
                                                displayField: 'value',
                                                id: "vehicle_oper_max"+time_id,
                                                flex: 1,
                                                labelWidth: 25,
                                            },
                                        ]
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.requestID,
                                        name: "request_id",
                                        store: requestIdStore,
                                        valueField: 'order_id',
                                        //multiSelect: true,
                                        displayField: 'order_id',
                                        id: "request_id"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
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
                                    if(Ext.getCmp("status_tasks"+time_id).getValue() != "") Ext.getCmp("status_tasks"+time_id).setValue("");
                                    if(Ext.getCmp("type_tasks"+time_id).getValue() != "") Ext.getCmp("type_tasks"+time_id).setValue("");
                                    if(Ext.getCmp("prod_line"+time_id).getValue() != "") Ext.getCmp("prod_line"+time_id).setValue("");
                                    if(Ext.getCmp("prod_type"+time_id).getValue() != "") Ext.getCmp("prod_type"+time_id).setValue("");
                                    if(Ext.getCmp("first_year_dem_min"+time_id).getValue() != "") Ext.getCmp("first_year_dem_min"+time_id).setValue("");
                                    if(Ext.getCmp("first_year_dem_max"+time_id).getValue() != "") Ext.getCmp("first_year_dem_max"+time_id).setValue("");
                                    if(Ext.getCmp("mat_annual_min"+time_id).getValue() != "") Ext.getCmp("mat_annual_min"+time_id).setValue("");
                                    if(Ext.getCmp("mat_annual_max"+time_id).getValue() != "") Ext.getCmp("mat_annual_max"+time_id).setValue("");
                                    if(Ext.getCmp("annual_revenue_min"+time_id).getValue() != "") Ext.getCmp("annual_revenue_min"+time_id).setValue("");
                                    if(Ext.getCmp("annual_revenue_max"+time_id).getValue() != "") Ext.getCmp("annual_revenue_max"+time_id).setValue("");
                                    if(Ext.getCmp("lifecycle"+time_id).getValue() != "") Ext.getCmp("lifecycle"+time_id).setValue("");
                                    if(Ext.getCmp("predominant"+time_id).getValue() != "") Ext.getCmp("predominant"+time_id).setValue("");
                                    if(Ext.getCmp("vehicle_oper_min"+time_id).getValue() != "") Ext.getCmp("vehicle_oper_min"+time_id).setValue("");
                                    if(Ext.getCmp("vehicle_oper_max"+time_id).getValue() != "") Ext.getCmp("vehicle_oper_max"+time_id).setValue("");
                                    if(Ext.getCmp("priority_lvl"+time_id).getValue() != "") Ext.getCmp("priority_lvl"+time_id).setValue("");
                                    if(Ext.getCmp("req_from"+time_id).getValue() != "") Ext.getCmp("req_from"+time_id).setValue("");
                                    if(Ext.getCmp("req_to"+time_id).getValue() != "") Ext.getCmp("req_to"+time_id).setValue("");
                                    if(Ext.getCmp("bbb_sku"+time_id).getValue() != "") Ext.getCmp("bbb_sku"+time_id).setValue("");
                                    if(Ext.getCmp("request_id"+time_id).getValue() != "") Ext.getCmp("request_id"+time_id).setValue("");
                                    if(Ext.getCmp("erp"+time_id).getValue() != "") Ext.getCmp("erp"+time_id).setValue("");
                                }
                            },
                            {
                                xtype: "button",
                                text: lan.form,
                                margin: "10 0 10 250",
                                width: 200,
                                handler: function() {
                                    if(Ext.getCmp("type_tasks"+time_id).getValue()) var tasksType = Ext.getCmp("type_tasks"+time_id).getValue().join();
                                    if(Ext.getCmp("prod_line"+time_id).getValue()) var prodLine = Ext.getCmp("prod_line"+time_id).getValue().join();
                                    if(Ext.getCmp("prod_type"+time_id).getValue()) var prodType = Ext.getCmp("prod_type"+time_id).getValue().join();
                                    if(Ext.getCmp("lifecycle"+time_id).getValue()) var lifecycle = Ext.getCmp("lifecycle"+time_id).getValue().join();
                                    if(Ext.getCmp("priority_lvl"+time_id).getValue()) var priority = Ext.getCmp("priority_lvl"+time_id).getValue().join();
                                    Ext.Ajax.request({
                                        url: "scripts/reports/all_reports.php?reportRequest=true",
                                        method: 'POST',
                                        params: {
                                            tasksStatus: Ext.getCmp("status_tasks"+time_id).getValue(),
                                            tasksType: tasksType,
                                            prodLine: prodLine,
                                            prodType: prodType,
                                            firstYearMin: Ext.getCmp("first_year_dem_min"+time_id).getValue(),
                                            firstYearMax: Ext.getCmp("first_year_dem_max"+time_id).getValue(),
                                            matAnnualDemMin: Ext.getCmp("mat_annual_min"+time_id).getValue(),
                                            matAnnualDemMax: Ext.getCmp("mat_annual_max"+time_id).getValue(),
                                            estAnnualRevMin: Ext.getCmp("annual_revenue_min"+time_id).getValue(),
                                            estAnnualRevMax: Ext.getCmp("annual_revenue_max"+time_id).getValue(),
                                            lifecycle: lifecycle,
                                            predoMake: Ext.getCmp("predominant"+time_id).getValue(),
                                            vehicleOperMin: Ext.getCmp("vehicle_oper_min"+time_id).getValue(),
                                            vehicleOperMax: Ext.getCmp("vehicle_oper_max"+time_id).getValue(),
                                            priorityLvl: priority,
                                            reqDateFrom: Ext.getCmp("req_from"+time_id).getValue(),
                                            reqDateTo: Ext.getCmp("req_to"+time_id).getValue(),
                                            bbbSku: Ext.getCmp("bbb_sku"+time_id).getValue(),
                                            requestId: Ext.getCmp("request_id"+time_id).getValue(),
                                            erp: Ext.getCmp("erp"+time_id).getValue()
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
                            },
                            {
                                xtype: 'button',
                                text: lan.export_xlsx,
                                iconCls: 'exel_ico',
                                width: 150,
                                margin: "10 0 10 200",
                                handler: function(){
                                    var box = Ext.MessageBox.wait(lan.mess_file_form, lan.export_xlsx);
                                    Ext.Ajax.request({
                                        url: 'scripts/reports/export_reports_excel.php?exportManager=true',
                                        method: 'POST',
                                        params: {
                                            dataStoreManager: convertStore(data_store) 
                                        },
                                        success: function(response) {
                                            if(response.responseText == "Not value!") Ext.MessageBox.alert(lan.error, lan.no_data);
                                            else {
                                                var data = JSON.parse(response.responseText);
                                                if(data.success) {
                                                    var downloadUrl = 'scripts/reports/export_reports_excel.php?downloadManager=true';
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
                                        url: 'scripts/reports/export_reports_pdf.php?exportManagerPdf=true',
                                        method: 'POST',
                                        params: {
                                            dataStoreManager: convertStore(data_store)
                                        },
                                        success: function(response) {
                                            if(response.responseText == "Not value!") Ext.MessageBox.alert(lan.error, lan.no_data);
                                            else {
                                                var data = JSON.parse(response.responseText);
                                                if(data.success) {
                                                    location.href = 'scripts/reports/export_reports_pdf.php?downloadManager=true';
                                                }
                                            }                                           
                                        },
                                        failure: function(response) {                                           
                                            Ext.MessageBox.alert(lan.error, response.responseText);
                                        }
                                    });
                                }
                            } 
                        ]
                    }                                              
                ]
            },
            grid
        ]
    }

    return res_grid;
}