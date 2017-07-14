/**
 * Created by User on 04.10.2016.
 */

function getAttr_table(id, request_id) {
    var table = null;
    if (id == "Manual Steering Gear") {
        table = attr_getManualSteering('msg', request_id);
    }
    if (id == "Power Steering Gear") {
        table = attr_getPowerSteering('psg', request_id);
    }
    if (id == "Manual Rack and Pinion") {
        table = attr_getRackPinion('mpr', request_id, 're_start_attr_mrp');
    }
    if(id == "Power Rack and Pinion") {
        table = attr_getRackPinion('rap', request_id, 're_start_attr_prp');
    }
    if (id == "Power Steering Pump with Reservoir"){
        table = attr_getReservoir('psp', request_id, 're_start_attr_pspwr');
    }
    if(id == "Power Steering Pump with out Reservoir") {
        table = attr_getReservoir('psp', request_id, 're_start_attr_pspwor');
    }
    return table;
}

function attr_getManualSteering(id, request_id) {
    // Значения по умолчанию
    var store = new Ext.data.Store({
        model: manual_steering_gear_model,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: './scripts/rev_eng_start/saveformref.php?view=1&table=re_start_attr_msg&RequestID=' + request_id,
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    });
    var cols = [
        {
            header: 'ID',
            dataIndex: 'idx',
            hidden: true
        },
        {
            header: 'BBB<br/>Number',
            dataIndex: 'bbbNumber',
            width: 100,
            editor: {}
        },
        {
            header: 'Status',
            dataIndex: 'status',
            width: 100,
            editor: {}
        },
        {
            header: 'GM Part</br>Number',
            dataIndex: 'gm_part',
            width: 100,
            editor: {}
        },
        {
            header: 'ACD Part</br>Number',
            dataIndex: 'acd_part',
            width: 100,
            editor: {}
        },
        {
            header: 'SGB Input</br>Shaft Diameter',
            dataIndex: 'sgb_input',
            width: 150,
            editor: {}
        },
        {
            header: 'SGB Output</br>Shaft Diameter',
            dataIndex: 'sgb_output',
            width: 150,
            editor: {}
        },
        {
            header: 'SGB Mounting</br>Holes',
            dataIndex: 'sgb_mounting',
            width: 150,
            editor: {}
        },
        {
            header: 'SGB Turns',
            dataIndex: 'sgb_turns',
            width: 150,
            editor: {}
        },
        {
            header: 'Quality Assurance',
            dataIndex: 'quality_assurance',
            width: 300,
            editor: {}
        },
        {
            header: 'New Components',
            dataIndex: 'new_components',
            width: 300,
            editor: {}
        }
    ];
    // <--- --- --- --- ---

    var grid = new Ext.create('Ext.grid.Panel', {
        id: "grid-" + id,
        scrollable: true,
        store: store,
        columns: cols,
        save: function () {
            var rows = attr_getStoreRows(store);
            for (var i = 0; i < rows.length; i++) {
                attr_AjaxUpdate(rows[i], 're_start_attr_msg', request_id)
            }
            return true;
        },
        tbar: [
            {
                text: 'Add Row',
                handler: function () {
                    rowEditing.cancelEdit();

                    // Create a model instance
                    var r = Ext.create('manual_steering_gear_model', {
                        bbbNumber: grid.store.getCount() + 1
                    });

                    grid.store.insert(grid.store.getCount(), r);
                    rowEditing.startEdit(grid.store.getCount() - 1, 0);
                }
            },
            {
                itemId: 'removeRow',
                text: 'Remove Row',
                disabled: true,
                handler: function () {
                    var sm = grid.getSelectionModel();
                    rowEditing.cancelEdit();
                    grid.store.remove(sm.getSelection());
                    if (store.getCount() > 0) {
                        sm.select(0);
                    }
                }
            }
        ],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function (view, records) {
                grid.down('#removeRow').setDisabled(!records.length);
            }
        }
    }); // manual_steering_gear_view
    return grid;
}

