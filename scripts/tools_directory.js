var actionToolGage = getActionColumnDir('drawing2d');
var documentGridStoreTool =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

var storeToolNumbers = new Ext.data.Store({
        fields: ['id','number'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getToolNumbers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

function setFilters(time_id){
        var tool = Ext.getCmp('tool_id'+time_id).getValue();
        var gage = Ext.getCmp('gage_id'+time_id).getValue();

    if(tool==1 && gage ==0) Ext.getCmp('tool_gage'+time_id).getStore().filter('tool_gage_type', 0);
        else if(tool ==1 && gage ==1) Ext.getCmp('tool_gage'+time_id).getStore().filter('tool_gage_type', new RegExp("[01]"));
            else if(tool==0&&gage==1) Ext.getCmp('tool_gage'+time_id).getStore().filter('tool_gage_type', 1);
                else Ext.getCmp('tool_gage'+time_id).getStore().filter('tool_gage_type', new RegExp("[01]"));
}
                          

function showWindowDirectory(filter, action, time_id, title, directory_name, storeImage, storeDocs, id_item=null, view, add_ab=true){
    storeImage.removeAll();
    storeDocs.removeAll();
    var dir = "";
    if(directory_name == 'tool_gage') {
        dir = 'Tool';
        }
        else if(directory_name == 'equip') dir = 'Equip';
            else if(directory_name == 'work_st') dir = 'WorkSt';
    if(!winEx){
        if(directory_name=="tool_gage") items =  getFormTool(time_id, view);
            else if (directory_name=="equip") items =  getFormEquip(time_id, view);
                else if (directory_name=="work_st") items =  getFormWorkSt(time_id, view);
        var form_dir = new Ext.create('Ext.form.Panel', {autoScroll: true, items: items});
        
        if(filter=='tool'){
            Ext.getCmp('tool_gage_type'+time_id).setValue(0);
            Ext.getCmp('tool_gage_type'+time_id).setConfig('readOnly', true);
            }
            else if(filter=='gage'){
                Ext.getCmp('tool_gage_type'+time_id).setValue(1);
                Ext.getCmp('tool_gage_type'+time_id).setConfig('readOnly', true);
            }
        if(id_item){
            Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getDirectory'+directory_name+'=true',
            method: 'POST',
            params: {
                 id: id_item
                },
            success: function (response){
                if(response) {
                    var data = Ext.decode(response.responseText);
                    if(data.rows!=null){
                        Ext.getCmp('id'+time_id).setValue(data.rows[0].id);
                        Ext.getCmp('number'+time_id).setValue(data.rows[0].number);
                        if(action=='edit') {
                            Ext.getCmp('number'+time_id).setConfig('readOnly', true);
                        }

                        Ext.getCmp('name'+time_id).setValue(data.rows[0].name);

                        if(directory_name=='tool_gage'){
                            Ext.getCmp('tool_gage_type'+time_id).setValue(data.rows[0].tool_gage_type);
                            if(action=='edit') {
                                Ext.getCmp('tool_gage_type'+time_id).setConfig('readOnly', true);
                            }
                        } 
                        
                        Ext.getCmp('descriptionDir'+time_id).setValue(data.rows[0].description);
                        Ext.getCmp('life_time'+time_id).setValue(data.rows[0].life_time);
                        Ext.getCmp('pending_design'+time_id).setValue(data.rows[0].pending_design);
                        Ext.getCmp('estimated_unit_price'+time_id).setValue(data.rows[0].estimated_unit_price);
                        if(data.rows[0].alternative_id != 0 && data.rows[0].alternative_id != null) {
                            Ext.getCmp('alternative_id'+time_id).setConfig("hidden", false);
                            Ext.getCmp('alternative_id'+time_id).setValue(data.rows[0].alternative_id);
                        }
                        if(data.rows[0].request_number != 0 && data.rows[0].request_number != null) {
                            Ext.getCmp('request_number'+time_id).setConfig("hidden", false);
                            Ext.getCmp('request_number'+time_id).setValue(data.rows[0].request_number);
                        }
                        if(data.rows[0].approved){
                            var approved = data.rows[0].approved;
                            Ext.getCmp('approved'+time_id).setValue(approved);
                            if(approved=='Rejected'||approved=='Approved'){
                                var fields = form_dir.getForm().getFields();
                                fields.each(function(item){
                                    item.setConfig('readOnly',true);
                                });
                                Ext.getCmp('drawing2d'+dir+time_id).disable();
                                Ext.getCmp('drawing3d'+dir+time_id).disable();
                                Ext.getCmp('add_imageform'+dir+time_id).disable();
                                Ext.getCmp('delete'+dir+time_id).disable();
                                Ext.getCmp('fileform'+dir+time_id).disable();
                                Ext.getCmp('save'+time_id).disable();
                                setColumnHidden('doc_grid'+dir+time_id);
                            }
                        }
                        else {
                            Ext.getCmp('approved'+time_id).setValue('New');
                        }
                        

                        if(data.rows[0].drawing2d){
                            Ext.getCmp('2DImage'+dir).up('form').setBodyStyle('background:#fff');
                            Ext.getCmp('2DImage'+dir).setSrc('img/components/'+data.rows[0].drawing2d);
                        }
                        if(data.rows[0].drawing3d){
                           Ext.getCmp('3DImage'+dir).up('form').setBodyStyle('background:#fff');
                            Ext.getCmp('3DImage'+dir).setSrc('img/components/'+data.rows[0].drawing3d);
                        }
                        if(data.rows[0].addImages){
                            storeImage.loadData(Ext.decode(data.rows[0].addImages));
                        }
                        if(data.rows[0].add_spec){
                            storeDocs.loadData(Ext.decode(data.rows[0].add_spec));
                        }
                    }
                    else return;
               }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
        }
        winEx = new Ext.Window({
            width: '100%',
            height: '100%',
            title: title,
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
            closable: true,
            modal: true,
            constrainHeader: true,
            buttons: [{
                text:lan.save,
                iconCls:'save',
                id: 'save'+time_id,
                hidden: view,
                handler:function(){
                    var form = form_dir.getForm();
                    saveDirectory(form, directory_name, storeImage, storeDocs, time_id, action);
                    }
                },
            {
            text:lan.cancel,
            iconCls: 'cancel',
            hidden: view,
            handler:function(){
                winEx.destroy();        
            }
            },{
            text: lan.add_to_table,
            hidden: add_ab,
            handler:function(){
                if(Ext.getCmp("toolGageTy" + time_id)) { //для реквестов
                    if(Ext.getCmp("toolGageTy" + time_id).up("form").up().id == "tabtooling_request" || Ext.getCmp("toolGageTy" + time_id).up("form").up().id == "tabequipment_request" || Ext.getCmp("toolGageTy" + time_id).up("form").up().id == "tabworkstation_request") Ext.getCmp("altVar"+time_id).setValue(Ext.getCmp('id'+time_id).getValue());
                }
                else {
                    var id = Ext.getCmp('id'+time_id).getValue();
                    var number = Ext.getCmp('number'+time_id).getValue();
                    var name = Ext.getCmp('name'+time_id).getValue();
                    var description = Ext.getCmp('descriptionDir'+time_id).getValue();
                    var life_time = Ext.getCmp('life_time'+time_id).getValue();
                    var pending_design = Ext.getCmp('pending_design'+time_id).getValue();
                    var estimated_unit_price = Ext.getCmp('estimated_unit_price'+time_id).getValue();
                    var approved = Ext.getCmp('approved'+time_id).getValue();
                    var temp_approved;
                    switch(approved){
                        case "Approved":
                            temp_approved = 1;
                        break
                        case "Rejected":
                            temp_approved = 2;
                        break
                        default:
                            temp_approved = 0;
                        break
                    }
                    approved = temp_approved;

                    if(directory_name=='tool_gage') {
                        var type = Ext.getCmp('tool_gage_type'+time_id).getValue();
                        var storeGridTool = Ext.getCmp('GridTools'+time_id).getStore();

                        if(type==0) {
                            var isExists = false;
                            storeGridTool.each(function(record){
                                if(record.get('tool_id')==id) {
                                    isExists = true;
                                    Ext.MessageBox.alert(lan.error, lan.tool_already);
                                }
                            });
                            if(isExists===false){
                               storeGridTool.add({tool_id:id, number: number, needs:name, description: description, life_time:life_time, pending_design: pending_design, estimated_unit_price:estimated_unit_price, approved: approved}); 
                               searchOperation(time_id);
                           } 
                        }
                            else {
                                var isExists = false;
                            var storeGridGage = Ext.getCmp('GridGage'+time_id).getStore();
                            storeGridGage.each(function(record){
                                if(record.get('gage_id')==id) {
                                    isExists = true;
                                     Ext.MessageBox.alert(lan.error, lan.gage_already);
                                }
                            });
                            if(isExists===false){
                                storeGridGage.add({gage_id:id, number: number, needs:name, description: description, life_time:life_time, pending_design: pending_design, estimated_unit_price:estimated_unit_price, approved: approved});
                                searchOperation(time_id);
                                } 
                            }
                    }

                    if(directory_name == 'equip') {
                        var isExists = false;
                        var storeGridEquipment = Ext.getCmp('GridEquipment'+time_id).getStore();
                            storeGridEquipment.each(function(record){
                                if(record.get('equipment_id')==id) {
                                    isExists = true;
                                    Ext.MessageBox.alert(lan.error, lan.equip_already);
                                }
                            });
                            if(isExists===false){
                                storeGridEquipment.add({equipment_id:id, number: number, needs:name, description: description, life_time:life_time, pending_design: pending_design, estimated_unit_price:estimated_unit_price, approved: approved});
                                searchOperation(time_id);
                            } 
                    }

                    if(directory_name == 'work_st') {
                        var storeGridWorkstation = Ext.getCmp('GridWorkstation'+time_id).getStore();
                        var isExists = false;
                            storeGridWorkstation.each(function(record){
                                if(record.get('workstation_id')==id) {
                                    isExists = true;
                                    Ext.MessageBox.alert(lan.error, lan.work_already);
                                }
                            });
                            if(isExists===false){
                                storeGridWorkstation.add({workstation_id:id, number: number, needs:name, description: description, life_time:life_time, pending_design: pending_design, estimated_unit_price:estimated_unit_price, approved: approved});
                                searchOperation(time_id);
                            } 
                    }
                }

               winEx.destroy();
               if(WindowProcess)WindowProcess.destroy();
            }
            }],
            listeners: {
                destroy: function(){
                    winEx = null;
                }
            },
            items:form_dir
           });
        winEx.show();
    }
}  

    Ext.apply(Ext.data.SortTypes, {
        asLower: function (str) {
            return str.toLowerCase();
        }
    });     
    
 var storeToolGageGrid = new Ext.data.Store({
        //autoLoad: true,
        //pageSize: 25,
        //remoteSort: true,
        fields: ['id', {type: 'string', name: 'number', sortType: 'asLower'}, {type: 'string', name: 'name', sortType: 'asLower'}, {type: 'string', name: 'description', sortType: 'asLower'}, 'drawing2d', 'tool_gage'],
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=tool_gage',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
            simpleSortMode: true
        },
    });

Ext.define('Image', {
    extend: 'Ext.data.Model',
    fields: [
        { name:'src', type:'string' },
        { name:'caption', type:'string' }
    ]
});

var imagesStoreTool = Ext.create('Ext.data.Store', {
    model: 'Image',
});

var imageTplTool = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="uploadStyle">',
            '<div class="caption_title">{caption}</div>',
            '<img src="{src}" style="max-height:90%; max-width:95%;"/>',
        '</div>',
    '</tpl>'
);
var winEx= null;

function saveDirectory(form, directory_name, storeImage, storeDocs,time_id, action){
    var msg ='';
    var result;
    var option=true;
    var fields = form.getFields();
    var ImagesArr = [];
    var DocArr = [];

    var dir = "";
    var number = Ext.getCmp('number'+time_id).getValue();
    if(directory_name == 'tool_gage') {
            if(storeToolNumbers.find('number', number)!=-1&&action=='add') {
                Ext.MessageBox.alert(lan.savingErr, lan.t_g_same_numb_already);
                option= false;
                return false;
            }
            dir = 'Tool';
        }
        else if(directory_name == 'equip') {
            if(storeEquipNumbers.find('number', number)!=-1&&action=='add') {
                Ext.MessageBox.alert(lan.savingErr, lan.equip_same_numb_already);
                option= false;
                return false;
            }
            dir = 'Equip';
            }
            else if(directory_name == 'work_st') {
                if(storeWorkStNumbers.find('number', number)!=-1&&action=='add') {
                Ext.MessageBox.alert(lan.savingErr, lan.work_same_numb_already);
                option= false;
                return false;
            }
                dir = 'WorkSt';
            }

	storeImage.each(function(record){
        ImagesArr.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
    });

    storeDocs.each(function(record){
        DocArr.push({'id': record.get('id'),'descr_spec': record.get('descr_spec'), 'add_spec': record.get('add_spec')});
    });
	
	ImagesJS = JSON.stringify(ImagesArr);
    DocJS = JSON.stringify(DocArr);
	
    var params2 = {
		'addImages':ImagesJS,
		'add_spec': DocJS
	};

    var drawing2d_src=getImageName(Ext.getCmp('2DImage'+dir).src);
    /*var extn = drawing2d_src.split('.').pop();
    if((extn!='png') && (extn!='jpg') && (extn!='bmp') && (extn!='gif')){
        Ext.MessageBox.alert(lan.savingErr, 'Please upload 2D Image!');
        option= false;
        return false;
    }*/
	


    if(form.isValid()&&option) {
    	fields.each(function(item){
    		if(item.getName()=='drawing2d'||item.getName()=='drawing3d'||item.getName()=='draft') fields.remove(item);
    	});
        var params = {drawing2d:drawing2d_src, drawing3d:getImageName(Ext.getCmp('3DImage'+dir).src)};
            params = $.extend({}, params,params2);
        form.submit({
            url: 'scripts/ecr_form.php?'+directory_name+'=true&action='+action,
            waitMsg: lan.saving,
            wait: true,
            scope: this,
            method: 'post',
            params: params,
            success: function(form, action) {
                var data = Ext.decode(action.response.responseText);
                Ext.MessageBox.alert(lan.succ, data.message);
                if(winEx !=null) winEx.destroy();
                if(directory_name=='tool_gage') storeToolGageGrid.load();
                    else if(directory_name=='equip') storeEquipGrid.load();
                        else if(directory_name=='work_st') storeWorkStGrid.load();

            },
            failure: function(form, action) {
                var data = Ext.decode(action.response.responseText);
                Ext.MessageBox.alert(lan.savingErr, data.message);
                return false;
            }
        });
    } else {
        Ext.MessageBox.alert(lan.savingErr, lan.not_filled);
    }
}

function addToolGageGrid(time_id, view, filter=null, add_ab=true, rights, viewAdd){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }    

    storeToolGageGrid.load();
    storeToolGageGrid.clearFilter(true);
    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.t_g_id, dataIndex: 'number', sortable: true, hideable: false, width: 170},
        {text: lan.tool_gage, dataIndex: 'tool_gage_type', sortable: true, hideable: false, width: 130, renderer: setToolGageType},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, width: 200},
        {text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
        {text: lan.two_d, xtype:'actioncolumn',dataIndex: 'drawing2d',width:150,sortable:false, items:[actionToolGage]},
    ];


 var PagingToolbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storeToolGageGrid,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'tool_gage'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeToolGageGrid,
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
                        id: "add"+time_id,
                        disabled: disable_add,//rights rule
                        hidden: viewAdd,
                        handler: function() {
							showWindowDirectory(filter, 'add', time_id, lan.create_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool);
						}
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        disabled: disable_edit,//rights rule
                        hidden: view,
                        handler: function() {
                           var select = Ext.getCmp('tool_gage'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", 'edit', time_id, lan.edit_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool, select.get('id'));
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        disabled: disable_delete,//rights rule
                        hidden: view,
                        handler: function() {
                           var select = Ext.getCmp('tool_gage'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?delToolGage=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp('tool_gage'+time_id).store.load();
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
                        text: lan.view,
                        iconCls: 'showpic',
                        hidden: !view,
                        handler: function() {
                            if(disable_edit){//rights rule
                                view = true;
                            }
                           var select = Ext.getCmp('tool_gage'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", '', time_id, lan.view_t_g, 'tool_gage', imagesStoreTool, documentGridStoreTool, select.get('id'),view, add_ab);
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
                    listeners: {
                        change: function() {
                            storeToolGageGrid.load({
                                params: {search: this.value}
                            });
                            storeToolGageGrid.getProxy().url = 'scripts/datastore.php?func=tool_gage&search=' + this.value;
                            storeToolGageGrid.load();
                        }
                    }
                },{
                    xtype: 'checkbox',
                    boxLabel  : lan.tool,
                    name      : 'tool',
                    inputValue: 1,
                    disabled: view,
                    id        : 'tool_id'+time_id,
                    listeners: {
                        afterrender: function(){
                            if(filter=='tool') this.setValue(1);
                        },
                        change: function(){
                            setFilters(time_id, filter);
                        }
                    }
                }, {
                    xtype: 'splitter'
                },{
                    xtype: 'checkbox',
                    boxLabel  : lan.gage,
                    name      : 'gage',
                    disabled: view,
                    inputValue: 1,
                    //margin: '0 0 0 10',
                    id        : 'gage_id'+time_id,
                    listeners: {
                        afterrender: function(){
                            if(filter=='gage') this.setValue(1);
                        },
                        change: function(){
                            setFilters(time_id, filter);
                        }
                    }
                }]
            }
        ],
        bbar: [PagingToolbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                var titleWin = "";
                if(add_ab==false){
                    titleWin = lan.view_t_g;
                } 
                else {
                    if(disable_edit){//rights rule
                        view = true;
                    }
                    titleWin = lan.edit_t_g;
                } 
                showWindowDirectory("", 'edit', time_id, titleWin, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('id'), view, add_ab);
            }
        }
    }
    return grid;
}


