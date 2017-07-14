function getComboYESNO(readStatus){
    var time_id = Date.parse(new Date());
    var rand1 = Math.floor((Math.random()*1000000) + 1);
    time_id = time_id-rand1;
    var comboYESNO = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            id: 'yesno_'+time_id,
            store: data_store_YESNO,
            displayField: 'value',
            valueField: 'id',
            readOnly: readStatus,
            value :1,
            editable:false
        });
    return comboYESNO;
}

function getComboStatusEl(){
    var time_id = Date.parse(new Date());
    var rand1 = Math.floor((Math.random()*1000000) + 1);
    time_id = time_id-rand1;
    var statusEl = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            id: 'statusEl_'+time_id,
            store: storeStatusEl,
            displayField: 'value',
            valueField: 'id',
            readOnly: true,
            value :1,
            editable:false
        });
    return statusEl;
}

function getActionTask(inp){
    var actionTask = {
     getClass: function(value,metadata,record){
      var result = record.get(inp);
      if(result == 2) return 'rejected';
        else if(result == 1) return 'approved';
            else if(result == 0) return 'work';
              else if(result == 3) return 'new_status';
                else return '';
     },
     handler:function (grid, record, row, colIndex) {
    }
 }
 return actionTask;
}

function getActionLink(inp, link){
  var pathLink;
  if(link) pathLink = link;
  else pathLink = "";
    var actionLink = {
     getClass: function(value,metadata,record){
      var fileName = record.get(inp);
      if (fileName && fileName!="") {
       return 'list';
      }else{
       return null;              
      }
     },
     handler:function (grid, record, row, colIndex) {
       var file = grid.getStore().data.items[record].get(inp);
        if(file  && file !=""){
            downloadUrl = 'scripts/ecr_form.php?downloadFile=true&'+pathLink+'&file='+file;
            var downloadFrame = document.createElement("iframe"); 
            downloadFrame.setAttribute('src',downloadUrl);
            downloadFrame.setAttribute('class',"screenReaderText"); 
            document.body.appendChild(downloadFrame); 
        }
    }
 }
 return actionLink;
}

function getActionColumn(inp){
    var actioncolumn = {
     getClass: function(value,metadata,record){
      var imageName = record.get(inp);
      if (imageName && imageName!="") {
       return 'showpic';
      }else{
       return null;              
      }
     },
     handler:function (grid, record, row, colIndex) {
       // console.log(grid.getStore().data.items[record].get(inp));
        var image = grid.getStore().data.items[record].get(inp);
        if(image && image!=""){
            var src =  "./img/components/"+image;
        var titlePartComp = grid.getStore().data.items[record].data.description;
        showImage(titlePartComp, src);
        }
    }
 }
 return actioncolumn;
}

function showImage(title, src){
if(!WindowImage){
    WindowImage = new Ext.Window({
        minWidth: 150,
        minHeight: 150,
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        modal: true,
        constrainHeader: true,
        listeners: {
            destroy: function(){
               WindowImage = null;
            }
        },
        items:[{
                xtype: 'image',
                src: src,
                listeners: {
                  load : {
                     element : 'el',
                     fn : function(){
                          var el = this.dom;
                          var el_height = el.naturalHeight;
                          var el_width = el.naturalWidth;
                          var k = Math.round(el_height*100/el_width)/100;
                          var screen_el = Ext.getBody().getViewSize();
                          var screen_width = screen_el.width;
                          var screen_height = screen_el.height;
                          var min_size =screen_height;
                          if(screen_height>screen_width){
                              min_size = screen_width;
                          }
                          min_size = Math.round(0.9*min_size);
                          if(min_size<150){
                            min_size = 150;
                          }

                          if(k>1){
                            el_height = min_size;
                            el_width = Math.round(min_size/k);
                          }
                          else {
                             el_width = min_size;
                             el_height = min_size*k;
                          }

                          var x = (screen_width-el_width)/2;
                          var y = (screen_height-el_height)/2;
                          
                          WindowImage.setConfig('width', el_width);
                          WindowImage.setConfig('height', el_height);
                          WindowImage.setPosition(x, y);
                      }
                   }
            },
        }]
    });
    WindowImage.show();
    }
}

function getActionColumnDir(inp){
    var actioncolumn = {
     getClass: function(value,metadata,record){
      var imageName = record.get(inp);
      if (imageName && imageName!="") {
       return 'showpic';
      }else{
       return null;              
      }
     },
     handler:function (grid, record, row, colIndex) {
       // console.log(grid.getStore().data.items[record].get(inp));
        var image = grid.getStore().data.items[record].get(inp);
        if(image && image!=""){
            var src =  "./img/components/"+image;
        var titlePartComp = grid.getStore().data.items[record].data.number;
        showImage(titlePartComp, src);
        }
    }
 }
 return actioncolumn;
}


