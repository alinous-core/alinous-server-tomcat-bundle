/* START CONFIG */
var nicObjectsOptions = {
    buttons : {
        'objects' : {name : __('Insert or edit Object'), type : 'nicObjectsButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'objects' : '/admin/cms/article/editor/ext/page_video.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicObjectsButton = nicEditorButton.extend({
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
				this.pane = new nicEditorPane(this.contain,this.ne,{width : '600px', backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},
	
	addPane : function() {
		this.inputs = {};
		
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		
		
		var contain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(this.form);
		new bkElement('div').setContent("External Object tag").setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(contain);
		
		this.sel = this.findParentObjTab(this.ne.selectedInstance.selElm());
		var val = '';
		if(this.sel != null){
			val = editorHtmlEncoder.decodeElement2Html(this.sel);
		}
		
		this.addTextAreaForm("objcode", val, {width : '100%', height: '200px'}, contain);
		
		
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;
	},
	
	addTextAreaForm : function (itm, val, style, contain)
	{
		this.inputs[itm] = new bkElement('textarea').setAttributes({'id' : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left'})
					.setStyle(style).appendTo(contain);
		this.inputs[itm].value = val;
	},
	
	submit : function() {
		var htmltxt = this.inputs['objcode'].value;
		if(htmltxt == ''){
			return;
		}
		
		this.removePane();
		
		var tmpdiv = new bkElement('div');
		tmpdiv.innerHTML = htmltxt;
		
		var newNode = $BK(tmpdiv.childNodes[0]);
		
		var selelm = this.ne.selectedInstance.selElm();
		
		// insert
		var tmp = this.placeholder;
				
		this.ne.selectedInstance.nicCommand("insertImage", tmp);
		var markImg = this.findElm('IMG','src', tmp);
		
		newNode.appendBefore(markImg);
		markImg.remove();
		
		
		editorHtmlEncoder.convertEditorAvailable(this.ne.selectedInstance.getElm());
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
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

	selected : function(ins,t) {
		if(typeof t == 'function') { t = this.ne.selectedInstance.selElm(); }
				
		var tag = this.findParentObjTab(t);
		if(tag == null){
			this.deactivate();
			
			return;
		}
		
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		//range.surroundContents(tag);
		this.activate();
		
		// console.log("select ed");
	},
	
	findParentObjTab : function (elm)
	{
		var imgelm = this.findParentElmByTag(elm, "img");
		
		if(!(imgelm != null && imgelm.hasClass("componentImg"))){
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
});
nicEditors.registerPlugin(nicPlugin, nicObjectsOptions);

var editorHtmlEncoder = {
	alterImage : '/admin/cms/article/editor/ext/bgblank.gif',
	alterBg : '/admin/cms/article/editor/ext/page_video.gif',
	
	convertEditorAvailable : function (elm)
	{
		editorHtmlEncoder.convertTag(elm, "object");
		editorHtmlEncoder.convertTag(elm, "iframe");
	},
	
	convertTag : function(elm, tagName)
	{
		var list = elm.getElementsByTagName(tagName);
		for(var i=0;i<list.length;i++) {
			var objtag = $BK(list[i]);
			
			var innerHTML = encodeURIComponent(objtag.innerHTML);
			var attributesstr = encodeURIComponent(editorHtmlEncoder.attribute2String(objtag));
			
			var defWidth = objtag.getAttribute("width") | "";
			var defHeight = objtag.getAttribute("height") | "";
			
			var altImg = new bkElement('img');
			altImg.setAttributes({'width' : defWidth,
					'height': defHeight, src: editorHtmlEncoder.alterImage,
					"nice-inner": innerHTML, "nice-attr" : attributesstr})
				.setStyle({border : '1px solid #ccc', margin : '0', 'clear' : 'both'
					, 'background-image': 'url("' + editorHtmlEncoder.alterBg + '")', 'background-repeat': 'no-repeat'
					, 'background-position': 'center center'})
				.addClass("componentImg");
			
			altImg.setAttribute("nice-tag", tagName);
			altImg.setAttribute("nice-inner", innerHTML);
			altImg.setAttribute("nice-attr", attributesstr);
			
			altImg.appendBefore(objtag)
			objtag.remove();
		}
		
		list = elm.getElementsByTagName("a");
		for(var i=0;i<list.length;i++) {
			var objtag = $BK(list[i]);
			if(objtag.hasAttribute("name")){
				objtag.addClass("anchor");
			}
		}
		
	},
	
	decode : function (elm)
	{
		var list = elm.getElementsByTagName("img");
		for(var i=0;i<list.length;i++) {
			var objtag = $BK(list[i]);
			
			if(!objtag.hasClass("componentImg")){
				continue;
			}
			var tagName = objtag.getAttribute("nice-tag");
			var innerHTML = objtag.getAttribute("nice-inner");
			var attributesstr = objtag.getAttribute("nice-attr");
			
			var orgWidth = objtag.getAttribute("width");
			var orgHeight = objtag.getAttribute("height");
			
			var orgTag = new bkElement(tagName);
			
			var jsobj = eval("("+ decodeURIComponent(attributesstr) +")");
			orgTag.setAttributes(jsobj);
			orgTag.setAttributes({'width' : orgWidth,
					'height': orgHeight});
			
			orgTag.innerHTML = decodeURIComponent(innerHTML);
			
			orgTag.appendBefore(objtag);
			
			objtag.remove();
		}
		
	},	
	
	decodeElement2Html : function (objtag)
	{
		var tagName = objtag.getAttribute("nice-tag");
		var innerHTML = objtag.getAttribute("nice-inner");
		var attributesstr = objtag.getAttribute("nice-attr");
		
		var htmlStr = '<';
		
		htmlStr += tagName;
		htmlStr += ' ';
		
		var jsobj = eval("("+ decodeURIComponent(attributesstr) +")");
		for( var propertyName in jsobj )
		{
	        var propertyValue = jsobj[ propertyName ];
	        
	        htmlStr += propertyName;
	        htmlStr += '="';
	        htmlStr += propertyValue;
	        htmlStr += '" ';
	    }
	    
	    htmlStr += '>';
	    
	    htmlStr += decodeURIComponent(innerHTML);
	    
		htmlStr += '</';
		
		htmlStr += tagName;
		htmlStr += '>';
		
		return htmlStr;
	},
	
	attribute2String : function (elm)
	{
		var str = "{";
		for(var i=0; i < elm.attributes.length; i++) {
			var name = elm.attributes[i].name;
			var value = elm.attributes[i].value;
			
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

