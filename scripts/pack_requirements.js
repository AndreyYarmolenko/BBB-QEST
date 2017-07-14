 var storePackRequirement = new Ext.data.Store({
        fields: ['id', {type: 'string', name: 'name', sortType: 'asLower'}, {type: 'string', name: 'description', sortType: 'asLower'}, {type: 'string', name: 'number', sortType: 'asLower'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=pack',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
            simpleSortMode: true
        }
    });

function addGridPackRequirement(time_id, rights, add_btn=false, view=false){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }  

    storePackRequirement.load();

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.pack_id, dataIndex: 'number', sortable: true, hideable: false, width: 170},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, width: 200},
        {text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
       // {text: lan.two_d, xtype:'actioncolumn',dataIndex: 'drawing2d',width:150,sortable:false, items:[actionEquip]}
       ];


 var PagingPackbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storePackRequirement,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'pack_requrement'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storePackRequirement,
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
                        disabled: disable_add,//rights rule
                        handler: function() {
                            showPackRequirement(time_id, null, 'add');
                        }
                    },'-',
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        hidden: add_btn,
                        disabled: disable_edit,//rights rule
                        handler: function() {
                           var select = Ext.getCmp('pack_requrement'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showPackRequirement(time_id, select.get('id'), 'edit', add_btn);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },'-',
                    {
                        text: lan.view,
                        iconCls: 'showpic',
                        hidden: !add_btn,
                        handler: function() {
                            var select = Ext.getCmp('pack_requrement'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showPackRequirement(time_id, select.get('id'), 'view', add_btn);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        hidden: add_btn,
                        disabled: disable_delete,//rights rule
                        handler: function() {
                         var select = Ext.getCmp('pack_requrement'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/pack_requrement.php?delPack=true',
                                            method: 'POST',
                                            params: {pack_id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp('pack_requrement'+time_id).store.load();
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
                    name: lan.search,
                    emptyText: lan.search_placeholder,
                    labelWidth: style.input2.labelWidth,
                    width: '48%',
                    listeners: {
                        change: function() {
                            storePackRequirement.load({
                                params: {search: this.value}
                            });
                            storePackRequirement.getProxy().url = 'scripts/datastore.php?func=pack&search=' + this.value;
                            storePackRequirement.load();
                        }
                    }
                }]
            },{
            xtype: 'container',
            layout: 'hbox',
            dock: 'bottom',
            hidden: !add_btn,
            margin: '5px 10px 5px 10px',
            items: [{
                xtype: 'displayfield',
                flex: 2
            },{
                    xtype:'button',
                    text:lan.add_to_table,
                    flex: 1,
                    disabled: disable_edit,//rights rule
                    handler: function() {
                        var select = Ext.getCmp('pack_requrement'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                               /* var store = Ext.getCmp('pack_requirement_grid'+time_id).getStore();
                                var isExist = false;
                                store.each(function(record){
                                    if(record.get('id')==select.get('id')){
                                        isExist = true;
                                    }
                                });
                                if(isExist){
                                    Ext.MessageBox.alert(lan.error, lan.cant_dublicate_pack);
                                }
                                else {*/
                                    var grid_view = Ext.getCmp('pack_requirement_grid'+time_id).getView();
                                    var record_main = grid_view.getSelectionModel().getSelection()[0];
                                    record_main.set('number', select.get('number'));
                                    record_main.set('name', select.get('name'));
                                    record_main.set('id_pack', select.get('id'));
                                    grid_view.refresh();
                                    Ext.WindowMgr.each(function(win){
                                        win.destroy();
                                    });
                               // }
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                    }
                }]
            }],
        bbar: [PagingPackbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                if(add_btn){
                    action = 'view';
                }
                else {
                    action = 'edit';
                }

                if (record) {
                    showPackRequirement(time_id, record.get('id'), action, add_btn);
                }
            }
        }
    }

    return grid;
}

function addGridPackRequirementPrevios(time_id, rights, add_btn=false, view=false){
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }  

    storePackRequirement.load();

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.pack_id, dataIndex: 'number', sortable: true, hideable: false, width: 170},
        {text: lan.name, dataIndex: 'name', sortable: true, hideable: true, width: 200},
        {text: lan.description, dataIndex: 'description', sortable: true,  width: 250},
       // {text: lan.two_d, xtype:'actioncolumn',dataIndex: 'drawing2d',width:150,sortable:false, items:[actionEquip]}
       ];


 var PagingPackbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storePackRequirement,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'pack_requrement_previos'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storePackRequirement,
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
                        text: lan.view,
                        iconCls: 'showpic',
                        hidden: !add_btn,
                        handler: function() {
                            var select = Ext.getCmp('pack_requrement_previos'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                showPackRequirement(null, select.get('id'), 'view', add_btn);
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
                            storePackRequirement.load({
                                params: {search: this.value}
                            });
                            storePackRequirement.getProxy().url = 'scripts/datastore.php?func=pack&search=' + this.value;
                            storePackRequirement.load();
                        }
                    }
                }]
            },{
            xtype: 'container',
            layout: 'hbox',
            dock: 'bottom',
            hidden: !add_btn,
            margin: '5px 10px 5px 10px',
            items: [{
                xtype: 'displayfield',
                flex: 2
            },{
                    xtype:'button',
                    text:lan.add_to_table,
                    flex: 1,
                    disabled: disable_edit,//rights rule
                    handler: function() {
                        var select = Ext.getCmp('pack_requrement_previos'+time_id).getView().getSelectionModel().getSelection()[0];
                        if (select) {
                               var packId = select.data.id;
                               Ext.Ajax.request({
                                 url: 'scripts/pack_requrement.php?getPackData=true',
                                 method: 'POST',
                                 params: {pack_id:packId},
                                 success: function (response){
                                    var JSON = response.responseText;
                                    if(JSON){
                                        var data = Ext.decode(JSON);
                                        var fields = Ext.getCmp('pack_form_'+time_id).getForm().getFields();

                                        fields.each(function(item){
                                            for (var k in data){
                                                if(item.getName() == k && data[k]!=null){
                                                    if(item.getName() != "number" && item.getName() != "name") item.setValue(data[k]);
                                                }
                                            }
                                        });

                                        var part_img_store = Ext.getCmp('UploadForm'+time_id+'part').getStore();
                                        var pack_img_primary_store = Ext.getCmp('UploadForm'+time_id+'primary').getStore();
                                        var pack_img_secondary_store = Ext.getCmp('UploadForm'+time_id+'secondary').getStore();

                                        if(data.part_img){
                                            var data_img = Ext.decode(data.part_img);
                                            part_img_store.loadData(data_img);
                                        }

                                        if(data.pack_img_primary){
                                            var data_img_primary = Ext.decode(data.pack_img_primary);
                                            pack_img_primary_store.loadData(data_img_primary);
                                        }

                                        if(data.pack_img_secondary){
                                            var data_img_secondary = Ext.decode(data.pack_img_secondary);
                                            pack_img_secondary_store.loadData(data_img_secondary);
                                        }

                                        Ext.getCmp('pack_requrement_previos'+time_id).up('window').destroy();
                                    }
                                },
                                failure: function (response){ 
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                                });

                           } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                    }
                }]
            }],
        bbar: [PagingPackbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
                showPackRequirement(null, record.get('id'), 'view', add_btn);
            }
        }
    }

    return grid;
}

