var WindowFormRef = null;
var Preference_Window = null;
var WindowFormMes = null;
var Uploads_Window_Add = null;
var List_Window_Add = null;
var EditedArray = [];
var EditedJSON;


function ShowWindowFormRef(type,iddoc,idrow){

if(type){
	var t = lan.add;  var tt = 'add'; 
}else{
	var t = lan.edit; var tt = 'edit';
}

var closablewin = true;
var closablebtncancel = false;

var items;
var title;
var it = 2;
switch(iddoc){
	case 'locations':
		title = lan.locations; items = locations; it=1;
		height = 300;
	break;
	case 'test_procedure':
		title = lan.test_procedure; items = test_procedure; it=1;
		height = 600;
	break;
	case 'rights':
		title = lan.rights; items = rights; it=1;
		height = 600;
	break;
	default:
		items = []; title = '';
	}

	if(!WindowFormRef){
        
		WindowFormRef = new Ext.Window({
            width: '80%',
            height: '60%',
            title: t +" "+ title,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: closablewin,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowFormRef = null;
                }
            },

            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '2 2 2 3',
				border: false,
				id: 'formref',
				//frame: true,
				//autoHeight:true,
				//labelWidth: 200,
				layout: {
                    //type: 'vbox',
                    align: 'stretch'
                },
				defaults: {
					//fileUpload: true,
					//labelAlign: 'top',
					//labelWidth: 200,
					msgTarget: 'side'
				},
				items:items,
				buttons:[
					{
                    text:lan.save,
                    //id:'buttonUploads',
					iconCls:'save',
					handler: function() {			
						var form = this.up('form').getForm();
					
						if(form.isValid()){
							form.submit({
							url: 'scripts/saveformdirectory.php',
							waitMsg: lan.saving,
							wait: true,
							scope: this,
							method: 'post',
							//timeout : 60000,
							params: {func:tt,table:iddoc,idrow:idrow,edited:EditedJSON,typeform:1},
							success: function(fp, o) {
								Ext.MessageBox.alert(lan.attention, lan.save_succ);
								WindowFormRef.destroy();
								if(Ext.getCmp(iddoc)){Ext.getCmp(iddoc).store.load();}
							},
							failure: function(fp, o) {
								Ext.MessageBox.alert(lan.error, o.result.message);
							}
							});
						}
						
					}
                    },
					{
                    text:lan.cancel,
					hidden: closablebtncancel,
					iconCls: 'cancel',
                    handler:function(){
                        WindowFormRef.destroy();        
                    }
					}
				]
			})	 
			]
		})      
         
    }
    WindowFormRef.show();
	
	var form = Ext.getCmp("formref").getForm().getFields();
		
	if(!type){
	Ext.Ajax.request({
		url: 'scripts/editDirectory.php',
		method: 'POST',
		params: {"edit":idrow,"table":iddoc},
		success: function (response){
			var JSON = response.responseText;
			if(JSON){
			var decoded = Ext.decode(JSON);
			var i=it;
			var j = 0;
			//alert(i);
			form.each(function(item){
			/*var str='';
			ff=item;
			for (k in ff)
			{str+=k+': '+ff[k]+'\r\n';}
			alert(str);*/
				//alert(item);
				//console.log(item.xtype);
				//console.log(item.name);
				if(item.xtype=='textfield' || item.xtype=='combo' || item.xtype=='datefield' || item.xtype=='numberfield' || item.xtype=='textarea'|| item.xtype=='textareafield' || item.xtype=='displayfield'){
					item.setValue(decoded[i]);
					i++;
				//}else if (item.xtype=='checkboxgroup'){
				}else if (item.xtype=='checkbox'){
					//console.log(decoded[i][j]);
					//console.log([j]);
					item.setValue(decoded[i][j]);
					//console.log([j]);
					j++;
					//console.log( [j] );
					if(j==8){ i++; }
				}

				/*else if(item.xtype=='filefield'){
					item.setVisible(false);
				}else if(item.xtype=='button'){
					item.setVisible(false);
				}*/
			});
			}
		},
		failure: function (response){ 
			Ext.MessageBox.alert(lan.error, response.responseText);
		}
	});
	
	}
}


function SaveEdited(name){
	if(EditedArray.indexOf(name)==-1){
		EditedArray.push(name);
	}
	/*for (key in EditedArray){
		alert( EditedArray[key] );
	}*/
	EditedJSON = Ext.encode(EditedArray);
}








