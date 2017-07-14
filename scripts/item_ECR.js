function getComponentForm(inData){
    var time_id = Date.parse(new Date());
    var comp_id = null;
    var action = 'view';
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;
    var hd_save = false;
    var hd_use = true;
    var case_type = 'dir';
    var use_new = false;
    var back_object = null;

    if(all_rights.comp_part_number){//rights rule
        var rights = all_rights.comp_part_number;
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.comp_id) comp_id = inData.comp_id;
        if(inData.action) action = inData.action;
        if(inData.case_type) case_type = inData.case_type;
        if(inData.use_new) use_new = inData.use_new;
        if(inData.back_object) back_object = inData.back_object;
    }

    var val = inData.comp_type.type;

    var color = "";
    var strt_ppap = false;
    var comp_form_body = {xtype: 'displayfield', value: 'FORM IS N/A'};
    switch(Number(val)){
        case 1:
            color = '#008000';
            comp_form_body = getComponentFormBody({time_id: time_id, action: action});
        break;
        case 2:
            color = '#808080';
            comp_form_body = getComponentFormBody({time_id: time_id, action: action});
        break;
        case 3:
            color = '#4169E1';
            strt_ppap = true;
            comp_form_body = getKitFormBody({time_id: time_id, action: action});
        break;
        case 4:
            color = '#B0E0E6';
            strt_ppap = true;
            comp_form_body = getComponentFormBody({time_id: time_id, action: action, comp_type: val});
        break;
    }


    if(case_type=="bom"||case_type=="kit"||case_type=="task"){
        hd_save = true;
        hd_use =false;
    }
    else if (case_type=='dir'){
    	hd_use =true;
    }

    if(action=='view'){
            hd_use =true;
        }


    /*if(case_type=="bom"){
        hd_save = true;
        if(action!='view'){
            hd_use =false;
        }
    }*/

    var comp_form = new Ext.create('Ext.form.Panel',{
                    bodyPadding: 10,
                    defaults: {
                        anchor: '100%',
                        labelWidth: 100
                    },
                    autoScroll: true,
                    items: [{
                    	xtype: 'container',
		                anchor:'100%',
		                layout: {
		                    type: 'hbox',
		                },
		                items:[{
                        xtype: 'displayfield',
                        value: inData.comp_type.name,
                        id: 'display_type_'+time_id,
                        margin: '0 10% 0 10px',
                        //minWidth: 300,
                        renderer: function (value, field) {
                            return '<span style="color:' + color + '; font-size: 25px; display: inline-block; padding: 5px 10px; border: 3px solid '+color+';"><b>' + value + '</b></span>';
                        }
                    },{
                    	xtype: 'displayfield',
                    	margin: '0 10px 0 10px',
                    	renderer: function (value, field) {
                            return (val==3||action=='view')?'':'<img style="height: 32px; width: 32px;" src="./img/refresh_icon.png" onclick=changeCompType('+time_id+')>';
                        }
                    },{
                        xtype: 'displayfield',
                        flex: 1
                    },{
                        xtype: 'button',
                        text: 'Start PPAP',
                        width: 200,
                        margin: '8px 13px 0 10px',
                        id: 'start_ppap_btn' + time_id,
                        hidden: strt_ppap,
                        handler(){
                            var comp_id = getValueByName(this.up('form').getForm().getFields(), 'comp_id');
                            var comp_type = getValueByName(this.up('form').getForm().getFields(), 'comp_type');
                            createPPAP({time_id: time_id, comp_id: comp_id, comp_type:comp_type});
                        }
                    },{
                        xtype: 'button',
                        text: 'View PPAP',
                        width: 200,
                        margin: '8px 13px 0 10px',
                        id: 'view_ppap_btn' + time_id,
                        hidden: true,
                        handler(){
                            var ppap_task_id = getValueByName(this.up('form').getForm().getFields(), 'ppap_task_id');
                            var task_type = getValueByName(this.up('form').getForm().getFields(), 'task_type');
                            var title;
                            switch(Number(task_type)){
                                case 17:
                                    title = lan.ppap_test_plan;
                                break;
                                case 39:
                                    title = lan.ppap_finished_good;
                                break;
                                case 40:
                                    title = lan.ppap_finished_good_review;
                                break;
                                case 36:
                                    title = lan.ppap_review;
                                break;
                            }

                            var id_task = task_names[task_type]; 
                            tabs.items.each(function(item){
                                if(item){
                                    if(item.id == 'tab'+id_task){
                                        tabs.remove(item);
                                    }
                                }
                            });
                            
                            var inData = {task_id:id_task, id_row: ppap_task_id, rights: all_rights[id_task]};
                            var form = addForm(inData); //rights rule
                            showObject({id:time_id, title: title, item: form, sizeX: '90%', sizeY: '90%'});
                        }
                    }]
                    },
                    {
                        xtype:'hidden',
                        name:'comp_type',
                        value: val
                    },
                     {
                        xtype:'hidden',
                        name:'comp_id',
                    },
                    {
                        xtype:'hidden',
                        name:'ppap_task_id',
                    },
                    {
                        xtype:'hidden',
                        name:'task_type',
                    },
                    {
                        xtype:'hidden',
                        id:'grid_control'+time_id,
                        value: 1
                    },
                    comp_form_body
                    ],
                    buttons:[
                        {
                            text:'Save',
                            width: 200,
                            iconCls: 'savebtn',
                            hidden: hd_save,
                            handler:function(){
                                var form = this.up('form').getForm();
                                var comp_type = getValueByName(form.getFields(), 'comp_type');
                                //saveCompForm({form: form,  time_id: time_id, action: action, comp_type: comp_type, case_type:case_type, back_object: back_object});
                                 if(action=='edit'){
                                    var ppap_task_id = getValueByName(form.getFields(), 'ppap_task_id');
                                    var task_type = getValueByName(form.getFields(), 'task_type');
                                    Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?getPPAPProgress=true',
                                            method: 'POST',
                                            params: {
                                                ppap_task_id:ppap_task_id,
                                                task_type:task_type
                                            },
                                            success: function (response){
                                               var data = response.responseText;
                                                if(data){
                                                    Ext.Msg.confirm(lan.attention+"'", 'Component is on PPAP review, if you save component, it will be rejected and new PPAP test plan will be generated!',
                                                        function(buttonId) {
                                                            if (buttonId === 'yes') {
                                                                saveCompForm({form: form,  time_id: time_id, action: action, comp_type: comp_type, case_type:case_type, back_object: back_object, ppap_set_reject: true});
                                                            } else {
                                                                return false;
                                                            }
                                                        });
                                                }
                                                else {
                                                    saveCompForm({form: form,  time_id: time_id, action: action, comp_type: comp_type, case_type:case_type, back_object: back_object});
                                                }
                                            },
                                            failure: function (response){ 
                                                Ext.MessageBox.alert(lan.error, response.responseText);
                                            }
                                        });
                                }
                                else {
                                    saveCompForm({form: form,  time_id: time_id, action: action, comp_type: comp_type, case_type:case_type, back_object: back_object});
                                }
                            }
                        },{
                            text:'Use',
                            width: 200,
                            iconCls: 'workbtn',
                            hidden: hd_use,
                            handler:function(){
                                var form = this.up('form').getForm();
                                var form_fields = form.getFields();
                                var comp_type = getValueByName(form_fields, 'comp_type');
                                var isExist = false;
                                var count_fg = 0;

                                if(use_new){
                                	saveCompForm({form: form,  time_id: time_id, action: 'add', comp_type: comp_type, case_type:case_type});
                                }
                                else {
                                	var old_time_id = time_id+100000;
                                    var description = getValueByName(form_fields, 'description');
                                    var part_number = getValueByName(form_fields, 'part_number');
                                    var comp_id = getValueByName(form.getFields(), 'comp_id');
                                    var image1 = Ext.getCmp('image1'+time_id).src;

                                    if(case_type=='kit'){
                                        var table_id = 'kit_table'+old_time_id;
                                        msg = "This component is already contain in KIT!";
                                        row = {id: comp_id, comp_type: comp_type, description: description, part_number: part_number, image1: image1};
                                    }
                                    else {
                                        if(Number(comp_type)!=3){
                                            var revision = getValueByName(form_fields, 'revision');
                                            var create_date = getValueByName(form_fields, 'create_date');
                                        }
                                        
                                       var drawing2d = Ext.getCmp('drawing2d'+time_id).src;
                                        var drawing3d = Ext.getCmp('drawing3d'+time_id).src;
                                        var table_id = 'gridbom'+old_time_id;
                                        msg = "This component is already contain in BOM!";
                                        row = {id: comp_id, comp_type: comp_type, description: description, part_number: part_number, image1: image1, create_date: create_date, drawing2d: drawing2d, drawing3d: drawing3d, revision: revision};
                                    }
                                	var store = Ext.getCmp(table_id).getStore();
                                    if(case_type=='bom'&&store.data.length==0&&comp_type!=1){
                                        Ext.MessageBox.alert(lan.error, lan.first_comp_finish_goods);
                                        return;
                                    }
                                	
                                	store.each(function(record){
                                		if(record.get('id') ==comp_id){
                                			isExist = true;
                                        }
                                        if(record.get('comp_type')==1){
                                            count_fg++;
                                        }
                                	});

                                    if((case_type=='bom'||case_type=='task')&&comp_type==1&&count_fg>0){
                                        Ext.MessageBox.alert(lan.error, lan.already_bom);
                                        return;
                                    }

                                	if(isExist){
                                		Ext.MessageBox.alert(lan.error, msg);
                                		return;
                                	}
	                                
	                                store.add(row);
	                                var win_arr = [];
			                    	Ext.WindowMgr.each(function(win){
				                            win_arr.push(win);
				                        });
			                    	var start = 1;
			                    	if(case_type=='task') start = 0;

			                    	for (var i = start; i <win_arr.length; i++) {
			                    		win_arr[i].destroy();
			                    	}
                                }
                            }
                        },{
                            text:'Cancel',
                            width: 200,
                            iconCls: 'cancelbtn',
                            handler:function(){
                                this.up('window').destroy();
                            }
                        }],
                    listeners: {
                        afterrender: function(){
                            var fields = this.getForm().getFields();
                            if(comp_id){
                                setFieldsComp({time_id: time_id, comp_id: comp_id, fields: fields});
                            }
                            else if(back_object){
                            	var part_number = back_object.query('[name=comp_part_number]')[0].getValue();
                            	var el = getFieldByName(fields, 'part_number');
                            	el.setValue(part_number);
                            }
                            if(action=='view'){
                                setBlockForm(this, time_id);
                                Ext.getCmp('start_ppap_btn' + time_id).enable();
                            }
                        }
                    }
                });

    return comp_form;
}