function attr_getPowerSteering(id, request_id) {
    // Значения по умолчанию
    var store = new Ext.data.Store({
        model: power_steering_gear_model,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: './scripts/rev_eng_start/saveformref.php?view=1&table=re_start_attr_psg&RequestID=' + request_id,
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    });

    var cols = [
        {header: 'ID', dataIndex: 'idx', hidden: true, editor:{}},
        {header: 'BBB<br/>Number', dataIndex: 'bbbNumber', width: 100, editor:{}},
        {header: 'Status', dataIndex: 'status', width: 100, editor:{}},
        {header: 'GM Part</br>Number', dataIndex: 'gm_part', width: 100, editor:{}},
        {header: 'ACD Part</br>Number', dataIndex: 'acd_part', width: 100, editor:{}},
        {header: 'SGB Input</br>Shaft Diameter', dataIndex: 'sgb_input', width: 150, editor:{}},
        {header: 'SGB Output</br>Shaft Diameter', dataIndex: 'sgb_output', width: 150, editor:{}},
        {header: 'SGB Mounting</br>Holes', dataIndex: 'sgb_mounting', width: 150, editor:{}},
        {header: 'SGB Turns', dataIndex: 'sgb_turns', width: 150, editor:{}},
        {header: 'PSGB Line</br>Thread Size', dataIndex: 'psgbl_size', width: 150, editor:{}},
        {header: 'Hose Port<br/>Type', dataIndex: 'hp_type', width: 120, editor:{}},
        {header: 'Quality Assurance', dataIndex: 'quality_assurance', width: 300, editor:{}},
        {header: 'New Components', dataIndex: 'new_components', width: 300, editor:{}},
        {header: 'Comments', dataIndex: 'comments', width: 300, editor:{}}
    ];
    // <--- --- --- --- ---

    var grid = new Ext.create('Ext.grid.Panel', {
        id: "grid-" + id,
        scrollable: true,
        store: store,
        columns: cols,
        save: function () {
            var rows = attr_getStoreRows(store);
            for (var i = 0; i < rows.length; i++) {
                attr_AjaxUpdate(rows[i], 're_start_attr_psg', request_id)
            }
            return true;
        },
        tbar: [
            {
                text: 'Add Row',
                handler: function () {
                    rowEditing.cancelEdit();

                    // Create a model instance
                    var r = Ext.create('manual_steering_gear_model', {
                        bbbNumber: grid.store.getCount() + 1
                    });

                    grid.store.insert(grid.store.getCount(), r);
                    rowEditing.startEdit(grid.store.getCount() - 1, 0);
                }
            },
            {
                itemId: 'removeRow',
                text: 'Remove Row',
                disabled: true,
                handler: function () {
                    var sm = grid.getSelectionModel();
                    rowEditing.cancelEdit();
                    grid.store.remove(sm.getSelection());
                    if (store.getCount() > 0) {
                        sm.select(0);
                    }
                }
            }
        ],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function (view, records) {
                grid.down('#removeRow').setDisabled(!records.length);
            }
        }

    }); // power_steering_gear_view
    return grid;
}

function attr_getRackPinion(id, request_id, table_name) {
    // Значения по умолчанию
    var store = new Ext.data.Store({
        model: rack_pinion_model,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: './scripts/rev_eng_start/saveformref.php?view=1&table='+table_name+'&RequestID=' + request_id,
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    });
    var cols = [
        {header: 'ID', dataIndex: 'idx', hidden: true},
        {header: 'BBB<br/>Number', dataIndex: 'bbbNumber', width: 100, editor:{}},
        {header: 'Status', dataIndex: 'status', width: 100, editor:{}},
        {header: 'GM Part</br>Number', dataIndex: 'gm_part', width: 100, editor:{}},
        {header: 'ACD Part</br>Number', dataIndex: 'acd_part', width: 100, editor:{}},
        {header: 'Overal<br/>Lenght', dataIndex: 'overal_lenght', width: 100, editor:{}},
        {header: 'Rack&Pinion</br>Input Shaft<br/>Lenght', dataIndex: 'rpis_lenght', width: 100, editor:{}},
        {header: 'P/S Rack&Pinion</br>Mountint holes', dataIndex: 'rpm_holes', width: 100, editor:{}},
        {header: 'P/S Rack&Pinion</br>Line Thread<br/>Size', dataIndex: 'rpis_size', width: 200, editor:{}},
        {header: 'Finish', dataIndex: 'finish', width: 100, editor:{}},
        {header: 'Rack Type', dataIndex: 'rack_type', width: 120, editor:{}},
        {header: 'Quality Assurance', dataIndex: 'quality_assurance', width: 300, editor:{}},
        {header: 'New Components', dataIndex: 'new_components', width: 300, editor:{}}
    ];
    // <--- --- --- --- ---

    var grid = new Ext.create('Ext.grid.Panel', {
        id: "grid-" + id,
        scrollable: true,
        store: store,
        columns: cols,
        save: function () {
            var rows = attr_getStoreRows(store);
            for (var i = 0; i < rows.length; i++) {
                attr_AjaxUpdate(rows[i], table_name, request_id)
            }
            return true;
        },
        tbar: [
            {
                text: 'Add Row',
                handler: function () {
                    rowEditing.cancelEdit();

                    // Create a model instance
                    var r = Ext.create(rack_pinion_model, {
                        bbbNumber: grid.store.getCount() + 1
                    });

                    grid.store.insert(grid.store.getCount(), r);
                    rowEditing.startEdit(grid.store.getCount() - 1, 0);
                }
            },
            {
                itemId: 'removeRow',
                text: 'Remove Row',
                disabled: true,
                handler: function () {
                    var sm = grid.getSelectionModel();
                    rowEditing.cancelEdit();
                    grid.store.remove(sm.getSelection());
                    if (store.getCount() > 0) {
                        sm.select(0);
                    }
                }
            }
        ],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function (view, records) {
                grid.down('#removeRow').setDisabled(!records.length);
            }
        }
    }); // rack_pinion_view
    return grid;
}

