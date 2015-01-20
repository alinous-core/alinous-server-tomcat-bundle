var DebugConsole = {
	autoScroll : 1,
	scrolling: 0,
	fetch : function()
	{
		var debug_time = $("#debug_time").val();
		
		var url = "/admin/cms/debugger/console.alns";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				debug_time, debug_time
			},
			dataType: 'text',
			success: function(data) {				
				// alert(data);
				$("#web-console").html(data);
				
				if(DebugConsole.autoScroll == 1){
					var scrollHeight = document.getElementById("web-console").scrollHeight;
					
					document.getElementById("web-console").scrollTop = scrollHeight;
				}
				
				setTimeout("DebugConsole.fetch()",1000);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Error occur : state' + textStatus);
			}
		});
		
	}
};
