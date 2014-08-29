
var TreeTableWrapper = {
	tables : {},
	url : null,
	tableId : null,
	
	reloadTable : function (url, tableId){
		$.ajax({
			type: 'POST',
			url: url,
			data: { },
			dataType: 'json',
			success: function(data) {
				var arrays = data;
				
			},
			error:function() {
				alert('Error occur');
			}
		});
	},
	
	loadTable : function (url, tableId){
		TreeTableWrapper.url = url;
		TreeTableWrapper.tableId = tableId;
		
		TreeTableWrapper.clearTree(tableId);
		
		$.ajax({
			type: 'POST',
			url: url,
			data: { },
			dataType: 'json',
			success: function(data) {
				var arrays = data;
				
				var tbl = $("#" + TreeTableWrapper.tableId);
				
				for(var i = 0; i < arrays.length; i++){
					var trStr = '<tr';
					
					trStr += ' data-tt-id="';
					trStr += arrays[i].id;
					trStr += '"';
					
					if(arrays[i].parent != "" && arrays[i].parent != null){
						trStr += ' data-tt-parent-id="';
						trStr += arrays[i].parent;
						trStr += '"';
					}
					
					if(arrays[i].level != "" && arrays[i].level != null){
						trStr += ' level="';
						trStr += arrays[i].level;
						trStr += '"';
					}			
					
					trStr += '>';
					trStr += addTdTags(arrays[i].disp, arrays[i].parent, arrays[i].type, arrays[i].value);
					trStr += '<tr>';
					tbl.append(trStr);					
				}
				
				TreeTableWrapper.tables[TreeTableWrapper.tableId] = tbl.treetable({ expandable: true,
					onNodeExpand :function()
					{
						var level = this.level();
						var nodeId = this.id;
						var treeId = TreeTableWrapper.tableId;
						
						TreeTableWrapper.openNode(nodeId, level, treeId)
					},
					onNodeCollapse :function()
					{
						var level = this.level();
						var nodeId = this.id;
						var treeId = TreeTableWrapper.tableId;
						
						TreeTableWrapper.closeNode(nodeId, level, treeId)
					},
					onNodeInitialized : function()
					{
						var level = this.level();
						var nodeId = this.id;
						var treeId = TreeTableWrapper.tableId;
						
						TreeTableWrapper.initNode(this, nodeId, level, treeId);
					}					
				});				
			},
			error:function() {
				alert('Error occur');
			}
		});
		
		var addTdTags = function (path, parent, type, value)
		{
			var td = "<td>";
			
			if(type == "array"){
				td += '<img src="/admin/cms/debugger/img/common_tab.gif" />';
			}else{
				td += '<img src="/admin/cms/debugger/img/envvar_obj.gif" />';
			}
			
			td += path;
			td += "</td>";
			td += "<td>";
			td += checkValue(value);
			td += "</td>";
			
			return td;
		};
		
		var checkValue = function (value)
		{
			var len = value.length;
			if(len > 100){
				value = value.substring(0, 100);
			}
			
			value = value.replace(/</g, "&lt;");
			value = value.replace(/>/g, "&gt;");
			
			return value;
		};
		
	},
	
	initNode : function(thisNode, nodeId, level, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId + "-" + level;
		var cookieString = TreeTableWrapper.getCookieString(cookieName);
		
		var cookies = cookieString.split(',');
		
		for(var i = 0; i < cookies.length; i++){
			if(cookies[i] == nodeId){
				thisNode.expand();
				return;
			}
		}
		thisNode.collapse();
	},
	
	closeNode : function(nodeId, level, treeId)
	{
		TreeTableWrapper.removeCookie(nodeId, level, treeId);
	},

	openNode : function(nodeId, level, treeId)
	{
		TreeTableWrapper.addCookie(nodeId, level, treeId);
	},
	
	removeCookie : function(nodeId, level, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId + "-" + level;
		var cookieString = TreeTableWrapper.getCookieString(cookieName);
		
		cookieString = TreeTableWrapper.removeCookieFromString(cookieString, nodeId);
		
		document.cookie = cookieName + '=' + encodeURIComponent(cookieString);
	},
	
	addCookie : function(nodeId, level, treeId)
	{
		var cookieName = "jqtCookie" + "-" + treeId + "-" + level;
		var cookieString = TreeTableWrapper.getCookieString(cookieName);
		
		
		cookieString = TreeTableWrapper.removeCookieFromString(cookieString, nodeId);
		
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
	},
	clearTree : function (tableId)
	{
		var tbl = $("#" + TreeTableWrapper.tableId);
		
		var trs = $("tr", tbl);
		var jqTable = TreeTableWrapper.tables[TreeTableWrapper.tableId];
		
		for(var i = 1; i < trs.length; i++){
			var n = trs.eq(i);
			var id = n.attr('data-tt-id');
			
			if(id){
				var n = tbl.treetable("node", id);
				if(n){
					tbl.treetable("removeNode", id);
				}
			}
		}		
		
		tbl.treetable("destroy");
		
		return;
	}
};