function saveCompForm(inData){
    if(inData.form&&inData.time_id){
        var form = inData.form;
        var time_id = inData.time_id;
        var action = inData.action;
        var case_type = "";
        var comp_type = 2;
        var back_object = null;

        if(inData.comp_type){
            comp_type = inData.comp_type;
        }
        if(inData.case_type){
            case_type = inData.case_type;
        }
        if(case_type=='task'&&inData.back_object){
        	back_object = inData.back_object;
        }

        var dim_data = [];
        var func_data = [];
        var kit_data = [];
        var doc_data = [];
        var img_galery_data = [];
        var main_img = "";
        var drawing2d_img = "";
        var drawing3d_img = "";        

        if(comp_type==3){
            var store = Ext.getCmp('kit_table'+time_id).getStore();
        
            if(store.data.length==0){
                Ext.MessageBox.alert(lan.error, 'KIT cannot be empty!');
                return;
            }
            var isNotFull = false;
            store.each(function(record){
                if(!record.get('qty')||record.get('qty')==0) isNotFull = true;
                kit_data.push({comp_id: record.get('id'), qty:record.get('qty')});
            });

            if(isNotFull){
                Ext.MessageBox.alert(lan.error, 'QTY of component connot be null.');
                return;
            }
        }
        else {
            Ext.getCmp('dim_attr_table'+time_id).getStore().each(function(record){
                if(record.get('dimension_name')&&record.get('dimension_name').trim()!=""){
                    dim_data.push({'critical': record.get('critical'),  'dimension_name': record.get('dimension_name'), 'metric':record.get('metric'), 'dimension': record.get('dimension'), 'tolerance_plus': record.get('tolerance_plus'), 'tolerance_minus': record.get('tolerance_minus'), 'tool_gage_id': record.get('tool_gage_id')});
                }
            });

            if(comp_type!=4){
                if(dim_data.length==0) {
                    Ext.MessageBox.alert(lan.error, 'Please fill dimensional attribute table.');
                    return;
                }
            } 

            Ext.getCmp('func_attr_table'+time_id).getStore().each(function(record){
                if(record.get('value_desc')&&record.get('value_desc').trim()!=""){
                    func_data.push({'critical': record.get('critical'),  'value_desc': record.get('value_desc'), 'metric':record.get('metric'), 'nominal': record.get('nominal'), 'tolerance_plus': record.get('tolerance_plus'), 'tolerance_minus': record.get('tolerance_minus'), 'equipment_id': record.get('equipment_id'), 'test_procedure_id': record.get('test_procedure_id')});
                }
            });
        }

        

        Ext.getCmp('UploadForm'+time_id).getStore().each(function(record){
            img_galery_data.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
        });

        Ext.getCmp('doc_grid'+time_id).getStore().each(function(record){
            doc_data.push({'id': record.get('id'),'descr_spec': record.get('descr_spec'), 'add_spec': record.get('add_spec')});
        });

        var main_img = Ext.getCmp('image1'+time_id).src;
        if(main_img&&main_img.trim()!=""){
            var main_img = getImageName(Ext.getCmp('image1'+time_id).src);
        }
        else {
            Ext.MessageBox.alert(lan.error, 'Please upload main image of component.');
            return;
        }

        var drawing2d_img = getImageName(Ext.getCmp('drawing2d'+time_id).src);
        var drawing3d_img = getImageName(Ext.getCmp('drawing3d'+time_id).src);

        var params = {
            'action': action,
            'dim_attr': (dim_data.length>0)? JSON.stringify(dim_data):null,
            'func_attr': (func_data.length>0)? JSON.stringify(func_data):null,
            'kit_data': (kit_data.length>0)? JSON.stringify(kit_data):null,
            'img_galery': (img_galery_data.length>0)? JSON.stringify(img_galery_data):null,
            'docs': (doc_data.length>0)? JSON.stringify(doc_data):null,
            'image1': (main_img)?main_img:null,
            'drawing2d': (drawing2d_img)?drawing2d_img:null,
            'drawing3d': (drawing3d_img)?drawing3d_img:null

        }

         if(inData.ppap_set_reject){
            params = $.extend({}, params, {ppap_set_reject:true});
        }
        
        if(form.isValid()) {
            form.submit({
                url: 'scripts/ecr_form.php?saveComponentForm=true',
                waitMsg: lan.saving,
                wait: true,
                scope: this,
                method: 'post',
                params: params,
                success: function(form, action) {
                    var data = action.result;
                    var msg = "";
                    if(case_type=="kit"){
                    	msg = " and add to KIT.";
                    	var old_time_id = time_id+100000;
                    	var store = Ext.getCmp('kit_table'+old_time_id).getStore();
                    	var comp_id = data.comp_id;
                    	var isExist = false;

                    	store.each(function(record){
                    		if(record.get('id') ==comp_id){
                    			isExist = true;                               		}
                    	});

                    	if(isExist){
                    		Ext.MessageBox.alert(lan.error, "Component saved but not add to KIT. This component is already contain in KIT!");
                    		return;
                    	}

                    	var comp_type = data.comp_type;
	                    var description = getValueByName(form.getFields(), 'description');
	                    var part_number = getValueByName(form.getFields(), 'part_number');
	                    var image1 = Ext.getCmp('image1'+time_id).src;
                        store.add({id: comp_id, comp_type: comp_type, description: description, part_number: part_number, image1: image1});
                    	var win_arr = [];
                    	Ext.WindowMgr.each(function(win){
	                            win_arr.push(win);
	                        });
                    	win_arr[win_arr.length-1].destroy();
                    }
                    else if(case_type=="bom"){
                        msg = " and add to BOM.";
                        var old_time_id = time_id+100000;
                        var store = Ext.getCmp('gridbom'+old_time_id).getStore();
                        var comp_id = data.comp_id;
                        var isExist = false;
                        var count_fg = 0;
                        var comp_type = data.comp_type;

                        if(store.data.length==0&&comp_type!=1){
                            Ext.MessageBox.alert(lan.error, lan.first_comp_finish_goods);
                            return;
                        }

                        store.each(function(record){
                            if(record.get('id') ==comp_id){
                                isExist = true;
                            }
                            if(record.get('comp_type')==1){
                                count_fg++;
                            }
                        });

                        if(comp_type==1&&count_fg>0){
                            Ext.MessageBox.alert(lan.error, lan.already_bom);
                            return;
                        }

                        if(isExist){
                            Ext.MessageBox.alert(lan.error, "Component saved but not add to BOM. This component is already contain in BOM!");
                            return;
                        }
                        var form_fields = form.getFields();
                        if(Number(comp_type)!=3){
                            var revision = data.revision;
                            var create_date = data.create_date;
                        }
                        var description = getValueByName(form_fields, 'description');
                        var part_number = getValueByName(form_fields, 'part_number');
                        var drawing2d = Ext.getCmp('drawing2d'+time_id).src;
                        var drawing3d = Ext.getCmp('drawing3d'+time_id).src;
                        var image1 = Ext.getCmp('image1'+time_id).src;
                        store.add({ id: comp_id, comp_type: comp_type, description: description, part_number: part_number, image1: image1, create_date: create_date, drawing2d: drawing2d, drawing3d: drawing3d, revision: revision});
                        var win_arr = [];
                        Ext.WindowMgr.each(function(win){
                                win_arr.push(win);
                            });
                        win_arr[win_arr.length-1].destroy();
                    }
                    else if(case_type=="task"){
                    	back_object.query('[name=comp_part_number]')[0].setValue(getValueByName(form.getFields(), 'part_number'));
                    	if(data.comp_type==3||data.comp_type==4){
                    		back_object.query('[name=comp_status]')[0].setValue(1);
                    	}
                    	else {
                    		back_object.query('[name=comp_status]')[0].setValue(3);
                    	}
                    	
                    	back_object.query('[name=comp_task_status]')[0].setValue(1);
                    	back_object.query('[name=comp_id]')[0].setValue(data.comp_id);
                    	back_object.query('[name=comp_type]')[0].setValue(data.comp_type);
                    	var image1 = Ext.getCmp('image1'+time_id).src;
                    	back_object.query('[name=comp_img]')[0].setValue(image1);
                    	Ext.WindowMgr.each(function(win){
	                            win.destroy();
	                        });
                    }
                    else {
                    	Ext.getCmp('components_grid'+time_id).getStore().load();
                    	Ext.WindowMgr.each(function(win){
	                            win.destroy();
	                        });
                    }
                    Ext.MessageBox.alert(lan.succ, data.message+msg);
                },
                failure: function(form, action) {
                    var data = action.result;
                    Ext.MessageBox.alert(lan.error, data.message);
                }
            });
        }
    }
}

