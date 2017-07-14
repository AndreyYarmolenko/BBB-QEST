var request_id = null;
var status_id = null;

var start_tasks = new Array('new_engineering_req', 'new_component_req', 'capa_request', 'capex', 'ecr');

function addForm(inData){
	//inData = {task_id:'id', time_id: 'time_id', type: 'type', id_row: 'id_row', id_comp: 'id_comp_ecr', rights: 'rights', content: content};
	var id = null, type = false, id_row = 0, id_comp = null, rights = null, content=null, buttons_hide =false, time_id = Date.parse(new Date());
	var hdsavedraft =false, hdhistory =false, hdapprove_visib = true, hdreject_visib=true, hdsubmit_visib=false, hdconfirm = true, hdhistory_visible= false, hdsavedraft_visible=false;

	if(inData){
	    if(inData.task_id) id = inData.task_id;
	    if(inData.type) type = inData.type;
	    if(inData.id_row) id_row = inData.id_row;
	    if(inData.id_comp) id_comp = inData.id_comp;
	    if(inData.rights) rights = inData.rights;
	    if(inData.time_id) time_id = inData.time_id;
	    if(inData.content) content = inData.content;
	    if(inData.buttons_hide) buttons_hide = inData.buttons_hide;
	  }


    var disable_complete = true;
    var disable_history = true;
    var disable_edit = false;
    var disable_view = true;

   if(rights){//rights rule
        disable_complete = (rights.indexOf('complete')!=-1)? false : true;
        disable_history = (rights.indexOf('history')!=-1)? false : true;
        disable_view = (rights.indexOf('view')!=-1)? false : true;
    }
    else{
    	disable_edit = true;
    }

	status_id = arguments[3];
	var FormRef = null;
	var items = [];
	data_store_users.load();
	store_task_status.load();
	store_bbb_sku.load();
	data_store_ProductLine.load();
	data_store_ProductType.load();
	data_store_YESNO.load();
	data_store_AssignedTo.load();
	data_store_Responsible.load();
	switch (id) {
		case 'new_engineering_req':
			store_potential_customers.load();
			var new_engineering_req = getNewEngReqItem(time_id);
			items =  getItems(id, new_engineering_req, rights, time_id);
		break
		case 'new_product_line':
			var new_product_line = getNewProductLineItem(time_id);
			items =  getItems(id, new_product_line, rights, time_id);
			hdapprove_visib = false, hdreject_visib=false, hdsubmit_visib=true;
		break
		case 'due_diligence':
			store_lifecycle.load();
			store_predominant_make.load();
			store_PriorityLevel.load();
			store_bbb_sku.load();
			store_competitor.load();
			var due_diligence = getDueDiligenceItem(time_id);
			items =  getItems(id, due_diligence, rights, time_id);
		break
		case 'sample_procurement':
			var sample_procurement = getSampleProcurementItem(time_id);
			items =  getItems(id, sample_procurement, rights, time_id);
			data_store_Supplier.load();
		break
		case 'feasibility_product_eng':
			var feasibility_product_eng = getFeasibilityProductEngItem(time_id);
			items =  getItems(id, feasibility_product_eng, rights, time_id);
		break
		case 'feasibility_process_eng':
			var feasibility_process_eng = getFeasibilityProcessEngItem(time_id);
			items =  getItems(id, feasibility_process_eng, rights, time_id);
		break
		case 'cost_estimate':
			var cost_estimate = getCostEstimateItem(time_id);
			items =  getItems(id, cost_estimate, rights, time_id);
		break
		case 'preliminary_roi_pm':
			var preliminary_roi_pm = getPreliminaryROIPMItem(time_id);
			items =  getItems(id, preliminary_roi_pm, rights, time_id);
			hdapprove_visib = false, hdreject_visib=false, hdsubmit_visib=true;
		break
		case 'npd_request':
			var npd_request = getNPDReqItem(time_id);
			items =  getItems(id, npd_request, rights, time_id);
		break
		case 'sample_validation':
			var sample_validation = getSampleValidationItem(time_id);
			items =  getItems(id, sample_validation, rights, time_id);
		break
		case 'reverse_engineering_start':
			var reverse_engineering_start = getReverseEngStartItem(time_id);
			items =  getItems(id, reverse_engineering_start, rights, time_id);
		break
		case 'reverse_eng_core_analysis':
			items =  getItems(id, reverse_eng_core_analysis, rights, time_id);
		break
		case 'ecr_form':
			var readStatus = false;
            var hideStatus = false;
            var startecr = false;
            var hdaddtobom =  true;
			var ecr_form =  getECRItem(time_id, id, readStatus, hideStatus, startecr, hdaddtobom, id_comp);
			items =  getItems(id, ecr_form, rights, time_id);
		break
		case 'reverse_engineering':
			store_bbb_sku_RE.load();
			var reverse_eng = getItemReverseEng(time_id);
			items = getItems(id, reverse_eng, rights, time_id);
		break
		case 'ppap_test_plan':
			storePartNumber.load();
			store_bbb_sku_PPAP.load();
			var ppap_item = getPPAPitem(time_id, false);
			items =  getItems(id, ppap_item, rights, time_id);
		break
		case 'ppap_review':
			storePartNumber.load();
			store_bbb_sku_PPAP.load();
			var ppap_item = getPPAPitem(time_id, true);
			items =  getItems(id, ppap_item, rights, time_id);
			hdapprove_visib = false, hdreject_visib=false, hdsubmit_visib=true;
		break
		case 'process_design_request':
			var process_design_request = getProcessDesignReqItem(time_id);
			items =  getItems(id, process_design_request, rights, time_id);
		break
		case 'process_design_start':
			var process_design_start = getItemProcessDesignStart(time_id);
			items =  getItems(id, process_design_start, rights, time_id);
		break
		case 'capex':
			storeQuarters.load();
			var capex = getCapexItem(time_id, true);
			items =  getItems(id, capex, rights, time_id);
		break
		case 'capex_approve':
			storeQuarters.load();
			storeOperators.load();
		    storeControlers.load();
		    storeCFO.load();
		    storePresidents.load();
			var capex = getCapexItem(time_id, false, true);
			items =  getItems(id, capex, rights, time_id);
		break
		case 'procurement_request':
			var procurement_request = getProcurementRequestItem(time_id);
			items =  getItems(id, procurement_request, rights, time_id);
		break
		case 'purchasing_request':
			var purchasing_request = getPurchasingRequestItem(time_id);
			items =  getItems(id, purchasing_request, rights, time_id);
		break
		case 'implementation_request':
			var implementation_request = getImplementationRequestItem(time_id);
			items =  getItems(id, implementation_request, rights, time_id);
		break
		case 'ppap_finished_good':
			storePartNumber.load();
			store_bbb_sku_PPAP.load();
			var ppap_item = getPPAPitem(time_id, false);
			items =  getItems(id, ppap_item, rights, time_id);
		break
		case 'ppap_finished_good_review':
			storePartNumber.load();
			store_bbb_sku_PPAP.load();
			var ppap_item = getPPAPitem(time_id, true);
			items =  getItems(id, ppap_item, rights, time_id);
			hdapprove_visib = false, hdreject_visib=false, hdsubmit_visib=true;
		break
		case 'tooling_request':
			var toolingRequest = getToolEquipWorkstatRequest(time_id, false, false, false);
			items = getItems(id, toolingRequest, rights, time_id);
			hdreject_visib=false, hdsubmit_visib=true, hdapprove_visib = false;
		break
		case 'equipment_request':
			var equipmentRequest = getToolEquipWorkstatRequest(time_id, false, false, false);
			items = getItems(id, equipmentRequest, rights, time_id);
			hdreject_visib=false, hdsubmit_visib=true, hdapprove_visib = false;
		break
		case 'workstation_request':
			var workstationRequest = getToolEquipWorkstatRequest(time_id, false, false, false);
			items = getItems(id, workstationRequest, rights, time_id);
			hdreject_visib=false, hdsubmit_visib=true, hdapprove_visib = false;
		break
		case 'eps_production':
			var eps = epsProduction(time_id)
			items =  getItems(id, eps, rights, time_id);
		break
		case 'new_component_req':
			var new_component_req = getComponentItem(time_id);
			items =  getItems(id, new_component_req, rights, time_id);
		break
		case 'capa_request':
			var capa_request = getCAPARequestItem(time_id);
			items =  getItems(id, capa_request, rights, time_id);
		break
		case 'capa_implementation':
			var capa_implementation = getCAPAImplementationItem(time_id);
			items =  getItems(id, capa_implementation, rights, time_id);
		break
		case 'capa':
			var capa = getCAPAItem(time_id);
			items =  getItems(id, capa, rights, time_id);
		break
		case 'capa_ecr':
			var capa_ecr = getCAPAECRItem(time_id);
			items =  getItems(id, capa_ecr, rights, time_id);
		break
		case 'ecr':
			var ecr = getECRItem(time_id);
			items =  getItems(id, ecr, rights, time_id);
		break
		case 'ecr_approval':
			var ecr_approval = getECRApprovalItem(time_id);
			items =  getItems(id, ecr_approval, rights, time_id);
		break
		case 'ecr_implementation':
			var ecr_implementation = getECRImplementationItem(time_id);
			items =  getItems(id, ecr_implementation, rights, time_id);
		break
		default:
			items = getItems(id, '', rights, time_id);
		break
	}

	if(buttons_hide){
    	hdsavedraft =true, hdhistory =true, hdapprove_visib = true, hdreject_visib=true, hdsubmit_visib=true, hdconfirm = true, hdhistory_visible= true, hdsavedraft_visible=true;
    }

	FormRef = new Ext.create('Ext.form.Panel',
				{
					//title: 'Employee Information',
				    //width: 600,
				    bodyPadding: 10,
				    defaults: {
				        anchor: '100%',
				        labelWidth: 100
				    },
				    autoScroll: true,
					items: items,
					buttons:
					[
						{
							text:lan.approve,
							id: 'approve_'+id+time_id,
							hidden: hdapprove_visib,
							disabled: disable_complete, //rights rule
							width: 130,
							handler:function(){
                                Ext.select(".toggle-state").show();
                                var form = this.up('form').getForm();
                                saveForm(form, id, 0);
                            }
						},
						{
							text:lan.reject,
							hidden: hdreject_visib,
							disabled: disable_complete, //rights rule
							id: 'reject_'+id+time_id,
							width: 130,
							handler:function(){
                                var form = this.up('form').getForm();
                                saveForm(form, id, 3);
							}
						},
						{
							text: lan.send_to_conf,
							hidden: hdconfirm,
							id: 'confirm_'+id+time_id,
							width: 130,
							handler:function(){
                               var form = this.up('form').getForm();
                               saveForm(form, id, 7); // 7 - send to confimation
							}
						},
						{
							text:lan.history,
							disabled: disable_history,
							hidden: hdhistory_visible,
							id:'history_'+id+time_id,
							width: 130,
							handler:function(){
								var fields = this.up('form').getForm().getFields();
								var el = getFieldByName(fields, 'RequestID');
								var request_id = el.getValue();
								var task_type = null;
								for (var k in task_names){
									if(task_names[k]==id){
										task_type = k;
									}
								}
								if(task_type&&request_id){
									showHistory(task_type, request_id);
								}
								else{
									Ext.MessageBox.alert(lan.error, lan.history_not_avail);
								}
							}
						},
						{ 
							text:lan.save_draft,
							disabled: disable_edit,
							hidden: hdsavedraft_visible,
							id: 'savedraft_'+id+time_id,
							width: 130,
							handler: function(){
								var form = this.up('form').getForm();
								saveForm(form, id, 1);
							}
						},
						{
							text:lan.submit,
							id: 'submit_'+id+time_id,
							hidden: hdsubmit_visib,
							disabled: disable_complete, //rights rule
							width: 130,
							handler:function(){
								//Ext.select(".toggle-state").show();
								var form = this.up('form').getForm();
								saveForm(form, id, 0);								
							}						
						}
					],
					listeners:{
						afterRender:function(){
							var form = this.getForm();
							var fields = form.getFields();
							if(content){
								setFields(fields, content, id);
								setReadOnly(fields, id);
							}
							else if(!type){
								editForm(form, id, id_row, rights);
							}
							if (type && start_tasks.indexOf(id)!==-1){
								Ext.getCmp('RequestedDate_'+id+time_id).setValue(new Date());
								//setReadOnly(fields, id, true);
								//setRightsCapabilities(fields, rights, id);
							}
						}
					}
				});

	return FormRef;
}



