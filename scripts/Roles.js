var bbb_role_store = new Ext.data.Store({
	    pageSize: 50,
        fields: ['id','name', 'description'],
        proxy: 
        {
          type: 'ajax',
          url: 'scripts/Roles.php?roleShow=true',
          reader: 
          {
            type: 'json',
            root: 'rows',
			totalProperty: 'total'
          },
		  simpleSortMode: true
        },
		sorters: [{
                property: 'id',
                direction: 'ASC'
        }]
});


var storeEngineering = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getEngRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

var storeWorkflow = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}, {name:'change_responsible', type: 'bool'},{name:'change_assignee', type: 'bool'},{name:'change_due_date', type: 'bool'}, {name:'complete', type: 'bool'}, {name:'history', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getWorkflowRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

var storeReports = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getReportsRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

var storeAdministration = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}, {name:'create', type: 'bool'}, {name:'edit', type: 'bool'}, {name:'delete', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getAdministrationRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

var storeCatalogue = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}, {name:'create', type: 'bool'}, {name:'edit', type: 'bool'}, {name:'delete', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getCatalogueRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});


var storeManagement = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'approve', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getManagRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

var storeHR = new Ext.data.Store({
    fields: ['id','name', 'permission', {name:'view', type: 'bool'}, {name:'create', type: 'bool'}, {name:'edit', type: 'bool'}, {name:'delete', type: 'bool'}],
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?getHRRights=true',
      reader: {
          type: 'json',
          root: 'rows'
      }
    },
    listeners:{
    	load:function(store, records, successful, operation, eOpts){
    		store.each(function(record){
    			record.set('name', lan[record.get('permission')]);
    		});
    	}
    }
});

function fillStoreByRights(store, data){
		store.each(function(record){
			for(var i=0; i<data.length;i++){
				if(record.get('id')==data[i].id){
					record.set(data[i].right, true);
				}
			}
		});
}

Ext.define('RoleUsersModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'},
	          {name: 'description'},
	          {name:'check', type: 'bool', defaultValue:'false'}
			]
});

var RoleUsersStore = new Ext.data.Store({
    model: 'RoleUsersModel',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'scripts/Roles.php?func=showRoleUsers',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});


function show_bbb_role(rights){
	bbb_role_store.load();

	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

        
    var PagingToolbar_bbb_role = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: bbb_role_store,
        displayInfo: true
    });
    	     	
var grid_bbb_role = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
        layout: 'fit',
        columnLines: true,
        border: false,
        frame: false,
        id: 'grid_bbb_role_id',
        autoScroll: true,
        store: bbb_role_store,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
            markDirty:false
        },
        dockedItems: [
		{
            xtype: 'toolbar',
            items: [{
                text: lan.add,
                iconCls: 'add',
                disabled: disable_add, //rights rule
                handler: function(){
					show_bbb_role_addedit(null, null, 'add');
				}
				},'-',
				{
	                text: lan.edit,
	                iconCls: 'edit',
	                disabled: disable_edit, //rights rule
	                handler: function(){
	                		var select = Ext.getCmp('grid_bbb_role_id').getView().getSelectionModel().getSelection()[0];
	                        if (select) {
	    						show_bbb_role_addedit(select.get('id'),select, 'edit');
	    					} else {
	                            Ext.MessageBox.alert(lan.error, lan.select_row);
	                        }
					}
				},'-',{
                text: lan.del,
                iconCls: 'delete',
                disabled: disable_delete, //rights rule
                handler: function(){
							var select = Ext.getCmp('grid_bbb_role_id').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        //alert(select.get('id'));
                                        Ext.Ajax.request({
                                            url: 'scripts/Roles.php',
                                            method: 'POST',
											params: {'delete':true, "id": select.get('id')},
                                            success: function(response) {
                                                var JSON = response.responseText;
												if (JSON) {
												try{
												var decoded = Ext.decode(JSON);
													if(decoded.success == false){
														Ext.MessageBox.alert(lan.error, decoded.message);
													}else{
														Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
														Ext.getCmp('grid_bbb_role_id').store.load();
														Ext.getCmp('grid_bbb_role_id').getView().refresh();
													}
												}catch(e) {
													Ext.MessageBox.alert(lan.error, lan.error+' ' + e.name + ":" + e.message + "\n" + e.stack);
												}
												}else{
													Ext.MessageBox.alert(lan.error, '');
												}
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
				/*{
	                text: lan.showUsers,
	                iconCls: 'user',
	                disabled: true,
	                handler: function(){
	                		var select = Ext.getCmp('grid_bbb_role_id').getView().getSelectionModel().getSelection()[0];
	                        if (select) {
	    						show_bbb_role_users(select.get('id'),select);
	    					} else {
	                            Ext.MessageBox.alert(lan.error, lan.select_row);
	                        }
					}
				},*/
				{
					xtype: 'textfield',
					name: 'search',
					emptyText: lan.search,
					labelWidth: style.input2.labelWidth,
					width: '48%',
					listeners: {
						change: function() {
							/*bbb_role_store.load({
								params: {filter: this.value}
							});*/
							bbb_role_store.getProxy().url = 'scripts/Roles.php?roleShow=true&filter=' + this.value;
							bbb_role_store.load();
						}
					}
				}
			]
	}],
    columns:[
      		{text:'№', width:40,xtype:'rownumberer'},
			{text: lan.role, dataIndex: 'name', sortable: true, width: 200},
			{text: lan.description, dataIndex: 'description', sortable: true,flex:1}
			],
    bbar:[PagingToolbar_bbb_role],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_bbb_role_addedit(records.get('id'),records, 'edit', disable_edit);
    	}
    }
});
	
	return grid_bbb_role;
	
}

