Ext.define('name_value_model', {
    extend: 'Ext.data.Model',
    fields: ['name', 'value']
});

 var setBGScrap = function (value, metaData, record, rowIndex, colIndex, store, view) {
     if(value == lan.good||value==lan.present){
            metaData.tdCls = 'green_bg';
        }
        else if(value == lan.damaged||value==lan.missing){
            metaData.tdCls = 'red_bg';
        }
        else {
            metaData.tdCls = '';
        }
        return value;
    }

/*function renderBackgroundRed(value, metadata, record, rowIndex, colIndex, store){
        metaData.attr = 'style="background-color: red;"';
  return value;
}*/

function getScrapChart(time_id, sizeX=700){
    var scrap_store = new Ext.data.Store({
        fields: ['scrap', 'count'],
        });

    var scrap_chart = new Ext.create('Ext.chart.CartesianChart',{
        titleAlign: 'center',
        height: 500,
        width: sizeX,
        minWidth: 500,
        id: 'scrap_chart'+time_id,
        store: scrap_store,
        border: true,
        xField: "name",
        yField: "scrap",
        axes: [
            {
                type: 'category3d',
                fields: 'scrap',
                label: {
                    rotate: {
                        degrees: 315
                    }
                },
                position: 'bottom',
                grid: true
            },
            {
                type: 'numeric3d',
                position: 'left',
                fields: 'count',
                title: lan.scrap_rates_per,
                id: 'scrap_axis'+time_id,
                grid: true,
                listeners: {
                    rangechange: function (axis, range) {
                        var cAxis = this.getChart().getAxis('scrap_axis'+time_id);
                        if (cAxis) {
                            cAxis.setMinimum(0);
                            cAxis.setMaximum(100);
                        }
                    }
                }
            }
        ],
        series: [
            {
                type: 'bar3d',
                label: {},
                xField: 'scrap',
                yField: 'count',
                title: lan.scrap,
                style: {
                    maxBarWidth: 20,
                    minGapWidth: 20,
                    maxGapWidth: 30
                },
               subStyle: {
                    fill: ['#CD5C5C'],
                },
                stacked: false,
                tips: {
                    trackMouse: true,
                    style: 'background: #FFF',
                    height: 20,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('scrap') + ': ' + storeItem.get('count')+" %");
                    }
        },
            }
        ],
    });
    return scrap_chart;
}

function getScrapRatesTable(time_id){

    var scrap_table_store = new Ext.data.Store({
        fields: ['attr_name', 'scrap', 'missing', 'damaged', 'good','present'],
        });


    var scrap_table = new Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        height: 500,
        id: "scrap_table_" + time_id,
        store: scrap_table_store,
        columns: [
        {text : lan.param_name, dataIndex : 'attr_name', width: 200, sortable: false},
        {text : lan.scrap_rate+', %', dataIndex : 'scrap', width: 120, sortable: true, align: 'center'},
        {text : lan.missing+',<br>%', dataIndex : 'missing', width: 100, sortable: true, align: 'center'},
        {text : lan.damaged+',<br>%', dataIndex : 'damaged', width: 100, sortable: true, align: 'center'},
        {text : lan.good+',<br>%', dataIndex : 'good', width: 100, sortable: true, align: 'center'},
        {text : lan.present+',<br>%', dataIndex : 'present', width: 100, sortable: true, align: 'center'}
        ],
    });

    return scrap_table;
}

function getSampleTallyTable(time_id){

    var sample_table_store = new Ext.data.Store({
        fields: ['part_label', 'number'],
        });


    var sample_table = new Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        height: 500,
        id: "sample_table_" + time_id,
        store: sample_table_store,
        columns: [
        {text : lan.part_label, dataIndex : 'part_label', width: 200, sortable: false},
        {text : lan.numb_of_samples, dataIndex : 'number', width: 150, sortable: true, align: 'center'},
        ],
    });

    return sample_table;
}