function saveForm(form, iddoc, draft){
	var msg ='';
	var validForm = true;
	var fields = form.getFields();
	var time_id = getTimeID(fields);
	var rights = all_rights[iddoc];

	if (draft == 1){
		form.getFields().each(function(item){
			if(item.name !='Responsible' && item.name !='AssignedTo' && item.name !='DueDate'){
				if (!item.allowBlank){
					item.allowBlank = true;
				}
			}
		});
		msg = lan.data_save;

	}else if (draft == 0){
		msg = lan.nextStageGen+': ';
	}else{
		msg = lan.taskIsRejected;
	}

	if (iddoc == 'new_product_line'&&draft==3){
		var el = getFieldByName(fields, 'Newproductlinename');
		el.setConfig('allowBlank', true);
	}

	if (iddoc == 'due_diligence'){
		Ext.getCmp('oe_reman_sku'+time_id).setConfig('allowBlank', true);
		Ext.getCmp('upc'+time_id).setConfig('allowBlank', true);
	}
	

	if (iddoc == 'reverse_engineering' && draft==0){
		var storeBOM = Ext.getCmp('gridbom'+time_id).getStore();
		storeBOM.each(function(record){
			if(record.get('qty')==null || record.get('qty')==0) {
				Ext.MessageBox.alert(lan.error, lan.qty_not_fil);
				validForm = false;
			}
			/*if(record.get('ppap')==null){
				Ext.MessageBox.alert(lan.error, lan.ppap_size_not_fil);
				validForm = false;
			}*/
		});
	}

	if (iddoc == 'ppap_review'&&draft==0){
	var field_qty =getFieldByName(fields, 'qty');
	var qty = field_qty.getValue();
	var storeDimesionalPPAP = Ext.getCmp('gridDimPPAP'+time_id).getStore();
	var storeFunctionalPPAP = Ext.getCmp('gridFuncPPAP'+time_id).getStore();
	storeDimesionalPPAP.each(function(record){
            for(var i =1; i<=qty; i++){
                if(record.get('actual'+i)==null || !record.get('actual'+i)) validForm = false;
            }
        });

    storeFunctionalPPAP.each(function(record){
        for(var i =1; i<=qty; i++){
                if(record.get('actual'+i)==null || !record.get('actual'+i)) validForm = false;
            }

        });
}
		
		if(iddoc=='new_engineering_req'&&draft == 0){
			var store = Ext.getCmp('Customers_ner'+time_id).getStore();
			if(store.data.length==0){
				Ext.MessageBox.alert(lan.error, lan.potent_costum_not_fil);
				validForm = false;
			}
			else if(Ext.getCmp('tabnew_engineering_req').down('form').getForm().findField('Annualdemand').getValue() == 0) {
				Ext.MessageBox.alert(lan.error, lan.mat_an_dem_not_0);
				return false;
			} 
		}

	if(iddoc == 'tooling_request' || iddoc == 'equipment_request' || iddoc == 'workstation_request') {
		if(draft == 3 && Ext.getCmp('altVar' + time_id).getValue() == null) {
			Ext.MessageBox.alert(lan.attention, lan.select_alt_option);
			return false;
		}

		if(draft == 0 && Ext.getCmp("pendingDesign" + time_id).getValue() == 1) {
			Ext.MessageBox.alert(lan.error, lan.must_2d_3d);
			return false;
		}
	}

	if(iddoc == 'eps_production') {
		if(draft == 0 && epsDiagnosticStore.count() == 0) {
			Ext.MessageBox.alert(lan.error, lan.select_diag_soft);
			validForm = false;
		}
	}

	if(iddoc=='capa_implementation'){
		var impl_action = getValueByName(fields, 'impl_action');
		if(draft==0&&impl_action==1){
			var signature_container = Ext.getCmp('approval_signatures_'+time_id);
			var signatures = signature_container.query('[cls=signature_box]');
			var approval_status;
			for(var i=0; i<signatures.length; i++){
				approval_status = signatures[i].query('[name=approval_status]')[0].getValue();
				if(approval_status!==1){
					Ext.MessageBox.alert(lan.error, 'Not all signatures are approved!');
					validForm = false;
					return;
				}
			}
		}
	}

	if(iddoc=='capa_approval_request'){
		var implementation_status = getValueByName(fields, 'implementation_status');
		if(draft==0&&(implementation_status==3||implementation_status==4)){
			Ext.MessageBox.alert(lan.error, "You can't complete task with signature statuses New or In Progress!");
			validForm = false;
			return;
		}
	}

	
	if(form.isValid() && validForm) {
		var params = {func:'add',table:iddoc, draft_id:draft};

		if(iddoc=='new_engineering_req'){
			var customer = [];
			var store = Ext.getCmp('Customers_ner'+time_id).getStore();
			store.each(function(record){
				customer.push({'name':record.get('name')});
			});
			if(customer.length>0){
				var customerJS = JSON.stringify(customer);
				params = $.extend({PotentialCustomers:customerJS}, params);
			}
		}

		if (iddoc == "tooling_request") {
			var _2D = Ext.getCmp('tabtooling_request').query('image')[0].src;
			var _3D = Ext.getCmp('tabtooling_request').query('image')[1].src;
			var addImages = getStoreImg(storeImg);
			var addDoc = getStoreDoc(storeDoc);
			params = $.extend({draw2d:_2D, draw3d:_3D, addImage: addImages, addDoc: addDoc}, params);
		}

		if (iddoc == "equipment_request") {
			var _2D = Ext.getCmp('tabequipment_request').query('image')[0].src;
			var _3D = Ext.getCmp('tabequipment_request').query('image')[1].src;
			var addImages = getStoreImg(storeImg);
			var addDoc = getStoreDoc(storeDoc);
			params = $.extend({draw2d:_2D, draw3d:_3D, addImage: addImages, addDoc: addDoc}, params);
		}

		if (iddoc == "workstation_request") {
			var _2D = Ext.getCmp('tabworkstation_request').query('image')[0].src;
			var _3D = Ext.getCmp('tabworkstation_request').query('image')[1].src;
			var addImages = getStoreImg(storeImg);
			var addDoc = getStoreDoc(storeDoc);
			params = $.extend({draw2d:_2D, draw3d:_3D, addImage: addImages, addDoc: addDoc}, params);
		}

		if (iddoc == "eps_production") {
			var finalTest = getStoreDoc(epsFinalStore);
			var diagnosticSoftware = getStoreDoc(epsDiagnosticStore);;
			params = $.extend({final_test: finalTest, diagnostic_software: diagnosticSoftware}, params);
		}
		
        if (iddoc == 'reverse_engineering_start'){
        	var params2 = {};
            var dim_pack = [];
        	var packJS = null;
        	var pack_store = Ext.getCmp('pack_requirement_grid'+time_id).getStore();
        	pack_store.each(function(record){
				dim_pack.push({'id_pack': record.get('id_pack'), 'number': record.get('number'), 'name': record.get('name'), 'customer': record.get('customer'), 'reference':record.get('reference')});
			});
        	if(dim_pack.length>0){
        		packJS = JSON.stringify(dim_pack);
        		params2 = {
        		'pack_req': packJS
        		}
        	}
            params = $.extend({}, params, params2);
        }

		if (iddoc == 'reverse_engineering'){
			var params2 =getStoreReverseEng(time_id);
			if(!params2 && draft==0) return false;
				else {
					params = $.extend({}, params,params2);
				}
		}


		if (iddoc == 'ppap_test_plan'||iddoc == 'ppap_finished_good'||iddoc == 'ppap_review'||iddoc == 'ppap_finished_good_review'){
			var params2 =getStorePPAP();
			params = $.extend({}, params,params2);
		}

		if (iddoc == 'due_diligence'){			
			if (draft == 0){
				if (!checkStoreDueDiligence(iddoc, time_id)){
				    return false;		
				}
			}
			var params2 = getStoreDueDiligence(time_id);
			params = $.extend({}, params,params2);
		}
		if (iddoc == 'ecr_form'){
			saveFormComponent(form, iddoc, draft, time_id);
			return;
		}

		if (iddoc == 'process_design_start'){
			var storeProjectPurpose = Ext.getCmp('purpose_grid'+time_id).getStore();
			var storeProjectDetails = Ext.getCmp('details_grid'+time_id).getStore();
			var storeOperationGrid = Ext.getCmp('process_operations_grid'+time_id).getStore();
			if(draft == 0){
				if(storeOperationGrid.data.length==0){
				Ext.MessageBox.alert(lan.error, lan.add_oper_in_proc);
				validForm =  false;
				return
			}
			var capex_create = getFieldByName(fields, 'capex_create');
			capex_create = capex_create.getValue();
			if(capex_create==1){
				storeProjectDetails.each(function(record){
					if(String(record.get('result'))==""||String(record.get('result'))==="null"||String(record.get('qty'))==""||String(record.get('qty'))==="null"){
						validForm =  false;
					}
					
				});

				if(!validForm){
					Ext.MessageBox.alert(lan.error, lan.details_table);
					return
				}

				storeProjectPurpose.each(function(record){
					if(String(record.get('result'))==""||String(record.get('result'))==="null"){
						validForm =  false;
					}
					
				});
				if(!validForm){
					Ext.MessageBox.alert(lan.error, lan.fill_purpose);
					return
				}
			}

			}

			var dimOperations = [];
			var dimPurpose = [];
			var dimDetails = [];
			var files = [];
			var analysis = "";
			var full_store = true;
			Ext.getCmp('process_operations_grid'+time_id).getStore().each(function(record){
				dimOperations.push({id:record.get('id_op'), full: record.get('full'), op_number: record.get('op_number'), tool: record.get('tool'), gage: record.get('gage'), equip:record.get('equip'), work_st:record.get('work_st')});
				if(record.get('full')==0){full_store=false;}
			});
			if(full_store===false&&draft == 0){
				Ext.MessageBox.alert(lan.error, lan.operat_not_ready);
				return
			}
			storeProjectPurpose.each(function(record){
				dimPurpose.push({id:record.get('id'), result: record.get('result')});
			});
			storeProjectDetails.each(function(record){
				dimDetails.push({id:record.get('id'), result: record.get('result'), qty: record.get('qty')});
			});
			var storeFilesPDS = Ext.getCmp('hidden_grid_pds_'+time_id).getStore();
			storeFilesPDS.each(function(record){
				files.push({'name': record.get('name'), 'document':record.get('document')});
			});
			if(draft==0){
				storeFilesPDS.each(function(record){
					if(record.get('name')=='analysis'){
						analysis = record.get('document');
					}
				});
			}

			dimPurposeJS = JSON.stringify(dimPurpose);
			dimDetailsJS = JSON.stringify(dimDetails);
			dimOperationsJS = JSON.stringify(dimOperations);
			filesJS = JSON.stringify(files);
			var params2 = {
				'operations' : dimOperationsJS,
				'purpose': dimPurposeJS,
				'details': dimDetailsJS,
				'files': filesJS,
				'analysis':analysis
			};
			params = $.extend({}, params,params2);
		}

		if (iddoc == 'capex'){
			var projectEl = [];
			var full_store = true;
			storeProjectElements.each(function(record){
				projectEl.push({row_id: record.get('row_id'), el_id:record.get('el_id'), el_type: record.get('el_type'), year: record.get('year'), quarter: record.get('quarter')});
				if (!record.get('year')||!record.get('quarter')) {
					full_store = false;
				}
			});

			if(full_store===false&&draft == 0){
				Ext.MessageBox.alert(lan.error, lan.list_major);
				return
			}
			
			projectElJS = JSON.stringify(projectEl);
			var params2 = {
				'projectEl': projectElJS
			}
			params = $.extend({}, params,params2);
		}

		if (iddoc == 'procurement_request'){
			var procurement = [];
			var full_store = true;
			storeProcurementList.each(function(record){
				procurement.push({row_id: record.get('row_id'), el_id:record.get('el_id'), el_type: record.get('el_type'), received: record.get('received')});
				if (!record.get('received')||record.get('received')==0) {
					full_store = false;
				}
			});

			if(full_store===false&&draft == 0){
				Ext.MessageBox.alert(lan.error, lan.elem_received);
				return
			}
			var procurementJS = JSON.stringify(procurement);
			var params2 = {
				'procurement': procurementJS
			}
			params = $.extend({}, params,params2);
		}

		if (iddoc == 'purchasing_request' ){
			var purchasing = [];
			var full_store = true;
			storePurchasingList.each(function(record){
				purchasing.push({row_id: record.get('row_id'), el_id:record.get('el_id'), el_type: record.get('el_type'), received: record.get('received')});
				if (!record.get('received')||record.get('received')==0) {
					full_store = false;
				}
			});
			if(full_store===false&&draft == 0){
				Ext.MessageBox.alert(lan.error, lan.elem_received);
				return
			}
			var purchasingJS = JSON.stringify(purchasing);
			var params2 = {
				'purchasing': purchasingJS
			}
			params = $.extend({}, params,params2);
		}

		if (iddoc == 'implementation_request'){
			var implemented = [];
			var full_store = true;
			var isReceived =true;

			storeImplementationList.each(function(record){
				if(record.get('received')==0&&record.get('implemented')==1){
						isReceived = false;
				}
				else {
					implemented.push({row_id: record.get('row_id'), el_id:record.get('el_id'), el_type: record.get('el_type'), implemented: record.get('implemented')});
					if (!record.get('implemented')||record.get('implemented')==0) {
						full_store = false;
					}
				}
			});

			if(isReceived===false){
				Ext.MessageBox.alert(lan.error, lan.cant_implement);
				return
			}

			if(full_store===false&&draft == 0){
				Ext.MessageBox.alert(lan.error, lan.not_all_implement);
				return
			}
			implementedJS = JSON.stringify(implemented);
			var params2 = {
				'implemented': implementedJS
			}
			params = $.extend({}, params,params2);
		}

		if(iddoc=='new_component_req'){
			var tasks_arr = getComponentTasks(time_id);
			var isNotApprove = false;
			var isNotCreated = false;
			if(draft == 0){
				if(tasks_arr.length==0){
					Ext.MessageBox.alert(lan.error, 'You have to create at least one task!');
					return;
				}

				for (var i = 0; i < tasks_arr.length; i++) {
					if(tasks_arr[i]['comp_status'] !==1&&(tasks_arr[i]['comp_type']==1||tasks_arr[i]['comp_type']==2)){
						isNotApprove = true;
					}

					if(tasks_arr[i]['comp_task_status']!==1){
						isNotCreated = true;
					}
				}
				if(isNotApprove){
					Ext.MessageBox.alert(lan.error, 'Not all components are approved!');
					return;
				}
				if(isNotCreated){
					Ext.MessageBox.alert(lan.error, 'Not all components are created!');
					return;
				}
			}
			var tasksJS = JSON.stringify(tasks_arr);
			var params2 = {
				'tasks' : tasksJS
			};
			params = $.extend({}, params,params2);
		}

		
		if(iddoc=='ecr'){
			var ecr_type = getValueByName(fields, 'ecr_type');
			switch(ecr_type){
				case 1:
					
				break;
				case 2:
					
				break;
				case 3:
					var process_dataJS = getECRProcessData(fields, time_id);
					var storeFilesPDS = Ext.getCmp('hidden_grid_pds_'+time_id).getStore();
					params = $.extend({}, params, {'ecr_data': process_dataJS});

					var files = [];
					var filesJS = null;
					storeFilesPDS.each(function(record){
						files.push({'name': record.get('name'), 'document':record.get('document')});
					});

					if(files.length>0){
						filesJS = JSON.stringify(files);
						params = $.extend({}, params, {'files': filesJS});
					}
				break;
				case 4:
					
				break;
			}
			var approvals = [];
			var approvalsJS = null;
			var approvals_store = Ext.getCmp('approval_grid'+time_id).getStore();
			if(approvals_store.data.length>0){
				approvals_store.each(function(record){
					if(record.get('person_id')&&record.get('person_id')!==0){
						approvals.push({person_id: record.get('person_id'), position: record.get('position')});
					}
				});
				if(approvals.length>0){
					approvalsJS = JSON.stringify(approvals);
					params = $.extend({}, params, {'approvals': approvalsJS});
				}
			}

			var doc_support_imgsJS= null;
			var doc_support_filesJS= null;
			var doc_support_imgs = [];
			var doc_support_files = [];

			Ext.getCmp('doc_grid'+time_id+'ca').getStore().each(function(record){
		        doc_support_files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
		    });

		    Ext.getCmp('UploadForm'+time_id+'ca').getStore().each(function(record){
	            doc_support_imgs.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
	        });

		    if(doc_support_imgs.length>0){
		    	doc_support_imgsJS = JSON.stringify(doc_support_imgs);
		    	params = $.extend({}, params, {'doc_support_imgs': doc_support_imgsJS});
		    }
	        
	        if(doc_support_files.length>0){
		    	doc_support_filesJS = JSON.stringify(doc_support_files);
		    	params = $.extend({}, params, {'doc_support_files': doc_support_filesJS});
		    }
		}

		if(iddoc=='ecr_approval'){
			if(draft==0){
				var approval_status = getValueByName(fields, 'approval_status');
				if(approval_status!==1&&approval_status!==2){
					Ext.MessageBox.alert(lan.error, "Please set Approval Status!");
					return;
				}
			}
		}

		if(iddoc=='ecr_implementation'){
			var signatures_store = Ext.getCmp('ecn_signatures_grid'+time_id).getStore();
			var signatures = [];
			var signaturesJS = null;
			var all_approve = true;
			if(signatures_store.data.length>0){
				signatures_store.each(function(record){
					if(record.get('status')!==1&&record.get('critical')==1) all_approve = false;
					signatures.push({signature: record.get('signature'), person_id: record.get('person_id'), critical: record.get('critical'), email: record.get('email'), status: record.get('status'), check_p: record.get('check_p')});
				});
				signaturesJS = JSON.stringify(signatures);
				params = $.extend({}, params, {'signatures': signaturesJS});
			}
			if(!all_approve&&draft==0) {
				Ext.MessageBox.alert(lan.error, "Not all obligatory signatures are approved!");
				return;
			}
		}



		if(iddoc=='capa_request'){
			var task_case = getValueByName(fields, 'problems');
			switch(task_case){
				case 2:
					return;
				break;
				case 3:
					var process_issueJS = getCAPAProcessData(fields, time_id);
					params = $.extend({}, params, {'process_issue': process_issueJS});
				break;
			}
		}

		if(iddoc=='capa'){
			var task_case = getValueByName(fields, 'problems');
			switch(task_case){
				case 3:
					var is_exist_ecr = getValueByName(fields, 'is_exist_ecr');
					var process_issueJS = getCAPAProcessData(fields, time_id);
					params = $.extend({}, params, {'process_issue': process_issueJS});
					if(is_exist_ecr==1){
						Ext.getCmp('start_ecr_btn_'+time_id).hide();
						var ecr_dataJS =getCAPAProcessData(fields, time_id+'ecr');
						params = $.extend({}, params, {'ecr_data': ecr_dataJS});
					}
					else {
						Ext.getCmp('start_ecr_btn_'+time_id).show();
					}

					var approvals = [];
						var approvalsJS = null;
						var approvals_store = Ext.getCmp('approval_grid'+time_id).getStore();
						if(approvals_store.data.length>0){
							approvals_store.each(function(record){
								approvals.push({person_id: record.get('person_id'), position: record.get('position')});
							});
							approvalsJS = JSON.stringify(approvals);
							params = $.extend({}, params, {'approvals': approvalsJS});
						}
				break;
			}
			var root_filesJS = null;
			var corrective_filesJS= null;
			var preventive_filesJS= null;
			var root_imgsJS= null;
			var corrective_imgsJS= null;
			var preventive_imgsJS= null;

			var root_files = [];
			var corrective_files = [];
			var preventive_files = [];

			var root_imgs = [];
			var corrective_imgs = [];
			var preventive_imgs = [];

			Ext.getCmp('doc_grid'+time_id+'r').getStore().each(function(record){
		        root_files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
		    });

		    Ext.getCmp('doc_grid'+time_id+'ca').getStore().each(function(record){
		        corrective_files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
		    });

		    Ext.getCmp('doc_grid'+time_id+'pa').getStore().each(function(record){
		        preventive_files.push({id:record.get('id'), descr_spec:record.get('descr_spec'), add_spec: record.get('add_spec')});
		    });

		    Ext.getCmp('UploadForm'+time_id+'r').getStore().each(function(record){
	            root_imgs.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
	        });

	        Ext.getCmp('UploadForm'+time_id+'ca').getStore().each(function(record){
	            corrective_imgs.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
	        });

	        Ext.getCmp('UploadForm'+time_id+'pa').getStore().each(function(record){
	            preventive_imgs.push({'id': record.get('id'),'src': record.get('src'), 'caption': record.get('caption')});
	        });

	        root_filesJS = JSON.stringify(root_files);
			corrective_filesJS= JSON.stringify(corrective_files);
			preventive_filesJS= JSON.stringify(preventive_files);
			root_imgsJS= JSON.stringify(root_imgs);
			corrective_imgsJS= JSON.stringify(corrective_imgs);
			preventive_imgsJS= JSON.stringify(preventive_imgs);

	        var params2 = {
				'root_files' : root_filesJS,
				'corrective_files' : corrective_filesJS,
				'preventive_files' : preventive_filesJS,
				'root_imgs' : root_imgsJS,
				'corrective_imgs' : corrective_imgsJS,
				'preventive_imgs' : preventive_imgsJS,
			};

			params = $.extend({}, params, params2);
		}

		if(iddoc=='capa_ecr'){
			var task_case = getValueByName(fields, 'problems');
			switch(task_case){
				case 3:
					if(draft==0){
						var approval_status = getValueByName(fields, 'approval_status');
						if(approval_status==3){
							Ext.MessageBox.alert(lan.error, "You can't complete task with status - In Progress!");
							return;
						}
						var ecr_dataJS =getCAPAProcessData(fields, time_id+'ecr');
						params = $.extend({}, params, {'ecr_data': ecr_dataJS});
					}
				break;
			}
		}

		form.submit({
			url: 'scripts/saveformref.php',
			waitMsg: lan.saving,
			wait: true,
			scope: this,
			method: 'post',
			params: params,
			success: function(form, action) {
				setFields(fields, action.result, iddoc);

				if(draft == 0  || draft == 3){
					msg = msg + action.result.nextStage;
					if(action.result.nextStage == "Before this action, you must finished EPS Production Software!") {
						Ext.MessageBox.alert(lan.error, lan.finish_eps);
						return false;
					}
					else if(action.result.nextStage == "ID should not be temporary, you need to assign a new!") {
						form.findField('number').setStyle({background: "red"});
						Ext.MessageBox.alert(lan.error, lan.id_not_be_temp);
						return false;
					}
					else if(action.result.nextStage == "This ID already exists!") {
						//form.findField('number').setValue("");
						form.findField('number').setStyle({background: "red"});
						Ext.MessageBox.alert(lan.error, lan.id_already_exists);
						return false;
					}

					setReadOnly(fields, iddoc);
				}
				else {
					setRightsCapabilities(fields, rights, iddoc);
				}

				Ext.MessageBox.alert(lan.succ, '<b class= "message">'+msg+'</b>');
				//Ext.getCmp('message_'+ iddoc+time_id).setValue('<b class= "message">'+msg+'</b>');

			},
			failure: function(form, action) {
				var data = Ext.decode(action.response.responseText);
				var msg =  lan.savingErr;
				if(data.message){
					msg = msg+": "+data.message;
				}
				Ext.MessageBox.alert(lan.error, '<b class= "message" style="color:red">'+msg+'</b>');
				//Ext.getCmp('message_'+ iddoc+time_id).setValue('<b class= "message" style="color:red">'+msg+'</b>');
            }
		});
		
			
		
	} else {
		msg = lan.formNotFilled;
		Ext.MessageBox.alert(lan.error, '<b class= "message" style="color:red">'+msg+'</b>');
		//Ext.getCmp('message_'+ iddoc+time_id).setValue('<b class= "message" style="color:red">'+msg+'</b>');
	}

		
}

