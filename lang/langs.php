<?php
	session_start();
    if( $_SESSION['locale'] == 'en' ){
    $departments = array('1'=>'Product Engineering', '2'=>'Process Engineering', '3'=>'Engineering', '4'=>'Purchasing', '5'=>'Quality', '6'=>'Product Management', '8'=>'Finance', '9'=>'TOP Management', '10'=>'IT', '11'=>'Operations', '12'=>'OE/EPS');

    $tasks = array(
    	'1'=>'New Engineering Req',
     	'2'=>'Due Diligence',
     	'3'=>'New Product Line',
     	'4'=>'Sample procurement',
     	'5'=>'Feasibility - Product Engineering',
     	'6'=>'Feasibility - Process Engineering',
     	'7'=>'Cost estimate',
     	'8'=>'Preliminary ROI PM',
     	'9'=>'NPD request',
     	'10'=>'Sample validation',
     	'11'=>'Reverse Engineering Start',
     	'12'=>'Reverse Eng - Core Analysis',
     	'13'=>'Reverse Eng Pack req',
     	'14'=>'Reverse Engineering',
     	'15'=>'Reverse Engineering Attribute Tables',
     	'16'=>'ECR(Engineering change request)',
     	'17'=>'PPAP Test Plan',
     	'18'=>'Process Design Request',
     	'19'=>'Process Design',
     	'20'=>'Operational Procedure Creation',
     	'21'=>'Tooling Request',
     	'23'=>'Procurement Request',
     	'24'=>'Capex',
     	'25'=>'Purchase Request',
     	'26'=>'Market Release',
		'27'=>'Market Release PM',
		'28'=>'Process Improvement Request',
		'29'=>'Conversion request',
		'30'=>'Final ROI PM',
		'31'=>'Setup Data PM',
		'32'=>'Market Release PM',
		'36'=>'PPAP Review',
		'37'=>'Capex Approve',
		'38'=>'Implementation Request',
		'39'=>'Finished Good BBB SKU PPAP Validation',
		'40'=>'Finished Good BBB SKU PPAP Review',
		'41'=>'Equipment Request',
		'42'=>'Workstation Request',
		'45'=>'EPS Production Software Release'
     	);

    $roles = array(
    	"1"=>'Admin',
    	"2"=>'Tech Design',
    	"3"=>'Purchase Team'
    	);
    $rightNames = array(
        '1'=>'NewEngineeringReq',
        '2'=>'DueDiligence',
        '3'=>'NewProductLine',
        '4'=>'Feasibility',
        '5'=>'ProductDesignSpec',
        '6'=>'ProcessDesignSpec',
        '7'=>'AccessAdminPanel',
        );

    $rightDescriprions = array(
        '1'=>'New Engineering Req',
        '2'=>'Due Diligence',
        '3'=>'New Product Line',
        '4'=>'Feasibility',
        '5'=>'Product Design Spec',
        '6'=>'Process Design Spec',
        '7'=>'Access to the admin panel',
        );

    $months = array(
    	'1'=>'January',
     	'2'=>'February',
     	'3'=>'March',
     	'4'=>'April',
     	'5'=>'May',
     	'6'=>'June',
     	'7'=>'July',
     	'8'=>'August',
     	'9'=>'September',
     	'10'=>'October',
     	'11'=>'November',
     	'12'=>'December'
    	);

    $statuses = array(
    	'1'=>'New Task',
    	'2'=>'In progress',
    	'3'=>'ReOpened',
    	'4'=>'Completed',
    	'5'=>'Overdue',
    	'6'=>'In queue'
    	);

    $within_names = array(
        'new'=>'New',
        'new_overdue'=>'New(Overdue)',
        'overdue'=>'Overdue',
        'within_7'=>'0-7',
        'within_14'=>'8-14',
        'within_21'=>'14-21',
        'within_30'=>'22-30'
        );

    $answers = array(
        //stages
        //capex-approve.php
        'task_dec'=>" Task Declined",
        'task_in_progress'=>" Task In Progress.",

        //ecr_form.php
        'ecr_saved_part_num'=>"ECR saved. PartNumber: ",
        'ecr_closed_part_num'=>"ECR closed. PartNumber: ",

        //eps_production.php
        'completed'=>"Completed",

        //feasibility_process_eng.php
        'not_feasible'=>'not feasible',

        //implementation_request.php
        'next_stage'=>"Next Stage",

        //new-enginiring_req.php
        'task_update'=>'Task updated',

        //ppap_finished_good.php
        'out_for_ppap'=>" Out for PPAP",

        //pap_finished_good_review.php
        'ppap_approved'=>" PPAP Approved",
        'and_reopen'=>" AND Reopen in new task",
        'not_all_prev_ppap_completed'=>"Not all previous PPAP Test Plans are comleted!",

        //process_design_start.php
        'capex_generated'=>"Capex Generated",
        'purch_request'=>" Purchasing Request",

        //reverse_engineering.php
        'task_completed'=>"Task Completed",

        //--------------------------------------
        //bbb_courirer.php
        'photo_only_latin'=>"The photo name must consist only of latin characters!",
        'same_login_exist'=>"User with the same login is exist!",
        'file_size_ex'=>"File size exceeds",
        'error'=>"Error",
        'problem_with_upload'=>"There was a problem with your upload!",
        'file_to_big'=>"The file you are trying to upload is too big!",
        'file_only_partially'=>"The file you are trying upload was only partially uploaded!",
        'select_image'=>"You must select an image for upload!",

        //ecr_form.php
        'mail_sent'=>"Mail sent",
        'mail_no_send'=>"Mail no send", 
        'data_not_saved'=>"Data not saved!",
        'oper_del'=>"Operation deleted",
        'oper_not_del'=>"Operation not deleted",
        'email_sent'=>"E-mail sent!",
        'email_no_sent'=>"E-mail no sent!",
        'task_tool_req'=>"Data saved. Task Tooling Request created with RequestID ",
        'same_numb_already'=>"The same number is already exist OR have invalid format!",
        'data_updated'=>"Data updated!",
        'data_not_updated'=>"Data not updated!",
        't_g_del'=>"Tool/Gage deleted!",
        't_g_not_del'=>"Tool/Gage not deleted!",
        'task_equip_req'=>"Data saved. Task Equipment Request created with RequestID ",
        'equip_del'=>"Equipment deleted!",
        'equip_not_del'=>"Equipment not deleted!",
        'task_work_req'=>"Data saved. Task Workstation Request created with RequestID ",
        'work_del'=>"Workstation deleted!",
        'work_not_del'=>"Workstation not deleted!",
        'operation_with_same'=>"Operation with the same characteristics is already exist!<br>",
        'data_saved'=>"Data saved",
        'oper_numb_already'=>"Operation with the same number is already exist!",
        'change_critical_par'=>"You can't change critical parameters of operation! Do you want to create new operation with other number?",

        //family_type.php
        'family_saved'=>"Family Type saved!",
        'family_is_already'=>"Family Type with the same name is already exist!",
        'family_updated'=>"Family Type data updated!",

        //groups.php
        'name_already_ex'=>"This name is already exists or was deleted!",

        //pack_requrement.php
        'pack_req_saved'=>"Packaging Requirement saved.",
        'pack_req_already'=>"Packaging Requirement with the same number is already exist!",
        'pack_req_update'=>"Packaging Requirement data updated.",

        //roles.php
        'role_already_ex'=>"Role with the same name is allready exist!",
        'role_created'=>"Role created with name ",
        'role_updated'=>"Role updated with name ",
        'is_already_completed'=>'Task is already completed!',

        //saveform_func.php
        'detail_table_core_not_filled'=>"Detailed table with core analysis is not filled!<br>",
        'physical_attr_not_filled'=>"Physical Attributes Table is not filled!",
        //-------------------------function TelegramManager-------------------------
        'change_assignee'=>" changed assignee person from ",
        'to'=>" to ",
        'due_date_is'=>". Due date is ",
        'changed_responsible'=>" changed responsible person from ",
        'and_changed_assignee'=>". And changed assignee person from ",
        'canged_status'=>" changed status to ",
        'status_changed'=>" Status changed to ",
        'completed'=>" completed.",
        'created'=>" was created.",
        //---------------------------------------------------------------------------
        );
   
   }elseif( $_SESSION['locale'] == 'es' ){
    $departments = array('1'=>'Product Engineering', '2'=>'Process Engineering', '6'=>'Product Management', '8'=>'Finance', '12'=>'OE/EPS');

    $tasks = array(
    	'1'=>'New Engineering Req',
        '2'=>'Due Diligence',
        '3'=>'New Product Line',
        '4'=>'Sample procurement',
        '5'=>'Feasibility - Product Engineering',
        '6'=>'Feasibility - Process Engineering',
        '7'=>'Cost estimate',
        '8'=>'Preliminary ROI PM',
        '9'=>'NPD request',
        '10'=>'Sample validation',
        '11'=>'Reverse Engineering Start',
        '12'=>'Reverse Eng - Core Analysis',
        '13'=>'Reverse Eng Pack req',
        '14'=>'Reverse Engineering',
        '15'=>'Reverse Engineering Attribute Tables',
        '16'=>'ECR(Engineering change request)',
        '17'=>'PPAP Test Plan',
        '18'=>'Process Design Request',
        '19'=>'Process Design',
        '20'=>'Operational Procedure Creation',
        '21'=>'Tooling Request',
        '23'=>'Procurement Request',
        '24'=>'Capex',
        '25'=>'Purchase Request',
        '26'=>'Market Release',
        '27'=>'Market Release PM',
        '28'=>'Process Improvement Request',
        '29'=>'Conversion request',
        '30'=>'Final ROI PM',
        '31'=>'Setup Data PM',
        '32'=>'Market Release PM',
        '36'=>'PPAP Review',
        '37'=>'Capex Approve',
        '38'=>'Implementation Request',
        '39'=>'Finished Good BBB SKU PPAP Validation',
        '40'=>'Finished Good BBB SKU PPAP Review',
        '41'=>'Equipment Request',
        '42'=>'Workstation Request',
        '45'=>'EPS Production Software Release'
     	);

    $roles = array(
    	"1"=>'Administración',
    	"2"=>'Diseño Tech',
    	"3"=>'Compra de equipo'
    	);

    $rightNames = array(
        '1'=>'NuevaSolicitudIng',
        '2'=>'DebidaDiligencia',
        '3'=>'LíneaProductosNuevos',
        '4'=>'Factibilidad',
        '5'=>'ProductDesignSpec',
        '6'=>'ProcessDesignSpec',
        '7'=>'PanelAdminAcceso',
        );

    $rightDescriprions = array(
        '1'=>'Nueva solicitud de Ingeniería',
        '2'=>'Debida diligencia',
        '3'=>'Línea de Productos Nuevos',
        '4'=>'Factibilidad',
        '5'=>'Producto Diseño Espec',
        '6'=>'Proceso Diseño Espec',
        '7'=>'El acceso al panel de administración',
        );

    $months = array(
    	'1'=>'Enero',
     	'2'=>'Febrero',
     	'3'=>'Marzo',
     	'4'=>'Abril',
     	'5'=>'Mayo',
     	'6'=>'Junio',
     	'7'=>'Julio',
     	'8'=>'Agosto',
     	'9'=>'Septiembre',
     	'10'=>'Octubre',
     	'11'=>'Noviembre',
     	'12'=>'Diciembre'
    	);

    $statuses = array(
    	'1'=>'Nueva tare',
    	'2'=>'En progreso',
    	'3'=>'Reabrirse',
    	'4'=>'Terminado',
    	'5'=>'Atrasado',
    	'6'=>'En fila'
    	);

    $within_names = array(
        'new'=>'New',
        'new_overdue'=>'New(Overdue)',
        'overdue'=>'Overdue',
        'within_7'=>'0-7',
        'within_14'=>'8-14',
        'within_21'=>'14-21',
        'within_30'=>'22-30'
        );

    $answers = array(
        'task_dec'=>" Tarea rechazada",
        'task_in_progress'=>" Tarea en progreso.",
        'ecr_saved_part_num'=>"ECR guardado. Número de pieza: ",
        'ecr_closed_part_num'=>"ECR cerrado. Número de pieza: ",
        'completed'=>"Terminado",
        'not_be_temporary'=>"ID no debe ser temporal, debe asignar un nuevo!",
        'already_exist'=>"Este ID ya existe!",
        'not_feasible'=>'no factible',
        'next_stage'=>"Siguiente etapa",
        'task_update'=>'Tarea actualizada',
        'out_for_ppap'=>" Fuera de PPAP",
        'ppap_approved'=>" Aprobado PPAP",
        'and_reopen'=>" Y volver a abrir en la nueva tarea",
        'not_all_prev_ppap_completed'=>"No todos los Planes de Pruebas de PAP han finalizado!",
        'capex_generated'=>"El gasto de capital generada",
        'purch_request'=>" Solicitud de compra",
        'task_completed'=>"Tarea terminada",
        'photo_only_latin'=>"El nombre de la foto debe constar sólo de caracteres latinos!",
        'same_login_exist'=>"El usuario con el mismo login existe!",
        'file_size_ex'=>"El tamaño del archivo excede",
        'error'=>"Error",
        'problem_with_upload'=>"Hubo un problema con tu subida!",
        'file_to_big'=>"El archivo que intenta cargar es demasiado grande!",
        'file_only_partially'=>"El archivo que está intentando subir solo se cargó parcialmente!",
        'select_image'=>"Debe seleccionar una imagen para cargarla!",
        'mail_sent'=>"Correo enviado",
        'mail_no_send'=>"Correo no enviar", 
        'data_not_saved'=>"Datos no guardados!",
        'oper_del'=>"Operación eliminada",
        'oper_not_del'=>"Operación no eliminada",
        'email_sent'=>"Email enviado!",
        'email_no_sent'=>"E-mail no enviado!",
        'task_tool_req'=>"Datos guardados. Solicitud de herramientas de tareas creada con RequestID ",
        'same_numb_already'=>"El mismo número ya existe O tiene formato no válido!",
        'data_updated'=>"Datos actualizados!",
        'data_not_updated'=>"Datos no actualizados!",
        't_g_del'=>"Herramienta/indicador eliminado!",
        't_g_not_del'=>"Herramienta/indicador no eliminado!",
        'task_equip_req'=>"Datos guardados. Solicitud de equipo de tarea creada con RequestID ",
        'equip_del'=>"Equipo suprimido!",
        'equip_not_del'=>"Equipo no eliminado!",
        'task_work_req'=>"Datos guardados. Task Solicitud de estación de trabajo creada con RequestID ",
        'work_del'=>"Se eliminó la estación de trabajo!",
        'work_not_del'=>"Estación de trabajo no eliminada!",
        'operation_with_same'=>"Ya existe una operación con las mismas características!<br>",
        'data_saved'=>"Datos guardados",
        'oper_numb_already'=>"La operación con el mismo número ya existe!",
        'change_critical_par'=>"No puede cambiar los parámetros críticos de operación! Desea crear una nueva operación con otro número?",
        'family_saved'=>"Tipo de familia guardado!",
        'family_is_already'=>"El tipo de familia con el mismo nombre ya existe!",
        'family_updated'=>"Datos de tipo familiar actualizados!",
        'name_already_ex'=>"Este nombre ya existe o se ha eliminado!",
        'pack_req_saved'=>"Requerimiento de embalaje guardado.",
        'pack_req_already'=>"El requisito de empaquetado con el mismo número ya existe!",
        'pack_req_update'=>"Requisitos de embalaje actualizados.",
        'role_already_ex'=>"Roll con el mismo nombre ya existe!",
        'role_created'=>"Función creada con nombre ",
        'role_updated'=>"Función actualizada con nombre ",
        'is_already_completed'=>'La tarea ya está terminada!',
        'detail_table_core_not_filled'=>"No se rellena la tabla detallada con el análisis del núcleo!<br>",
        'physical_attr_not_filled'=>"La Tabla de Atributos Físicos no está llena!",

        'change_assignee'=>" cambiado persona asignada de ",
        'to'=>" a ",
        'due_date_is'=>". La fecha de vencimiento es ",
        'changed_responsible'=>" cambió de persona responsable de ",
        'and_changed_assignee'=>". Y cambió la persona asignada de ",
        'canged_status'=>" Cambio de estado a ",
        'status_changed'=>" Estado cambiado a ",
        'completed'=>" terminado.",
        'created'=>" fue creado.",    
        );
   }
?>