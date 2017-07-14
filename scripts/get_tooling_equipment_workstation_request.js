var storeImg = Ext.create('Ext.data.Store', {
	fields: [
		{ name:'src', type:'string' },
		{ name:'caption', type:'string' },
		{ name:'id', type:'int' }
	]
});
var storeDoc = Ext.create("Ext.data.Store", {
	fields: ['id', 'descr_spec', 'add_spec']
});

var blocked = false, dis = false, hide = false;

function getToolEquipWorkstatRequest(time_id, blocked, dis, hide) {
	var show2d = false, show3d = false;

	var formUpload2DImageTool = Ext.create('Ext.form.Panel', {
		bodyPadding: 10,
		title: lan.two_d,
		frame: true,
		margin: '5',
		minWidth: 250,
		flex:1,
		height: 250,
		//bodyStyle: "background-image:url(img/no_foto.png)!important",
		items:[{
			xtype: 'image',
			src: '',
			height: 240,
			width: 240,
			imgCls: 'ImageGalery',
			//id:'2dIT'
			name: '2dIT'
		}],
		listeners: {
			dblclick : {
				fn: function(e, t) {
					var src = getImageName(t.src);
					var extn = src.split('.').pop();
					src = "img/components/"+getImageName(t.src);
					if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
						showImage(lan.Image, src);
					}
				},
				element: 'body',
				scope: this
			}    
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: [{
				xtype: 'filefield',
				msgTarget: 'side',
				name: 'drawing2d',
				buttonText: lan.add_image,
				id:'draw2d'+time_id,
				disabled: dis,
				//hidden: view,
				margin: '0 50%',
				defaults: {
					fileUpload: true
				},
				buttonOnly: true,
				listeners: {
					change: function(val, value, eOpts, editor){
						var extn = value.split('.').pop();
						if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
							val.setValue(''); val.setRawValue('');
							Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " +lan.available +': (.png, .jpg, .bmp, .gif)');
						}else {
                        //console.log(extn);
                        var form = this.up('form').getForm();
                        var id = tabs.getActiveTab().id;
                        if(form.isValid()){
                        	form.submit({
                        		url: 'scripts/ecr_form.php',
                        		waitMsg: lan.upload_mess,
                        		params: {"addImage":'true'},
                        		success: function(fp, o) {
                        			formUpload2DImageTool.setBodyStyle('background:#fff');
                        			//Ext.getCmp('2dIT').setSrc('img/components/'+o.result.message);
                        			Ext.getCmp(id).query('image')[0].setSrc('img/components/'+o.result.message);
                        			show2d = true;
                        			if(show2d && show3d || Ext.getCmp(id).query('image')[1].src != "" && show2d) Ext.getCmp("pendingDesign" + time_id).setValue("0");
                        		}
                        	});
                        }
                    }	
                }
            }
        }]
    }]
});

	var formUpload3DImageTool = Ext.create('Ext.form.Panel', {
		bodyPadding: 10,
		title: lan.three_d,
		frame: true,
		margin: '5',
		minWidth: 250,
		flex:1,
		height: 250,
		//bodyStyle: "background-image:url(img/no_foto.png)!important",
		items:[{
			xtype: 'image',
			src: '',
			height: 240,
			width: 240,
			imgCls: 'ImageGalery',
			//id:'3dIT'
			name: '3dIT'
		}],
		listeners: {
			dblclick : {
				fn: function(e, t) {
					var src = getImageName(t.src);
					var extn = src.split('.').pop();
					src = "img/components/"+getImageName(t.src);
					if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
						showImage(lan.Image, src);
					}
				},
				element: 'body',
				scope: this
			}    
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: [{
				xtype: 'filefield',
				name: 'drawing3d',
				msgTarget: 'side',
				buttonText: lan.add_image,
				id:'draw3d'+time_id,
				disabled: dis,
				//hidden: view,
				margin: '0 50%',
				defaults: {
					fileUpload: true
				},
				buttonOnly: true,
				listeners: {
					change: function(val, value, eOpts, editor){
						var extn = value.split('.').pop();
						if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
							val.setValue(''); val.setRawValue('');
							Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " +lan.available +': (.png, .jpg, .bmp, .gif)');
						}else {
	                        //console.log(extn);
	                        var form = this.up('form').getForm();
	                        var id = tabs.getActiveTab().id;
	                        if(form.isValid()){
	                        	form.submit({
	                        		url: 'scripts/ecr_form.php',
	                        		waitMsg: lan.upload_mess,
	                        		params: {"addImage":'true'},
	                        		success: function(fp, o) {
	                        			formUpload3DImageTool.setBodyStyle('background:#fff');
	                        			//Ext.getCmp('3dIT').setSrc('img/components/'+o.result.message);
	                        			Ext.getCmp(id).query('image')[1].setSrc('img/components/'+o.result.message);
	                        			show3d = true;
	                        			if(show2d && show3d || Ext.getCmp(id).query('image')[0].src != "" && show3d) Ext.getCmp("pendingDesign" + time_id).setValue("0");
	                        		}
	                        	});
	                        }
                    	}
                	}
            	}
        	}]
    	}]
	});

	var itemsUploadFormTool = Ext.create('Ext.view.View', {
		store: storeImg,
		//id: 'UploadForm'+time_id,
		id: "uploadForm" + time_id,
		tpl: imageTplTool,
		itemSelector: 'div.uploadStyle',
		emptyText: lan.no_images,
		listeners: {
			dblclick: {
	            element: 'el', //bind to the underlying body property on the panel
	            fn: function(e, t){ 
	            	var select = itemsUploadFormTool.getSelectionModel().selected.items[0].data;
	            	showImage(select.caption, select.src);
	            }
        	}
    	}
	});

	var fileUploadFormTool = Ext.create('Ext.form.Panel', {
       //title: 'Additional Images',
       //id: 'fileUploadForm'+time_id,
       id: "fileUpload" + time_id,
        //anchor: '96%',
        //margin: '0 0 0 10',
        //hidden: hideStatus,
        bodyPadding: 10,
        frame: false,
        items:[{
        	xtype: 'container',
        	layout: {
        		type: 'hbox',
        	},
        	items: [{
        		xtype: 'filefield',
        		name: 'addImages',
        		msgTarget: 'side',
        		buttonText: lan.add_addit_images,
        		id:'add_image'+time_id,
        		disabled: dis,
        		//hidden: view,
        		flex:1,
        		maxWidth: 200,
        		defaults: {
        			fileUpload: true
        		},
        		buttonOnly: true,
        		listeners: {
        			change: function(val, value, eOpts, editor){
        				Ext.Msg.prompt(lan.Image, lan.enter_image_name, function(btn, text){
        					if (btn == 'ok'){
        						var extn = value.split('.').pop();
        						if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
        							val.setValue(''); val.setRawValue('');
        							Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " +lan.available +': (.png, .jpg, .bmp, .gif)');
        						}else {
        							var form = Ext.getCmp('fileUpload'+time_id).getForm();
        							if(form.isValid()){
        								form.submit({
        									url: 'scripts/ecr_form.php',
        									waitMsg: lan.upload_mess,
        									params: {"addImage":'true'},
        									success: function(fp, o) {
        										storeImg.add({id: storeImg.data.length+1, src: 'img/components/'+o.result.message, caption:  text});
        									}
        								});
        							}
        						}
        					}
        				});
        			}
        		}
        	},{
        		xtype: 'button',
        		text: lan.del,
        		disabled: dis,
        		//hidden: view,
        		//id:'delete'+time_id,
        		id: "del" + time_id,
        		maxWidth: 100,
        		flex:1,
        		handler : function() {
        			var select = itemsUploadFormTool.getSelectionModel().selected.items[0];
        			if(select){
        				select = select.id;
        				storeImg.each(function(record){
        					if(record.get('id')==select) storeImg.remove(record);
        				});
        			}
        			else{
        				Ext.MessageBox.alert(lan.error, lan.select_image);
        			}
        		}
        	}]
        },itemsUploadFormTool]
    });

    var downloadLink = getActionLink('add_spec');

	var DocUploadFormTool = Ext.create('Ext.form.Panel', {
		title: lan.documentstext,
		//id: 'DocUploadForm'+time_id,
		id: "docUpload" + time_id,
		margin: '0 0 0 10',
		bodyPadding: 10,
		frame: false,
		items:[{
			xtype: 'grid',
			id:'docGrid'+time_id,
			id: "docGrid" + time_id,
			border: true,
			hidden: false,
			store: storeDoc,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'filefield',
					//id: 'fileform'+time_id,
					id: "fileForm" + time_id,
					disabled: dis,
					name: 'add_spec',
					msgTarget: 'side',
					anchor: '100%',
					buttonText: lan.add_file,
					//hidden: view,
					buttonOnly: true,
					defaults: {
						fileUpload: true
					},
					listeners: {
						change: function(val, value, eOpts, editor){
							Ext.Msg.prompt(lan.Image, lan.enter_image_descript, function(btn, text){
								if (btn == 'ok'){
									var extn = value.split('.').pop();
									if((extn!=='doc') && (extn!=='txt') && (extn!=='xls') && (extn!=='xlsx') && (extn!=='docx')&& (extn!=='pdf')){
										val.setValue(''); val.setRawValue('');
										Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " + lan.available +': (.doc, .txt, .xls, .xlsx, .docx, .pdf)');
									}else {
										var form = Ext.getCmp('docUpload'+time_id).getForm();
										if(form.isValid()){
											form.submit({
												url: 'scripts/ecr_form.php',
												waitMsg: lan.upload_file,
												params: {"addFile":'true'},
												success: function(fp, o) {
                                            //console.log(o.result.message);
                                            storeDoc.add({id: storeDoc.data.length+1, descr_spec: text, add_spec: o.result.message});
                                        }
                                    });
										}
									}
								}
							});
						}
					}
				}]
			}],
			columns: [
			{
				xtype:'rownumberer',
				width:20
			},
			{
				text: lan.description,
				dataIndex: 'descr_spec',
				sortable: false,
				minWidth:200,
				flex:1
			},
			{
				text: lan.documentstext,
				dataIndex: 'add_spec',
				sortable: false,
				minWidth:200,
				flex:1
			},
			{
				xtype:'actioncolumn',
				width:40,
				items:[downloadLink]
			},
			{
				xtype:'actioncolumn',
				width:40,
				hidden: hide,
				id: "act" + time_id,
				dataIndex:'set_hidden',
				items:[{
					iconCls:'delete',
					//id: "act" + time_id,
					//hidden: hide,
					handler:function (grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						storeDoc.remove(rec);
					}
				}]
			}]
		}]
	});

	var tool_req = [
		{
			xtype: "container",
			layot: "anchor",
			items: [
				{
					xtype:'hidden',
					name:'time_id',
					id: 'time_id'+time_id
				},
				{
					xtype: "combobox",
					id: "RequestedBy" + time_id,
					fieldLabel: lan.req_by,
					name: 'RequestedBy',
					width: "96%",
					labelWidth: style.input2.labelWidth,
					queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    enableKeyEvents: true,
                    store: data_store_Responsible,
                    displayField: 'value',
                    valueField: 'id',
                    autoSelect: true,
                    value:id_user,
                    readOnly: true,
                    validator: function (val) {
                            errMsg = lan.user_not_found;
                        return (data_store_users.find('value', val)!=-1) ? true : errMsg;
                    }
				},
				{
					xtype: "textfield",
					fieldLabel: lan.sku_used,
					name: "bbb_sku_used",
					width: "96%",
					labelWidth: style.input2.labelWidth,
					readOnly: blocked,
					//allowBlank: false,
					//readOnly: true
				},
				{
					xtype: "textfield",
					fieldLabel: lan.operation_procedures,
					name: "operation_procedures",
					width: "96%",
					labelWidth: style.input2.labelWidth,
					readOnly: blocked,
					//allowBlank: false,
					//readOnly: true
				},
				{
					xtype: "numberfield",
					fieldLabel: lan._Quantity,
					allowExponential: true,
					minValue: 0,
					name: "quantity",
					width: "96%",
					labelWidth: style.input2.labelWidth,
					readOnly: blocked,
					mouseWheelEnabled: false,
					//allowBlank: false,
					//readOnly: true
				},
/*********************************поля из справочника***************************************************/
				{
					xtype: "numberfield",
					fieldLabel: lan.estimat_price,
					name: "estimated_unit_price",
					width: "96%",
					allowExponential: true,
					minValue: 0,
					labelWidth: style.input2.labelWidth,
					mouseWheelEnabled: false,
					readOnly: blocked
				},
				{
					xtype: "textareafield",
					fieldLabel: lan.description,
					width: "96%",
					height: 50,
					autoScroll: true,
					name: "description",
					labelWidth: style.input2.labelWidth,
					readOnly: blocked
				},
				{
					xtype: "textfield",
					//fieldLabel: null,
					width: "96%",
					name: "number",
					labelWidth: style.input2.labelWidth,
					//readOnly: true,
					allowBlank: false,
					listeners: {
						afterrender: function() {
							if(this.up("form").up().id == "tabtooling_request" || this.up("form").up().id == "tabtooling_approval") this.setFieldLabel(lan.t_g_id);
							else if(this.up("form").up().id == "tabequipment_request" || this.up("form").up().id == "tabequipment_approval") this.setFieldLabel(lan.equip_id);
							else this.setFieldLabel(lan.work_id);
						}
					}
				},
				{
					xtype: 'textfield',
					//fieldLabel: "T/G id",
					name: "tgId",
					//id: "tgId",
					hidden: true,
					//labelWidth: style.input2.labelWidth
					width: 0
				},
				{
					xtype:'combobox',
					fieldLabel: lan.tool_gage,
					//labelAlign: 'top',
					name: 'tool_gage_type',
					//id: 'tool_gage_type'+time_id,
					id: "toolGageTy" + time_id,
					//allowBlank: false,
					//labelWidth: style.input2.labelWidth,
					//anchor:'96%',
					width: "96%",
					store: storeToolGage,
					displayField: 'value',
					valueField: 'id',
					//editable: false,
					readOnly: true,
					//readOnly: view,
					//readOnly: blocked,
					hidden: true,
					//value: 0,
					labelWidth: style.input2.labelWidth,
					listeners: {
						afterrender: function() {
							if(this.up("form").up().id == "tabtooling_request" || this.up("form").up().id == "tabtooling_approval") this.setConfig("hidden", false);

						}
					} 
				},
				{
					xtype:'textfield',
					fieldLabel: lan.name,
					//labelAlign: 'top',
					name: 'name',
					id: "nameTG" + time_id,
					allowBlank: false,
					//labelWidth: style.input2.labelWidth,
					//readOnly: view,
					readOnly: blocked,
					//anchor:'96%',
					width: "96%",
					labelWidth: style.input2.labelWidth
				},
				{
					xtype:'numberfield',
					fieldLabel: lan.est_life_time,
					//labelAlign: 'top',
					name: 'life_time',
					//id: 'life_time'+time_id,
					id: "lifeTime" + time_id,
					minValue: 0,
					allowExponential: false,
					//labelWidth: style.input2.labelWidth,
					//anchor:'96%',
					mouseWheelEnabled: false,
					width: "96%",
					labelWidth: style.input2.labelWidth,
					readOnly: blocked
				},
				{
					xtype:'combobox',
                    fieldLabel: lan.pending_des,
                    //labelAlign: 'top',
                    name: 'pending_design',
                    //id: 'pending_design'+time_id,
                    id: "pendingDesign" + time_id,
                    allowBlank: false,
                    //labelWidth: style.input2.labelWidth,
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    value :'1',                  
                    editable:false,
                    //anchor:'96%',
                    width: "96%",
                    labelWidth: style.input2.labelWidth,
                    readOnly: true
				},
				{
					xtype: "panel",
					title: lan.images,
					layout: {
						type: "hbox",
						align: 'stretch'
					},
					items: [formUpload2DImageTool, formUpload3DImageTool]
				},
				fileUploadFormTool, DocUploadFormTool,
				{
					xtype: "container",
					layout: {
						type: 'hbox',
					},
					width: "96%",
					items: [
						{
							xtype: "combobox",
							fieldLabel: lan.alt_option,
							name: "altVar",
							id: "altVar" + time_id,
							displayField: 'name',
							valueField: 'id',
							width: "70%",
							labelWidth: 125,
							minChars: 1,
							queryMode: 'remote',
	                		//store: storeRequestTool,
	                		listeners: {
	                			beforerender: function() {
	                				storeRequestEquip.load();
	                				storeRequestWork.load();

	                				var tabId = this.up("form").up();
	                				if(tabId.id == "tabequipment_request") this.setStore(storeRequestEquip);
	                				else if(tabId.id == "tabworkstation_request") this.setStore(storeRequestWork);
	                				//остальные сторы(tool, gage) в addForm.js
	                			}
	                		}
						},
						{
							xtype: "button",
							text: lan.show_dir,
							margin: "0 0 0 300",
							handler: function() {
								var elem = Ext.getCmp("altVar" + time_id);

								if(this.up("form").up().id == "tabtooling_request") {
									if(this.up("form").up().id == "tabtooling_request" && Ext.getCmp("toolGageTy" + time_id).getValue() == 0) { //tool
										var filter = "tool", rights = 'tool_gage', store = storeGridTool, idshka = 'tool_id', add = lan.add_tool, view = lan.view_tool, imgStore = imagesStoreTool, docGridStore = documentGridStoreTool;
									}
									else if(this.up("form").up().id == "tabtooling_request" && Ext.getCmp("toolGageTy" + time_id).getValue() == 1) { //gage
										var filter = "gage", rights = 'tool_gage', store = storeGridGage, idshka = 'gage_id', add = lan.add_gage, view = lan.view_gage, imgStore = imagesStoreTool, docGridStore = documentGridStoreTool;
									}
									var itemTool = addToolGageGrid(time_id, true, filter, false, all_rights[rights], true);
	                				showWinProcessForRequest(time_id, add, itemTool, store, filter, elem);
								}
								else if(this.up("form").up().id == "tabequipment_request") {
									var itemEquip = addEquipGrid(time_id, true, false, all_rights['equipment'], true);
                					showWinProcessForRequest(time_id, lan.add_equip, itemEquip, storeGridEquipment, 'equipment', elem);
								}
								else if(this.up("form").up().id == "tabworkstation_request") {
									var itemWorkSt = addWorkStGrid(time_id, true, false, all_rights['workstation'], true);
                					showWinProcessForRequest(time_id, lan.add_work, itemWorkSt, storeGridWorkstation, 'workstation', elem);
								}
							}
						}
					]
				}
			]
		}
	]

	return tool_req;
}

function showWinProcessForRequest(time_id, title, item, store, dir, elem){
if(!WindowProcess){
    WindowProcess = new Ext.Window({
        width: '90%',
        height: '90%',
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        autoScroll: true,
        modal: true,
        constrainHeader: true,
        buttons: [{
            text: lan.add_to_table,
            handler:function(){
                var select = Ext.getCmp(item.id).getView().getSelectionModel().getSelection()[0];
                if(select){
                	elem.setValue(select.data.id);
                    WindowProcess.destroy();
                }
                else Ext.MessageBox.alert(lan.error, lan.select_row);
            }
        }],
        listeners: {
            destroy: function(){
               WindowProcess = null;
            }
        },
        items:item
    });
    WindowProcess.show();
    }
}