function showPackRequirement(time_id, pack_id, action, is_res=false){
    var pack_item = getPackRequirement(time_id, action, is_res);
    if(pack_id&&pack_id!=""){

        var part_img_store = Ext.getCmp('UploadForm'+time_id+'part').getStore();
        var pack_img_primary_store = Ext.getCmp('UploadForm'+time_id+'primary').getStore();
        var pack_img_secondary_store = Ext.getCmp('UploadForm'+time_id+'secondary').getStore();

        Ext.Ajax.request({
            url: 'scripts/pack_requrement.php?getPackData=true',
            method: 'POST',
            params: {pack_id:pack_id},
            success: function (response){
                var JSON = response.responseText;
                if(JSON){
                    var data = Ext.decode(JSON);
                    var fields = Ext.getCmp('pack_form_'+time_id).getForm().getFields();
                    fields.each(function(item){
                        for (var k in data){
                            if(item.getName() == k && data[k]!=null){
                                item.setValue(data[k]);
                            }
                        }
                    });

                    if(data.part_img){
                        var data_img = Ext.decode(data.part_img);
                        part_img_store.loadData(data_img);
                    }

                    if(data.pack_img_primary){
                        var data_img_primary = Ext.decode(data.pack_img_primary);
                        pack_img_primary_store.loadData(data_img_primary);
                    }

                    if(data.pack_img_secondary){
                        var data_img_secondary = Ext.decode(data.pack_img_secondary);
                        pack_img_secondary_store.loadData(data_img_secondary);
                    }
                }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
    }
    inData = {title: lan.package_require, item: pack_item};
    showObject(inData);

}

function getPackRequirement(time_id, action, is_res=false){
    var status_hide_btn = false;
    var status_read = false;
    var status_hide_add = false;
    
    if(is_res){
        status_hide_btn = false;
    }
    else{
        status_hide_btn = true;
    }

    if(action=="view"){
        status_hide_add = true;
        status_read = true;
    }

    if(action == "add" && Ext.WindowMgr.zIndexStack.length < 1) previos = false;
    else previos = true;

    var image_part = getImageGalery(time_id+'part', status_read);
    var image_primary = getImageGalery(time_id+'primary', status_read);
    var image_secondary = getImageGalery(time_id+'secondary', status_read);

    var form = new Ext.create('Ext.form.Panel', {
        cls: 'pr_spi_border_all',
        id: 'pack_form_'+time_id,
        autoScroll: true,
        //scrollable: true,
        buttons: [{
            text:lan.save,
            hidden: status_hide_add,
            handler:function(){
                var form = this.up('form').getForm();
                savePackRequirementForm(form, time_id, action, false);
            }
        },{
            text:lan.add_to_table,
            hidden: status_hide_btn,
            handler:function(){
                //console.log(Ext.WindowMgr.zIndexStack.items.length);
                var form = this.up('form').getForm();
                if(is_res&&action!='view'){
                    savePackRequirementForm(form, time_id, action, is_res);
                }
                else if(Ext.WindowMgr.zIndexStack.length == 3) {
                    var winFirstForm = Ext.WindowMgr.zIndexStack.items[0].down('form').getForm();
                    winFirstForm.findField('description').setValue(form.findField('description').getValue());
                    winFirstForm.findField('pc_type').setValue(form.findField('pc_type').getValue());
                    winFirstForm.findField('pct_id').setValue(form.findField('pct_id').getValue());
                    winFirstForm.findField('pct_lwh').setValue(form.findField('pct_lwh').getValue());
                    winFirstForm.findField('pct_wt').setValue(form.findField('pct_wt').getValue());
                    winFirstForm.findField('pct_material').setValue(form.findField('pct_material').getValue());

                    winFirstForm.findField('d_type').setValue(form.findField('d_type').getValue());
                    winFirstForm.findField('dt_id').setValue(form.findField('dt_id').getValue());
                    winFirstForm.findField('dt_lwh').setValue(form.findField('dt_lwh').getValue());
                    winFirstForm.findField('dt_wt').setValue(form.findField('dt_wt').getValue());
                    winFirstForm.findField('dt_material').setValue(form.findField('dt_material').getValue());

                    winFirstForm.findField('d_type2').setValue(form.findField('d_type2').getValue());
                    winFirstForm.findField('dt2_id').setValue(form.findField('dt2_id').getValue());
                    winFirstForm.findField('dt2_lwh').setValue(form.findField('dt2_lwh').getValue());
                    winFirstForm.findField('dt2_wt').setValue(form.findField('dt2_wt').getValue());
                    winFirstForm.findField('dt2_material').setValue(form.findField('dt2_material').getValue());

                    winFirstForm.findField('sc_type').setValue(form.findField('sc_type').getValue());
                    winFirstForm.findField('sct_id').setValue(form.findField('sct_id').getValue());
                    winFirstForm.findField('sct_lwh').setValue(form.findField('sct_lwh').getValue());
                    winFirstForm.findField('sct_wt').setValue(form.findField('sct_wt').getValue());
                    winFirstForm.findField('sct_material').setValue(form.findField('sct_material').getValue());

                    winFirstForm.findField('p_stack').setValue(form.findField('p_stack').getValue());
                    winFirstForm.findField('rpi_method').setValue(form.findField('rpi_method').getValue());
                    winFirstForm.findField('pbh_handler').setValue(form.findField('pbh_handler').getValue());

                    winFirstForm.findField('sp_quantity').setValue(form.findField('sp_quantity').getValue());
                    winFirstForm.findField('no_lc').setValue(form.findField('no_lc').getValue());
                    winFirstForm.findField('no_lon').setValue(form.findField('no_lon').getValue());

                    winFirstForm.findField('p_weight').setValue(form.findField('p_weight').getValue());
                    winFirstForm.findField('pcg_weight').setValue(form.findField('pcg_weight').getValue());
                    winFirstForm.findField('scg_weight').setValue(form.findField('scg_weight').getValue());
                    winFirstForm.findField('mtc_load').setValue(form.findField('mtc_load').getValue());
                    winFirstForm.findField('material_once').setValue(form.findField('material_once').getValue());

                    var fields = form.getFields();
                    var packId = getValueByName(fields, 'pack_id');

                    Ext.Ajax.request({
                        url: 'scripts/pack_requrement.php?getPackData=true',
                        method: 'POST',
                        params: {pack_id:packId},
                        success: function (response){
                            var JSON = response.responseText;
                            if(JSON){
                                var data = Ext.decode(JSON);
                                var part_img_store = Ext.WindowMgr.zIndexStack.items[0].down('fieldset').items.items[0].items.items[0].items.items[1].getStore();
                                var pack_img_primary_store = Ext.WindowMgr.zIndexStack.items[0].down('fieldset').items.items[1].items.items[0].items.items[1].getStore();
                                var pack_img_secondary_store = Ext.WindowMgr.zIndexStack.items[0].down('fieldset').items.items[2].items.items[0].items.items[1].getStore();

                                if(data.part_img){
                                    var data_img = Ext.decode(data.part_img);
                                    part_img_store.loadData(data_img);
                                }

                                if(data.pack_img_primary){
                                    var data_img_primary = Ext.decode(data.pack_img_primary);
                                    pack_img_primary_store.loadData(data_img_primary);
                                }

                                if(data.pack_img_secondary){
                                    var data_img_secondary = Ext.decode(data.pack_img_secondary);
                                    pack_img_secondary_store.loadData(data_img_secondary);
                                }
                            }
                        },
                        failure: function (response){ 
                            Ext.MessageBox.alert(lan.error, response.responseText);
                        }
                    });

                    this.up('form').up('window').destroy();
                    Ext.WindowMgr.zIndexStack.items[1].destroy();
                }
                else{
                    var fields_pack = form.getFields();
                    var pack_id = getValueByName(fields_pack, 'pack_id');
                    //var pack_id = Ext.select('*[name=pack_id').elements[0].value;
                    if (pack_id) {
                        /*var store = Ext.getCmp('pack_requirement_grid'+time_id).getStore();
                        var isExist = false;
                        store.each(function(record){
                            if(record.get('id')==pack_id){
                                isExist = true;
                            }
                        });
                        if(isExist){
                            Ext.MessageBox.alert(lan.error, lan.cant_dublicate_pack);
                        }
                        else {*/
                            //var number = Ext.select('*[name=number').elements[0].value;
                            //var name = Ext.select('*[name=name').elements[0].value;
                            var number = getValueByName(fields_pack, 'number');
                            var name = getValueByName(fields_pack, 'name');
                            var grid_view = Ext.getCmp('pack_requirement_grid'+time_id).getView();
                            var record_main = grid_view.getSelectionModel().getSelection()[0];
                            record_main.set('id_pack', pack_id);
                            record_main.set('number', number);
                            record_main.set('name', name);
                            grid_view.refresh();
                            Ext.WindowMgr.each(function(win){
                                win.destroy();
                            });
                       // }
                    }
                }
            }
        },{
            text:lan.cancel,
            handler:function(){
                this.up('window').destroy();
            }
        }],
        items:[{
                xtype:'hidden',
                name: 'pack_id'
            },{
                xtype: 'container',
                width: 1010,
                margin: '0 0 0 10px',
                items:[
                {
                    xtype: 'button',
                    text: "Draft",
                    margin: "10 0 0 900",
                    hidden: previos,
                    handler: function() {
                        var win = new Ext.Window({
                            width: '70%',
                            height: '70%',
                            title: "Previos Packaging Requirements",
                            closeAction: 'destroy',
                            layout: 'fit',
                            resizable: true,
                            closable: true,
                            modal: true,
                            constrainHeader: true,
                            items: [
                                addGridPackRequirementPrevios(time_id, all_rights['pack_requirement'], add_btn=true, view = false)
                            ]
                        });
                        win.show();
                    }
                },
                {
                    xtype:'textfield',
                    fieldLabel: lan.packaging_id,
                    labelAlign: 'top',
                    name: 'number',
                    allowBlank: false,
                    readOnly: status_read,
                    width: '96%',
                },{
                    xtype:'textfield',
                    fieldLabel: lan.packaging_name,
                    labelAlign: 'top',
                    name: 'name',
                    allowBlank: false,
                    readOnly: status_read,
                    width: '96%',
                },{
                    xtype:'textfield',
                    fieldLabel: lan.description,
                    labelAlign: 'top',
                    name: 'description',
                    allowBlank: false,
                    readOnly: status_read,
                    width: '96%',
                }]
            },{
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                padding: '10px',
                cls: 'pr_spi_border_bottom',
                items:[{
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: lan.exp_pack_info,
                        width: 300
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: lan.mat_cost_per_piece,
                        width: 300,
                    },
                    {
                        xtype: 'numberfield',
                        cls: 'pr_spi_input',
                        name: 'material_cost',
                        allowBlank: false,
                        readOnly: status_read,
                        minValue:0,
                        allowExponential: false,
                        mouseWheelEnabled: false,
                        width: 200,
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: '(USD)',
                        width: 70
                    }]
            },
            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                xtype: 'displayfield',
                                value: lan.primary_container_type,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value',
                                displayField: 'value',
                                store: store_spi_primary_container_type,
                                name: 'pc_type',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input',
                                editable: false
                            }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'id',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'pct_id',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'LWH(mm)',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield', width: '100%',
                                    name: 'pct_lwh',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 120,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.tare_wt,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield', width: '100%',
                                    name: 'pct_wt',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: lan.material,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox',
                                width: '100%',
                                valueField: 'value',
                                displayField: 'value',
                                store: store_spi_materials,
                                name: 'pct_material',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.dunnage_type,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox', width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_dunnage_type,
                                    name: 'd_type',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'id',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield', width: '100%',
                                    name: 'dt_id',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'LWH(mm)',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield', width: '100%',
                                    name: 'dt_lwh',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 120,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.tare_wt,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield', width: '100%',
                                    name: 'dt_wt',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        items: [{
                                xtype: 'displayfield',
                                value: lan.material,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value',
                                displayField: 'value',
                                store: store_spi_materials,
                                name: 'dt_material',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input',
                                editable: false
                            }]
                    }
                ]
            },
            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.dunnage_type,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox', width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_dunnage_type,
                                    name: 'd_type2',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'id',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'dt2_id',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'LWH(mm)',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'dt2_lwh',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 120,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.tare_wt,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'dt2_wt',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.material,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox',
                                    width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_materials,
                                    name: 'dt2_material',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    }
                ]
            },
            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.second_con_type,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox',
                                    width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_secondary_con_type,
                                    name: 'sc_type',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'id',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'sct_id',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: 'LWH(mm)',
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'sct_lwh',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 120,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.tare_wt,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'sct_wt',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.material,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox',
                                    width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_materials,
                                    name: 'sct_material',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    }]
            }, 

            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 230,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.pallet_stack,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'p_stack',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }, 
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 430,
                        cls: 'pr_spi_border_right',
                        items: [{
                                xtype: 'displayfield',
                                value: lan.rustproofing_method,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield',
                                width: '100%',
                                name: 'rpi_method',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input'
                            }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 350,
                        items: [{
                                xtype: 'displayfield',
                                value: lan.primary_box_have,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield',
                                width: '100%',
                                name: 'pbh_handler',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input'
                            }]
                    } 
                ]
            },

            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 330,
                        cls: 'pr_spi_border_right',
                        items: [{
                                xtype: 'displayfield',
                                value: lan.standart_pack_qty,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield',
                                width: '100%',
                                name: 'sp_quantity',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input'
                            }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 330,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.no_primary_layer,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'no_lc',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 350,
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.no_layers_in_sec_con,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'no_lon',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    }]
            },
            {
                xtype: 'container',
                width: 1010,
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [{
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                xtype: 'displayfield',
                                value: lan.part_weight,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'numberfield',
                                width: '100%',
                                name: 'p_weight',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input',
                                mouseWheelEnabled: false
                            }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                xtype: 'displayfield',
                                value: lan.primary_cont_gross_w,
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'numberfield',
                                width: '100%',
                                name: 'pcg_weight',
                                allowBlank: false,
                                readOnly: status_read,
                                cls: 'pr_spi_input',
                                mouseWheelEnabled: false
                            }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 200,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.sec_cont_gross_w,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'numberfield',
                                    width: '100%',
                                    name: 'scg_weight',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    mouseWheelEnabled: false
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 260,
                        cls: 'pr_spi_border_right',
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.method_to_secure,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'mtc_load',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input'
                                }]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: 150,
                        items: [{
                                    xtype: 'displayfield',
                                    value: lan.material_h,
                                    cls: 'pr_spi_header'
                                },
                                {
                                    xtype: 'combobox',
                                    width: '100%',
                                    valueField: 'value',
                                    displayField: 'value',
                                    store: store_spi_material_once,
                                    name: 'material_once',
                                    allowBlank: false,
                                    readOnly: status_read,
                                    cls: 'pr_spi_input',
                                    editable: false
                                }]
                    }]
            },{
                xtype: 'fieldset',
                title: '<h3>'+lan.insert_photo+'</h3>',
                border: 2,
                padding: '5px 5px 5px 5px',
                layout: 'hbox',
                width: 1010,
                items: [{
                    xtype: 'panel',
                    title: lan.part_only,
                    margin: '0 5 0 5',
                    border: true,
                    width: 320,
                    items: image_part
                },{
                    xtype: 'panel',
                    title: lan.part_dunnage_box,
                    margin: '0 5 0 5',
                    border: true,
                    width: 320,
                    items: image_primary
                },{
                    xtype: 'panel',
                    title: lan.primary_sec_unit_load,
                    margin: '0 5 0 5',
                    border: true,
                    width: 320,
                    items: image_secondary
                }]
            }]
    });
    return form;
}