function getImageName(src){
    var temp = src.split("/");
    var imageName = temp[temp.length-1];
    return imageName;
}

function getStoreReverseEng(time_id){
    var bomJS = getStoreBOM(time_id);
if(bomJS){
  var params2 = {
        'bom' : bomJS,
      };
  }
  else params2 = null;  
  return params2;
}

function getStorePPAP(){
  var files = [];

  storeFiles.each(function(record){
    files.push({'name': record.get('name'), 'document':record.get('document')});
  });
    filesJS = JSON.stringify(files);
  var params2 = {
        'files': filesJS
      };
  return params2;
}

function getStoreBOM(time_id){
  var bom = [];
  var storeBOM = Ext.getCmp('gridbom'+time_id).getStore();
  storeBOM.each(function(record){
      bom.push({id:record.get('id'), qty: record.get('qty'), ppap: record.get('ppap'), in_house: (record.get('in_house'))?1:0, out_source: (record.get('out_source'))?1:0, reuse_from_core: (record.get('reuse_from_core'))?1:0});
     //bom.push({id:record.get('id'), qty: record.get('qty'), ppap: record.get('ppap'), in_house: record.get('in_house'), out_source: record.get('out_source'), reuse_from_core: record.get('reuse_from_core')});
  });
  if(bom.length !=0) {
    bomJS = JSON.stringify(bom);
  }
  else bomJS= null; 
  return bomJS;
}

function getStoreCoreSKU(store){
  var core_sku = [];
  store.each(function(record){
      core_sku.push({name:record.get('name'), setUp: record.get('setUp')});
    });
  core_skuJS = JSON.stringify(core_sku);
  var params2 = {
        'core_sku' : core_skuJS,
      };
  return params2;
}

function getStoreImg(store) {
  var el = [];
  store.each(function(record) {
    el.push({id: record.get("id"), src: record.get("src"), caption: record.get("caption")});
  });
  var arrEl = JSON.stringify(el);

  return arrEl;
}
function getStoreDoc(store) {
  var el = [];
  store.each(function(record) {
    el.push({id: record.get("id"), descr_spec: record.get("descr_spec"), add_spec: record.get("add_spec")});
  });
  var arrEl = JSON.stringify(el);

  return arrEl;
}


function setColumnReadOnly(grid_id, dataIndexArr) {
  var grid = Ext.getCmp(grid_id);
    var gridColumns = grid.columns;
    var gridDataIndexes = Ext.Array.pluck(grid.columns, 'dataIndex');
    for(var i=0; i<dataIndexArr.length; i++){
      var col = gridColumns[Ext.Array.indexOf(gridDataIndexes, dataIndexArr[i])];
          col.config.editor.readOnly = true;
    }
}

function setColumnDisabled(grid_id, dataIndexArr) {
  var grid = Ext.getCmp(grid_id);
    var gridColumns = grid.columns;
    var gridDataIndexes = Ext.Array.pluck(grid.columns, 'dataIndex');
    for(var i=0; i<dataIndexArr.length; i++){
      var col = gridColumns[Ext.Array.indexOf(gridDataIndexes, dataIndexArr[i])];
      col.setConfig('disabled', true);
    }
}

function getColumnByDataIndex(grid_id, dataIndex){
  var grid = Ext.getCmp(grid_id);
    var gridColumns = grid.columns;
    var gridDataIndexes = Ext.Array.pluck(grid.columns, 'dataIndex');
  var col = gridColumns[Ext.Array.indexOf(gridDataIndexes, dataIndex)];
  return col;
}

function setColumnHidden(grid_id) {
  var grid = Ext.getCmp(grid_id);
    var gridColumns = grid.columns;
    var gridDataIndexes = Ext.Array.pluck(grid.columns, 'dataIndex');
  var col = gridColumns[Ext.Array.indexOf(gridDataIndexes, 'set_hidden')];
  if(col){
    col.setConfig('hidden', true);
  }
}

function getTimeID(fields){
  var time_id;
  var id_el;
  var isExc = false;
  var dir = new Array("ecr");//exceptions length ID had to be 5 chars
  fields.each(function(item){
    if(item.name=='time_id'){
      id_el = item.id;
      for(var i = 0; i<dir.length; i++){
          if(id_el.indexOf(dir[i])!=-1){
            isExc = true;
          }
      }

      if(isExc){
          time_id = item.id.substring(5, item.id.length);
      }
      else {
          time_id = item.id.substring(7, item.id.length);
      }
    }
  });
  return time_id;
}

function getFieldByName(fields, name){
  var el;
  fields.each(function(item){
        if(item.name==name){
          el = item;
        }
      });
  return el;
}