function setFieldsComp(inData){
    if(inData.comp_id&&inData.time_id&&inData.fields){
        var time_id = inData.time_id;
        var comp_id = inData.comp_id;
        var fields = inData.fields;
        
        Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getCompContent=true',
            method: 'POST',
            params: {
                comp_id:comp_id,
            },
            success: function (response){
               var JSON = response.responseText;
               if(JSON){
                    var data = Ext.decode(JSON);
                    var form = Ext.getCmp('display_type_'+time_id).up('form');
                    if(data.ppap_complete){
                        if(data.ppap_complete==1){
                            setBlockForm(form, time_id);
                        }
                    }

                    if(data.comp_status){
                        if(data.comp_status==1){
                            Ext.getCmp('start_ppap_btn' + time_id).enable();
                        }
                        else if(data.comp_status==0||data.comp_status==2){
                            Ext.getCmp('start_ppap_btn' + time_id).hide();
                            Ext.getCmp('view_ppap_btn' + time_id).show();
                        }
                    }

                    fields.each(function(item){
                    for (var k in data){
                        if(item.getName() == k && data[k]!=null){
                            item.setValue(data[k]);
                            }
                        }
                    });
                    if(data.dim_attr){
                        Ext.getCmp('dim_attr_table'+time_id).getStore().loadData(data.dim_attr);
                    }

                    if(data.func_attr){
                        Ext.getCmp('func_attr_table'+time_id).getStore().loadData(data.func_attr);
                    }

                    if(data.kit_data){
                    	Ext.getCmp('kit_table'+time_id).getStore().loadData(data.kit_data);
                    }

                    if(data.image1){
                        Ext.getCmp('image1'+time_id).up('form').setBodyStyle('background:#fff');
                        Ext.getCmp('image1'+time_id).setSrc('img/components/'+data.image1);
                        }
                    if(data.drawing2d){
                        Ext.getCmp('drawing2d'+time_id).up('form').setBodyStyle('background:#fff');
                        Ext.getCmp('drawing2d'+time_id).setSrc('img/components/'+data.drawing2d);
                    }
                    if(data.drawing3d){
                        Ext.getCmp('drawing3d'+time_id).up('form').setBodyStyle('background:#fff');
                        Ext.getCmp('drawing3d'+time_id).setSrc('img/components/'+data.drawing3d);
                    }
                    if(data.addImages){
                        Ext.getCmp('UploadForm'+time_id).getStore().loadData(Ext.decode(data.addImages));
                    }
                    if(data.add_spec){
                        Ext.getCmp('doc_grid'+time_id).getStore().loadData(Ext.decode(data.add_spec));
                    }

                    if(data.ppap_results){
                        Ext.getCmp('ppap_results_'+time_id).getStore().loadData(data.ppap_results);
                        Ext.getCmp('ppap_results_'+time_id).show();
                    }
                    Ext.getCmp('view_ppap_btn' + time_id).enable();
                }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
    }
}


function getKitFormBody(inData){
    var time_id = inData.time_id;
    var kit_table = getKitTable({time_id: time_id});
    var imageGalery = getImageGalery(time_id, readStatus=false);
    var main_image = getImageUploadItem({time_id:time_id, title: 'Main Image', readStatus: false, id: 'image1'});
    var image2d = getImageUploadItem({time_id:time_id, title: '2D Drawing', readStatus: false, id: 'drawing2d'});
    var image3d = getImageUploadItem({time_id:time_id, title: '3D Drawing', readStatus: false, id: 'drawing3d'});
    var upload_docs =  getUploadDocumentsItem({time_id:time_id, readStatus: false, id: 'upload_docs'});

    var kit_form_body = {
                    xtype: 'container',
                    layout: 'anchor',
                    items:[{
                            xtype:'combobox',
                            fieldLabel: 'Finished Item:',
                            id: 'part_number'+time_id,
                            name: 'part_number',
                            allowBlank: false,
                            typeAhead: false,
                            queryMode: 'local',
                            minChars:2,
                            triggerAction: 'all',
                            editable: true,
                            enableKeyEvents: true,
                            labelWidth: style.input2.labelWidth,
                            anchor:'96%',
                            store: store_part_number,
                            displayField: 'part_number',
                            valueField: 'part_number',
                            margin: '0 0 5px 10px',
                            minWidth: 220,
                            //readOnly: readStatus,
                            listeners:{
                               /* afterrender: function(){
                                    store_part_number.load();
                                   if (id_comp) {
                                        loadDataECR(id_comp, time_id);
                                    }
                                },
                                select:function(name, newValue, oldValue, eOpts){
                                   part_id = name.displayTplData[0].id;
                                   loadDataECR(part_id, time_id);
                                },
                                change: function(){
                                    var val_length = 0;
                                    if(Ext.getCmp('part_number'+time_id).getValue()) val_length = Ext.getCmp('part_number'+time_id).getValue().length;
                                   
                                   if(val_length>1) Ext.getCmp('part_number'+time_id).setConfig('queryMode', 'remote');
                                        else Ext.getCmp('part_number'+time_id).setConfig('queryMode', 'local');
                                }*/
                            }
                    },
                    {
                        xtype:'combobox',
                        fieldLabel: lan.description+':',
                        id: 'description'+time_id,
                        name: 'description',
                        queryMode: 'remote',
                        allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        labelWidth: style.input2.labelWidth,
                        anchor:'96%',
                        store: store_description,
                        displayField: 'description',
                        valueField: 'description',
                        margin: '10px 0 0 10px',
                        //readOnly: readStatus,
                        listeners: {
                          /*  select: function() {
                                var val = Ext.getCmp('description'+time_id).getValue();
                                //storeDimesionalAttrTable.removeAll();
                               // storeFunctionalAttrTable.removeAll();
                                store_dimension_name.getProxy().setUrl('scripts/ecr_form.php?getDimensionName=true&description='+val);
                                store_dimension_name.load();
                                storeMaterials.getProxy().setUrl('scripts/ecr_form.php?getMaterials=true&description='+val);
                                storeMaterials.load();
                                store_value_desc.getProxy().setUrl('scripts/ecr_form.php?getValueDesc=true&description='+val);
                                store_value_desc.load();
                                dataSelect(time_id);
                            },
                            change: function(){
                              var val = Ext.getCmp('description'+time_id).getValue();
                              if(!val||val.length==0){
                                    store_dimension_name.getProxy().setUrl('scripts/ecr_form.php?getDimensionName=true');
                                    store_dimension_name.load();
                                    storeMaterials.getProxy().setUrl('scripts/ecr_form.php?getMaterials=true');
                                    storeMaterials.load();
                                    store_value_desc.getProxy().setUrl('scripts/ecr_form.php?getValueDesc=true');
                                    store_value_desc.load();
                              }
                            }*/
                        }
                    },{
                            xtype:'textfield',
                            fieldLabel: 'BOM Number',
                            //id: 'revision'+time_id,
                            name: 'kit_bom_number',
                            labelWidth: style.input2.labelWidth,
                            enableKeyEvents: true,
                            margin: '5px 0 5px 10px',
                            anchor:'96%'
                           // readOnly: readStatus
                        },{
                            xtype:'textfield',
                            fieldLabel: 'BOM Title',
                            //id: 'revision'+time_id,
                            name: 'kit_bom_title',
                            labelWidth: style.input2.labelWidth,
                            enableKeyEvents: true,
                            margin: '5px 0 5px 10px',
                            anchor:'96%'
                           // readOnly: readStatus
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            name: 'last_mod',
                            //id:'RequestedDate_'+id+time_id,
                            labelWidth: style.input2.labelWidth,
                            fieldLabel: 'Last Mod.',
                            margin: '5px 0 5px 10px',
                            anchor:'96%',
                            readOnly: true
                        },
                        kit_table,
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10px 0 0 0',
                            anchor: '96%',
                            items:[{xtype: 'displayfield', flex:1}, main_image,{xtype:'splitter'}, image2d,{xtype:'splitter'}, image3d,{xtype: 'displayfield', flex:1}]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'IMAGES',
                            anchor: '96%',
                            border: 3,
                            padding: '3',
                            style: {
                                borderColor: '#1E90FF'
                            },
                            items: imageGalery
                        }, upload_docs]
                };
    return kit_form_body;
}

