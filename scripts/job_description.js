Ext.define('jobDescription_model', {
    extend: 'Ext.data.Model',
    fields: ['id','job_title', 'revision', 'status', 'create_date', 'id_department', 'reports_to', 'flsa_status',
        'prepared_by', 'prepared_date', 'summary', 'essential_duties', 'qualifications', 'education_experience',
        'work_environment', 'summary_end', 'deleted', 'name', `id_dep`, 'user_name' ]
});

var store_jd_reports_to = new Ext.data.Store({
    autoLoad: true,
    fields: ['id', 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/job_description.php?getJdReportsTo=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_jd_job_title = new Ext.data.Store({
    autoLoad: true,
    fields: ['id', 'value','jd_id'],
    proxy: {
        type: 'ajax',
        url: 'scripts/job_description.php?getJdTitle=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_jd_department = new Ext.data.Store({
    autoLoad: true,
    fields: ['id', 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/job_description.php?getJdDepartment=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_jd_revision = new Ext.data.Store({
    autoLoad: true,
    fields: ['value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/job_description.php?getJdRevision=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var jobDescription_store = new Ext.data.Store({
    pageSize: 50,
    model: 'jobDescription_model',
    proxy:
    {
        type: 'ajax',
        url: 'scripts/job_description.php?DescriptionShow=true',
        reader:
        {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        },
        simpleSortMode: true
    },
    sorters:[
        {
            property: 'name',
            direction: 'ASC'
        }
    ]
});


function show_jobDescription(rights){
    jobDescription_store.load();

    var disable_add = true;
    var disable_edit = true;
    var disable_view = true;
    var disable_delete = true;
    var disable_all_revision = true;

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_view = (rights.indexOf('view')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
        disable_all_revision = (rights.indexOf('all_revision')!=-1)? false : true;
    }

    var PagingToolbar_jobDescription = Ext.create('Ext.PagingToolbar', {
        border: false,
        frame: false,
        store: jobDescription_store,
        displayInfo: true
    });


    var grid_jobDescription = new Ext.create('Ext.grid.Panel',{
        xtype: 'grid',
        layout: 'fit',
        columnLines: true,
        border: false,
        frame: false,
        id: 'grid_jobDescription_id',
        autoScroll: true,
        store: jobDescription_store,
        stripeRows: true,
        viewConfig: {
            stripeRows: true,
        },
        dockedItems:
            [{
                xtype: 'toolbar',
                items: [
                    {
                        text: lan.add,
                        disabled: disable_add, //rights rule
                        iconCls: 'add',
                        handler: function(){
                                show_jobDescription_add();
                        },
                    },'-',
                    {
                        text: lan.edit,
                        disabled: disable_edit, //rights rule
                        iconCls: 'edit',
                        handler: function(){
                            var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                show_jobDescription_addedit(select.get('id'),select);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                            return status;
                        }
                    },'-',
                    {
                        text: lan.view,
                        disabled: disable_view, //rights rule
                        iconCls: 'showpic',
                        handler: function(){
                            var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                show_jobDescription_view(select.get('id'),select);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },'-',
                    {
                        text: lan.del,
                        disabled: disable_delete, //rights rule
                        iconCls: 'delete',
                        handler: function(){
                            var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/job_description.php',
                                            method: 'POST',
                                            params: { 'delete':true, "id": select.get('id')},
                                            success: function(response) {
                                                var JSON = response.responseText;
                                                if (JSON) {
                                                    try{
                                                        var decoded = Ext.decode(JSON);
                                                        if(decoded.success == false){
                                                            Ext.MessageBox.alert(lan.error, decoded.message);
                                                        }else{
                                                            Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                            Ext.getCmp('grid_jobDescription_id').store.load();
                                                            Ext.getCmp('grid_jobDescription_id').getView().refresh();
                                                        }
                                                    }catch(e) {
                                                        Ext.MessageBox.alert(lan.error, lan.error+' ' + e.name + ":" + e.message + "\n" + e.stack);
                                                    }
                                                }else{
                                                    Ext.MessageBox.alert(lan.error, '');
                                                }
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
                        name: 'search',
                        emptyText: lan.search,
                        labelWidth: style.input2.labelWidth,
                        width: '48%',
                        listeners: {
                            change: function() {
                                jobDescription_store.load({
                                    params: {filter: this.value}
                                });
                                jobDescription_store.getProxy().url = 'scripts/job_description.php?DescriptionShow&filter=' + this.value;
                                jobDescription_store.load();
                            }
                        }
                    }
                ]
            }],

        columns:[
            {
                text:'№',
                width:30,
                xtype:'rownumberer'
            },
            {
                text: "Job Title",
                width:200,
                dataIndex: 'job_title',
                sortable: true
            },
            {
                text: "Department",
                width:150,
                dataIndex: 'name',
                sortable: true
            },
            {
                text: "Reports to",
                dataIndex: 'reports_to',
                sortable: true,
                flex: 1
            },
            {
                text: "Revision",
                // dataIndex: 'max_revision',
                dataIndex: 'revision',
                align:'center', 
                sortable: true,
                flex: 0.8
            },
            {
                text: "Status",
                dataIndex: 'status',
                sortable: true,
                flex: 0.8
            },
            {
                text: "Prepared By",
                dataIndex: 'user_name',
                sortable: true,
                flex: 1
            },
            {
                text: "Prepared Date",
                dataIndex: 'prepared_date',
                sortable: true,
                flex: 1.2
            }
        ],
        bbar:[PagingToolbar_jobDescription],
        listeners: {
            itemdblclick: function(cmp, records) {
                show_jobDescription_add(disable_add);
            },
            itemdblclick: function(cmp, records) {
                show_jobDescription_addedit(records.get('id'), records, disable_edit);
            },
            itemdblclick: function(cmp, records) {
                show_jobDescription_view(records.get('id'), records, disable_view);
            }
        }
    });

    return grid_jobDescription;
}

var WindowForm_jobDescription = null;

function show_jobDescription_addedit(idrow, select, disable_edit){
    store_jd_job_title.load();
    store_jd_department.load();
    store_jd_reports_to.load();
    store_jd_revision.load();

    if(idrow){
        var texttype = lan.edit;
    }else{
        var texttype = lan.add;
    }
    if(!WindowForm_jobDescription){

        WindowForm_jobDescription = new Ext.Window({
            height: '75%',
            width: '85%',
            title: texttype+' '+"Job Description",
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
            closable: true,
            modal: true,
            constrainHeader: true,
            listeners: {
                destroy: function(){
                    WindowForm_jobDescription = null;
                }
            },

            items:[
                new Ext.create('Ext.form.Panel', {
                    autoScroll: true,
                    bodyPadding: '2 2 2 3',
                    border: false,
                    id: 'form_jobDescription',
                    layout: {
                        align: 'stretch'
                    },
                    defaults: {
                        msgTarget: 'side'
                    },
                    items:[
                        {
                            xtype:'displayfield',
                            name: 'status',
                            margin: '0 45%',
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
                            xtype: 'container',
                            anchor:'96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items:[{
                                xtype:'combobox',
                                fieldLabel: "Job Title",
                                width: '25%',
                                store: store_jd_job_title,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'job_title',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                                xtype:'combobox',
                                fieldLabel: "Department",
                                width: '25%',
                                store: store_jd_department,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'name',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                                xtype:'combobox',
                                fieldLabel: "Reports to",
                                width: '25%',
                                store: store_jd_reports_to,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'reports_to',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                               xtype: 'textfield',
                                fieldLabel: "FLSA Status",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'flsa_status',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },
                            ]
                        },{
                            xtype: 'container',
                            anchor:'96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items:[{
                                xtype: 'textfield',
                                fieldLabel: "Revision",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'revision',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype: 'textfield',
                                fieldLabel: "Create date",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'create_date',
                                dataIndex: 'create_date',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype: 'textfield',
                                fieldLabel: "Prepared By",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'user_name',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype:'datefield',
                                fieldLabel: "Prepared Date",
                                format:'Y-m-d',
                                width: '25%',
                                labelAlign: 'top',
                                name: 'prepared_date',
                                style: { padding: '5px' },
                                anchor: '98%'
                            },
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Summary",
                            labelAlign: 'top',
                            name: 'summary',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            fieldLabel: "Essential Duties",
                            labelAlign: 'top',
                            name: 'essential_duties',
                            style: { padding: '5px' },
                            anchor:'98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Qualifications",
                            grow:true,
                            labelAlign: 'top',
                            name: 'qualifications',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Work Environment",
                            labelAlign: 'top',
                            name: 'work_environment',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Education Experience",
                            labelAlign: 'top',
                            name: 'education_experience',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Else",
                            labelAlign: 'top',
                            name: 'summary_end',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'hidden',
                            name: 'deleted',
                        },
                        {
                            xtype: 'hidden',
                            name: 'id_dep',
                        },{
                            xtype: 'hidden',
                            name: 'id_department',
                        },
                        {
                            xtype: 'hidden',
                            name: 'status',
                        },
                    ],
                    buttons:[
/*----New Revision----*/
                       {
                            text:"New Revision",
                            width: 120,
                            disabled: disable_edit,//rights rule
                            listeners: {
                                afterrender: function(obj) {
                                    var new_status = Ext.getCmp('form_jobDescription').getForm().getFields();
                                    var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                                    if(select) {
                                        var id = select.data.id;
                                        var status = select.data.status;
                                        var title = select.data.job_title;
                                        if ((status == 'New') && ((title)||(title!=''))) {
                                            obj.hide(true);
                                        }
                                    }
                                    else{
                                         obj.hide(true);
                                        } 
                                    }
                            },
                            handler: function(){
                                var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                                if (select) {
                                    Ext.MessageBox.confirm(lan.attention, "Are you sure, to create new revision?", function(btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: 'scripts/job_description.php',
                                                method: 'POST',
                                                params: { 'new_revision':true, "id": select.get('id')},
                                                success: function(response) {
                                                        var JSON = response.responseText;
                                                        var decoded = Ext.decode(JSON);
                                                        var fields = Ext.getCmp('form_jobDescription').getForm().getFields();
                                                        var job_title = getFieldByName(fields, 'job_title');
                                                            job_title.setConfig('readOnly', true);
                                                        // var summary = getFieldByName(fields, 'summary');
                                                        //     summary.setConfig('readOnly', true);          
                                                        var create_date_field = getFieldByName(fields, 'create_date');
                                                        var d = new Date();
                                                        var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                                                            create_date_field.setValue(now);
                                                            create_date_field.setConfig('readOnly', true);
                                                        // var prepared_date_field = getFieldByName(fields, 'prepared_date');
                                                        //     prepared_date_field.setValue(now);
                                                        //     prepared_date_field.setConfig('readOnly', true);    
                                                        var revision_field = getFieldByName(fields, 'revision');    
                                                        var revision =  revision_field.getValue();
                                                            if(job_title){
                                                                // revision = (parseInt(revision,16)+1).toString(16).toUpperCase();
                                                                revision_field.setValue(revision);
                                                            } else {
                                                                revision_field.setValue('A');
                                                            }
                                                            revision_field.setConfig('readOnly', true);
                                                        var user_name = getUser();
                                                        function getUser() {
                                                            Ext.Ajax.request({
                                                                url: 'scripts/job_description.php?getUser=true',
                                                                method: 'POST',
                                                                params: {
                                                                    id_user: id_user
                                                                },
                                                                success: function (response) {
                                                                    var data = Ext.decode(response.responseText);
                                                                    var fields = form.getFields();
                                                                    console.log(fields);
                                                                    fields.each(function (item) {
                                                                        for (var k in data) {
                                                                            if (item.getName() == k && data[k] != null) {
                                                                                item.setValue(data[k]);
                                                                                item.setConfig('readOnly', false);
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                            });
                                                        }
                                               
                                                        WindowForm_jobDescription.destroy();
                                                        show_jobDescription_add(fields);

                                                        Ext.getCmp('grid_jobDescription_id').store.load();
                                                        Ext.getCmp('grid_jobDescription_id').getView().refresh();
                                                        
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
/*----Approved----*/
                        {
                            text:"Approved",
                            width: 120,
                            disabled: disable_edit,//rights rule
                            listeners: {
                                afterrender: function(obj) {
                                    var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                                    if(select) {
                                        var id = select.data.id;
                                        var status = select.data.status;
                                        var title = select.data.job_title;
                                            if(title){
                                                var fields = Ext.getCmp('form_jobDescription').getForm().getFields();
                                                var job_title = getFieldByName(fields, 'job_title');
                                                job_title.setConfig('readOnly', true);  
                                            }
                                        if ((status == 'Approved')&&((title)||(title!=''))) {
                                            obj.hide(true);
                                            var form = Ext.getCmp('form_jobDescription').getForm();
                                                form.getFields().each(function (item) {
                                                item.setConfig('readOnly', true);
                                                });
                                        }
                                    }else{
                                         obj.hide(true);
                                    } 
                                    var fields = Ext.getCmp('form_jobDescription').getForm().getFields();
                                    var create_date = getFieldByName(fields, 'create_date');
                                        create_date.setConfig('readOnly', true);
                                    var revision = getFieldByName(fields, 'revision');
                                        revision.setConfig('readOnly', true);
                                    var prepared_date = getFieldByName(fields, 'prepared_date');
                                        var d = new Date();
                                        var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                                    prepared_date.setValue(now);

                                }
                            },
                            handler: function(){
                                var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                                if (select) {
                                    Ext.MessageBox.confirm(lan.attention, "Are you sure, to change revision's status?", function(btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: 'scripts/job_description.php',
                                                method: 'POST',
                                                params: { 'approved':true, "id": select.get('id')},
                                                success: function(response) {
                                                    var JSON = response.responseText;
                                                        var fields = Ext.getCmp('form_jobDescription').getForm().getFields();
                                                        var prepared_date = getFieldByName(fields, 'prepared_date');
                                                        var d = new Date();
                                                        var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                                                        prepared_date.setValue(now);
                                                    if (JSON) {
                                                        try{
                                                            var decoded = Ext.decode(JSON);
                                                            if(decoded.success == false){
                                                                Ext.MessageBox.alert(lan.error, decoded.message);
                                                            }else{
                                                                Ext.MessageBox.alert(lan.succ,'Revision is approved');
                                                                WindowForm_jobDescription.destroy();
                                                                Ext.getCmp('grid_jobDescription_id').store.load();
                                                                Ext.getCmp('grid_jobDescription_id').getView().refresh();
                                                            }
                                                        }catch(e) {
                                                            Ext.MessageBox.alert(lan.error, lan.error+' ' + e.name + ":" + e.message + "\n" + e.stack);
                                                        }
                                                    }else{
                                                        Ext.MessageBox.alert(lan.error, '');
                                                    }
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
/*----Save----*/                        
                        {
                            text:lan.save,
                            width: 120,
                            disabled: disable_edit,//rights rule
                            iconCls:'save',
                            listeners: {
                                afterrender: function(obj) {
                                    var select = Ext.getCmp('grid_jobDescription_id').getView().getSelectionModel().getSelection()[0];
                                    if(select) {
                                        var id = select.data.id;
                                        var status = select.data.status;
                                        var title = select.data.job_title;
                                        if (status == 'Approved') {
                                         obj.hide(true);
                                        }
                                    }
                                }
                            },
                            handler: function() {
                                var form = Ext.getCmp('form_jobDescription').getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/job_description.php',
                                        waitMsg: lan.saving,
                                        wait: true,
                                        scope: this,
                                        method: 'post',
                                        params: {'addedit':true,'idrow':idrow},
                                        success: function(fp, o) {
                                            Ext.MessageBox.alert(lan.succ, lan.save);
                                            WindowForm_jobDescription.destroy();
                                            jobDescription_store.load();
                                        },
                                        failure: function(fp, o) {
                                            Ext.MessageBox.alert(lan.fail, o.result.message);
                                        }
                                    });
                                }
                            }
                        },
/*----Cancel----*/                         
                        {
                            text:lan.cancel,
                            width: 120,
                            iconCls: 'cancel',
                            handler:function(){
                                WindowForm_jobDescription.destroy();
                            }
                        }]
                })
            ]
        });
    }

    WindowForm_jobDescription.show();

    var form = Ext.getCmp("form_jobDescription").getForm();

    if(idrow) {
        Ext.Ajax.request({
            url: 'scripts/job_description.php?getJobDescriptionById=true',
            method: 'POST',
            params: {
                id: idrow
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var fields = form.getFields();
                fields.each(function (item) {
                    for (var k in data) {
                        if (item.getName() == k && data[k] != null) {
                            item.setValue(data[k]);
                        }
                    }
                });
            },
            failure: function (response) {
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
    }
}


function show_jobDescription_view(idrow, select, disable_view){
    store_jd_job_title.load();
    store_jd_department.load();
    store_jd_reports_to.load();
    store_jd_revision.load();

    var texttype = lan.view;

    if(!WindowForm_jobDescription) {

        WindowForm_jobDescription = new Ext.Window({
            height: '75%',
            width: '85%',
            title: texttype + ' ' + "Job Description",
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
            closable: true,
            modal: true,
            constrainHeader: true,
            listeners: {
                destroy: function () {
                    WindowForm_jobDescription = null;
                }
            },

            items: [
                new Ext.create('Ext.form.Panel', {
                    autoScroll: true,
                    bodyPadding: '2 2 2 3',
                    border: false,
                    id: 'form_jobDescription',
                    layout: {
                        align: 'stretch'
                    },
                    defaults: {
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'status',
                            margin: '0 45%',
                            value: 'New',
                            renderer: function (value, field) {
                                var color = 'blue';
                                if (value == 'Approved') {
                                    color = 'green'
                                }
                                else if (value == 'Archive') {
                                    color = 'black'
                                }
                                else if (value == 'Rejected') {
                                    color = 'red'
                                }
                                return '<span style="color:' + color + '; font-size: 25px; display: inline-block; padding: 5px 10px; border: 3px solid ' + color + ';"><b>' + value + '</b></span>';
                            }
                        },
                        {
                            xtype: 'container',
                            anchor: '96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: "Job Title",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'job_title',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: "Department",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'name',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: "Reports to",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'reports_to',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: "FLSA Status",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'flsa_status',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            },
                            ]
                        }, {
                            xtype: 'container',
                            anchor: '96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: "Revision",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'revision',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            }, {
                                 xtype: 'textfield',
                                fieldLabel: "Create date",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'create_date',
                                dataIndex: 'create_date',
                                style: {padding: '5px'},
                                anchor: '98%',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: "Prepared By",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'user_name',
                                allowBlank: false,
                                style: {padding: '5px'},
                                anchor: '98%'
                            }, {
                                xtype: 'datefield',
                                fieldLabel: "Prepared Date",
                                format: 'Y-m-d',
                                width: '25%',
                                labelAlign: 'top',
                                name: 'prepared_date',
                                style: {padding: '5px'},
                                anchor: '98%'
                            },
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Summary",
                            labelAlign: 'top',
                            name: 'summary',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            grow: true,
                            fieldLabel: "Essential Duties",
                            labelAlign: 'top',
                            name: 'essential_duties',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Qualifications",
                            grow: true,
                            labelAlign: 'top',
                            name: 'qualifications',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Work Environment",
                            labelAlign: 'top',
                            name: 'work_environment',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Education Experience",
                            labelAlign: 'top',
                            name: 'education_experience',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Else",
                            labelAlign: 'top',
                            name: 'summary_end',
                            style: {padding: '5px'},
                            anchor: '98%'
                        },
                        {
                            xtype: 'hidden',
                            name: 'deleted',
                        },
                        {
                            xtype: 'hidden',
                            name: 'id_dep',
                        },
                        {
                            xtype: 'hidden',
                            name: 'id_department',
                        },

                    ],
                    buttons: [
                        {
                            text: "Previous",
                            width: 100,
                            handler: function(){

                                var form = Ext.getCmp("form_jobDescription").getForm();
                                var fields =  Ext.getCmp('form_jobDescription').getForm().getFields();
                                var revision = getFieldByName(fields, 'revision').getValue();
                                var change_revision = (parseInt(revision,16)-1).toString(16);
                                var job_title = getFieldByName(fields, 'job_title').getValue();

                                Ext.Ajax.request({
                                    url: 'scripts/job_description.php?getChangeRevisionJobDescription=true',
                                    method: 'POST',
                                    params: {
                                        revision: change_revision, job_title:job_title
                                    },
                                    success: function (response) {
                                        var data = Ext.decode(response.responseText);
                                        var fields = form.getFields();
                                        fields.each(function (item) {
                                            for (var k in data) {
                                                if (item.getName() == k && data[k] != null) {
                                                    item.setValue(data[k]);
                                                }
                                            }
                                            item.setConfig('readOnly',true);
                                        });
                                    },
                                    failure: function (response) {
                                        Ext.MessageBox.alert(lan.error, response.responseText);
                                    }
                                });
                            }
                        },
                        {
                            text: "Next",
                            width: 100,
                            handler: function(){

                                var form = Ext.getCmp("form_jobDescription").getForm();
                                var fields =  Ext.getCmp('form_jobDescription').getForm().getFields();
                                var revision = getFieldByName(fields, 'revision').getValue();
                                var change_revision = (parseInt(revision,16)+1).toString(16);
                                var job_title = getFieldByName(fields, 'job_title').getValue();

                                Ext.Ajax.request({
                                    url: 'scripts/job_description.php?getChangeRevisionJobDescription=true',
                                    method: 'POST',
                                    params: {
                                        revision: change_revision, job_title:job_title
                                    },
                                    success: function (response) {
                                        var data = Ext.decode(response.responseText);
                                        var fields = form.getFields();
                                        fields.each(function (item) {
                                            for (var k in data) {
                                                if (item.getName() == k && data[k] != null) {
                                                    item.setValue(data[k]);
                                                }
                                            }
                                            item.setConfig('readOnly',true);
                                        });
                                    },
                                    failure: function (response) {
                                        Ext.MessageBox.alert(lan.error, response.responseText);
                                    }
                                });
                            }
                        },
                        {
                            text: lan.cancel,
                            width: 100,
                            iconCls: 'cancel',
                            handler: function () {
                                WindowForm_jobDescription.destroy();
                            }
                        }
                    ]
                })
            ]
        });
    }

    WindowForm_jobDescription.show();

    var form = Ext.getCmp("form_jobDescription").getForm();

    if(idrow) {
        Ext.Ajax.request({
            url: 'scripts/job_description.php?getJobDescriptionById=true',
            method: 'POST',
            params: {
                id: idrow
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var fields = form.getFields();
                fields.each(function (item) {
                    for (var k in data) {
                        if (item.getName() == k && data[k] != null) {
                            item.setValue(data[k]);
                        }
                    }
                    item.setConfig('readOnly',true);
                });
            },
            failure: function (response) {
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
    }
}


function show_jobDescription_add(fields, disable_add){
    store_jd_job_title.load();
    store_jd_department.load();
    store_jd_reports_to.load();
    store_jd_revision.load();
    var texttype = lan.add;



    if(!WindowForm_jobDescription){
    
        WindowForm_jobDescription = new Ext.Window({
            height: '75%',
            width: '85%',
            title: texttype+' '+"Job Description",
            closeAction: 'destroy',
            layout: 'fit',
            resizable: true,
            closable: true,
            modal: true,
            constrainHeader: true,
            listeners: {
                destroy: function(){
                    WindowForm_jobDescription = null;
                }
            },

            items:[
                new Ext.create('Ext.form.Panel', {
                    autoScroll: true,
                    bodyPadding: '2 2 2 3',
                    border: false,
                    id: 'form_jobDescription',
                    layout: {
                        align: 'stretch'
                    },
                    defaults: {
                        msgTarget: 'side'
                    },
                    items:[
                        {
                            xtype:'displayfield',
                            name: 'status',
                            margin: '0 45%',
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
                            xtype: 'container',
                            anchor:'96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items:[{
                                xtype:'combobox',
                                fieldLabel: "Job Title",
                                width: '25%',
                                store: store_jd_job_title,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'job_title',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                                xtype:'combobox',
                                fieldLabel: "Department",
                                width: '25%',
                                store: store_jd_department,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'name',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                                xtype:'combobox',
                                fieldLabel: "Reports to",
                                width: '25%',
                                store: store_jd_reports_to,
                                typeAhead: true,
                                lazyRender: true,
                                displayField: 'value',
                                valueField: 'value',
                                labelAlign: 'top',
                                name: 'reports_to',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },{
                               xtype: 'textfield',
                                fieldLabel: "FLSA Status",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'flsa_status',
                                allowBlank: false,
                                style: { padding: '5px' },
                                anchor: '98%'
                            },
                            ]
                        },{
                            xtype: 'container',
                            anchor:'96%',
                            layout: 'hbox',
                            margin: '2 2 2 2',
                            items:[{
                                xtype: 'textfield',
                                fieldLabel: "Revision",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'revision',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype: 'textfield',
                                fieldLabel: "Create date",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'create_date',
                                dataIndex: 'create_date',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype: 'textfield',
                                fieldLabel: "Prepared By",
                                width: '25%',
                                labelAlign: 'top',
                                name: 'user_name',
                                style: { padding: '5px' },
                                anchor: '98%',
                                readOnly: true
                            },{
                                xtype:'datefield',
                                fieldLabel: "Prepared Date",
                                format:'Y-m-d',
                                width: '25%',
                                labelAlign: 'top',
                                name: 'prepared_date',
                                style: { padding: '5px' },
                                anchor: '98%'
                            },
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Summary",
                            labelAlign: 'top',
                            name: 'summary',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype:'textareafield',
                            grow:true,
                            fieldLabel: "Essential Duties",
                            labelAlign: 'top',
                            name: 'essential_duties',
                            style: { padding: '5px' },
                            anchor:'98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Qualifications",
                            grow:true,
                            labelAlign: 'top',
                            name: 'qualifications',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Work Environment",
                            labelAlign: 'top',
                            name: 'work_environment',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Education Experience",
                            labelAlign: 'top',
                            name: 'education_experience',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: "Else",
                            labelAlign: 'top',
                            name: 'summary_end',
                            style: { padding: '5px' },
                            anchor: '98%'
                        },
                        {
                            xtype: 'hidden',
                            name: 'deleted',
                        },
                        {
                            xtype: 'hidden',
                            name: 'id_dep',
                        },{
                            xtype: 'hidden',
                            name: 'id_department',
                        },
                        {
                            xtype: 'hidden',
                            name: 'status',
                        },
                    ],
                    buttons:[
                        {
                            text:lan.save,
                            width: 120,
                            disabled: disable_add,//rights rule
                            iconCls:'save',
                            handler: function() {
                                var form = Ext.getCmp('form_jobDescription').getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/job_description.php',
                                        waitMsg: lan.saving,
                                        wait: true,
                                        scope: this,
                                        method: 'post',
                                        params: {'add':true},
                                        success: function(fp, o) {
                                            Ext.MessageBox.alert(lan.succ, lan.save);
                                            WindowForm_jobDescription.destroy();
                                            jobDescription_store.load();
                                        },
                                        failure: function(fp, o) {
                                            Ext.MessageBox.alert(lan.fail, o.result.message);
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text:lan.cancel,
                            width: 120,
                            iconCls: 'cancel',
                            handler:function(){
                                WindowForm_jobDescription.destroy();
                            }
                        }]
                })
            ]
        });
    }


    WindowForm_jobDescription.show();


    if(fields){
        var form = Ext.getCmp('form_jobDescription').getForm();
        var job_title_field = getFieldByName(fields, 'job_title');
        var name = job_title_field.value;
        var id_dep_field = getFieldByName(fields, 'name');
        var id_dep = id_dep_field.value;
        var revision_field = getFieldByName(fields, 'revision');
        var rev = (parseInt(revision_field.value,16)+1).toString(16).toUpperCase();
        var reports_to_field = getFieldByName(fields, 'reports_to');
        var reports_to = reports_to_field.value;
        var flsa_status_field = getFieldByName(fields, 'flsa_status');
        var flsa_status = flsa_status_field.value;

        var summary_field = getFieldByName(fields, 'summary');
        var summary = summary_field.value; 
        var essential_duties_field = getFieldByName(fields, 'essential_duties');
        var essential_duties = essential_duties_field.value; 
        var qualifications_field = getFieldByName(fields, 'qualifications');
        var qualifications = qualifications_field.value; 
        var work_environment_field = getFieldByName(fields, 'work_environment');
        var work_environment = work_environment_field.value; 
        var education_experience_field = getFieldByName(fields, 'education_experience');
        var education_experience = education_experience_field.value; 
        var summary_end_field = getFieldByName(fields, 'summary_end');
        var summary_end = summary_end_field.value;

        
      
        form.getFields().each(function (item) {
            item.getValue();    
            item.setConfig('readOnly', false);
        });    
  
        var user_name = getUser(fields);
        function getUser() {
            Ext.Ajax.request({
                url: 'scripts/job_description.php?getUser=true',
                method: 'POST',
                params: {
                    id_user: id_user
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    var fields = form.getFields();
                    fields.each(function (item) {
                        for (var k in data) {
                            if (item.getName() == k && data[k] != null) {
                                item.setValue(data[k]);
                                item.setConfig('readOnly', true);
                            }
                        }

                    });
                    var create_date_field = getFieldByName(fields, 'create_date');
                    var d = new Date();
                    var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                        create_date_field.setValue(now);
                        create_date_field.setConfig('readOnly', true); 

                    var revision_field = getFieldByName(fields, 'revision'); 
                        revision_field.setValue(rev);
                        revision_field.setConfig('readOnly', true);
 
                   var job_title_field = getFieldByName(fields, 'job_title');
                       job_title_field.setValue(name);
                       job_title_field.setConfig('readOnly', true);

                    var id_dep_field = getFieldByName(fields, 'name');
                        id_dep_field.setValue(id_dep);  

                    var reports_to_field = getFieldByName(fields, 'reports_to');
                        reports_to_field.setValue(reports_to);

                    var flsa_status_field = getFieldByName(fields, 'flsa_status');
                        flsa_status_field.setValue(flsa_status);

                    // var prepared_date_field = getFieldByName(fields, 'prepared_date');
                    //  console.log(prepared_date_field);
                    //  console.log(now);
                        // prepared_date_field.setValue(now);
                        // prepared_date_field.setConfig('readOnly', true);     
      
                    var summary_field = getFieldByName(fields, 'summary');
                       summary_field.setValue(summary);
                    var essential_duties_field = getFieldByName(fields, 'essential_duties');
                       essential_duties_field.setValue(essential_duties);
                    var qualifications_field = getFieldByName(fields, 'qualifications');
                       qualifications_field.setValue(qualifications);
                    var work_environment_field = getFieldByName(fields, 'work_environment');
                        work_environment_field.setValue(work_environment);
                    var education_experience_field = getFieldByName(fields, 'education_experience');
                       education_experience_field.setValue(education_experience);
                    var summary_end_field = getFieldByName(fields, 'summary_end');
                       summary_end_field.setValue(summary_end);
                
                                         
                },
                failure: function (response) {
                    Ext.MessageBox.alert(lan.error, response.responseText);
                }
            });
        }
    }
    else{
        var fields =  Ext.getCmp('form_jobDescription').getForm().getFields();
        var form = Ext.getCmp("form_jobDescription").getForm();
        var job_title = getFieldByName(fields, 'job_title').getValue();
        var revision_field = getFieldByName(fields, 'revision');  
                revision_field.setValue('A'); 
                revision_field.setConfig('readOnly', true);   
        var create_date_field = getFieldByName(fields, 'create_date');
        var d = new Date();
        var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                create_date_field.setValue(now);
                create_date_field.setConfig('readOnly', true);
        var user_name = getUser();
        function getUser() {
            Ext.Ajax.request({
                url: 'scripts/job_description.php?getUser=true',
                method: 'POST',
                params: {
                    id_user: id_user
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    var fields = form.getFields();
                    fields.each(function (item) {
                        for (var k in data) {
                            if (item.getName() == k && data[k] != null) {
                                item.setValue(data[k]);
                            }
                        }
                    });
                },
                failure: function (response) {
                    Ext.MessageBox.alert(lan.error, response.responseText);
                }
            });
        }
        
    }

}