function getAnalysisPanel(time_id, sizeX){
    var chart = getScrapChart(time_id, sizeX);
    var scrap_table = getScrapRatesTable(time_id);
    var sample_table = getSampleTallyTable(time_id);
    var imageGalery = getImageGalery(time_id+'total', true);

    var analysis_panel = {
          xtype: 'tabpanel',
          id: 'analysis_panel_tabs'+time_id,
          resizeTabs: true,
          items: [{
                  title: lan.scrap_chart,
                  items:chart
              },{
                  title: lan.scrap_rates,
                  items:scrap_table
              },{
                  title: lan.sample_tally,
                  items:sample_table
              },{
                  title: lan.images_h,
                  items:imageGalery
              }]
        };


    return analysis_panel;
}

function loadAnalysisData(time_id, chart_fields, chart_category, core_data =null){
    if(!core_data||core_data==null){
        var grid = Ext.getCmp('core_analysis_table'+time_id);
        var sourse_store = grid.getStore();
        var core_data = [];

        sourse_store.each(function(record){
            var temp_core_data = {};
            for (key in record.data) {
                if(record.get(key)!=null){
                     temp_core_data[key] = record.get(key);
                }
            }
            core_data.push(temp_core_data);
        });
    }

    if(core_data.length>0){
        var chart_store = Ext.getCmp('scrap_chart'+time_id).getStore();
        var scrap_table_store = Ext.getCmp("scrap_table_" + time_id).getStore();
        var sample_table_store = Ext.getCmp("sample_table_" + time_id).getStore();
        var image_galery_store = Ext.getCmp('UploadForm'+time_id+'total').getStore();

        var chart_data = [];
        var scrap_table_data = [];
        var temp_sample_table_data = [];
        var sample_table_data = [];
        var images_data = [];



        for (var i = 0; i <core_data.length; i++) {
            temp_sample_table_data.push(core_data[i].part_label);
        }

        while(temp_sample_table_data.length>0){
            var number = 0;
            var val = temp_sample_table_data[0];
            var del_key = [];

            for(var i = 0; i<temp_sample_table_data.length; i++){
                if(val == temp_sample_table_data[i]){
                    number++;
                    del_key.push(i);
                }
            }

            for(var i=del_key.length-1; i>=0; i--){
                temp_sample_table_data.splice(del_key[i], 1);
            }

            sample_table_data.push({part_label: val, number: number});
        }

        sample_table_store.loadData(sample_table_data);

        var count_id = 0;
        for(var i=0; i<core_data.length; i++){
            if(core_data[i].core_images&&core_data[i].core_images!=""){
                var tem_img = Ext.decode(core_data[i].core_images);
                for(var k =0; k<tem_img.length; k++){
                    tem_img[k].id = count_id;
                    tem_img[k].caption = core_data[i].part_label+": "+tem_img[k].caption;
                    images_data.push(tem_img[k]);
                    count_id++;
                }
            }
        }
        image_galery_store.loadData(images_data);

        for(var i = 0; i<chart_fields.length; i++){
            var count_value = 0;
            var total = core_data.length;
            var count = 0;
            var missing = 0;
            var damaged = 0;
            var good = 0;
            var present = 0;

            for(var k=0; k<total; k++){
                switch (core_data[k][chart_fields[i]]){
                    case lan.damaged:
                        count++;
                        damaged++;
                    break;
                    case lan.missing:
                        count++;
                        missing++;
                    break;
                    case lan.good:
                        good++;
                    break;
                    case lan.present:
                        present++;
                    break;
                }
            }

            count_value = Math.round(count*1000/total)/10;

            missing = Math.round(missing*1000/total)/10;
            damaged = Math.round(damaged*1000/total)/10;
            good = Math.round(good*1000/total)/10;
            present = Math.round(present*1000/total)/10;

            chart_data.push({'scrap': chart_category[i], 'count': count_value});
            scrap_table_data.push({'attr_name': chart_category[i], 'scrap': count_value, 'missing': missing, 'damaged':damaged, 'good':good,'present':present});
        }
        chart_store.loadData(chart_data);
        scrap_table_store.loadData(scrap_table_data);
    }
}

 function showCoreAnalysisTable(time_id, family_id=null, request_id=null, view=false){
   Ext.Ajax.request({
        url: 'scripts/family_type.php?getFamilyContent=true',
        method: 'POST',
        params: {family_id:family_id, request_id: request_id},
        success: function (response){
            var JSON = response.responseText;
            if(JSON){
                var data = Ext.decode(JSON);
                var core_attr = Ext.decode(data.core_attr);

                if(core_attr){
                    var columns=[{xtype:'rownumberer', text:'Sample', width: 100, align: 'center'}];
                var fields = [{name:'basic', type: 'string'}, {name:'core_images', type: 'string'}];
                var data_type = 'string';
                var core_stores = null
                var chart_fields = [];
                var chart_data = [];
                var chart_category = [];
                var renderParams;
                var status_hide = false;
                var custom_editor = {
                        xtype: 'textfield'
                    }

                if(data.core_stores&&data.core_stores!=null){
                    var core_stores = Ext.decode(data.core_stores);
                }

                for (var i = 0; i <core_attr.length; i++) {
                    status_hide = false;
                    switch (core_attr[i].data_type){
                        case '1': 
                            custom_editor = {
                                xtype: 'textfield',
                                validator: function (val) {
                                    errMsg = 'Max data length 255 chars.';
                                    return (val.length<255) ? true : errMsg;
                                },
                                listeners: {
                                    change: function(){
                                        var select = this.up('grid').getView().getSelectionModel();
                                        var record = select.getSelection()[0];
                                        var lastCol = select.getCurrentPosition().columnHeader.dataIndex;
                                        if(lastCol=='part_label'){
                                            record.set(lastCol, this.value);
                                            loadAnalysisData(time_id, chart_fields, chart_category);
                                        }
                                    }
                                }
                            }

                            data_type = 'string';
                        break;
                        case '2': 
                            var store_custom_editor = new Ext.data.Store({
                                fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
                                });
                           if(core_stores!=null&&core_stores[core_attr[i].dynamic_id]){
                                store_custom_editor.loadData(core_stores[core_attr[i].dynamic_id]);
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
                                },
                                listeners: {
                                    change: function(){
                                        var select = this.up('grid').getView().getSelectionModel();
                                        var record = select.getSelection()[0];
                                        var lastCol = select.getCurrentPosition().columnHeader.dataIndex;
                                        if(lastCol=='part_label'){
                                            record.set(lastCol, this.value);
                                            loadAnalysisData(time_id, chart_fields, chart_category);
                                        }
                                    }
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
                            if(core_attr[i].deleted!=1){
                                chart_fields.push(core_attr[i].dynamic_id);
                                chart_category.push(core_attr[i].attr_name);
                            }

                            var store_custom_editor = new Ext.data.Store({
                                fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
                                data: [{id:0, value:"N/A"},{id:1, value:lan.good},{id:2, value:lan.present},{id:3, value:lan.damaged},{id:4,value:lan.missing}]
                                });

                            renderParams = 'custom';

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
                                editable: false,
                                listeners: {
                                    select: function(){
                                        var select = this.up('grid').getView().getSelectionModel();
                                        var record = select.getSelection()[0];
                                        var lastCol = select.getCurrentPosition().columnHeader.dataIndex;
                                        record.set(lastCol, this.value);
                                        loadAnalysisData(time_id, chart_fields, chart_category);
                                    }
                                }
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

                   if(core_attr[i].deleted==1){
                       status_hide = true;
                    }

                    var temp_col = null;
                    switch(renderParams){
                        case 'custom':
                            temp_col = {
                                text: core_attr[i].attr_name,
                                dataIndex : core_attr[i].dynamic_id,
                                width: 170,
                                sortable: true,
                                editor: custom_editor,
                                renderer: setBGScrap,
                                hidden: status_hide
                            };
                        break;
                        case 'date':
                            temp_col = {
                                text: core_attr[i].attr_name,
                                dataIndex : core_attr[i].dynamic_id,
                                width: 170,
                                sortable: true,
                                editor: custom_editor,
                                hidden: status_hide,
                                renderer: Ext.Function.bind(Ext.util.Format.dateRenderer('Y-m-d'), this)
                            };
                        break;
                        default:
                            temp_col = {
                                text: core_attr[i].attr_name,
                                dataIndex : core_attr[i].dynamic_id,
                                width: 170,
                                sortable: true,
                                editor: custom_editor,
                                hidden: status_hide
                            };
                        break;
                    }
                    
                    
                    var temp_field = {
                        name: core_attr[i].dynamic_id,
                        type: data_type
                    }
                    
                fields.push(temp_field);
                columns.push(temp_col);
                }

                var image_column = {
                    text: lan.images,
                    xtype:'actioncolumn',
                    width:100,
                    dataIndex: 'core_images',
                    align: 'center',
                    items:[{
                        iconCls: 'showpic',
                        handler:function (grid, rowIndex, colIndex) {
                        var rec = this.up('grid').getStore().getAt(rowIndex);
                        var imageGalery = getImageGalery(time_id, view);
                        var image_panel = new Ext.create('Ext.panel.Panel', {
                            //autoScroll: true,
                            bodyPadding: '2 2 2 3',
                            border: false,
                            items:imageGalery,
                            buttons:[{
                                xtype: 'button',
                                text:lan.save,
                                hidden: view,
                                handler:function(){
                                    if(rec.get('part_label')&&rec.get('part_label')!=""){
                                        var arr_images = [];
                                        var imagesJS = null;
                                        var image_galery_store = Ext.getCmp('UploadForm'+time_id).getStore();
                                        image_galery_store.each(function(record){
                                            arr_images.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
                                        });

                                        if(arr_images.length>0){
                                            imagesJS = Ext.JSON.encode(arr_images);
                                            rec.set('core_images', imagesJS);
                                        }
                                        loadAnalysisData(time_id, chart_fields, chart_category);
                                        this.up('window').destroy();
                                    }
                                    else {
                                        Ext.MessageBox.alert(lan.error, "You can't save images with empty Part Label column!");
                                    }
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

                        if(rec.get('core_images')&&rec.get('core_images')!=""){
                            var images_data = Ext.decode(rec.get('core_images'));
                            var image_galery_store = Ext.getCmp('UploadForm'+time_id).getStore();
                            image_galery_store.loadData(images_data);
                        }

                        inData = {title: lan.images, sizeX: '80%', sizeY: '80%', item: image_panel};
                        showObject(inData);
                        }
                    }]
                }
        columns.push(image_column);

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
        Ext.define('core_model_fields', {
            extend: 'Ext.data.Model',
            fields: fields
        });
                
        var store = new Ext.data.Store({
                   model: core_model_fields,
                   data: [{"basic": ""}]
                });

        view = false;//temp rule
                
        var core_table = Ext.create('Ext.grid.Panel',{
                store: store,
                autoScroll: true,
                id: 'core_analysis_table'+time_id,
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
                selModel: 'cellmodel',
                border: true,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{ 
                        xtype: 'button',
                        text: lan.add_row,
                        iconCls: 'add',
                        disabled: view, //disable_edit, //rights rule
                        handler: function() {
                            store.add({"basic": ""});
                            this.up('grid').getView().refresh();
                            }
                        }]
                        }]
                });
        
        var sizeX = store.model.fields.length*50;
        var analysis_panel = getAnalysisPanel(time_id, sizeX);
        var core_panel = new Ext.create('Ext.panel.Panel', {
                autoScroll: true,
                bodyPadding: '2 2 2 3',
                border: false,
                items:[core_table,analysis_panel
                ],
                buttons:[{
                    xtype: 'button',
                    text:lan.save,
                    hidden: view,
                    handler:function(){
                        saveCoreAnalysisTable(time_id, request_id, family_id);
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

        if(data.core_data){
            var core_data = Ext.decode(data.core_data);
            store.loadData(core_data);

            loadAnalysisData(time_id, chart_fields, chart_category);
        }

        inData = {title: lan.table_core_analysis, sizeX: '90%', sizeY: '90%', item: core_panel};
        showObject(inData);
                }
            }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}

function saveCoreAnalysisTable(time_id, request_id, family_id){
    var grid = Ext.getCmp('core_analysis_table'+time_id);
    var store = grid.getStore();
    var fields = [];
    var core_data = [];
    var coreJS = null;

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
       core_data.push(temp);
    });

    if(core_data.length>0){
        coreJS = JSON.stringify(core_data);
    }

    Ext.Ajax.request({
        url: 'scripts/rev_eng_start/saveformref.php?saveCoreAnalysis=true',
        method: 'POST',
        params: {core_data:coreJS, request_id: request_id, family_id: family_id},
        success: function (response){
            loadDataProductFamily(time_id+'main_form', family_id, request_id);
            Ext.WindowMgr.each(function(win){
                win.destroy();
            });
        },
        failure: function (response){
             console.log(response);
        }
    });

    
}