
var JqTreeLazyState = {
	initNode : function(jqtree, nodeId, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId;
		var cookieString = JqTreeLazyState.getCookieString(cookieName);
		
		var cookies = cookieString.split(',');
		
		for(var i = 0; i < cookies.length; i++){
			if(cookies[i] == nodeId){
				var node = jqtree.tree('getNodeById', nodeId);
				jqtree.tree('openNode', node, false);
				
				JqTreeScroll.restore();
				
				return;
			}
		}
	},
	
	openNode : function(node, treeId)
	{
		var nodeId = node.id;
		
		JqTreeLazyState.addCookie(nodeId, treeId);
		
		//alert("Opened " + nodeId + "-" + level);
	},
	
	closeNode : function(node, treeId)
	{
		var nodeId = node.id;
		var level = node.getLevel();
		
		JqTreeLazyState.removeCookie(nodeId, treeId);
		
		//alert("Closed " + nodeId + "-" + level);
	},
	
	removeCookie : function(nodeId, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId;
		var cookieString = JqTreeLazyState.getCookieString(cookieName);
		
		cookieString = JqTreeLazyState.removeCookieFromString(cookieString, nodeId);
		
		document.cookie = cookieName + '=' + encodeURIComponent(cookieString);
	},
	
	addCookie : function(nodeId, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId;
		var cookieString = JqTreeLazyState.getCookieString(cookieName);
		
		
		cookieString = JqTreeLazyState.removeCookieFromString(cookieString, nodeId);
		
		if(cookieString == ""){
			cookieString = nodeId;
		}else{
			cookieString = cookieString + "," + nodeId;
		}
		
		
		document.cookie = cookieName + '=' + encodeURIComponent(cookieString);
	},
	
	removeCookieFromString : function(cookieString, nodeId)
	{
		var returnString = "";
		var cookies = cookieString.split(',');
		var i;
		for(i = 0; i < cookies.length; i++){
			if(cookies[i] == nodeId){
				continue;
			}
			
			if(returnString != ""){
				returnString = returnString + ",";
			}
			
			returnString = returnString + cookies[i];
		}
		
		return returnString;
	},
	
	getCookieString : function(cookieName)
	{
		var allcookies = document.cookie;
		var cookieStartStr = cookieName + "=";
		
		var position = allcookies.indexOf( cookieStartStr );
		if(position < 0){
			return "";
		}
		
		var startIndex = position + cookieStartStr.length;
		
		var endIndex = allcookies.indexOf( ';', startIndex );
		if(endIndex < 0){
			endIndex = allcookies.length;
		}
		
		var cookieValue = decodeURIComponent(allcookies.substring( startIndex, endIndex));
		
		return cookieValue;
	}
};