function attr_getReservoir(id, request_id, table_name) {

    // Значения по умолчанию
    var store = new Ext.data.Store({
        model: reservoir_model,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: './scripts/rev_eng_start/saveformref.php?view=1&table='+table_name+'&RequestID=' + request_id,
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    });
    var cols = [
        {header: 'ID', dataIndex: 'idx', hidden: true},
        {header: 'BBB<br/>Number', dataIndex: 'bbbNumber', width: 100, editor: {}},
        {header: 'Status', dataIndex: 'status', width: 100, editor: {}},
        {header: 'GM Part</br>Number', dataIndex: 'gm_part',width: 100, editor: {}},
        {header: 'ACD Part</br>Number', dataIndex: 'acd_part',width: 100, editor: {}},
        {header: 'PS Pump Line<br/>Thread Size', dataIndex: 'pspl_size',width: 160, editor: {}},
        {header: 'PS Pump<br/>Shaft Type', dataIndex: 'psps_type',width: 160, editor: {}},
        {header: 'PSGB Line</br>Thread Size', dataIndex: 'psgbl_size',width: 120, editor: {}},
        {header: 'Quality<br/>Assurance', dataIndex: 'quality_assurance',width: 120, editor: {}},
        {header: 'New<br/>Components', dataIndex: 'new_components',width: 130, editor: {}},
        {header: 'Renewed<br/>Components', dataIndex: 'renew_components',width: 130, editor: {}}
    ];
    // <--- --- --- --- ---

    var grid = new Ext.create('Ext.grid.Panel', {
        id: "grid-" + id,
        scrollable: true,
        store: store,
        columns: cols,
        save: function () {
            var rows = attr_getStoreRows(store);
            for (var i = 0; i < rows.length; i++) {
                attr_AjaxUpdate(rows[i], table_name, request_id)
            }
            return true;
        },
        tbar: [
            {
                text: 'Add Row',
                handler: function () {
                    rowEditing.cancelEdit();

                    // Create a model instance
                    var r = Ext.create(reservoir_model, {
                        bbbNumber: grid.store.getCount() + 1
                    });

                    grid.store.insert(grid.store.getCount(), r);
                    rowEditing.startEdit(grid.store.getCount() - 1, 0);
                }
            },
            {
                itemId: 'removeRow',
                text: 'Remove Row',
                disabled: true,
                handler: function () {
                    var sm = grid.getSelectionModel();
                    rowEditing.cancelEdit();
                    grid.store.remove(sm.getSelection());
                    if (store.getCount() > 0) {
                        sm.select(0);
                    }
                }
            }
        ],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function (view, records) {
                grid.down('#removeRow').setDisabled(!records.length);
            }
        }
    }); // rack_pinion_view

    return grid;
}

Ext.define('manual_steering_gear_model', {
    extend: 'Ext.data.Model',
    fields: ['idx',
             'bbbNumber', 'status', 'gm_part', 'acd_part',
             'sgb_input', 'sgb_output', 'sgb_mounting', 'sgb_turns',
             'quality_assurance', 'new_components'
    ]
});

Ext.define('power_steering_gear_model', {
    extend: 'Ext.data.Model',
    fields: ['idx',
             'bbbNumber', 'status', 'gm_part', 'acd_part',
             'sgb_input', 'sgb_output', 'sgb_mounting', 'sgb_turns',
             'quality_assurance', 'new_components', 'psgbl_size', 'hp_type', 'comments'
    ]
});

Ext.define('rack_pinion_model', {
    extend: 'Ext.data.Model',
    fields: ['idx',
             'bbbNumber', 'status', 'gm_part', 'acd_part',
             'overal_lenght', 'rpis_lenght', 'rpis_size', 'rpm_holes',
             'finish', 'rack_type', 'quality_assurance', 'new_components'
    ]
});

Ext.define('reservoir_model', {
    extend: 'Ext.data.Model',
    fields: ['idx',
             'bbbNumber', 'status', 'gm_part', 'acd_part',
             'pspl_size', 'psps_type', 'quality_assurance',
             'new_components', 'renew_components', 'psgbl_size'
    ]
});

function attr_AjaxUpdate(row, table, request_id) {
    row.table = table;
    row.edit = true;
    row.RequestID = request_id;

    Ext.Ajax.request({
        url: './scripts/rev_eng_start/saveformref.php',
        method: 'POST',
        params: row,
        success: function (response) {
            var val = Ext.decode(response.responseText);
            var flag = Ext.getCmp('attr_flag');
            console.log(val);
            flag.setValue(val.draft);
            Ext.MessageBox.alert(all_toir.save, all_toir.skill);
        },
        failure: function (response) {
            Ext.MessageBox.alert(all_toir.error, response.responseText);
        }
    });
}

function attr_getStoreRows(store) {
    var rows = [];
    var row = null;
    store.each(function (record) {
        row = {};
        for (key in record.data) {
            if (key == "id") {
                continue;
            }
            row[key] = record.get(key);
        }
        rows.push(row);
    });
    return rows;
}

var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToMoveEditor: 1,
    autoCancel: false
});