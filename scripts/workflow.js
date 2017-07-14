var task_names = {'1':'new_engineering_req', '2':'due_diligence', '3':'new_product_line', '4': 'sample_procurement', '5':'feasibility_product_eng', '6':'feasibility_process_eng', '7':'cost_estimate', '8':'preliminary_roi_pm', '9':'npd_request', '10':'sample_validation', '11':'reverse_engineering_start', '12':'reverse_eng_core_analysis', '13':'reverse_eng_pack_req', '14':'reverse_engineering', '15':'reverse_engineering_attribute_tables', '16':'ecr_form', '17':'ppap_test_plan', '36':'ppap_review', '18':'process_design_request', '19': 'process_design_start', '21':'tooling_request', '22': 'tooling_approval', '24':'capex', '37':'capex_approve', '23': 'procurement_request', '38':'implementation_request', '25':'purchasing_request', '39': 'ppap_finished_good', '40':'ppap_finished_good_review', '41':'equipment_request', '42': 'workstation_request', '43': 'equipment_approval', '44': 'workstation_approval', '45': 'eps_production', '46': 'new_component_req', '47': 'capa_request', '48': 'capa_implementation', '49':'capa', '50': 'ecr', '51': 'ecr_approval', '52': 'ecr_implementation'};
	

function addGridWorkFlow(id, status_btn) {
    //idData = {id:"id", status: "status"};
	var grid = null;
	var model_data = [];
    //var store_data = [];
    var columns_data = [];
    var url;
	var hdadd = true, hdedit = true, hddelete = true, hdsearch = true, hdstatus = true, hdmytask  = true;
    var pressed_new_task = false, pressed_in_que = false, pressed_in_pr = false, pressed_overdue = false;
     /*if (arguments[1]){
        status_btn = arguments[1];
        switch(status_btn){
            case 1:
                pressed_new_task = true;
            break;
            case 2:
                pressed_in_pr = true;
            break;
            case 5:
                pressed_overdue = true;
            break;
            case 6:
                pressed_in_que = true;
            break;
        }
    }*/

    if (status_btn){
        switch(status_btn){
            case 1:
                pressed_new_task = true;
            break;
            case 2:
                pressed_in_pr = true;
            break;
            case 5:
                pressed_overdue = true;
            break;
            case 6:
                pressed_in_que = true;
            break;
        }
    }
	
	var GroupHeader = Ext.create('Ext.grid.feature.Grouping',{
    	groupHeaderTpl: '{columnName}: {name} ({rows.length})',
    	disabled: false,
    	hideGroupedHeader: false,
		enableGroupingMenu: false,
        startCollapsed: false,
		enableNoGroups: true
    });
    
    var status;

    function filterStatus(status_num, pressed){
        var search = Ext.getCmp('search_task'+id).value;
        if (pressed) {
            status_btn = status_num;
            data_store.load({
                params: {my_task_status: status_num, search: search}
             });
        }else{
            status_btn = null;
            data_store.load({
                params: {search: search}
             });
             //data_store.load();
        }        
    }
   


    
    switch (id) {
        case 'new_task':
            status = 1;
        break;
        case 'in_progress':
            status = 2;
        break;
        case 'completed':
            status = 4;
        break;
        case 'overdue':
            status = 5;
        break;
        case 'in_queue':
            status = 6;
        break;
        default:
            status = id;
        break;
    }
    if (id == 'my_tasks'){
        hdstatus = false;
        hdmytask = false;
    }
    model_data = ['id', 'tasks_type', 'bbb_sku', {name:'request_id', type: 'int'}, 'assignee', 'assigned_by', 'requested_date', 'assignment_date', 'due_date', 'completion_date', 'new_due_date', 'STATUS'];
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, width: 300},
        {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120, tdCls:"col-href"},
		{text: lan.requestID, dataIndex: 'request_id', sortable: true, hideable: true, width: 120},
        {text: lan.status, dataIndex: 'STATUS', sortable: true, hideable: true, width: 120, hidden:hdstatus},
        {text: lan.responsible, dataIndex: 'assigned_by', sortable: true, hideable: true, width:200, tdCls:"col-href"},
        {text: lan.assigned_to, dataIndex: 'assignee', sortable: true, hideable: true, width: 150, tdCls:"col-href"},
        {text: lan.requested_date, dataIndex: 'requested_date', sortable: true, hideable: true, width: 150},
        {text: lan.assignment_date, dataIndex: 'assignment_date', sortable: true, hideable: true, width: 150},
        {text: lan.dueDate, dataIndex: 'due_date', sortable: true, hideable: true, width: 150},
        {text: lan.completion_date, dataIndex: 'completion_date', sortable: true, hideable: true, width: 150},
        {text: lan.newDueDate, dataIndex: 'new_due_date', sortable: true, hideable: true, width: 150}
    ];
    property = 'requested_date';
    groupField = 'idx';

    url = 'scripts/datastore.php?func=workflow&status='+status;
    
	//url = 'scripts/saveformref.php?generate=true';
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
        //groupField: groupField,
        //data: store_data
        proxy: {
            type: 'ajax',
            url: url,
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
           // simpleSortMode: true
        },
        sorters: [{
                property: property,
                direction: 'DESC'
        }]
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: data_store,
        displayInfo: true
        //displayMsg: 'Показано {0} - {1} с {2}',
        //emptyMsg: "Нет даных",
    });

    var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit', //new Ext.grid.lan({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: id,
        autoScroll: true,
        store: data_store,
        features: [GroupHeader],
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
            //selectedItemCls: 'red'
        },
        //plugins: [rowEditing],
        dockedItems: [
            {
                xtype: 'toolbar',
                border: false,
                items: [
                    {
                        text: lan.view,
                        iconCls: 'edit',
                        hidden: hdedit,
                        handler: function() {
                            var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var id_task = task_names[select.get('id_task_type')];
                                //console.log(id_task);
                                tabs.items.each(function(item){
                                    if(item){
                                        if(item.id == 'tab'+id_task){
                                            tabs.remove(item);
                                        }
                                    }
                                });
                                var inData = {task_id:id_task, id_row: select.get('id'), rights: all_rights[id_task]};
                                //var form = addForm(id_task, '', select.get('id'), null, rights);
                                var form = addForm(inData);
                                addTab(true,select.get('tasks_type'), id_task,form);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    } ,
                    {
                        text: lan.new_task,
                        hidden: hdmytask,
                        enableToggle : true,
                        toggleGroup: 'group',
                        pressed:pressed_new_task,
                        listeners:{ 
                           click : function(btn , e , eOpts ) { 
                                filterStatus(1, this.pressed);                                                  
                            }
                        }
                    },
                    {
                        text: lan.in_queue,
                        hidden: hdmytask,
                        enableToggle : true,
                        toggleGroup: 'group',
                        pressed:pressed_in_que,
                        listeners:{ 
                            click : function(btn , e , eOpts ) { 
                                filterStatus(6, this.pressed);                                                  
                            }
                        }
                    },
                    {
                        text: lan.in_progress,
                        hidden: hdmytask,
                        toggleGroup: 'group',
                        enableToggle : true,
                        pressed:pressed_in_pr,
                        listeners:{ 
                            click : function(btn , e , eOpts ) { 
                                filterStatus(2, this.pressed);                                                  
                            }
                        }
                    },
                    {
                        text: lan.completed,
                        hidden: hdmytask,
                        enableToggle : true,
                        toggleGroup: 'group',
                        listeners:{ 
                            click : function(btn , e , eOpts ) { 
                                filterStatus(4, this.pressed);                                                  
                            }
                        }
                    },
                    {
                        text: lan.overdue,
                        hidden: hdmytask,
                        enableToggle : true,
                        toggleGroup: 'group',
                        pressed:pressed_overdue,
                        listeners:{ 
                            click : function(btn , e , eOpts ) { 
                                filterStatus(5, this.pressed);                                                  
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'search',
                        id:'search_task'+id,
                        emptyText: lan.search,
                        hidden: hdsearch,
                        labelWidth: style.input2.labelWidth,
                        width: '48%',
                        listeners:{
                            change: function () {
                                data_store.load({
                                    params: {search: this.value, my_task_status:status_btn}
                                });
                                data_store.getProxy().url = 'scripts/datastore.php?func=workflow&status=' + status + '&search='+this.value;
                                data_store.load();
                            }
                        }
                    }
                ]
            }
        ],
        bbar: [PagingToolbar],
        columns: columns_data,
        listeners: {
            afterRender:function(){
                if (arguments[1]){
                    filterStatus(status_btn,true);
                }
            },
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                var id_task = task_names[select.get('id_task_type')];  
                if ((cellIndex == 5 || cellIndex == 6 || cellIndex == 2)&&all_rights['user_driven']) { //rights rule
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
                else {
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
                }
            }
        }
    }

/*************************************************BBB SKU# tab**********************************************************/	
	function bbbSkuTab(bbb_sku) {
	//var bbb_sku = 1;
	var model_data_bbb_sku = ['id', 'tasks_type', {name:'request_id', type: 'int'}, 'assignee', 'assigned_by', 'requested_date', 'assignment_date', 'due_date', 'completion_date', 'new_due_date'];
	var columns_data_bbb_sku = [
		{xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, width: 300},
        //{text: 'BBB SKU#', dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120, tdCls:"col-href"},
		{text: lan.requestID, dataIndex: 'request_id', sortable: true, hideable: true, width: 120},
        //{text: lan.status, dataIndex: 'status', sortable: true, hideable: true, width: 120, /*hidden:hdstatus},
        {text: lan.responsible, dataIndex: 'assigned_by', sortable: true, hideable: true, width:200, /*tdCls:"col-href"*/},
        {text: lan.assigned_to, dataIndex: 'assignee', sortable: true, hideable: true, width: 150, /*tdCls:"col-href"*/},
        {text: lan.requested_date, dataIndex: 'requested_date', sortable: true, hideable: true, width: 150},
        {text: lan.assignment_date, dataIndex: 'assignment_date', sortable: true, hideable: true, width: 150},
        {text: lan.dueDate, dataIndex: 'due_date', sortable: true, hideable: true, width: 150},
        {text: lan.completion_date, dataIndex: 'completion_date', sortable: true, hideable: true, width: 150},
        {text: lan.newDueDate, dataIndex: 'new_due_date', sortable: true, hideable: true, width: 150}
	];
	
	property = /*'idx'*/'requested_date';	
	url1 = 'scripts/datastore.php?func=workflow_bbb_sku&bbb_sku='+bbb_sku;
    groupField = 'idx';

    //url1 = 'scripts/datastore.php?func=workflow&status='+status;
    hdadd = true, hdedit = false, hddelete = false, hdsearch = false;
	
	Ext.define('data_model_bbb_sku', {
        extend: 'Ext.data.Model',
        idProperty: 'my_primary_key',
        fields: model_data_bbb_sku,
	});
	
	var data_store_bbb_sku = new Ext.data.Store({
	//autoLoad: true,
	pageSize: 25,
	model: 'data_model_bbb_sku',
	//groupField: groupField,
	//data: store_data
	proxy: {
		type: 'ajax',
		url: url1,
		scope : this,
		reader: {
			type: 'json',
			root: 'rows',
			totalProperty: 'total'
		},
	   // simpleSortMode: true
	},
	sorters: [{
			property: property,
			direction: 'DESC'
	}]
});
	
	data_store_bbb_sku.load();
	
	var itemTab = {
		xtype: "container",
		padding: 10,
		layout: 'anchor',
		autoScroll: true,
		items: [
			{
				xtype: "combobox",
				fieldLabel: lan.product_line,
				//width: 150,
				anchor: "96%",
				name: "prodLineTab",
				id: "prodLineTab",
				store: data_store_ProductLine.load(),
                displayField: 'value',
                valueField: 'id',
				readOnly: true
			},
			{
				xtype: "combobox",
				fieldLabel: lan.product_type,
				//width: 150,
				anchor: "96%",
				name: "prodTypeTab",
				id: "prodTypeTab",
				readOnly: true,
				displayField: 'value',
				store: data_store_ProductType.load(),
                valueField: 'id'
			},
			{xtype: "container",
                anchor: "96%",
                margin: " 0 10 0 0",
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: "combobox",
                        fieldLabel: lan.only_bom,
                        anchor: "96%",
                        name: "bomTab",
                        id: "bomTab",
                        readOnly: true,
                        displayField: 'value',
                        store: store_bbb_sku.load(),
                        valueField: 'id',
                        flex: 3               
                    },
                    {
                        xtype: "button",
                        text: lan.show_bom,
                        margin: '0 0 0 10',
                        flex: 1,
                        handler: function() {
                            var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                            var id_sku = select.get('bbb_sku_id');
                            Ext.Ajax.request({
                                url: 'scripts/ecr_form.php?getBOMDescription',
                                method: 'POST',
                                params: {id_sku:id_sku},
                                success: function (response){
                                    var JSON = response.responseText;
                                    if(JSON){
                                        var data = Ext.decode(JSON);
                                        var product_line = data.rows[0].ProductLine;
                                        var product_type = data.rows[0].ProductType;
                                        var bbb_sku = data.rows[0].bbb_sku;
                                        var name = data.rows[0].name;
                                        bbbInsideShowBom(name);
                                        Ext.getCmp('bbb_sku_bom'+time_id).setValue(bbb_sku);
                                        Ext.getCmp('ProductLine'+time_id).setValue(product_line);
                                        Ext.getCmp('ProductType'+time_id).setValue(product_type);
                                        
                                    }
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                            data_store_ProductType_BOM.load();
                            data_store_ProductLine_BOM.load();
                            store_bbb_sku_BOM.load();
                            var time_id = Date.parse(new Date());
                            function bbbInsideShowBom(title) {
                                //var time_id = Date.parse(new Date());
                                var view = true;
                                var vis = false;
                                var form_bom = getItemFormBOM(time_id, view, vis);
                                storeBOM.load({
                                params: {bbb_sku:id_sku}
                                });
                                var win = Ext.create("Ext.Window", {
                                    width: '90%',
                                    title: lan.bbb_sku+": " + title,
                                    height: 400,
                                    autoScroll: true,
                                    closable: true,
                                    modal: true,
                                    items: form_bom
                                });
                                win.show();
                            }
                            
                        }
                    }
                ]
            },
			{
				xtype: "grid",
				layout: "fit",
				columnLines: true,
				store: data_store_bbb_sku,
				id: 'bbb_sku_grid',
				border: false,
				frame: false,
				autoScroll: true,
				//features: [GroupHeader],
				/*viewConfig: {
					stripeRows: true
				},*/
				columns: columns_data_bbb_sku,
				//bbar: [PagingToolbar],
				listeners: {
					/*afterRender:function(){
						if (arguments[1]){
						filterStatus(status_btn,true);
						}
					},*/
					rowdblclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
						var select = Ext.getCmp('bbb_sku_grid').getView().getSelectionModel().getSelection()[0];
						var id_task = task_names[select.get('id_task_type')];
						tabs.items.each(function(item){
							if(item){
								if(item.id == 'tab'+id_task){
									tabs.remove(item);
								}
							}
						});
                        var inData = {task_id:id_task, id_row: select.get('id'), rights: all_rights[id_task]};
                        var form = addForm(inData);
						//var form = addForm(id_task, false, select.get('id'));
						addTab(true,select.get('tasks_type'), id_task, form);
					}
				}
			}
		]
	}
	
	return itemTab;	
}
/****************************************************************************************************************************/
    
    return grid;
    
}

