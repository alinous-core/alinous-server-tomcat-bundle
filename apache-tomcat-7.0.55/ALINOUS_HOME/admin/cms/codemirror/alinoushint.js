
var ddlUrl = "/admin/cms/codemirror/ddl.alns";
var functionsUrl = "/admin/cms/codemirror/function.alns";

var ServerData = {
	functions : null,
	functionPrefix: [],
	ddls : null,
	initDdl : function(data)
	{
		this.ddls = data;
		
	},
	initFunctions :  function(data)
	{
		this.functions = data;
		
		for(var i = 0; i < this.functions.length; i++){
			var str = this.functions[i].assist.toUpperCase();
			
			if(str == null || str == ""){
				continue;
			}
			
			var idx = str.indexOf("\.", 0);
			
			if(idx > 0){
				var pref = this.functions[i].assist.slice(0, idx);
				
				if(!this.prefixContains(pref)){
					this.functionPrefix.push(pref);
				}
			}
			
		}		
		
	},
	prefixContains : function (prefix)
	{
		var p = prefix.toUpperCase();
		
		for(var i = 0; i < ServerData.functionPrefix.length; i++){
			var pref = ServerData.functionPrefix[i].toUpperCase();
			
			if(pref == p){
				return true;
			}
		}
		
		return false;
	},
	
	closure : function (thisObj, method)
	{
		var __method = method;
		var __this = thisObj;
		
		return function() {
			var __arguments = arguments;
			
			__method.apply(__this, __arguments);
		}
	},
	
	findTable : function (tableName)
	{
		if(!tableName){
			return null;
		}
		
		var upTable = tableName.toUpperCase();
		for(var i = 0; i < ServerData.ddls.length; i++){
			var name = ServerData.ddls[i].name.toUpperCase();
			
			if(name == upTable){
				return ServerData.ddls[i];
			}
		}
		
		return null;
	},
	
	findFunction :function (prefix, funcName)
	{
		if(prefix == null){
			return null;
		}
		
		
		var targetName = prefix.toUpperCase() + "." + funcName.toUpperCase();
		for(var i = 0; i < ServerData.functions.length; i++){
			var f = ServerData.functions[i].name.toUpperCase();
			
			if(f == targetName){
				return ServerData.functions[i];
			}
		}
		
		return null;
	},
	
	findAssistTarget : function (input, lastToken)
	{
		if(lastToken != null){
			return ServerData.findAssistWithLastToken(input, lastToken);
		}
		var completions = [];
		
		var headstr = input.toUpperCase();
		
		for(var i = 0; i < ServerData.ddls.length; i++){
			var str = ServerData.ddls[i].name.toUpperCase();
			
			if(str.lastIndexOf(headstr, 0) != 0){
				continue;
			}
			
	        completions.push({text: ServerData.ddls[i].name,
	                  displayText: ServerData.ddls[i].name,
	                  className: 'alinous-table',
	                  data: ServerData.ddls[i].ddl});
		}
		
		for(var i = 0; i < ServerData.functionPrefix.length; i++){
			var str = ServerData.functionPrefix[i].toUpperCase();
			
			if(str.lastIndexOf(headstr, 0) != 0){
				continue;
			}
			
			if(ServerData.functionPrefix[i] == "" || ServerData.functionPrefix[i] == null){
				continue;
			}
	        completions.push({text: ServerData.functionPrefix[i],
	                  displayText: ServerData.functionPrefix[i],
	                  className: 'alinous-function-prefix',
	                  data: ''});
		}
		
		return completions;
	},
	findAssistWithLastToken : function (input, lastToken)
	{
		var completions = [];
		
		var headstr = lastToken.toUpperCase() + "." + input.toUpperCase();
		
		for(var i = 0; i < ServerData.ddls.length; i++){
			var ip = input.toUpperCase();
			
			var pref = lastToken.toUpperCase();
			var str = ServerData.ddls[i].name.toUpperCase();
			if(pref != str){
				continue;
			}
			
			for(var j = 0; j < ServerData.ddls[i].columns.length; j++){
				var colstr = ServerData.ddls[i].name.toUpperCase() + "." + ServerData.ddls[i].columns[j].name.toUpperCase();
								
				if(colstr.lastIndexOf(headstr, 0) != 0){
					continue;
				}
				
		        completions.push({text: ServerData.ddls[i].name + "." + ServerData.ddls[i].columns[j].name,
		                  displayText: ServerData.ddls[i].columns[j].name,
		                  className: 'alinous-table-column',
		                  data: ServerData.ddls[i].columns[j].comment});	
			}
		}
		
		for(var i = 0; i < ServerData.functions.length; i++){
			
			if(ServerData.functions[i].assist == "" || ServerData.functions[i].assist == null){
				continue;
			}
			
			var str = ServerData.functions[i].assist.toUpperCase();
			
			if(str.lastIndexOf(headstr, 0) != 0){
				continue;
			}
			
	        completions.push({text: ServerData.functions[i].assist,
	                  displayText: ServerData.functions[i].assist,
	                  className: 'alinous-function',
	                  data: ServerData.functions[i].desc});
		}
		
		return completions;
	}
}

