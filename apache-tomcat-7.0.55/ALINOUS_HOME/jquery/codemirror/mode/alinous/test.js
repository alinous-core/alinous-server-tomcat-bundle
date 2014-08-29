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
		
	CodeMirror.defineMode("alinous", function()
	{
		function failFirstLine(stream, state) {
			stream.skipToEnd();
			clearState(state);
			return "error";
		}
		
		function body(stream, state)
		{
			//stream.skipToEnd();
			if (stream.eatSpace()) return null;
			if(stream.match(/\t/)){
				return null;
			}
			if(stream.match(/;/)){
				return null;
			}
			if(stream.match(/=/)){
				return null;
			}
			if(stream.match(/\[/)){
				return null;
			}
			if(stream.match(/\]/)){
				return null;
			}
			if(stream.match(/\{/) || stream.match(/\}/)){
				return null;
			}
			
			if(stream.match(/^\$[a-zA-Z\d]+/)){
				changeState(variable, state);
				return "variable-3";
			}
			if(stream.match(/\./)){
				changeState(variable, state);
				return null;
			}
			
			if(stream.match(/[\d]+/)){
				return "number";
			}
			
			if(stream.match(/function/)){
				return "keyword";
			}
			if(stream.match(/return/)){
				return "keyword";
			}
			/*
			if(stream.match(/\"/)){
				state.cur = dqstring;
				return null;
			}*/
			
			return failFirstLine(stream, state);
		}
		
		function dqstring(stream, state)
		{
			if(stream.match(/\"/)){
				returnState(state);
				return null;
			}
			
			stream.eatWhile(/\"/);
			returnState(state);
			
			return "string";
		}
		
		function variable(stream, state)
		{
			if (stream.eatSpace()) return null;
			if(stream.match(/\t/)){	return null;}
			if(stream.match(/\./)){
				return null;
			}
			if(stream.match(/\[/)){
				state.cur = variableBody;
				return null;
			}
			if(stream.match(/\]/)){
				returnState(state);
				return null;
			}
			if(stream.match(/;/)){
				returnState(state);
				return null;
			}
			if(stream.match(/=/)){
				returnState(state);
				return null;
			}
			
			if(isOperator(stream, state)){
				returnState(state);
				return null;
			}
			
			if(stream.match(/[a-zA-Z\d]+/)){
				state.cur = variable;
				return "variable-3";
			}
			
			return failFirstLine(stream, state);
		}
		
		function variableBody(stream, state)
		{
			//stream.skipToEnd();
			if (stream.eatSpace()) return null;
			if(stream.match(/\t/)){
				return null;
			}
			if(stream.match(/=/)){
				return null;
			}
			if(stream.match(/\[/)){
				return null;
			}
			if(stream.match(/\]/)){
				returnState(state);
				return null;
			}
			
			if(stream.match(/\$[a-zA-Z\d]+/)){
				return "variable-3";
			}
			
			if(stream.match(/[\d]+/)){
				return "number";
			}
			
			return failFirstLine(stream, state);
		}
		
		function isOperator(stream, state)
		{
			if(stream.match(/\+\+/)){
				return true;
			}
			if(stream.match(/\-\-/)){
				return true;
			}
			if(stream.match(/\+/)){
				return true;
			}
			if(stream.match(/\-/)){
				return true;
			}
			if(stream.match(/\//)){
				return true;
			}
			if(stream.match(/\*/)){
				return true;
			}
			if(stream.match(/&/)){
				return true;
			}
			if(stream.match(/|/)){
				return true;
			}
			if(stream.match(/&&/)){
				return true;
			}
			if(stream.match(/||/)){
				return true;
			}
			return false;
		}
		
		function changeState(newState, state)
		{
			state.statusStack.push(state.cur);
			
			state.cur = newState;
		}
		
		function returnState(state)
		{
			state.cur = state.statusStack.pop();
		}
		
		function clearState(state)
		{
			state.statusStack = [];
			state.cur = body;
		}
		
		return {
			token: function(stream, state) {
				var cur = state.cur;
				if (stream.eatSpace()) return null;
				
								
				return cur(stream, state);
			},
	
			blankLine: function(state) {
				state.cur = body;
			},
	
			startState: function() {
				var ar  = new Array();
				return {cur: body, statusStack: ar};
			}
		};
	});
	
	CodeMirror.defineMIME("text/alinous", "alinous");
});