function getDaysCount($result_id, $to_date) {
    if(typeof $to_date === "string" || $to_date === null) return;
    var now = new Date();

    // If you need counter with time, delete this strings
    now = new Date(now.getYear(), now.getMonth(), now.getDate());
    $to_date = new Date($to_date.getYear(), $to_date.getMonth(), $to_date.getDate());
    // <---- cut here;

    var newDate =  parseInt( (now - $to_date) / 86400000);
    Ext.getCmp($result_id).setValue(newDate);
}
function getDaysRemain($result_id, $from_date, $to_date_id) {
    if(typeof $from_date === "string" || $from_date === null) return;

    var to_date = Ext.getCmp($to_date_id).getValue();
    if(typeof to_date === "string") return;
    if(to_date == null || to_date.length < 1) to_date = new Date();

    // If you need counter with time, delete this strings
    to_date = new Date(to_date.getYear(), to_date.getMonth(), to_date.getDate());
    $from_date = new Date($from_date.getYear(), $from_date.getMonth(), $from_date.getDate());
    // <---- cut here;

    var newDate =  parseInt( ($from_date - to_date) / 86400000);
    var object = Ext.getCmp($result_id);
    object.setValue(newDate);
    if(newDate < 0) object.addCls("daysCount-Warning");
    else{ object.removeCls("daysCount-Warning")}
}

var select_flag_resp = false;

