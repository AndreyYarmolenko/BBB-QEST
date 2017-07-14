var timer = setInterval(ping, 30 * 1000);
function ping(){
	Ext.Ajax.request({
			url: 'scripts/ping.php',
			method: 'POST',
			params: { },
			success: function(obj){
				if( obj.responseText == false || obj.responseText == 'false' ) window.location = '../login.php'
			},
			failure: function(obj){
				
			}
	});
}
