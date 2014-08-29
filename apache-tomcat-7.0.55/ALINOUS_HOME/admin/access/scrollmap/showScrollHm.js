
var AlinousScrollHmViewer = {
	hm_scroll_hm_id: 0,
	playWindow: null,
	show : function(hm_scroll_hm_id){
	
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
		
		var data = {hm_scroll_hm_id: hm_scroll_hm_id};
		
		$.ajax({
			type: "GET",
			url: "/admin/access/scrollmap/viewerModel.alns",
			dataType: "json",
			data: data,
			processData: true,
			success: function(json)
			{
				var val = json[0];
				
				var winWidth = getBrowserWidth();
				
				val.window_width = val.imageWidth;
		    	val.window_height = getBrowserHeight();
		    	
		    	if(val.window_width > winWidth){
		    		val.window_width = winWidth;
		    	}
		    	
		    	
		    	var popUrl = "/admin/access/archiver/api/dl.alns?ar=" + val.archive_page_id;
		    	
		    	var options = "toolbar=no,location=no," +
		    		"status=no,menubar=no,scrollbars=yes," +
		    		"width=" + val.window_width +",height=" + val.window_height;
		    	
		    	playerWin = window.open(popUrl, "player", options);
		    	
		    	AlinousScrollHmViewer.hm_scroll_hm_id = hm_scroll_hm_id;
				AlinousScrollHmViewer.playWindow = playerWin;
				
				if(playerWin.document.addEventListener){
					playerWin.addEventListener('load', AlinousScrollHmViewer.addHeatmap, false);
				}else{
					playerWin.attachEvent("onload", AlinousScrollHmViewer.addHeatmap);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert("errorThrown!! " + errorThrown);
			}
			
			
		 });
	},
	addHeatmap : function(){
		heatDiv = AlinousScrollHmViewer.playWindow.document.createElement("div");
		heatDiv.setAttribute("id", "alinous_mouse");
		heatDiv.style.position = "absolute";
		heatDiv.style.top = 0 + 'px';
		heatDiv.style.left = 0 + 'px';
		
		// /admin/access/heatmap/testmap.png
		heatDiv.innerHTML = '<img src="/admin/access/scrollmap/dlheatmap.alns?hm_scroll_hm_id=' + AlinousScrollHmViewer.hm_scroll_hm_id + '">';
								
		AlinousScrollHmViewer.playWindow.document.body.appendChild(heatDiv);
	}
}
