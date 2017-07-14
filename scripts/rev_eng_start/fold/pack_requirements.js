/**
 * Created by User on 06.10.2016.
 */


function get_pr_spi(id, request_id) {

    var form = new Ext.create('Ext.form.Panel', {
        name: "form-" + id,
        id: "form-" + id,
        cls: 'pr_spi_border_all',
        scrollable: true,
        url: './scripts/rev_eng_start/saveformref.php',
        save: function () {
            var newForm = form.getForm();
            if(newForm.isValid()){
                newForm.submit({
                    url: this.url,
                    method: 'POST',
                    params: {'table': 're_start_pr_epi', 'edit': true, 'RequestID': request_id},
                    success: function(func, act) {
                        res_Window.destroy();
                        Ext.MessageBox.alert(all_toir.save, all_toir.skill);
                        var flag = Ext.getCmp('pr_flag');
                        flag.setValue(act.result.draft);
                    },
                    failure: function(func, act) {
                        res_Window.destroy();
                        Ext.MessageBox.alert(all_toir.error, act.result.message);
                        var flag = Ext.getCmp('pr_flag');
                        flag.setValue(0);
                    }
                });
            }
        },
        em_view: function () {
            var fields = pr_spi_model.getFields();
            Ext.Ajax.request({
                url: this.url,
                method: 'POST',
                params: {'table': 're_start_pr_epi', 'view': true, 'RequestID': request_id},
                success: function (response){
                    var JSON = response.responseText;
                    if(JSON){
                        var data = Ext.decode(JSON);
                        console.log(data);

                        for(var i = 0; i < fields.length; i++){
                            var kname = fields[i].name;
                            if(kname == 'photo1' || kname == 'photo2' || kname == 'photo3'){
                                Ext.getCmp(kname).setSrc(data[0][kname]);
                                continue;
                            }

                            var field = Ext.ComponentQuery.query('textfield[name="'+kname+'"]');
                            if(field[0] == undefined) continue;
                            field[0].setValue(data[0][kname]);
                        }
                    }
                },
                failure: function (response){
                    Ext.MessageBox.alert(all_toir.error, response.responseText);
                }
            });
        },
        items:[
            {
                'xtype': 'hiddenfield',
                'name': 'RequestID',
                'value': request_id
            },

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                padding: '20px 0 10px',
                cls: 'pr_spi_border_bottom',
                items:[
                    {
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: 'EXPENDABLE PACK INFORMATION',
                        flex: 5
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: 'MATERIAL COST PER PIECE $'
                    },
                    {
                        xtype: 'textfield',
                        cls: 'pr_spi_input',
                        id: 'material_cost',
                        name: 'material_cost',
                        flex: 2
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'pr_spi_displayfield',
                        value: '(USD)'
                    }
                ]
            },

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Primary Container Type',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_primary_container_type,
                                id: 'pc_type',
                                name: 'pc_type',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    }, // Primary Container Type
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 5,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'id',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'pct_id',
                                name: 'pct_id',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // ID
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'LWH(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'pct_lwh',
                                name: 'pct_lwh',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // LWH
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Tare WT(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'pct_wt',
                                name: 'pct_wt',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // TARE WT
                    {
                        xtype: 'container',
                        layout: 'vbox', flex: 3,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Material',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value',
                                displayField: 'value',
                                store: store_spi_materials,
                                id: 'pct_material',
                                name: 'pct_material',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    } // MATERIAL
                ] // items hbox
            }, // Primary Container Type

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Dunnage Type',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_dunnage_type,
                                id: 'd_type',
                                name: 'd_type',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    }, // Dunnage Type
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 5,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'id',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt_id',
                                name: 'dt_id',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // ID
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'LWH(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt_lwh',
                                name: 'dt_lwh',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // LWH
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Tare WT(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt_wt',
                                name: 'dt_wt',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // TARE WT
                    {
                        xtype: 'container',
                        layout: 'vbox', flex: 3,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Material',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_materials,
                                id: 'dt_material',
                                name: 'dt_material',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    } // MATERIAL
                ] // items hbox
            }, // Dunnage Type

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Dunnage Type',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_dunnage_type,
                                id: 'd_type2',
                                name: 'd_type2',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    }, // Dunnage Type 2
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 5,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'id',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt2_id',
                                name: 'dt2_id',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // ID
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'LWH(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt2_lwh',
                                name: 'dt2_lwh',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // LWH
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Tare WT(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'dt2_wt',
                                name: 'dt2_wt',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // TARE WT
                    {
                        xtype: 'container',
                        layout: 'vbox', flex: 3,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Material',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_materials,
                                id: 'dt2_material',
                                name: 'dt2_material',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    } // MATERIAL
                ] // items hbox
            }, // Dunnage Type 2

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Secondary Con Type',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_secondary_con_type,
                                id: 'sc_type',
                                name: 'sc_type',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    }, // Secondary Con Type
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 5,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'id',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'sct_id',
                                name: 'sct_id',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // ID
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'LWH(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'sct_lwh',
                                name: 'sct_lwh',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // LWH
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Tare WT(mm)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'sct_wt',
                                name: 'sct_wt',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // TARE WT
                    {
                        xtype: 'container',
                        layout: 'vbox', flex: 3,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Material',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_materials,
                                id: 'sct_material',
                                name: 'sct_material',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    } // MATERIAL
                ] // items hbox
            }, // Secondary Con Type

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Pallet Stackability',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'p_stack',
                                name: 'p_stack',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // Pallet Stackability
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 8,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'RUSTPROOFING METHOD',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'rpi_method',
                                name: 'rpi_method',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // RPI METHOD
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 6,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'PRIMARY BOX HAVE HANDLES',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'pbh_handler',
                                name: 'pbh_handler',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    } // LWH
                ] // items hbox
            },

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 6,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'STANDARD PACK QUANTITY',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'sp_quantity',
                                name: 'sp_quantity',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, //  STANDARD PACK QUANTITY
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 5,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'NO. OF PRIMARY CONTAINERS/LAYER',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'no_lc',
                                name: 'no_lc',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, // no_lc
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 6,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'NO. OF LAYERS ON/IN SECONDARY CONTAINER',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'no_lon',
                                name: 'no_lon',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    } // no_lon
                ] // items hbox
            },

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                cls: 'pr_spi_border_bottom',
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: ' PART WEIGHT (kg)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'numberfield', width: '100%',
                                id: 'p_weight',
                                name: 'p_weight',
                                cls: 'pr_spi_input',
                                mouseWheelEnabled: false
                            }
                        ]// items vbox
                    }, //  p_weight
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 4,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: ' PRIMARY CONT GROSS WEIGHT (kg)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'numberfield', width: '100%',
                                id: 'pcg_weight',
                                name: 'pcg_weight',
                                cls: 'pr_spi_input',
                                mouseWheelEnabled: false
                            }
                        ]// items vbox
                    }, //  pcg_weight
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 4,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'SECONDARY CONT GROSS WEIGHT (kg)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'numberfield', width: '100%',
                                id: 'scg_weight',
                                name: 'scg_weight',
                                cls: 'pr_spi_input',
                                mouseWheelEnabled: false
                            }
                        ]// items vbox
                    }, //  scg_weight
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        cls: 'pr_spi_border_right',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'METHOD TO SECURE LOAD',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'textfield', width: '100%',
                                id: 'mtc_load',
                                name: 'mtc_load',
                                cls: 'pr_spi_input'
                            }
                        ]// items vbox
                    }, //  mtc_load
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'MATERIAL',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'combobox', width: '100%',
                                valueField: 'value', displayField: 'value', store: store_spi_material_once,
                                id: 'material_once',
                                name: 'material_once',
                                cls: 'pr_spi_input',
                                editable: false
                            }
                        ]// items vbox
                    }  //  mtc_load
                ] // items hbox
            },

            {
                xtype: 'container',
                width: '100%',
                layout: 'hbox',
                items:[
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        padding: '40px 10px',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Part Only (Photo)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'filefield', width: '100%',
                                id: 'po_photo',
                                name: 'po_photo',
                                cls: 'pr_spi_input',
                                multiple: true,
                                listeners:{
                                    change: function (val, value) {
                                        console.log(value);
                                        var extn = value.split('.').pop();
                                        if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
                                            val.setValue(''); val.setRawValue('');
                                            Ext.MessageBox.alert(all_toir.error, all_toir.incorrect_file_format + ". " + all_toir.available +': (.png, .jpg, .bmp, .gif)');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                id: 'photo1',
                                name: 'photo1',
                                renderTo: Ext.getBody(),
                                width: '100%'
                            }
                        ]// items vbox
                    }, // file 1
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        padding: '40px 10px',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Part + Dunnage + Primary Box (Photo)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'filefield', width: '100%',
                                id: 'dppb_photo',
                                name: 'dppb_photo',
                                cls: 'pr_spi_input',
                                listeners:{
                                    change: function (val, value) {
                                        console.log(value);
                                        var extn = value.split('.').pop();
                                        if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
                                            val.setValue(''); val.setRawValue('');
                                            Ext.MessageBox.alert(all_toir.error, all_toir.incorrect_file_format + ". " + all_toir.available +': (.png, .jpg, .bmp, .gif)');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                id: 'photo2',
                                name: 'photo2',
                                renderTo: Ext.getBody(),
                                width: '100%'
                            }
                        ]// items vbox
                    }, // file 2
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 3,
                        padding: '40px 10px',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Part + Secondary Unit Load (Photo)',
                                cls: 'pr_spi_header'
                            },
                            {
                                xtype: 'filefield', width: '100%',
                                id: 'psul_photo',
                                name: 'psul_photo',
                                cls: 'pr_spi_input',
                                listeners:{
                                    change: function (val, value) {
                                        console.log(value);
                                        var extn = value.split('.').pop();
                                        if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
                                            val.setValue(''); val.setRawValue('');
                                            Ext.MessageBox.alert(all_toir.error, all_toir.incorrect_file_format + ". " + all_toir.available +': (.png, .jpg, .bmp, .gif)');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                id: 'photo3',
                                name: 'photo3',
                                renderTo: Ext.getBody(),
                                width: '100%'
                            }
                        ]// items vbox
                    }  // file 3
                ]
            }

        ] // items panel
    });
    form.em_view();
    return form;
}

