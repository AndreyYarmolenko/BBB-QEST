function changePassword() {
	var formValid = null;
	var passForm = Ext.create("Ext.form.Panel", {
		padding: 10,
		id: "changeForm",
		items: [
			{
				xtype: "textfield",
				fieldLabel: lan.cur_pass,
				inputType: "password",
				name: "currentPass",
				id: "currentPass",
				width: "50%",
				labelWidth: 150,
				allowBlank: false,
				listeners: {
					blur: function() {
						var current = Ext.getCmp("currentPass").getValue();
						Ext.Ajax.request({
							url: "scripts/change_password.php?currentPassword=true",
							method: "post",
							params: {
								current: current
							},
							success: function(response) {
								if(response.responseText == "") Ext.MessageBox.alert(lan.error, lan.enter_cur_pass);
								else {
									var obj = JSON.parse(response.responseText);
									if(obj.success) {}
									else {
										Ext.MessageBox.alert(lan.error, lan.incorrect_cur_pass);
										Ext.getCmp("currentPass").setValue("");
										return false;
									}
								}
							},
							failure: function(response) {
								Ext.MessageBox(lan.error, response.responseText);
							}
						});
					}
				}
			},
			{
				xtype: "textfield",
				fieldLabel: lan.new_pass,
				inputType: "password",
				name: "newPass",
				id: "newPass",
				width: "50%",
				labelWidth: 150,
				allowBlank: false,
				/*listeners: {
					blur: function() {
						if(this.getValue().length < 6) {
							Ext.MessageBox.alert('Error', 'This field must be at least 6 characters!');
						}
					}
				}*/
			},
			{
				xtype: "textfield",
				fieldLabel: lan.repeat_new_pass,
				inputType: "password",
				name: "repeatPass",
				id: "repeatPass",
				width: "50%",
				labelWidth: 150,
				allowBlank: false,
				/*listeners: {
					blur: function() {
						if(this.getValue().length < 6) {
							Ext.MessageBox.alert('Error', 'This field must be at least 6 characters');
						}
					}
				}*/
			},
			{
				xtype: "button",
				text: lan.change,
				width: "20%",
				margin: "50 0 0 230",
				handler: function() {
					if(Ext.getCmp("newPass").getValue().length < 6 || Ext.getCmp("repeatPass").getValue().length < 6) {
						Ext.MessageBox.alert(lan.error, lan.least_6characters);
						formValid = false;
					}
					else {
						formValid = true;
						var newPass = Ext.getCmp("newPass").getValue();
						var repeatPass = Ext.getCmp("repeatPass").getValue();
						var form = this.up();
						if(form.isValid() && formValid) {
							Ext.Ajax.request({
								url: "scripts/change_password.php?saveNewPass=true",
								method: "post",
								params: {
									newPass: newPass,
									repeatPass: repeatPass
								},
								success: function(response) {
									var obj = JSON.parse(response.responseText);
									if(obj.success) {
										Ext.MessageBox.alert(lan.change_pass, lan.pass_has_been_changed);
										Ext.getCmp("repeatPass").setStyle({background: "white"});
										Ext.getCmp("newPass").setStyle({background: "white"});
									}
									else {
										Ext.MessageBox.alert(lan.error, lan.pass_must_mutch);
										Ext.getCmp("repeatPass").setStyle({background: "red"});
										Ext.getCmp("newPass").setStyle({background: "red"});
									}
								},
								failure: function(response) {
									Ext.MessageBox(lan.error, response.responseText);
								}
							});
						}
					}
				}
			}
		]
	});

	return passForm;
}