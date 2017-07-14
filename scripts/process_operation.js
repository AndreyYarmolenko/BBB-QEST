 var view = false;
 var winProcess =  null;
 var WindowProcess = null;
 var documentGridStoreProcess =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

Ext.apply(Ext.data.SortTypes, {
    asLower: function (str) {
        return str.toLowerCase();
    }
});

 var storeProcessGrid = new Ext.data.Store({
        fields: ['id', {type: 'string', name: 'operation_procedure', sortType: 'asLower'}, {type: 'string', name: 'number', sortType: 'asLower'}],
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=operation_data',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
        simpleSortMode: true
        }
    });

 var storeOperationNumber = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getOperationNumber=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

 function getJS(dim){
        if(dim){
            if(dim.length>0){
                dimJS = JSON.stringify(dim);
                }
                else {
                    dimJS=null
                }
        }
        else {
            dimJS = null;
        }
        return dimJS;
    }

function loadProcessOperation(time_id, rec_process){
    data = rec_process.data;
    Ext.getCmp('id_'+time_id).setValue(data.id_op);
    Ext.getCmp('number_'+time_id).setValue(data.proc_number);
    Ext.getCmp('operation_procedure_'+time_id).setValue(data.operation_procedure);
    Ext.getCmp('descriptionOperation_'+time_id).setValue(data.descriptionOperation);
    if(data.tool){
        var tools = Ext.decode(data.tool);
        storeGridTool.loadData(tools);
    }
    if(data.gage){
        var gages = Ext.decode(data.gage);
        storeGridGage.loadData(gages);
    }
    if(data.work_st){
        var workstations = Ext.decode(data.work_st);
        storeGridWorkstation.loadData(workstations);
    }
    if(data.equip){
        var equipments = Ext.decode(data.equip);
        storeGridEquipment.loadData(equipments);
    }
    if(data.files){
        var files = Ext.decode(data.files);
        documentGridStoreProcess.loadData(files);
    }
}

