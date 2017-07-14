var mainRigthWindow;
var rigthPanel;
var rightGrid;
var rigthsGrid_sm;
var roleID;

Ext.define('RoleRigthsModel', {
    extend: 'Ext.data.Model',
    fields: [ {name: 'id'},
	          {name: 'name'},
	          {name: 'description'},
	          {name:'check', type: 'bool', defaultValue:'false'}
			]
});

var RoleRigthStore = new Ext.data.Store({
    model: 'RoleRigthsModel',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Rights.php?func=showRight',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});

Ext.define('RolesModelSelect', {
    extend: 'Ext.data.Model',
    fields: [ 'id','name']
});
var RolesStore = new Ext.data.Store({
    model: 'RolesModelSelect',
    //autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'scripts/Rights.php?func=showRoles',
      reader: {
          type: 'json',
          root: 'rows'
      }
    }
});


function addEditRolesRigths() {
	roleID = false;
	RoleRigthStore.load();
	//rigthsGrid_sm = Ext.create('Ext.selection.CheckboxModel');
	rightGrid = new Ext.grid.GridPanel({
		//border: false,
		//height: 180,
	    //title: 'Доступные права',
	    title: lan.role_rights,
		store: RoleRigthStore,
	    autoScroll: false,
	    width: 390,
	    height : 360,
		//selModel: rigthsGrid_sm, 		
		columns : [
	        {   
	            xtype: 'checkcolumn',
	        	dataIndex : 'check',
	            width: 50,
	            sortable: false,
	            hideable: false	
	        }, {
	        	//text : 'Название',
	        	text : lan.name,
	            dataIndex : 'description',
	            width: 300,
	            sortable: false,
	            hideable: false
	        }
	    ]
	});

	rigthPanel = new Ext.panel.Panel({
		//hidden: true,
		items: [
			{
				xtype: 'combo',
				//fieldLabel: 'Выберите пользователя',
				fieldLabel: lan.choose_role,
				labelAlign: 'top',
				margin: '10 10 10 10',
				store: RolesStore,
				displayField: 'name',
				valueField: 'id',
				width: 250,
				//emptyText: 'Выберите пользователя',
				emptyText: lan.choose_role,
				listeners: {
					select: function(combo, records, eOpt) {					
						roleID = records.get('id');

						RoleRigthStore.setProxy({
							  type: 'ajax',
						      url: 'scripts/Rights.php?func=setRights&roleID='+ roleID,
						      reader: {
						          type: 'json',
						          root: 'rows'
						      }  	  
						});	

						RoleRigthStore.load();
					}
				}
					
			}
		],
		
	});
	
	if (!mainRigthWindow) {
		mainRigthWindow = new Ext.Window( //Описание объекта окна
	            {
	                //layout : 'fit', 
	            	//title : 'Права доступа',
	            	title : lan.rights,
	                closeAction : 'destroy',
	                width : 400,
	                height : 500,
	                resizable : false,
	                //x : 20,
	                //y : 20,
	                autoScroll: false,
	                items : [rigthPanel, rightGrid],
	                listeners : 
	                {
	                    destroy : function()
	                    {
	                    	mainRigthWindow = null;
	                    	roleID = false;
	                    	RoleRigthStore.setProxy({
		                    	type: 'ajax',
		                        url: 'scripts/Rights.php?func=showRight',
		                        reader: {
		                            type: 'json',
		                            root: 'rows'
		                        }
	                        });
	                    }
	                },
	                buttons: [{
	        	    	//text: 'Сохранить',
	        	    	text: lan.save,
	        	    	handler: function() {
						//alert(userID);
	        	    		if (roleID != false) {
	        	    		saveRoleRights(RoleRigthStore, roleID);
	        	    		mainRigthWindow.destroy();
	        	    		} else {
	        	    			Ext.Msg.alert(lan.error, lan.select_role);
	        	    		}
	        	    	}
	        	    }, {
	        	    	//text: 'Отмена',
	        	    	text: lan.cancel,
	        	    	handler: function () {
	        	    		mainRigthWindow.destroy();
	        	    	}
	        	    }]
	            });
		mainRigthWindow.show();
	}
}

function saveRoleRights(store, roleID) {

		var arrOfRigthID = [];
		var arrOfStates = [];

		store.each(function(record) {
			//alert(record.get('id'));
			arrOfRigthID.push(record.get('id'));
			arrOfStates.push(record.get('check'));			
		});
		
		Ext.Ajax.request({
		    url: 'scripts/Rights.php',
		    method: 'POST',
			params: {func: 'saveRights','arrOfStates[]': arrOfStates, 'arrOfRigthID[]': arrOfRigthID, roleID: roleID},
		    success: function(response) {
		        Ext.Msg.alert(lan.message, lan.save);
		    },
		    failure: function(response) {
		        Ext.MessageBox.alert(lan.error, response.responseText);
		    }
		});

}