function showgalery(id){
//var str = '<div id="image_wrap" style="width:100%; height:100%; text-align:left; background-color:#efefef; border:2px solid #fff; outline:1px solid #ddd; -moz-ouline-radius:4px;"><img style="margin: 15px;" src="file:///C:/Temp/img/1398861647_Desert.jpg" width="320" height="240" /></div>';
var dir = '../files/';		
var str = '<div id="image_wrap" style="width:100%; height:100%; text-align:center;" ><img style="margin: 15px;" src="'+document.location.hostname+'/'+dir+id+'" width="710" height="500" /></div>';

	if (!Photo_Window){
        Ext.getBody().mask(lan.saving);
        var Photo_Window = new Ext.Window({
            layout: 'fit', 
            title: lan.scan_copy,
            closeAction: 'destroy',
            width: 720,
            height: 400,
            constrainHeader: true,
            maximizable:false,
			modal:true,
			autoScroll: true,
			resizable: true,
            //x: 200,
            //y: 100,
			//html: '<b>Нет изображений<b>'
            //html: '<div id="image_wrap" style="width:100%; height:100%; text-align:left; background-color:#efefef; border:2px solid #fff; outline:1px solid #ddd; -moz-ouline-radius:4px;"><img style="margin: 15px;" src="scripts/Desert.jpg" width="320" height="240" /><img style="margin: 15px;"src="scripts/Hydrangeas.jpg" width="320" height="240"/></div>',
			html: str
			//items:[Bil_Grid]
        });
        Photo_Window.show();
        Ext.getBody().unmask(lan.saving);    
    }
}



function ShowWindowFormMessage(type,iddoc,idrow){

if(type){ var t = lan.create;  var tt = false; 
}else{ var t = lan.view; var tt = true; }

if(Ext.getCmp(iddoc)){Ext.getCmp(iddoc).store.load();}

	if(!WindowFormMes){
		WindowFormMes = new Ext.Window({
            width: 600,
            height: 350,
            title: t+' '+lan.message,
			iconCls:'msg',
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
			closable: false,
            modal: true,
			constrainHeader: true,
			listeners: {
                destroy: function(){
                    WindowFormMes = null;
                }
            },
            items:[
			new Ext.create('Ext.form.Panel', {
				//width: '100%',
				autoScroll: true,
				bodyPadding: '6 5 5 6',
				border: false,
				frame: true,
				//autoHeight:true,
				//labelWidth: 200,
				id: 'formmessage',
				layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
				defaults: {
					msgTarget: 'side'
				},
				items:[
					{
                    xtype:'combo',
                    fieldLabel: lan.to_whom,
					name: 'recipient',
					allowBlank: false,
					store: edrpoustore,
					queryMode: 'local',
					queryParam: 'id',
                    displayField: 'type',
                    valueField: 'id',
					typeAhead: true,
                    triggerAction: 'all',
					//forceSelection: true,
                    lazyRender: true,
					editable: true,
					labelWidth: 50
					//anchor:'100%'
					},
					{
                    xtype:'textfield',
                    fieldLabel: lan.subject,
                    name: 'theme',
					//allowBlank: false,
					labelWidth: 50
                    //anchor:'96%',
					},
					{
					xtype: 'htmleditor',
					name: 'text',
					//fieldLabel: 'Biography',
					//labelWidth: 50,
					allowBlank: false,
					height: 200
					//anchor: '100%'
					}
				],
				buttons:[
					{ 
                    text:'Надіслати',
                    //id:'buttonUploads',
					hidden: tt,
					iconCls:'msg',
					handler: function() {			
						var form = this.up('form').getForm();
						if(form.isValid()){
						form.submit({
							url: 'scripts/saveformref.php',
							waitMsg: lan.loading2,
							wait: true,
							scope: this,
							method: 'post',
							//timeout : 60000,
							params: {send:"_message"},
							success: function(fp, o) {
								Ext.MessageBox.alert(lan.succ, lan.mess_send);
								WindowFormMes.destroy();
								if(Ext.getCmp(iddoc)){Ext.getCmp(iddoc).store.load();}
							},
							failure: function(fp, o) {
								//msg('Ошыбка', o.result.message);
								Ext.MessageBox.alert(lan.error, o.result.message);
							}
						});
						}
					}
                    },
					{
                    text: lan.cancel,
					iconCls: 'cancel',
                    handler:function(){
                        WindowFormMes.destroy();
                    }
					}
				]
			})	 
			]
		})  
    }
    WindowFormMes.show();
	var form = Ext.getCmp("formmessage").getForm().getFields();
	if(!type){
	Ext.Ajax.request({
		url: 'scripts/saveformref.php',
		method: 'POST',
		params: {editmsg:idrow,id:iddoc},
		success: function (response){
			var JSON = response.responseText;
			if(JSON){
			var decoded = Ext.decode(JSON);
			var i=3;
			form.each(function(item){
				item.setValue(decoded[i]);
				i++;
			});
			}
		},
		failure: function (response){ 
			Ext.MessageBox.alert(lan.error, response.responseText);
		}
	});
	}
}







