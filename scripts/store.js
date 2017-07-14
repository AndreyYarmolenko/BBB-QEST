
Ext.define('data_model_users', {
    extend: 'Ext.data.Model',
    fields: ['id','value']
});

Ext.define('bb_loc', {
        extend: 'Ext.data.Model',
        fields: ['id','value', 'address'],
});

var data_store_users = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
			url: 'scripts/store.php?users=1',
			scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_Responsible = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?users=1',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_AssignedTo = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?users=1',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_ProductType = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
        type: 'ajax',
        url: 'scripts/store.php?productType=1',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var data_store_OEpartAnnualDemand = new Ext.data.Store({
        //autoDestroy: true,
        //autoLoad:true,
        model: 'data_model_users',
        data: [{'id':'QTY','value':'QTY'},{'id':'N/A','value':'N/A'}]
});


var data_store_Address = new Ext.data.Store({
    model: 'data_model_users',
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?address=1',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var data_store_Supplier = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?supplier=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_task_status = new Ext.data.Store({
        //autoDestroy: true,
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?task_status=1',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_department = new Ext.data.Store({
        //autoDestroy: true,
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?department=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_YESNO = new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:lan.yes},{id:0,value:lan.no}]
});

var data_store_NOYES = new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:1,value:lan.no},{id:0,value:lan.yes}]
});

var storeToolGage = new Ext.data.Store({
    fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
    data: [{id:0,value: lan.tool},{id:1,value: lan.gage}]
});

var store_Currency = new Ext.data.Store({
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCurrency=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_bb_location_name =  new Ext.data.Store({
        model: 'bb_loc',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?bb_location_name=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var data_store_ProductLine = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?productLine=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});



var store_core_sku = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCORE_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var latest_sku = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getLatest_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var oe_sku = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getOE_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var similar_sku = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getSimilar_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var reman_sku = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getReman_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_bbb_sku = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getBBB_SKU=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});



