
var AlinousHmViewer = {
	hm_master_id: 0,
	playWindow: null,
	show : function(hm_master_id){
	
		var getBrowserHeight = function () {
			if(window.innerHeight){
				return window.innerHeight;
			}else if(document.documentElement && document.documentElement.clientHeight != 0 ){
				return document.documentElement.clientHeight;
			}else if (document.body){
				return document.body.clientHeight;
			}		
			return 0;
		};
		
		var getBrowserWidth = function () {
			if(window.innerWidth ){
				return window.innerWidth ;
			}else if(document.documentElement && document.documentElement.clientWidth  != 0 ){
				return document.documentElement.clientWidth ;
			}else if (document.body){
				return document.body.clientWidth ;
			}		
			return 0;
		};
		
	
		var data = {hm_master_id: hm_master_id};
		
		$.ajax({
			type: "GET",
			url: "/admin/access/heatmap/viewerModel.alns",
			dataType: "json",
			data: data,
			processData: true,
			success: function(json)
			{
		    	var val = json[0];
			    
			    var winWidth = getBrowserWidth();
			    
		    	val.window_width = val.imageWidth;
		    	val.window_height = getBrowserHeight();;
		    	
		    	if(val.window_width > winWidth){
		    		val.window_width = winWidth;
		    	}
		    	
		    	
		    	var popUrl = "/admin/access/archiver/api/dl.alns?ar=" + val.archive_page_id;
		    	var options = "toolbar=no,location=no," +
		    		"status=no,menubar=no,scrollbars=yes," +
		    		"width=" + val.window_width +",height=" + val.window_height;
		    	
		    	playerWin = window.open(popUrl, "player", options);
				
				AlinousHmViewer.hm_master_id = hm_master_id;
				AlinousHmViewer.playWindow = playerWin;
				if(playerWin.document.addEventListener){
					playerWin.addEventListener('load', AlinousHmViewer.addHeatmap, false);
				}else{
					playerWin.attachEvent("onload", AlinousHmViewer.addHeatmap);
				}
				
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert("errorThrown!! " + errorThrown);
			}
		});
	},
	addHeatmap : function(){
		heatDiv = AlinousHmViewer.playWindow.document.createElement("div");
		heatDiv.setAttribute("id", "alinous_mouse");
		heatDiv.style.position = "absolute";
		heatDiv.style.top = 0 + 'px';
		heatDiv.style.left = 0 + 'px';
		
		// /admin/access/heatmap/testmap.png
		heatDiv.innerHTML = '<img src="/admin/access/heatmap/dlheatmap.alns?hm_master_id=' + AlinousHmViewer.hm_master_id + '">';
					
		AlinousHmViewer.playWindow.document.body.appendChild(heatDiv);
	}
};