var store_spi_primary_container_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: lan.carton, id: 1},
        { value: lan.bulk_container, id: 2},
        { value: lan.full_telesc_carton, id: 3},
        { value: "HSC", id: 4},
        { value: "RSC", id: 5},
        { value: lan.pallet, id: 6},
        { value: lan.pallettainer, id: 7},
        { value: lan.pallet_container, id: 8},
        { value: lan.other, id: 9}
    ]
});

var store_spi_dunnage_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: lan.paper, id: 1},
        { value: lan.tray, id: 2},
        { value: lan.reel, id: 3},
        { value: lan.partition, id: 4},
        { value: lan.foam, id: 5},
        { value: lan.bag, id: 6},
        { value: lan.other, id: 7}
    ]
});

var store_spi_secondary_con_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: lan.bulk_container, id: 1},
        { value: lan.plastic_pallet, id: 2},
        { value: lan.pallet_container, id: 3},
        { value: lan.pallettainer, id: 4},
        { value: lan.wood_pallet, id: 5},
        { value: lan.cover_comb, id: 6},
        { value: lan.other, id: 7}
    ]
});

var store_spi_materials = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: lan.corrugated, id: 1},
        { value: lan.paperboard, id: 2},
        { value: lan.corrugated_fiberboard, id: 3},
        { value: lan.wood, id: 4},
        { value: lan.other, id: 5}
    ]
});