function getItems(id, items, rights, time_id){
    var disable_change_assignee = true;
    var disable_change_due_date = true;
    var disable_change_new_due_date = true;
    var disable_change_responsible = true;

    if(rights){//rights rule
        disable_change_assignee = (rights.indexOf('change_assignee')!=-1)? false : true;
        disable_change_due_date = (rights.indexOf('change_due_date')!=-1)? false : true;
        disable_change_new_due_date = (rights.indexOf('change_new_due_date')!=-1)? false : true;
        disable_change_responsible = (rights.indexOf('change_responsible')!=-1)? false : true;
    }

    var form_header = [{
            xtype: 'container',
            anchor: '100%',
            items:[{
                xtype: 'container',
               // columnWidth:1,
                layout: 'anchor',
                items: [{
                    xtype:'hidden',
                    name:'draft',
                    value:1
                },
                 {
                    xtype:'hidden',
                    name:'idx',
                },
                {
                    xtype:'hidden',
                    name:'time_id',
                    id: 'time_id'+time_id
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.status,
                    name: 'Status',
                    allowBlank: false,
                    labelWidth: style.input2.labelWidth,
                    anchor: style.input2.anchor,
                    store: store_task_status,
                    value:'1',
                    displayField: 'value',
                    valueField: 'id',
                    readOnly:true
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.responsible,
                    id: 'Responsible_'+id+time_id,
                    name: 'Responsible',
                    queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor: style.input2.anchor,
                    store: data_store_Responsible,
                    displayField: 'value',
                    valueField: 'id',
                    autoSelect: true,
                    value:id_user,
                    readOnly: disable_change_responsible,//rights rule
                    validator: function (val) {
                            errMsg = lan.user_not_found;
                        return (data_store_users.find('value', val)!=-1) ? true : errMsg;
                    }
                },
                {
                    xtype:'combobox',
                    fieldLabel: lan.assignedTo,
                    id: 'Assignedto_'+id+time_id,
                    name: 'AssignedTo',
                    queryMode: 'remote',
                    allowBlank: false,
                    typeAhead: true,
                    minChars:2,
                    triggerAction: 'all',
                    lazyRender: true,
                    enableKeyEvents: true,
                    labelWidth: style.input2.labelWidth,
                    anchor: style.input2.anchor,
                    store: data_store_AssignedTo,
                    displayField: 'value',
                    valueField: 'id',
                    autoSelect: true,
                    readOnly: disable_change_assignee,//rights rule
                    validator: function (val) {
                        errMsg = lan.user_not_found;
                        return (data_store_users.find('value', val)!=-1) ? true : errMsg;
                    },
                    listeners:{
                        select:function() {
                            Ext.getCmp('Assignmentdate_' + id+time_id).setValue(new Date());
                            var el = Ext.getCmp('Assignedto_'+id+time_id);
                            if(el.getValue()!=id_user){
                                var fields  = el.up('form').getForm().getFields()
                                setReadOnly(fields, id);
                                setRightsCapabilities(fields, rights, id);
                            }
                        }
                    }
                },
                    {
                        xtype: 'container',
                        anchor: style.input2.anchor,
                        id:'RequestedDate_Panel'+id+time_id,
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d H:i:s',
                                altFormats: 'Y-m-d H:i:s',
                                width: style.input2.width,
                                name: 'RequestedDate',
                                id:'RequestedDate_'+id+time_id,
                                fieldLabel: lan.requested_date,
                                labelWidth: style.input2.labelWidth,
                                readOnly:true,
                                flex: 25,
                                listeners:{
                                    change: function () {
                                        getDaysCount('RequestedDate_Days'+id+time_id, this.value);
                                    }
                                }// listeners
                            },
                            {
                                xtype: "displayfield",
                                id: 'RequestedDate_Days'+id+time_id,
                                readOnly: true,
                                value: "0",
                                labelWidth: style.input2.labelWidth,
                                cls: "daysCount"
                            }
                        ] // items
                    }, // RequestedDate_Panel
                    {

                        xtype:'container',
                        anchor: style.input2.anchor,
                        id:'Assignmentdate_Panel'+id+time_id,
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d H:i:s',
                                altFormats: 'Y-m-d H:i:s',
                                width: style.input2.width,
                                allowBlank: false,
                                name: 'AssignmentDate',
                                id:'Assignmentdate_'+id+time_id,
                                fieldLabel: lan.assignment_date,
                                labelWidth: style.input2.labelWidth,
                                readOnly:true,
                                flex: 25,
                                listeners:{
                                    change: function () {
                                        getDaysCount('Assignmentdate_Days'+id+time_id, this.value);
                                    }
                                }// listeners
                            },
                            {
                                xtype: "displayfield",
                                id: 'Assignmentdate_Days'+id+time_id,
                                readOnly: true,
                                value: "0",
                                labelWidth: style.input2.labelWidth,
                                cls: "daysCount"
                            }
                        ]
                    }, // Assignmentdate_Panel
                    {

                        xtype:'container',
                        anchor: style.input2.anchor,
                        id:'Duedate_Panel'+id+time_id,
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                altFormats: 'Y-m-d',
                                invalidText: lan.error_date_yyyymmdd,
                                width: style.input2.width,
                                name: 'DueDate',
                                id: 'Duedate_'+id+time_id,
                                fieldLabel: lan.dueDate,
                                labelWidth: style.input2.labelWidth,
                                allowBlank:false,
                                flex: 25,
                                readOnly: disable_change_due_date,//rights rule
                                listeners:{
                                    change: function () {
                                        getDaysRemain('Duedate_Days'+id+time_id, this.value, 'CompletionDate_'+id+time_id);
                                    }
                                }// listeners
                            },
                            {
                                xtype: "displayfield",
                                id: 'Duedate_Days'+id+time_id,
                                readOnly: true,
                                value: "0",
                                labelWidth: style.input2.labelWidth,
                                cls: "daysCount"
                            }
                        ]
                    }, // Duedate_Panel
                    {
                        xtype:'container',
                        anchor: style.input2.anchor,
                        id:'NewDueDate_Panel'+id+time_id,
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                altFormats: 'Y-m-d',
                                invalidText: lan.error_date_yyyymmdd,
                                fieldLabel: lan.newDueDate,
                                name: 'NewDueDate',
                                id: 'NewDueDate_'+id+time_id,
                                allowBlank: true,
                                labelWidth: style.input2.labelWidth,
                                width: style.input2.width,
                                flex: 25,
                                readOnly: disable_change_new_due_date,//rights rule
                                listeners:{
                                    change: function () {
                                        getDaysRemain('NewDueDate_Days'+id+time_id, this.value, 'CompletionDate_'+id+time_id);
                                    }
                                }// listeners
                            },
                            {
                                xtype: "displayfield",
                                id: 'NewDueDate_Days'+id+time_id,
                                readOnly: true,
                                value: "0",
                                labelWidth: style.input2.labelWidth,
                                cls: "daysCount"
                            }
                        ]
                    }, // NewDueDate_Panel
                    {
                        
                        xtype:'container',
                        anchor: style.input2.anchor,
                        id:'CompletionDate_Panel'+id+time_id,
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d H:i:s',
                                altFormats: 'Y-m-d H:i:s',
                                fieldLabel: lan.completion_date,
                                name: 'CompletionDate',
                                id: 'CompletionDate_' + id+time_id,
                                labelWidth: style.input2.labelWidth,
                                width: style.input2.width,
                                value: null,
                                readOnly:true,
                                flex: 25,
                                listeners:{
                                    change: function () {
                                        getDaysCount('CompletionDate_Days'+id+time_id, this.value);
                                        getDaysRemain('Duedate_Days'+id+time_id, Ext.getCmp('Duedate_'+id+time_id).getValue(), 'CompletionDate_'+id+time_id);
                                        getDaysRemain('NewDueDate_Days'+id+time_id, Ext.getCmp('NewDueDate_'+id+time_id).getValue(), 'CompletionDate_'+id+time_id);
                                    }
                                }// listeners
                            },
                            {
                                xtype: "displayfield",
                                id: 'CompletionDate_Days'+id+time_id,
                                readOnly: true,
                                value: "0",
                                labelWidth: style.input2.labelWidth,
                                cls: "daysCount",
                            }
                        ]
                    }, // CompletionDate_Panel
                {
                    xtype:'textfield',
                    fieldLabel: lan.requestID,
                    name: 'RequestID',
                    id: 'RequestID_'+id+time_id,
                    allowBlank: true,
                    labelWidth: style.input2.labelWidth,
                    anchor: style.input2.anchor,
                    readOnly:true
                }
                   
                ]
            },
            {
               items
            },
{
    xtype:'displayfield',
    name:"Message",
    id:'message_'+id+time_id,
   style:'margin-bottom:5px; font-size:14px; text-align: center',  
    //cls:'message'            
}
]
}];

    return form_header
}