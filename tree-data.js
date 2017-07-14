var tree_data = { 
text: '.',
children: [{
    text:lan.engineering,
    id: 'engineering_root',
    expanded: true,
    children:[
        {
        text: lan.dashboard,
        id:'progress',
        leaf: true
        },
        {
        text:lan.orgchart,
        id:'user_driven',
        leaf: true
        },
        {
        text:lan.process_workflow,
        id:'progress_workflow',
        leaf: true
        }
        ]
},
{
    text:lan.workflow,
    id: 'workflow_root',
    expanded: false,
    children:[
        {
        text:lan.my_tasks,
        id:'my_tasks',
        leaf:true
        },
        {
        text:lan.new_task,
        id:'new_task',
        leaf:true
        },
        {
        text:lan.in_queue,
        id:'in_queue',
        leaf:true
        },
        
        {
        text:lan.in_progress,
        id:'in_progress',
        leaf:true
        },
        {
        text:lan.completed,
        id:'completed',
        leaf:true
        },
        {
        text:lan.overdue,
        id:'overdue',
        leaf:true
        },
        {
        text:lan.new_engineering_req,
        id:'new_engineering_req',
        leaf:true
        },
        {
        text: lan.new_component_req,
        id:'new_component_req',
        leaf:true
        }
    ]
},{
    text:lan.reports,
    id: 'reports_root',
    expanded: false,
    children:[
        {
            text:lan.manager_report,
            id:'manager_report',
            leaf:true
        },
        {
            text:lan.org_status,
            id:'org_status',
            leaf:true
        },
        {
            text:lan.user_list,
            id:'user_list',
            leaf:true
        },
        {
            text:lan.comp_report,
            id:'comp_report',
            leaf:true
        }
    ]
},{
    text:lan.administration,
    id: 'administration_root',
    expanded: false,
    children:[
    {
        text:lan.all_tasks,
        id:'all_tasks',
        leaf:true
    },
    {
        text:lan.users,
        id:'users',
        leaf:true
    },
    {
        text:lan.roles,
        id:'roles',
        leaf:true
    },
    {
        text:lan.departments,
        id:'groups',
        leaf:true
    },
    {
        text:lan.task_types,
        id:'taskType',
        leaf:true
    },
    {
        text:lan.product_type,
        id:'product_type',
        leaf:true
    },
    {
        text:lan.product_line,
        id:'product_line',
        leaf:true
    },
    {
        text:lan.family_type,
        id:'family_type',
        leaf:true
    },
    {
        text:lan.locations,
        id:'locations',
        leaf:true
    },
    {
        text:lan.log_of_activity,
        id:'logs',
        leaf:true
    }
    ]
},
{
    text:'HR',
    id: 'hr_root',
    expanded: false,
    children:[
    {
        text:'Job description',
        id:'job_description',
        leaf:true
    }
    ]
},
{
    text:lan.catalogue,
    id: 'catalogue_root',
    expanded: false,
    children:[
        {
        text:lan.bom,
        id:'bom',
        leaf:true
        },
        {
        text:lan.comp_part_number,
        id:'comp_part_number',
        leaf:true
        },
        {
        text:lan.gage,
        id:'tool_gage',
        leaf:true
        },
        {
        text:lan.equipment,
        id:'equipment',
        leaf:true
        },
        {
        text:lan.workstation,
        id:'workstation',
        leaf:true
        },
        {
        text:lan.test_procedure,
        id:'test_procedure',
        leaf:true
        },
        {
        text:lan.pack_requirement,
        id:'pack_requirement',
        leaf:true
        },
        {
        text:lan.operation_procedures,
        id:'operation_procedures',
        leaf:true
        },
        {
        text:lan.processes_dir,
        id:'processes_dir',
        leaf:true
        }
    ]
},{
    text:lan.options,
    id: 'options_root',
    expanded: false,
    children:[
        {
            text: lan.change_pass,
            id: 'change_password',
            leaf: true
        }
    ]
},{
    text:lan.exit,
    id:'exit',
    leaf:true
    }]
};