function getComponentFormBody(inData){
    var time_id = inData.time_id;
    var comp_type = inData.comp_type;
    var hd_status = false;
    if(comp_type==4){
        hd_status = true;
    }

    var dimAttrTable = getDimAttrTable({time_id: time_id});
    var funcAttrTable = getFuncAttrTable({time_id: time_id});
    var imageGalery = getImageGalery(time_id, readStatus=false);
    var main_image = getImageUploadItem({time_id:time_id, title: 'Main Image', readStatus: false, id: 'image1'});
    var image2d = getImageUploadItem({time_id:time_id, title: '2D Drawing', readStatus: false, id: 'drawing2d'});
    var image3d = getImageUploadItem({time_id:time_id, title: '3D Drawing', readStatus: false, id: 'drawing3d'});
    var upload_docs =  getUploadDocumentsItem({time_id:time_id, readStatus: false, id: 'upload_docs'});
    var ppap_results = getPPAPResults({time_id: time_id});

    var store_comp_part_number = new Ext.data.Store({
            fields: ['id', 'part_number'],
            proxy: {
                type: 'ajax',
                url: 'scripts/ecr_form.php?getPartNumbers=true',
                reader: {
                    type: 'json',
                    root: 'rows',
                    totalProperty: 'total'
                }
            }
        });
    store_comp_part_number.load();

    var comp_form_body = {
                    xtype: 'container',
                    layout: 'anchor',
                    items:[{
                        xtype: 'container',
                        anchor:'96%',
                        layout: {
                            type: 'hbox',
                        },
                        items: [{
                            xtype:'combobox',
                            fieldLabel: lan.comp_part_number+':',
                            id: 'part_number'+time_id,
                            labelAlign: 'top',
                            name: 'part_number',
                            allowBlank: false,
                            typeAhead: false,
                            queryMode: 'local',
                            minChars:2,
                            triggerAction: 'all',
                            editable: true,
                            enableKeyEvents: true,
                            labelWidth: style.input2.labelWidth,
                            store: store_comp_part_number,
                            displayField: 'part_number',
                            valueField: 'part_number',
                            margin: '0 0 0 10px',
                            minWidth: 220,
                            flex:3,
                            listeners:{
                                select:function(name, newValue, oldValue, eOpts){
                                   var comp_id = name.displayTplData[0].id;
                                   var fields =  this.up('form').getForm().getFields();
                                   setFieldsComp({time_id: time_id, comp_id: comp_id, fields: fields});
                                },
                                change: function(){
                                    var val_length = 0;
                                    if(this.getValue()) val_length = this.getValue().length;
                                   
                                   if(val_length>1) this.setConfig('queryMode', 'remote');
                                        else this.setConfig('queryMode', 'local');
                                }
                            }
                        },{
                            xtype: 'hidden',
                            name: 'ppap_complete'
                        },{
                            xtype:'textfield',
                            fieldLabel: lan.revision+':',
                            id: 'revision'+time_id,
                            labelAlign: 'top',
                            name: 'revision',
                            labelWidth: style.input2.labelWidth,
                            enableKeyEvents: true,
                            margin: '0 0 0 10px',
                            readOnly:true,
                            minWidth: 100,
                            flex:1
                        },{
                            xtype:'combobox',
                            fieldLabel: 'Status:',
                            id: 'comp_status'+time_id,
                            labelAlign: 'top',
                            name: 'comp_status',
                            labelWidth: style.input2.labelWidth,
                            store: storeCompStatuses,
                            displayField: 'value',
                            valueField: 'id',
                            margin: '0 0 0 10px',
                            readOnly:true,
                            minWidth: 100,
                            hidden: hd_status,
                            flex:1,
                            listeners: {
                                change: function(){
                                    var copm_status = this.getValue();
                                    var color_bg = "";
                                    switch(copm_status){
                                        case 0:
                                            color_bg = "#808080";
                                        break;
                                        case 1:
                                            color_bg = "#008000";
                                        break;
                                        case 2:
                                            color_bg = "#CD5C5C";
                                        break;
                                        case 3:
                                            color_bg = "#4169E1";
                                        break;
                                    }
                                    this.setConfig("fieldStyle", "text-align: center; color:#FFF; background: "+color_bg+";");
                                }
                            }
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            name: 'create_date',
                            fieldLabel: 'Created Date',
                            labelAlign: 'top',
                            readOnly:true,
                            margin: '0 0 0 10px',
                            minWidth: 120,
                            flex:1
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            name: 'last_mod',
                            fieldLabel: 'Last Mod.',
                            labelAlign: 'top',
                            readOnly:true,
                            margin: '0 0 0 10px',
                            minWidth: 120,
                            flex:1
                        }]
                    },
                    {                       
                        xtype:'combobox',
                        fieldLabel: lan.devision,
                        id: 'division'+time_id,
                        name: 'division',
                        allowBlank: false,
                        labelWidth: style.input2.labelWidth,
                        store: storeDivision,
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '96%',
                        margin: '10px 0 0 10px',
                        editable: false,
                        listeners: {
                            select: function(){
                                dataSelect(time_id);
                            }
                        }
                    },
                    {
                    xtype:'combobox',
                    fieldLabel: lan.description+':',
                    id: 'description'+time_id,
                    name: 'description',
                    queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor:'96%',
                    store: store_description,
                    displayField: 'description',
                    valueField: 'description',
                    margin: '10px 0 0 10px',
                    listeners: {
                      select: function() {
                          dataSelect(time_id);
                        }
                    }
                },{
                    xtype:'textareafield',
                    fieldLabel: 'Component Comments',
                    name: 'comp_comments',
                    labelWidth: style.input2.labelWidth,
                    margin: '5px 0 0 10px',
                    anchor:'96%',
                },{                       
                xtype:'combobox',
                fieldLabel: lan.material,
                id: 'material'+time_id,
                name: 'material',
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                store: storeMaterials,
                queryMode: 'remote',
                minChars:2,
                triggerAction: 'all',
                lazyRender: true,
                enableKeyEvents: true,
                displayField: 'name',
                valueField: 'name',
                //readOnly: readStatus,
                anchor: '96%',
                margin: '10px 0 0 10px',
                listeners: {
                    select: function(){
                        dataSelect(time_id);
                    }
                }
            },
            {
                xtype:'numberfield',
                fieldLabel: lan.dimension_deviation,
                name: 'deviation',
                id: 'deviation'+time_id,
                minValue: 0, 
                labelWidth: style.input2.labelWidth,
                //readOnly: readStatus,
                anchor: '96%',
                mouseWheelEnabled: false,
                allowDecimals: false,
                allowExponential: false,
                margin: '10px 0 0 10px',
                listeners:{
                    change:function(){
                            dataSelect(time_id);
                        }
                    }
                }, dimAttrTable, funcAttrTable,
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '10px 0 0 0',
                    anchor: '96%',
                    items:[{xtype: 'displayfield', flex:1}, main_image,{xtype:'splitter'}, image2d,{xtype:'splitter'}, image3d,{xtype: 'displayfield', flex:1}]
                },
                {
                    xtype: 'fieldset',
                    title: 'IMAGES',
                    anchor: '96%',
                    border: 3,
                    padding: '3',
                    style: {
                        borderColor: '#1E90FF'
                    },
                    items: imageGalery
                }, upload_docs, ppap_results]
            };
    return comp_form_body;
}