function checkCapex(time_id){
    var capex_flag = false;
    var el = [];
    storeOperationGrid.each(function(record){
        if(record.get('tool')){
            el['tool'] = Ext.decode(record.get('tool'));
            for(var i =0; i<el.tool.length; i++){
                    if(el.tool[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('gage')){
            el['gage'] = Ext.decode(record.get('gage'));
            for(var i =0; i<el.gage.length; i++){
                    if(el.gage[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('equip')){
            el['equip'] = Ext.decode(record.get('equip'));
            for(var i =0; i<el.equip.length; i++){
                    if(el.equip[i].capex==1){
                        capex_flag=true
                    }
                }
        }
        if(record.get('work_st')){
            el['work_st'] = Ext.decode(record.get('work_st'));
            for(var i =0; i<el.work_st.length; i++){
                    if(el.work_st[i].capex==1){
                        capex_flag=true
                    }
                }
        }
    });
    if(capex_flag===true){
        Ext.getCmp('capex_create'+time_id).setValue(1);
    }
    else {
        Ext.getCmp('capex_create'+time_id).setValue(0);
        storeProjectPurpose.each(function(record){
            record.data.result="";
        });
        storeProjectDetails.each(function(record){
            record.data.result="";
            record.data.qty="";
        });
    }
}

function checkOperationNumber(text){
    var exist_number=false;
     storeOperationGrid.each(function(record){
        if(record.get('op_number')==text){
            exist_number = true;
        }
     });
     return exist_number;
}

function getStorePDS(){
    var tool_pds = [];
    var gage_pds = [];
    var work_st_pds = [];
    var equip_pds = [];
    var files_pds = [];
    var flag = 1;
    var approved = 0;

    storeGridTool.each(function(record){
        tool_pds.push({tool_id:record.get('tool_id'), number:record.get('number'), needs:record.get('needs'), description:record.get('description'), qty:record.get('qty'), life_time:record.get('life_time'), estimated_unit_price:record.get('estimated_unit_price'), total_price:record.get('estimated_total_price'), pending_design:record.get('pending_design'), capex:record.get('capex'), approved:record.get('approved')});
        if(!record.get('estimated_unit_price')){
            flag=0;
        }
        if(record.get('approved')!=1){
            approved++;
        }
    });
    storeGridGage.each(function(record){
        gage_pds.push({gage_id:record.get('gage_id'), number:record.get('number'), needs:record.get('needs'), description:record.get('description'), qty:record.get('qty'), life_time:record.get('life_time'), estimated_unit_price:record.get('estimated_unit_price'), total_price:record.get('estimated_total_price'), pending_design:record.get('pending_design'), capex:record.get('capex'), approved:record.get('approved')});
        if(!record.get('estimated_unit_price')){
            flag=0;
        }
        if(record.get('approved')!=1){
            approved++;
        }
    });
    storeGridWorkstation.each(function(record){
        work_st_pds.push({workstation_id:record.get('workstation_id'), number:record.get('number'), needs:record.get('needs'), description:record.get('description'), qty:record.get('qty'), life_time:record.get('life_time'), estimated_unit_price:record.get('estimated_unit_price'), total_price:record.get('estimated_total_price'), pending_design:record.get('pending_design'), capex:record.get('capex'), approved:record.get('approved')});
        if(!record.get('estimated_unit_price')){
            flag=0;
        }
        if(record.get('approved')!=1){
            approved++;
        }
    });
    storeGridEquipment.each(function(record){
        equip_pds.push({equipment_id:record.get('equipment_id'), number:record.get('number'), needs:record.get('needs'), description:record.get('description'), qty:record.get('qty'), life_time:record.get('life_time'), estimated_unit_price:record.get('estimated_unit_price'), total_price:record.get('estimated_total_price'), pending_design:record.get('pending_design'), capex:record.get('capex'), approved:record.get('approved')});
        if(!record.get('estimated_unit_price')){
            flag=0;
        }
        if(record.get('approved')!=1){
            approved++;
        }
    });

    documentGridStoreProcess.each(function(record){
        files_pds.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
    });
    
    var tool_pdsJS = getJS(tool_pds);
    var gage_pdsJS = getJS(gage_pds);
    var work_st_pdsJS = getJS(work_st_pds);
    var equip_pdsJS = getJS(equip_pds);
    var files_pdsJS = getJS(files_pds);
     if(approved!=0){
        flag = 0;
    }
    
    var result = {'flag':flag, 'approved':approved, 'tool':tool_pdsJS, 'gage':gage_pdsJS, 'equip': equip_pdsJS, 'work_st':work_st_pdsJS, files: files_pdsJS};
    return result;
}

function showOperationWin(inData){
   // action, time_id, title, view, id_op=null,add_tab=true, create_btn=true, pds=true, request_id=null, rec_process=null, out_source_id=null
    var action;
    var time_id = Date.parse(new Date());
    var title = "";
    var view;
    var id_op = null;
    var add_tab = true;
    var create_btn = true;
    var pds = true;
    var request_id = null;
    var rec_process = null;
    var out_source_id = null;

    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.action) action = inData.action;
        if(inData.title) title = inData.title;
        view = inData.view;
        add_tab = inData.add_tab;
        create_btn = inData.create_btn;
        pds = inData.pds;
        if(inData.request_id) request_id = inData.request_id;
        if(inData.rec_process) rec_process = inData.rec_process;
        if(inData.out_source_id) out_source_id = inData.out_source_id;
        if(inData.id_op) id_op = inData.id_op;
    }


    storeGridTool.removeAll();
    storeGridGage.removeAll();
    storeGridWorkstation.removeAll();
    storeGridEquipment.removeAll();
    documentGridStoreProcess.removeAll();
    var hdbtn = false;
    if((view===false&&create_btn===false)||(view===true)) hdbtn= true;

if(!winProcess){
    var item = getProcessOperationItem(time_id, view, id_op, pds, request_id);
    var form_dir = new Ext.create('Ext.form.Panel', {autoScroll: true, items: item});
    if(action=='edit' || action=='') {
        Ext.getCmp('number_'+time_id).setConfig('readOnly', true);
    }
    
    if(id_op&&rec_process==null){
        loadDataOperation(time_id, id_op, request_id);
    }
    if(rec_process!=null){
        var op_number = rec_process.get('op_number');
        loadProcessOperation(time_id, rec_process);
    }
    var winProcess = new Ext.Window({
        width: '100%',
        height: '100%',
        title: title,
        closeAction: 'destroy',
        id: 'winProcess'+time_id,
        layout: 'fit',
        resizable: true,
        closable: true,
        modal: true,
        constrainHeader: true,
        buttons: [{
            text:lan.save,
            iconCls:'save',
            hidden: hdbtn,
            handler:function(){
               var form = form_dir.getForm();
                saveOperational(action, time_id, form, true, pds, request_id, op_number, out_source_id);
                    //checkCapex(time_id);
                }
            },
        {
            text:lan.cancel,
            iconCls: 'cancel',
            hidden: hdbtn,
            handler:function(){
                winProcess.destroy();        
        }
        },{
            text: lan.add_to_process,
            iconCls: 'add',
            hidden: add_tab,
            handler:function(){
                Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                    if (btn == 'ok'){
                         if(checkOperationNumber(text)){
                            Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                         }
                         else{
                             op_number = text;
                             var id_op =Ext.getCmp('id_'+time_id).getValue();
                             var operation_procedure = Ext.getCmp('operation_procedure_'+time_id).getValue();
                            var proc_number = Ext.getCmp('number_'+time_id).getValue();
                            var descriptionOperation = Ext.getCmp('descriptionOperation_'+time_id).getValue();
                            var details = getStorePDS();
                            if(out_source_id&&out_source_id!==null){
                                var out_grid = Ext.getCmp(out_source_id);
                                out_grid.getStore().add({full: details.flag, approved:details.approved, id_op:id_op, op_number:op_number, proc_number: proc_number, operation_procedure:operation_procedure, descriptionOperation:descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                out_grid.getView().refresh();
                                var win_arr = [];
                                Ext.WindowMgr.each(function(win){
                                    win_arr.push(win);
                                });
                                win_arr[win_arr.length-1].destroy();
                                win_arr[win_arr.length-2].destroy();
                            }
                            else {
                                storeOperationGrid.add({full: details.flag, approved:details.approved, id_op:id_op, op_number:op_number, proc_number: proc_number, operation_procedure:operation_procedure, descriptionOperation:descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                Ext.getCmp('operation_grid'+time_id).getView().refresh();
                                checkCapex(time_id);
                                WindowViewTables.destroy();
                                winProcess.destroy();
                            }
                         }
                    }
                });
            }
        },{
            text: lan.save_add_to_proc,
            iconCls: 'save',
            hidden: create_btn,
            handler:function(){
                var form = form_dir.getForm();
                saveOperational('add', time_id, form, false, pds, request_id, op_number);
            }
        }],
        listeners: {
            destroy: function(){
               winProcess = null;
            }
        },
        items:form_dir
       });
    winProcess.show();
}
}

 var storeGridTool = new Ext.data.Store({
        fields: ['tool_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

 var storeGridGage = new Ext.data.Store({
        fields: ['gage_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

 var storeGridWorkstation = new Ext.data.Store({
        fields: ['workstation_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

var storeGridEquipment = new Ext.data.Store({
        fields: ['equipment_id', 'number', 'needs', 'description', 'qty', 'estimated_unit_price', 'estimated_total_price', 'life_time', {name:'pending_design',type: 'int'} , {name:'capex',  type: 'int'}, {name:'approved',  type: 'int'}],
});

 var storeOperationProcedures = new Ext.data.Store({
        fields:['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?operations=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

 function loadDataOperation(time_id, id_op, request_id){
    Ext.Ajax.request({
            url: 'scripts/ecr_form.php?getOperationData=true',
            method: 'POST',
            params:{
                id: id_op,
                request_id: request_id
            },
            success: function (response){
                var data = Ext.decode(response.responseText);
                if(data){
                    data = data.rows[0];
                    Ext.getCmp('id_'+time_id).setValue(data.id);
                    Ext.getCmp('number_'+time_id).setValue(data.number);
                    Ext.getCmp('operation_procedure_'+time_id).setValue(data.operation_procedure);
                    Ext.getCmp('descriptionOperation_'+time_id).setValue(data.descriptionOperation);
                    if(data.tools){
                        var tools = Ext.decode(data.tools);
                        storeGridTool.loadData(tools);
                    }
                    if(data.gages){
                        var gages = Ext.decode(data.gages);
                        storeGridGage.loadData(gages);
                    }
                    if(data.workstations){
                        var workstations = Ext.decode(data.workstations);
                        storeGridWorkstation.loadData(workstations);
                    }
                    if(data.equipments){
                        var equipments = Ext.decode(data.equipments);
                        storeGridEquipment.loadData(equipments);
                    }
                    if(data.files){
                        var files = Ext.decode(data.files);
                        documentGridStoreProcess.loadData(files);
                    }
                }
            },
            failure: function (response){ 
                Ext.MessageBox.alert(lan.error, response.responseText);
            }
        });
 }

function searchOperation(time_id){
    var tool = [];
    var gage = [];
    var work_st = [];
    var equip = [];
    var storeGridTool = Ext.getCmp('GridTools'+time_id).getStore();
    var storeGridGage = Ext.getCmp('GridTools'+time_id).getStore();
    var storeGridWorkstation = Ext.getCmp('GridTools'+time_id).getStore();
    var storeGridEquipment = Ext.getCmp('GridTools'+time_id).getStore();

    storeGridTool.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            tool.push({tool_id:record.get('tool_id'), qty:record.get('qty')});
        }
        else {
            tool.push({tool_id:record.get('tool_id')});
        }
        
    });

    storeGridGage.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            gage.push({gage_id:record.get('gage_id'), qty:record.get('qty')});
        }
        else {
            gage.push({gage_id:record.get('gage_id')});
        }
    });

    storeGridWorkstation.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            work_st.push({workstation_id:record.get('workstation_id'), qty:record.get('qty')});
        }
        else {
            work_st.push({workstation_id:record.get('workstation_id')});
        }
    });

    storeGridEquipment.each(function(record){
        if(record.get('qty')&&record.get('qty')!=0){
            equip.push({equipment_id:record.get('equipment_id'), qty:record.get('qty')});
        }
        else {
            equip.push({equipment_id:record.get('equipment_id')});
        }
    });

    var params ={};
    if(tool.length>0){
        toolJS = JSON.stringify(tool);
        params = $.extend({tools: toolJS}, params);
    }

    if(gage.length>0){
        gageJS = JSON.stringify(gage);
        params = $.extend({gages: gageJS}, params);
    }
    
     if(work_st.length>0){
        work_stJS = JSON.stringify(work_st);
        params = $.extend({workstations: work_stJS}, params);
    }
    
     if(equip.length>0){
        equipJS = JSON.stringify(equip);
        params = $.extend({equipments: equipJS}, params);
    }

    Ext.Ajax.request({
        url: 'scripts/ecr_form.php?searchOperation=true',
        method: 'POST',
        params: params,
        success: function(response) {
            var data = Ext.decode(response.responseText);
            if(data){
                storeOperationNumber.removeAll();
                var num = 0;
                if(data.count){
                    num = data.count;
                }
                Ext.getCmp('number_'+time_id).setConfig('fieldLabel',  lan.operation_procedure_id+': ('+num+'):');
           
                if(data.count>0){
                    storeOperationNumber.loadData(data.operations);
                }
            }
        },
        failure: function(response) {
             Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}


 function saveOperational(action, time_id, form, create_btn=true, pds, request_id, op_number, out_source_id){
    var tool = [];
    var gage = [];
    var work_st = [];
    var equip = [];
    var files = [];
    var id =null;
    var table_full = true;
    if(storeGridTool.data.length==0&&storeGridGage.data.length==0&&storeGridWorkstation.data.length==0&&storeGridEquipment.data.length==0){
        Ext.MessageBox.alert(lan.error, lan.can_not_empty);
        return
    }

    storeGridTool.each(function(record){
        if(record.get('qty')>0) {
            if(pds===false&&(record.get('estimated_unit_price')<=0||!record.get('estimated_unit_price'))){
                Ext.MessageBox.alert(lan.error, lan.not_estimated_price);
                table_full =  false
            }
            else {
                tool.push({tool_id:record.get('tool_id'), qty:record.get('qty'), estimated_unit_price:record.get('estimated_unit_price')});
            }
        }
        else {
            Ext.MessageBox.alert(lan.error, lan.incorrect_qty_tool);
            table_full =  false
        }
    });
    if(table_full===false) return

    storeGridGage.each(function(record){
        if(record.get('qty')>0) {
            if(pds===false&&(record.get('estimated_unit_price')<=0||!record.get('estimated_unit_price'))){
                Ext.MessageBox.alert(lan.error, lan.not_spec_estimated_price);
                table_full =  false
            }
            else {
                gage.push({gage_id:record.get('gage_id'), qty:record.get('qty'), estimated_unit_price:record.get('estimated_unit_price')});
             }
            }
            else {
                Ext.MessageBox.alert(lan.error, lan.incorrect_qty_gage);
                table_full =  false
            }
        });
    if(table_full===false) return

    storeGridWorkstation.each(function(record){
        if(record.get('qty')>0) {
            if(pds===false&&(record.get('estimated_unit_price')<=0||!record.get('estimated_unit_price'))){
                Ext.MessageBox.alert(lan.error, lan.not_spec_price_work);
                table_full =  false
            }
            else {
                work_st.push({workstation_id:record.get('workstation_id'), qty:record.get('qty'), estimated_unit_price:record.get('estimated_unit_price')});
                }
            }
            else {
                Ext.MessageBox.alert(lan.error, lan.incorrect_qty_work);
                table_full =  false
            }
    });
    if(table_full===false) return

    storeGridEquipment.each(function(record){
        if(record.get('qty')>0) {
            if(pds===false&&(record.get('estimated_unit_price')<=0||!record.get('estimated_unit_price'))){
                Ext.MessageBox.alert(lan.error, lan.not_spec_price_equip);
                table_full =  false
            }
            else {
                equip.push({equipment_id:record.get('equipment_id'), qty:record.get('qty'), estimated_unit_price:record.get('estimated_unit_price')});
            }
        }
        else {
            Ext.MessageBox.alert(lan.error, lan.incorrect_qty_equip);
            table_full =  false
        }
    });
    if(table_full===false) return

    documentGridStoreProcess.each(function(record){
        files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
    });

    toolJS = JSON.stringify(tool);
    gageJS = JSON.stringify(gage);
    work_stJS = JSON.stringify(work_st);
    equipJS = JSON.stringify(equip);
    filesJS = JSON.stringify(files);

    var params = {
        'tools' : toolJS,
        'gages' : gageJS,
        'workstations' : work_stJS,
        'equipments' : equipJS,
        'files' : filesJS
    };

    if(op_number!=null){
        params =$.extend({'op_number':op_number}, params);
    }

    if(form.isValid()) {
        form.submit({
            url: 'scripts/ecr_form.php?saveOperational=true&pds='+!pds+"&action="+action,
            waitMsg: lan.saving,
            wait: true,
            scope: this,
            method: 'post',
            params: params,
            success: function(form, action) {
                var data = Ext.decode(action.response.responseText);
                if(data.message){
                        Ext.MessageBox.alert(lan.succ, data.message);
                    }
                if(pds){//not Process Design case
                    storeProcessGrid.load();
                }
                else {//Process Design case
                    if(create_btn){//editing existing operation
                        var details = getStorePDS();
                        storeOperationGrid.each(function(record){
                            if(record.get('op_number')==op_number){
                                storeOperationGrid.remove(record);
                            }
                        });
                        if(!op_number||op_number==""){//during editing operation create new
                            Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                                if (btn == 'ok'){
                                    if(checkOperationNumber(text)){
                                        Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                     }
                                     else{
                                       /* if(out_source_id&&out_source_id!==null){
                                            var out_grid = Ext.getCmp(out_source_id);
                                            out_grid.getStore().add({full:details.flag, approved:details.approved, id_op:data.id_op, op_number:op_number, proc_number: data.proc_number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                            out_grid.getView().refresh();
                                            var win_arr = [];
                                            Ext.WindowMgr.each(function(win){
                                                win_arr.push(win);
                                            });
                                            win_arr[win_arr.length-1].destroy();
                                        }
                                        else {*/
                                            op_number = text;
                                            storeOperationGrid.add({full:details.flag, approved:details.approved, id_op:data.id_op, op_number:op_number, proc_number: data.proc_number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                           Ext.getCmp('operation_grid'+time_id).getView().refresh();
                                           checkCapex(time_id);
                                        //}
                                    }
                                }
                            }); 
                        }
                        else{
                            storeOperationGrid.add({full:details.flag, approved:details.approved, id_op:data.id_op, op_number:op_number, proc_number: data.proc_number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                            Ext.getCmp('operation_grid'+time_id).getView().refresh();
                            checkCapex(time_id);
                        }
                    }
                    else {//Create new operation
                        Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                            if (btn == 'ok'){
                                if(checkOperationNumber(text)){
                                    Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                 }
                                 else{
                                    op_number = text;
                                    var details = getStorePDS();
                                    storeOperationGrid.add({full:details.flag, approved:details.approved, id_op:data.id_op, op_number:op_number, proc_number: data.proc_number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation, tool:details.tool, gage:details.gage, work_st:details.work_st, equip:details.equip, files: details.files});
                                    Ext.getCmp('operation_grid'+time_id).getView().refresh();
                                    checkCapex(time_id);
                                }
                            }
                        }); 
                    }
                }
                if(Ext.getCmp('winProcess'+time_id)) {
                    Ext.getCmp('winProcess'+time_id).destroy();
                }
            },
            failure: function(form, action) {
                var data = Ext.decode(action.response.responseText);
                if(data.critical){
                    Ext.MessageBox.show({
                        title: lan.attention,
                        cls: 'msgbox',
                        msg: data.message,
                        buttons: Ext.MessageBox.YESNO,
                        width:300,                       
                        closable:false,
                        fn: function(btn) {
                               if (btn == 'yes') {
                                Ext.Msg.prompt(lan.enter_number, lan.enter_new_operat_id, function(btn, text){
                                    if (btn == 'ok'){
                                        Ext.getCmp('number_'+time_id).setValue(text);
                                        Ext.getCmp('id_'+time_id).setValue(null);
                                        saveOperational('add', time_id, form, create_btn, pds, request_id);
                                    }
                                });
                               }
                           }
                        
                        });
                }
                else{
                    Ext.MessageBox.alert(lan.savingErr,  data.message);
                }
                return false;
            }
        });
    } else {
        Ext.MessageBox.alert(lan.savingErr, lan.not_filled);
    }
 }

function showWinProcess(time_id, title, item, store, dir){
if(!WindowProcess){
    WindowProcess = new Ext.Window({
        width: '90%',
        height: '90%',
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        autoScroll: true,
        modal: true,
        constrainHeader: true,
        buttons: [{
            text: lan.add_to_table,
            handler:function(){
                var select = Ext.getCmp(item.id).getView().getSelectionModel().getSelection()[0];
                if(select){
                    var id = select.get('id');
                    var isExists = false;
                    store.each(function(record){
                        if(record.get(dir+'_id')==id) {
                            isExists = true;
                        }
                    });
                    if(isExists===false) {
                        Ext.Ajax.request({
                            url: 'scripts/ecr_form.php?getDirInfo=true',
                            method: 'POST',
                            params: {dir: dir, id: id},
                            success: function(response) {
                                var data = Ext.decode(response.responseText);
                                data = data.rows[0];
                               var rec2;
                               var rec1 = {number: data.number, needs:data.name, description: data.description, pending_design: data.pending_design, life_time: data.life_time, estimated_unit_price:data.estimated_unit_price, approved: data.approved};
                               switch(dir){
                                case 'tool': rec2 = {tool_id: id}; break;
                                case 'gage': rec2 = {gage_id: id}; break;
                                case 'workstation': rec2 = {workstation_id: id}; break;
                                case 'equipment': rec2 = {equipment_id: id}; break;
                               }
                               var rec = $.extend({}, rec2,rec1);
                               store.add(rec);
                               searchOperation(time_id);
                               WindowProcess.destroy();
                            },
                            failure: function(response) {
                                 Ext.MessageBox.alert(lan.error, response.responseText);
                            }
                        });
                    }
                    else {
                        Ext.MessageBox.alert(lan.error, lan.this_is+' '+title.slice(3)+' '+lan.is_already);
                    }
                }
                else Ext.MessageBox.alert(lan.error, lan.select_row);
                    }
        }],
        listeners: {
            destroy: function(){
               WindowProcess = null;
            }
        },
        items:item
    });
    WindowProcess.show();
    }
}



function getProcessOperationItem(time_id, view, id_op, pds, request_id){
    storeGridTool.removeAll();
    storeGridGage.removeAll();
    storeGridEquipment.removeAll();
    storeGridWorkstation.removeAll();
    storeProcessGrid.load();


  var comboCapexTools =  getComboYESNO(view);
  var comboPendingTools =  getComboYESNO(true);
  var comboCapexGages =  getComboYESNO(view);
  var comboPendingGages =  getComboYESNO(true);
  var comboCapexWorkSt =  getComboYESNO(view);
  var comboPendingWorkSt =  getComboYESNO(true);
  var comboCapexEquip =  getComboYESNO(view);
  var comboPendingEquip =  getComboYESNO(true);
  var comboStatusEl =  getComboStatusEl();



var SetNumberFieldTool = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly: view,
            listeners: {
                change: function(){
                    var grid = Ext.getCmp('GridTools'+time_id);
                    var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                    record.set(lastCol, this.value);
                    searchOperation(time_id);
                }
            }
        }
    });
}

var SetNumberFieldGage = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly: view,
            listeners: {
                change: function(){
                    var grid = Ext.getCmp('GridGage'+time_id);
                    var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                    record.set(lastCol, this.value);
                    searchOperation(time_id);
                }
            }
        }
    });
}

var SetNumberFieldWorkSt = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly: view,
            listeners: {
                change: function(){
                    var grid = Ext.getCmp('GridWorkstation'+time_id);
                    var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                    record.set(lastCol, this.value);
                    searchOperation(time_id);
                }
            }
        }
    });
}

var SetNumberFieldEquip = function(record){
    return Ext.create('Ext.grid.CellEditor', {
        field: {
            xtype: 'numberfield',
            minValue:0,
            allowExponential: false,
            mouseWheelEnabled: false,
            readOnly: view,
            listeners: {
                change: function(){
                    var grid = Ext.getCmp('GridEquipment'+time_id);
                    var lastCol = grid.getSelectionModel().getCurrentPosition().columnHeader.dataIndex;
                    record.set(lastCol, this.value);
                    searchOperation(time_id);
                }
            }
        }
    });
}

var GridTools = Ext.create('Ext.grid.Panel', {
    store: storeGridTool,
    id: 'GridTools'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.tool_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.tool_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor: SetNumberFieldTool},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingTools, sortable: false, dataIndex: 'pending_design', width: 120, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingTools), this)},
        {text: lan.capex_req, editor: comboCapexTools, sortable: false, hidden: pds, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexTools), this)},
        {xtype:'actioncolumn', width:30, hidden: view, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridTool.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_tools,
            hidden: view,
            handler: function() {
                var itemTool = addToolGageGrid(time_id, true, 'tool', false, all_rights['tool_gage'], false);
                showWinProcess(time_id, lan.add_tool, itemTool, storeGridTool, 'tool');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('tool_id')){
                showWindowDirectory("tool", '', time_id, lan.view_tool, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('tool_id'), true, true);
           }
       }
    }
});