function getFormRole(action, disable_edit){
var form_role = new Ext.create('Ext.form.Panel', {
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_bbb_role',
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[{
			            xtype:'hidden',
			            name:'role_id',
			            //id: 'role_id'
			        },{
	                    xtype: 'textfield',
	                    fieldLabel: lan.role,
	                    labelAlign:'top',
	                    name: 'name',
						allowBlank: false,
						anchor: '96%',
						readOnly: disable_edit,//rights rule
					},
					{
	                    xtype: 'textarea',
	                    fieldLabel: lan.description,
	                    labelAlign:'top',
	                    name: 'description',
						anchor: '96%',
						readOnly: disable_edit,//rights rule
					},{
		          xtype: 'tabpanel',
		          scrollable: true,
		          resizeTabs: true,
		          items: [{
		                  title: lan.engineering,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                	});
				                }
							}],
							store: storeEngineering,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false,
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        }
						    ]
						}]
		              }, {
		                  title: lan.workflow,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                		record.set('change_responsible', 1);
				                		record.set('change_assignee', 1);
				                		record.set('change_due_date', 1);
				                		record.set('change_new_due_date', 1);
				                		record.set('complete', 1);
				                		record.set('history', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                		record.set('change_responsible', 0);
				                		record.set('change_assignee', 0);
				                		record.set('change_due_date', 0);
				                		record.set('change_new_due_date', 0);
				                		record.set('complete', 0);
				                		record.set('history',0);
				                	});
				                }
							}],
							store: storeWorkflow,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 80,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.change_respons,
						        	dataIndex : 'change_responsible',
						            width: 120,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.change_assign,
						        	dataIndex : 'change_assignee',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.change_due_date,
						        	dataIndex : 'change_due_date',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.change_new_due_date,
						        	dataIndex : 'change_new_due_date',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.complete,
						        	dataIndex : 'complete',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.history,
						        	dataIndex : 'history',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        }]
						}]
		              }, {
		                  title: lan.reports,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                	});
				                }
							}],
							store: storeReports,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        }
						    ]
						}]
		              }, {
		                  title: lan.administration,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                		record.set('create', 1);
				                		record.set('edit', 1);
				                		record.set('delete', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                		record.set('create', 0);
				                		record.set('edit', 0);
				                		record.set('delete', 0);
				                	});
				                }
							}],
							store: storeAdministration,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 80,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.create,
						        	dataIndex : 'create',
						            width: 90,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.edit,
						        	dataIndex : 'edit',
						            width: 80,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.del,
						        	dataIndex : 'delete',
						            width: 90,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        }
						    ]
						}]
		              }, {
		                  title: lan.catalogue,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                		record.set('create', 1);
				                		record.set('edit', 1);
				                		record.set('delete', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                		record.set('create', 0);
				                		record.set('edit', 0);
				                		record.set('delete', 0);
				                	});
				                }
							}],
							store: storeCatalogue,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.create,
						        	dataIndex : 'create',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.edit,
						        	dataIndex : 'edit',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.del,
						        	dataIndex : 'delete',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        }
						    ]
						}]
		              },{
		                  title: lan.management,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('approve', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('approve', 0);
				                	});
				                }
							}],
							store: storeManagement,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false,
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.approve,
						        	dataIndex : 'approve',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        }
						    ]
						}]
		              }, {
		                  title: lan.hr_root,
		                  items:[{
							xtype:'grid',
							tools: [{
								xtype: 'button',
				                text: lan.allow_all,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 1);
				                		record.set('create', 1);
				                		record.set('edit', 1);
				                		record.set('delete', 1);
				                	});
				                }
							},{
								xtype: 'button',
				                text: lan.reset,
				                disabled: disable_edit,//rights rule
				                width: 150,
				                handler: function() {
				                	var store = this.up('grid').getStore();
				                	store.each(function(record){
				                		record.set('view', 0);
				                		record.set('create', 0);
				                		record.set('edit', 0);
				                		record.set('delete', 0);
				                	});
				                }
							}],
							store: storeHR,
						    autoScroll: true,
						    viewConfig: {
					            stripeRows: true,
					            markDirty:false
					        },
							columns : [{
						        	text : lan.rights,
						            dataIndex : 'name',
						            width: 300,
						            sortable: false,
						            hideable: false
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.view,
						        	dataIndex : 'view',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.create,
						        	dataIndex : 'create',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.edit,
						        	dataIndex : 'edit',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        },{   
						            xtype: 'checkcolumn',
						            text : lan.del,
						        	dataIndex : 'delete',
						            width: 100,
						            sortable: false,
						            hideable: false,
						            disabled: disable_edit,//rights rule
						            listeners: {
						            	checkchange: function(col, rowIndex, checked, record, eOpts){
						            		if(checked){
						            			record.set('view', true);
						            		}
						            	}
						            }	
						        }
						    ]
						}]
		              }]
		       }],
				buttons:[
					{ 
	                    text:lan.save,
						iconCls:'save',
						disabled: disable_edit,//rights rule
						handler: function() {
							var dim_eng =[];
							var dim_workfl =[];
							var dim_rep =[];
							var dim_adm =[];
							var dim_catal =[];
							var dim_manage =[];
							var dim_hr =[];

							storeEngineering.each(function(record){
								dim_eng.push({id:record.get('id'), view:record.get('view')});
							});

							storeWorkflow.each(function(record){
								dim_workfl.push({id:record.get('id'), view:record.get('view'), change_responsible:record.get('change_responsible'), change_assignee:record.get('change_assignee'), change_due_date:record.get('change_due_date'), change_new_due_date:record.get('change_new_due_date'), complete:record.get('complete'), history:record.get('history')});
							});

							storeReports.each(function(record){
								dim_rep.push({id:record.get('id'), view:record.get('view')});
							});

							storeAdministration.each(function(record){
								dim_adm.push({id:record.get('id'), view:record.get('view'), create:record.get('create'), edit:record.get('edit'), delete:record.get('delete')});
							});

							storeCatalogue.each(function(record){
								dim_catal.push({id:record.get('id'), view:record.get('view'), create:record.get('create'), edit:record.get('edit'), delete:record.get('delete')});
							});

							storeManagement.each(function(record){
								dim_manage.push({id:record.get('id'), approve:record.get('approve')});
							});

							storeHR.each(function(record){
								dim_hr.push({id:record.get('id'), view:record.get('view'), create:record.get('create'), edit:record.get('edit'), delete:record.get('delete')});
							});

							var engJS = JSON.stringify(dim_eng);
							var workflJS = JSON.stringify(dim_workfl);
							var repJS = JSON.stringify(dim_rep);
							var admJS = JSON.stringify(dim_adm);
							var catalJS = JSON.stringify(dim_catal);
							var manageJS = JSON.stringify(dim_manage);
							var hrJS = JSON.stringify(dim_hr);

							var params = {
								'saveRole':true,
								'action':action,
								'eng_rights':engJS,
								'workfl_rights':workflJS,
								'rep_rights':repJS,
								'adm_rights':admJS,
								'catal_rights':catalJS,
								'manage_rights':manageJS,
								'hr_rights':hrJS
							}

							var form = this.up('form').getForm();
							if(form.isValid()){
								form.submit({
									url: 'scripts/Roles.php',
									waitMsg: lan.saving,
									wait: true,
									scope: this,
									method: 'post',
									params: params,
									success: function(fp, o) {
										var data = o.result;
										Ext.MessageBox.alert(lan.succ, data.message);
										WindowForm_bbb_role.destroy();
										bbb_role_store.load();
									},
									failure: function(fp, o) {
										Ext.MessageBox.alert(lan.fail, o.result.message);
									}
								});

							}
						}
                    },
					{ 
	                    text:lan.cancel,
						iconCls: 'cancel',
	                    handler:function(){
	                        WindowForm_bbb_role.destroy();        
	                    }
					}
				]
			})

	return form_role;
}



