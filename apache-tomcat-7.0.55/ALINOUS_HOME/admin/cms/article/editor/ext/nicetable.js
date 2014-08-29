
/* START CONFIG */
var nicInsertRowOptions = {
    buttons : {
        'InsertRow' : {name : __('Insert row into the Table'), type : 'nicEditorInsertRowButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'InsertRow' : '/admin/cms/article/editor/ext/table_row_insert.png'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */
 
var nicEditorInsertRowButton = nicEditorButton.extend({ 
	init : function() {
		this.ne.addEvent('selected', this.selected.closure(this));
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},
	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.sel = this.ne.selectedInstance.saveRng();
				this.pane = new nicEditorPane(this.contain,this.ne,{width : '600px', backgroundColor : '#fff'},this);
				this.addPane();
				
			}
		}
	},
	addPane : function() {
		this.sel = this.ne.selectedInstance.getSel();
		
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		
		this.pane.append(this.form);
		
		this.inputs = {};
		var width = '200px';
		
		var inputid = "inserttag";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Add ").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);
		
		new bkElement('option').setAttributes({value : 'td', selected : 'true'}).setContent(' row with td tag').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : 'th', selected : ''}).setContent(' row with th tag').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : 'column', selected : ''}).setContent('new Column').appendTo(this.inputs[inputid]);
		
		inputid = "insertdir";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Direction").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);

		new bkElement('option').setAttributes({value : 'after', selected : 'true'}).setContent('Insert after selected column').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : 'before', selected : ''}).setContent('Insert before selected column').appendTo(this.inputs[inputid]);
		
		
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;	
	},
	
	submit : function() {
		this.removePane();
		
		var t = this.sel;
		var tagType = this.inputs['inserttag'].value;
		var direction = this.inputs['insertdir'].value;
		
		var tdelm = this.findParentElmByTag(t.anchorNode, "td");
		var thelm = this.findParentElmByTag(t.anchorNode, "th");
		
		var selRow = thelm;
		if(!selRow){
			selRow = tdelm;
		}
		
		// add column
		if(tagType == 'column'){
			var trelm = this.findParentElmByTag(t.anchorNode, "tr");
			var cellIndex = selRow.cellIndex;
			
			var parentCell = trelm.parentNode;
			for(var i = 0; i < parentCell.children.length; i++){
				var currentTr = parentCell.children[i];
				var currentCell = currentTr.children[cellIndex];
				var tagName = currentCell.tagName;
				
				
				var newTag = new bkElement(tagName).setContent('write here');
				if(direction == 'after'){
					currentTr.insertBefore(newTag, currentCell.nextSibling);
				}else{
					newTag.appendBefore(currentCell);
				}
			}
			
			return;
		}
		
		// add row
		var trTag = selRow.parentNode;
		
		var newTag = new bkElement('tr');
		var numtd = trTag.childElementCount;
		for(var i = 0; i < numtd; i++){
			new bkElement(tagType).setContent('write here').appendTo(newTag);
		}
		
		if(direction == 'after'){
			trTag.parentNode.insertBefore(newTag, trTag.nextSibling);
		}else{
			newTag.appendBefore(trTag);
		}
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	},

	findParentElmByTag : function(pareltElm, tag) {
		var elm = pareltElm;	
		do {
			if(!elm.nodeName){ continue; }
			if(elm.nodeName.toLowerCase() == tag) {
				elm = $BK(elm);
				return elm;
			}
		} while((elm = elm.parentNode) && elm.className != "nicEdit-main");
		
		return null;
	},
	
	selected : function(ins,t) {
		if(typeof t == 'function') { t = this.ne.selectedInstance.selElm(); }
		
		var tdelm = this.findParentElmByTag(t, "td");
		var thelm = this.findParentElmByTag(t, "th");
		
		if(tdelm || thelm){
			this.isActive = true;
			this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
			this.isDisabled = false;
			this.updateState();
			return;
		}
		
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.isActive = false;
		this.updateState();
	}
});
nicEditors.registerPlugin(nicPlugin, nicInsertRowOptions);