function setFields(fields, data, iddoc){
	var time_id = getTimeID(fields);

	if (iddoc == 'due_diligence'){
		setStoreDueDiligence(data, time_id);
	}

	if (iddoc == 'new_engineering_req'){
		var store = Ext.getCmp('Customers_ner'+time_id).getStore();
		if(data.PotentialCustomers){
			var data1 = Ext.decode(data.PotentialCustomers);
			store.loadData(data1);
			Ext.getCmp('Customers_ner'+time_id).show();
		}
	}

	if(iddoc =='new_component_req'){
		if(data.tasks){
			setComponentTasks(time_id, data.tasks);
		}
	}

	if (iddoc == 'tooling_request'){
		if(data.drawing2d && data.drawing2d!=null && data.drawing3d && data.drawing3d!=null) data.pending_design = "0";
        if(data.drawing2d && data.drawing2d!=null){
            Ext.getCmp('tabtooling_request').query('image')[0].setSrc('img/components/'+data.drawing2d);
        }
        if(data.drawing3d && data.drawing3d!=null){
            Ext.getCmp('tabtooling_request').query('image')[1].setSrc('img/components/'+data.drawing3d);
        }
        if(data.addImages){
            storeImg.removeAll();
            storeImg.add(Ext.decode(data.addImages));
        }
        if(data.add_spec){
        	storeDoc.removeAll();
            storeDoc.add(Ext.decode(data.add_spec));
        }
        if(data.id){
        	Ext.getCmp('tabtooling_request').down('form').getForm().findField('tgId').setValue(data.id);
        }
        if(data.alternative_id) {
        	if(data.alternative_id != 0) Ext.getCmp('tabtooling_request').down('form').getForm().findField('altVar').setValue(data.alternative_id);
        	else Ext.getCmp('tabtooling_request').down('form').getForm().findField('altVar').setValue("");
        }
        if(data.number_qty_id) {
        	var obj = JSON.parse(data.number_qty_id);
        	var oper = "", qty = 0;
        	for(var key in obj) {
        		for(var item in obj[key]) {
        			if(item == "number") {
        				oper += obj[key][item] + ", ";
        				Ext.getCmp('tabtooling_request').down('form').getForm().findField('operation_procedures').setValue(oper);
        			}
        			else if(item == "qty") {
        				qty += +obj[key][item];
      					Ext.getCmp('tabtooling_request').down('form').getForm().findField('quantity').setValue(qty);
        			}
        		}
        	}
        }
        if(data.sku_name) {
        	Ext.getCmp('tabtooling_request').down('form').getForm().findField('bbb_sku_used').setValue(data.sku_name);
        }

        //блокировка при заполненных полях
        if(Ext.getCmp('tabtooling_request').down('form').getForm().findField('operation_procedures').getValue() != "") {
        	Ext.getCmp('tabtooling_request').down('form').getForm().findField('operation_procedures').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabtooling_request').down('form').getForm().findField('bbb_sku_used').getValue() != "") {
        	Ext.getCmp('tabtooling_request').down('form').getForm().findField('bbb_sku_used').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabtooling_request').down('form').getForm().findField('quantity').getValue() != null) {
        	Ext.getCmp('tabtooling_request').down('form').getForm().findField('quantity').setConfig("readOnly", true);
        }

        if(data.tool_gage_type == 0) {
        	storeRequestTool.load();
        	Ext.getCmp("altVar" + time_id).setStore(storeRequestTool);
        }
        if(data.tool_gage_type == 1) {
        	storeRequestGage.load();
        	Ext.getCmp("altVar" + time_id).setStore(storeRequestGage);
        }
	}

	if (iddoc == 'equipment_request'){
		if(data.drawing2d && data.drawing2d!=null && data.drawing3d && data.drawing3d!=null) data.pending_design = "0";
        if(data.drawing2d && data.drawing2d!=null){
            Ext.getCmp('tabequipment_request').query('image')[0].setSrc('img/components/'+data.drawing2d);
        }
        if(data.drawing3d && data.drawing3d!=null){
            Ext.getCmp('tabequipment_request').query('image')[1].setSrc('img/components/'+data.drawing3d);
        }
        if(data.addImages){
            storeImg.removeAll();
            storeImg.add(Ext.decode(data.addImages));
        }
        if(data.add_spec){
        	storeDoc.removeAll();
            storeDoc.add(Ext.decode(data.add_spec));
        }
        if(data.id){
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('tgId').setValue(data.id);
        }
        if(data.alternative_id) {
        	if(data.alternative_id != 0) Ext.getCmp('tabequipment_request').down('form').getForm().findField('altVar').setValue(data.alternative_id);
        	else Ext.getCmp('tabequipment_request').down('form').getForm().findField('altVar').setValue("");
        }
        if(data.qty) {
        	var qty = JSON.parse(data.qty);
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('quantity').setValue(qty['0'].qty_equip);
        }
        if(data.number_qty_id) {
        	var obj = JSON.parse(data.number_qty_id);
        	var oper = "", qty = 0;
        	for(var key in obj) {
        		for(var item in obj[key]) {
        			if(item == "number") {
        				oper += obj[key][item] + ", ";
        				Ext.getCmp('tabequipment_request').down('form').getForm().findField('operation_procedures').setValue(oper);
        			}
        			else if(item == "qty") {
        				qty += +obj[key][item];
      					Ext.getCmp('tabequipment_request').down('form').getForm().findField('quantity').setValue(qty);
        			}
        		}
        	}
        }
        if(data.sku_name) {
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('bbb_sku_used').setValue(data.sku_name);
        }

        //блокировка при заполненных или пустых полях
        if(Ext.getCmp('tabequipment_request').down('form').getForm().findField('operation_procedures').getValue() != "") {
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('operation_procedures').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabequipment_request').down('form').getForm().findField('bbb_sku_used').getValue() != "") {
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('bbb_sku_used').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabequipment_request').down('form').getForm().findField('quantity').getValue() != null) {
        	Ext.getCmp('tabequipment_request').down('form').getForm().findField('quantity').setConfig("readOnly", true);
        }
	}

	if (iddoc == 'workstation_request'){
		if(data.drawing2d && data.drawing2d!=null && data.drawing3d && data.drawing3d!=null) data.pending_design = "0";
        if(data.drawing2d && data.drawing2d!=null){
            Ext.getCmp('tabworkstation_request').query('image')[0].setSrc('img/components/'+data.drawing2d);
        }
        if(data.drawing3d && data.drawing3d!=null){
            Ext.getCmp('tabworkstation_request').query('image')[1].setSrc('img/components/'+data.drawing3d);
        }
        if(data.addImages){
            storeImg.removeAll();
            storeImg.add(Ext.decode(data.addImages));
        }
        if(data.add_spec){
        	storeDoc.removeAll();
            storeDoc.add(Ext.decode(data.add_spec));
        }
        if(data.id){
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('tgId').setValue(data.id);
        }
        if(data.alternative_id) {
        	if(data.alternative_id != 0) Ext.getCmp('tabworkstation_request').down('form').getForm().findField('altVar').setValue(data.alternative_id);
        	else Ext.getCmp('tabworkstation_request').down('form').getForm().findField('altVar').setValue("");
        }
        if(data.qty) {
        	var qty = JSON.parse(data.qty);
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('quantity').setValue(qty['0'].qty_work);
        }
        if(data.number_qty_id) {
        	var obj = JSON.parse(data.number_qty_id);
        	var oper = "", qty = 0;
        	for(var key in obj) {
        		for(var item in obj[key]) {
        			if(item == "number") {
        				oper += obj[key][item] + ", ";
        				Ext.getCmp('tabworkstation_request').down('form').getForm().findField('operation_procedures').setValue(oper);
        			}
        			else if(item == "qty") {
        				qty += +obj[key][item];
      					Ext.getCmp('tabworkstation_request').down('form').getForm().findField('quantity').setValue(qty);
        			}
        		}
        	}
        }
        if(data.sku_name) {
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('bbb_sku_used').setValue(data.sku_name);
        }

        //блокировка при заполненных или пустых полях
        if(Ext.getCmp('tabworkstation_request').down('form').getForm().findField('operation_procedures').getValue() != "") {
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('operation_procedures').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabworkstation_request').down('form').getForm().findField('bbb_sku_used').getValue() != "") {
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('bbb_sku_used').setConfig("readOnly", true);
        }
        if(Ext.getCmp('tabworkstation_request').down('form').getForm().findField('quantity').getValue() != null) {
        	Ext.getCmp('tabworkstation_request').down('form').getForm().findField('quantity').setConfig("readOnly", true);
        }
	}

if(iddoc == "eps_production") {
		if(data.final_test) {
			epsFinalStore.removeAll();
			epsFinalStore.add(Ext.decode(data.final_test));
		}
		if(data.diagnostic_software) {
			epsDiagnosticStore.removeAll();
			epsDiagnosticStore.add(Ext.decode(data.diagnostic_software));
		}
	}

if (iddoc == 'process_design_start'){
	//storeOperationGrid.removeAll();
	if(data.process_id){

		Ext.getCmp('process_operations_grid'+time_id).getStore().load({
			params:{
				id:data.process_id,
				request_id: data.RequestID
			}
		});
	}

	if(data.purpose){
		var data1 = Ext.decode(data.purpose);
		Ext.getCmp('purpose_grid'+time_id).getStore().each(function(record){
			for(var i =0; i<data1.length; i++){
				if(record.get('id')==data1[i]['id']) record.set('result', data1[i]['result']);
			}
		});
	}

	if(data.details){
		var data2 = Ext.decode(data.details);
		Ext.getCmp('details_grid'+time_id).getStore().each(function(record){
			for(var i =0; i<data2.length; i++){
				if(record.get('id')==data2[i]['id']) {
					record.set('result', data2[i]['result']);
					record.set('qty', data2[i]['qty']);
				}
			}
		});
	}

	if(data.files){
		var storeFilesPDS = Ext.getCmp('hidden_grid_pds_'+time_id).getStore();
		storeFilesPDS.removeAll();
		var files = Ext.decode(data.files);
		storeFilesPDS.loadData(files);
		storeFilesPDS.each(function(record){
			data[record.get('name')] = record.get('document');
		});
	}
}

if (iddoc == 'capex' || iddoc == 'capex_approve'){
	storeProjectElements.removeAll();
	if(data.process_id){
		storeProjectElements.load({
			params:{
				id:data.process_id,
				request_id: data.RequestID
			}
		});
	}

	if(data.purpose){
		var data1 = Ext.decode(data.purpose);
		var storeProjectPurpose = Ext.getCmp('purpose_grid'+time_id).getStore();
		storeProjectPurpose.each(function(record){
			for(var i =0; i<data1.length; i++){
				if(record.get('id')==data1[i]['id']) record.set('result', data1[i]['result']);
			}
		});
	}

	if(data.details){
		var data2 = Ext.decode(data.details);
		var storeProjectDetails = Ext.getCmp('details_grid'+time_id).getStore();
		storeProjectDetails.each(function(record){
			for(var i =0; i<data2.length; i++){
				if(record.get('id')==data2[i]['id']) {
					record.set('result', data2[i]['result']);
					record.set('qty', data2[i]['qty']);
				}
			}
		});
	}
}

if (iddoc == 'capex_approve'){
	var isOper = false;
	var isContr = false;
	var isCFO = false;
	var isPresident = false;

	if(all_rights.president){
		isPresident = true;
	}

	if(all_rights.cfo){
		isCFO = true;
	}

	if(all_rights.controler){
		isContr = true;
	}

	if(all_rights.operator){
		isOper = true;
	}
	

	//Ext.getCmp('oper_name'+time_id).setConfig('readOnly', !isOper);
	if(!Ext.getCmp('approved_oper'+time_id).getValue()){
		Ext.getCmp('approved_oper'+time_id).setConfig('readOnly', !isOper);
	}

	if(!Ext.getCmp('approved_contr'+time_id).getValue()){
		Ext.getCmp('approved_contr'+time_id).setConfig('readOnly', !isContr);
	}
	//Ext.getCmp('contr_name'+time_id).setConfig('readOnly', !isContr);
	
	if(!Ext.getCmp('approved_cfo'+time_id).getValue()){
		Ext.getCmp('approved_cfo'+time_id).setConfig('readOnly', !isCFO);
	}
	//Ext.getCmp('cfo_name'+time_id).setConfig('readOnly', !isCFO);
	
	if(!Ext.getCmp('approved_president'+time_id).getValue()){
		Ext.getCmp('approved_president'+time_id).setConfig('readOnly', !isPresident);
	}
	//Ext.getCmp('president_name'+time_id).setConfig('readOnly', !isPresident);
	
}

if (iddoc == 'procurement_request'){
	storeProcurementList.removeAll();
	if(data.process_id){
		storeProcurementList.load({
			params:{
				id:data.process_id,
				request_id: data.RequestID
			}
		});
	}
}

if (iddoc == 'purchasing_request'){
	storePurchasingList.removeAll();
	if(data.process_id){
		storePurchasingList.load({
			params:{
				id:data.process_id,
				request_id: data.RequestID
			}
		});
	}
}

if (iddoc == 'implementation_request'){
	storeImplementationList.removeAll();
	if(data.process_id){
		storeImplementationList.load({
			params:{
				id:data.process_id,
				request_id: data.RequestID
			}
		});
	}
}

if(iddoc == 'reverse_engineering'){
	var storeBOM = Ext.getCmp('gridbom'+time_id).getStore();
		if (data.bbb_sku){
			storeBOM.load({
				params:{
					bbb_sku: data.bbb_sku
				}
			});
					
		}

		if(data.sku_status&&data.sku_status==1){
			setBOMReadOnly(time_id);
		}
	}

if(iddoc == 'reverse_engineering_start'){
	if(data.ProductFamily){
		Ext.getCmp('button_PhysAttrTable'+time_id).enable();
    	Ext.getCmp('button_dtwCoreAnalysis'+time_id).enable();
	}
	loadDataProductFamily(time_id+'main_form', data.ProductFamily, data.RequestID);
	if(data.pack_req){
		var data_pack = Ext.decode(data.pack_req);
		var pack_store = Ext.getCmp('pack_requirement_grid'+time_id).getStore();
		pack_store.loadData(data_pack);
	}
}

	if(iddoc == 'ppap_test_plan' || iddoc == 'ppap_review'||iddoc == 'ppap_finished_good' ||iddoc == 'ppap_finished_good_review'){
		var storeDimesionalPPAP = Ext.getCmp('gridDimPPAP'+time_id).getStore();
		var storeFunctionalPPAP = Ext.getCmp('gridFuncPPAP'+time_id).getStore();

		if(data){
		if(data.outsource_draft){
			if(data.outsource_draft==1) {
				Ext.getCmp('approve_'+iddoc+time_id).disable();
				Ext.getCmp('reject_'+iddoc+time_id).disable();
			}
		}

		storeFiles.removeAll();
		if(data.files){
			var files = Ext.decode(data.files);
			storeFiles.loadData(files);
			storeFiles.each(function(record){
				data[record.get('name')] = record.get('document');
			});
		}

		var val = data.id_part_number;
		storeDimesionalPPAP.removeAll();
		storeFunctionalPPAP.removeAll();
		if(data.dim_test == null){
			storeDimesionalPPAP.load({
                params:{
                    id: val
                }
            });
		}
		else {
			var data2 = Ext.decode(data.dim_test);
			storeDimesionalPPAP.loadData(data2);
		}

		if(data.func_test == null){
			storeFunctionalPPAP.load({
                params:{
                    id: val
                }
            });
		}
		else {
			if (data.func_test){
				var data3 = Ext.decode(data.func_test);
				storeFunctionalPPAP.loadData(data3);
			}
		}
	}
}

	if(iddoc == 'ecr'){
		var ecr_type = data.ecr_type;
		switch(Number(ecr_type)){
			case 2:

			break;
			case 3:
				if(data.ecr_data){
					var ecr_data = correctJSON(data.ecr_data);
					var ecr_arr = Ext.decode(ecr_data);
					Ext.getCmp('ecr_container_'+time_id).removeAll();
                    var ecr_item = getProcessItem({time_id:time_id, action: 'edit', ecr_data:ecr_arr});
                    Ext.getCmp('ecr_container_'+time_id).add(ecr_item);
				}

				if(data.files){
					var storeFilesPDS = Ext.getCmp('hidden_grid_pds_'+time_id).getStore();
					var files = Ext.decode(data.files);
					storeFilesPDS.loadData(files);
					storeFilesPDS.each(function(record){
						data[record.get('name')] = record.get('document');
					});
				}
			break;
		}

		if(data.doc_support_files){
			var doc_support_files = Ext.decode(data.doc_support_files);
			Ext.getCmp('doc_grid'+time_id+'ca').getStore().loadData(doc_support_files);
		}

		if(data.doc_support_imgs){
			var doc_support_imgs = Ext.decode(data.doc_support_imgs);
			Ext.getCmp('UploadForm'+time_id+'ca').getStore().loadData(doc_support_imgs);
		}

		if(data.approvals){
			storeApprovals.load();
			var approvals = Ext.decode(data.approvals);
			Ext.getCmp('approval_grid'+time_id).getStore().loadData(approvals);
			Ext.getCmp('add_approvals_btn_'+time_id).hide();
			Ext.getCmp('approval_grid'+time_id).show();
		}
	}

	if(iddoc == 'ecr_approval'||iddoc=='ecr_implementation'){
		var ecr_type = data.ecr_type;
		switch(Number(ecr_type)){
			case 2:

			break;
			case 3:
				if(data.ecr_data){
					var ecr_data = correctJSON(data.ecr_data);
					var ecr_arr = Ext.decode(ecr_data);
					Ext.getCmp('ecr_container_'+time_id).removeAll();
                    var ecr_item = getProcessItem({time_id:time_id, action: 'view', ecr_data:ecr_arr});
                    Ext.getCmp('ecr_container_'+time_id).add(ecr_item);
				}

				if(data.files){
					var storeFilesPDS = Ext.getCmp('hidden_grid_pds_'+time_id).getStore();
					var files = Ext.decode(data.files);
					storeFilesPDS.loadData(files);
					storeFilesPDS.each(function(record){
						data[record.get('name')] = record.get('document');
					});
				}
			break;
		}

		if(data.doc_support_files){
			var doc_support_files = Ext.decode(data.doc_support_files);
			Ext.getCmp('doc_grid'+time_id+'ca').getStore().loadData(doc_support_files);
		}

		if(data.doc_support_imgs){
			var doc_support_imgs = Ext.decode(data.doc_support_imgs);
			Ext.getCmp('UploadForm'+time_id+'ca').getStore().loadData(doc_support_imgs);
		}
	}

	if(iddoc=='ecr_implementation'){
		if(data.approvals){
			var all_approve = true;
			storeApprovals.load();
			var approvals = Ext.decode(data.approvals);
			var statuses = [];
			if(data.statuses){
				statuses = data.statuses.split(",");
			}
			
			var task_ids = data.task_ids.split(",");
			var persons = data.persons.split(",");
			var drafts = data.drafts.split(",");
			
			var signature_container = Ext.getCmp('approval_signatures_'+time_id);
			for(var i = 0; i<approvals.length; i++){
				signature_container.add(getECRSignatureBox(time_id));
				for (var k = 0; k<persons.length; k++) {
					if(Number(persons[k])==approvals[i].person_id){
						approvals[i]['approval_status'] = (drafts[k]==0)? Number(statuses[k]):3;
						approvals[i]['idxs'] = Number(task_ids[k]);
					}
				}
			}
			var signatures = signature_container.query('[cls=signature_box]');
			for(var i=0; i<approvals.length; i++){
				var name = "";
				storeApprovals.each(function(record){
					if(record.get('person_id')==approvals[i].person_id) name = record.get('name');
				});
				signatures[i].query('[name=name]')[0].setValue(name);
				signatures[i].query('[name=position]')[0].setValue(approvals[i].position);
				signatures[i].query('[name=approval_status]')[0].setValue(approvals[i].approval_status);
				if(approvals[i].approval_status!==1) all_approve = false;
				signatures[i].query('[name=idxs]')[0].setValue(approvals[i].idxs);
			}
			signature_container.show();
			if(all_approve) {
				Ext.getCmp('implementation_btn_'+time_id).show();
			}
		}

		if(data.impl_action&&data.impl_action==1){
			Ext.getCmp('implementation_btn_'+time_id).setConfig('disabled', true);
			Ext.getCmp('ecn_container_'+time_id).add(getECNBlock(time_id));
		}

		if(data.signatures){
			var signatures_store = Ext.getCmp('ecn_signatures_grid'+time_id).getStore();
			var signatures = Ext.decode(data.signatures);
			signatures_store.loadData(signatures);
		}
	}

	if(iddoc=='capa_request'){
		var task_case = data.problems;
		switch(Number(task_case)){
			case 2:

			break;
			case 3:
				if(data.process_issue){
					var process_issue = correctJSON(data.process_issue);
					var process_arr = Ext.decode(process_issue);
					Ext.getCmp('process_box_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id, action: 'view', process_issue:process_arr});
                    Ext.getCmp('process_box_'+time_id).add(process_item);
				}
			break;
		}		
	}

	if(iddoc =='capa'){
		var task_case = data.problems;
		switch(Number(task_case)){
			case 2:

			break;
			case 3:
				if(data.process_issue){
					var process_issue = correctJSON(data.process_issue);
					var process_arr = Ext.decode(process_issue);
					Ext.getCmp('process_box_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id, action: 'view', process_issue:process_arr});
                    Ext.getCmp('process_box_'+time_id).add(process_item);
				}

				if(data.ecr_data){
					var ecr_data = correctJSON(data.ecr_data);
					var ecr_arr = Ext.decode(ecr_data);
					//Ext.getCmp('ecr_container_'+time_id).removeAll();
					var action = 'edit';
					if(data.draft==0) action = 'view';
                    var process_item = getProcessItem({time_id:time_id+'ecr', case_type: 'capa_ecr', action: action, ecr_data:ecr_arr});
                    //Ext.getCmp('start_ecr_btn_'+time_id).hide();
                    Ext.getCmp('ecr_container_'+time_id).add(process_item);
				}
				else {
					Ext.getCmp('start_ecr_btn_'+time_id).show();
				}

				if(data.approvals){
					storeApprovals.load();
					var approvals = Ext.decode(data.approvals);
					Ext.getCmp('approval_grid'+time_id).getStore().loadData(approvals);
					Ext.getCmp('add_approvals_btn_'+time_id).hide();
					Ext.getCmp('approval_grid'+time_id).show();
				}
				else {
					Ext.getCmp('add_approvals_btn_'+time_id).show();
				}
			break;
		}
		setCAPADatas(data, time_id);
	}

	if(iddoc=='capa_implementation'){
		var task_case = data.problems;
		switch(Number(task_case)){
			case 2:

			break;
			case 3:
				if(data.process_issue){
					var process_issue = correctJSON(data.process_issue);
					var process_arr = Ext.decode(process_issue);
					Ext.getCmp('process_box_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id, action: 'view', process_issue:process_arr});
                    Ext.getCmp('process_box_'+time_id).add(process_item);
				}

				if(data.ecr_data){
					var ecr_data = correctJSON(data.ecr_data);
					var ecr_arr = Ext.decode(ecr_data);
					//Ext.getCmp('ecr_container_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id+'ecr', action: 'view', ecr_data:ecr_arr});
                    //Ext.getCmp('start_ecr_btn_'+time_id).hide();
                    Ext.getCmp('ecr_container_'+time_id).add(process_item);
				}
			break;
		}
		setCAPADatas(data, time_id);
		setDisabledAllButtons(fields);

		if(data.approvals){
			storeApprovals.load();
			var approvals = Ext.decode(data.approvals);
			var statuses = [];
			if(data.statuses){
				statuses = data.statuses.split(",");
			}
			
			var task_ids = data.task_ids.split(",");
			var persons = data.persons.split(",");
			var drafts = data.drafts.split(",");
			
			var signature_container = Ext.getCmp('approval_signatures_'+time_id);
			for(var i = 0; i<approvals.length; i++){
				signature_container.add(getSignatureBox(time_id));
				for (var k = 0; k<persons.length; k++) {
					if(Number(persons[k])==approvals[i].person_id){
						approvals[i]['approval_status'] = (drafts[k]==0)? Number(statuses[k]):3;
						approvals[i]['idxs'] = Number(task_ids[k]);
					}
				}
			}
			var signatures = signature_container.query('[cls=signature_box]');
			for(var i=0; i<approvals.length; i++){
				var name = "";
				storeApprovals.each(function(record){
					if(record.get('person_id')==approvals[i].person_id) name = record.get('name');
				});
				signatures[i].query('[name=name]')[0].setValue(name);
				signatures[i].query('[name=position]')[0].setValue(approvals[i].position);
				signatures[i].query('[name=approval_status]')[0].setValue(approvals[i].approval_status);
				signatures[i].query('[name=idxs]')[0].setValue(approvals[i].idxs);
			}
			signature_container.show();
		}
	}

	if(iddoc=='capa_ecr'){
		var task_case = data.problems;
		switch(Number(task_case)){
			case 2:

			break;
			case 3:
				if(data.process_issue){
					var process_issue = correctJSON(data.process_issue);
					var process_arr = Ext.decode(process_issue);
					Ext.getCmp('process_box_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id, action: 'view', process_issue:process_arr});
                    Ext.getCmp('process_box_'+time_id).add(process_item);
				}

				if(data.ecr_data){
					var ecr_data = correctJSON(data.ecr_data);
					var ecr_arr = Ext.decode(ecr_data);
					//Ext.getCmp('ecr_container_'+time_id).removeAll();
                    var process_item = getProcessItem({time_id:time_id+'ecr', action: 'view', ecr_data:ecr_arr});
                    Ext.getCmp('ecr_container_'+time_id).add(process_item);
				}
			break;
		}
		setCAPADatas(data, time_id);
		setDisabledAllButtons(fields);
	}

	fields.each(function(item){
		if (item.config.allowBlank === false){
               item.allowBlank = item.config.allowBlank;
              }

		var dataValue;
		if (item.getName() =="Status"){
			item.setValue(status_id);
		}
		for (var k in data){
			if(item.getName() == k && data[k]!=null){
				item.setValue(data[k]);
			}
		}
	});

	if(data.Status == 4) {
		Ext.getCmp('RequestedDate_Days'+iddoc+time_id).setConfig("hidden", true);
		Ext.getCmp('Assignmentdate_Days'+iddoc+time_id).setConfig("hidden", true);
		Ext.getCmp('Duedate_Days'+iddoc+time_id).setConfig("hidden", true);
		Ext.getCmp('NewDueDate_Days'+iddoc+time_id).setConfig("hidden", true);
		Ext.getCmp('CompletionDate_Days'+iddoc+time_id).setConfig("hidden", true);
	}

	//трансформация даты
	//if(iddoc == "new_component_req" ||iddoc == "new_engineering_req" || iddoc == "due_diligence" || iddoc == "sample_procurement" || iddoc == "feasibility_product_eng" || iddoc == "feasibility_process_eng" || iddoc == "cost_estimate" || iddoc == "preliminary_roi_pm" || iddoc == "npd_request" || iddoc == "sample_validation" || iddoc == "reverse_engineering_start" || iddoc == "eps_production" || iddoc == "reverse_engineering" || iddoc == "ppap_test_plan" || iddoc == "ppap_review" || iddoc == "ppap_finished_good" || iddoc == "ppap_finished_good_review" || iddoc == "process_design_request" || iddoc == "process_design_start" || iddoc == "capex" || iddoc == "capex_approve" || iddoc == "purchasing_request" || iddoc == "procurement_request" || iddoc == "implementation_request" || iddoc == "new_product_line" || iddoc == "tooling_request" || iddoc == "equipment_request" || iddoc == "workstation_request") {
		if(data.AssignmentDate || data.RequestedDate || data.CompletionDate) {
			if(data.AssignmentDate != null) timeTransform(data.AssignmentDate, 'Assignmentdate_'+iddoc+time_id);
			if(data.CompletionDate != null) timeTransform(data.CompletionDate, 'CompletionDate_'+iddoc+time_id);
			if(data.RequestedDate != null) timeTransform(data.RequestedDate, 'RequestedDate_'+iddoc+time_id);
			
			//для preliminary_roi_pm
			if(data.PreliminaryROIApprovalDate != null) timeTransform(data.PreliminaryROIApprovalDate, 'PreliminaryROIApprovalDate'+time_id);
		}
	//}

	if (Ext.getCmp('Duedate_'+iddoc+time_id).getValue()){
		Ext.getCmp('Duedate_'+iddoc+time_id).setConfig('readOnly', true);
	}
}

function editForm(form, id, id_row, rights){
	var fields = form.getFields();
	var time_id = getTimeID(fields);
	Ext.Ajax.request({
		url: 'scripts/saveformref.php',
		method: 'POST',
		params: {edit:id_row,table:id},
		success: function (response){
			var JSON = response.responseText;
			if(JSON){
				var data = Ext.decode(JSON);
				setFields(fields, data, id);
				if(data.draft == 0 || data.draft == 3){
					setReadOnly(fields, id, false);
				}
				else {
					setRightsCapabilities(fields, rights, id);
				}
			}
		},
		failure: function (response){ 
			Ext.MessageBox.alert(lan.error, response.responseText);
		}
	});

}

function setReadOnly(fields, iddoc){
	var time_id = getTimeID(fields);

	setDisabledAllButtons(fields);

	fields.each(function(item){
		item.setConfig('readOnly',true);
	});

	if(all_rights[iddoc].indexOf("history")!=-1){
		Ext.getCmp('history_'+iddoc+time_id).enable();
	}

    if (iddoc == 'new_engineering_req'){
    	setColumnHidden('Customers_ner'+time_id);
    }

    if (iddoc == 'new_component_req'){
    	var view_btns = Ext.getCmp('tasks_container'+time_id).query('[cls=view_edit_comp]');
    	for (var i = 0; i < view_btns.length; i++) {
    		view_btns[i].setDisabled(false);
    	}
    }

    if (iddoc == 'due_diligence'){
        //disableButtonDue();
        setColumnHidden('coresku_due_diligence'+time_id);
       	setColumnHidden('oesku_due_diligence'+time_id);
        setColumnHidden('similarsku_due_diligence'+time_id);
        setColumnHidden('reman_sku_upc'+time_id);
        setColumnHidden('Customers_due_diligence'+time_id);
        setColumnReadOnly('coresku_due_diligence'+time_id, ['setUp']);
    }

    if (iddoc == 'reverse_engineering'){
    	setColumnReadOnly('gridbom'+time_id, ['qty']);
    	setColumnDisabled('gridbom'+time_id, ['in_house', 'out_source', 'reuse_from_core']);
    	setColumnHidden('gridbom'+time_id);
    	Ext.getCmp('bom_add'+time_id).hide();
    	Ext.getCmp('bom_create'+time_id).hide();

    }

    if (iddoc == 'ppap_test_plan'||iddoc == 'ppap_finished_good'){
    	//Ext.getCmp('delpfmea'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('deldfmea'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('delcontr_plan'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('delmat_cert'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformpfmea'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformdfmea'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformcontr_plan'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformmat_cert'+time_id).setConfig('disabled', true);

    }

    if (iddoc == 'ecr_form'){
    	Ext.getCmp('grid_control'+time_id).setValue(0);
    	setColumnHidden('gridDimAttr'+time_id);
    	setColumnHidden('gridFuncAttr'+time_id);
    	setColumnHidden('doc_grid'+time_id);

    	//Ext.getCmp('func_add_attr'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('dim_add_attr'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('image1'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('drawing2d'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('drawing3d'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('add_imageform'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('delete'+time_id).setConfig('hidden', true);
    	//Ext.getCmp('fileform'+time_id).setConfig('hidden', true);
    }

     if (iddoc == 'process_design_start'){
    	setColumnHidden('process_operations_grid'+time_id);
    	setColumnReadOnly('purpose_grid'+time_id, ['result']);
    	setColumnReadOnly('details_grid'+time_id, ['result', 'qty']);

    	//Ext.getCmp('process_tool'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('process_add'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('process_create'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformdiagram'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('deldiagram'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('fileformanalysis'+time_id).setConfig('disabled', true);
    	//Ext.getCmp('delanalysis'+time_id).setConfig('disabled', true); 
    }

    if (iddoc == 'capex'){
    	setColumnReadOnly('gridProjectElements'+time_id, ['year', 'quarter']);
    }

    if (iddoc == 'procurement_request'){
    	setColumnReadOnly('gridProcurementList'+time_id, ['received']);
    }

    if (iddoc == 'purchasing_request'){
    	setColumnReadOnly('gridPurchasingList'+time_id, ['received']);
    }

    if (iddoc == 'implementation_request'){
    	setColumnReadOnly('gridImplementationList'+time_id, ['implemented']);
    }

    if(iddoc == "tooling_request"||iddoc == "equipment_request"||iddoc == "workstation_request") {
    	//Ext.getCmp('draw2d' + time_id).setConfig('disabled', true);
    	//Ext.getCmp('draw3d' + time_id).setConfig("disabled", true);
    	//Ext.getCmp('add_image' + time_id).setConfig("disabled", true);
    	//Ext.getCmp("del" + time_id).setConfig("disabled", true);
    	//Ext.getCmp("fileForm" + time_id).setConfig("disabled", true);
    	//Ext.getCmp("act" + time_id).setConfig("hidden", true);
    	setColumnHidden('docGrid'+time_id);
    }

    if(iddoc == "eps_production") {
    	//Ext.getCmp('finalBut' + time_id).setConfig('disabled', true);
    	//Ext.getCmp("finalDel" + time_id).setConfig("hidden", true);
    	//Ext.getCmp('diagnosticBut' + time_id).setConfig('disabled', true);
    	//Ext.getCmp("diagnosticDel" + time_id).setConfig("hidden", true);
    	setColumnHidden('final_grid'+time_id);
    	setColumnHidden('diagnostic_grid'+time_id);
    }

    if (iddoc == 'reverse_engineering_start'){
    		var product_family = getFieldByName(fields, 'ProductFamily');
    		if(product_family){
    			Ext.getCmp('button_PhysAttrTable'+time_id).enable();
            	Ext.getCmp('button_dtwCoreAnalysis'+time_id).enable();
    		}
    		setColumnHidden('pack_requirement_grid'+time_id);
    }

    if(iddoc == 'ppap_review') {
    	Ext.getCmp("export_ppap"+time_id).enable();
    }
        
}


function FormatDate(date) {
	var date = Ext.Date.parse(date, 'Y-m-d H:i:s');
	date = Ext.Date.format(date, 'Y-m-d');
}

function setStoreDueDiligence(data, time_id){	
		if (data.PotentialCustomers){
			//CustomersStore.removeAll();
			var el = Ext.getCmp('Customers_due_diligence'+time_id);
			var CustomersStore = el.getStore();
			var data1 = Ext.decode(data.PotentialCustomers);
			CustomersStore.loadData(data1);
			el.show();
		}

		if (data.core_skuT){
			var data_sku = Ext.decode(data.core_skuT);
			var el = Ext.getCmp('coresku_due_diligence'+time_id);
			var core_skuStore = el.getStore();
			for (var i = 0;i<data_sku.length; i++) {
				data_sku[i]['setUp'] = Number(data_sku[i]['setUp']);
			}
			core_skuStore.loadData(data_sku);		
			el.show();
		}
		
		if (data.oe_sku){
			var el = Ext.getCmp('oesku_due_diligence'+time_id);
			var oe_skuStore = el.getStore();
			setStoreDataJSON(oe_skuStore, data.oe_sku);		
			el.show();
		}

		if (data.similar_sku){
			var el = Ext.getCmp('similarsku_due_diligence'+time_id);
			var similar_skuStore = el.getStore();
			setStoreDataJSON(similar_skuStore, data.similar_sku);		
			el.show();
		}
		if (data.reman_sku_upc){
			var el = Ext.getCmp('reman_sku_upc'+time_id);
			var reman_sku_upcStore = el.getStore();
			setStoreDataJSON(reman_sku_upcStore, data.reman_sku_upc);		
			el.show();
		}

		var competitors = Ext.getCmp('competitor_container'+time_id).query('fieldset');
		if(data.competitor){
			var competitor_data = Ext.decode(data.competitor);
			for(var i = 0; i<competitor_data.length; i++){
				Ext.getCmp('competitor_container'+time_id).add(getCompetitorBlock(time_id));
			}
			competitors = Ext.getCmp('competitor_container'+time_id).query('fieldset');
			for(var i=0; i<competitor_data.length; i++){
				competitors[i].query('[name=competitor_name]')[0].setValue(competitor_data[i].name);
				competitors[i].query('[name=competitor_cross_ref]')[0].setValue(competitor_data[i].cross_ref);
				competitors[i].query('[name=competitor_market_price]')[0].setValue(competitor_data[i].market_price);
				competitors[i].query('[name=MarketPriceDate]')[0].setValue(competitor_data[i].market_price_date);
				competitors[i].query('[name=competitor_core_price]')[0].setValue(competitor_data[i].comp_core_price);
				competitors[i].query('[name=CorePriceDate]')[0].setValue(competitor_data[i].comp_core_price_date);
			}
			/*for (var i = 0; i < competitor.length; i++){
				if (i > 0) {
					addCompetitorBlock(time_id, container); 
				}
				for (var k in competitor[i]){
					Ext.getCmp(k +(container)+time_id).setValue(competitor[i][k]);
				}

			}*/
		}
		else if(competitors.length==0){
			Ext.getCmp('competitor_container'+time_id).add(getCompetitorBlock(time_id));
		}
}

function setStoreDataJSON(store, data){
	store.removeAll();
	var data2 = Ext.decode(data);
	store.loadData(data2);
}

function getStoreDueDiligence(time_id){		
		 var customer = [];
		 var core_sku = [];
		 var oe_sku = [];
		 var similar_sku = [];
		 var reman_sku_upc = [];
		 var competitors_arr = [];
		 var  core_skuJS = oe_skuJS= similar_skuJS = reman_sku_upcJS = customerJS =competitorsJS=null;

		var competitors = Ext.getCmp('competitor_container'+time_id).query('fieldset');
		for(var i=0; i<competitors.length; i++){
			var name = competitors[i].query('[name=competitor_name]')[0].getValue();
			var cross_ref = competitors[i].query('[name=competitor_cross_ref]')[0].getValue();
			var market_price = competitors[i].query('[name=competitor_market_price]')[0].getValue();
			var market_price_date = competitors[i].query('[name=MarketPriceDate]')[0].rawValue;
			var comp_core_price = competitors[i].query('[name=competitor_core_price]')[0].getValue();
			var comp_core_price_date = competitors[i].query('[name=CorePriceDate]')[0].rawValue;
			competitors_arr.push({name:name, cross_ref:cross_ref, market_price: market_price, market_price_date: market_price_date, comp_core_price: comp_core_price, comp_core_price_date: comp_core_price_date});
		}

			
		var CustomersStore = Ext.getCmp('Customers_due_diligence'+time_id).getStore();
		var core_skuStore = Ext.getCmp('coresku_due_diligence'+time_id).getStore();
		var oe_skuStore = Ext.getCmp('oesku_due_diligence'+time_id).getStore();
		var similar_skuStore = Ext.getCmp('similarsku_due_diligence'+time_id).getStore();
		var reman_sku_upcStore = Ext.getCmp('reman_sku_upc'+time_id).getStore();

			CustomersStore.each(function(record){
				customer.push({name:record.get('name')});
			});	
			core_skuStore.each(function(record){
				core_sku.push({core_sku:record.get('name'), setUp: record.get('setUp')});
			});	
			oe_skuStore.each(function(record){
				oe_sku.push({'name':record.get('name')});
			});	
			similar_skuStore.each(function(record){
				similar_sku.push({'name':record.get('name')});
			});	

			reman_sku_upcStore.each(function(record){
				reman_sku_upc.push({oe_reman_sku:record.get('reman_sku'), upc: record.get('upc')});
			});	
			
			if (core_sku.length != 0){
				core_skuJS = JSON.stringify(core_sku);
			}
			if (oe_sku.length != 0){
				oe_skuJS = JSON.stringify(oe_sku);
			}
			if(similar_sku.length != 0){
				similar_skuJS = JSON.stringify(similar_sku);
			}
			if(reman_sku_upc.length != 0){
				reman_sku_upcJS = JSON.stringify(reman_sku_upc);
			}
			if(customer.length>0){
				customerJS = JSON.stringify(customer);
			}

			if(competitors_arr.length>0){
				competitorsJS = JSON.stringify(competitors_arr);
			}

			var params2 = {
				'core_sku' : core_skuJS,
				'oe_sku' : oe_skuJS,
				'similar_sku': similar_skuJS,
				'reman_sku_upc': reman_sku_upcJS,
				'PotentialCustomers' : customerJS,
				'competitors' : competitorsJS
			};
			 return params2;
}

function checkStoreDueDiligence(iddoc, time_id){
	var flag_error = false;
	//var msgDue = "Don`t add ";
    var msgDue = lan.add;

    var CustomersStore = Ext.getCmp('Customers_due_diligence'+time_id).getStore();
	var core_skuStore = Ext.getCmp('coresku_due_diligence'+time_id).getStore();
	var oe_skuStore = Ext.getCmp('oesku_due_diligence'+time_id).getStore();
	var similar_skuStore = Ext.getCmp('similarsku_due_diligence'+time_id).getStore();
	var reman_sku_upcStore = Ext.getCmp('reman_sku_upc'+time_id).getStore();
		
	if (CustomersStore.data.length == 0){
		msgDue += " "+ lan.PotentialCustomers +",";
		flag_error = true;
	}
	
	if (core_skuStore.data.length == 0){
		msgDue += " "+ lan.core_sku +",";
		flag_error = true;
	}

	if (oe_skuStore.data.length == 0){
		msgDue += " "+ lan.oe_sku +",";
		flag_error = true;
	}
	/*if (similar_skuStore .data.length == 0){
        msgDue += " "+ lan.similar_sku +",";
		flag_error = true;
	}
	if (reman_sku_upcStore .data.length == 0){
        msgDue += " "+ lan.oe_reman_sku +",";
		flag_error = true;
	}*/


	
	if (flag_error){
		msgDue  = msgDue.slice(0, -1);
		Ext.getCmp('message_'+ iddoc+time_id).setValue('<b class= "message" style="color:red">'+msgDue+'</b>');
  	    return false;
	}
	return true;
}


function setRightsCapabilities(fields, rights, iddoc){
	var time_id = getTimeID(fields);
	if(rights){
		var save_draft_ability = false;
		var assignee_field = getFieldByName(fields, "AssignedTo");
		var responsible_field = getFieldByName(fields, "Responsible");
		var due_date_field = getFieldByName(fields, "DueDate");
		var new_due_date_field = getFieldByName(fields, "NewDueDate");
		var status_field = getFieldByName(fields, "Status");

		var assignee = assignee_field.getValue();
		var responsible = responsible_field.getValue();
		var status = status_field.getValue();

		if(assignee!=id_user&&!(iddoc=='new_engineering_req'&&status==1)){
			setReadOnly(fields, iddoc);
		}
		
		if(rights.indexOf("change_responsible")!=-1){
			responsible_field.setConfig('readOnly',false);
			save_draft_ability = true;
		}

		if(rights.indexOf("change_assignee")!=-1){
			assignee_field.setConfig('readOnly',false);
			save_draft_ability = true;
		}
		
		if(rights.indexOf("change_due_date")!=-1){
			if(!due_date_field.getValue()){
				due_date_field.setConfig('readOnly',false);
			}
			save_draft_ability = true;
		}

		if(rights.indexOf("change_due_date")!=-1){
			if(!new_due_date_field.getValue()){
				new_due_date_field.setConfig('readOnly',false);
			}
			save_draft_ability = true;
		}
		
		if(assignee==id_user||responsible==id_user){
			save_draft_ability = true;
		}

		if(save_draft_ability){
			Ext.getCmp('savedraft_'+iddoc+time_id).enable();
		}

		if(rights.indexOf("complete")!=-1){
			Ext.getCmp('submit_'+iddoc+time_id).enable();
			Ext.getCmp('reject_'+iddoc+time_id).enable();
			Ext.getCmp('approve_'+iddoc+time_id).enable();
		}
		if(rights.indexOf("history")!=-1){
			Ext.getCmp('history_'+iddoc+time_id).enable();
		}
	}
	else {
		setReadOnly(fields, iddoc);
	}
}


function loadDataProductFamily(time_id, family_id=null, request_id=null){
	if(family_id!=null&&request_id!=null){
		Ext.Ajax.request({
        url: 'scripts/family_type.php?getFamilyContent=true',
        method: 'POST',
        params: {family_id:family_id, request_id: request_id},
        success: function (response){
            var JSON = response.responseText;
            if(JSON){
                var data = Ext.decode(JSON);
                if(data.core_attr){
                	var core_attr = Ext.decode(data.core_attr);
	                var chart_fields = [];
	                var chart_category = [];

	                for (var i = 0; i <core_attr.length; i++) {
	                    if(core_attr[i].data_type==5&&core_attr[i].deleted==0){
	                        chart_fields.push(core_attr[i].dynamic_id);
	                        chart_category.push(core_attr[i].attr_name);
	                    }
	                   }
	             if(data.core_data){
		            var core_data = Ext.decode(data.core_data);
		            loadAnalysisData(time_id, chart_fields, chart_category, core_data);
		        }
                }
	    }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
	}
}


function getComponentTasks(time_id){
	var tasks_arr = [];
	var tasks = Ext.getCmp('tasks_container'+time_id).query('fieldset');
	for(var i=0; i<tasks.length; i++){
		var comp_part_number = tasks[i].query('[name=comp_part_number]')[0].getValue();
		var comp_type = tasks[i].query('[name=comp_type]')[0].getValue();
		var comp_id = tasks[i].query('[name=comp_id]')[0].getValue();
		var comp_status = tasks[i].query('[name=comp_status]')[0].getValue();
		var comp_task_status = tasks[i].query('[name=comp_task_status]')[0].getValue();
		var comp_img = tasks[i].query('[name=comp_img]')[0].getValue();
		var task_description = tasks[i].query('[name=task_description]')[0].getValue();
		tasks_arr.push({comp_id: comp_id, comp_part_number:comp_part_number, comp_status:comp_status, comp_type:comp_type, comp_task_status: comp_task_status, comp_img: comp_img, task_description: task_description});
	}
	return tasks_arr;
}

function setComponentTasks(time_id, dataJS){
	var data_tasks = Ext.decode(dataJS);
	var comp_ids = "";
	for(var i = 0; i<data_tasks.length; i++){
		Ext.getCmp('tasks_container'+time_id).add(getTaskBlock(time_id));
		if(data_tasks[i].comp_id&&data_tasks[i].comp_id!==""){
			comp_ids += data_tasks[i].comp_id+",";
		}
	}
	if(comp_ids!=""){
		comp_ids = comp_ids.substring(0, comp_ids.length - 1);
	}

	Ext.Ajax.request({
        url: 'scripts/ecr_form.php?getComponentStatuses=true',
        method: 'POST',
        params: {comp_ids:comp_ids},
        success: function (response){
            var JSON = response.responseText;
            var status;
            if(JSON){
                var data_statuses = Ext.decode(JSON);
                tasks = Ext.getCmp('tasks_container'+time_id).query('fieldset');
                var status;
				for(var i=0; i<data_tasks.length; i++){
					tasks[i].query('[name=comp_part_number]')[0].setValue(data_tasks[i].comp_part_number);
					tasks[i].query('[name=comp_type]')[0].setValue(data_tasks[i].comp_type);
					tasks[i].query('[name=comp_id]')[0].setValue(data_tasks[i].comp_id);
					if(data_statuses){
						tasks[i].query('[name=comp_status]')[0].setValue(Number(data_statuses[data_tasks[i].comp_id]));
					}
					tasks[i].query('[name=comp_task_status]')[0].setValue(data_tasks[i].comp_task_status);
					tasks[i].query('[name=comp_img]')[0].setValue(data_tasks[i].comp_img);
					tasks[i].query('[name=task_description]')[0].setValue(data_tasks[i].task_description);
				}
	    }
        },
        failure: function (response){ 
            Ext.MessageBox.alert(lan.error, response.responseText);
        }
    });
}


function setCapaProcessReadOnly(form, time_id){
	var fields = form.getForm().getFields();
	fields.each(function(item){
		item.setConfig('readOnly', true);
	});
	setColumnHidden('process_operations_grid'+time_id);

	var buttons = form.query('button');
	    Ext.Array.each(buttons, function(button) {
	       button.hide();
	  });
}


function setCAPADatas(data, time_id){
	if(data.root_files){
		var root_files = Ext.decode(data.root_files);
		Ext.getCmp('doc_grid'+time_id+'r').getStore().loadData(root_files);
	}

	if(data.corrective_files){
		var corrective_files = Ext.decode(data.corrective_files);
		Ext.getCmp('doc_grid'+time_id+'ca').getStore().loadData(corrective_files);
	}

	if(data.preventive_files){
		var preventive_files = Ext.decode(data.preventive_files);
		Ext.getCmp('doc_grid'+time_id+'pa').getStore().loadData(preventive_files);
	}

	if(data.root_imgs){
		var root_imgs = Ext.decode(data.root_imgs);
		Ext.getCmp('UploadForm'+time_id+'r').getStore().loadData(root_imgs);
	}

	if(data.corrective_imgs){
		var corrective_imgs = Ext.decode(data.corrective_imgs);
		Ext.getCmp('UploadForm'+time_id+'ca').getStore().loadData(corrective_imgs);
	}

	if(data.preventive_imgs){
		var preventive_imgs = Ext.decode(data.preventive_imgs);
		Ext.getCmp('UploadForm'+time_id+'pa').getStore().loadData(preventive_imgs);
	}
}


function getCAPAProcessData(fields, time_id){
	var order=0;
	var process_issue = {};
	var data_out = [];
	var process_issueJS = "";

    var store =  Ext.getCmp('process_operations_grid'+time_id).getStore();
    store.each(function(record){
        order++;
        data_out.push({approved: record.get('approved'), descriptionOperation: record.get('descriptionOperation'), files: record.get('files'), operation_procedure: record.get('operation_procedure'), proc_number: record.get('proc_number'), order: order, id_op:record.get('id_op'), full: record.get('full'), op_number: record.get('op_number'), tool: record.get('tool'), gage: record.get('gage'), equip:record.get('equip'), work_st:record.get('work_st')});
    });

   process_issue['description'] = getValueByName(fields, 'description');
   process_issue['cell_number'] = getValueByName(fields, 'cell_number');
   process_issue['revision'] = getValueByName(fields, 'revision');
   process_issue['create_date'] = getValueByName(fields, 'create_date');
   process_issue['last_mod'] = getValueByName(fields, 'last_mod');
   process_issue['process_id'] = getValueByName(fields, 'process_id');
   process_issue['process'] = data_out;
    
   var process_issueJS = JSON.stringify(process_issue);
  return process_issueJS;
}

function getECRProcessData(fields, time_id){
	var order=0;
	var process_issue = {};
	var data_out = [];
	var process_issueJS = "";

    var store =  Ext.getCmp('process_operations_grid'+time_id).getStore();
    store.each(function(record){
        order++;
        data_out.push({approved: record.get('approved'), descriptionOperation: record.get('descriptionOperation'), files: record.get('files'), operation_procedure: record.get('operation_procedure'), proc_number: record.get('proc_number'), order: order, id_op:record.get('id_op'), full: record.get('full'), op_number: record.get('op_number'), tool: record.get('tool'), gage: record.get('gage'), equip:record.get('equip'), work_st:record.get('work_st')});
    });

   process_issue['description'] = getValueByName(fields, 'description');
   process_issue['cell_number'] = getValueByName(fields, 'cell_number');
   process_issue['revision'] = getValueByName(fields, 'revision');
   process_issue['create_date'] = getValueByName(fields, 'create_date');
   process_issue['last_mod'] = getValueByName(fields, 'last_mod');
   process_issue['process_id'] = getValueByName(fields, 'process_id');
   process_issue['base_data'] = getValueByName(fields, 'base_data');
   process_issue['process'] = data_out;
    
   var process_issueJS = JSON.stringify(process_issue);
  return process_issueJS;
}