var GridWorkstation = Ext.create('Ext.grid.Panel', {
    store: storeGridWorkstation,
    id: 'GridWorkstation'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.work_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.work_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldWorkSt},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingWorkSt,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingWorkSt), this)},
        {text: lan.capex_req, editor: comboCapexWorkSt, sortable: false, hidden: pds,  dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexWorkSt), this)},
        {xtype:'actioncolumn', width:30, hidden: view, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridWorkstation.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_works,
            hidden: view,
            handler: function() {
                var itemWorkSt = addWorkStGrid(time_id, true, false, all_rights['workstation'], false);
                showWinProcess(time_id, lan.add_work, itemWorkSt, storeGridWorkstation, 'workstation');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('workstation_id')){
                showWindowDirectory("", '', time_id, lan.view_work, 'work_st', imagesStoreWorkSt, documentGridStoreWorkSt, record.get('workstation_id'), true, true);
           }
       }
    }
});

var GridGage = Ext.create('Ext.grid.Panel', {
    store: storeGridGage,
    id: 'GridGage'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.gage_id, sortable: false, dataIndex: 'number', width:160},
        {text: lan.identify_gage, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: true, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldGage},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingGages,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingGages), this)},
        {text: lan.capex_req, editor: comboCapexGages, sortable: false, hidden: pds, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexGages), this)},
        {xtype:'actioncolumn', width:30, hidden: view, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridGage.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_gage,
            hidden: view,
            handler: function() {
                var itemGage = addToolGageGrid(time_id, true, 'gage', false, all_rights['tool_gage']);
                showWinProcess(time_id, lan.add_gage, itemGage, storeGridGage, 'gage');
                }
            }]
    }],
    listeners: {
       itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('gage_id')){
                showWindowDirectory("gage", '', time_id, lan.view_gage, 'tool_gage', imagesStoreTool, documentGridStoreTool, record.get('gage_id'), true, true);
           }
       }
    }
});


