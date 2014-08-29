
function saveScrollEditor(cm, id)
{
	var scinfo = cm.getScrollInfo();
	
	// store scroll
	var cookieName = "alinouseditor-primitive-" + id + document.frm.selectedNodeId.value;
	
	$.cookie(cookieName, scinfo.top , {expires: 7});
}

function restoreScrollEditor(id)
{
	var cookieName = "alinouseditor-primitive-" + id + document.frm.selectedNodeId.value;
	var scroll = $.cookie(cookieName);
	
	var str = id + ".scrollTo(null, " + scroll + ")";
	//alert(str);
	
	setTimeout(str, 100);
}

