function allTasks(id, rights) {
	var grid = null;
	var model_data = [];
    var columns_data = [];
    var url;

   	var hdadd = true, hdedit = true, hddelete = true, hdsearch = true, hdstatus = true, hdmytask  = true;
    var pressed_new_task = false, pressed_in_que = false, pressed_in_pr = false, pressed_overdue = false;
   	var status_btn = null, status;

    model_data = ['id', 'tasks_type', 'bbb_sku', {name:'request_id', type: 'int'}, 'STATUS', 'assignee', 'assigned_by', 'requested_date', 'assignment_date', 'due_date', 'completion_date', 'new_due_date'];
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, width: 300},
        {text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120, tdCls:"col-href"},
		{text: lan.requestID, dataIndex: 'request_id', sortable: true, hideable: true, width: 120},
		{text: lan.status, dataIndex: 'STATUS', sortable: true, hideable: true, width: 120/*, hidden:hdstatus*/},
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

    url = 'scripts/datastore.php?func=get_all_tasks';
    
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
            url: url,
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

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: data_store,
        displayInfo: true
    });

    var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit', 
        columnLines: true,
        border: false,
        frame: false,
        id: id,
        autoScroll: true,
        store: data_store,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },
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
                                tabs.items.each(function(item){
                                    if(item){
                                        if(item.id == 'tab'+id_task){
                                            tabs.remove(item);
                                        }
                                    }
                                });
                                var inData = {task_id:id_task, id_row: select.get('id'), rights: all_rights[id_task]};
                                var form = addForm(inData);
                                addTab(true,select.get('tasks_type'), id_task,form);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #72A6FF;"><b>New Tasks</b></span>',
                        name: 'new_tasks',
                        inputValue: 1,
                        disabled: false,
                        width: 110,
                        margin: '0 5px 0 5px',
                        listeners: {
                            change: function(){
                                setStatusFilter(this);
                            }
                        }
                    },'-',{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #FFA500;"><b>In Queue</b></span>',
                        name: 'in_queue',
                        inputValue: 6,
                        disabled: false,
                        width: 110,
                        margin: '0 5px 0 5px',
                        listeners: {
                            change: function(){
                                setStatusFilter(this);
                            }
                        }
                    },'-',{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #999999;"><b>In Progress</b></span>',
                        name: 'in_progress',
                        inputValue: 2,
                        disabled: false,
                        width: 110,
                        margin: '0 5px 0 5px',
                        listeners: {
                            change: function(){
                                setStatusFilter(this);
                            }
                        }
                    },'-',{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #26FF05;"><b>Completed</b></span>',
                        name: 'completed',
                        inputValue: 4,
                        disabled: false,
                        width: 110,
                        margin: '0 5px 0 5px',
                        listeners: {
                            change: function(){
                                setStatusFilter(this);
                            }
                        }
                    },'-',{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #C45858;"><b>Overdue</b></span>',
                        name: 'overdue',
                        inputValue: 5,
                        disabled: false,
                        width: 110,
                        margin: '0 5px 0 5px',
                        listeners: {
                            change: function(){
                                setStatusFilter(this);
                            }
                        }
                    },'-',{
                        xtype: 'button',
                        text: lan.export_xlsx,
                        iconCls: 'exel_ico',
                        width: 150,
                        handler: function(){
                            var filter = setStatusFilter(this);
                            var search = this.up('toolbar').query('textfield')[0].getValue();
                            var box = Ext.MessageBox.wait(lan.mess_file_form, lan.export_xlsx);
                            Ext.Ajax.request({
                                url: 'scripts/export.php?exportExel=true',
                                method: 'POST',
                                params: {
                                    filter: filter,
                                    search: search
                                },
                                success: function(response) {
                                    var data = JSON.parse(response.responseText);
                                    if(data.success) {
                                        downloadUrl = 'scripts/export.php?downloadExel=true';
                                        var downloadFrame = document.createElement("iframe"); 
                                        downloadFrame.setAttribute('src',downloadUrl);
                                        downloadFrame.setAttribute('class',"screenReaderText"); 
                                        document.body.appendChild(downloadFrame); 
                                    }
                                    box.hide();
                                },
                                failure: function(response) {
                                    box.hide();
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
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
                                var statBtn;
                                if(status_btn) statBtn = '&my_task_status='+status_btn;
                                else statBtn = "";

                                data_store.setProxy({
                                    type: 'ajax',
                                    url: 'scripts/datastore.php?func=get_all_tasks&search='+this.value+statBtn,
                                    timeout:180000,
                                    reader: {
                                        type: 'json',
                                        root: 'rows',
                                        totalProperty: 'total'
                                    },
                                    simpleSortMode: true
                                });
                                data_store.load();
                                PagingToolbar.moveFirst();

                                data_store.getProxy().url = 'scripts/datastore.php?func=get_all_tasks&search='+this.value+statBtn;
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
        //{text: lan.bbb_sku, dataIndex: 'bbb_sku', sortable: true, hideable: true, width: 120, tdCls:"col-href"},
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

function setStatusFilter(el){
    var check_boxes = el.up('toolbar').query('checkbox');
    var filter = "";
    for(var i = 0; i<check_boxes.length; i++){
        if(check_boxes[i].value){
            filter +=check_boxes[i].inputValue+",";
        }
    }
    
    if(!filter||filter==""){
        filter = "1,2,4,5,6";
    }
    else {
        filter = filter.substring(0, filter.length - 1);
    }
    var store = el.up('grid').getStore();
    var search = el.up('toolbar').query('textfield')[0].getValue();
    store.getProxy().url = 'scripts/datastore.php?func=get_all_tasks&search='+search+'&my_task_status='+filter;
    store.load();

    return filter;
}