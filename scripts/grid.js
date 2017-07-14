function addGrid(id, rights) {
    
	var grid = null;
	var model_data = [];
    //var store_data = [];
    var columns_data = [];
    var WindowComponent = null;
    var WindowViewTables = null;
    var url;
	var hdadd = true, hdedit = true, hddelete = true, startecr = true, view =true, hdsearch = true;

	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    } 


    var time_id = Date.parse(new Date());
	
	var GroupHeader = Ext.create('Ext.grid.feature.Grouping',{
    	groupHeaderTpl: '{columnName}: {name} ({rows.length})',
    	disabled: false,
    	hideGroupedHeader: false,
		enableGroupingMenu: false,
        startCollapsed: false,
		enableNoGroups: true
    });
	
    switch (id) {
        case 'all_tasks':
            grid = allTasks(id, rights);
            return grid;
            break
       case 'users':
            grid = show_bbb_courier(rights);
            return grid;
            break
        case 'taskStatus':
            grid = show_taskStatus(rights);
            return grid;
            break
        case 'taskType':
            grid = show_taskType(rights);
            return grid;
            break 
        case 'job_description':
            grid = show_jobDescription(rights);
            return grid;
            break
        case 'clients':
            grid = show_clients(rights);
            return grid;
            break
        case 'order':
            grid = show_order(rights);
            return grid;
            break
        case 'orderTasks':
            grid = show_orderTasks(rights);
            return grid;
            break
		case 'orderStatus':
			grid = show_orderStatus(rights);
			return grid;
            break
		case 'roles':
            grid = show_bbb_role(rights);
                return grid;
		case 'groups':
            grid = show_groups(rights);
                return grid;
         case 'product_type':
            grid = show_product(rights);
                return grid;
          case 'product_line':
            grid = show_prodline(rights);
                return grid;
        case 'family_type':
            grid = show_family(rights);
                return grid;
            break
		case 'logs':
            model_data = ['actionfunc','actiontext','date','ip','sysname','iduser'];
            columns_data = [
                {text: lan.Actionfunc, dataIndex: 'actionfunc', sortable: true, hideable: true, width: 200},
				{text: lan.Actiontext, dataIndex: 'actiontext', sortable: true, hideable: true, flex: 1},
				{text: lan.date, dataIndex: 'date', sortable: true, hideable: true, width: 200},
				{text: lan.ip, dataIndex: 'ip', sortable: true, hideable: true, width: 200},
				{text: lan.Sysname, dataIndex: 'sysname', sortable: true, hideable: true, width: 200},
				{text: lan.user, dataIndex: 'iduser', sortable: true, hideable: true, width: 200}
            ];
            property = 'id';
			groupField = 'id';
            url = 'scripts/datastore.php?func='+id;
            hdadd = true, hdedit = true, hddelete = true;
			GroupHeader.disabled = true;
            break	
			
		case 'new_engineering_req':
            model_data = ['id','name','datetime','user'];
            columns_data = [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, flex: 1},
				{text: lan.date, dataIndex: 'datetime', sortable: true, hideable: true, width: 120},
				{text: lan.user, dataIndex: 'user', sortable: true, hideable: true, user: 1}
            ];
            property = 'idx';
			groupField = 'idx';
            url = 'scripts/datastore.php?func='+id;
            hdadd = false, hdedit = false, hddelete = false;
			GroupHeader.disabled = true;
            break
		case 'tasks':
            model_data = ['task_id','tasks_type','current_status','last_changed','last_changed_by'];
            columns_data = [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {text: lan.taskType, dataIndex: 'tasks_type', sortable: true, hideable: true, flex: 1},
				{text: lan.status, dataIndex: 'current_status', sortable: true, hideable: true, width: 120},
				{text: lan.Lastchanged, dataIndex: 'last_changed', sortable: true, hideable: true, width: 120},
				{text: lan.Changedby, dataIndex: 'last_changed_by', sortable: true, hideable: true, width: 120}
            ];
            property = 'task_id';
			groupField = 'task_id';
            url = 'scripts/datastore.php?func='+id;
            hdadd = true, hdedit = true, hddelete = true;
			GroupHeader.disabled = true;
            break
		case 'feasibility':
            model_data = ['idx','product_type','datetime','PartDescription','user'];
            columns_data = [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {text: lan.ProductType, dataIndex: 'product_type', sortable: true, hideable: true},
				{text: lan.PartDescription, dataIndex: 'PartDescription', sortable: true, hideable: true},
				{text: lan.user, dataIndex: 'user', sortable: true, hideable: true}
            ];
            property = 'idx';
			groupField = 'idx';
            url = 'scripts/datastore.php?func='+id;
            hdadd = false, hdedit = false, hddelete = false;
            break
		case 'product_design':
            model_data = ['id','Component','AttributeName','AttributeValue','images'];
            columns_data = [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {text: lan.AttributeName, dataIndex: 'AttributeName', sortable: true, hideable: true},
				{text: lan.AttributeValue, dataIndex: 'AttributeValue', sortable: true, hideable: true},
				{text: lan.Image, dataIndex: 'images', sortable: true, hideable: true}
            ];
            property = 'idx';
			groupField = 'idx';
            url = 'scripts/datastore.php?func='+id;
            hdadd = false, hdedit = false, hddelete = false;
            break;
         case 'locations':
             model_data = ['id','Name','Address','ContactPerson','Description'];
            columns_data = [
                {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
                {text: lan.name, dataIndex: 'Name', sortable: true, hideable: true},
                {text: lan.address, dataIndex: 'Address', sortable: true, hideable: true, width:350},
                {text: lan.ContactPerson, dataIndex: 'ContactPerson', sortable: true, hideable: true},
                {text: lan.description, dataIndex: 'Description', sortable: true, hideable: true}
            ];
            property = 'id';
            groupField = /*'id'*/'';
            url = 'scripts/datastore.php?func='+id;

            if(rights){//rights rule
                disable_add = (rights.indexOf('create')!=-1)? false : true;
                disable_edit = (rights.indexOf('edit')!=-1)? false : true;
                disable_delete = (rights.indexOf('delete')!=-1)? false : true;
            } 

            hdadd = false, hdedit = false, hddelete = false, hdsearch = false;
            break;
         break;
         case 'test_procedure':
         	grid = getTestProcedureGrid(time_id, rights);
            return grid;
            break;
        case 'tool_gage':
            grid = addToolGageGrid(time_id, false, null, true, rights, false);
            return grid;
            break;
        case 'equipment':
            grid = addEquipGrid(time_id, false, true, rights, false);
            return grid;
            break;
        case 'workstation':
            grid = addWorkStGrid(time_id, false, true, rights, false);
            return grid;
            break;
         /*case 'comp_part_number':
            grid = addGridComponent(time_id, id, false, true, null, rights);
            return grid;
            break*/
        case 'comp_part_number':
            grid = addComponentsGrid({time_id: time_id, rights: rights});
            return grid;
            break
        case 'operation_procedures':
            grid = addGridOperation({time_id: time_id, rights:rights});
            return grid;
            break
        case 'pack_requirement':
            grid = addGridPackRequirement(time_id, rights, add_btn=false, view = false);
           /* inData = {time_id:time_id, rights: rights}
            grid = addGridPackRequirement(inData);*/
            return grid;
            break
        case 'bom':
            storeBOM.removeAll;
            grid = addBOMGrid({time_id: time_id, rights: rights});
            return grid;
            break
        case 'processes_dir':
            grid = addProcessGrid({time_id: time_id, rights: rights});
            return grid;
            break 
		default:
            model_data = [];
            columns_data = [];
            property = 'idx';
			groupField = 'idx';
            url = 'scripts/datastore.php?func='+id;
    }
	
	
	Ext.define('data_model', {
        extend: 'Ext.data.Model',
		idProperty: 'my_primary_key',
        fields: model_data,
    });
    var data_store = new Ext.data.Store({
        autoLoad: true,
		// autoSync: true,
        //autoDestroy: true,
        pageSize: 25,
        remoteSort: true,
        model: 'data_model',
		groupField: groupField,
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
            simpleSortMode: true
        },
        sorters: [{
                property: property,
                direction: 'ASC'
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
        features: [GroupHeader],
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
                        text: lan.add,
                        iconCls: 'add',
                        disabled: disable_add, //rights rule
                        hidden: hdadd,
                        handler: function() {
							ShowWindowFormRef(true, id, '');
                        }
                    },'-',
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        disabled: disable_edit, //rights rule
                        hidden: hdedit,
                        handler: function() {
                            var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                ShowWindowFormRef(false, id, select.get('id'), true);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },'-',
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        disabled: disable_delete, //rights rule
                        hidden: hddelete,
                        handler: function() {
                            var select = Ext.getCmp(id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/deleteDirectory.php',
                                            method: 'POST',
                                            params: {"table": id, "delete": select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp(id).store.load();
                                            },
                                            failure: function(response) {
                                                 Ext.MessageBox.alert(lan.error, response.responseText);
                                            }
                                        });
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'search',
                        emptyText: lan.search,
                        labelWidth: style.input2.labelWidth,
                        width: '48%',
                        hidden: hdsearch,
                        listeners: {
                            change: function() {
                                data_store.load({
                                    params: {filter: this.value}
                                });
                                data_store.getProxy().url = url + "&filter=" + this.value;
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
            itemdblclick: function(View, record, item, index, e, eOpts) {
               var select = record.get('id');
               ShowWindowFormRef(false, id, select, true);
            }
        }
    }
	
	return grid;
	
}