var callback = ServerData.closure(ServerData, ServerData.initDdl);
$.ajax({
	type: 'POST',
	url: ddlUrl,
	data: {
	},
	dataType: 'json',
	success: callback,
	error:function() {
		alert('Error occur');
	}
});

var callback2 = ServerData.closure(ServerData, ServerData.initFunctions);
$.ajax({
	type: 'POST',
	url: functionsUrl,
	data: {
	},
	dataType: 'json',
	success: callback2,
	error:function() {
		alert('Error occur');
	}
});

var HintHelper = {
	getCurrentHintPart: function (editor, options, end)
	{
		var cur = editor.getCursor(), curLine = "";
		
		var partition = "";
		var line = cur.line;
		var endLine = /.*[;}]/;
		
		var first = true;
		while(line >= 0){
			var curLine = editor.getLine(line--);
			
			if(first){
				first = false;
				partition = curLine.slice(0, end);
			
			}else{
				if(endLine.test(curLine)){
					break;
				}
				if(curLine.trim() != ""){
					partition = curLine + "\n" + partition;
				}
			}
		}
				
		return partition;
	},


	partition2TokenArray : function (partition)
	{
		var pos = 0;
		var tokens = [];
		var current = "";
		var STOP_CH = /[;\(\)\{\}\s\t\.]/;
		
		while(pos < partition.length){
			var ch = partition.charAt(pos++);
			if(STOP_CH.test(ch)){
				if(current != ""){
					tokens.push(current);
					current = "";
				}
			}
			else{
				current += ch;
			}
		}		
		
		return tokens;
	}
};
	
(
	function(mod)
	{
		if (typeof exports == "object" && typeof module == "object") // CommonJS
			mod(require("../../lib/codemirror"));
		else if (typeof define == "function" && define.amd) // AMD
	    	define(["../../lib/codemirror"], mod);
		else // Plain browser env
			mod(CodeMirror);
	}
)(function(CodeMirror) {
	"use strict";
	
	var WORD = /[\w$]+/, RANGE = 500;
		
	function alinousHint(editor, options) {
		var word = options && options.word || WORD;
		var range = options && options.range || RANGE;
		var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
		var start = cur.ch, end = start;
		while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
		while (start && word.test(curLine.charAt(start - 1))) --start;
		var curWord = start != end && curLine.slice(start, end);
		
		if(!curWord){
			curWord = "";
		}
		
		var parts = HintHelper.getCurrentHintPart(editor, options, end);
		var tokens = HintHelper.partition2TokenArray(parts);
		
		var lastch = null;
		if(start > 0){
			lastch = curLine.charAt(start - 1);
		}
		
		var lastToken = null;
		if(lastch == "."){
			lastToken = tokens[tokens.length - 1];
			
			start -= lastToken.length + 1;
		}
		
		var completions = ServerData.findAssistTarget(curWord, lastToken);
		
		var obj = {list: completions,
					from: CodeMirror.Pos(cur.line, start),
					to: CodeMirror.Pos(cur.line, end)};
		
		var tooltip = null;
		CodeMirror.on(obj, "close", function() { remove(tooltip); });
		CodeMirror.on(obj, "update", function() { remove(tooltip); });
		CodeMirror.on(obj, "select", function(cur, node) {
			remove(tooltip);
			var content = cur.data;
			if (content) {
				tooltip = makeTooltip(node.parentNode.getBoundingClientRect().right + window.pageXOffset,
                                node.getBoundingClientRect().top + window.pageYOffset, content);
				
			}
		});
		
		
		
	    return obj;
		
	};
	
	
	CodeMirror.registerHelper("hint", "alinous", alinousHint);
	
	CodeMirror.defineInitHook(function(cm) {
		var cur = cm.getCursor();
		TooltipPop.position = CodeMirror.Pos(cur.line, cur.ch);
		TooltipPop.editor = cm;
		
		CodeMirror.on(cm, "cursorActivity", function(doc) {
			cur = cm.getCursor();
			
			TooltipPop.position = CodeMirror.Pos(cur.line, cur.ch);
			TooltipPop.editor = cm;
			
			if(TooltipPop.tooltip != null){
				remove(TooltipPop.tooltip);
				TooltipPop.tooltip = null;
			}
			
			setTimeout('TooltipPop.closure()',1500)
		});
		
	});

	return;
});


