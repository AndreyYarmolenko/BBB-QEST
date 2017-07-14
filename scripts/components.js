function addComponentsGrid(inData) {
    var time_id = Date.parse(new Date());
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;
    var filter_out = null;
    var case_type = 'dir';
    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.rights) rights = inData.rights;
        if(inData.filter_out) filter_out = inData.filter_out;
        if(inData.case_type) case_type = inData.case_type;
    }

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    var components_grid_store = new Ext.data.Store({     
        fields: ['id', {type: 'string', name: 'finish_good'}, {type: 'string', name: 'comp_type'}, {type: 'string', name: 'part_number'}, {type: 'string', name: 'description'}, {type: 'string', name: 'revision'}, 'image1', 'create_date', 'drawing2d', 'drawing3d', 'in_house', 'out_source', 'reuse_from_core', 'add_spec'],
        autoLoad: true,
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=comp_part_number',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

    var PagingToolbar = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: components_grid_store,
        displayInfo: true
    });

    var UpperToolbar = Ext.create('Ext.toolbar.Toolbar', {
            width: '96%',
            id:'UpperToolbar'+time_id,
            items: [{
                        text: lan.add,
                        iconCls: 'add',
                        width: 110,
                        disabled: disable_add,//rights rule
                        handler: function() {
                            var dialog_win = getDialogWin({time_id:time_id});
                            showObject({id:time_id, title: 'Select Component Type', item: dialog_win, sizeX: 300, sizeY: 200});
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        width: 110,
                        //hidden: add_btn,
                        disabled: disable_edit,//rights rule
                        handler: function() {
                            var select = Ext.getCmp('components_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var comp_type = select.get('comp_type');
                                var comp_type_name = "";
                                storeCompTypes.each(function(record){
                                    if(record.get('id')==comp_type){
                                        comp_type_name = record.get('value');
                                    }
                                });
                                var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type, name: comp_type_name}, action: 'edit', comp_id:select.get('id'), case_type: case_type});
                                showObject({id:time_id, title: 'Edit Component', item: comp_form, sizeX: '100%', sizeY: '100%'});
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.add_to_table,
                        iconCls: 'work',
                        width: 110,
                        hidden: true,
                        handler: function() {
                            var select = Ext.getCmp('components_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var isExist = false;
                                var old_time_id = time_id+100000;
                                var comp_id = select.get('id');
                                var msg = "";
                                var row = null;
                                var count_fg = 0;

                                if(case_type=='kit'){
                                    var table_id = 'kit_table'+old_time_id;
                                    msg = "This component is already contain in KIT!";
                                    row = {id: comp_id, comp_type: select.get('comp_type'), description: select.get('description'), part_number: select.get('part_number'), image1: select.get('image1')};
                                }
                                else {
                                    var table_id = 'gridbom'+old_time_id;
                                    msg = "This component is already contain in BOM!";
                                    row = {id: comp_id, comp_type: select.get('comp_type'), description: select.get('description'), part_number: select.get('part_number'), image1: select.get('image1'), create_date: select.get('create_date'), drawing2d: select.get('drawing2d'), drawing3d: select.get('drawing3d'), revision: select.get('revision')};
                                }

                                var store = Ext.getCmp(table_id).getStore();
                                if(case_type=='bom'&&store.data.length==0&&select.get('comp_type')!=1){
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

                                if(case_type=='bom'&&select.get('comp_type')==1&&count_fg>0){
                                    Ext.MessageBox.alert(lan.error, lan.already_bom);
                                    return;
                                }

                                if(isExist){
                                    Ext.MessageBox.alert(lan.error, msg);
                                    return;
                                }
                                store.add(row);
                                this.up('window').destroy();
                                Ext.getCmp(table_id).getView().refresh();
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.view,
                        iconCls: 'showpic',
                        width: 110,
                        hidden: true,
                        handler: function() {
                            var select = Ext.getCmp('components_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var comp_type = select.get('comp_type');
                                var comp_type_name = "";
                                storeCompTypes.each(function(record){
                                    if(record.get('id')==comp_type){
                                        comp_type_name = record.get('value');
                                    }
                                });

                                var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type, name: comp_type_name}, action: 'edit', comp_id:select.get('id'), case_type: case_type});
                                setBlockForm(comp_form, time_id);
                                showObject({id:time_id, title: 'View Component', item: comp_form, sizeX: '100%', sizeY: '100%'});
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        width: 110,
                        //hidden: add_btn,
                        disabled: disable_delete,//rights rule
                        handler: function() {
                            var select = Ext.getCmp('components_grid'+time_id).getView().getSelectionModel().getSelection()[0];
                            Ext.Ajax.request({
                                url: 'scripts/ecr_form.php?deleteComponent=true',
                                method: 'POST',
                                params: {"comp_id": select.get('id')},
                                success: function(response) {
                                    var JSON = response.responseText;
                                    if (JSON) {
                                        var data = Ext.decode(JSON);
                                        Ext.MessageBox.alert(lan.skill, data.message);
                                        Ext.getCmp('components_grid'+time_id).getStore().load();
                                    }
                                },
                                failure: function(response) {
                                    Ext.MessageBox.alert(lan.error, response.responseText);
                                }
                            });
                        }
                    },{
                    xtype: 'textfield',
                    name: lan.search,
                    emptyText: lan.search,
                    labelWidth: style.input2.labelWidth,
                    width: '48%',
                    listeners: {
                        change: function() {
                            var store = Ext.getCmp('components_grid'+time_id).getStore();
                                store.getProxy().url = 'scripts/datastore.php?func=comp_part_number&search=' + this.value;
                                store.load();
                            }
                        }
                    }]
        });
    
    var LowerToolbar = Ext.create('Ext.toolbar.Toolbar', {
            width: '96%',
            id:'LowerToolbar'+time_id,
            items: [{
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #008000;"><b>Component FG</b></span>',
                        name: 'comp_fg',
                        inputValue: 1,
                        disabled: false,
                        width: 140,
                        margin: '0 10px 0 10px',
                        listeners: {
                            change: function(){
                                setComponentsFilter(time_id);
                            }
                        }
                    },'-',
                    {
                    xtype: 'checkbox',
                    boxLabel  : '<span style="color: #808080;"><b>Component</b></span>',
                    name: 'comp',
                    inputValue: 2,
                    disabled: false,
                    width: 140,
                    margin: '0 10px 0 0',
                    listeners: {
                        change: function(){
                            setComponentsFilter(time_id);
                        }
                    }
                    }
                    ,'-',
                    {
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #4169E1;"><b>KIT</b></span>',
                        name: 'kit',
                        inputValue: 3,
                        disabled: false,
                        width: 140,
                        margin: '0 10px 0 0',
                        listeners: {
                            change: function(){
                                setComponentsFilter(time_id);
                            }
                        }
                    }
                    ,'-',
                    {
                        xtype: 'checkbox',
                        boxLabel  : '<span style="color: #B0E0E6;"><b>Kit part</b></span>',
                        name: 'kit_part',
                        inputValue: 4,
                        disabled: false,
                        width: 140,
                        margin: '0 10px 0 0',
                        listeners: {
                            change: function(){
                                setComponentsFilter(time_id);
                            }
                        }
                        }]
        });

    var components_grid = Ext.create('Ext.grid.Panel', {
        store: components_grid_store,
        minHeight: 500,
        width: '100%',
        id: 'components_grid'+time_id,
        margin: '5 10',
        border: false,
        columns: [
            {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
            {text: 'TYPE', sortable: true, dataIndex: 'comp_type', width: 100, renderer: setCompType},
            {text: 'Component P/N', sortable: true, dataIndex: 'part_number', width: 150},
            {text: lan.description, sortable: true, dataIndex: 'description', minWidth: 120, flex:1},
            {text: lan.revision, sortable: true, dataIndex: 'revision', width: 100},
            {text: lan.create_date, sortable: true, dataIndex: 'create_date', width: 150},
            {text: '', dataIndex: 'image1', sortable: true, hidden: true},
            {text: 'Image', 
                 xtype:'actioncolumn',
                 items:[{
                    iconCls:'showpic',
                    handler:function (grid, record, row, colIndex) {
                        var image = grid.getStore().data.items[record].data.image1;
                        var src =  "./img/components/"+image;
                        var titlePartComp = grid.getStore().data.items[record].data.description;
                       showImage(titlePartComp, src);
                    }
                }], 
                width: 100
            }],
        bbar: [PagingToolbar],
        dockedItems: [
        {
            layout: 'vbox',
            items:[UpperToolbar, LowerToolbar]
        }],
        listeners: {
            celldblclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                if (record) {
                    var comp_type = record.get('comp_type');
                    var comp_type_name = "";
                    storeCompTypes.each(function(rec){
                        if(rec.get('id')==comp_type){
                            comp_type_name = rec.get('value');
                        }
                    });
                    var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type, name: comp_type_name}, action: 'edit', comp_id:record.get('id'), case_type: case_type});
                    if(case_type=="bom"||case_type=="kit"){
                        setBlockForm(comp_form, time_id);
                    }
                    showObject({id:time_id, title: 'View/Edit Component', item: comp_form, sizeX: '100%', sizeY: '100%'});
                } else {
                    Ext.MessageBox.alert(lan.error, lan.select_row);
                }
            }
        }
    });

    if(filter_out){
        setComponentsFilter(time_id, filter_out);
    }
    return components_grid;
}