var GridEquipment = Ext.create('Ext.grid.Panel', {
    store: storeGridEquipment,
    id: 'GridEquipment'+time_id,
    minHeight: 160,
    width: '100%',
    border: false,
    selModel: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
    columns: [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {text: lan.status, editor: comboStatusEl, sortable: false, dataIndex: 'approved', width: 100, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboStatusEl), this)},
        {text: lan.equip_id, sortable: false, dataIndex: 'number', width: 160},
        {text: lan.equip_needs, sortable: false, dataIndex: 'needs', width: 200},
        {text: lan.description, sortable: false, dataIndex: 'description', minWidth: 250, flex:1},
        {text: lan.qty, sortable: true, dataIndex: 'qty', width: 160, getEditor:SetNumberFieldEquip},
        {text: lan.estim_price_unit, editor: {xtype: 'numberfield', allowExponential: false, minValue: 0}, sortable: true, dataIndex: 'estimated_unit_price', width: 160},
        {text: lan.estim_total_price, sortable: true, dataIndex: 'estimated_total_price', width: 160, renderer:function(value,metadata,record){return parseInt(record.get('estimated_unit_price'))*parseInt(record.get('qty'));} },
        {text: lan.est_life_time, sortable: true, dataIndex: 'life_time', width: 160},
        {text: lan.pending_des, editor: comboPendingEquip,sortable: true, dataIndex: 'pending_design', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboPendingEquip), this)},
        {text: lan.capex_req, editor: comboCapexEquip, sortable: false, hidden: pds, dataIndex: 'capex', width: 160, renderer: Ext.Function.bind(Ext.util.Format.comboRenderer(comboCapexEquip), this)},
        {xtype:'actioncolumn', width:30, hidden: view, dataIndex:'set_hidden', items:[{
                                iconCls: 'delete',
                                handler:function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    storeGridEquipment.remove(rec);
                                    searchOperation(time_id);
                                }
                            }]
        }
     ],
    viewConfig: {
        stripeRows: false, 
        getRowClass: function(record) {
            return (record.get('approved') ==1)? '':'red_bg'; 
        } 
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{ 
            xtype: 'button',
            text: lan.add_equip,
            //id:'func_add_attr'+time_id,
            hidden: view,
            handler: function() {
                var itemEquip = addEquipGrid(time_id, true, false, all_rights['equipment'], false);
                showWinProcess(time_id, lan.add_equip, itemEquip, storeGridEquipment, 'equipment');
                }
            }]
    }],
    listeners: {
        itemdblclick: function(View, record, item, index, e, eOpts) {
           if(record.get('equipment_id')){
                showWindowDirectory("", '', time_id, lan.view_equip, 'equip', imagesStoreEquip, documentGridStoreEquip, record.get('equipment_id'), true, true);
           }
       }
    }
});

