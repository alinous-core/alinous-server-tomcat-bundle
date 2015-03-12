

/* START CONFIG */
var nicStyleSpanAddOptions = {
    buttons : {
        'styleSpanAdd' : {name : __('Span Tag'), type : 'nicStyleSpanAddButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'styleSpanAdd' : '/admin/cms/article/editor/ext/tag_blue_add.png'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicStyleSpanAddButton = nicEditorAdvancedButton.extend({ 
	init : function() {
		// this.ne.addEvent('selected', this.selected.closure(this));
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},
	
	mouseClick : function() {
		if(!this.isDisabled) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			
			var ln = this.findElm('A','href',tmp);
			
			var span = new bkElement('span').addClass("span");
			span.innerHTML = ln.innerHTML;
			
			span.appendBefore(ln);
			ln.remove();
		}
	},
	
	addPane : function() {
		
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
		
		
	}
});
nicEditors.registerPlugin(nicPlugin, nicStyleSpanAddOptions);


/* START CONFIG */
var nicStyleSpanOptions = {
    buttons : {
        'styleSpan' : {name : __('Span Tag'), type : 'nicStyleSpanButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'styleSpan' : '/admin/cms/article/editor/ext/tag_blue_edit.png'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicStyleSpanButton = nicEditorAdvancedButton.extend({ 
	init : function() {
		this.ne.addEvent('selected', this.selected.closure(this));
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},
	
	addPane : function() {
		var sel = t.parentTag('SPAN');
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
		
		var sel = t.parentTag('SPAN');
		if(!sel){
			this.isActive = false;
			this.isDisabled = true;
			this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
			this.updateState();
			
			return;
		}
		
		this.activate();
	}
});
nicEditors.registerPlugin(nicPlugin, nicStyleSpanOptions);
	