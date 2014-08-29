
/* START CONFIG */
var nicAlinousImageManageOptions = {
    buttons : {
        'alinousImage' : {name : __('Upload Image'), type : 'alinousImageButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'alinousImage' : '/admin/cms/article/editor/ext/images.png'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var alinousImageButton = nicEditorButton.extend({
	formUrl : "/admin/cms/article/editor/nicedit-img/images.html",
	imgLoader : "/samples/nicedit-img/dl.alns?nice_image_id=",
	
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
		
		var cms_page_id = this.ne.options.cms_page_id;
		
		$.ajax({
			type: 'POST',
			url: url,
			data: {cms_page_id: cms_page_id},
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
		
		// clear all
		
		for(var i = 0; i < this.forms.length; i++){
			this.forms[i].remove();
		}
		this.forms = [];
		
		// add form
		var list = tmpdiv.getElementsByTagName("form");
		for(var i = 0; i < list.length; i++){
			var bkForm = $BK(list[i]);
			
			var fid = bkForm.getAttribute("id");
			if(fid == "nicUploadImgFrm"){
				bkForm.addEvent('submit',this.submitUpload.closureListener(this));
				
				this.nicUploadImgFrm = bkForm;
			}
			else if(fid == "nicImgFrm"){
				//bkForm.addEvent('submit',this.submit.closureListener(this));
				var imglist = bkForm.getElementsByTagName("img");
				
				for(var j = 0; j < imglist.length; j++){
					//imglist[j].addEventListener('click',this.submit.closureListener(this));
					bkLib.addEvent(imglist[j], 'click', this.submit.closureListener(this) );
				}
				
				var btnlist = tmpdiv.getElementsByTagName("button");
				for(var j = 0; j < btnlist.length; j++){
					if(btnlist[j].className == "delimgbtn"){
						bkLib.addEvent(btnlist[j], 'click', this.submitDelete.closureListener(this) );
					}
				}
		
				this.nicImgFrm = bkForm;
			}
			
			bkForm.onsubmit = bkLib.cancelEvent;
			this.forms.push(bkForm);
		}

		for(var i = 0; i < this.forms.length; i++){
			 this.pane.append(this.forms[i]);
		}
	},
	
	submitDelete : function() {
		var inputs = this.nicImgFrm.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++){
			if(inputs[i].getAttribute('name') == 'cms_resource_id'){
				inputs[i].value = arguments[1].id;
			}
			
			if(inputs[i].getAttribute('name') == 'cmd'){
				inputs[i].value = 'delete';
			}
		}
		
		var fd = new FormData(this.nicImgFrm);
		var url = this.formUrl;
		var callback = this.createFormAjax.closure(this);
		
		$.ajax({
			type: 'POST',
			url: url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: callback,
			error:function() {
				alert('Error occur');
			}
		});
	},
	
	submitUpload : function() {
		var fd = new FormData(this.nicUploadImgFrm);
		
		var url = this.formUrl;
		var callback = this.createFormAjax.closure(this);
		var btnObj = this;
		$.ajax({
			type: 'POST',
			url: url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: callback,
			error:function() {
				alert('Error occur');
			}
		});
	},
	
	submit : function(e) {
		var niceImgId = e.currentTarget.getAttribute('src');
		var title = e.currentTarget.getAttribute('title');
		
		this.removePane();
		
		this.ne.selectedInstance.nicCommand("insertImage", niceImgId);
		
		var markImg = this.findElm('IMG','src', niceImgId);
		markImg.setAttribute('alt', title);
		markImg.setAttribute('title', title);
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
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	},

	selected : function(ins,t) {
		
		// console.log("select ed");
	}
});
nicEditors.registerPlugin(nicPlugin, nicAlinousImageManageOptions);
