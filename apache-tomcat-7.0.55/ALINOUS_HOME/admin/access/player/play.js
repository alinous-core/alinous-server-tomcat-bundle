
var AlinousPlayer = {
	funcs : null,
	user_id: null,
	access_id: null,
	play : function(user_id, access_id){
		AlinousPlayer.user_id = user_id;
		AlinousPlayer.access_id = access_id;
		
		var data = {user_id: user_id, access_id: access_id};
		
		$.ajax({
			type: "GET",
			url: "/admin/access/player/playhelper.alns",
			dataType: "json",
			data: data,
			processData: true,
			success: function(json)
			{
		    	var val = json[0];
		    	
		    	var popUrl = "/admin/access/archiver/api/dl.alns?ar=" + val.archive_page_id;
		    	var options = "toolbar=no,location=no," + //left=150,top=100,
		    		"status=no,menubar=no,scrollbars=yes," +
		    		"width=" + val.window_width +",height=" + val.window_height;
		    	
		    	playerWin = window.open(popUrl, "player", options);
				
				var funcs = AlinousPlayer.playClosure(playerWin);
				AlinousPlayer.funcs = funcs;
				
				if(playerWin.document.addEventListener){
					playerWin.addEventListener('load', funcs.firstPlay, false);
				}else{
					playerWin.attachEvent("onload", funcs.firstPlay);
				}				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert("errorThrown!! " + errorThrown);
			}
		});
	},
	playClosure : function(win)
	{
		var playWindow = win;
		var playIndex = 0;
		var playActionLength = 0;
		var playActions = new Array();
		var offset = 0;
		var lastdelta = 0;
		
		var mouseDiv;
		var lastMousePosition = {x: 0, y: 0};
		
		var firstPlay = function()
		{
			mouseDiv = playWindow.document.createElement("div");
			mouseDiv.setAttribute("id", "alinous_mouse");
			mouseDiv.style.position = "absolute";
			mouseDiv.style.top = 0 + 'px';
			mouseDiv.style.left = 0 + 'px';
			
			mouseDiv.innerHTML = '<img src="/admin/access/player/img/mouse_and_input.png">';
						
			playWindow.document.body.appendChild(mouseDiv);
			
			var f = AlinousPlayer.funcs;
			
			fetchEvents();
		};
		
		var doPlay = function()
		{
			if(playWindow.closed){
				return;
			}
			
			// play one record
			var command = playActions[playIndex++];
			offset++;
			
			if(command.motion_type == 'mousemoved'){
				mouseMove(command.arg_x, command.arg_y);
			}else if(command.motion_type == 'scrolled'){
				pageScroll(command.arg_x, command.arg_y);
			}else if(command.motion_type == 'windowresized'){
				windowResized(command.arg_x, command.arg_y);
			}
						
			// next record
			if(playIndex >= playActionLength){
				fetchEvents();
			}else{
				// get next command
				nextCommand = playActions[playIndex];
				var nextMill = getNextMill(command);		
				setTimeout("AlinousPlayer.funcs.doPlay()", nextMill);
			}
			
			lastdelta = command.delta_mill;
		};
		
		var getNextMill = function(nextCommand)
		{
			var next = parseInt(nextCommand.delta_mill, 10);
			
			return next - lastdelta;
		}
		
		var windowResized = function(x, y)
		{
			playWindow.resizeTo(x,y);
		}
		
		var pageScroll = function(x, y)
		{
			playWindow.scroll(x, y);
			
			// adjust mouse position
			mouseMove(lastMousePosition.x, lastMousePosition.y);
		}
		
		var mouseMove = function(x, y)
		{
			// canter
			var xdiff = 128 / 2;
			var ydiff = 128 / 2;
			
			//
			var scrollTop =
				document.documentElement.scrollTop || // IE、Firefox、Opera
				document.body.scrollTop;              // Chrome、Safari
			var scrollLeft = 
				document.documentElement.scrollLeft || // IE、Firefox、Opera
				document.body.scrollLeft;              // Chrome、Safari
			
			var clientX = parseInt(x, 10) - scrollLeft - xdiff;
			var clientY = parseInt(y, 10) - scrollTop - ydiff;
			
			// save document position
			lastMousePosition.x = x;
			lastMousePosition.y = y;
			
			mouseDiv.style.top = clientY + 'px';
			mouseDiv.style.left = clientX + 'px';
		}
		
		var fetchEvents = function()
		{
			var data = {user_id: AlinousPlayer.user_id,
					access_id: AlinousPlayer.access_id,
					offset: offset};
			$.ajax({
				type: "GET",
				url: "/admin/access/player/fetchCommands.alns",
				dataType: "json",
				data: data,
				processData: true,
				success: function(json)
				{
			    	playActions = json;
			    	playIndex = 0;
			    	
			    	playActionLength = json.length;
			    	
			    	if(playActionLength > 0){
			    		AlinousPlayer.funcs.doPlay();
			    	}
			    	else{
			    		playWindow.alert("finished");
			    		playWindow.close();
			    	}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					alert("errorThrown!! " + errorThrown);
				}
			});
		};
		
		return {
			firstPlay: firstPlay,
			doPlay : doPlay,
			fetchEvents : fetchEvents
		};
	}	
};
