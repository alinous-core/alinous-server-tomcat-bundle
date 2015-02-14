
var treeId = 'sdk';

function initJqTree(path)
{
	var winHeight = window.innerHeight - 150;
	$("#scroll-container").css("height", winHeight + "px");
	
	
	JqTreeScroll.restore();
	
	$.getJSON(
		'/admin/sdk/program/makejson.alns?node=/',
		function(data) {
			$tree = $('#pageTree').tree({
				dragAndDrop: true,
				data: data,
				saveState: true,
				onCreateLi: function(node, $li) {
					// add "dataid" in order to test with selenium
	    			$li.attr("dataid", node.id);
	    			
	    			if(node.type == "dir"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/folder.png" style="margin: 0 3px 0 0;" />');
	    			}
	    			else if(node.type == "html"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/page_html.gif" style="margin: 0 3px 0 0;" />');
	    			}
	    			else if(node.type == "css"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/css.png" style="margin: 0 3px 0 0;" />');
	    			}
	    			else if(node.type == "js"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/script.png" style="margin: 0 3px 0 0;" />');
	    			}
	    			else if(node.type == "image"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/image.png" style="margin: 0 3px 0 0;" />');
	    			}
	    			else if(node.type == "alns"){
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/alinous.gif" style="margin: 0 3px 0 0;" />');
	    			}
	    			else{
	    				$li.find('.jqtree-title').prepend('<img src="/admin/sdk/program/img/page_white.png" style="margin: 0 3px 0 0;" />');
	    			}
	    			
	    			var openinitFunction = "JqTreeLazyState.initNode($tree, " +
	    					"'" + node.id + "', " +
	    					"'" + treeId + "'" +
	    				")";
	    			setTimeout(openinitFunction, 10);
				}
	        });
	        
			$tree.bind(
				'tree.open',
  				function(e) {
  					var node = e.node;
  					var nodeId = node.id;
  					
  					JqTreeLazyState.openNode(node, treeId);  					
  				}
			);
			$tree.bind(
				'tree.close',
  				function(e) {
  					var node = e.node;
  					var nodeId = node.id;
  					
  					JqTreeLazyState.closeNode(node, treeId);  					
  				}
			);
			
			// bind 'tree.click' event
			$('#pageTree').on(
				'tree.dblclick',
				function(event) {
					JqTreeScroll.saveScrollPosition();
					
					// The clicked node is 'event.node'
					var node = event.node;
					
					document.naviFrm.cmd.value = "";
					document.naviFrm.selectedPath.value = node.id;
					document.naviFrm.submit();
				}
			);
			
			JqTreeScroll.restore();
		}
	);
}

var JqTreeScroll ={
	saveScrollPosition : function ()
	{
		var scrollPosition = document.getElementById("scroll-container").scrollTop;
		$.cookie("sdk-tree-scroll", scrollPosition , {expires: 7});
	},
	restore : function ()
	{
		var scrollPosition = $.cookie("sdk-tree-scroll");
		document.getElementById("scroll-container").scrollTop = scrollPosition;
	}
}
