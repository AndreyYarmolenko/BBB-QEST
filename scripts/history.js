var storeTaskProgress = new Ext.data.Store({
    fields: ['id','create_date', 'create_by', 'change_date', 'change_by', 'status', 'task_content', 'changes'],
    proxy: {
      type: 'ajax',
      url: 'scripts/history.php?getTaskProgress=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

var storeTaskHistory = new Ext.data.Store({
    fields: ['id','create_date', 'create_by', 'change_date', 'change_by', 'task_type', 'task_type_id', 'status'],
    proxy: {
      type: 'ajax',
      url: 'scripts/history.php?getTaskHistory=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

function getHistoryPanel(data){
	var resume_store = new Ext.data.Store({
	    fields: ['label', 'new_value', 'old_value']
	});

	var data_changes = data.data_changes;
	var form = data.form;
	var fields = form.getForm().getFields();
	var time_id = getTimeID(fields);
	var resume = "";
	var new_value="";
	var old_value = "";
	for(var key in data_changes) {
		var el = getFieldByName(fields, key);
		if(el){
			if(el.xtype=='combobox'){
				var temp_store = el.store;
				temp_store.each(function(record){
					if(record.get('id')==data_changes[key].new) data_changes[key].new = record.get('value');
					if(record.get('id')==data_changes[key].old) data_changes[key].old = record.get('value');
				});
			}
			resume_store.add({label:el.fieldLabel, new_value: data_changes[key].new, old_value: data_changes[key].old});
			el.setConfig("fieldStyle", "border: 1px solid #800080");
		}
		/*else{
			if(key == "PotentialCustomers"){
				var pot_cust_grid;
				if(Ext.getCmp('Customers_ner'+time_id)){
					pot_cust_grid = Ext.getCmp('Customers_ner'+time_id);
				}
				else{
					pot_cust_grid =Ext.getCmp('Customers_due_diligence'+time_id);
				}
				pot_cust_grid.setStyle('border', '1px solid #800080');
				resume_store.add({label:'Potential Customers', new_value: formatArrayToString(data_changes[key].new), old_value: formatArrayToString(data_changes[key].old)});
			}
		}*/
	}
	
	if(resume_store.data.length==0) {
		resume_store.add({label:'NO CHANGES', new_value: 'NO DATA', old_value: 'NO DATA'});
	}
	

	var grid = Ext.create('Ext.grid.Panel',{
		store: resume_store,
		columns : [{
	        	text: lan.field_name,
	            dataIndex : 'label',
	            width: 200,
	            sortable: false,
	        },{   
	            text : lan.new_value,
	        	dataIndex : 'new_value',
	            flex: 1,
	            sortable: false,
	        },{
	        	text : lan.old_value,
	            dataIndex : 'old_value',
	            flex: 1,
	            sortable: false,
	        }]
		});

	var history_panel = [{
                xtype: 'container',
                layout: 'anchor',
                autoScroll: true,
                margin: '0 0 0 10',
                items: [{
                    xtype: 'fieldset',
		            title: lan.sum_of_change,
		            border: 2,
		            anchor: '96%',
		            items: grid
                },{
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                	xtype: 'button',
		            text: lan.full_stack,
		            anchor: '96%',
		            flex: 1,
		            handler:function(){
		              	Ext.getCmp('full_task').show();
			            }
			         },{
                        xtype: 'splitter'
                    },{
                	xtype: 'button',
		            text: lan.go_to_task,
		            anchor: '96%',
		            flex: 1,
		            handler:function(){
		              	//Ext.WindowMgr.hideAll();
		              	Ext.WindowMgr.each(function(win){
		              		win.destroy();
		              	});
		              	var el = getFieldByName(fields, 'idx');
		              	//var el_req_id = getFieldByName(fields, 'RequestID');
		              	//var request_id = el_req_id.getValue();
		              	var idx = el.getValue();
		              	var id_row = "(SELECT `task_id` FROM `bb_order_tasks` WHERE `task_type` = "+data.task_type+" AND `outID_task` = "+idx+")";
		              	var time_id = Date.parse(new Date())-1000000;
		              	var inData = {task_id:task_names[data.task_type], time_id: time_id, id_row: id_row, rights: all_rights[task_names[data.task_type]]};
		                //var form = addForm(id_task, false, select.get('id'), null, all_rights[id_task]); //rights rule
		               var form = addForm(inData); //rights rule
		               tabs.items.each(function(item){
	                        if(item){
	                            if(item.id == 'tab'+task_names[data.task_type]){
	                                tabs.remove(item);
	                            }
								//console.log(item.id + " / " + 'tab'+id_task);
	                        }
	                    });
		                addTab(true, data.task_name, task_names[data.task_type], form);
			            }
			         }]
			     },
                {
                    xtype: 'fieldset',
		            title: lan.full_stack,
		            id: 'full_task',
		            border: 2,
		            anchor: '96%',
		            hidden: true,
		            items: form
                }]
		}];

	return history_panel;
}

function getHistoryItem(task_type, task_name, request_id){
	var task_progress_grid = Ext.create('Ext.grid.Panel', {
				title: task_name+'. '+lan.requestID+':'+request_id,
				store: storeTaskProgress,
			    //autoScroll: true,
				columns : [{
			        	text : lan.create_date,
			            dataIndex : 'create_date',
			            width: 120,
			            sortable: false,
			        },{   
			            text : lan.create_by,
			        	dataIndex : 'create_by',
			            width: 200,
			            sortable: false,
			            hideable: false,
			        },{
			        	text : lan.change_date,
			            dataIndex : 'change_date',
			            width: 120,
			            sortable: false,
			        },{   
			            text : lan.change_by,
			        	dataIndex : 'change_by',
			            width: 200,
			            sortable: false,
			            hideable: false,
			        },{   
			            text : lan.status,
			        	dataIndex : 'status',
			            width: 100,
			            sortable: false,
			            hideable: false,
			        }],
			    listeners: {
			        itemdblclick: function(View, record, item, index, e, eOpts) {
			        	var time_id = Date.parse(new Date())-1000000;
			        	var content = record.get('task_content');
			        	var changes = record.get('changes');
			        	content  = correctJSON(content);
			        	changes = correctJSON(changes);
			        	data = Ext.decode(content);
			        	for(var key in data) {
			        		if(key == "RequestedDate") data[key] = timeTransformHistory(data[key]);
			        		if(key == "AssignmentDate") data[key] = timeTransformHistory(data[key]);
			        		if(key == "CompletionDate") data[key] = timeTransformHistory(data[key]);
			        	}
			        	data_changes = Ext.decode(changes);
			        	for(var key in data_changes) {
			        		if(key == "RequestedDate") data_changes[key].new = timeTransformHistory(data_changes[key].new);
			        		if(key == "AssignmentDate") data_changes[key].new = timeTransformHistory(data_changes[key].new);
			        		if(key == "CompletionDate") data_changes[key].new = timeTransformHistory(data_changes[key].new);			        		
			        	}
			        	var inDataAddForm = {task_id:task_names[task_type], type: true, time_id: time_id, content: data, buttons_hide: true};
			        	var form = addForm(inDataAddForm);
			        	var history_panel = getHistoryPanel({data_changes:data_changes, form: form, task_type: task_type, request_id: request_id, task_name: task_name});
			        	var inData = {id:'cccc', title: task_name, item: history_panel};
						showObject(inData);
			       }
			    }
		});

var task_history_grid = Ext.create('Ext.grid.Panel', {
    					title: lan.requestID+' '+request_id,
    					store: storeTaskHistory,
					    //autoScroll: true,
						columns : [{
					        	text : lan.create_date,
					            dataIndex : 'create_date',
					            width: 120,
					            sortable: false,
					        },{   
					            text : lan.create_by,
					        	dataIndex : 'create_by',
					            width: 200,
					            sortable: false,
					            hideable: false,
					        },{
					        	text : lan.last_change,
					            dataIndex : 'change_date',
					            width: 120,
					            sortable: false,
					        },{   
					            text : lan.Changedby,
					        	dataIndex : 'change_by',
					            width: 200,
					            sortable: false,
					            hideable: false,
					        },{   
					            text : lan.taskType,
					        	dataIndex : 'task_type',
					            width: 200,
					            sortable: false,
					            hideable: false,
					        },{   
					            text : lan.current_status,
					        	dataIndex : 'status',
					            width: 100,
					            sortable: false,
					            hideable: false,
					        }],
			    listeners: {
			        itemdblclick: function(View, record, item, index, e, eOpts) {
			        	var show_task_type = record.get('task_type_id');
			        	this.up('window').destroy();
			        	showHistory(show_task_type, request_id);
			       }
			    }
			});


	var history_item = {
      xtype: 'tabpanel',
      //scrollable: true,
      resizeTabs: true,
      items: [{
              title: lan.task_progress,
              autoScroll: true,
              items:task_progress_grid
          },{
              title: lan.task_history,
              autoScroll: true,
              items:task_history_grid
          }]
     };
     return history_item;
}

function showHistory(task_type, request_id){
	var time_id = Date.parse(new Date());
	var task_name = "";
	storeTaskProgress.load({
		params: {
			task_type: task_type,
			RequestID: request_id
		}
	});

	storeTaskHistory.load({
		params: {
			RequestID: request_id
		}
	});

Ext.Ajax.request({
        url: 'scripts/history.php?getTaskName=true',
        method: 'POST',
        params: {
             task_type: task_type
            },
        success: function (response){
            if(response) {
                task_name = response.responseText;
                var history_item = getHistoryItem(task_type, task_name, request_id);
                inData = {id:time_id, title: lan.history, item: history_item};
				showObject(inData);
           }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
	
}