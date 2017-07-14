function showPhysAttributeTable(time_id, family_id=null, request_id=null, view = false){
    Ext.Ajax.request({
        url: 'scripts/family_type.php?getFamilyPhysAttr=true',
        method: 'POST',
        params: {family_id:family_id, request_id: request_id},
        success: function (response){
            var JSON = response.responseText;
            if(JSON){
                var data = Ext.decode(JSON);
                var phys_attr = Ext.decode(data.phys_attr);
                if(phys_attr){
                    var columns=[{xtype:'rownumberer', text:'№', width: 60, align: 'center'}];
                var fields = [{name:'basic', type: 'string'}];
                var data_type = 'string';
                var phys_stores = null;
                var status_hide = false;
                var renderParams;

                var custom_editor = {
                        xtype: 'textfield'
                    }

                if(data.phys_stores&&data.phys_stores!=null){
                    var phys_stores = Ext.decode(data.phys_stores);
                }

                for (var i = 0; i <phys_attr.length; i++) {
                    status_hide = false;
                    switch (phys_attr[i].data_type){
                        case '1': 
                            custom_editor = {
                                xtype: 'textfield',
                                validator: function (val) {
                                    errMsg = 'Max data length 255 chars.';
                                    return (val.length<255) ? true : errMsg;
                                }
                            }

                            data_type = 'string';
                        break;
                        case '2': 
                            var store_custom_editor = new Ext.data.Store({
                                fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
                                });

                            //console.log(phys_stores);
                           if(phys_stores!=null&&phys_stores[phys_attr[i].dynamic_id]){
                                store_custom_editor.loadData(phys_stores[phys_attr[i].dynamic_id]);
                            }
                            
                            custom_editor = {
                                xtype: 'combobox',
                                queryMode: 'local',
                                allowBlank: false,
                                typeAhead: true,
                                minChars:2,
                                triggerAction: 'all',
                                lazyRender: true,
                                enableKeyEvents: true,
                                displayField: 'value',
                                valueField: 'value',
                                store: store_custom_editor,
                                validator: function (val) {
                                    errMsg = 'Max data length 255 chars.';
                                    return (val.length<255) ? true : errMsg;
                                }
                            }

                            data_type = 'string';
                        break;
                        case '3': 
                            custom_editor = {
                                xtype: 'numberfield',
                                minValue: 0,
                                allowDecimal: false,
                                allowExponential: false,
                                mouseWheelEnabled: false,
                            }

                            data_type = 'int';
                        break;
                        case '4': 
                            custom_editor = {
                                xtype: 'numberfield'
                            }

                            data_type = 'float';
                        break;
                        case '5':
                            var store_custom_editor = new Ext.data.Store({
                                fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
                                data: [{id:0, value:lan.no},{id:1, value:lan.yes}]
                                });

                            custom_editor = {
                                xtype: 'combobox',
                                queryMode: 'local',
                                allowBlank: false,
                                typeAhead: true,
                                minChars:2,
                                triggerAction: 'all',
                                lazyRender: true,
                                enableKeyEvents: true,
                                displayField: 'value',
                                valueField: 'value',
                                store: store_custom_editor,
                                editable: false
                            }


                            data_type = 'string';
                        break;
                        case '6': 
                           custom_editor = {
                                xtype: 'datefield',
                                format: 'Y-m-d'
                            }
                            data_type = 'date';
                            renderParams = 'date';
                        break;
                    }

                    if(phys_attr[i].deleted==1){
                       status_hide = true;
                    }

                    var temp_col = null;
                    switch(renderParams){
                        case 'date':
                            temp_col = {
                                text: phys_attr[i].attr_name,
                                dataIndex : phys_attr[i].dynamic_id,
                                width: 170,
                                sortable: true,
                                editor: custom_editor,
                                hidden: status_hide,
                                renderer: Ext.Function.bind(Ext.util.Format.dateRenderer('Y-m-d'), this)
                            };
                        break;
                        default:
                            temp_col = {
                            text: phys_attr[i].attr_name,
                            dataIndex : phys_attr[i].dynamic_id,
                            width: 170,
                            sortable: true,
                            hidden: status_hide,
                            editor: custom_editor,
                        };
                        break;
                    }
                    
                    var temp_field = {
                        name: phys_attr[i].dynamic_id,
                        type: data_type
                    }
                    
                fields.push(temp_field);
                columns.push(temp_col);
                }
                

                var del_column = {
                    xtype:'actioncolumn',
                    width:30,
                    //dataIndex: 'set_hidden',
                    //hidden:view,
                    items:[{
                        iconCls: 'delete',
                        handler:function (grid, rowIndex, colIndex) {
                        var rec = this.up('grid').getStore().getAt(rowIndex);
                        this.up('grid').getStore().remove(rec);
                        this.up('grid').getView().refresh();
                        }
                    }]
                }
                

                columns.push(del_column);
                Ext.define('phys_model_fields', {
                    extend: 'Ext.data.Model',
                    fields: fields
                });
                        
                var store = new Ext.data.Store({
                           model: phys_model_fields,
                           data: [{"basic": ""}]
                        });

                view = false;//temp rule

                var phys_table = Ext.create('Ext.grid.Panel',{
                    store: store,
                    id: 'phys_attribute_table'+time_id,
                    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1,
                    listeners: {
                        beforeedit: function(e, editor){
                            if(view) {
                                return false;
                            }
                            }
                        }
                    })],
                    columns : columns,
                    border: true,
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [{ 
                            xtype: 'button',
                            iconCls: 'add',
                            text: lan.add_row,
                            disabled: view, //disable_edit, //rights rule
                            handler: function() {
                                store.add({"basic": ""});
                                this.up('grid').getView().refresh();
                                }
                            }]
                            }]
                    });

                var phys_panel = new Ext.create('Ext.panel.Panel', {
                    autoScroll: true,
                    bodyPadding: '2 2 2 3',
                    border: false,
                    items: phys_table,
                    buttons:[{
                        xtype: 'button',
                        text:lan.save,
                        hidden: view,
                        handler:function(){
                            savePhysAttrTable(time_id, request_id, family_id);
                            }
                         },{
                            xtype: 'splitter'
                        },{
                        xtype: 'button',
                        text:lan.cancel,
                        handler:function(){
                            this.up('window').destroy();
                            }
                         }],
                });

                if(data.phys_data){
                    var phys_data = Ext.decode(data.phys_data);
                    store.loadData(phys_data);
                }

                inData = {title: lan.physic_attr, sizeX: '90%', sizeY: '90%', item: phys_panel};
                showObject(inData);
                }
            }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

function savePhysAttrTable(time_id, request_id, family_id){
    var grid = Ext.getCmp('phys_attribute_table'+time_id);
    var store = grid.getStore();
    var fields = [];
    var phys_data = [];
    var physJS = null;

   for(var i =0; i<store.model.fields.length; i++){
        fields.push(store.model.fields[i].name);
    }

    fields.splice(fields.indexOf("basic"), 1);
    fields.splice(fields.indexOf("id"), 1);

    store.each(function(record){
        var temp = {};
        for(var i=0; i<fields.length; i++){
           temp[fields[i]] = record.get(fields[i]);
        }
       phys_data.push(temp);
    });

    if(phys_data.length>0){
        physJS = JSON.stringify(phys_data);
    }

    Ext.Ajax.request({
        url: 'scripts/rev_eng_start/saveformref.php?savePhysAttributes=true',
        method: 'POST',
        params: {phys_data:physJS, request_id: request_id, family_id: family_id},
        success: function (response){
            Ext.WindowMgr.each(function(win){
                win.destroy();
            });
        },
        failure: function (response){
             console.log(response);
        }
    });

    
}