var downloadLink = getActionLink('add_spec', 'doc');

var DocUploadFormProcess = Ext.create('Ext.form.Panel', {
        title: lan.work_instruct,
        id: 'DocUploadFormProcess'+time_id,
        margin: '0 0 0 10',
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_gridProcess'+time_id,
            border: true,
            hidden: false,
            store: documentGridStoreProcess,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    id: 'fileformProcess'+time_id,
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
                            Ext.Msg.prompt(lan.doc, lan.doc_description, function(btn, text){
                            if (btn == 'ok'){
                                var extn = value.split('.').pop();
                                if((extn=='html') || (extn=='php') || (extn=='ini') || (extn=='exe')||(extn=='xml')){
                                    val.setValue(''); val.setRawValue('');
                                    Ext.MessageBox.alert(lan.error, lan.incorrect_file_format);
                            }else {
                                var form = Ext.getCmp('DocUploadFormProcess'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_file,
                                        params: {"addDoc":'true'},
                                        success: function(fp, o) {
                                            documentGridStoreProcess.add({id: documentGridStoreProcess.data.length+1, descr_spec: text, add_spec: o.result.message});
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
                    hidden: view,
                    items:[{
                        iconCls:'delete',
                        handler:function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            documentGridStoreProcess.remove(rec);
                        }
                    }]
                }]
        }]
});

 var process_operation_item =  {
        xtype: 'container',
        margin: '5',
        autoScroll: true,
        items:[{
                xtype: 'container',
                anchor:'96%',
                layout: 'hbox',
                items:[{
                        xtype:'textfield',
                        name: 'id',
                        id: 'id_'+time_id,
                        hidden: true
                    },{
                        xtype:'combobox',
                        fieldLabel: lan.oper_proc_id,
                        labelAlign: 'top',
                        name: 'number',
                        queryMode: 'local',
                        id: 'number_'+time_id,
                        allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        displayField: 'value',
                        valueField: 'value',
                        autoSelect: true,
                        store: storeOperationNumber,
                        labelWidth: style.input2.labelWidth,
                        anchor:'96%',
                        readOnly: view,
                        flex:1,
                        vtype: 'idValid',
                        listeners:{
                            afterrender: function(){
                                storeOperationNumber.load();
                            },
                            select:function(name, newValue, oldValue, eOpts){
                                var id_op = name.displayTplData[0].id;
                               loadDataOperation(time_id, id_op, request_id);
                            },
                            change: function(){
                                var val_length = 0;
                                if(Ext.getCmp('number_'+time_id).getValue()){
                                    val_length = Ext.getCmp('number_'+time_id).getValue().length;
                                } 
                               
                               if(val_length>1){
                                    Ext.getCmp('number_'+time_id).setConfig('queryMode', 'remote');
                               } 
                                else{
                                    Ext.getCmp('number_'+time_id).setConfig('queryMode', 'local');
                                } 
                            }
                        }
                    },{
                        xtype:'combobox',
                        fieldLabel: lan.operational_proc,
                        labelAlign: 'top',
                        name: 'operation_procedure',
                        queryMode: 'remote',
                        margin: '0 5',
                        allowBlank: false,
                        typeAhead: true,
                        minChars:2,
                        triggerAction: 'all',
                        lazyRender: true,
                        enableKeyEvents: true,
                        labelWidth: style.input2.labelWidth,
                        store: storeOperationProcedures,
                        displayField: 'value',
                        valueField: 'value',
                        autoSelect: true,
                        id: 'operation_procedure_'+time_id,
                        flex:2,
                        readOnly: view,
                        vtype: 'nameValid'
                    }]
    },{
        xtype: 'textareafield',
        fieldLabel: lan.description,
        labelAlign: 'top',
        name: 'descriptionOperation',
        id: 'descriptionOperation_'+time_id,
        width:'100%',
        labelWidth: style.input2.labelWidth,
        readOnly: view
    },{
        xtype: 'fieldset',
        title: lan.tool,
        anchor:'100%',
        border: 2,
        items:GridTools
    },{
        xtype: 'fieldset',
        title: lan.gage,
        anchor:'100%',
        border: 2,
        items:GridGage
    },
    {
        xtype: 'fieldset',
        title: lan.workstation,
        anchor:'100%',
        border: 2,
        items:GridWorkstation
    },
    {
        xtype: 'fieldset',
        title: lan.equipment,
        anchor:'100%',
        border: 2,
        items:GridEquipment
    }, DocUploadFormProcess]

};
   
return process_operation_item;
}

