var actionWorkSt = getActionColumnDir('drawing2d');
var documentGridStoreWorkSt =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

var storeWorkStNumbers = new Ext.data.Store({
        fields: ['id','number'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getWorkStNumbers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

Ext.apply(Ext.data.SortTypes, {
    asLower: function (str) {
        return str.toLowerCase();
    }
});

 var storeWorkStGrid = new Ext.data.Store({
        //autoLoad: true,
        //pageSize: 25,
        //remoteSort: true,
        fields: ['id', {type: 'string', name: 'name', sortType: 'asLower'}, {type: 'string', name: 'description', sortType: 'asLower'}, 'drawing2d', {type: 'string', name: 'number', sortType: 'asLower'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=work_st',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
            simpleSortMode: true
        }
    });

var imagesStoreWorkSt = Ext.create('Ext.data.Store', {
    model: 'Image',
});

var imageTplWorkSt = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="uploadStyle">',
            '<div class="caption_title">{caption}</div>',
            '<img src="{src}" style="max-height:90%; max-width:95%;"/>',
        '</div>',
    '</tpl>'
);


function addWorkStGrid(time_id, view, add_ab=true, rights, viewAdd){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    storeWorkStGrid.load();

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.work_id, dataIndex: 'number', sortable: true, hideable: false, width: 170},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, width: 200},
        {text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
        {text: lan.two_d, xtype:'actioncolumn',dataIndex: 'drawing2d',width:150,sortable:false, items:[actionWorkSt]},
    ];


 var PagingWorkStbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storeWorkStGrid,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'work_st'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeWorkStGrid,
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
                            showWindowDirectory("", 'add', time_id, lan.work_create, 'work_st', imagesStoreWorkSt, documentGridStoreWorkSt);
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        disabled: disable_edit,//rights rule
                        hidden: view,
                        handler: function() {
                           var select = Ext.getCmp('work_st'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", 'edit', time_id, lan.work_edit, 'work_st', imagesStoreWorkSt, documentGridStoreWorkSt, select.get('id'));
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
                           var select = Ext.getCmp('work_st'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?delWorkSt=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp('work_st'+time_id).store.load();
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
                           var select = Ext.getCmp('work_st'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", '', time_id, lan.view_work, 'work_st', imagesStoreEquip, documentGridStoreEquip, select.get('id'), view, add_ab);
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
                            storeWorkStGrid.load({
                                params: {search: this.value}
                            });
                            storeWorkStGrid.getProxy().url = 'scripts/datastore.php?func=work_st&search=' + this.value;
                            storeWorkStGrid.load();
                        }
                    }
                }]
            }
        ],
        bbar: [PagingWorkStbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                var titleWin = "";
                if(add_ab==false){
                    titleWin = lan.view_work;
                } 
                else {
                    if(disable_edit){//rights rule
                        view = true;
                    }
                    titleWin = lan.work_edit;
                } 
                showWindowDirectory("", 'edit', time_id, titleWin, 'work_st', imagesStoreWorkSt, documentGridStoreWorkSt, record.get('id'), view, add_ab);
            }
        }
    }

    return grid;
}


function getFormWorkSt(time_id, view=false){
    storeWorkStNumbers.load();
    storeRequestWork.load();
    var formUpload2DImageWorkSt = Ext.create('Ext.form.Panel', {
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
            id:'2DImageWorkSt'
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
            id:'drawing2dWorkSt'+time_id,
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
                                    formUpload2DImageWorkSt.setBodyStyle('background:#fff');
                                    Ext.getCmp('2DImageWorkSt').setSrc('img/components/'+o.result.message);
                                }
                            });
                        }
                    }
                }
            }
        }]
    }]
});

var formUpload3DImageWorkSt = Ext.create('Ext.form.Panel', {
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
            id:'3DImageWorkSt'
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
            id:'drawing3dWorkSt'+time_id,
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
                        var form = this.up('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: 'scripts/ecr_form.php',
                                waitMsg: lan.upload_mess,
                                params: {"addImage":'true'},
                                success: function(fp, o) {
                                    formUpload3DImageWorkSt.setBodyStyle('background:#fff');
                                    Ext.getCmp('3DImageWorkSt').setSrc('img/components/'+o.result.message);
                                }
                            });
                        }
                    }
                }
            }
        }]
    }]
});



var itemsUploadFormWorkSt = Ext.create('Ext.view.View', {
    store: imagesStoreWorkSt,
    id: 'UploadFormWorkSt'+time_id,
    tpl: imageTplWorkSt,
    itemSelector: 'div.uploadStyle',
    emptyText: lan.no_images,
    listeners: {
        dblclick: {
            element: 'el',
            fn: function(e, t){ 
                var select = itemsUploadFormWorkSt.getSelectionModel().selected.items[0].data;
                showImage(select.caption, select.src);
            }
        }
    }
});

var fileUploadFormWorkSt = Ext.create('Ext.form.Panel', {
        id: 'fileUploadFormWorkSt'+time_id,
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
            id:'add_imageformWorkSt'+time_id,
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
                                var form = Ext.getCmp('fileUploadFormWorkSt'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_mess,
                                        params: {"addImage":'true'},
                                        success: function(fp, o) {
                                            imagesStoreWorkSt.add({id: imagesStoreWorkSt.data.length+1, src: 'img/components/'+o.result.message, caption:  text});
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
            id:'deleteWorkSt'+time_id,
            maxWidth: 100,
            flex:1,
            handler : function() {
                var select = itemsUploadFormWorkSt.getSelectionModel().selected.items[0];
                if(select){
                    select = select.id;
                    imagesStoreWorkSt.each(function(record){
                        if(record.get('id')==select) imagesStoreWorkSt.remove(record);
                    });
                }
                else{
                    Ext.MessageBox.alert(lan.error, lan.select_image);
                }
            }
        }]
        },itemsUploadFormWorkSt]
});

var ImageUploadFormWorkSt = Ext.create('Ext.form.Panel', {
        title: lan.images,
        id: 'ImageUploadFormWorkSt'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
                xtype: 'container',
                //anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [formUpload2DImageWorkSt, formUpload3DImageWorkSt]
        }, fileUploadFormWorkSt]
});

var downloadLink = getActionLink('add_spec');

var DocUploadFormWorkSt = Ext.create('Ext.form.Panel', {
        title: lan.documentstext,
        id: 'DocUploadFormWorkSt'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_gridWorkSt'+time_id,
            border: true,
            hidden: false,
            store: documentGridStoreWorkSt,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    id: 'fileformWorkSt'+time_id,
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
                                var form = Ext.getCmp('DocUploadFormWorkSt'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_file,
                                        params: {"addFile":'true'},
                                        success: function(fp, o) {
                                            //console.log(o.result.message);
                                            documentGridStoreWorkSt.add({id: documentGridStoreWorkSt.data.length+1, descr_spec: text, add_spec: o.result.message});
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
                            documentGridStoreWorkSt.remove(rec);
                        }
                    }]
                }]
        }]
});

var item_form_work_st = [{
            xtype: 'container',
            layout: 'anchor',
            margin: '10',
            items: [{
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
                store: storeRequestWork,
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
                xtype:'textfield',
                fieldLabel: lan.work_id+':',
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
                    value :1,                  
                    editable:false,
                    hidden: true,
                    anchor:'96%',
                }, ImageUploadFormWorkSt, DocUploadFormWorkSt]
}];
    return item_form_work_st;
}