function getKitTable(inData){
    var time_id = inData.time_id;
    var kit_table_store = new Ext.data.Store({     
        fields: ['id', 'comp_type', 'description', 'part_number', 'qty', 'image1'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getKITComponents=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        },
        sorters: [{
            property: 'comp_type',
        }]
    });

    var actioncolumn = getActionColumn('image1');

    var kit_table = Ext.create('Ext.grid.Panel', {
        store: kit_table_store,
        id: 'kit_table'+time_id,
        title: 'KIT COMPONENTS',
        minHeight: 300,
        anchor: '96%',
        margin: '10 0 0 0',
        selModel: 'cellmodel',
        autoScroll: true,
        border: true,
        viewConfig:{
            markDirty:false
        },
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                /*beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                            if(edit_status==0||readStatus) {
                                return false;
                            }
                    
                    }*/
                }
            })],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{ 
                    xtype: 'button',
                    text: 'Add Existing Component',
                    //hidden: hideStatus,
                    //disabled: disable_edit, //rights rule
                    handler: function() {
                        var new_time_id = time_id-100000;
                        var comp_grid = addComponentsGrid({time_id: new_time_id, filter_out: "24", case_type: "kit", rights: all_rights['comp_part_number']});
                        var buttons = Ext.getCmp('UpperToolbar'+new_time_id).query('button');
                        for(var i = 0; i<buttons.length; i++){
                            if(buttons[i].iconCls=='showpic'||buttons[i].iconCls=='work'){
                                buttons[i].setConfig('hidden', false);
                            }
                            else {
                                buttons[i].setConfig('hidden', true);
                            }
                        }
                        showObject({id:time_id, title: 'Select Kit Part/Component', item: comp_grid, sizeX: '90%', sizeY: '90%'});
                    }
                },{ 
                    xtype: 'button',
                    text: 'Create New Component',
                    //hidden: hideStatus,
                    //disabled: disable_edit, //rights rule
                    handler: function() {
                    	var new_time_id = time_id - 100000;
                    	var dialog_win = getDialogWin({time_id:new_time_id, case_type:'kit'});
                        showObject({id:new_time_id, title: 'Select Component Type', item: dialog_win, sizeX: 300, sizeY: 200});
                        }
                    }]
        }],
        columns: [
            {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
            {text: 'TYPE', sortable: false, dataIndex: 'comp_type', width: 100, renderer: setCompType},
            {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 200, flex:1},
            {text: lan.comp_p_n, sortable: true, dataIndex: 'part_number', width: 150},
            {text: lan.qty, editor: {xtype: 'numberfield', minValue:0, allowExponential: false, mouseWheelEnabled: false}, sortable: true, dataIndex: 'qty', width: 110},
            {text: lan.Image,xtype:'actioncolumn',dataIndex: 'image1',width:80,sortable:true,items:[actioncolumn]},
            {xtype:'actioncolumn', width:30, hidden: false, dataIndex: 'set_hidden', items:[{
                iconCls: 'delete',
                handler:function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        kit_table_store.remove(rec);
                 }
            }]
            }
         ],
        listeners: {
           celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
                if (record) {
                    var comp_type = record.get('comp_type');
                    var comp_type_name = "";
                    var view_id = time_id-1000000;
                    storeCompTypes.each(function(rec){
                        if(rec.get('id')==comp_type){
                            comp_type_name = rec.get('value');
                        }
                    });

                    var comp_form = getComponentForm({time_id: view_id, comp_type: {type:comp_type, name: comp_type_name}, action: 'view', comp_id:record.get('id')});
                    setBlockForm(comp_form, view_id);
                    showObject({id:time_id, title: 'View Component', item: comp_form, sizeX: '90%', sizeY: '90%'});
                } else {
                    Ext.MessageBox.alert(lan.error, lan.select_row);
                }
            }
        }
    });

    return kit_table;
}

function getDimAttrTable(inData){
    var time_id = inData.time_id;
    var readStatus = false;
    var storeDimesionalAttrTable= new Ext.data.Store({     
        fields: ['id', {name:'critical', type:'int'}, 'dimension_name', {name:'metric', type: 'int'}, 'dimension', 'tolerance_plus', 'tolerance_minus', {type: 'int', name: 'tool_gage_id'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getDimAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var comboYESNO = getComboYESNO(readStatus);
    var dimUnits = getDimUnits(readStatus);
    storeGages.load();

    var setComboDimensionName = function(cell_record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype:'combobox',
                allowBlank: false,
                store: store_dimension_name,
                displayField: 'dimension_name',
                valueField: 'dimension_name',
                queryMode: 'remote',
                minChars:2,
                triggerAction: 'all',
                lazyRender: true,
                enableKeyEvents: true,
                listeners:{
                    beforeselect:function(combo, record, index, eOpts) {
                       var isExist = false;
                       storeDimesionalAttrTable.each(function(rec){
                            if(rec.get('dimension_name')==record.get('dimension_name')){
                                isExist = true;
                            }
                       });
                       if(isExist){
                            Ext.MessageBox.alert(lan.error, lan.same_dimension_name);
                            return false;
                       }          
                    },
                    select:function(){
                        cell_record.set('dimension_name', this.getValue());
                        dataSelect(time_id);
                    }
                }
            }
        });
    }

var gageEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeGages,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                    var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                    if(edit_status!=0){
                        var grid_tool_gage = addToolGageGrid(time_id, true, null, true, all_rights['tool_gage'], false);
                       	var grid_panel = getGridFrame({time_id: time_id, grid_item: grid_tool_gage, element: this, dataIndex:'tool_gage_id'});
                       	showObject({id: time_id, title: 'Tool/Gage', item: grid_panel});
                    }
                    else {
                        if(record.get('tool_gage_id')){
                            showWindowDirectory("", 'view', time_id, lan.view_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('tool_gage_id'), true, true);
                        }
                    }
                }
            }
        }
    });


var setCustomField = function(record){
    var unit = record.get('metric');
    var vt;
    switch (unit){
        case 1: vt = 'mmValid'; break;
        case 2: vt = 'inchValid'; break;
        case 5: vt = 'degValid'; break;
        case 6: vt = 'turnValid'; break;
        case 7: vt = 'intValid'; break;
        default: vt = 'threadValid'; break;
    }
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'textfield',
            enableKeyEvents: true,
            vtype: vt,
            listeners:{
            change: function(){
               var grid = Ext.getCmp('dim_attr_table'+time_id);
               var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
               this.setValue(this.getValue().replace(/\,|\.{2}/, '.'));
               this.setValue(this.getValue().replace(/\"{2}/, '"'));
               this.setValue(this.getValue().replace(/\/{2}/, '/'));
               this.setValue(this.getValue().replace(/\ {2}/, ' '));
               record.set(lastCol, this.value);
               dataSelect(time_id);
            }
        }
        }
    });
}

    var dim_attr_table = Ext.create('Ext.grid.Panel', {
        store: storeDimesionalAttrTable,
        id: 'dim_attr_table'+time_id,
        title: lan.dimensional_attr,
        minHeight: 300,
        anchor: '96%',
        margin: '10 0 0 0',
        selModel: 'cellmodel',
        border: true,
        viewConfig:{
            markDirty:false
        },
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                    var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                        if(edit_status==0) {
                            return false;
                        }
                    
                    }
                }
            })],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{ 
                xtype: 'button',
                text: lan.add_new_attr,
                id:'dim_add_attr'+time_id,
                //hidden: hideStatus,
                //disabled: disable_edit, //rights rule
                handler: function() {
                    storeDimesionalAttrTable.add({'critical':1, 'metric': 1});
                    }
                }]
        }],
        columns: [
            {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
            {text: lan.critical, editor: comboYESNO, allowBlank: true, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNO), this), sortable: false, dataIndex: 'critical', width: 90},
            {text: lan.dimension_name, sortable: true, allowBlank: true, dataIndex: 'dimension_name', minWidth: 250, flex:1, getEditor: setComboDimensionName},
            {text: lan.units, editor: dimUnits, sortable: true, dataIndex: 'metric', renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(dimUnits), this), width: 110},
            {text: lan.dimension, sortable: true, dataIndex: 'dimension', width: 120, getEditor: setCustomField},
            {text: lan.tolerance_pitch, sortable: true, dataIndex: 'tolerance_plus', width: 160, getEditor: setCustomField},
            {text: lan.tolerance_class, sortable: true, dataIndex: 'tolerance_minus', width: 160, getEditor: setCustomField},
            {text: lan.gage, editor: gageEditor, sortable: true, dataIndex: 'tool_gage_id', width: 120, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(gageEditor), this),},
            {xtype:'actioncolumn', width:30, dataIndex: 'set_hidden', items:[{
                                    iconCls: 'delete',
                                    handler:function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        storeDimesionalAttrTable.remove(rec);
                                     }
                                }]
            }
         ]
    });
