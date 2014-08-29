


var niceditor = null;
function activateNicedit()
{
	if($("#page-content").size() != 1){
		return;
	}
	if(niceditor != null){
		return;
	}
	
	var winHeight = document.body.clientHeight - 176;
	// alert(winHeight);
	
	var cms_page_id = $("#nicedit_cms_page_id").val();
	
	niceditor = new nicEditor({
		buttonList : ['fontSize', 'fontFormat',
			'bold','italic','underline','left','center', 'right', 'justify', 'ol', 'ul',
			'superscript', 'strikethrough','removeformat', 'indent', 'outdent', 'hr',
			'forecolor','bgcolor','link', 'anchor', 'unlink', 
			'xhtml',
			 'NewTable', 'EdiTableTag', 'RemoveTable','InsertRow',
			 'alinousImage', 'image', 'objects', 'alinousInner' ],
			iconsPath : '/jquery/nicedit/nicEditorIcons.gif',
			maxHeight : winHeight,
			cms_page_id: cms_page_id
		}	
	).panelInstance('page-content');
	
	
	var scroll = $.cookie("cms-nicedit-scroll" + document.frm.nicedit_cms_page_id.value);
	
	document.getElementsByClassName("nicEdit-main")[0].parentNode.scrollTop = scroll;
	
}
function removeNicedit()
{
	if(niceditor){
		niceditor.removeInstance('page-content');
		niceditor = null;
	}
}

function addResourceGroup()
{
	var url = "/admin/cms/article/editor/resource/newGroup.html";
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
		},
		dataType: 'html',
		success: function(data) {
			$('#dialog').html(data);
			$( "#dialog" ).dialog( "open" );
		},
		error:function() {
			alert('Error occur');
		}
	});
}

function newSiteSetting(form)
{
	if(form.site_domain.value == ""){
		alert("Input Domain Name.");
		return;
	}
	
	form.cmd.value = "site.newDomain";
	form.submit();
}

function removeSiteSetting(form, site_domain)
{
	form.site_domain.value = site_domain;
	form.cmd.value = "site.removeDomain";
	form.submit();
}

function saveByCmd(cmd)
{
	activateNicedit();
	var content = niceditor.nicInstances[0].getContent();
	$("#page-content").val(content);
	
	var scroll = document.getElementsByClassName("nicEdit-main")[0].parentNode.scrollTop;
	$.cookie("cms-nicedit-scroll" + document.frm.nicedit_cms_page_id.value, scroll , {expires: 7});

	if(cmd == "publish"){
		publishContext();
		return;
	}
	
	document.frm.cmd.value = cmd;
	document.frm.submit();
}

function publishContext()
{
	var url = "/admin/cms/article/dialog/publishContext.html";
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
		},
		dataType: 'html',
		success: function(data) {
			$('#dialog').html(data);
			$( "#dialog" ).dialog( "open" );
		},
		error:function() {
			alert('Error occur');
		}
	});
}

function siteTemplateChange(form)
{
	var val = form.template_use.value;
		
	if(val == 1){
		form.use_context.disabled = false;
	}else{
		form.use_context.disabled = true;
	}
}

function previewPage(form)
{
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
	
	var winWidth = getBrowserWidth();
	var winHeight = getBrowserHeight();
	
	var w = ( screen.width - winWidth ) / 2;
	var h = ( screen.height - winHeight ) / 2;
	
	var templatePath = "/admin/cms/article/preview/index.html";
	var previewPath = templatePath + "?selectedNodeId=" + form.selectedNodeId.value;
	
	myWin = window.open(previewPath, "preview",
	            "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
	           	+",left="+w+",top="+h);
	
	myWin.focus();
}

function addTag(form)
{
	var url = "/admin/cms/article/dialog/selectTags.html";
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
			selectedNodeId: form.selectedNodeId.value
		},
		dataType: 'html',
		success: function(data) {
			$('#dialog').html(data);
			$( "#dialog" ).dialog( "open" );
		},
		error:function() {
			alert('Error occur');
		}
	});
}

function removeTag(form, cms_tag_id)
{
	form.cmd.value = "removeTag";
	form.cms_tag_id.value = cms_tag_id;
	form.submit();
}