var TooltipPop = {
	editor : null,
	position: null,
	tooltip : null,
	closure : function()
	{
		var __method = TooltipPop.checkpop;
		//return function() {
			__method.apply(TooltipPop, arguments);
		//}
	},
	checkpop : function ()
	{
		cur = this.editor.getCursor();
		var newPos = CodeMirror.Pos(cur.line, cur.ch);
		
		if(newPos.line == this.position.line && newPos.ch == this.position.ch){
			// console.log("check pop : " + newPos.line + "," + newPos.ch);
			var WORD = /[\w$]+/;
			var word = WORD;
			var cur = this.editor.getCursor(), curLine = this.editor.getLine(cur.line);
			var start = cur.ch, end = start;
			while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
			while (start && word.test(curLine.charAt(start - 1))) --start;
			var curWord = start != end && curLine.slice(start, end);
			if(!curWord){
				curWord = "";
			}
			
			var parts = HintHelper.getCurrentHintPart(this.editor, {}, end);
			var tokens = HintHelper.partition2TokenArray(parts);
			
			var lastch = null;
			if(start > 0){
				lastch = curLine.charAt(start - 1);
			}
			
			var lastToken = null;
			if(lastch == "."){
				lastToken = tokens[tokens.length - 1];
				
				start -= lastToken.length + 1;
			}
			
			// console.log("tooltip for --> " + curWord);
			
			
			var func = ServerData.findFunction(lastToken, curWord);
			if(func){
				if(TooltipPop.tooltip != null){
					remove(TooltipPop.tooltip);
					TooltipPop.tooltip = null;
				}
				
				
				var curPos = this.editor.cursorCoords(false, "page");
				
				var xoffset = window.pageXOffset + curPos.left;
				var yoffset = window.pageYOffset + curPos.bottom;
				
				var content = func.desc;
				this.tooltip = makeTooltip(xoffset,
	                                yoffset, content);
				return;
			}
			
			var table = ServerData.findTable(curWord);
			if(table){
				if(TooltipPop.tooltip != null){
					remove(TooltipPop.tooltip);
					TooltipPop.tooltip = null;
				}
				
				var curPos = this.editor.cursorCoords(false, "page");
				
				var xoffset = window.pageXOffset + curPos.left;
				var yoffset = window.pageYOffset + curPos.bottom;
				
				var content = table.ddl;
				this.tooltip = makeTooltip(xoffset,
	                                yoffset, content);
	            return;
	        }
	        
		}
	}
};



function remove(node) {
	var p = node && node.parentNode;
	if (p) p.removeChild(node);
}

function tempTooltip(cm, content) {
	var where = cm.cursorCoords();
	var tip = makeTooltip(where.right + 1, where.bottom, content);
	function clear() {
		if (!tip.parentNode) return;
		cm.off("cursorActivity", clear);
		fadeOut(tip);
	}
	setTimeout(clear, 1700);
	cm.on("cursorActivity", clear);
}

function makeTooltip(x, y, content) {
	var node = elt("div", "alnstooltip", content);
	node.style.left = x + "px";
	node.style.top = y + "px";
	document.body.appendChild(node);
	return node;
}

function elt(tagname, cls /*, ... elts*/) {
	var e = document.createElement(tagname);
	if (cls) e.className = cls;
	for (var i = 2; i < arguments.length; ++i) {
		var elt = arguments[i];
		if (typeof elt == "string") elt = document.createTextNode(elt);
			e.appendChild(elt);
		}
	return e;
}