return dim_attr_table;
}

function getFuncAttrTable(inData){
    var time_id = inData.time_id;
    var readStatus = false;

    storeTestProc.load();
    storeEquipment.load();

    var storeFunctionalAttrTable= new Ext.data.Store({     
        fields: ['id', {name:'critical', type:'int'}, 'value_desc', {name:'metric', type: 'int'}, 'nominal', 'tolerance_plus', 'tolerance_minus', {type: 'int', name: 'equipment_id'}, {type: 'int', name: 'test_procedure_id'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getFuncAttributes=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var comboYESNO = getComboYESNO(readStatus);
    var funcUnits = getFuncUnits(readStatus);

    var setComboValueDesc = function(cell_record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype:'combobox',
                allowBlank: false,
                store: store_value_desc,
                displayField: 'value_desc',
                valueField: 'value_desc',
                queryMode: 'remote',
                minChars:2,
                triggerAction: 'all',
                lazyRender: true,
                enableKeyEvents: true,
                listeners:{
                    beforeselect:function(combo, record, index, eOpts) {
                       var isExist = false;
                       storeFunctionalAttrTable.each(function(rec){
                            if(rec.get('value_desc')==record.get('value_desc')){
                                isExist = true;
                            }
                       });
                       if(isExist){
                            Ext.MessageBox.alert(lan.error, lan.value_desc_already);
                            return false;
                       }              
                    },
                    select:function(){
                        cell_record.set('value_desc', this.getValue());
                        dataSelect(time_id);
                    }
                }
            }
        });
    }

    var setCustomNumb = function(record){
        return Ext.create('Ext.grid.CellEditor', {
            field: {
                xtype: 'textfield',
                enableKeyEvents: true,
                vtype: 'mmValid',
                listeners:{
                    change: function(){
                       var grid = Ext.getCmp('func_attr_table'+time_id);
                       var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                       record.set(lastCol, this.value);
                        dataSelect(time_id);
                    }
                }
            }
        });
    }


var equipmentEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeEquipment,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                	var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                    if(edit_status!=0){
                        var grid_equip = addEquipGrid(time_id, false, true, all_rights['equipment'], false);
                       	var grid_panel = getGridFrame({time_id: time_id, grid_item: grid_equip, element: this, dataIndex:'equipment_id'});
                       	showObject({id: time_id, title: 'Equipment', item: grid_panel});
                    }
                    else {
                        if(record.get('equipment_id')){
                            showWindowDirectory("", 'view', time_id, lan.edit_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, record.get('equipment_id'), true, true);
                        }
                    }
                }
            }
        }
    });	

   var testProcEditor = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        store: storeTestProc,
        displayField: 'value',
        valueField: 'id',
        readOnly: true,
        listeners: {
        	dblclick: {
                element: 'el',
                fn: function(){
                	var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                    if(edit_status!=0){
                        var grid_test_procedure = getTestProcedureGrid(time_id, all_rights['test_procedure']);
                       	var grid_panel = getGridFrame({time_id: time_id, grid_item: grid_test_procedure, element: this, dataIndex:'test_procedure_id'});
                       	showObject({id: time_id, title: 'Test Procedure', item: grid_panel});
                    }
                    else {
                        if(record.get('test_procedure_id')){
                            var inData = {id:time_id, el_id: record.get('test_procedure_id'), edit: true};
                        	showTestProcedure(inData);
                        }
                    }
                }
            }
        }
    });

    var func_attr_table = Ext.create('Ext.grid.Panel', {
    store: storeFunctionalAttrTable,
    id: 'func_attr_table'+time_id,
    title: lan.func_attr_table,
    minHeight: 300,
    anchor: '96%',
    margin: '10 0 0 0',
    border: true,
    selModel: 'cellmodel',
    viewConfig:{
        markDirty:false
    },
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        listeners: {
            beforeedit: function(e, editor){
                var edit_status = Ext.getCmp('grid_control'+time_id).getValue();
                    if(edit_status==0) {
                        return false;
                    }
                
                }
            }
        })],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_new_attr,
            id:'func_add_attr'+time_id,
            //hidden: hideStatus,
            //disabled: disable_edit, //rights rule
            handler: function() {
                storeFunctionalAttrTable.add({'critical':1, 'metric': 1});
                }
            }]
    }],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.critical, editor: comboYESNO, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboYESNO), this), sortable: false, dataIndex: 'critical', width: 90},
        {text: lan.value_desc, sortable: true, dataIndex: 'value_desc', minWidth: 250, flex:1, getEditor:setComboValueDesc},
        {text: lan.units, editor: funcUnits, sortable: true, dataIndex: 'metric', width: 110, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(funcUnits), this)},
        {text: lan.nominal, sortable: true, dataIndex: 'nominal', width: 120, getEditor: setCustomNumb},
        {text: lan.toler_plus, sortable: true, dataIndex: 'tolerance_plus', width: 160, getEditor: setCustomNumb},
        {text: lan.toler_minus, sortable: true, dataIndex: 'tolerance_minus', width: 160, getEditor: setCustomNumb},
        {text: lan.equipment, editor: equipmentEditor, sortable: true, dataIndex: 'equipment_id', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(equipmentEditor), this)},
        {text: lan.test_procedure, editor: testProcEditor, sortable: true, dataIndex: 'test_procedure_id', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(testProcEditor), this)},
        {xtype:'actioncolumn', width:30, dataIndex: 'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeFunctionalAttrTable.remove(rec);
                                }
                            }]
        }
     ]
});

    return func_attr_table;
}

