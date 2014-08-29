var DebugState = {
	modulePath : null,
	threadId : null,
	editor : null,
	line : 0,
	state : function (modulePath, threadId, editor)
	{
		var cm = editor;
		DebugState.modulePath = modulePath;
		DebugState.threadId = threadId;
		DebugState.editor = editor;
		
		var url = "/admin/cms/debugger/state.alns";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				modulePath: modulePath,
				threadId: threadId
			},
			dataType: 'json',
			success: function(data) {
				var stateData = data[0];
				
				DebugState.handle(stateData, cm);
				
				var currentLine = parseInt(stateData.line);
				
				if(DebugState.line != currentLine){
					DebugState.updateVariable(modulePath, threadId, editor);
				}
				
				DebugState.line = currentLine;
				
				if(stateData.state != "terminated"){
					setTimeout("DebugState.state(DebugState.modulePath, DebugState.threadId, DebugState.editor)",1000);
				}			
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Error occur : state' + textStatus);
			}
		});
		
	},
	updateVariable : function (modulePath, threadId, editor)
	{
		var url = "/admin/cms/debugger/variables.alns?threadId=" + threadId;
		TreeTableWrapper.loadTable(url, "variables")
	},
	
	handle : function (stateData, cm)
	{
		var state = stateData.state;
		
		console.log(stateData.state);
		
		if(state == "suspended"){
			DebugState.movePtr(stateData.line, cm);
			
			$("#onterminate").css("display", "none");
			$("#onsuspend").css("display", "inline");
		}else{
			cm.clearGutter("pgptr");
			
			$("#onterminate").css("display", "inline");
			$("#onsuspend").css("display", "none");
		}
	},
	
	
	movePtr : function (line, cm)
	{
		var intLine = parseInt(line, 10) - 1;
		cm.clearGutter("pgptr");
		
		cm.setGutterMarker(intLine, "pgptr", DebugState.getPtrMarker());
		
		cm.scrollIntoView({line: intLine, ch: "0"});
			
		return;
		
	},
	getPtrMarker : function ()
	{
		var marker = document.createElement("div");
		marker.style.color = "#6666FF";
		marker.innerHTML = '<img src="/admin/cms/debugger/img/inst_ptr_top.gif" />';
		
		return marker;
	},
	command : function(threadId, cmd)
	{
		var url = "/admin/cms/debugger/commandar.alns";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				cmd: cmd,
				threadId: threadId
			},
			dataType: 'json',
			success: function(data) {
						
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Error occur : command' + textStatus);
			}
		});
	}	
};