var storeEquipNumbers = new Ext.data.Store({
        fields: ['id','number'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getEquipNumbers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_part_number = new Ext.data.Store({
        fields: ['id', 'part_number', 'part_name'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getPartNumbers=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var store_description = new Ext.data.Store({     
        fields: ['description'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getDescription=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });


var data_store_Material_BOM = new Ext.data.Store({
        fields: ['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getMaterials=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});


var store_metricDim = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'name', type: 'string'}],
        data: [{id:1,name:'mm'},{id:2,name:'inch'},{id:3,name:'thread(mm)'}, {id:4,name:'thread(inch)'}, {id:5,name:'Grade'}, {id:6,name:'Turns'}, {id:7,name:'qty'}, {id:8,name:'mic'}, {id:9,name:'HRC'}]
});

var store_metricFunc = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'name', type: 'string'}],
        data: [{id:1,name:'V'},{id:2,name:'°F'},{id:3,name:'°C'}, {id:4,name:'A'}, {id:5,name:'cc'}, {id:6,name:'Cycles'}, {id:7,name:'gpm'}, {id:8,name:'Grade'}, {id:9,name:'in/lb'}, {id:10,name:'lb/in'}, {id:11,name:'lb/ft'}, {id:12,name:'Lb/in'}, {id:13,name:'Lbs'}, {id:14,name:'Mg'}, {id:15,name:'N'}, {id:16,name:'Nm'}, {id:17,name:'psi'}, {id:18,name:'S'}]
});

var storeDivision = new Ext.data.Store({
        fields: ['id', 'name'],
        data: [{'id':'1','name':'AMAM'},{'id':'2','name':'OES'}]
});

var store_potential_customers = new Ext.data.Store({
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCustomers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});


var storeOperators = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getOperators=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeControlers = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getControlers=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeCFO = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCFO=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storePresidents = new Ext.data.Store({
        fields: ['id','value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getPresident=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeRequestTool = Ext.create("Ext.data.Store", {
    fields: ['id', 'name'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getDirectoryTool=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeRequestGage = Ext.create("Ext.data.Store", {
    fields: ['id', 'name'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getDirectoryGage=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeRequestEquip = Ext.create("Ext.data.Store", {
    fields: ['id', 'name'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getDirectoryEquip=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeRequestWork = Ext.create("Ext.data.Store", {
    fields: ['id', 'name'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getDirectoryWork=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_competitor = new Ext.data.Store({
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCompetitors=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var dataPriority = [];
for (var i =1; i <= 10; i++ ){
    var priority ='';
    if (i == 1){
        priority = ' (highest)';
    }
    if (i == 10){
        priority = ' (lowest)';
    }
    dataPriority.push({id: i, value: i + priority});
}

var  store_PriorityLevel = new Ext.data.Store({     
        fields: ['id', 'value'],
        data:dataPriority
    });


var store_predominant_make = new Ext.data.Store({
        //autoDestroy: true,
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getPredominantMake=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_lifecycle = new Ext.data.Store({
        //autoDestroy: true,
        model: 'data_model_users',
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getLifecycle=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeStatusEl = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:0, value:'<span style="color: blue"><b>'+lan.new+'</b><span>'}, {id:1,value:'<span style="color: green"><b>'+lan.approved+'</b><span>'},{id:2,value:'<span style="color: red"><b>'+lan.rejected+'</b><span>'}]
});

var storePhAttrName = new Ext.data.Store({
        fields: ['attr_id','attr_name'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getPhAttrNames=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows'
            }
        }
});

var storeCoreAttrName = new Ext.data.Store({
        fields: ['attr_id','attr_name'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCoreAttrNames=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows'
            }
        }
});

var storeFieldTypes = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:1,value:'TEXT'},{id:2,value:'DROPDOWN LIST'},{id:3,value:'INTEGER'}, {id:4,value:'NUMERIC'},{id:5,value:'DROPDOWN:SCRAP'},{id:6,value:'DATE'}]
});

var storeFieldTypesPh = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:1,value:'TEXT'},{id:2,value:'DROPDOWN LIST'},{id:3,value:'INTEGER'}, {id:4,value:'NUMERIC'},{id:5,value:'DROPDOWN:YES/NO'},{id:6,value:'DATE'}]
});

var storeStatusCondition = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [
            { name: "(n/a)", value: 0},
            { name: "Good", value: 1},
            { name: "Present", value: 2},
            { name: "Damaged", value: 3},
            { name: "Missing", value: 4}
        ]
});


var storeGages = Ext.create("Ext.data.Store", {
    fields: [{type: 'int', name: 'id'}, 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getAllToolGage=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeEquipment = Ext.create("Ext.data.Store", {
    fields: [{type: 'int', name: 'id'}, 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getAllEquipment=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeTestProc = Ext.create("Ext.data.Store", {
    fields: [{type: 'int', name: 'id'}, 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getAllTestProcedure=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeCompTypes = new Ext.data.Store({
        fields: ['id', 'value'],
        data: [{id:'1',value:'Component FG'},{id:'2',value:'Component'},{id:'3',value:'KIT'}, {id:'4',value:'Kit Part'}]
});

var storeMaterials = new Ext.data.Store({
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getMaterials=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_dimension_name = new Ext.data.Store({     
        fields: ['dimension_name'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getDimensionName=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var store_value_desc = new Ext.data.Store({     
        fields: ['value_desc'],
        proxy: {
            type: 'ajax',
            url: 'scripts/ecr_form.php?getValueDesc=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var storeCompStatuses = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:0,value:'In progress'},{id:1,value:'Approved'},{id:2,value:'Rejected'}, {id:3,value:'New'}]
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

var employStatusStore = new Ext.data.Store({
        fields:['id', 'value'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?employStatus=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var storeApprovals = new Ext.data.Store({     
        fields: [{name:'person_id', type:'int'}, {name:'name', type: 'string'}, {name:'position', type: 'string'}],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getCAPAApprovals=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var CapaTypesStore = new Ext.data.Store({
    fields: ['id', 'value'],
    data: [{id:1,value:'Enforcement'},{id:2,value:'Design'},{id:3,value:'Process'}]
});

var storeImplStatuses = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:1,value:'Approved'},{id:2,value:'Rejected'}, {id:3,value:'New'},{id:4,value:'In progress'}, {id:5,value:'Remarked'}]
});

var storeImplActions = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:1,value:'IMPLEMENTED'},{id:2,value:'NOT IMPLEMENTED'}]
});

var store_bbb_sku_capa = new Ext.data.Store({
        fields: ['id','value', 'product_line', 'product_type'],
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getSKUData=true',
            scope : this,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
});

var store_cell_numbers = new Ext.data.Store({
            fields: ['id', 'cell_number'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'scripts/process_directory.php?getCellNumbers=true',
                reader: {
                    type: 'json',
                    root: 'rows',
                    totalProperty: 'total'
                }
            }
        });

var storeApprovalStatuses = new Ext.data.Store({
        fields: [{name: 'id', type: 'int'}, {name: 'value', type: 'string'}],
        data: [{id:1,value:'APPROVED'},{id:2,value:'REJECTED'}, {id:3,value:'IN PROGRESS'}]
});

var store_jd_job_title = new Ext.data.Store({
    autoLoad: true,
    fields: ['id', 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getJdTitle=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_all_job_title = new Ext.data.Store({
    autoLoad: true,
    fields: ['id', 'value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/store.php?getAllJdTitle=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var ECRTypesStore = new Ext.data.Store({
    fields: ['id', 'value'],
    data: [{id:1,value:'BOM'},{id:2,value:'COMPONENT'},{id:3,value:'PROCESS'},{id:4,value:'OPERATION'}]
});

var storeSignatures = new Ext.data.Store({
    fields: ['id', 'value'],
    data: [{id:1,value:'Prod. Dev. Eng.'},{id:2,value:'Product Eng.'},{id:3,value:'Process Eng.'},{id:4,value:'Quality'},{id:5,value:'Eng Incoming'},{id:6,value:'Eng Salvage'},{id:7,value:'Production (OE)'},{id:8,value:'Production (AMAM)'},{id:9,value:'Production Management'},{id:10,value:'Materials '},{id:11,value:'Plant Manager'},{id:12,value:'Plant Eng'},{id:13,value:'Training'},{id:14,value:'Purchasing'},{id:15,value:'Cores Manager'},{id:16,value:'Cores Supervisor'},{id:17,value:'Inventory Analyst'},{id:18,value:'Quality Managment System'},{id:19,value:'Import-Export Coordinator'},{id:20,value:'Customer'}]
});

var storeSignPersons = new Ext.data.Store({     
        fields: [{name:'person_id', type:'int'}, {name:'name', type: 'string'}, {name:'position', type: 'string'}, {name:'department', type: 'int'}, {name:'email', type: 'string'}],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'scripts/store.php?getSignPersons=true',
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'total'
            }
        }
    });

var storeSignCriticals = new Ext.data.Store({
    fields: ['id', 'value'],
    data: [{id:1,value:'N/A'},{id:2,value:'MUST'},{id:3,value:'OPTIONAL'}]
});