function getValueByName(fields, name){
    var el_field = getFieldByName(fields, name);
    var value = el_field.getValue();
    return value;
}

function getUploadItem(item_id, item_name, title, review, store){
    var formUpload = Ext.create('Ext.form.Panel', {
        items:[{
            xtype: 'filefield',
            name: 'fileform',
            msgTarget: 'side',
            id:'fileform'+item_id,
            buttonText: lan.add_doc,
            disabled:review,
            margin:'0 0 0 10',
            width: 100,
            defaults: {
                fileUpload: true
            },
            buttonOnly: true,
            listeners: {
                change: function(val, value, eOpts, editor){
                    var extn = value.split('.').pop();
                    if((extn=='html') || (extn=='php') || (extn=='ini') || (extn=='exe')){
                        val.setValue(''); val.setRawValue('');
                        Ext.MessageBox.alert(lan.error, lan.incorrect_file_format);
                    }else {
                        var form = this.up('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: 'scripts/ecr_form.php',
                                waitMsg: lan.upload_your_doc,
                                params: {"addDoc":'true'},
                                success: function(fp, o) {
                                    Ext.getCmp(item_id).setValue(o.result.message);
                                    store.each(function(record){
                                        if(record.get('name') ==item_name) store.remove(record);
                                    });
                                    store.add({name:item_name, document:o.result.message});
                                }
                            });
                        }
                     }
                }
            }
        }]
});

var formFile = {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                },
                items: [{
                xtype:'displayfield',
                fieldLabel: title,
                name: item_name,
                id: item_id,
                labelWidth: style.input2.labelWidth,
                style:'font-size:14px; text-align: center; text-decoration: underline;',
                flex:1,
                listeners: {
                    afterrender: function(component) {
                        component.getEl().on('click', function() { 
                        if(arguments[0].target.nodeName!='LABEL') {
                            var file = Ext.getCmp(item_id).getValue();
                            downloadUrl = 'scripts/ecr_form.php?downloadFile=true&doc=true&file='+file;
                            var downloadFrame = document.createElement("iframe"); 
                            downloadFrame.setAttribute('src',downloadUrl);
                            downloadFrame.setAttribute('class',"screenReaderText"); 
                            document.body.appendChild(downloadFrame); 
                        }
                    });
                },
                change: function(){
                  var val = this.getValue();
                  if(val&&val!=""){
                      this.setStyle({cursor:'pointer'});
                  }else{
                    this.setStyle({cursor: 'default'});
                  }
                }
            }
            },formUpload,
            {
            xtype:'button',
            text: lan.del,
            margin:'0 0 0 10',
            id: 'del'+ item_id,
            disabled:review,
            width: 100,
            handler:function(){
                Ext.getCmp(item_id).setValue("");
            }
        }]
    };
    return formFile;
}


