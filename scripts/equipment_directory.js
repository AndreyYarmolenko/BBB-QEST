var actionEquip = getActionColumnDir('drawing2d');
var documentGridStoreEquip =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

Ext.apply(Ext.data.SortTypes, {
    asLower: function (str) {
        return str.toLowerCase();
    }
});

 var storeEquipGrid = new Ext.data.Store({
        //autoLoad: true,
        //pageSize: 25,
        //remoteSort: true,
        fields: ['id',{type: 'string', name: 'name', sortType: 'asLower'}, {type: 'string', name: 'description', sortType: 'asLower'}, 'drawing2d', {type: 'string', name: 'number', sortType: 'asLower'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=equip',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
            simpleSortMode: true
        }
    });

var imagesStoreEquip = Ext.create('Ext.data.Store', {
    model: 'Image',
});

var imageTplEquip = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="uploadStyle">',
            '<div class="caption_title">{caption}</div>',
            '<img src="{src}" style="max-height:90%; max-width:95%;"/>',
        '</div>',
    '</tpl>'
);


function addEquipGrid(time_id, view, add_ab=true, rights, viewAdd){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }  

    storeEquipGrid.load();

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.equip_id, dataIndex: 'number', sortable: true, hideable: false, width: 170},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, width: 200},
        {text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
        {text: lan.two_d, xtype:'actioncolumn',dataIndex: 'drawing2d',width:150,sortable:false, items:[actionEquip]},
    ];


 var PagingEquipbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storeEquipGrid,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'equip'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeEquipGrid,
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
                            showWindowDirectory("", 'add', time_id, lan.create_equip, 'equip', imagesStoreEquip, documentGridStoreEquip);
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        disabled: disable_edit,//rights rule
                        hidden: view,
                        handler: function() {
                           var select = Ext.getCmp('equip'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", 'edit', time_id, edit_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, select.get('id'));
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
                           var select = Ext.getCmp('equip'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?delEquip=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp('equip'+time_id).store.load();
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
                           var select = Ext.getCmp('equip'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showWindowDirectory("", '', time_id, lan.view_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, select.get('id'), view, add_ab);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                   {
                    xtype: 'textfield',
                    name: lan.search,
                    emptyText: lan.search_placeholder,
                    labelWidth: style.input2.labelWidth,
                    width: '48%',
                    listeners: {
                        change: function() {
                            storeEquipGrid.load({
                                params: {search: this.value}
                            });
                            storeEquipGrid.getProxy().url = 'scripts/datastore.php?func=equip&search=' + this.value;
                            storeEquipGrid.load();
                        }
                    }
                }]
            }
        ],
        bbar: [PagingEquipbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                var titleWin = "";
                if(add_ab==false){
                    titleWin = lan.view_equip;
                } 
                else {
                    if(disable_edit){//rights rule
                        view = true;
                    }
                    titleWin = lan.edit_equip;
                }
                showWindowDirectory("", 'edit', time_id, titleWin, 'equip', imagesStoreEquip, documentGridStoreEquip, record.get('id'), view, add_ab);
            }
        }
    }

    return grid;
}


function getFormEquip(time_id, view=false){
    storeRequestEquip.load();
    storeEquipNumbers.load();
    var formUpload2DImageEquip = Ext.create('Ext.form.Panel', {
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
            id:'2DImageEquip'
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
            buttonText: 'Add Image',
            id:'drawing2dEquip'+time_id,
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
                                    formUpload2DImageEquip.setBodyStyle('background:#fff');
                                    Ext.getCmp('2DImageEquip').setSrc('img/components/'+o.result.message);
                                }
                            });
                        }
                    }
                }
            }
        }]
    }]
});

var formUpload3DImageEquip = Ext.create('Ext.form.Panel', {
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
            id:'3DImageEquip'
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
            id:'drawing3dEquip'+time_id,
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
                                    formUpload3DImageEquip.setBodyStyle('background:#fff');
                                    Ext.getCmp('3DImageEquip').setSrc('img/components/'+o.result.message);
                                }
                            });
                        }
                    }
                }
            }
        }]
    }]
});



var itemsUploadFormEquip = Ext.create('Ext.view.View', {
    store: imagesStoreEquip,
    id: 'UploadFormEquip'+time_id,
    tpl: imageTplEquip,
    itemSelector: 'div.uploadStyle',
    emptyText: lan.no_images,
    listeners: {
        dblclick: {
            element: 'el', //bind to the underlying body property on the panel
            fn: function(e, t){ 
                var select = itemsUploadFormEquip.getSelectionModel().selected.items[0].data;
                showImage(select.caption, select.src);
            }
        }
    }
});

var fileUploadFormEquip = Ext.create('Ext.form.Panel', {
       //title: 'Additional Images',
        id: 'fileUploadFormEquip'+time_id,
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
            id:'add_imageformEquip'+time_id,
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
                                var form = Ext.getCmp('fileUploadFormEquip'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_mess,
                                        params: {"addImage":'true'},
                                        success: function(fp, o) {
                                            imagesStoreEquip.add({id: imagesStoreEquip.data.length+1, src: 'img/components/'+o.result.message, caption:  text});
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
            id:'deleteEquip'+time_id,
            maxWidth: 100,
            flex:1,
            handler : function() {
                var select = itemsUploadFormEquip.getSelectionModel().selected.items[0];
                if(select){
                    select = select.id;
                    imagesStoreEquip.each(function(record){
                        if(record.get('id')==select) imagesStoreEquip.remove(record);
                    });
                }
                else{
                    Ext.MessageBox.alert(lan.error, lan.select_image);
                }
            }
        }]
        },itemsUploadFormEquip]
});

var ImageUploadFormEquip = Ext.create('Ext.form.Panel', {
        title: lan.images,
        id: 'ImageUploadFormEquip'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
                xtype: 'container',
                //anchor:'96%',
                layout: {
                    type: 'hbox',
                },
                items: [formUpload2DImageEquip, formUpload3DImageEquip]
        }, fileUploadFormEquip]
});

var downloadLink = getActionLink('add_spec');

var DocUploadFormEquip = Ext.create('Ext.form.Panel', {
        title: lan.documentstext,
        id: 'DocUploadFormEquip'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_gridEquip'+time_id,
            border: true,
            hidden: false,
            store: documentGridStoreEquip,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    id: 'fileformEquip'+time_id,
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
                                var form = Ext.getCmp('DocUploadFormEquip'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_file,
                                        params: {"addFile":'true'},
                                        success: function(fp, o) {
                                            //console.log(o.result.message);
                                            documentGridStoreEquip.add({id: documentGridStoreEquip.data.length+1, descr_spec: text, add_spec: o.result.message});
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
                    dataIndex:'set_hidden',
                    hidden: view,
                    items:[{
                        iconCls:'delete',
                        handler:function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            documentGridStoreEquip.remove(rec);
                        }
                    }]
                }]
        }]
});

var item_form_equip = [{
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
                store: storeRequestEquip,
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
                fieldLabel: lan.equip_id,
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
                readOnly: view,
                allowBlank: false,
                labelWidth: style.input2.labelWidth,
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
                    value:1,                  
                    editable:false,
                    hidden:true,
                    anchor:'96%',
                }, ImageUploadFormEquip, DocUploadFormEquip]
}];
    return item_form_equip;
}