Ext.define('pr_spi_model', {
    extend: 'Ext.data.Model',
    fields: [
        'material_cost',
        'pc_type', 'pct_id', 'pct_lwh', 'pct_wt', 'pct_material',
        'd_type', 'dt_id', 'dt_lwh', 'dt_wt', 'dt_material',
        'd_type2', 'dt2_id', 'dt2_lwh', 'dt2_wt', 'dt2_material',
        'sc_type', 'sct_id', 'sct_lwh', 'sct_wt', 'sct_material',

        'p_stack', 'rpi_method', 'pbh_handler',
        'sp_quantity', 'no_lc', 'no_lon',
        'p_weight', 'pcg_weight', 'scg_weight', 'mtc_load', 'material_once',
        'photo1', 'photo2', 'photo3'
    ]
});

var store_spi_primary_container_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: "Manually handled", id: 1},
        { value: "Bulk Container", id: 2},
        { value: "Knockdown", id: 3},
        { value: "Stackable", id: 4},
        { value: "Stackable/Nestable", id: 5},
        { value: "Pallet", id: 6},
        { value: "Pallet Container", id: 7},
        { value: "Palletainer", id: 8},
        { value: "Other", id: 9}
    ]
});

var store_spi_dunnage_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: "Paper", id: 1},
        { value: "Tray", id: 2},
        { value: "Reel", id: 3},
        { value: "Partition", id: 4},
        { value: "Foam", id: 5},
        { value: "Bag", id: 6},
        { value: "Other", id: 7}
    ]
});

var store_spi_secondary_con_type = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: "Bulk Container", id: 1},
        { value: "Plastic Pallet", id: 2},
        { value: "Pallet Container", id: 3},
        { value: "Palletainer", id: 4},
        { value: "Wood Pallet", id: 5},
        { value: "Pallet/Cover Combination", id: 6},
        { value: "Other", id: 7}
    ]
});

var store_spi_materials = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: "Corrugated Fiberboard", id: 1},
        { value: "HDPE", id: 2},
        { value: "LDPE", id: 3},
        { value: "PETG", id: 4}
    ]
});

var store_spi_material_once = new Ext.data.Store({
    fields: ['id','value'],
    data: [
        { value: "(n/a)", id: 0},
        { value: "PE", id: 1},
        { value: "PP", id: 2},
        { value: "Polyester", id: 3},
        { value: "Other", id: 4}
    ]
});
