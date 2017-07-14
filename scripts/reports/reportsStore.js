var tasks_type_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?tasks_type=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var first_year_dem_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?first_year=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var mat_annual_dem_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?mat_annual=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var est_annual_revenue = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?annual_revenue=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var priority_lvl_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?priority_lvl=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var vehicle_in_oper_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?vehicle_oper=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var title_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?title=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var func_manager_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?func_manager=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var admin_manager_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?admin_manager=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var users_store = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?users_need=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var store_active = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        {
            id: 0,
            value: "Inactive"
        },
        {
            id: 1,
            value: "Active"
        }
    ]
});

var store_roles = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?roles=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var employStatusStore = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?emp_status=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var requestIdStore = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?request_id=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeErp = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?erp=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var compPartNumStore = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?part_numb=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var storeRevision = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?revision=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var compCreateDateStore = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?create_date_comp=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var compLastMod = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?last_mod_comp=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});

var compMaterials = new Ext.data.Store({
    fields: ['id','value'],
    proxy: {
        type: 'ajax',
        url: 'scripts/reports/reports_store.php?materials=true',
        scope : this,
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
});