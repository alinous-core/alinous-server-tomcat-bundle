function initBreakpoints(editor, modulePath)
{
	var cm = editor;
		
	var url = "/admin/cms/debugger/breakpoint.alns";
	$.ajax({
		type: 'POST',
		url: url,
		data: {
			cmd: "getBreakpoints",
			modulePath: modulePath
		},
		dataType: 'json',
		success: function(data) {
			var arrays = data;
			
			for(var i = 0; i < arrays.length; i++){
				var line = arrays[i].line - 1;
				
				cm.setGutterMarker(line, "breakpoints", makeMarker(line, modulePath));
			}
		},
		error:function() {
			alert('Error occur');
		}
	});
}

function getAllMarkers(editor)
{
	var markerLines = [];
	var lines = editor.doc.lineCount();
	for(var i = 0; i < lines; i++){
		var info = editor.lineInfo(i);
		
		if(!info.gutterMarkers){
			continue;
		}
		
		var marker = info.gutterMarkers['breakpoints'];
		if(marker){
			var alnsline = i + 1;
			markerLines.push(alnsline);
		}
	}
	
	return markerLines;
}

function finishDebug(threadId, modulePath)
{
	var th = threadId;
	var md = modulePath;	
	
	var closefn = function(){
		var url = "/admin/cms/debugger/finish.alns";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				modulePath: md,
				threadId: th
			},
			dataType: 'html',
			success: function(data) {
				
			},
			error:function() {
				alert('Error occur');
			}
		});
		
		window.close();
	}
	
	return closefn;
}

function removeMarker(line, modulePath, change) {
	var url = "/admin/cms/debugger/breakpoint.alns";
	var codeLine = line + 1;
	
	if(!change){
		change = 0;
	}
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
			cmd: "remove",
			modulePath: modulePath,
			line: codeLine,
			change: change
		},
		dataType: 'html',
		success: function(data) {
			
		},
		error:function() {
			alert('Error occur');
		}
	});
	
	return null;
}

function makeMarker(line, modulePath, change) {
	var marker = document.createElement("div");
	marker.style.color = "#6666FF";
	marker.innerHTML = '<img src="/admin/cms/debugger/img/brkp_obj.gif" />';
	
	var url = "/admin/cms/debugger/breakpoint.alns";
	var codeLine = line + 1;
	
	if(!change){
		change = 0;
	}
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
			cmd: "add",
			modulePath: modulePath,
			line: codeLine,
			change: change
		},
		dataType: 'html',
		success: function(data) {
			
		},
		error:function() {
			alert('Error occur');
		}
	});
	
	return marker;
}
