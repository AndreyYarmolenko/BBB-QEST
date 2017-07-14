function addLocalization(){
	var DataLan = [
		     ['en', 'EN'],
		    ['es', 'ES']
			];

	var localization = new Ext.create('Ext.form.Panel',
				{	width: 600,
				    bodyPadding: 10,
				    defaults: {
				        anchor: '100%',
				        labelWidth: 100
				    },
					
					items:[{
				            xtype: 'combobox',
				            fieldLabel: lan.choose,
				            id: 'lan',
				            value: lang,
				            style : {
		                        textAlign: 'center'
				                    },
				            store: new Ext.data.SimpleStore({
				                 id:0,
				                fields: [
				                    'myId',   //числовое значение - номер элемента
				                    'myLan' //текст
				                ],
				                data: DataLan
				            }),
				            valueField:'myId',
				            displayField:'myLan',
				            queryMode:'local',
				            editable: false
				        },
				        {
			                xtype: 'button',
			                text : lan.submit,
			                //margin:'15 auto',
			                width: '50%',
			                listeners: {
			                    click: function() { 
			                      	lang  =  Ext.getCmp('lan').getValue();
			                      	setLang(lang);
			                    }
			            	}
			            }],
					});
	return localization;
}

function setLang(lang){
	Ext.Ajax.request({
	   	url: 'scripts/options.php?lang',
	   	method: 'POST',
	   	params: { 
			lan: lang
		},
		success: function(transport){
		    window.location.reload(true);
		},
		failure: function(transport){
			alert(lan.error+": " - transport.responseText);
		}
	});
}