function setComponentsFilter(time_id, filter_out=null){
    var check_boxes = Ext.getCmp('LowerToolbar'+time_id).query('checkbox');
    var types = "";

    if(filter_out){
        for(var i = 0; i<filter_out.length; i++){
            types +=filter_out[i]+",";
        }

        for(var i = 0; i<check_boxes.length; i++){
            if(check_boxes[i].inputValue==1||check_boxes[i].inputValue==3){
                check_boxes[i].setConfig('disabled', true);
            }
        }
    }
    else {
        for(var i = 0; i<check_boxes.length; i++){
            if(check_boxes[i].value){
                types +=check_boxes[i].inputValue+",";
            }
        }

        if(!types||types==""){
            types = "1,2,3,4 ";
        }
    }
    types = types.substring(0, types.length - 1);

    Ext.getCmp('components_grid'+time_id).getStore().load({
        params:{
            filter: types
        }
    });
}

function getDialogWin(inData){
    if(!inData.time_id) { 
        return;
    }
    else {
        var time_id = inData.time_id;
    }
    var case_type = "dir";

    if(inData.case_type) case_type = inData.case_type;

    if(case_type == 'kit'){
        storeCompTypes.filter('id', new RegExp("[24]"));
    }
    else if(case_type == 'bom'){
        storeCompTypes.filter('id', new RegExp("[12]"));
    }
    else {
        storeCompTypes.filter('id', new RegExp("[1234]"));
    }

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
                    this.up('window').destroy();
                    var title = 'Create New Component';
                    if(comp_type.value==3) title = "Create New KIT";
                    var comp_form = getComponentForm({time_id: time_id, comp_type: {type:comp_type.value, name: comp_type.rawValue}, action: 'add', case_type: case_type, use_new: true});
                    showObject({id:time_id, title: title, item: comp_form, sizeX: '100%', sizeY: '100%'});
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
    return dialog_win;
}

function setBlockForm(comp_form, time_id){
    var buttons = comp_form.query('button');
    var file_fields = comp_form.query('filefield');      
    Ext.Array.each(buttons, function(button) {
          if(button.iconCls!='cancelbtn'&&button.iconCls!='workbtn'){
            button.setDisabled(true);
          }
      });

  Ext.Array.each(file_fields, function(file_field) {
      file_field.setDisabled(true);
  });
    comp_form.getForm().getFields().each(function(item){
        item.setConfig('readOnly', true);
    });
    Ext.getCmp('grid_control'+time_id).setValue(0);
}