function changeCompType(time_id){
    var comp_id = Ext.getCmp('display_type_'+time_id).up('form').query('[name=comp_id]')[0].getValue();
    Ext.Ajax.request({
        url: 'scripts/ecr_form.php?isUseComponent=true',
        method: 'POST',
        params: {
            comp_id: comp_id
        },
        success: function(response) {
            var JSON = response.responseText;
            if (JSON) {
                var data = Ext.decode(JSON);
                if(data.success){
                    storeCompTypes.filter('id', new RegExp("[124]"));

                    var dialog_win = Ext.create('Ext.panel.Panel', {
                        bodyPadding: 10,
                        items: [{
                            xtype: 'displayfield',
                            width: '100%',
                            value: '<b>Please select component type:</b>'
                        },{
                            xtype: 'combobox',
                            typeAhead: true,
                            triggerAction: 'all',
                            lazyRender:true,
                            name: 'comp_type',
                            store: storeCompTypes,
                            displayField: 'value',
                            valueField: 'id',
                            value :'',
                            width: '100%',
                            editable:false,
                            }],
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            ui: 'footer',
                            items: [{
                                xtype: 'button',
                                text: 'OK',
                                flex: 1,
                                handler: function(){
                                    var comp_type = this.up('panel').query('[name=comp_type]')[0];
                                    if(comp_type.getValue()!=null){
                                        var type_el  = Ext.getCmp('display_type_'+time_id);
                                        type_el.up('form').query('[name=comp_type]')[0].setValue(comp_type.value);
                                        switch(comp_type.value){
                                            case '1':
                                                color = '#008000';
                                            break;
                                            case '2':
                                                color = '#808080';
                                            break;
                                            case '3':
                                                color = '#4169E1';
                                            break;
                                            case '4':
                                                color = '#B0E0E6';
                                            break;
                                        }

                                        var text = '<span style="color:' + color + '; font-size: 25px; display: inline-block; padding: 5px 10px; border: 3px solid '+color+';"><b>' + comp_type.rawValue + '</b></span>';
                                        type_el.setValue(text);
                                        this.up('window').destroy();
                                    }
                                    else {
                                        Ext.MessageBox.alert(lan.error, 'Please select component type.');
                                    }
                                    
                                }
                                },{
                                xtype: 'button',
                                text: 'Cancel',
                                flex: 1,
                                handler: function(){
                                    this.up('window').destroy();
                                }
                                }]
                            }]
                        });
                    showObject({title: 'Select Component Type', item: dialog_win, sizeX: 300, sizeY: 200});
                }
                else {
                    Ext.MessageBox.alert(lan.error, data.message);
                }
            }
        },
        failure: function(response) {
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

function dataSelect(time_id){
    var description = Ext.getCmp('description'+time_id).getValue();
    var material = Ext.getCmp('material'+time_id).getValue();
    var deviation = Ext.getCmp('deviation'+time_id).getValue();
    var division = Ext.getCmp('division'+time_id).getValue();
    
    var params ={};
    if(description) params = $.extend({}, params, {description:description});
    if(material) params = $.extend({}, params, {material:material});
    if(deviation) params = $.extend({}, params, {deviation:deviation});
    if(division) params = $.extend({}, params, {division:division});

    var dim_attr = [];
    var func_attr = [];

    var dim_store = Ext.getCmp('dim_attr_table'+time_id).getStore();
    var func_store = Ext.getCmp('func_attr_table'+time_id).getStore();
    
    if(dim_store.data.length>0){
        dim_store.each(function(record){
            if(record.get('dimension_name')){
                dim_attr.push({'dimension_name': record.get('dimension_name'), 'metric':(record.get('metric'))?record.get('metric'):null, 'dimension': (record.get('dimension'))?record.get('dimension'):null, 'tolerance_plus': (record.get('tolerance_plus'))?record.get('tolerance_plus'):null, 'tolerance_minus': (record.get('tolerance_minus'))?record.get('tolerance_minus'):null});
            }
        });
    }
    
    func_store.each(function(record){
        if(record.get('value_desc')){
                func_attr.push({'value_desc': record.get('value_desc'), 'metric':(record.get('metric'))?record.get('metric'):null, 'nominal': (record.get('nominal'))?record.get('nominal'):null, 'tolerance_plus': (record.get('tolerance_plus'))?record.get('tolerance_plus'):null, 'tolerance_minus': (record.get('tolerance_minus'))?record.get('tolerance_minus'):null});
            }
            
    });

    var params2 ={};
    if(dim_attr.length>0){
        dim_attrJS = JSON.stringify(dim_attr);
        params2 = $.extend({}, params2, {dim_attr: dim_attrJS});
    }

    if(func_attr.length>0){
        func_attrJS = JSON.stringify(func_attr);
        params2 = $.extend({}, params2, {func_attr: func_attrJS});
    }

    if(params2!=null) params = $.extend({}, params,params2);

   Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getDataSelect=true',
            method: 'POST',
            params: params,
            success: function (response){
                if(response) {
                    var data = Ext.decode(response.responseText);
                    var el  = Ext.getCmp('part_number'+time_id);
                    var store = Ext.getCmp('part_number'+time_id).getStore();
                   if(data){
                        store.removeAll();
                        var num = 0;
                        if(data.count){
                            num = data.count;
                        }
                        el.setConfig('fieldLabel',  lan.comp_part_number+' ('+num+'):');
                    }
                    if(data.count>0){
                        var data2 = Ext.decode(data.result);
                        store.loadData(data2);
                    }
               }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });

}

function createPPAP(inData){
    data_store_Responsible.load();
    data_store_users.load();
    var dialog_win = Ext.create('Ext.panel.Panel', {
        bodyPadding: 10,
        items: [{
            xtype:'numberfield',
            fieldLabel: "Please set PPAP Sample Size:",
            labelAlign: 'top',
            name: 'ppap_sample_size',
            minValue: 0,
            maxValue: 30,
            allowExponential: false,
            allowBlank: false,
            allowDecimals: false,
            labelWidth: style.input2.labelWidth,
            width: '100%'
        },
        {
            xtype:'combobox',
            fieldLabel: "Please choose Responsible person:",
            labelAlign: 'top',
            name: 'Responsible',
            queryMode: 'remote',
            allowBlank: false,
            typeAhead: true,
            minChars:2,
            triggerAction: 'all',
            lazyRender: true,
            enableKeyEvents: true,
            labelWidth: style.input2.labelWidth,
            store: data_store_Responsible,
            displayField: 'value',
            valueField: 'id',
            autoSelect: true,
            value:id_user,
            width: '100%',
            validator: function (val) {
                    errMsg = lan.user_not_found;
                return (data_store_users.find('value', val)!=-1) ? true : errMsg;
            }
        },{
            xtype: 'displayfield',
            value: '<b>Attention! <br>If you create PPAP, component status will change to "In Progress" for all BOMs.</b>',
            width: '100%',
            style: {
                textAlign: 'center'
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [{
                xtype: 'button',
                text: 'OK',
                flex: 1,
                handler: function(){
                   if(inData.comp_id){
                        var ppap_sample_size = this.up('panel').query('[name=ppap_sample_size]')[0].getValue();
                        if(!ppap_sample_size){
                            ppap_sample_size =0;
                        }
                        var responsible = this.up('panel').query('[name=Responsible]')[0].getValue();
                        Ext.Ajax.request({
                            url: 'scripts/ecr_form.php?startPPAP=true',
                            method: 'POST',
                            params: {
                                comp_id: inData.comp_id,
                                comp_type: inData.comp_type,
                                ppap_sample_size: ppap_sample_size,
                                responsible: responsible
                            },
                            success: function (response){
                                if(response) {
                                    var data = Ext.decode(response.responseText);
                                    Ext.WindowMgr.each(function(win){
                                        win.destroy();
                                    });
                                   Ext.MessageBox.alert(lan.succ, data.message);
                               }
                            },
                            failure: function (response){ 
                                Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                    }
                    else {
                        Ext.MessageBox.alert(lan.error, 'Component not yet created!');
                    }
                }
                },{
                xtype: 'button',
                text: 'Cancel',
                flex: 1,
                handler: function(){
                    this.up('window').destroy();
                }
                }]
            }]
    });
   showObject({id:inData.time_id, title: 'Create PPAP Test Plan', item: dialog_win, sizeX: 400, sizeY: 300});
}

function getComponentItem(time_id) {
	var component_item = [{
            xtype: 'container',
            layout: 'anchor',
            items: [
            {
                xtype:'displayfield',
                value: "<span style='color:#4169E1; font-size: 20px;'><b>COMPONENT CREATION TASKS:</b></span>"
            },{
                xtype: 'container',
                anchor:'96%',
                items: [
                    {
                        xtype: 'container',
                        id: 'tasks_container'+time_id,                       
                        items: null
                    },{
		                xtype: 'container',
		                anchor:'96%',
		                layout: {
		                    type: 'hbox',
		                },
		                items: [{
		                    xtype:'displayfield',
		                    name:"",
		                    flex: 2
		                },{
		                    xtype: 'button',
		                    text : 'Add Next Task',
		                    margin: '0 0 5 0',
		                    flex: 1,
		                    handler: function() {
		                    	Ext.getCmp('tasks_container'+time_id).add(getTaskBlock(time_id));  
		                    }
		                }]
                   }
                   
                ]
            }]
        }];
    return component_item;
}

function getTaskBlock(time_id) {
	var task_block = {
		xtype: 'fieldset',
        title: 'CREATE COMPONENT: ',
        layout: 'anchor',
        border: 2,
        anchor: '96%', 
        items:[{
            xtype: 'container',
            anchor:'100%',
            layout: 'hbox',
            margin: '0 0 5 0',
            items:[{
            	xtype:'textfield',
                fieldLabel:'Part Number',
                labelAlign: 'top',
                name: 'comp_part_number',
                margin: '0 5px',
                flex:1
            },{
		        xtype: 'combobox',
		        fieldLabel:'TYPE',
                labelAlign: 'top',
		        typeAhead: true,
		        triggerAction: 'all',
		        lazyRender:true,
		        name: 'comp_type',
		        store: storeCompTypes,
		        displayField: 'value',
		        valueField: 'id',
		        margin: '0 5px',
		        value :'',
		        flex:1,
		        listeners: {
		        	change: function(){
		        		var el = this.up('fieldset').query('[name=comp_status]')[0];
		        		if(this.getValue()==3||this.getValue()==4){
		        			el.setConfig('hidden', true);
		        			el.setValue(1);
		        		}
		        		else {
		        			el.setConfig('hidden', false);
		        			el.setValue();
		        		}
		        	}
		        }
		    },{
                xtype:'combobox',
                fieldLabel: 'Status:',
                labelAlign: 'top',
                name: 'comp_status',
                labelWidth: style.input2.labelWidth,
                store: storeCompStatuses,
                displayField: 'value',
                valueField: 'id',
                margin: '0 0 0 10px',
                readOnly:true,
                minWidth: 100,
                flex:1,
                listeners: {
                    change: function(){
                        var copm_status = this.getValue();
                        var color_bg = "";
                        switch(copm_status){
                            case 0:
                                color_bg = "#808080";
                            break;
                            case 1:
                                color_bg = "#008000";
                            break;
                            case 2:
                                color_bg = "#CD5C5C";
                            break;
                            case 3:
                                color_bg = "#4169E1";
                            break;
                            default:
                            	color_bg = "#FFF";
                            break;
                        }
                        this.setConfig("fieldStyle", "text-align: center; color:#FFF; background: "+color_bg+";");
                    }
                }
            },{
                xtype:'combobox',
                fieldLabel: 'Created:',
                labelAlign: 'top',
                name: 'comp_task_status',
                store: data_store_YESNO,
                displayField: 'value',
                valueField: 'id',
                margin: '0 0 0 10px',
                readOnly:true,
                minWidth: 100,
                flex:1,
                listeners: {
                    change: function(){
                        var comp_task_status = this.getValue();
                        var color_bg = "";
                        switch(comp_task_status){
                            case 1:
                                color_bg = "#008000";
                            break;
                            default:
                            	color_bg = "#4169E1";
                            break;
                        }
                        this.setConfig("fieldStyle", "text-align: center; color:#FFF; background: "+color_bg+";");
                        this.up('fieldset').query('[cls=comp_del_btn]')[0].setDisabled(true);
                    	this.up('fieldset').query('[cls=create_comp_btn]')[0].setDisabled(true);
                    }
                }
            },{
	        	xtype: 'displayfield',
	        	margin: '18px 5px 0 10px',
	        	name: 'comp_img',
	        	width: 32,
	        	renderer: function (value, field) {
                    return (!value)?'':'<img style="height: 32px; width: 32px;" src="./img/k-view-icon.png" onclick=showCompImg("'+value+'")>';
                }
	        }]
        },{
        	xtype: 'textareafield',
        	fieldLabel: 'Description',
        	labelAlign: 'top',
            name: 'task_description',
            anchor:'100%',
        },{
        	xtype: 'hidden',
        	name: 'comp_id',
        	listeners: {
        		change: function(){
        			if(this.getValue()&&this.getValue()!=""){
        				this.up('fieldset').query('[name=comp_type]')[0].setConfig('readOnly', true);
        			}
        		}
        	}
        },{
            xtype: 'container',
            anchor:'100%',
            layout: 'hbox',
            margin: '0 0 5 0',
            items:[{
            	xtype: 'button',
	            text : 'Create Comp',
	            margin: '0 0 5 0',
	            minwidth: 150,
                cls: 'create_comp_btn',
	            flex: 1,
	            handler: function() {
	            	var title = 'Create New Component';
	            	var back_object = this.up('fieldset');
	            	var comp_type = back_object.query('[name=comp_type]')[0];

	            	if(comp_type.value){
	            		if(comp_type.value==3) title = "Create New KIT";
                    	var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type.value, name: comp_type.rawValue}, action: 'add', case_type: 'task', back_object: back_object});
                    	showObject({id:time_id, title: title, item: comp_form, sizeX: '100%', sizeY: '100%'});
	            	}
                   else {
                   		Ext.MessageBox.alert(lan.error, 'Please select component type.');
                   }
	            }	
	        },
	        {
	        	xtype: 'splitter'
	        },{
	        	xtype: 'button',
	            text : 'View/Edit Comp',
	            margin: '0 0 5 0',
	            minwidth: 150,
                cls: 'view_edit_comp',
	            flex: 1,
	            handler: function() {
                    var comp_id = this.up('fieldset').query('[name=comp_id]')[0].getValue();
                    if(comp_id){
                    var back_object = null;
                    var action = 'view';

                    var fields = Ext.getCmp('time_id'+time_id).up('form').getForm().getFields();
                    var edit_status = getValueByName(fields, 'draft');

                    var comp_type = this.up('fieldset').query('[name=comp_type]')[0].getValue();
                    var comp_type_name = "";
                    storeCompTypes.each(function(record){
                        if(record.get('id')==comp_type){
                            comp_type_name = record.get('value');
                        }
                    });

                    if(edit_status==1){
                        back_object = this.up('fieldset');
                        action = 'edit';
                    }

                        var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type, name: comp_type_name}, action: action, case_type: 'task', comp_id:comp_id, back_object: back_object});
                        showObject({id:time_id, title: 'View/Edit Component', item: comp_form, sizeX: '100%', sizeY: '100%'});
	            	}
	            }	
	        },
	        {
	        	xtype: 'splitter'
	        },
	        {
	        	xtype: 'button',
	            text : 'Delete Task',
	            cls: 'comp_del_btn',
	            margin: '0 0 5 0',
	            minwidth: 150,
	            flex: 1,
	            handler: function() {
	            	var el = this.up('fieldset');
	            	Ext.getCmp('tasks_container'+time_id).remove(el);
	            }	
	        }]
    	}]
	};
	return task_block;
}