function getFormTool(time_id, view=false){
    storeToolNumbers.load();
    storeRequestTool.load();
	var formUpload2DImageTool = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: lan.two_d,
        frame: true,
        margin: '5',
        minWidth: 250,
        flex:1,
        height: 250,
        bodyStyle: "background-image:url(img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'2DImageTool'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage("Image", src);
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
            id:'drawing2dTool'+time_id,
            hidden: view,
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
                        if(form.isValid()){
                            form.submit({
                                url: 'scripts/ecr_form.php',
                                waitMsg: lan.upload_mess,
                                params: {"addImage":'true'},
                                success: function(fp, o) {
                                    formUpload2DImageTool.setBodyStyle('background:#fff');
                                    Ext.getCmp('2DImageTool').setSrc('img/components/'+o.result.message);
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
        bodyStyle: "background-image:url(img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            src: '',
            height: 240,
            width: 240,
            imgCls: 'ImageGalery',
            id:'3DImageTool'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage("Image", src);
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
            id:'drawing3dTool'+time_id,
            hidden: view,
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
                        if(form.isValid()){
                            form.submit({
                                url: 'scripts/ecr_form.php',
                                waitMsg: lan.upload_mess,
                                params: {"addImage":'true'},
                                success: function(fp, o) {
                                    formUpload3DImageTool.setBodyStyle('background:#fff');
                                    Ext.getCmp('3DImageTool').setSrc('img/components/'+o.result.message);
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
    store: imagesStoreTool,
    id: 'UploadFormTool'+time_id,
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
        id: 'fileUploadFormTool'+time_id,
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
            name: 'add_imageform',
            msgTarget: 'side',
            buttonText: lan.add_addit_images,
            id:'add_imageformTool'+time_id,
            hidden: view,
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
                                var form = Ext.getCmp('fileUploadFormTool'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_mess,
                                        params: {"addImage":'true'},
                                        success: function(fp, o) {
                                            imagesStoreTool.add({id: imagesStoreTool.data.length+1, src: 'img/components/'+o.result.message, caption:  text});
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
            hidden: view,
            id:'deleteTool'+time_id,
            maxWidth: 100,
            flex:1,
            handler : function() {
                var select = itemsUploadFormTool.getSelectionModel().selected.items[0];
                if(select){
                    select = select.id;
                    imagesStoreTool.each(function(record){
                        if(record.get('id')==select) imagesStoreTool.remove(record);
                    });
                }
                else{
                    Ext.MessageBox.alert(lan.error, lan.select_image);
                }
            }
        }]
        },itemsUploadFormTool]
});

var ImageUploadFormTool = Ext.create('Ext.form.Panel', {
        title: lan.images,
        id: 'ImageUploadFormTool'+time_id,
        margin: '0 0 0 10',
        //hidden: hideStatus,
        bodyPadding: 10,
        frame: false,
        items:[{
                xtype: 'container',
                //anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [formUpload2DImageTool, formUpload3DImageTool]
        }, fileUploadFormTool]
});

var downloadLink = getActionLink('add_spec');

var DocUploadFormTool = Ext.create('Ext.form.Panel', {
        title: lan.documentstext,
        id: 'DocUploadFormTool'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_gridTool'+time_id,
            border: true,
            hidden: false,
            store: documentGridStoreTool,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    id: 'fileformTool'+time_id,
                    name: 'fileform',
                    msgTarget: 'side',
                    anchor: '100%',
                    buttonText: lan.add_file,
                    hidden: view,
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
                                var form = Ext.getCmp('DocUploadFormTool'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_file,
                                        params: {"addFile":'true'},
                                        success: function(fp, o) {
                                            //console.log(o.result.message);
                                            documentGridStoreTool.add({id: documentGridStoreTool.data.length+1, descr_spec: text, add_spec: o.result.message});
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
                    dataIndex:'set_hidden',
                    width:40,
                    hidden: view,
                    items:[{
                        iconCls:'delete',
                        handler:function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            documentGridStoreTool.remove(rec);
                        }
                    }]
                }]
        }]
});

var item_form_tool = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [
            {
                xtype:'textfield',
                name: 'id',
                id: 'id'+time_id,
                hidden: true
            },{
                xtype:'displayfield',
                name:"approved",
                margin: '0 45%',
                id: 'approved'+time_id,
                value: 'New',
                renderer: function (value, field) {
                    var color = 'blue';
                    if(value=='Approved'){
                        color = 'green'
                    }
                    else if(value=='Rejected'){
                        color = 'red'
                    }
                    return '<span style="color:' + color + '; font-size: 25px; display: inline-block; padding: 5px 10px; border: 3px solid '+color+';"><b>' + value + '</b></span>';
                }
            },
            {
                xtype:'combobox',
                fieldLabel: lan.change_to,
                name: 'alternative_id',
                id: 'alternative_id'+time_id,
                labelWidth: style.input2.labelWidth,
                anchor:'50%',
                margin: '10 0 0 0',
                store: storeRequestTool,
                displayField: 'name',
                valueField: 'id',
                hidden: true
            },
            {
                xtype:'textfield',
                fieldLabel: lan.request_numb,
                labelAlign: 'top',
                name: 'request_number',
                id: 'request_number'+time_id,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                margin: '10 0 0 0',
                readOnly: true,
                hidden: true
            },
            {
                xtype:'combobox',
                fieldLabel: lan.tool_gage,
                labelAlign: 'top',
                name: 'tool_gage_type',
                id: 'tool_gage_type'+time_id,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                store: storeToolGage,
                displayField: 'value',
                valueField: 'id',
                editable: false,
                readOnly: view,
                value: 0 
            },{
                xtype:'textfield',
                fieldLabel: lan.t_g_id+':',
                labelAlign: 'top',
                name: 'number',
                id: 'number'+time_id,
                //allowBlank: false,
                labelWidth: style.input2.labelWidth,
                anchor:'96%',
                readOnly: view,
                //vtype: 'idValid'
            },
            {
                xtype:'textfield',
                fieldLabel: lan.name,
                labelAlign: 'top',
                name: 'name',
                id: 'name'+time_id,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
                readOnly: view,
                anchor:'96%',
                vtype: 'nameValid'
            },
            {
                xtype:'textareafield',
                fieldLabel: lan.description,
                labelAlign: 'top',
                name: 'description',
                id: 'descriptionDir'+time_id,
                allowBlank: true,
                labelWidth: style.input2.labelWidth,
                readOnly: view,
                anchor:'96%',
            },
            {
                xtype:'numberfield',
                fieldLabel: lan.est_life_time,
                labelAlign: 'top',
                name: 'life_time',
                id: 'life_time'+time_id,
                minValue: 0,
                allowExponential: false,
                mouseWheelEnabled: false,
                labelWidth: style.input2.labelWidth,
                readOnly: view,
                anchor:'96%',
            },
            {   
                xtype:'numberfield',
                fieldLabel: lan.est_unit_price,
                labelAlign: 'top',
                name: 'estimated_unit_price',
                id: 'estimated_unit_price'+time_id,
                minValue: 0,
                allowExponential: false,
                mouseWheelEnabled: false,
                labelWidth: style.input2.labelWidth,
                readOnly: view,
                anchor:'96%',
            },
                {
                    xtype:'combobox',
                    fieldLabel: lan.pending_des,
                    labelAlign: 'top',
                    name: 'pending_design',
                    id: 'pending_design'+time_id,
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    store: data_store_YESNO,
                    displayField: 'value',
                    valueField: 'id',
                    value :'1',                  
                    editable:false,
                    hidden: true,
                    anchor:'96%',
                }, ImageUploadFormTool, DocUploadFormTool]
}];
	return item_form_tool;
}