function convertInch(inch){
    var inch_arr = new Array();
    var inch_arr2 = new Array();
    var mm = 0;
    inch = inch.replace('"', ' ');
    inch = inch.trim();
    if(inch.match(/^\d+(\.\d+)*$/))  mm = inch*25.4;
        else {
            inch_arr = inch.split(" ");
            for(var i=0; i<inch_arr.length; i++){
                if(inch_arr[i].match(/\//)) {
                    inch_arr2 = inch_arr[i].split("/");
                    inch_arr[i] = inch_arr2[0]/inch_arr2[1];
                }
                inch_arr[i] = inch_arr[i]*25.4;
            }
            for(var i=0; i<inch_arr.length; i++){
                mm += inch_arr[i];
            }
        }
   return mm;
}

/*var setbgDim = function (value, metaData, record, rowIndex, colIndex, store, view) {
    var metric = record.get('metric');
    if(metric==1 || metric==2){
        if(metric==2){
        var dimension = convertInch(record.get('dimension'));
        var tolerance_plus = convertInch(record.get('tolerance_plus'));
        var tolerance_minus = convertInch(record.get('tolerance_minus'));
        var val = convertInch(value);
        }
        else {
            var dimension = Number(record.get('dimension'));
            var tolerance_plus = Number(record.get('tolerance_plus'));
            var tolerance_minus = Number(record.get('tolerance_minus'));
            var val = value;
        }
        var max = dimension + tolerance_plus;
        var min = dimension -tolerance_minus;
       if (val < min || val>max) metaData.tdCls = 'red_bg';
            else metaData.tdCls = 'green_bg';
    }
    else {
        var dimension = record.get('dimension');
        if (value != dimension) metaData.tdCls = 'red_bg';
            else metaData.tdCls = 'green_bg';
    }
    if(Number(value)==0 || !value || value.trim() == "") { metaData.tdCls = ''; value = null;}
        return value
    };*/

var setbgDim = function (value, metaData, record, rowIndex, colIndex, store, view) {
    var metric = record.get('metric');
    if(Number(value)==0 || !value || value.trim() == "") { metaData.tdCls = '';}
        else {
            switch(metric) {
                case 1:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    var dimension = Number(record.get('dimension'));
                    var tolerance_plus = Number(record.get('tolerance_plus'));
                    var tolerance_minus = Number(record.get('tolerance_minus'));
                    var val = value;
                    var max = dimension + tolerance_plus;
                    var min = dimension -tolerance_minus;
                   if (val < min || val>max) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
                case 2:
                    var dimension = convertInch(record.get('dimension'));
                    var tolerance_plus = convertInch(record.get('tolerance_plus'));
                    var tolerance_minus = convertInch(record.get('tolerance_minus'));
                    var val = convertInch(value);
                    var max = dimension + tolerance_plus;
                    var min = dimension -tolerance_minus;
                   if (val < min || val>max) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
                default:
                    var dimension = record.get('dimension');
                    if (value != dimension) metaData.tdCls = 'red_bg';
                        else metaData.tdCls = 'green_bg';
                break;
            }
        }
    return value;
}

var setbgFunc = function (value, metaData, record, rowIndex, colIndex, store, view) {
    var max = Number(record.get('nominal')) + Number(record.get('tolerance_plus'));
    var min = Number(record.get('nominal')) -Number(record.get('tolerance_minus'));
          if (value < min || value>max) metaData.tdCls = 'red_bg';
                else metaData.tdCls = 'green_bg';
        if(Number(value)==0 || !value) { metaData.tdCls = ''; value = null;}
        return value
    };


Ext.util.Format.comboRenderer = function(combo){
    return function(value){
        var record = combo.findRecord(combo.valueField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
};

 var setToolGageType = function (value, metaData, record, rowIndex, colIndex, store, view) {
        var val = record.get('tool_gage_type');
        if(val==0) return "Tool";
            else return "Gage";
  };


  
function uniqueVal(value, index, self) { 
      return self.indexOf(value) === index;
  }

function menuRightsManager(user_rights){
  permissions=["options_root", "exit", "change_password"];
  var tree = Ext.getCmp('tree-panel');
  var store = tree.getStore();

  if(user_rights){
      var arr_rights = Ext.decode(user_rights);
    for (key in arr_rights) {
      permissions.push(key+"_root");
      if(key=="workflow"){
        permissions = permissions.concat(worflowItems);
      }
      if(key=="create_new_engineering_req"){
        permissions = permissions.push("new_engineering_req");
      }

      for (var i=0; i< arr_rights[key].length; i++) {
        permissions.push(arr_rights[key][i].permission);
      }
    }
    
    permissions = permissions.filter(uniqueVal);
  }

  var tree_ids =[];
  store.each(function(record){
    tree_ids.push(record.get('id'));
    if(record.childNodes.length>0){
      var item = record.childNodes;
      for(var i=0; i<item.length; i++){
        tree_ids.push(item[i].id);
      }
    }
  });
  tree_ids = tree_ids.filter(uniqueVal);
  var first_id = "";
  for(var i=0; i<tree_ids.length; i++){
    if(permissions.indexOf(tree_ids[i])==-1){
      if(store.getNodeById(tree_ids[i])){
        store.getNodeById(tree_ids[i]).remove();
      }
    }
    else{
      if(first_id==""){
        first_id = tree_ids[i];
      }
    }
  }

  tree.expandPath(store.getNodeById(first_id).getPath());
}


function getUserRights(user_rights){
    var arr_rights = Ext.decode(user_rights);
    var dir_rights = [];
    var globals = [];
    for (key in arr_rights) {
      for (var i=0; i< arr_rights[key].length; i++) {
          if(!dir_rights[arr_rights[key][i].permission]){
              dir_rights[arr_rights[key][i].permission] = new Array();
              dir_rights[arr_rights[key][i].permission][0] = arr_rights[key][i].right;
          }
          else {
              dir_rights[arr_rights[key][i].permission].push(arr_rights[key][i].right);
          }
      }
    }
  return dir_rights;
}


function setDisabledAllButtons(fields){
      var el = getFieldByName(fields, 'draft');
      if(!el){
         el = getFieldByName(fields, 'time_id');
      }
        var form = el.up('form');
        var buttons = form.query('button');
        var file_fields = form.query('filefield');      
        Ext.Array.each(buttons, function(button) {
          if(button.xtype!='tab'){
            button.setDisabled(true);
          }
      });

      Ext.Array.each(file_fields, function(file_field) {
          file_field.setDisabled(true);
      });
    }

function showObject(inData){
  //inData = {id:'id', title: 'title', sizeX: 'x', sizeY: 'y', item: 'item'};
  var title = "";
  var sizeX = '80%';
  var sizeY = '80%';
  var item = {
    xtype: 'displayfield',
    value: 'NO DATA TO DISPLAY!',
    style:'margin:20px; font-size:20px; text-align: center', 
  };
  if(inData){
    if(inData.title) title = inData.title;
    if(inData.sizeX) sizeX = inData.sizeX;
    if(inData.sizeY) sizeY = inData.sizeY;
    if(inData.item) item = inData.item;
  }

var WindowObject = new Ext.Window({
        width: sizeX,
        height: sizeY,
        title: title,
        closeAction: 'destroy',
        layout: 'fit',
        resizable: true,
        closable: true,
        modal: true,
        constrainHeader: true,
        listeners: {
            destroy: function(){
               WindowObject = null;
            }
        },
        items:item
    });
    WindowObject.show();
}

function correctJSON(jsdata){
    jsdata = jsdata.replace(/\r|\n/g, "");
    jsdata = jsdata.replace(/\'/g,"\\\'");
    jsdata = jsdata.replace(/\"\[/g,"\'\[");
    jsdata = jsdata.replace(/\]\"/g,"\]\'");
    return jsdata;
  }

function getCustomersStore(time_id){
    var CustomersStore = new Ext.data.Store({     
        fields: ['name']
    });

    return CustomersStore;
}

function getCoreSKUStore(time_id){
    var core_skuStore = new Ext.data.Store({     
        fields: ['name', {name: 'setUp', type: 'int'}]
    });

    return core_skuStore;
}

function getOESKUStore(time_id){
    var oe_skuStore = new Ext.data.Store({     
        fields: ['name']
    });

    return oe_skuStore;
}

function getSimilarSKUStore(time_id){
    var similar_skuStore =  new Ext.data.Store({     
        fields: ['name']
    });

    return similar_skuStore;
}

function getRemanSKUStore(time_id){
    var reman_sku_upcStore =  new Ext.data.Store({     
        fields: ['reman_sku', 'upc']
    });

    return reman_sku_upcStore;
}

function getOnlyRemanSKU(time_id){
    var reman_skuStore =  new Ext.data.Store({     
        fields: ['name']
    });

    return reman_skuStore;
}

function getCompetitorsStore(time_id){
    var Competitors_Store = new Ext.data.Store({     
        fields: ['name']
    });

    return Competitors_Store;
}

function getCompMarketPriceStore(time_id){
   var competitor_market_priceStore = new Ext.data.Store({     
        fields: ['name', 'date']
    });

    return competitor_market_priceStore;
}

function getCompCorePriceStore(time_id){
   var competitor_core_priceStore = new Ext.data.Store({     
        fields: ['name', 'date']
    });

    return competitor_core_priceStore;
}

function est_annual_revenue_func(time_id){
     var eep = Ext.getCmp('est_exch_price_due_diligence'+time_id).getValue();
     var mad = Ext.getCmp('Annualdemand_due_diligence'+time_id).getValue();
     Ext.getCmp('est_annual_revenue_due_diligence'+time_id).setValue(eep*mad);
}

function good_target_level(time_id){
     var mad = Ext.getCmp('Annualdemand_due_diligence'+time_id).getValue();
     var res = mad/12;
     res = +res.toFixed(7);
     res = Math.ceil(res);
     Ext.getCmp('good_target_level'+time_id).setValue(res);
}

function transliterate(word){
  var a = {'А':'A','а':'A','Б':'B','б':'B','В':'B','в':'B','Е':'E','е':'E','К':'K','к':'K','М':'M','м':'M','Н':'H','н':'H','О':'O','о':'O','Р':'P','р':'P','С':'C','с':'C','Т':'T','т':'T','У':'Y','у':'Y','Х':'X','х':'X','-':''};
  var w = word.split('').map(function (char){
    return a[char] || char; 
  }).join("");
  w = w.replace(/\s+/g,'');
  w = w.replace(/[-]+/g,'');
  return w;
}

function formatArrayToString(in_data){
    var data = Ext.decode(in_data);
    for(var i = 0; i<data.length; i++){
      data[i] = data[i].name;
    }
    return data.join("; ");
  }

function getImageGalery(time_id, readStatus=false){

    var imagesStore = Ext.create('Ext.data.Store', {
        model: 'Image',
    });

    var imageTpl = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="uploadStyle">',
            '<div class="caption_title">{caption}</div>',
            '<img src="{src}" style="max-height:90%; max-width:95%;"/>',
        '</div>',
    '</tpl>'
);

var itemsUploadForm = Ext.create('Ext.view.View', {
    store: imagesStore,
    id: 'UploadForm'+time_id,
    tpl: imageTpl,
    itemSelector: 'div.uploadStyle',
    emptyText: lan.no_images,
    listeners: {
        dblclick: {
            element: 'el', //bind to the underlying body property on the panel
            fn: function(e, t){ 
                var select = itemsUploadForm.getSelectionModel().selected.items[0].data;
                showImage(select.caption, select.src);
            }
        }
    }
});

var fileUploadForm = Ext.create('Ext.form.Panel', {
        id: 'fileUploadForm'+time_id,
        bodyPadding: 10,
        frame: false,
        items:[{
            xtype: 'container',
            layout: {
                type: 'hbox',
            },
            items: [{
            xtype: 'filefield',
            name: 'add_imageform',
            msgTarget: 'side',
            buttonText: lan.add_new_image,
            id:'add_imageform'+time_id,
            hidden: readStatus,
             width:150,
            //flex:1,
            //maxWidth: 200,
            defaults: {
                fileUpload: true
            },
            buttonOnly: true,
            listeners: {
                change: function(val, value, eOpts, editor){
                    Ext.Msg.prompt(lan.Image, lan.enter_image_name, function(btn, text){
                        if (btn == 'ok'){
                           var extn = value.split('.').pop();
                            if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
                                val.setValue(''); val.setRawValue('');
                                Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " +lan.available +': (.png, .jpg, .bmp, .gif)');
                            }else {
                                var form = Ext.getCmp('fileUploadForm'+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_mess,
                                        params: {"addImage":'true'},
                                        success: function(fp, o) {
                                            imagesStore.add({id: imagesStore.data.length+1, src: 'img/components/'+o.result.message, caption:  text});
                                         }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        },{
            xtype: 'button',
            text: lan.del,
            hidden: readStatus,
            id:'delete'+time_id,
            //maxWidth: 200,
            width:150,
            //flex:1,
            handler : function() {
                var select = itemsUploadForm.getSelectionModel().selected.items[0];
                if(select){
                    select = select.id;
                    imagesStore.each(function(record){
                        if(record.get('id')==select) imagesStore.remove(record);
                    });
                }
                else{
                    Ext.MessageBox.alert(lan.error, lan.select_image);
                }
            }
        }]
        },itemsUploadForm]
});

return fileUploadForm;
}

function timeTransform(data, field) {
  /*var utc = 0;
  if(gmt == "(UTC +02:00) Europe") utc = 10800;
  else utc = -14400;
  console.log(id_user+" / "+gmt+" / "+utc);*/

  var newDate = new Date(data * 1000 + (10800 * 1000));
  var year = newDate.getFullYear();
  var month = newDate.getMonth();
  month += 1;
  if(String(month).length < 2) month = "0"+month;
  var date = newDate.getDate();
  if(String(date).length < 2) date = "0"+newDate.getDate();
  var hours = newDate.getHours();
  //console.log(hours);
  if(String(hours).length < 2) hours = "0"+newDate.getHours();
  var minutes = newDate.getMinutes();
  if(String(minutes).length < 2) minutes = "0"+newDate.getMinutes();
  var seconds = newDate.getSeconds();
  if(String(seconds).length < 2) seconds = "0"+newDate.getSeconds();
  //console.log(year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds);
  Ext.getCmp(field).setValue(year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds);
}

function timeTransformHistory(data) {
    var newDate = new Date(data * 1000 + (10800 * 1000));
    var year = newDate.getFullYear();
    var month = newDate.getMonth();
    month += 1;
    if(String(month).length < 2) month = "0"+month;
    var date = newDate.getDate();
    if(String(date).length < 2) date = "0"+newDate.getDate();
    var hours = newDate.getHours();
    //console.log(hours);
    if(String(hours).length < 2) hours = "0"+newDate.getHours();
    var minutes = newDate.getMinutes();
    if(String(minutes).length < 2) minutes = "0"+newDate.getMinutes();
    var seconds = newDate.getSeconds();
    if(String(seconds).length < 2) seconds = "0"+newDate.getSeconds();
    //console.log(year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds);
    var result = year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
    return result;
}

function getDimUnits(readStatus){
    var dim_units = new Ext.form.ComboBox({
      typeAhead: true,
      triggerAction: 'all',
      lazyRender: true,
      store: store_metricDim,
      displayField: 'name',
      valueField: 'id',
      readOnly: readStatus,
      editable: false,
      value: 1
  });
    return dim_units;
}

function getFuncUnits(readStatus){
  var func_units = new Ext.form.ComboBox({
      typeAhead: true,
      triggerAction: 'all',
      lazyRender: true,
      store: store_metricFunc,
      displayField: 'name',
      valueField: 'id',
      readOnly: readStatus,
      editable: false,
      value: 1
  });
  return func_units;
}

function getImageUploadItem(inData){
  //inData = {time_id: time_id, title: title, readStatus: readStatus, id: photo_el_id}
  var time_id = Date.parse(new Date());
  var readStatus =  true;
  var title = "UploadImage";
  var id = "";

  if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(!inData.readStatus){
            readStatus =  false;
          }
        if(inData.title) title = inData.title;
        if(inData.id) id = inData.id;
    }

  var formUploadImage = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        title: title,
        frame: true,
        width: 300,
        height: 300,
        bodyStyle: "background-image:url(img/no_foto.png)!important",
        items:[{
            xtype: 'image',
            id: id+time_id,
            src: '',
            imgCls: 'ImageGalery',
            name: 'photo_el'
        }],
        listeners: {
            dblclick : {
                fn: function(e, t) {
                    var src = getImageName(t.src);
                    var extn = src.split('.').pop();
                        src = "img/components/"+getImageName(t.src);
                    if((extn=='png') || (extn=='jpg') || (extn=='bmp') || (extn=='gif')){
                        showImage("Image", src);
                    }
                },
                element: 'body',
                scope: this
            }    
        },
        dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            xtype: 'filefield',
            msgTarget: 'side',
            buttonText: lan.add_image,
            name: 'image_el',
            //hidden: readStatus,
            margin: '0 80px',
            defaults: {
                fileUpload: true
            },
            buttonOnly: true,
            listeners: {
                change: function(val, value, eOpts, editor){
                    var extn = value.split('.').pop();
                    if((extn!=='png') && (extn!=='jpg') && (extn!=='bmp') && (extn!=='gif')){
                        val.setValue(''); val.setRawValue('');
                        Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " +lan.available +': (.png, .jpg, .bmp, .gif)');
                    }else {
                        //console.log(extn);
                        var form = this.up('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: 'scripts/ecr_form.php',
                                waitMsg: lan.upload_mess,
                                params: {"addImage":'true'},
                                success: function(fp, o) {
                                    formUploadImage.setBodyStyle('background:#fff');
                                    formUploadImage.query('[name=photo_el]')[0].setSrc('img/components/'+o.result.message);
                                }
                            });
                        }
                    }
                }
            }
        }]
    }]
});

  return formUploadImage;
}