/* START CONFIG */
var nicNewTableOptions = {
    buttons : {
        'NewTable' : {name : __('New Table'), type : 'nicEditorNewTableButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'NewTable' : '/admin/cms/article/editor/ext/new.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */
 
var nicEditorNewTableButton = nicEditorButton.extend({ 
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
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		
		this.pane.append(this.form);
		
		this.inputs = {};
		var width = '200px';
		
		
		inputid = "header";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Header ").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);
		
		new bkElement('option').setAttributes({value : '0', selected : 'true'}).setContent('Table with no header row').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '1', selected : ''}).setContent('Table with a header row').appendTo(this.inputs[inputid]);
		
		inputid = "cols";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Cols ").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);
		
		new bkElement('option').setAttributes({value : '1', selected : 'true'}).setContent('1').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '2', selected : ''}).setContent('2').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '3', selected : ''}).setContent('3').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '4', selected : ''}).setContent('4').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '5', selected : ''}).setContent('5').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '6', selected : ''}).setContent('6').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '7', selected : ''}).setContent('7').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '8', selected : ''}).setContent('8').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '9', selected : ''}).setContent('9').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '10', selected : ''}).setContent('10').appendTo(this.inputs[inputid]);
		
		inputid = "rows";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Cols ").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);
		
		new bkElement('option').setAttributes({value : '1', selected : 'true'}).setContent('1').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '2', selected : ''}).setContent('2').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '3', selected : ''}).setContent('3').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '4', selected : ''}).setContent('4').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '5', selected : ''}).setContent('5').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '6', selected : ''}).setContent('6').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '7', selected : ''}).setContent('7').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '8', selected : ''}).setContent('8').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '9', selected : ''}).setContent('9').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : '10', selected : ''}).setContent('10').appendTo(this.inputs[inputid]);
				
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;	

	},
	
	submit : function() {
		this.removePane();
		
		// make table
		var tableTag = new bkElement('table');
		tableTag.setAttribute("border", "1");
		
		var rows = parseInt(this.inputs['rows'].value);
		var cols = parseInt(this.inputs['cols'].value);
		var header = parseInt(this.inputs['header'].value);
		if(header == 1){
			var newTr = new bkElement('tr').appendTo(tableTag);
			for(var j = 0; j < rows; j++){
				new bkElement('td').setContent("header-" + j).appendTo(newTr);
			}
		}
		
		for(var i = 0; i < rows; i++){
			var newTr = new bkElement('tr').appendTo(tableTag);
			for(var j = 0; j < rows; j++){
				new bkElement('td').setContent(i + "-" + j).appendTo(newTr);
			}
		}
		
		// insert
		var tmp = 'javascript:nicImTemp();';
		this.ne.nicCommand("insertImage",tmp);
		var im = this.findElm('IMG','src',tmp);
		
		tableTag.appendBefore(im);
		im.remove();		
	},
	
	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
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
		
	}
});
nicEditors.registerPlugin(nicPlugin, nicNewTableOptions);



