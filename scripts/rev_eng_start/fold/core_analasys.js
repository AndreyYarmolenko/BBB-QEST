/**
 * Created by User on 07.10.2016.
 */
Ext.define('name_value_model', {
    extend: 'Ext.data.Model',
    fields: ['name', 'value']
});

/* --- WARNING ---
 * Если вы решили изменить элементы @editor.xtype на какие то другие
 * учтите, что подсчет в таблицу с графиками, идёт по признаку @editor.xtype = `combobox`
 * */
function get_ca_sample_pump(request_id, visible_grid) {
    if(visible_grid !== false) visible_grid = true;
    else visible_grid = false;

    var id = new Date().getTime();
    var table_name = "re_start_ce_spci";
    var status_store = new Ext.data.Store({
        fields: ['name', 'value'],
        data: [
            { name: "(n/a)", value: 0},
            { name: "Good", value: 1},
            { name: "Present", value: 2},
            { name: "Damaged", value: 3},
            { name: "Missing", value: 4}
        ]
    });
    var ajax_grid = function () {
        Ext.Ajax.request({
            url: './scripts/rev_eng_start/saveformref.php',
            method: 'GET',
            params: {
                view: 1,
                table: table_name,
                RequestID: request_id
            },
            failure: function(){
                Ext.MessageBox.show({
                    title:'Error',
                    msg: 'Could not execute query',
                    buttons: Ext.MessageBox.OK});
                return false;
            },
            success: function(response){
                var json = response.responseText;

                if(json.length < 5){
                    json = [];
                    json.push([]);
                    json[0].push({header: "Sample", type: 0, value: 1});
                    json[0].push({header: "Box Label", type: 0, value: ""});
                    json[0].push({header: "Part Label", type: 0, value: ""});
                    json[0].push({header: "Tag", type: 0, value: ""});
                    json[0].push({header: "Comments", type: 0, value: ""});
                    json[0].push({header: "Condition of Housing", type: 1, value: ""});
                    json[0].push({header: "Condition of Rear Housing", type: 1, value: ""});
                    json[0].push({header: "Condition of Side Plate", type: 1, value: ""});
                    json[0].push({header: "Condition of Rotor", type: 1, value: ""});
                    json[0].push({header: "Condition of Cam Ring", type: 1, value: ""});
                    json[0].push({header: "Condition of Vanes", type: 1, value: ""});
                    json[0].push({header: "Condition of Shaft", type: 1, value: ""});
                    json[0].push({header: "Condition of Pulley", type: 1, value: ""});
                    json[0].push({header: "Condition of Reservoir", type: 1, value: ""});
                    json[0].push({header: "Condition of Bracket", type: 1, value: ""});
                    json[0].push({header: "Condition of Flow Control Value", type: 1, value: ""});
                    genFromData(json);
                } else {
                    genFromData(JSON.parse(json));
                }
                grid.reconfigure(xstore, xcolumns);
                grid.getView().refresh();
            }
        });
    };

    // Additional functions
    function ca_getStoreRows(store){
        var rows = [];
        var row = null;
        var flag = Ext.getCmp('ce_flag');
        flag.setValue(1);

        store.each(function (record) {
            row = {};
            for (key in record.data) {
                if (key == "id") {
                    continue;
                }
                row[key] = record.get(key);
                console.log(record.get(key));
                if(record.get(key) < 1) flag.setValue(0);
            }
            rows.push(row);
        });
        return rows;
    }
    function ca_getColumnHeaders(columns) {
        var rel = {};
        for(var i = 0; i < columns.length; i++){
            var $type = 0;
            if(columns[i].editor != undefined) {
                if(columns[i].editor.xtype == 'combobox') $type = 1;
            }
            rel[columns[i].dataIndex] = {header: columns[i].header, type: $type};
        }
        return rel;
    }
    function ca_getStoreSumByColumn(store) {
        var row = {};
        var columns = ca_getColumnHeaders(xcolumns);
        var key;

        store.each(function (record) {
            for (key in columns) {
                if (columns[key].type == 1) {
                    if(row[key] == undefined) row[key] = {};
                    if(row[key].total == undefined) row[key].total = 0;
                    if(row[key].good == undefined) row[key].good = 0;
                    if(row[key].bad == undefined) row[key].bad = 0;
                    var value = record.get(key);
                    if (value == 'Good' || value == 'Present') row[key].good++;
                    if (value == 'Damaged' || value == 'Missing') row[key].bad++;
                    row[key].total++;
                    row[key].column_name = columns[key].header;
                }
            }
        });
        for (key in row) {
            row[key].scrap = ((row[key].bad / row[key].total) * 100).toFixed(2);
        }

        return row;
    }
    function ca_getStorePartSum(store) {
        var temp = {};
        store.each(function (record) {
            var key = record.get('col_2');
            if(temp[key] == undefined) {
                temp[key] = {};
                temp[key].count = 0;

            }
            temp[key].count++;
            temp[key].name = key;
        });
        return temp;
    }

    function genColumn_tf(title, dataIndex, widths, editable){
        if (title == null || title.length < 1) {
            title = "Column " + xcolumns.length;
        }
        if (dataIndex == null || dataIndex.length < 1) {
            dataIndex = "column-" + xcolumns.length;
        }
        if (widths == null || widths.length < 1) {
            widths = '120px';
        }
        if(editable == null || editable.length < 1){
            editable = true;
        }
        if(editable){
            return {
                header: title,
                width: widths,
                dataIndex: dataIndex,
                autoSizeColumn: true,
                editor:{
                    xtype: 'textfield'
                }
            }
        } else {
            return {
                header: title,
                width: widths,
                dataIndex: dataIndex,
                autoSizeColumn: true,
            }
        }

    }
    function genColumn_cbox(title, dataIndex, datastore, widths) {
        if (title == null || title.length < 1) {
            title = "Column " + xcolumns.length;
        }
        if (dataIndex == null || dataIndex.length < 1) {
            dataIndex = "column-" + xcolumns.length;
        }
        if (widths == null || dataIndex.length < 1) {
            widths = '120px';
        }
        return {
            header: title,
            width: widths,
            dataIndex: dataIndex,
            autoSizeColumn: true,
            editor:{
                xtype: 'combobox',
                store: datastore,
                displayField: 'name',
                valueField: 'name',
                editable: false
            }
        }
    }

    function genStore($title, $type) {
        if ($title == null) {
            $title = "column-" + xcolumns.length;
        }
        if ($type == null) {
            $type = "string";
        }
        return {
            name: $title,
            type: $type
        }
    }
    function genFromData(data){
        for (var i = 0; i < data.length; i++){
            var temp_json = '{';
            for (var j = 0; j < data[i].length; j++){
                var rel = 'col_'+j; // Это связь между fields, data, columns
                temp_json = temp_json + '"'+rel+'":"'+data[i][j].value+'",'; // JSON для записи данных в data

                // В этом блоке создаються fields and columns(В зависимости от типа)
                if(i == 0){

                    if(data[i][j].type == 0){
                        var temp = genColumn_tf(data[i][j].header, rel, '120px');
                        if(j == 0) {
                            temp = {
                                xtype: 'rownumberer',
                                header: data[i][j].header,
                                width: '50px'
                            }
                        }
                        xcolumns.push(temp);


                    }
                    if(data[i][j].type == 1){
                        xcolumns.push(genColumn_cbox(data[i][j].header, rel, status_store, '120px'));
                    }
                    xstore.fields.push(genStore(rel, 'string'));
                }
            }
            // Запись JSON строки в data
            temp_json = temp_json.slice(0, -1)+'}';
            temp_json = JSON.parse(temp_json);
            xstore.data.push(temp_json);
        }
    }

    function updateGridChart() {
        var part = ca_getStorePartSum(grid.store);
        var obj = ca_getStoreSumByColumn(grid.store);
        chart_store.data = [];  // Очищаем данные
        info_store.data = [];   // Очищаем данные
        part_store.data = [];

        for(key in part){
            part_store.data.push({part_name: part[key].name, part_count: part[key].count});
        }

        for(key in obj){
            var temp = {};
            temp.column_name = obj[key].column_name;
            temp.good = obj[key].good;
            temp.bad = obj[key].bad;
            temp.scrap = obj[key].scrap;
            chart_store.data.push({name: temp.column_name, scrap: temp.scrap});
            info_store.data.push(temp);
        }

        info_grid.setStore(info_store);
        part_grid.setStore(part_store);
        info_chart.setStore(chart_store);
    }
    // <--- --- ---

    // Default values
    var xcolumns = [];
    var xstore = {
        data: [],
        fields: []
    };

    var info_store = {
        data: [],
        fields: [
            genStore('column_name'),
            genStore('good'),
            genStore('bad'),
            genStore('scrap')
        ]
    };
    var info_columns = [
        genColumn_tf('Column name', 'column_name', '200'),
        genColumn_tf('Good', 'good', '120'),
        genColumn_tf('Bad', 'bad', '120'),
        genColumn_tf('Scrap rates %', 'scrap', '120')
    ];

    var part_store = {
        data: [],
        fields: [
            genStore('part_name'),
            genStore('part_count')
        ]
    };
    var part_columns = [
        genColumn_tf('Part Name', 'part_name', '200'),
        genColumn_tf('Part Count', 'part_count', '250')
    ];

    var chart_store = {
        fields: [
            genStore('name'),
            genStore('scrap')
        ],
        data: [
        ]
    };
    // <--- --- ---

    // Ext.create
    var grid = new Ext.create('Ext.grid.Panel', {
        id: "grid-" + id,
        minHeight: 300,
        scrollable: true,
        store: xstore,
        columns: xcolumns,

        tbar:[
            {
                text: "New Column",
                handler: function () {
                    Ext.Msg.prompt('Column name', 'Please enter new column name:', function(btn, text){
                        if (btn == 'ok'){
                            var newCol = genColumn_cbox(text, '',status_store);
                            var newStore = genStore();

                            xcolumns.push(newCol);
                            xstore.fields.push(newStore);


                            grid.reconfigure(xstore, xcolumns);
                            grid.getView().refresh();
                            updateGridChart();
                        }
                    });

                }
            },
            {
                text: 'Add Row',
                handler: function () {
                    rowEditing.cancelEdit();

                    grid.store.add({'col-1': xstore.length});
                    xstore.data = attr_getStoreRows(grid.store);

                    grid.reconfigure(xstore, xcolumns);
                    grid.getView().refresh();
                    rowEditing.startEdit(grid.store.getCount() - 1, 0);
                    updateGridChart();
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
                    if (xstore.getCount() > 0) {
                        sm.select(0);
                    }
                    updateGridChart();
                }
            }
        ],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function(view, records) {
                grid.down('#removeRow').setDisabled(!records.length);
            },
            'viewready': function () {
                updateGridChart();
            }
        }
    });
    grid.setVisible(visible_grid);

    var info_grid = new Ext.create('Ext.grid.Panel', {
        title: 'Component Scrap Rates',
        titleAlign: 'center',
        layout: 'fit',
        height: 500,
        id: "info-" + id,
        scrollable: true,
        store: info_store,
        columns: info_columns,
        flex: 1
    });
    var part_grid = new Ext.create('Ext.grid.Panel', {
        title: 'Sample Tally',
        titleAlign: 'center',
        layout: 'fit',
        id: "part-" + id,
        scrollable: true,
        store: part_store,
        columns: part_columns,
        flex: 1
    });
    var info_chart = new Ext.create('Ext.chart.CartesianChart',{
        title: '% SCRAP',
        titleAlign: 'center',
        height: 500,
        store: chart_store,
        id: "chart-" + id,
        xField: "name",
        yField: "scrap",
        axes: [
            {
                type: 'category',
                fields: 'name',
                label: {
                    rotate: {
                        degrees: 315
                    }
                },
                position: 'bottom',
                grid: true
            },
            {
                type: 'numeric',
                position: 'left',
                fields: 'scrap',
                title: "Scrap rates (%)",
                grid: true
            }
        ],
        series: [
            {
                type: 'bar',
                label: {},
                xField: 'name',
                yField: 'scrap',
                title: [dashboard.approved, 'FRC %'],
                style: {
                    maxBarWidth: 40,
                    minGapWidth: 20
                },
                subStyle: {
                    fill: [palitra['approved'], palitra['rejected'], palitra['frc']],
                },
                stacked: false
            }
        ],
    });
    // <--- --- ---

    ajax_grid();

    return {
        xtype: 'container',
        layout: 'anchor',
        save: function () {
            var rows = ca_getStoreRows(grid.store);
            var columns = ca_getColumnHeaders(xcolumns);
            var table = [];


            for (var i = 0; i < rows.length; i++){
                table[i] = [];
                for (var key in columns){
                    table[i].push({});
                    var j = table[i].length - 1;
                    table[i][j].value = rows[i][key];
                    table[i][j].header = columns[key].header;
                    table[i][j].type = columns[key].type;
                    j++;
                }
            }
            table = JSON.stringify(table);

            Ext.Ajax.request({
                url: './scripts/rev_eng_start/saveformref.php',
                method: 'POST',
                params: {json_table: table, RequestID: request_id, table: 're_start_ce_spci', edit: 1},
                success: function (response) {
                    Ext.MessageBox.alert(all_toir.save, all_toir.skill);
                },
                failure: function (response) {
                    Ext.MessageBox.alert(all_toir.error, response.responseText);
                }
            });

            return true;
        },
        items: [
            grid,
            {
                xtype: 'panel',
                layout: 'column',
                tbar: [
                    {
                        text: "Refresh",
                        handler: function () {
                            updateGridChart();
                        }
                    }
                ],
                items: [
                    {
                        columnWidth: '.4',
                        items: info_grid
                    },
                    {
                        columnWidth: '.6',
                        items: info_chart
                    }
                ]
            },
            part_grid
        ]
    };

}
