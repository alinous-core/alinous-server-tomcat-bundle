
var AlinousJsTools = {
	loggerUrl : "/api/ac.alns",
	
	debugMode : false,
	firstSpan : 2000,
	defaultSpan : 3000,
	eventSendOnce : 32,
	mouseMoveSense : 20,
	milliseconds : 600000,
	
	startTime : new Date().getTime(),
	alinousLogToolsInit : function(document)
	{
		var funcs = this.getClosureFunc("fireClicked");
		
		if(document.addEventListener){
			document.addEventListener('click', funcs.fireClicked, false);
			document.addEventListener('scroll', funcs.fireScrolled, false);
			document.addEventListener('mousemove', funcs.fireMouseMoved, false);
			window.addEventListener('load', funcs.initAccessCode, false);
			window.addEventListener('beforeunload', funcs.fireUnload, false);
			window.addEventListener('resize', funcs.fireOnResize, false);
		}else if(document.attachEvent){
			document.attachEvent("click", funcs.fireClicked);
			document.attachEvent("scroll", funcs.fireScrolled);
			document.attachEvent("mousemove", funcs.fireMouseMoved);
			window.attachEvent("onload", funcs.initAccessCode);
			window.attachEvent("onbeforeunload", funcs.fireUnload);
			window.attachEvent("onresize", funcs.fireOnResize);
		}
		
		// setup timer
		setTimeout(funcs.fireReport, AlinousJsTools.firstSpan);
	},
	
	getClosureFunc : function()
	{
		var clickBuffers = new Array();
		clickBuffers[0] = new Array(); clickBuffers[1] = new Array();
		var clickBufferIdx = 0;
		var scrollBuffers = new Array();
		scrollBuffers[0] = new Array(); scrollBuffers[1] = new Array();
		var scrollBufferIdx = 0;
		var mmvBuffers = new Array();
		mmvBuffers[0] = new Array(); mmvBuffers[1] = new Array();
		var mmvBufferIdx = 0;
		var windowSizeBuffers = new Array();
		windowSizeBuffers[0] = new Array(); windowSizeBuffers[1] = new Array();
		var windowSizeBufferIdx = 0;
		
		var lastMousePosition = null;
				
		var initAccessCode = function ()
		{
			var cookies = getCookies(document);
			var accessserial = "";
			if(cookies != null && cookies.alinous_access_log){
				accessserial = cookies.alinous_access_log;
			}
			
			var documetWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
			var documetHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			
			var windowWidth = getBrowserWidth();
			var windowHeight = getBrowserHeight();
			
			var url = encodeURIComponent(location.href);
			
			var userAgent = window.navigator.userAgent;
			var referrer = "";
			if(document.referrer){
				referrer = document.referrer;
			}
			if(window.location.search.length > 0){
				var query = window.location.search.substring(1);
				var parameters = query.split( '&' );
				
				for( var i = 0; i < parameters.length; i++ ){
					var element = parameters[ i ].split( '=' );
					if(element[0] == "referrer"){
						// alert(element[1]);
						referrer = element[1];
					}
				}
			}
						
			var lang = "";
			if(navigator.language){
				lang = encodeURIComponent(navigator.language);
			}
			
			var useragent = "";
			if(navigator.userAgent){
				useragent = encodeURIComponent(navigator.userAgent);
			}
			
			var platform = "";
			if(navigator.platform){
				platform = encodeURIComponent(navigator.platform);
			}
			
			var params = 'cmd=init&accessserial=' + accessserial
						+ '&referrer=' + referrer
						+ '&windowWidth=' + windowWidth
						+ '&windowHeight=' + windowHeight
						+ '&documetWidth=' + documetWidth
						+ '&documetHeight=' + documetHeight
						+ '&url=' + url
						+ '&lang=' + lang
						+ '&useragent=' + useragent
						+ '&platform=' + platform;
			
			jsnp(params);
		};

		var getBrowserWidth = function () {
			if(window.innerWidth){
				return window.innerWidth;
			}else if(document.documentElement && document.documentElement.clientWidth != 0 ){
				return document.documentElement.clientWidth;
			}else if (document.body){
				return document.body.clientWidth;
			}		
			return 0;
		};
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
		
		var getCookies = function (document)
		{
			var result = {};
			
			var cookieString = document.cookie;
			if(cookieString == '' || cookieString == undefined){
				return null;
			}
			
			var cookiesArray = cookieString.split('; ');
			for(var i = 0; i < cookiesArray.length; i++){
				var cookie = cookiesArray[ i ].split('=');
				result[cookie[0]] = decodeURIComponent( cookie[ 1 ] );
			}
			
			return result;
		};
		
		var fireClicked = function(event)
		{
			var scrollTop =
				document.documentElement.scrollTop || // IE、Firefox、Opera
				document.body.scrollTop;              // Chrome、Safari
			var scrollLeft = 
				document.documentElement.scrollLeft || // IE、Firefox、Opera
				document.body.scrollLeft;              // Chrome、Safari
			
			var x = event.clientX + scrollLeft;
			var y = event.clientY + scrollTop;
			if(AlinousJsTools.debugMode == true){
				console.log("fireClicked : " +  x + ", " + y);
			}
			
			var currentTime = new Date().getTime();
			var diffTime = currentTime - AlinousJsTools.startTime;
			
			var record = {
				x : x,
				y : y,
				diffTime : diffTime				
			};
			
			if(diffTime < AlinousJsTools.milliseconds){
				clickBuffers[clickBufferIdx].push(record);			
				
				flushClickEvents();
				flushScrollEvents();
				flushMouseMoveEvents();
				flushResizeEvents();
				
				// alert("flushed");
			}
		};
	 	
	 	var fireScrolled = function(event)
		{
			var scrollTop =
				document.documentElement.scrollTop || // IE、Firefox、Opera
				document.body.scrollTop;              // Chrome、Safari
				
			var scrollLeft = 
				document.documentElement.scrollLeft || // IE、Firefox、Opera
				document.body.scrollLeft;              // Chrome、Safari
			if(AlinousJsTools.debugMode){
				console.log("fireScrolled : " + scrollLeft + ", " + scrollTop);
			}
			
			var currentTime = new Date().getTime();
			var diffTime = currentTime - AlinousJsTools.startTime;
			
			var record = {
				x : scrollLeft,
				y : scrollTop,
				diffTime : diffTime
			};
			
			if(diffTime < AlinousJsTools.milliseconds){
				scrollBuffers[scrollBufferIdx].push(record);
			}		
		}
		
		var fireMouseMoved = function(event)
		{
			var scrollTop =
				document.documentElement.scrollTop || // IE、Firefox、Opera
				document.body.scrollTop;              // Chrome、Safari
				
			var scrollLeft = 
				document.documentElement.scrollLeft || // IE、Firefox、Opera
				document.body.scrollLeft;              // Chrome、Safari
			var x = event.clientX + scrollLeft;
			var y = event.clientY + scrollTop;
			if(AlinousJsTools.debugMode){
				console.log("fireMouseMoved : " + x + ", " + y);
			}
			
			if(lastMousePosition != null){
				distance = (lastMousePosition.x - x)*(lastMousePosition.x - x)
							 + (lastMousePosition.y - y)*(lastMousePosition.y - y);
				senseLimit = AlinousJsTools.mouseMoveSense * AlinousJsTools.mouseMoveSense;
				
				if(senseLimit > distance){
					return;
				}
			}
			
			var currentTime = new Date().getTime();
			var diffTime = currentTime - AlinousJsTools.startTime;
			
			var record = {
				x : x,
				y : y,
				diffTime : diffTime
			};
			
			lastMousePosition = record;
			
			if(diffTime < AlinousJsTools.milliseconds){
				mmvBuffers[mmvBufferIdx].push(record);
			}
		}
		
		var fireOnResize = function()
		{
			var windowWidth = getBrowserWidth();
			var windowHeight = getBrowserHeight();
			
			var currentTime = new Date().getTime();
			var diffTime = currentTime - AlinousJsTools.startTime;
			
			var record = {
				x : windowWidth,
				y : windowHeight,
				diffTime : diffTime
			};
			
			if(diffTime < AlinousJsTools.milliseconds){
				windowSizeBuffers[windowSizeBufferIdx].push(record);
			}
		}
		
		var fireReport = function()
		{
			if(AlinousJsTools.debugMode){
				console.log("fireReport !! ");
			}
			
			var currentTime = new Date().getTime();
			var diffTime = currentTime - AlinousJsTools.startTime;
			if(diffTime < AlinousJsTools.milliseconds){
				flushClickEvents();
				flushScrollEvents();
				flushMouseMoveEvents();
				flushResizeEvents();
				
				setTimeout(fireReport, AlinousJsTools.defaultSpan);
			}

		};
		
		var flushResizeEvents = function()
		{
			// report window size changed
			var lastWindowSizeBufferIdx = windowSizeBufferIdx;
			if(windowSizeBufferIdx === 0){
				windowSizeBufferIdx = 1;
			}else{
				windowSizeBufferIdx = 0;
			}
			
			var currentWindowSizeBuffers = windowSizeBuffers[lastWindowSizeBufferIdx];
			var tmp = new Array();
			var cnt = 0;
			for(var i = 0; i < currentWindowSizeBuffers.length; i++){
				var str = currentWindowSizeBuffers[i].x + ","
						 + currentWindowSizeBuffers[i].y + ","
						 + currentWindowSizeBuffers[i].diffTime;
				tmp.push(str);
				cnt++;
				
				if(cnt == AlinousJsTools.eventSendOnce){
					sendEvents("sendWindowResized", tmp);
					cnt = 0;
					tmp.length = 0;
				}
			}
			sendEvents("sendWindowResized", tmp);
			
			currentWindowSizeBuffers.length = 0;
		}
		
		var flushMouseMoveEvents = function()
		{
			// report mouse moved
			var lastMmvBufferIdx = mmvBufferIdx;
			if(mmvBufferIdx === 0){
				mmvBufferIdx = 1;
			}else{
				mmvBufferIdx = 0;
			}
			
			var currentMmvBuffers = mmvBuffers[lastMmvBufferIdx];
			var tmp = new Array();
			var cnt = 0;
			for(var i = 0; i < currentMmvBuffers.length; i++){
				var str = currentMmvBuffers[i].x + "," + currentMmvBuffers[i].y + "," + currentMmvBuffers[i].diffTime;
				tmp.push(str);
				cnt++;
				
				if(cnt == AlinousJsTools.eventSendOnce){
					sendEvents("sendMouseMoved", tmp);
					cnt = 0;
					tmp.length = 0;
				}
			}
			sendEvents("sendMouseMoved", tmp);
			
			currentMmvBuffers.length = 0;
		}
		
		var flushScrollEvents = function()
		{
			// report scrolled
			var lastScrollBufferIdx = scrollBufferIdx;
			if(scrollBufferIdx === 0){
				scrollBufferIdx = 1;
			}else{
				scrollBufferIdx = 0;
			}
			
			var currentScrollBuffers = scrollBuffers[lastScrollBufferIdx];
			var tmp = new Array();
			var cnt = 0;
			for(var i = 0; i < currentScrollBuffers.length; i++){
				var str = currentScrollBuffers[i].x + "," + currentScrollBuffers[i].y + "," + currentScrollBuffers[i].diffTime;
				tmp.push(str);
				cnt++;
				
				if(cnt == AlinousJsTools.eventSendOnce){
					sendEvents("sendScrolled", tmp);
					cnt = 0;
					tmp.length = 0;
				}
			}
			sendEvents("sendScrolled", tmp);
			
			currentScrollBuffers.length = 0;
		}
		
		var flushClickEvents = function()
		{
			// report clicked
			var lastClickBufferIdx = clickBufferIdx;
			if(clickBufferIdx === 0){
				clickBufferIdx = 1;
			}else{
				clickBufferIdx = 0;
			}
			
			var currentClickBuffers = clickBuffers[lastClickBufferIdx];
			
			var tmp = new Array();
			var cnt = 0;
			for(var i = 0; i < currentClickBuffers.length; i++){
				var str = currentClickBuffers[i].x + "," + currentClickBuffers[i].y + "," + currentClickBuffers[i].diffTime;
				tmp.push(str);
				cnt++;
				
				if(cnt == AlinousJsTools.eventSendOnce){
					sendEvents("sendClicked", tmp);
					cnt = 0;
					tmp.length = 0;
				}
			}
			sendEvents("sendClicked", tmp);
			
			currentClickBuffers.length = 0;
		}
		
		var fireUnload = function()
		{
			
		}
		
		var sendEvents = function(cmd, events)
		{
			if(events.length == 0){
				return;
			}
			
			var cookies = getCookies(document);
			var accessserial = "";
			if(cookies.alinous_access_log){
				accessserial = encodeURIComponent(cookies.alinous_access_log);
			}
			
			var httpArgument = "cmd=" + cmd + "&accessserial=" + accessserial + "&ev=" + events.join("+");
			jsnp(httpArgument);
		}
		
		var jsnp = function (httpArgument)
		{
			// if already exists, delete it
			var scripts = document.getElementsByTagName('script');
			for(var i = 0; i < scripts.length; i++){
				var sc = scripts[i];
				var srcUrl = sc.getAttribute("src");
				
				if(srcUrl != null && srcUrl.indexOf(AlinousJsTools.loggerUrl) === 0) {
					var parent = sc.parentNode;
					parent.removeChild(sc);
				}
			}
			
			// access
			var jnp = document.createElement('script');
			jnp.type = 'text/javascript';
			jnp.async = true;
			jnp.src = AlinousJsTools.loggerUrl + "?" + httpArgument;
			var s = document.getElementsByTagName('script')[0];
			
			s.parentNode.insertBefore(jnp, s);
		};
		
		return {
			initAccessCode: initAccessCode,
			fireClicked: fireClicked,
			fireScrolled: fireScrolled,
			fireMouseMoved: fireMouseMoved,
			fireOnResize: fireOnResize,
			fireReport: fireReport,
			fireUnload: fireUnload,
			jsnp: jsnp
		};
	}
}

AlinousJsTools.alinousLogToolsInit(document);