/* START CONFIG */
var nicRemoveTableOptions = {
    buttons : {
        'RemoveTable' : {name : __('Remove Table, row or column'), type : 'nicEditorRemoveTableButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'RemoveTable' : '/admin/cms/article/editor/ext/table_delete.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */
 
var nicEditorRemoveTableButton = nicEditorButton.extend({ 
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
		this.sel = this.ne.selectedInstance.getSel();
		
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		
		this.inputs = {};
		var width = '200px';
		
		var inputid = "removeType";
		new bkElement('label').setAttributes({'for' : inputid}).setContent("Delete").setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(this.form);
		this.inputs[inputid] = new bkElement('select').setAttributes({id : inputid}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(this.form);
		
		new bkElement('option').setAttributes({value : 'row', selected : 'true'}).setContent('selected row').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : 'column', selected : ''}).setContent('selected column').appendTo(this.inputs[inputid]);
		new bkElement('option').setAttributes({value : 'table', selected : ''}).setContent('selected table').appendTo(this.inputs[inputid]);
		
		
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;	
		
		console.log("add pane");
	},
	
	submit : function() {
		this.removePane();
		
		var t = this.sel;
		var removeType = this.inputs['removeType'].value;
		
		
		var tdelm = this.findParentElmByTag(t.anchorNode, "td");
		var thelm = this.findParentElmByTag(t.anchorNode, "th");
		var trelm = this.findParentElmByTag(t.anchorNode, "tr");
		var tableelm = this.findParentElmByTag(t.anchorNode, "table");
		
		var selCell = thelm;
		if(!selCell){
			selCell = tdelm;
		}
		
		if(removeType == "row"){
			var parentCell = trelm.parentNode;
			selCell.parentNode.remove();
			
			if(parentCell.childElementCount == 0){
				tableelm.remove();
			}
		}
		else if(removeType == "column"){
			var cellIndex = selCell.cellIndex;
			
			var parentCell = trelm.parentNode;
			for(var i = 0; i < parentCell.children.length; i++){
				var currentTr = parentCell.children[i];
				
				currentTr.children[cellIndex].remove();
			}
			
		}
		else if(removeType == "table"){
			tableelm.remove();
		}
	},
	
	getColumnIndex : function ()
	{
	
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	},
	
	findParentElmByTag : function(pareltElm, tag) {
		var elm = pareltElm;	
		do {
			if(!elm.nodeName){ continue; }
			if(elm.nodeName.toLowerCase() == tag) {
				elm = $BK(elm);
				return elm;
			}
		} while((elm = elm.parentNode) && elm.className != "nicEdit-main");
		
		return null;
	},
	
	selected : function(ins,t) {
		if(typeof t == 'function') { t = this.ne.selectedInstance.selElm(); }
		
		var tblelm = this.findParentElmByTag(t, "table");
		var trelm = this.findParentElmByTag(t, "tr");
		var tdelm = this.findParentElmByTag(t, "td");
		var thelm = this.findParentElmByTag(t, "th");
		
		if(tblelm || trelm || tdelm || thelm){
			this.isActive = true;
			this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
			this.isDisabled = false;
			this.updateState();
			return;
		}
		
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.isActive = false;
		this.updateState();
	}
});

nicEditors.registerPlugin(nicPlugin, nicRemoveTableOptions);

/* START CONFIG */
var nicTableOptions = {
    buttons : {
        'EdiTableTag' : {name : __('Edit table tag'), type : 'nicEditorTableButton'}
    }/* NICEDIT_REMOVE_START */,iconFiles : {'EdiTableTag' : '/admin/cms/article/editor/ext/table.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */
 
var nicEditorTableButton = nicEditorButton.extend({ 
	init : function() {
		this.ne.addEvent('selected', this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
		this.ne.addEvent('selected', this.selected.closure(this));
	},
	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : '780px', backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},
	addPane : function() {
		this.inputs = {};
		
		this.sel = this.ne.selectedInstance.selElm();
		
		var tblelm = this.findParentElmByTag(this.sel, "table");
		var trelm = this.findParentElmByTag(this.sel, "tr");
		var tdelm = this.findParentElmByTag(this.sel, "td");
		var thelm = this.findParentElmByTag(this.sel, "th");
		
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		
		var contain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(this.form);
		var val = "";
		
		if(tdelm){
			new bkElement('div').setContent("td tag").setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(contain);
			
			var tdcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('width', 'td_width', '', "60px", tdcontain, tdelm);
			this.addInput('height', 'td_height', '', "60px", tdcontain, tdelm);
			this.addInput('align', 'td_align', '', "60px", tdcontain, tdelm);
			this.addInput('valign', 'td_valign', '', "60px", tdcontain, tdelm);
			this.addInput('bgcolor', 'td_bgcolor', '', "60px", tdcontain, tdelm);
			
			tdcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('class', 'td_class', '', "180px", tdcontain, tdelm);
			this.addInput('style', 'td_style', '', "360px", tdcontain, tdelm);
		}
		if(thelm){
			new bkElement('div').setContent("th tag").setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(contain);
			
			var thcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('width', 'th_width', '', "60px", thcontain, thelm);
			this.addInput('height', 'th_height', '', "60px", thcontain, thelm);
			this.addInput('align', 'th_align', '', "60px", thcontain, thelm);
			this.addInput('valign', 'th_valign', '', "60px", thcontain, thelm);
			this.addInput('bgcolor', 'th_bgcolor', '', "60px", thcontain, thelm);
			
			thcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('class', 'th_class', '', "180px", thcontain, thelm);
			this.addInput('style', 'th_style', '', "360px", thcontain, thelm);
			
		}
		if(trelm){
			new bkElement('div').setContent("tr tag").setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(contain);
			var trcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('class', 'tr_class', '', "180px", trcontain, trelm);
			this.addInput('style', 'tr_style', '', "360px", trcontain, trelm);
		}
		if(tblelm){
			new bkElement('div').setContent("table tag").setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(contain);
		
			var tbcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('width', 'tb_width', '', "60px", tbcontain, tblelm);
			this.addInput('border', 'tb_border', '', "60px", tbcontain, tblelm);
			this.addInput('bordercolor', 'tb_bordercolor', '', "60px", tbcontain, tblelm);
			this.addInput('cellspacing', 'tb_cellspacing', '', "60px", tbcontain, tblelm);
			this.addInput('cellpadding', 'tb_cellpadding', '', "60px", tbcontain, tblelm);
			
			tbcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('bgcolor', 'tb_bgcolor', '', "60px", tbcontain, tblelm);
						
			tbcontain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(contain);
			this.addInput('class', 'tb_class', '', "180px", tbcontain, tblelm);
			this.addInput('style', 'tb_style', '', "360px", tbcontain, tblelm);
		}
		
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;	
		
		console.log("add pane");
	},
	
	addInput : function (label, inputid, val, width, contain, elm)
	{
		var attrValue = val;
		if(elm.hasAttribute(label)){
			attrValue = elm.getAttribute(label);
		}
		
		new bkElement('label').setAttributes({'for' : inputid}).setContent(label).setStyle({margin : '2px 4px', fontSize : '13px', width: '70px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(contain);
		var ipt = new bkElement('input').setAttributes({id : inputid, 'value' : attrValue, 'type' : 'text'}).setStyle({margin : '2px 0', fontSize : '13px', 'float' : 'left', height : '20px', width: width, border : '1px solid #ccc', overflow : 'hidden'}).appendTo(contain);
		
		this.inputs[inputid] = ipt;
	},
	
	submit : function() {
		this.removePane();
		
		var tblelm = this.findParentElmByTag(this.sel, "table");
		var trelm = this.findParentElmByTag(this.sel, "tr");
		var tdelm = this.findParentElmByTag(this.sel, "td");
		var thelm = this.findParentElmByTag(this.sel, "th");
		
		if(tdelm){
			tdelm.setAttribute('width', this.inputs['td_width'].value);
			tdelm.setAttribute('height', this.inputs['td_height'].value);
			tdelm.setAttribute('align', this.inputs['td_align'].value);
			tdelm.setAttribute('valign', this.inputs['td_valign'].value);
			tdelm.setAttribute('bgcolor', this.inputs['td_bgcolor'].value);
			tdelm.setAttribute('class', this.inputs['td_class'].value);
			tdelm.setAttribute('style', this.inputs['td_style'].value);
			
			tdelm.className = this.inputs['td_class'].value;
		}
		if(thelm){
			thelm.setAttribute('width', this.inputs['th_width'].value);
			thelm.setAttribute('height', this.inputs['th_height'].value);
			thelm.setAttribute('align', this.inputs['th_align'].value);
			thelm.setAttribute('valign', this.inputs['th_valign'].value);
			thelm.setAttribute('bgcolor', this.inputs['th_bgcolor'].value);
			thelm.setAttribute('class', this.inputs['th_class'].value);
			thelm.setAttribute('style', this.inputs['th_style'].value);
			
			thelm.className = this.inputs['th_class'].value;
		}
		if(trelm){
			trelm.setAttribute('style', this.inputs['tr_style'].value);
			trelm.className = this.inputs['tr_class'].value;
		}
		if(tblelm){
			tblelm.setAttribute('width', this.inputs['tb_width'].value);
			tblelm.setAttribute('border', this.inputs['tb_border'].value);
			tblelm.setAttribute('bordercolor', this.inputs['tb_bordercolor'].value);
			tblelm.setAttribute('cellspacing', this.inputs['tb_cellspacing'].value);
			tblelm.setAttribute('cellpadding', this.inputs['tb_cellpadding'].value);
			
			tblelm.setAttribute('bgcolor', this.inputs['tb_bgcolor'].value);
			
			tblelm.setAttribute('style', this.inputs['tb_style'].value);
			tblelm.className = this.inputs['tb_class'].value;
		}
	},
	
	findParentElmByTag : function(pareltElm, tag) {
		var elm = pareltElm;	
		do {
			if(!elm.nodeName){ continue; }
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
		
		var tblelm = this.findParentElmByTag(t, "table");
		var trelm = this.findParentElmByTag(t, "tr");
		var tdelm = this.findParentElmByTag(t, "td");
		var thelm = this.findParentElmByTag(t, "th");
		
		if(tblelm || trelm || tdelm || thelm){
			this.isActive = true;
			this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
			this.isDisabled = false;
			this.updateState();			
			return;
		}
		
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.isActive = false;
		this.updateState();	
	}
	
	
});

nicEditors.registerPlugin(nicPlugin,nicTableOptions);
 