function Show_Uploads_Window_Add()
{
    if(!Uploads_Window_Add){
         Uploads_Window_Add = new Ext.Window({
                        width: 399,
                        height: 118,
                        title: lan.upload_files,
                        closeAction : 'destroy',
                        layout:'border',
						//iconCls: 'Load16',
                        resizable:false,
                        modal:true,
						constrainHeader: true,
						listeners: {
						destroy: function(){
							Uploads_Window_Add = null;
						}
						},
                        //bodyStyle:{'background-color': '#FFFFFF'},

        items:[
		Ext.create('Ext.form.Panel', {
        width: '100%',
        bodyPadding: '10 10 10 10',
		border: false,
		frame: true,
        defaults: {
			fileUpload: true,
            msgTarget: 'side'
        },
		items:[
		{
            xtype: 'filefield',
            name: 'filefield',
            emptyText: lan.select_file_upload,
            //fieldLabel: 'Пользователи',
			width: 357,
            buttonText: lan.open
        }
		],
		buttons:[
								{ 
                                text: lan.upload,
								iconCls:'save',
								handler: function() {
									
									
				var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'scripts/saveformref.php',
                        waitMsg: lan.loading3,
						//wait:true,
						//scope: this,
						method: 'post',
						//timeout : 60000,
                        success: function(fp, o) {
							Uploads_Window_Add.destroy();
							WindowFormRef.destroy();
							ShowWindowFormRef(false,'_transporter',id_user,false);
							Ext.MessageBox.alert(lan.succ, o.result.message, function(btn){ /*if(btn){ ShowWindowFormRef(false,'_transporter',id_user,false); }*/ });
                        },
						failure: function(fp, o) {
							Ext.MessageBox.alert(lan.fail, o.result.message);
						}
                    });
                }
									

								}
                                },
								{ 
                                text: lan.cancel,
								iconCls:'cancel',
                                handler:function(){
                                        Uploads_Window_Add.destroy();        
                                }

                                }
								]
		})	 
				 ]
                })      
         
    }
    Uploads_Window_Add.show(); 
}




function Show_List_Window_Add()
{
    if(!List_Window_Add){
         List_Window_Add = new Ext.Window({
                        width: 399,
                        height: 118,
                        title: lan.who_given,
                        closeAction : 'destroy',
                        layout:'border',
						//iconCls: 'Load16',
                        resizable:false,
                        modal:true,
						constrainHeader: true,
						listeners: {
						destroy: function(){
							List_Window_Add = null;
						}
						},
                        //bodyStyle:{'background-color': '#FFFFFF'},

        items:[
		Ext.create('Ext.form.Panel', {
        width: '100%',
        bodyPadding: '10 10 10 10',
		border: false,
		frame: true,
        defaults: {
			fileUpload: true,
            msgTarget: 'side'
        },
		items:[
		{
            xtype: 'combobox',
            //emptyText: 'Виберіть файл для завантаження',
			width: 357,
			store: listwhomstore,
			queryMode: 'local',
            displayField: 'type',
            valueField: 'id',
			typeAhead: true,
            triggerAction: 'all',
			//forceSelection: true,
            lazyRender: true,
			editable: true,
			id:'comboboxlist'
        }
		],
		buttons:[
								{ 
                                text: lan.save,
								iconCls:'save',
								handler: function() {
									Ext.getCmp('pasadrboss3').setValue( Ext.getCmp('comboboxlist').getValue() );
									List_Window_Add.destroy();
								}
                                },
								{ 
                                text: lan.cancel,
								iconCls:'cancel',
                                handler:function(){
                                        List_Window_Add.destroy();
                                }

                                }
								]
		})	 
				 ]
                })      
         
    }
    List_Window_Add.show(); 
}