var store_spi_material_once = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: lan.corrugated, id: 1},
        { value: lan.paperboard, id: 2},
        { value: lan.corrugated_fiberboard, id: 3},
        { value: lan.wood, id: 4},
        { value: lan.other, id: 5}
    ]
});


function savePackRequirementForm(form, time_id, action, is_res=false){
    var dim_part = [];
    var dim_primary = [];
    var dim_secondary = [];
    var dim_partJS = null;
    var dim_primaryJS = null;
    var dim_secondaryJS = null;

    var part_img_store = Ext.getCmp('UploadForm'+time_id+'part').getStore();
    var pack_img_primary_store = Ext.getCmp('UploadForm'+time_id+'primary').getStore();
    var pack_img_secondary_store = Ext.getCmp('UploadForm'+time_id+'secondary').getStore();

    part_img_store.each(function(record){
       dim_part.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
    });

    pack_img_primary_store.each(function(record){
       dim_primary.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
    });

    pack_img_secondary_store.each(function(record){
       dim_secondary.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
    });

    if(dim_part.length>0){
        dim_partJS = JSON.stringify(dim_part);
    }

    if(dim_part.length>0){
        dim_primaryJS = JSON.stringify(dim_primary);
    }

    if(dim_part.length>0){
        dim_secondaryJS = JSON.stringify(dim_secondary);
    }

    var params = {
        'part_img': dim_partJS,
        'pack_img_primary': dim_primaryJS,
        'pack_img_secondary': dim_secondaryJS,
        'action': action
    }
    
    if(form.isValid()){
        form.submit({
            url: 'scripts/pack_requrement.php',
            waitMsg: lan.saving,
            wait: true,
            scope: this,
            method: 'post',
            params: params,
            success: function(form, action) {
                if(action.response.responseText){
                    var data = Ext.decode(action.response.responseText);
                    Ext.MessageBox.show({
                        title:lan.success,
                        cls: 'msgbox',
                        msg: data.message,
                        buttons: Ext.MessageBox.YES,
                        width:300,                       
                        closable:false,
                        fn: function(btn) {
                               if (btn == 'yes') {
                                if(is_res){
                                    var pack_id = data.id;
                                    //var number = Ext.select('*[name=number').elements[0].value;
                                    //var name = Ext.select('*[name=name').elements[0].value;
                                    var fields_pack = Ext.getCmp('pack_form_'+time_id).getForm().getFields();
                                    var number = getValueByName(fields_pack, 'number');
                                    var name = getValueByName(fields_pack, 'name');
                                    var grid_view = Ext.getCmp('pack_requirement_grid'+time_id).getView();
                                    var record_main = grid_view.getSelectionModel().getSelection()[0];
                                    record_main.set('id_pack', pack_id);
                                    record_main.set('number', select.get('number'));
                                    record_main.set('name', select.get('name'));
                                    grid_view.refresh();
                                    Ext.WindowMgr.each(function(win){
                                        win.destroy();
                                    });
                                }
                                else {
                                    Ext.getCmp('pack_requrement'+time_id).getStore().load();
                                }
                                Ext.getCmp('pack_form_'+time_id).up('window').destroy();
                               }
                           }
                        
                        });
                }
            },
            failure: function(form, action) {
                var data = Ext.decode(action.response.responseText);
                Ext.MessageBox.show({
                    title:lan.fail,
                    cls: 'msgbox',
                    msg: data.message,
                    buttons: Ext.MessageBox.YES,
                    width:300,                       
                    closable:false,
                    fn: function(btn) {
                           if (btn == 'yes') {
                            Ext.WindowMgr.each(function(win){
                                win.destroy();
                            });
                            Ext.getCmp('pack_requrement'+time_id).getStore().load();
                           }
                       }
                    
                    });
            }
        });
    }
    else {
        Ext.MessageBox.alert(lan.error, lan.not_all_filled);
    }
}
