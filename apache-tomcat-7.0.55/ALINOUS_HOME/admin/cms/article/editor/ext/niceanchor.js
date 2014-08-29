
/* START CONFIG */
var nicAnchorOptions = {
    buttons : {
        'anchor' : {name : __('Insert row into the Table'), type : 'nicAnchorButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'anchor' : '/admin/cms/article/editor/ext/anchor.png'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicAnchorButton = nicEditorAdvancedButton.extend({ 
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
		this.ln = this.ne.selectedInstance.selElm().parentTag('A');

		if(this.ln){
			this.addForm({
				'' : {type : 'title', txt : 'Add/Edit Link'},
				'name' : {type : 'text', txt : 'name', value : '', style : {width: '240px'}},
				'handle' : {type : 'select', txt : 'Delete', options : {'update' : 'Update Name', 'delete' : 'Delete'},style : {width : '240px'}}
			}, this.ln);
		}
		else{
			this.addForm({
				'' : {type : 'title', txt : 'Add/Edit Link'},
				'name' : {type : 'text', txt : 'name', value : '', style : {width: '240px'}}
			}, this.ln);
		}
		
	},
	
	
	submit : function() {
		
		this.removePane();
		
		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
			this.ln.setAttributes({
				name : this.inputs['name'].value
			});
			this.ln.removeAttribute("href");
			this.ln.removeAttribute("_moz_dirty");
			this.ln.addClass("anchor");
		}
		else if(this.ln) {
			var handle = this.inputs['handle'].value;
			if(handle == "delete"){
				for(var i=0;i<this.ln.childNodes.length;i++) {
					var curNode = this.ln.childNodes[i];
					
					var clone = $BK(curNode.cloneNode());
					clone.appendBefore(this.ln);
				}
				this.ln.remove();
				
				return;
			}
			
			
			this.ln.setAttributes({
				name : this.inputs['name'].value
			});
		}
	
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
		
		var sel = t.parentTag('A');
		if(!sel){
			this.deactivate();
			return;
		}
		if(!sel.hasAttribute("name")){
			this.deactivate();
			return;
		}
		
		this.activate();
	}
});
nicEditors.registerPlugin(nicPlugin, nicAnchorOptions);


