function listUser(id, rights) {
	var time_id = Date.parse(new Date());
	var grid = null;
	var model_data = [];
    var columns_data = [];
    var url;

   	var hdadd = true, hdedit = true, hddelete = true, hdsearch = true, hdstatus = true, hdmytask  = true;
    var pressed_new_task = false, pressed_in_que = false, pressed_in_pr = false, pressed_overdue = false;
   	var status_btn = null, status;

    model_data = ['id', 'login', 'name', 'title', 'boss_func', 'department', 'boss_ad', 'ft_pt', 'active', 'roles'];
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.login, dataIndex: 'login', sortable: true, hideable: true, width: 150},
        {text: lan.employee_name, dataIndex: 'name', sortable: true, hideable: true, width: 250},
        {text: lan.title, dataIndex: 'title', sortable: true, hideable: true, width: 250},
        {text: lan.roles, dataIndex: 'roles', sortable: true, hideable: true, width: 150},
		{text: lan.func_manager, dataIndex: 'boss_func', sortable: true, hideable: true, width: 250},
		{text: lan.admin_manager, dataIndex: 'boss_ad', sortable: true, hideable: true, width: 250},
		{text: lan.department, dataIndex: 'department', sortable: true, hideable: true, width: 200},
        {text: lan.ft_pt, dataIndex: 'ft_pt', sortable: true, hideable: true, width: 150},
        {text: lan.act_inact, dataIndex: 'active', sortable: true, hideable: true, width: 150, renderer: activeUser},
    ];
    property = 'requested_date';
    groupField = 'id';

    url = 'scripts/reports/all_reports.php?orgStatus=true';

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
                                        fieldLabel: lan.employee_name,
                                        name: "emp_name",
                                        //store: data_store_users,
                                        store: users_store,
                                        queryMode: 'remote',
                                        minChars:2,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "emp_name"+time_id,
                                        width: "90%",
                                        labelWidth: 170,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.title,
                                        name: "title",
                                        store: title_store,
                                        valueField: 'value',
                                        displayField: 'value',
                                        id: "title"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.admin_manager,
                                        name: "admin_manager",
                                        queryMode: 'remote',
                                        minChars:2,
                                        store: admin_manager_store,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "admin_manager"+time_id,
                                        width: "90%",
                                        labelWidth: 170,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.roles,
                                        name: "roles",
                                        queryMode: 'remote',
                                        minChars:2,
                                        store: store_roles,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "roles"+time_id,
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
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.func_manager,
                                        store: func_manager_store,
                                        queryMode: 'remote',
                                        minChars:2,
                                        valueField: 'id',
                                        displayField: 'value',
                                        name: "func_manager",
                                        id: "func_manager"+time_id,
                                        width: "90%",
                                        labelWidth: 170,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.department,
                                        name: "depart",
                                        store: store_department,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "depart"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.act_inact,
                                        name: "active",
                                        store: store_active,
                                        multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "active"+time_id,
                                        width: "90%",
                                        labelWidth: 100,
                                    },
                                    {
                                        xtype: "combobox",
                                        margin: 10,
                                        fieldLabel: lan.employment_status,
                                        name: "emp_status",
                                        store: employStatusStore,
                                        //multiSelect: true,
                                        valueField: 'id',
                                        displayField: 'value',
                                        id: "emp_status"+time_id,
                                        width: "90%",
                                        labelWidth: 170,
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
                        			if(Ext.getCmp("emp_name"+time_id).getValue() != "") Ext.getCmp("emp_name"+time_id).setValue("");
                        			if(Ext.getCmp("title"+time_id).getValue() != "") Ext.getCmp("title"+time_id).setValue("");
                        			if(Ext.getCmp("admin_manager"+time_id).getValue() != "") Ext.getCmp("admin_manager"+time_id).setValue("");
                        			if(Ext.getCmp("func_manager"+time_id).getValue() != "") Ext.getCmp("func_manager"+time_id).setValue("");
                        			if(Ext.getCmp("depart"+time_id).getValue() != "") Ext.getCmp("depart"+time_id).setValue("");
                        			if(Ext.getCmp("active"+time_id).getValue() != "") Ext.getCmp("active"+time_id).setValue("");
                        			if(Ext.getCmp("roles"+time_id).getValue() != "") Ext.getCmp("roles"+time_id).setValue("");
                        			if(Ext.getCmp("emp_status"+time_id).getValue() != "") Ext.getCmp("emp_status"+time_id).setValue("");
                        		}
                        	},
                        	{
		                        xtype: "button",
		                        text: lan.form,
		                        margin: "10 0 10 300",
		                        width: 200,
		                        handler: function() {
		                        	if(Ext.getCmp("depart"+time_id).getValue()) var departJoin = Ext.getCmp("depart"+time_id).getValue().join();
		                        	if(Ext.getCmp("active"+time_id).getValue()) var active = Ext.getCmp("active"+time_id).getValue().join();
		                        	if(Ext.getCmp("roles"+time_id).getValue()) var roles = Ext.getCmp("roles"+time_id).getValue().join();
		                            Ext.Ajax.request({
		                                url: "scripts/reports/all_reports.php?userList=true",
		                                method: 'POST',
		                                params: {
		                                   empName: Ext.getCmp("emp_name"+time_id).getValue(),
		                                   title: Ext.getCmp("title"+time_id).getValue(),
		                                   funcManager: Ext.getCmp("func_manager"+time_id).getValue(),
		                                   depart: departJoin,
		                                   adminManager: Ext.getCmp("admin_manager"+time_id).getValue(),
		                                   active: active,
		                                   roles: roles,
		                                   empStatus: Ext.getCmp("emp_status"+time_id).getValue() 
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