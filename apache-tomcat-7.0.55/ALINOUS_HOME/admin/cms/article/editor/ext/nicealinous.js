/* START CONFIG */
var nicAlinousInnerManageOptions = {
    buttons : {
        'alinousInner' : {name : __('Upload Image'), type : 'alinousInnerButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'alinousInner' : '/admin/cms/article/editor/ext/alinous.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var alinousInnerButton = nicEditorButton.extend({
	formUrl : '/admin/cms/article/editor/alinous/index.html',
	placeholder : "/admin/cms/article/editor/ext/nictempblank.gif",
	init : function() {
		this.ne.addEvent('selected', this.selected.closure(this));
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},
	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : '800px', backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},
	
	addPane : function() {
		var url = this.formUrl;
		var callback = this.createFormAjax.closure(this);
		
		this.forms = [];
		this.sel = this.findParentObjTag(this.ne.selectedInstance.selElm());
		
		var inner = '';
		var tagId = '';
		if(this.sel != null){
			var attributesstr = this.sel.getAttribute("nice-attr");
			var jsobj = eval("("+ decodeURIComponent(attributesstr) +")");
			for (var i in jsobj) {
				if(!i){
					continue;
				}
				
				var name = decodeURIComponent(i);
				if(name == "alns:inner"){
					inner = jsobj[i];
				}else if(name == "alns:tagid"){
					tagId = jsobj[i];
				}				
			}
		}
		
		$.ajax({
			type: 'POST',
			url: url,
			data: {inner:inner,  tagId:tagId},
			dataType: 'html',
			success: callback,
			error:function() {
				alert('Error occur');
			}
		});
	},
	
	createFormAjax : function(data)
	{
		var tmpdiv = new bkElement('div');
		tmpdiv.innerHTML = data;
		
		for(var i = 0; i < this.forms.length; i++){
			this.forms[i].remove();
		}
		this.forms = [];
		
		// add form
		var list = tmpdiv.getElementsByTagName("form");
		for(var i = 0; i < list.length; i++){
			var bkForm = $BK(list[i]);
			
			// register event
			var fid = bkForm.getAttribute("id");
			if(fid == "newAlinousInner"){
				bkForm.addEvent('submit',this.submitNewAlinousInner.closureListener(this));
				this.form = bkForm;
			}
			if(fid == "editAlinousInner"){
				bkForm.addEvent('submit',this.submitEditAlinousInner.closureListener(this));
				this.form = bkForm;
			}
			
			bkForm.onsubmit = bkLib.cancelEvent;
			this.forms.push(bkForm);
		}
		
		for(var i = 0; i < this.forms.length; i++){
			 this.pane.append(this.forms[i]);
		}
	},

	submitEditAlinousInner : function() {
		var currentform = this.form;
		
		var path = currentform['path'].value;
		var paramscsv = currentform['params'].value;
		var params = paramscsv.split(',');
		
		var paramUrl = "node_id={$IN.node_id}&template_primitive_id={$IN.template_primitive_id}&page={$IN.page}&publish={$IN.publish}";
		for(var i = 0; i < params.length; i++){
			var inputName = "param_" + params[i];
			var val = currentform[inputName].value;
			
			paramUrl += '&';
			paramUrl += inputName.substring(6) + '=' + encodeURIComponent(val);
		}
		
		var inner = path + "?" + paramUrl;
		var tagId = encodeURIComponent(currentform['tagId'].value);
		
		var newNode = new bkElement('div');
		newNode.setAttribute("alns:inner", inner);
		newNode.setAttribute("alns:tagid", tagId);
		
		newNode.appendBefore(this.sel);
		this.sel.remove();
		
		editorAlinousEncoder.convertEditorAvailable(this.ne.selectedInstance.getElm());
		
		this.removePane();
	},
	
	submitNewAlinousInner : function() {
		var url = "/admin/cms/article/editor/alinous/params.alns";
		
		var template_id = this.form.template_id.value;
		var currentform = this.form;
		var cb = this.afterSubmitNewAlinousInner.closureListener(this);
		
		$.ajax({
			type: 'POST',
			url: url,
			data: {template_id: template_id},
			dataType: 'json',
			success: cb,
			error:function() {
				alert('Error occur');
			}
		});
		
	},
	
	afterSubmitNewAlinousInner : function(data) {
		
		var paramsStr = "node_id={$IN.node_id}&template_primitive_id={$IN.template_primitive_id}&page={$IN.page}&publish={$IN.publish}";
		for(var i = 0; i < data.params.length; i++){
			paramsStr += "&";
			paramsStr += data.params[i].name;
			paramsStr += "=";
		}
		
		var inner = data.path + "?" + paramsStr;
		var tagId = data.tagid;
		
		var newNode = new bkElement('div');
		newNode.setAttribute("alns:inner", inner);
		newNode.setAttribute("alns:tagid", tagId);
		
		var selelm = this.sel;
		
		var tmp = this.placeholder;
		this.ne.selectedInstance.nicCommand("insertImage", tmp);
		
		var markImg = this.findElm('IMG','src', tmp);
		
		newNode.appendBefore(markImg);
		markImg.remove();
		
		editorAlinousEncoder.convertEditorAvailable(this.ne.selectedInstance.getElm());
		
		// resubmit	
		this.removePane();
				
	},
	
	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
		
		return null;
	},
	
	findParentObjTag : function (elm)
	{
		var imgelm = this.findParentElmByTag(elm, "img");
		
		if(!(imgelm != null && imgelm.hasClass("alinousInnerImg"))){
			return null;
		}
		
		return imgelm;
	},
	
	findParentElmByTag : function(pareltElm, tag) {
		var elm = pareltElm;	
		do {
			if(elm.nodeName.toLowerCase() == tag) {
				elm = $BK(elm);
				return elm;
			}
		} while((elm = elm.parentNode) && elm.className != "nicEdit-main");
		
		return null;
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	},
	selected : function(ins,t) {
		if(typeof t == 'function') { t = this.ne.selectedInstance.selElm(); }
				
		var tag = this.findParentObjTag(t);
		if(tag == null){
			this.deactivate();
			
			return;
		}
		
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		//range.surroundContents(tag);
		this.activate();
	}
});
nicEditors.registerPlugin(nicPlugin, nicAlinousInnerManageOptions);

var editorAlinousEncoder = {
	alterImage : '/admin/cms/article/editor/ext/bgblank.gif',
	alterBg : '/admin/cms/article/editor/ext/alinous.gif',
	
	convertEditorAvailable : function (elm)
	{
		editorAlinousEncoder.convertTag(elm, "div");
	},
	
	convertTag : function(elm, tagName)
	{
		var removeList = [];
		
		var list = elm.getElementsByTagName(tagName);
		for(var i=0;i<list.length;i++) {
			var objtag = $BK(list[i]);
			
			var inner = objtag.getAttribute("alns:inner");
			if(!inner){
				continue
			}
			
			var innerHTML = encodeURIComponent(objtag.innerHTML);
			var attributesstr = encodeURIComponent(editorAlinousEncoder.attribute2String(objtag));
			
			var defWidth = objtag.getAttribute("width") | "400";
			var defHeight = objtag.getAttribute("height") | "100";
			
			var altImg = new bkElement('img');
			altImg.setAttributes({'width' : defWidth,
					'height': defHeight, src: editorAlinousEncoder.alterImage,
					"nice-inner": innerHTML, "nice-attr" : attributesstr})
				.setStyle({border : '1px solid #ccc', margin : '0', 'clear' : 'both'
					, 'background-image': 'url("' + editorAlinousEncoder.alterBg + '")', 'background-repeat': 'no-repeat'
					, 'background-position': 'center center'})
				.addClass("alinousInnerImg");
			
			altImg.setAttribute("nice-tag", tagName);
			altImg.setAttribute("nice-inner", innerHTML);
			altImg.setAttribute("nice-attr", attributesstr);
			
			altImg.appendBefore(objtag)
			removeList.push(objtag);
		}
		
		for(var i=0;i<removeList.length;i++) {
			removeList[i].remove();
		}
	},
	
	decode : function (elm)
	{
		var removeList = [];
		
		var list = elm.getElementsByTagName("img");
		for(var i=0;i<list.length;i++) {
			var objtag = $BK(list[i]);
			
			if(!objtag.hasClass("alinousInnerImg")){
				continue;
			}
			var tagName = objtag.getAttribute("nice-tag");
			var innerHTML = objtag.getAttribute("nice-inner");
			var attributesstr = objtag.getAttribute("nice-attr");
			
			var orgWidth = objtag.getAttribute("width");
			var orgHeight = objtag.getAttribute("height");
			
			var orgTag = new bkElement(tagName);
			
			var jsobj = eval("("+ decodeURIComponent(attributesstr) +")");
			for (var nm in jsobj) {
				var name = decodeURIComponent(nm);
				if(name){
					var value = decodeURIComponent(jsobj[nm]);
					value = value.split("&amp;").join("&");
					orgTag.setAttribute(name, value);
				}				
			}
			
			//orgTag.setAttributes(attrs);
			orgTag.setAttributes({'width' : orgWidth,
					'height': orgHeight});
			
			orgTag.innerHTML = decodeURIComponent(innerHTML);
			
			orgTag.appendBefore(objtag);
			
			removeList.push(objtag);
		}
		
		for(var i=0;i<removeList.length;i++) {
			removeList[i].remove();
		}
		
	},	
	
	attribute2String : function (elm)
	{
		var str = "{";
		for(var i=0; i < elm.attributes.length; i++) {
			var name = elm.attributes[i].name;
			var value = elm.getAttribute(name);//elm.attributes[i].value;
			
			if(i > 0){
				str += ",";
			}
			
			str += "\"" + name + "\": ";
			str += "\"" + value + "\"";
		}
		
		str += "}";
		
		return str;
	},
	
};
