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
			if(stream.match(/;/) || stream.match(/=/)){
				return null;
			}
			
			// look ahead
			var lah = sqlLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}
			lah = statementsLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}
			
			
			return failFirstLine(stream, state);
		}
		
		function sqlLookAheads(stream, state)
		{
			if(stream.match("select", false, true)){
				return selectSentence;
			}
			if(stream.match("delete", false, true)){
				return deleteSentence;
			}
			if(stream.match("update", false, true)){
				return updateSentence;
			}
			if(stream.match("insert", false, true)){
				return insertSentence;
			}
			
			return null;
		}
		
		function insertSentence(stream, state)
		{
			if(stream.match("insert", true, true)){
				return "keyword";
			}
			if(stream.match("into", true, true)){
				return "keyword";
			}
			if(stream.match("values", true, true)){
				changeState(sqlValueListWithParenthesis, state);
				return "keyword";
			}
			
			// table name
			if(stream.match(/[a-zA-Z\d_]+/)){
				changeState(sqlValueListWithParenthesis, state);
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function updateSentence(stream, state)
		{
			if(stream.match("update", true, true)){
				return "keyword";
			}
			
			if(stream.match("set", false, true)){
				changeState(sqlUpdateSet, state);
				return state.cur(stream, state);
			}
			
			if(stream.match("where", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			// table name
			if(stream.match(/[a-zA-Z\d_]+/)){
				return null;
			}
						
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlUpdateSet(stream, state)
		{
			if(stream.match("set", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			if(stream.match(/\,/, true)){
				changeState(sqlCondition, state);
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function deleteSentence(stream, state)
		{
			if(stream.match("delete", true, true)){
				return "keyword";
			}
			
			if(stream.match("from", true, true)){
				changeState(sqlFrom, state);
				return "keyword";
			}
			
			if(stream.match("where", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		
		function selectSentence(stream, state)
		{
			if(stream.match("select", true, true)){
				changeState(sqlValueList, state);
				return "keyword";
			}
			
			if(stream.match("into", true, true)){
				changeState(sqlValueList, state);
				return "keyword";
			}
						
			if(stream.match("from", true, true)){
				changeState(sqlFrom, state);
				return "keyword";
			}
			
			if(stream.match("where", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			if(stream.match("group", true, true)){
				changeState(sqlGroupBy, state);
				return "keyword";
			}
			
			if(stream.match("having", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			if(stream.match("order", true, true)){
				changeState(sqlOrderBy, state);
				return "keyword";
			}
			
			if(stream.match("limit", true, true)){
				changeState(sqlLimitOffsetArgument, state);
				return "keyword";
			}
			if(stream.match("offset", true, true)){
				changeState(sqlLimitOffsetArgument, state);
				return "keyword";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlOrderBy(stream, state)
		{
			if(stream.match("by", true, true)){
				changeState(sqlValueList, state);
				return "keyword";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		
		function sqlLimitOffsetArgument(stream, state)
		{
			// number
			if(stream.match(/[\d]+/)){
				returnState(state);
				return "number";
			}
			
			if(stream.match(/\$[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			if(stream.match(/@[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state); 
		}
		
		
		function sqlGroupBy(stream, state)
		{
			if(stream.match("by", true, true)){
				changeState(sqlValueList, state);
				return "keyword";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlFrom(stream, state)
		{
			if(stream.match(/,/)){
				return null;
			}
			
			// joins
			if(stream.match(/\(/, false)){
				changeState(sqlParenthesisFromElement, state);
				return state.cur(stream, state);
			}
			
			// join
			if(stream.match("left", false, true)){
				changeState(sqlJoin, state);
				return state.cur(stream, state);
			}
			if(stream.match("inner", false, true)){
				changeState(sqlJoin, state);
				return state.cur(stream, state);
			}
			if(stream.match("right", false, true)){
				changeState(sqlJoin, state);
				return state.cur(stream, state);
			}
			if(stream.match("outer", false, true)){
				changeState(sqlJoin, state);
				return state.cur(stream, state);
			}
			
			if(stream.match("as", true, true)){
				return "keyword";
			}
			
			
			// sub query
			if(stream.match("select", false, true)){
				changeState(selectSentence, state);
				return state.cur(stream, state);
			}
			
			// end
			if(stream.match("where", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("order", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("group", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("having", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("offset", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("limit", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(";", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(/\)/, false)){ // subquery end
				returnState(state);
				return state.cur(stream, state);
			}
			
			// table name
			if(stream.match(/[a-zA-Z\d_]+/)){
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function sqlParenthesisFromElement(stream, state)
		{
			if(stream.match(/\(/)){
				changeState(sqlFrom, state);
				return null;
			}
			
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			return failFirstLine(stream, state);
		}
		
		function sqlJoin(stream, state)
		{
			// join keywords
			if(stream.match("left", true, true)){
				return "keyword";
			}
			if(stream.match("right", true, true)){
				return "keyword";
			}
			if(stream.match("inner", true, true)){
				return "keyword";
			}
			if(stream.match("outer", true, true)){
				return "keyword";
			}
			if(stream.match("join", true, true)){
				return "keyword";
			}
			
			// sub query
			if(stream.match(/\(/, false)){
				changeState(sqlParenthesisFromElement, state);
				return state.cur(stream, state);
			}
			
			// on condition
			if(stream.match("on", true, true)){
				changeState(sqlCondition, state);
				return "keyword";
			}
			
			// end
			if(stream.match("where", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("order", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("group", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("having", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("offset", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("limit", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			
			// table name
			if(stream.match(/[a-zA-Z\d_]+/)){
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlCondition(stream, state)
		{
			if(stream.match(/\(/, false)){
				changeState(sqlParenthesisCondition, state);
				return state.cur(stream, state);
			}
			
			// end by reserved keywords
			if(stream.match("where", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("order", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("group", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("having", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("offset", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("limit", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(";", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(/\)/, false)){ // subquery end
				returnState(state);
				return state.cur(stream, state);
			}
			
			// operators
			if(stream.match(/</, true)){
				return null;
			}
			if(stream.match(/>/, true)){
				return null;
			}
			if(stream.match(/=/, true)){
				return null;
			}
			
			// variables
			if(stream.match(/\$[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			if(stream.match(/@[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			
			// logical operators
			if(stream.match("and", true, true)){
				return "keyword";
			}
			if(stream.match("or", true, true)){
				return "keyword";
			}
			if(stream.match("not", true, true)){
				return "keyword";
			}
			if(stream.match("in", true, true)){
				changeState(sqlValueListWithParenthesis, state);
				return "keyword";
			}
			
			// sql function call
			if(stream.match(/[a-zA-Z\d_]+\(/, false)){
				changeState(sqlFunctionCall, state);
				return state.cur(stream, state);
			}

			// number
			if(stream.match(/[\d]+/)){
				return "number";
			}
			
			// table column
			if(stream.match(/[a-zA-Z\d_]+(\.[a-zA-Z\d_]+)?/)){
				return null;
			}
			
			// sq string
			if(stream.match(/\'/, false)){
				changeState(sqString, state);
				return state.cur(stream, state);
			}

			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlParenthesisCondition(stream, state)
		{
			if(stream.match(/\(/)){
				changeState(sqlCondition, state);
				return null;
			}
			
			// end
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function sqlValueListWithParenthesis(stream, state)
		{
			if(stream.match(/\(/)){
				changeState(sqlValueList, state);
				return null;
			}
			
			// end
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function sqlValueList(stream, state)
		{
			if(stream.match(/\*/)){
				return null;
			}
			if(stream.match(/,/)){
				return null;
			}
			
			if(stream.match(/\(/, false)){
				changeState(sqlValueListWithParenthesis, state);
				return state.cur(stream, state);
			}
			
			if(stream.match("asc", true, true)){
				return "keyword";
			}
			if(stream.match("desc", true, true)){
				return "keyword";
			}
			if(stream.match("as", true, true)){
				return "keyword";
			}
			
			// end
			if(stream.match("into", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("from", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("where", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("order", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("group", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("having", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("offset", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match("limit", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(";", false, true)){
				returnState(state);
				return state.cur(stream, state);
			}
			if(stream.match(/\)/, false)){ // (...) values(...) and subquery end
				returnState(state);
				return state.cur(stream, state);
			}
			
			if(stream.match(/\$[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			if(stream.match(/@[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			
			// sub query
			if(stream.match("select", false, true)){
				changeState(selectSentence, state);
				return state.cur(stream, state);
			}
			
			// sql function call
			if(stream.match(/[a-zA-Z\d_]+\(/, false)){
				changeState(sqlFunctionCall, state);
				return state.cur(stream, state);
			}
						
			// number
			if(stream.match(/[\d]+(\.[\d]+)?/)){
				return "number";
			}
			
			// table column
			if(stream.match(/[a-zA-Z\d_]+(\.[a-zA-Z\d_]+)?/)){
				return null;
			}
			
			// sq string
			if(stream.match(/\'/, false)){
				changeState(sqString, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqlFunctionCall(stream, state)
		{
			if(stream.match(/[a-zA-Z\d_]+/)){
				return null;
			}
			
			if(stream.match(/\(/, true)){
				changeState(sqlFunctionArguments, state);
				return state.cur(stream, state);
			}
			
			// ending
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function sqlFunctionArguments(stream, state)
		{
			if(stream.match(/\,/)){
				return null;
			}
			if(stream.match(/\*/)){
				return null;
			}
			
			// ending
			if(stream.match(/\)/, false)){
				returnState(state);
				return state.cur(stream, state);
			}
			
			// sql function call
			if(stream.match(/[a-zA-Z\d_]+\(/), false){
				changeState(sqlFunctionCall, state);
				return null;
			}
			
			// number
			if(stream.match(/[\d]+/)){
				return "number";
			}
			
			// sql variable
			if(stream.match(/[a-zA-Z\d_]+(\.[a-zA-Z\d_]+)?/)){
				return null;
			}
			
			// sq string
			if(stream.match(/\'/, false)){
				changeState(sqString, state);
				return state.cur(stream, state);
			}
			
			return failFirstLine(stream, state);
		}
		
		
		function statementsLookAheads(stream, state)
		{
			if(stream.match(/return/, false)){
				return returnSentence;
			}
			if(stream.match(/redirect/, false)){
				return redirectSentence;
			}
			if(stream.match(/download/, false)){
				return downloadSentence;
			}
			if(stream.match(/function/, false)){
				return functionDeclare;
			}
			
			if(stream.match(/if/, false)){
				return ifBlock;
			}
			if(stream.match(/while/, false)){
				return whileBlock;
			}
			if(stream.match(/for/, false)){
				return forBlock;
			}
			
			if(stream.match(/\$[a-zA-Z\d_]+/, false)){
				return statements;
			}
			if(stream.match(/@[a-zA-Z\d_]+/, false)){
				return statements;
			}
			if(stream.match(/[a-zA-Z\d_]+/, false)){
				return statements;
			}
			if(stream.match(/[d]+/, false)){
				return statements;
			}
			
			// string
			if(stream.match(/\"/, false)){
				return statements;
			}
			if(stream.match(/\'/, false)){
				return statements;
			}
			
			return null;
		}
		
		function forBlock(stream, state)
		{
			if(stream.match(/for/)){
				return "keyword";
			}
			
			if(stream.match(/\(/, false)){
				changeState(forCondition, state);
				return state.cur(stream, state);
			}
			
			if(stream.match(/\{/, false)){
				changeState(block, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function forCondition(stream, state)
		{
			if(stream.match(/\(/)){
				return null;
			}
			if(stream.match(/;/)){
				return null;
			}
			
			// end
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			// look ahead
			var lah = statementsLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}			
			
			return failFirstLine(stream, state);
		}
		
		function whileBlock(stream, state)
		{
			if(stream.match(/while/)){
				return "keyword";
			}
			
			if(stream.match(/\(/, false)){
				changeState(condition, state);
				return state.cur(stream, state);
			}
			
			if(stream.match(/\{/, false)){
				changeState(block, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function ifBlock(stream, state)
		{
			if(stream.match(/if/)){
				changeState(parenthesisCondition, state);
				return "keyword";
			}
			
			if(stream.match(/else/)){
				return "keyword";
			}
			
			if(stream.match(/\{/, false)){
				changeState(block, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);			
		}
		
		function condition(stream, state)
		{
			if(stream.match(/\(/, false)){
				changeState(parenthesisCondition, state);
				return state.cur(stream, state);
			}
			
			// end
			if(stream.match(/\)/, false)){
				returnState(state);
				return state.cur(stream, state);
			}
			
			// look ahead
			var lah = statementsLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}			
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function parenthesisCondition(stream, state)
		{
			if(stream.match(/\(/)){
				changeState(condition, state);
				return null;
			}
			
			// end
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function functionDeclare(stream, state)
		{
			if(stream.match(/function/)){
				return "keyword";
			}
			
			if(stream.match(/[a-zA-Z\d_]+(\.[a-zA-Z\d_]+)?/)){
				return null;
			}
			
			// look ahead
			if(stream.match(/\(/, false)){
				changeState(functionCallArguments, state);
				return state.cur(stream, state);
			}
			if(stream.match(/\{/, false)){
				changeState(block, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function block(stream, state)
		{
			if(stream.match(/\{/)){
				return null;
			}
			if(stream.match(/;/) || stream.match(/=/)){
				return null;
			}
			
			// look ahead
			var lah = sqlLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}
			lah = statementsLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}
			
			// end
			if(stream.match(/\}/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function downloadSentence(stream, state)
		{
			if(stream.match(/download/)){
				changeState(statements, state);
				return "keyword";
			}
			
			if(stream.match(/,/)){
				changeState(statements, state);
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function redirectSentence(stream, state)
		{
			if(stream.match(/redirect/)){
				changeState(statements, state);
				return "keyword";
			}
			
			if(stream.match(/,/)){
				changeState(statements, state);
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function returnSentence(stream, state)
		{
			if(stream.match(/return/)){
				changeState(statements, state);
				return "keyword";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function statements(stream, state)
		{

			// look ahead
			if(stream.match(/\$[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			if(stream.match(/@[a-zA-Z\d_]+/, false)){
				changeState(variable, state);
				return state.cur(stream, state);
			}
			if(stream.match(/[\d]+/, false)){
				changeState(number, state);
				return state.cur(stream, state);
			}
			if(stream.match(/\"/, false)){
				changeState(dqString, state);
				return state.cur(stream, state);
			}
			if(stream.match(/\'/, false)){
				changeState(sqString, state);
				return state.cur(stream, state);
			}
			if(stream.match(/[a-zA-Z\d_]+/, false)){
				changeState(functionCall, state);
				return state.cur(stream, state);
			}
			if(stream.match(/\(/, false)){
				changeState(parenthesisStatement, state);
				return state.cur(stream, state);
			}
			
			
			// skip
			if(stream.match(/=/)){
				return null;
			}
			if(isOperator(stream, state)){
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function parenthesisStatement(stream, state)
		{
			if(stream.match(/\(/)){
				changeState(statements, state);
				return null;
			}
			
			// ending
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function functionCall(stream, state)
		{
			if(stream.match(/[a-zA-Z\d_]+(\.[a-zA-Z\d_]+)?/)){
				return null;
			}
			
			// look ahead
			if(stream.match(/\(/, false)){
				changeState(functionCallArguments, state);
				return state.cur(stream, state);
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function functionCallArguments(stream, state)
		{
			if(stream.match(/\,/)){
				return null;
			}
			if(stream.match(/\(/)){
				return null;
			}
			
			// look ahead
			var lah = statementsLookAheads(stream, state);
			if(lah != null){
				changeState(lah, state);
				return state.cur(stream, state);
			}
			
			// ending
			if(stream.match(/\)/)){
				returnState(state);
				return null;
			}
			
			return failFirstLine(stream, state);
		}
		
		function sqString(stream, state)
		{
			if(stream.match(/\'/)){
				changeState(sqStringIn, state);
				return "string";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function sqStringIn(stream, state)
		{
			if(stream.match(/[^\']*\\\'/)){
				return "string";
			}
			if(stream.match(/[^\']*\'/)){
				returnState(state);
				return "string";
			}
			
			return failFirstLine(stream, state);
		}
		
		function dqString(stream, state)
		{
			if(stream.match(/\"/)){
				changeState(dqStringIn, state);
				return "string";
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function dqStringIn(stream, state)
		{
			if(stream.match(/[^\"]*\\\"/)){
				return "string";
			}
			if(stream.match(/[^\"]*\"/)){
				returnState(state);
				return "string";
			}
			
			return failFirstLine(stream, state);
		}
		
		function number(stream, state)
		{
			if(stream.match(/[\d]+/)){
				returnState(state);
				return "number";
			}
			
			return failFirstLine(stream, state);
		}
		
		function variable(stream, state)
		{
			// look ahead
			if(stream.match(/\$[a-zA-Z\d_]+/)){
				return "variable-2";
			}
			if(stream.match(/@[a-zA-Z\d_]+/)){
				return "variable-2";
			}
			if(stream.match(/\.[a-zA-Z\d_]+/)){
				return "variable-2";
			}
			if(stream.match(/\[/)){
				changeState(statements, state);
				return null;
			}
			if(stream.match(/\]/)){
				return null;
			}
			
			returnState(state);
			return state.cur(stream, state);
		}
		
		function arrayindex(stream, state)
		{
			if(stream.match(/\]/)){
				returnState(state);
				return null;
			}
			
			if(stream.match(/^\$[a-zA-Z\d_]+/)){
				changeState(variable, state);
				return "variable-3";
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
			if(stream.match(/%/)){
				return true;
			}
			if(stream.match(/&/)){
				return true;
			}
			if(stream.match(/\|/)){
				return true;
			}
			if(stream.match(/&&/)){
				return true;
			}
			if(stream.match(/\|\|/)){
				return true;
			}
			if(stream.match(/</)){
				return true;
			}
			if(stream.match(/>/)){
				return true;
			}
			if(stream.match(/!/)){
				return true;
			}
			return false;
		}
		
		function checkLineComment(stream, state)
		{
			if(stream.match(/\/\//)){
				stream.skipToEnd();
				return "comment";
			}
			
			return null;
		}
		
		function checkBlockComment(stream, state)
		{
			if(stream.match(/\/\*/)){
				changeState(insideComment, state);
				return "comment";
			}
			
			return null;
		}
		
		function insideComment(stream, state)
		{
			if(stream.match(/.*\*\//)){
				returnState(state);
				return "comment";
			}
			
			stream.skipToEnd();
			return "comment";
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
				
				if(cur != insideComment){
					var comment = checkLineComment(stream, state);
					if(comment != null){
						return comment;
					}
					
					var comment = checkBlockComment(stream, state);
					if(comment != null){
						return comment;
					}
					
					if (stream.eatSpace()) return null;
				}
													
				return cur(stream, state);
			},
	
			blankLine: function(state) {
				// clearState(state);
			},
	
			startState: function() {
				var ar  = new Array();
				return {cur: body, statusStack: ar};
			}
		};
	});
	
	CodeMirror.defineMIME("text/alinous", "alinous");
});