function getUploadDocumentsItem(inData){
  //inData = {time_id: time_id, title: title, readStatus: readStatus, id: photo_el_id}
  var time_id = Date.parse(new Date());
  var readStatus =  true;
  var title = "UploadDocument";
  var id = "";
  var link = "";
  var sizeX = '96%';

  if(inData){
        if(inData.time_id) time_id = inData.time_id;
        if(!inData.readStatus){
            readStatus =  false;
          }
        if(inData.id) id = inData.id;
        if(inData.link) link = inData.link;
        if(inData.sizeX) sizeX = inData.sizeX;
    }

  var downloadLink = getActionLink('add_spec');

  var documentGridStore =  new Ext.data.Store({     
        fields: ['id', 'descr_spec', 'add_spec']
    });

var DocUploadForm = Ext.create('Ext.form.Panel', {
        id: id+time_id,
        //margin: '0 0 0 10',
        frame: false,
        items:[{
            xtype: 'grid',
            id:'doc_grid'+time_id,
            border: true,
            style: 'border: 2px solid #1E90FF',
            anchor: sizeX,
            hidden: false,
            store: documentGridStore,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    id: 'fileform'+time_id,
                    name: 'fileform',
                    msgTarget: 'side',
                    buttonText: lan.add_file,
                    hidden: readStatus,
                    buttonOnly: true,
                    defaults: {
                        fileUpload: true
                    },
                    listeners: {
                        change: function(val, value, eOpts, editor){
                            Ext.Msg.prompt('Document', 'Please enter document description', function(btn, text){
                            if (btn == 'ok'){
                            var extn = value.split('.').pop();
                                if((extn!=='doc') && (extn!=='txt') && (extn!=='xls') && (extn!=='xlsx') && (extn!=='docx')&& (extn!=='pdf')){
                                    val.setValue(''); val.setRawValue('');
                                    Ext.MessageBox.alert(lan.error, lan.incorrect_file_format + ". " + lan.available +': (.doc, .txt, .xls, .xlsx, .docx, .pdf)');
                                }else {
                                var form = Ext.getCmp(id+time_id).getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'scripts/ecr_form.php',
                                        waitMsg: lan.upload_file,
                                        params: {"addFile":'true'},
                                        success: function(fp, o) {
                                            //console.log(o.result.message);
                                            documentGridStore.add({id: documentGridStore.data.length+1, descr_spec: text, add_spec: o.result.message});
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
                    hidden: readStatus,
                    dataIndex: 'set_hidden',
                    items:[{
                        iconCls:'delete',
                        handler:function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            documentGridStore.remove(rec);
                        }
                    }]
                }]
        }]
});
return DocUploadForm;
}


var setCompType = function (value, metaData, record, rowIndex, colIndex, store, view) {
      switch(Number(value)){
        case 1:
            metaData.tdCls = 'green_bg';
            value = '<b>FG</b>';
        break;
        case 2:
            metaData.tdCls = 'grey_bg';
            value = '<b>Comp.</b>';
        break;
        case 3:
            metaData.tdCls = 'blue_bg';
            value = '<b>KIT</b>';
        break;
        case 4:
            metaData.tdCls = 'light_blue_bg';
            value = '<b>K/P</b>';
        break;
        default:
            metaData.tdCls = '';
            value = 'N/A';
        break;
      }
    return value
};

var setBOMStatus = function (value, metaData, record, rowIndex, colIndex, store, view) {
      switch(Number(value)){
        case 0:
            metaData.tdCls = 'grey_bg';
            value = '<b>In progress</b>';
        break;
        case 1:
            metaData.tdCls = 'green_bg';
            value = '<b>Approved</b>';
        break;
        case 2:
            metaData.tdCls = 'red_bg';
            value = '<b>Rejected</b>';
        break;
        case 3:
            metaData.tdCls = 'blue_bg';
            value = '<b>New</b>';
        break;
        case 4:
            metaData.tdCls = 'olive_bg';
            value = '<b>Canceled</b>';
        break;
        default:
            metaData.tdCls = '';
            value = 'N/A';
        break;
      }
    return value
};

function getGridFrame(inData){
  var grid_item = null;
  if(inData.grid_item){
      grid_item = inData.grid_item;
      var grid_panel = Ext.create('Ext.panel.Panel', {
          width: '100%',
          height: '100%',
          autoScroll: true,
          items: grid_item,
          dockedItems: [{
            dock: 'bottom',           
            items: [{
              xtype: 'button',
              text:'Use',
              minWidth: 150,
              flex: 1,
              //width: '40%',
              margin: '5px',
              handler: function(){
                var select = Ext.getCmp(grid_item.id).getView().getSelectionModel().getSelection()[0];
                if(select){
                  var record = Ext.getCmp(inData.element.id).up('grid').getView().getSelectionModel().getSelection()[0];
                  record.set(inData.dataIndex, Number(select.get('id')));
                  this.up('window').destroy();
                }
                else {
                      Ext.MessageBox.alert(lan.error, lan.select_row);
                  }
              }
            },{
              xtype: 'button',
              text:'Cancel',
              minWidth: 150,
              flex: 1,
              //width: '40%',
              margin: '5px',
              handler: function(){
                this.up('window').destroy();
              }
            }]
          }]
      });
  }
  

  return grid_panel;
}

function setBOMReadOnly(time_id){
  setColumnReadOnly('gridbom'+time_id, ['qty']);
  //Ext.getCmp('grid_control'+time_id).setValue(true);
  setColumnDisabled('gridbom'+time_id, ['in_house', 'out_source', 'reuse_from_core']);
  setColumnHidden('gridbom'+time_id);
  Ext.getCmp('bom_add'+time_id).hide();
  Ext.getCmp('bom_create'+time_id).hide();
}

Ext.apply(Ext.data.SortTypes, {
    asLower: function (str) {
        return str.toLowerCase();
    }
});

function activeUser(value) {
    switch(Number(value)){
        case 0:
        value = 'Inactive';
        break;
        case 1:
        value = 'Active';
        break;
    }
    return value
}

function closeWindows(count){
    var win_arr = [];
    var ind;
    Ext.WindowMgr.each(function(win){
            win_arr.push(win);
        });

    for (var i = 0; i<count; i++) {
        ind = win_arr.length - 1 - i;
        win_arr[ind].destroy();
    }
}

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

var setTextPDS = function (value, metaData, record, rowIndex, colIndex, store, view) {
        var approved = record.get('approved');
          if (value ==1&&approved==0) {
                metaData.tdCls = 'green_bg';
                value = '<b>Ready</b>';
            }
                else {
                    metaData.tdCls = 'red_bg';
                    value = '<b>Not Ready ('+approved+')</b>';
                }
        return value
    };

Ext.apply(Ext.data.SortTypes, {
    asNatural: function (str) {
        return str.replace(/(\d+)/g, "0000000000$1").replace(/0*(\d{10,})/g, "$1");
    }
});

function convertStore(store) {
    var arr_rec = [];
    
    store.each(function(record){
       arr_rec.push(record.data);
    });

    if(arr_rec.length !=0) {
        var arr = JSON.stringify(arr_rec);
    }
    else arr = null;
    //console.log(arr);   
    return arr;
}

function convertDivision(value) {
    switch(Number(value)){
        case 1:
        value = 'AMAM';
        break;
        case 2:
        value = 'OES';
        break;
    }
    return value
}
