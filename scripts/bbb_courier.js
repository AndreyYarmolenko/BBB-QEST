Ext.define('bbb_courier_model', {
    extend: 'Ext.data.Model',
    fields: ['id','login','role']
});


var bbb_courier_store = new Ext.data.Store({
	    pageSize: 50,
        model: 'bbb_courier_model',
        remoteSort: true,
        //autoDestroy: true,
        proxy: 
        {
          type: 'ajax',
          url: 'scripts/bbb_courier.php?couriershow=true',
          reader: 
          {
            type: 'json',
            root: 'rows',
			totalProperty: 'total'
          },
		  simpleSortMode: true
        },
		sorters: [{
                property: 'last_name',
                direction: 'ASC'
        }]
});

var store_role_grid = new Ext.data.Store({     
        fields: ['id', 'name']
    });

Ext.define('ManagerModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var ManagerStore = new Ext.data.Store({
    model: 'ManagerModel',
    proxy: {
      type: 'ajax',
      url: 'scripts/bbb_courier.php?func=showManager',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

var admin_manager_store = new Ext.data.Store({
    fields: ['id', 'name'],
    proxy: {
      type: 'ajax',
      url: 'scripts/bbb_courier.php?func=showManager',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

Ext.define('RoleModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'}
			]
});
var RoleStore = new Ext.data.Store({
    model: 'RoleModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/bbb_courier.php?func=showRoles',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

var timezoneStore = new Ext.data.Store({
	fields: [{name: 'id', type: 'int'}, {name: 'value', type: "string"}],
    data: [
    	{
    		name: "(UTC +02:00) Europe",
    		value: 1
    	},
    	{
    		name: "(UTC-05:00) Eastern Time (US & Canada)",
    		value: 2
    	}, 
    	{
    		name: "(UTC -06:00) Central Time (US & Canada)",
    		value: 3
    	}
    ]
});

function setUserUrl(filter){
	bbb_courier_store.setProxy({
        type: 'ajax',
        url: 'scripts/bbb_courier.php?couriershow=true&filter='+filter,
        reader: {
             type: 'json',
             root: 'rows',
             totalProperty: 'total'
        },
        simpleSortMode: true
    });
    bbb_courier_store.load();
    bbb_courier_store.clearFilter();
}

function show_bbb_courier(rights){
	bbb_courier_store.load();

	var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }
        
    var PagingToolbar_bbb_courier = Ext.create('Ext.PagingToolbar', {
        //height:30,
        border: false,
        frame: false,
        store: bbb_courier_store,
        displayInfo: true
    });
    	     	

var grid_bbb_courier = new Ext.create('Ext.grid.Panel',{
		xtype: 'grid',
		//fileUpload:true,
        layout: 'fit', //new Ext.grid.GridPanel({
        //forceFit: false,
        columnLines: true,
        border: false,
        frame: false,
        //autoHeight: true,
        id: 'grid_bbb_courier_id',
        autoScroll: true,
        store: bbb_courier_store,
        //features: [RequestFilters],
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
			//selectedItemCls: 'red'
        },
		//plugins: [rowEditing],
        dockedItems: [
		{
            xtype: 'toolbar',
            items: [{
                text: lan.add,
                iconCls: 'add',
                disabled: disable_add, //rights rule
                handler: function(){
					show_bbb_courier_addedit();
				}
				},'-',{
                text: lan.edit,
                iconCls: 'edit',
                disabled: disable_edit, //rights rule
                handler: function(){
                		var select = Ext.getCmp('grid_bbb_courier_id').getView().getSelectionModel().getSelection()[0];
                        if (select) {
    						show_bbb_courier_addedit(select.get('id'),select);
    					} else {
                            Ext.MessageBox.alert(lan.error, lan.select_row);
                        }
					}
				},'-',{
                text: lan.del,
                iconCls: 'delete',
                disabled: disable_delete, //rights rule
                handler: function(){
							var select = Ext.getCmp('grid_bbb_courier_id').getView().getSelectionModel().getSelection()[0];
                           //console.log(select);
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        //alert(select.get('id'));
                                        Ext.Ajax.request({
                                            url: 'scripts/bbb_courier.php',
                                            method: 'POST',
											params: { 'delete':true, "id": select.get('id')},
                                            success: function(response) {
                                                var JSON = response.responseText;
												if (JSON) {
												try{
												var decoded = Ext.decode(JSON);
													if(decoded.success == false){
														Ext.MessageBox.alert(lan.error, decoded.message);
													}else{
														Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
														Ext.getCmp('grid_bbb_courier_id').store.load();
														Ext.getCmp('grid_bbb_courier_id').getView().refresh();
													}
												}catch(e) {
													Ext.MessageBox.alert(lan.error, lan.error+" "+ e.name + ":" + e.message + "\n" + e.stack);
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
				}, '-',{
	                xtype : 'textfield',
	                id    : 'UsersFilter',           
	                width: 120,
	            },
	            {

			    	xtype: 'button',
			    	iconCls: 'clear', 
			    	handler: function() {
			    		Ext.getCmp('UsersFilter').setValue('');
			    		setUserUrl('');
			    		
			    	}
			    },
	           	{
	           		xtype: 'button',
	                text: lan.search,
	                iconCls: 'search',
	                handler:function(){
	                	setUserUrl(Ext.getCmp('UsersFilter').getValue());
	                	
	                  /* bbb_courier_store.load({
	                   		params:{
	                   			filter:Ext.getCmp('UsersFilter').getValue()
	                   		}
	                   });*/
                    }
	            },
			]
	}],
    columns:[
      		{
		        text:'№',
                width:40,
                xtype:'rownumberer'
			},
			{
			   dataIndex: 'id',
			   hidden: true
			   },
			{
                text: lan.login, 
		        //text: request_toir.name, 
                dataIndex: 'login', 
                sortable: true
			},
			{
                text: lan.firstName, 
		        //text: request_toir.name, 
                dataIndex: 'first_name', 
                sortable: true
			},
			{
                text: lan.lastName, 
		        //text: request_toir.name, 
                dataIndex: 'last_name', 
                sortable: true
			},
			{
                text: lan.phoneNumber, 
		        //text: request_toir.name, 
                dataIndex: 'phone', 
                sortable: true
			},
			{
                text: lan.email, 
		        //text: request_toir.name, 
                dataIndex: 'email', 
                sortable: true
			},
			{
                text: lan.role, 
		        //text: request_toir.name, 
                dataIndex: 'role', 
                sortable: true
			},
			{
                text: lan.position, 
		        //text: request_toir.name, 
                dataIndex: 'title', 
                sortable: true
			},
			{
                text: lan.isActive, 
		        //text: request_toir.name, 
                dataIndex: 'active_colmn', 
                sortable: true,
				//flex: 1
			},
			{
                text: lan.department, 
		        //text: request_toir.name, 
                dataIndex: 'department', 
                sortable: true
			},
			{
                text: lan.Comments, 
		        //text: request_toir.name, 
                dataIndex: 'comment', 
                sortable: true,
                flex: 1
			},

    ],
    bbar:[PagingToolbar_bbb_courier],
    listeners: {
    	itemdblclick: function(cmp, records) {    		
    		show_bbb_courier_addedit(records.get('id'),records, disable_edit);
    	}
    }
});
	
	return grid_bbb_courier;
	
}



var WindowForm_bbb_courier = null;

function show_bbb_courier_addedit(idrow,select, disable_edit){
	store_department.load();
	store_role_grid.removeAll();
	var WinXprev = 0, WinYprev = 0, WinHeightprev = '100%', WinWidthprev = '100%';
	var WinX, WinY, WinHeight, WinWidth;

if(idrow){
	var texttype = lan.edit;
	passwordAllow = true;
}else{
	var texttype = lan.add;
	passwordAllow = false;
}


if(!WindowForm_bbb_courier){
		employStatusStore.load();
        ManagerStore.load();
        admin_manager_store.load();
		WindowForm_bbb_courier = new Ext.Window({
			width: '80%',
            height: '90%',
            title: texttype+' '+lan.user,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: true,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowForm_bbb_courier = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'form_bbb_courier',
				frame: true,
				layout: {
					align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},

				items:[
					
		          {
		                 	xtype: 'container',
		                 	style: {margin: '0 0 0 105px'},
					        items:
					        [
								{
					                    xtype: 'image',
					                    src: 'img/addfoto.png',
					                    id:'fotoUser',
									    width: 128,
									    height: 128,
					            },
					        	{
				                    xtype:'filefield',
				                    name: 'foto_employee',
				                    buttonText: lan.add_photo,
				                    buttonOnly: true,
				                    disabled: disable_edit, //rights  rule
				                    style: {margin:'0 5px 0 0'},
				                    enableKeyEvents: true,
				                    buttonConfig: {
				                        iconCls: 'upload-icon',
				                        id:'btn-field-foto',
				                    },
				                    listeners:{
				                        change: function(val, value, eOpts, editor){
				                            var extn = value.split('.').pop();

				                            	if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
					                                val.setValue(''); val.setRawValue(''); val.reset();
					                                Ext.MessageBox.alert(lan.error, lan.incorrect_file_format +  lan.available +'(.png, .jpg, .bmp, .gif)');
					                            }else{
					                            	var old_src = Ext.getCmp('fotoUser').src;
					                                Ext.getCmp('fotoUser').setSrc('img/preloader.gif');
					                                var form = Ext.getCmp('form_bbb_courier').getForm();

														var fields = form.getFields();
		
														fields.each(function(item){
															if(!item.allowBlank){
																item.allowBlank = true;
															}
														});

															form.submit({
																url: 'scripts/bbb_courier.php',
																scope: this,
																method: 'post',
																//timeout : 60000,
																params: {"addFoto":'true', 'idrow':idrow},
																success: function(fp, o) {
																	Ext.getCmp('fotoUser').setSrc(o.result.message);
																	fields.each(function(item){
																		if (item.config.allowBlank === false){
																			item.allowBlank = item.config.allowBlank;
																		}													
																	});	
										
																},
																failure: function(fp, o) {

																	Ext.MessageBox.show({
																		title: lan.error,
																		msg: o.result.message,
																		buttons: Ext.MessageBox.OK,
																		icon: Ext.MessageBox.ERROR,
																	});
																	Ext.getCmp('fotoUser').setSrc(old_src);
																}
															});															
					                            }
				                        }
				                    }
				            	 },	
					        ]
		                 },
		                 {
				      xtype: 'textfield',
                     fieldLabel: "№",
                     name: 'user_id',
				      disabled: true,
				      anchor: '96%'
				     },
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.login,
	                    name: 'login',
						allowBlank: false,
						anchor: '96%',
						listeners: {
							blur: function() {
								if(this.getValue().length > 20) {
									Ext.MessageBox.alert(lan.error, lan.login_20_charact);
									this.setValue("");
								}
							}
						}
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.firstName,
	                    name: 'first_name',
						allowBlank: false,
						anchor: '96%'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.lastName,
	                    name: 'last_name',
						allowBlank: false,
						anchor: '96%'
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.employment_status,
	                    store: employStatusStore,
	                    displayField: 'value',
	                    valueField: 'id',
	                    name: 'employment_status',
						allowBlank: false,
						anchor: '96%',
						editable: false,
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.phoneNumber,
	                    name: 'phone',
	                    maskRe: /^[0-9]+$/,
						anchor: '96%'
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.email,
	                    name: 'email',
	                   // maskRe: /^[0-9]+$/,
						anchor: '96%'
					},
					{
						xtype: "combobox",
						fieldLabel: lan.timezone,
						name: "gmt",
						allowBlank: false,
						anchor: '96%',
						store: timezoneStore,
						displayField: 'name',
	                    valueField: 'name',
	                    //queryMode: 'local',
	                    minChars: 2,
	                    editable: false
					},
					{
	                    xtype: 'textfield',
	                    fieldLabel: lan.password,
	                    name: 'password',
						allowBlank: passwordAllow,
						anchor: '96%',
						listeners: {
							blur: function() {
								if(this.getValue().length < 6) {
									Ext.MessageBox.alert(lan.error, lan.pass_6_charact);
									this.setValue("");
								}
							}
						}
					},
					{
			            xtype      : 'fieldcontainer',
			            defaultType: 'checkboxfield',
			           // layout: 'hbox',
			           //	anchor: '%'
			            style: {margin: '0 0 0 105px'},
			            items: 
			            [
			                {
								boxLabel:lan.isActive,
								name:'isActive',
								inputValue:'1',
								id:'checkbox1',
								checked:true
							}
			            ]
			        },
			        
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.func_manager,
	                    name: 'manager',
						allowBlank: false,
						anchor: '96%',
						store: ManagerStore,
						displayField: 'name',
	                    valueField: 'id',
	                    //autoSelect: true,
	                    //enableKeyEvents: true,
	                    minChars: 1,
	                    queryMode: 'remote',
						listeners:{
							afterrender:function(eOpts) {
                                if(eOpts.store.isLoaded())
                                {
                                    var item = eOpts.store.first();
                                    if(item.get('id') != undefined){eOpts.setValue(item.get('id'));}
                                }
                            }
						}
					},
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.admin_manager,
	                    name: 'admin_manager',
						anchor: '96%',
						store: admin_manager_store,
						displayField: 'name',
	                    valueField: 'id',
	                    minChars: 1,
	                    queryMode: 'remote',
						listeners:{
							afterrender:function(eOpts) {
                                if(eOpts.store.isLoaded())
                                {
                                    var item = eOpts.store.first();
                                    if(item.get('id') != undefined){eOpts.setValue(item.get('id'));}
                                }
                            }
						}
					},
/***************************************** SET ROLES ******************************************************************/
                {
                xtype: 'container',
                anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'combobox',
                    fieldLabel: lan.role,
                    id: 'user_role',
                    queryMode: 'remote',
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    editable: true,
                    enableKeyEvents: true,
                    store: RoleStore,
                    displayField: 'name',
                    valueField: 'id',
                    flex: 3
                },{
                    xtype: 'button',
                    text : lan.add,
                    disabled: disable_edit, //rights  rule
                    margin: '0 0 0 10',
                    cls:'disable',
                    flex: 1,
                    handler: function() {
                        var name = Ext.getCmp('user_role').rawValue;
                        var role_id = Ext.getCmp('user_role').getValue();
                        var isExist = false;
                        store_role_grid.each(function(record){
                            if(record.get('name')==name||record.get('id')==role_id){
                                isExist = true;
                            }
                        });
                        if (name.trim() != ''&&!isExist) {
                            Ext.getCmp('user_role').setValue();
                            store_role_grid.add({id: role_id, name: name});
                            Ext.getCmp('role_grid').show();
                        }
                        else {
                            Ext.MessageBox.alert(lan.error, lan.duplicate_role);
                        }
                    }
                }]
                },{
                xtype: 'container',
                anchor:'96%',
                margin: '10 0',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype:'displayfield',
                    name:"",
                    flex: 1
                },
                {
                xtype: 'grid',
                name:'Roles',
                id:'role_grid',
                border: true,
                hidden:true,
                store: store_role_grid,
                flex: 2,
                columns: [{
                           xtype:'rownumberer'
                          },
                            {
                            text: 'Role', 
                            dataIndex: 'name',
                            width: '70%',
                            sortable: false
                            }, 
                            {
                        xtype:'actioncolumn',
                        dataIndex: 'set_hidden',
                        width:20,
                        items:[{
                            iconCls:'delete',
                            handler:function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                store_role_grid.remove(rec);
                                if(store_role_grid.data.length == 0) {
                                    Ext.getCmp('role_grid').hide();
                                }
                            }
                        }]
                    }],
                },{
                    xtype:'displayfield',
                    name:"",
                    flex: 1
                }]
                },
/***********************************************************************************************************************************************/
					/***********************************************************************************************************************************************/

/*-----------------JD------------------------------*/
					{
						xtype: 'container',
						margin: '10 0',
						anchor:'96%',
						layout: {
							type: 'hbox',
						},
						items: [{
							xtype:'combobox',
							fieldLabel: lan.position,
							name: 'title',
							anchor: '96%',
							store: store_all_job_title,
							displayField: 'value',
							valueField: 'value',
							flex: 4,
							editable: false,
						},
						{
							xtype: 'hidden',
							name: 'id',
							readOnly: true,
						},
						{
							xtype: 'button',
							text: "View job description",
							margin: '0 0 0 10',
							cls: 'disable',
							disable: false,
							flex: 1,
							listeners: {
                           	afterrender: function (obj) {
								var form = Ext.getCmp('form_bbb_courier').getForm();
								var fields = form.getFields();
								var job_title = getFieldByName(fields, 'title').getValue();
															
								Ext.Ajax.request({
									url: 'scripts/bbb_courier.php?getViewUserJobDescription=true',
									method: 'POST',
									params: {
										job_title: job_title
									},
									success: function (response) {
										var data = Ext.decode(response.responseText);
										var fields = form.getFields();
										fields.each(function (item) {
											for (var k in data) {
												if (item.getName() == k && data[k] != null) {
													item.setValue(data[k]);
												}
											}
										});
										if ((!data) || (data == null)) {
											text: "View impossible";
										}
										else {
											show_jobDescription_view(data.id_job_title);
										}
									},
									failure: function (response) {
										Ext.MessageBox.alert(lan.error, response.responseText);
									}
								});
							}
							},
							handler: function (){
                                var form = Ext.getCmp('form_bbb_courier').getForm();
                                var fields = form.getFields();
							    var job_title = getFieldByName(fields, 'title').getValue();
								Ext.Ajax.request({
                                    url: 'scripts/bbb_courier.php?getViewUserJobDescription=true',
                                    method: 'POST',
                                    params: {
                                        job_title: job_title
                                    },
                                    success: function (response) {
									    var data = Ext.decode(response.responseText);
									    var fields = form.getFields();
                                        fields.each(function (item) {
                                            for (var k in data) {
                                                if (item.getName() == k && data[k] != null) {
                                                    item.setValue(data[k]);
                                                }
                                            }
                                        });
										if((!data) || (data == null)){
											Ext.MessageBox.alert(lan.error, 'View job description impossible');
										}
										else{
											show_jobDescription_view(data.id_job_title);
										}
                                    },
                                    failure: function (response) {
                                        Ext.MessageBox.alert(lan.error, response.responseText);
                                    }
								});
							},
						}]
					},

/*---END-JD------------------------------*/
					{
	                    xtype: 'combobox',
	                    fieldLabel: lan.department,
	                    name: 'department',
						allowBlank: false,
						anchor: '96%',
						store: store_department,
						displayField: 'value',
	                    valueField: 'id',
						value: 1,
						minChars: 1,
	                    queryMode: 'remote'
					},
					{
						xtype:'textareafield',
						height: 100,
						grow:true,
						name: 'comment',
						fieldLabel: lan.Comments,
						labelAlign: 'top',
						anchor:'96%'
					}
				],
				buttons:[
					{ 
                    	text:lan.full_screen,
                    	handler: function() {
                    		WinX = WindowForm_bbb_courier.getX();
                    		WinY = WindowForm_bbb_courier.getY();
                    		WinHeight = WindowForm_bbb_courier.getHeight();
                    		WinWidth= WindowForm_bbb_courier.getWidth();

                    		WindowForm_bbb_courier.setHeight(WinHeightprev);
                    		WindowForm_bbb_courier.setWidth(WinWidthprev);
                    		WinXprev = WindowForm_bbb_courier.setX(WinXprev);
                    		WinYprev = WindowForm_bbb_courier.setY(WinYprev);

                    		WinXprev = WinX;
                    		WinYprev = WinY;
                    		WinHeightprev = WinHeight;
                    		WinWidthprev = WinWidth;
                    	}
                    },	
					{ 
	                    text:lan.save,
						iconCls:'save',
						disabled: disable_edit,//rights rule
						handler: function() {		
							
							var form = Ext.getCmp('form_bbb_courier').getForm();
							var dim_role = [];
							store_role_grid.each(function(record){
								dim_role.push({id:record.get('id')});
							});

							var rolesJS = "";

							if(dim_role.length>0){
								var rolesJS = JSON.stringify(dim_role);
							}

							if(form.isValid()){
							form.submit({
								url: 'scripts/bbb_courier.php',
								waitMsg: lan.saving,
								wait: true,
								scope: this,
								method: 'post',
								//timeout : 60000,
								params: {'addedit':true,'idrow':idrow, 'photo': Ext.getCmp('fotoUser').src, 'role':rolesJS},
								success: function(fp, o) {
									Ext.MessageBox.alert(lan.succ, lan.save);
									WindowForm_bbb_courier.destroy();
									bbb_courier_store.load();
								},
								failure: function(fp, o) {
									Ext.MessageBox.alert(lan.error, o.result.message);
								}
							});
							}else{
							}
						}
                    },
					{ 
	                    text:lan.cancel,
						iconCls: 'cancel',
	                    handler:function(){
	                        WindowForm_bbb_courier.destroy();        
	                    }
					}
				]
			})
			]
		});
}		
		WindowForm_bbb_courier.show();
	
	
	var form = Ext.getCmp("form_bbb_courier").getForm();
	if(disable_edit){//rights rule
		form.getFields().each(function(item){
			item.setConfig('readOnly',true);
		});
		setColumnHidden('role_grid');
	}

	if(idrow){
		form.findField("user_id").setValue( select.get('id') );
		form.findField("login").setValue( select.get('login') );
		form.findField("first_name").setValue( select.get('first_name') );
		form.findField("last_name").setValue( select.get('last_name') );
		form.findField("phone").setValue( select.get('phone') );
		form.findField("isActive").setValue( select.get('active') );
		form.findField("manager").setValue( select.get('boss_id') );
		form.findField("admin_manager").setValue( select.get('admin_manager') );
		form.findField("email").setValue( select.get('email') );
		if (select.get('photo')){
			Ext.getCmp('fotoUser').setSrc(select.get('photo'));
		}
		
		form.findField("department").setValue( select.get('department_id') );
		form.findField("comment").setValue( select.get('comment'));
		form.findField("title").setValue( select.get('title'));
		form.findField("gmt").setValue(select.get('gmt'));
		form.findField("employment_status").setValue(select.get('employment_status'));

		Ext.Ajax.request({
            url: 'scripts/bbb_courier.php?getRoles=true',
            method: 'POST',
            params: {
                user_id: select.get('id')
                },
            success: function (response){
                var data = Ext.decode(response.responseText);
                store_role_grid.loadData(data);
                Ext.getCmp('role_grid').show();
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });

	}
	
	
}

