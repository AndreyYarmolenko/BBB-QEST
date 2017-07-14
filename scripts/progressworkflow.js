function addProgressWorkflow(){

var progressworkflow = Ext.create('Ext.Panel',{
		layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch',
		},
		defaults: {
        frame: true,
		},
        scrollable: true,
		items: [{
          xtype: 'tabpanel',
          height: 620,
          scrollable: true,
          items: [{
                  title: lan.overall,
                  html: '<img src="img/eowc.png" class="image_progress_h">' 
              }, {
                  title: lan.ProductEng,
                  html: '<img src="img/peni.png" class="image_progress_h">'
              }, {
                  title: lan.ProcessEng,
                  html: '<img src="img/pewc.png" class="image_progress_v">'
              }]
       }]
});

return progressworkflow;
}