var WindowForm_bbb_role = null;

function show_bbb_role_addedit(idrow, select, action, disable_edit){
storeEngineering.load();
storeWorkflow.load();
storeReports.load();
storeAdministration.load();
storeCatalogue.load();
storeManagement.load();
storeHR.load();
var texttype;

if(idrow){
	texttype = lan.edit;
}else{
	texttype = lan.add;
}

if(!WindowForm_bbb_role){
	var form_role = getFormRole(action, disable_edit);
	if(select){
		form_role.getForm().findField("role_id").setValue(select.get('id'));
		form_role.getForm().findField("name").setValue(select.get('name'));
		form_role.getForm().findField("description").setValue(select.get('description'));

		Ext.Ajax.request({
            url: 'scripts/Roles.php?getRightsByRole=true',
            method: 'POST',
            params: {
                role_id: select.get('id'),
                },
            success: function (response){
              var data = Ext.decode(response.responseText);
              if(data.engineering){
              		fillStoreByRights(storeEngineering, data.engineering);
              }
              if(data.workflow){
              		fillStoreByRights(storeWorkflow, data.workflow);
              }

              if(data.reports){
              		fillStoreByRights(storeReports, data.reports);
              }
              if(data.administration){
              		fillStoreByRights(storeAdministration, data.administration);
              }
              if(data.catalogue){
              		fillStoreByRights(storeCatalogue, data.catalogue);
              }

              if(data.management){
              		fillStoreByRights(storeManagement, data.management);
              }

              if(data.hr){
              		fillStoreByRights(storeHR, data.hr);
              }
              
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
	}
		WindowForm_bbb_role = new Ext.Window({
            width: '80%',
            height: '80%',
            title: texttype+' '+lan.role,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_bbb_role = null;
                }
            },
            items: form_role
		});
}		
		WindowForm_bbb_role.show();	
}


function show_bbb_role_users(idrow,select){

RoleUsersStore.setProxy({
	  type: 'ajax',
      url: 'scripts/Roles.php?func=showRoleUsers&roleID='+ idrow,
      reader: {
          type: 'json',
          root: 'rows'
      }  	  
});	

RoleUsersStore.load();

if(!WindowForm_bbb_role){
        
		WindowForm_bbb_role = new Ext.Window({
            width: 280,
            height: 310,
            title: lan.showUsers,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_bbb_role = null;
                }
            },
            items:[
			new Ext.create('Ext.form.Panel', {
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_bbb_role',
				frame: true,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:
				[
					{
						xtype:'grid',
					    //title: lan.users,
						store: RoleUsersStore,
					    autoScroll: false,
					    height : 220,
						columns : 
						[
					        {
						        text:'№',
				                width:40,
				                xtype:'rownumberer'
							}, 
							{
					        	text : lan.clientName,
					            dataIndex : 'name',
					            flex:1,
					            sortable: false,
					            hideable: false
					        }
					    ]
					}
				],
				buttons:
				[
					{ 
	                    text:lan.cancel,
						iconCls: 'cancel',
	                    handler:function(){
	                        WindowForm_bbb_role.destroy();        
	                    }
					}
				]
			})
			]
		});
}		
		WindowForm_bbb_role.show();
	
	
		
}