function showCompImg(val){
    showImage('Component', val);
}

function getPPAPResults(inData){
    var time_id = inData.time_id;

    var setResultType = function (value, metaData, record, rowIndex, colIndex, store, view) {
      switch(Number(value)){
        case 1:
            metaData.tdCls = 'green_bg';
            value = '<b>Approved</b>';
        break;
        case 2:
            metaData.tdCls = 'red_bg';
            value = '<b>Rejected</b>';
        break;
        default:
            metaData.tdCls = '';
            value = 'N/A';
        break;
      }
    return value
};

    var previous_ppaps_store =  new Ext.data.Store({
            fields: ['idx', 'task_id', 'task_type_name', 'task_type', 'request_id', `requested_date`, `responsible`, `assigned_to`, `completion_date`, `ppap_result`],
    });

    var previous_ppaps =  Ext.create('Ext.grid.Panel', {
        store: previous_ppaps_store,
        title: 'PPAP Results:',
        minHeight: 300,
        id: 'ppap_results_'+time_id,
        anchor: '96%',
        margin: '10 0 0 0',
        autoScroll: true,
        hidden: true,
        border: true,
        viewConfig:{
            markDirty:false
        },
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        columns: [
            {xtype: 'rownumberer',width: 40, sortable: false, hideable: false},
            {text: 'RequestID:', sortable: false, dataIndex: 'request_id', width: 150},
            {text: 'Requested Date', sortable: false, dataIndex: 'requested_date', width: 150},
            {text: 'Completed Date', sortable: true, dataIndex: 'completion_date', width: 150},
            {text: 'Responsible', sortable: true, dataIndex: 'responsible', minWidth: 150, flex:1},
            {text: 'Assigned To', sortable: true, dataIndex: 'assigned_to', minWidth: 150, flex:1},
            {text: 'PPAP Result', sortable: true, dataIndex: 'ppap_result', width: 150, renderer: setResultType}],
        listeners: {
           celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts){
                if (record) {
                    var id_task = task_names[record.get('task_type')];  
                    tabs.items.each(function(item){
                        if(item){
                            if(item.id == 'tab'+id_task){
                                tabs.remove(item);
                            }
                        }
                    });
                    var inData = {task_id:id_task, id_row: record.get('task_id'), rights: all_rights[id_task]};
                    var form = addForm(inData); //rights rule
                    showObject({id:time_id, title: record.get('task_type_name'), item: form, sizeX: '90%', sizeY: '90%'});
                }
            }
        }
    });

    return previous_ppaps;
}