function addGridOperation(inData){
    //time_id, view=false, add_tab=true, pds, rights, out_source_id=null
    var time_id = Date.parse(new Date());
    var rights = all_rights['operation_procedures'];
    var disable_add = true;
    var disable_edit = true;
    var disable_delete = true;

    if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(inData.rights) rights = inData.rights;
    }

    if(rights){//rights rule
        disable_add = (rights.indexOf('create')!=-1)? false : true;
        disable_edit = (rights.indexOf('edit')!=-1)? false : true;
        disable_delete = (rights.indexOf('delete')!=-1)? false : true;
    }

    columns_data = [
        {xtype: 'rownumberer', width: 40, sortable: false, hideable: false},
        {dataIndex: 'id', hidden: true},
        {text: lan.operation_procedure_id, dataIndex: 'number', sortable: true, hideable: false, width: 200},
        {text: lan.oper_procedure, dataIndex: 'operation_procedure', sortable: true, hideable: true, minWidth: 200, flex:1},
    ];

 var storeProcessGrid = new Ext.data.Store({
        fields: ['id', {type: 'string', name: 'operation_procedure', sortType: 'asLower'}, {type: 'string', name: 'number', sortType: 'asLower'}],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/datastore.php?func=operation_data',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            },
        simpleSortMode: true
        }
    });

 var PagingProcessbar = Ext.create('Ext.PagingToolbar', {
    border: false,
    frame: false,
    store: storeProcessGrid,
    displayInfo: true
});

 var grid = {
        xtype: 'grid',
        fileUpload:true,
        layout: 'fit',
        columnLines: true,
        id:'process'+time_id,
        border: false,
        frame: false,
        autoScroll: true,
        store: storeProcessGrid,
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
                        minWidth: 110,
                        flex:1,
                        disabled: disable_add,//rights rule
                        handler: function() {
                            var operation_form = getOperationForm({time_id: time_id});
                            showObject({id:time_id, title: lan.create_operat, item: operation_form, sizeX: '100%', sizeY: '100%'});
                            //var inData = {action: 'add', time_id: time_id, title: lan.create_operat, view: view, id_op: null, add_tab: true, create_btn: true, pds: pds};
                            //showOperationWin(inData);
                        }
                    },
                    {
                        text: lan.edit,
                        iconCls: 'edit',
                        minWidth: 110,
                        flex:1,
                        disabled: disable_edit,//rights rule
                        handler: function() {
                          var select = Ext.getCmp('process'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                var inData = {action: 'edit', time_id: time_id, title: lan.edit_operation, view: view, id_op: select.get('id'), add_tab: true, create_btn: true, pds: pds};
                                showOperationWin(inData);
                            } else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.del,
                        iconCls: 'delete',
                        minWidth: 110,
                        flex:1,
                        disabled: disable_delete,//rights rule
                        handler: function() {
                          var select = Ext.getCmp('process'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                Ext.MessageBox.confirm(lan.attention, lan.areyousure, function(btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?delOperation=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                Ext.MessageBox.alert(lan.skill, lan.record_deleted_successfully);
                                                Ext.getCmp('process'+time_id).store.load();
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
                        text: lan.add_to_process,
                        iconCls: 'add',
                        hidden: add_tab,
                        handler: function() {
                            var select = Ext.getCmp('process'+time_id).getView().getSelectionModel().getSelection()[0];
                            if(select){
                                Ext.Msg.prompt(lan.enter_number, lan.enter_operat_numb, function(btn, text){
                                if (btn == 'ok'){
                                     if(checkOperationNumber(text)){
                                        Ext.MessageBox.alert(lan.error, lan.oper_numb_exist);
                                     }
                                     else{
                                         op_number = text;
                                         Ext.Ajax.request({
                                            url: 'scripts/ecr_form.php?getOperationData=true',
                                            method: 'POST',
                                            params: {id: select.get('id')},
                                            success: function(response) {
                                                var data =  Ext.decode(response.responseText);
                                                data = data.rows[0];
                                                if(out_source_id&&out_source_id!==null){
                                                    var out_grid = Ext.getCmp(out_source_id);
                                                    out_grid.getStore().add({full: 0, approved:data.approved, id_op:data.id, op_number:op_number, proc_number: data.number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation,tool:data.tools, gage:data.gages, work_st:data.workstations, equip:data.equipments});
                                                    out_grid.getView().refresh();
                                                    var win_arr = [];
                                                    Ext.WindowMgr.each(function(win){
                                                        win_arr.push(win);
                                                    });
                                                    win_arr[win_arr.length-1].destroy();
                                                }
                                                else {
                                                   storeOperationGrid.add({full: 0, approved:data.approved, id_op:data.id, op_number:op_number, proc_number: data.number, operation_procedure:data.operation_procedure, descriptionOperation:data.descriptionOperation,tool:data.tools, gage:data.gages, work_st:data.workstations, equip:data.equipments});
                                                    Ext.getCmp('operation_grid'+time_id).getView().refresh();
                                                    checkCapex(time_id);
                                                    WindowViewTables.destroy(); 
                                                }
                                            },
                                            failure: function(response) {
                                                 Ext.MessageBox.alert(lan.error, response.responseText);
                                            }
                                        });
                                     }
                                    }
                                });
                            }
                            else {
                                Ext.MessageBox.alert(lan.error, lan.select_row);
                            }
                        }
                    },
                    {
                        text: lan.view,
                        iconCls: 'showpic',
                        hidden: add_tab,
                        handler: function() {
                            if(disable_edit){//rights rule
                                view = true;
                            }

                            var select = Ext.getCmp('process'+time_id).getView().getSelectionModel().getSelection()[0];
                            if (select) {
                                //showOperationWin('', time_id, lan.view_operation, view, select.get('id'), false, true, pds, out_source_id);
                                var inData = {action: '', time_id: time_id, title: lan.view_operation, view: view, id_op: select.get('id'), add_tab: false, create_btn: true, pds: pds, out_source_id: out_source_id};
                                showOperationWin(inData);
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
                    minWidth: 200,
                    flex:3,
                    listeners: {
                        change: function() {
                           storeProcessGrid.load({
                                params: {search: this.value}
                            });
                            storeProcessGrid.getProxy().url = 'scripts/datastore.php?func=operation_data&search=' + this.value;
                            storeProcessGrid.load();
                        }
                    }
                }]
            }
        ],
        bbar: [PagingProcessbar],
        columns: columns_data,
        listeners: {
            itemdblclick: function(View, record, item, index, e, eOpts) {
               var titleWin = "";
                if(record.get('id')){
                    if(add_tab==false){
                        titleWin = lan.view_operation;
                        var inData = {action: '', time_id: time_id, title: titleWin, view: view, id_op: record.get('id'), add_tab: false, create_btn: true, pds: pds, out_source_id: out_source_id};
                        showOperationWin(inData);
                    }
                    else {
                        if(disable_edit){//rights rule
                            view = true;
                            titleWin = lan.view_operation;
                        }
                        else{
                            titleWin = lan.edit_operation;
                        }

                        var inData = {action: 'edit', time_id: time_id, title: titleWin, view: view, id_op: record.get('id'), add_tab: true, create_btn: true, pds: pds, out_source_id: out_source_id};
                        showOperationWin(inData)
                    }
                }
            }
        }
    }

    return grid;
}