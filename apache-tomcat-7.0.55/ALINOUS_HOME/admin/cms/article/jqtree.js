
var treeId = 'cms';
var $tree = null;
var currentNode = null;

function initJqTree()
{
	var winHeight = document.body.clientHeight - 95;
	$("#scroll-container").css("height", winHeight + "px");

	$.getJSON(
		'/admin/cms/article/makejson.alns',
		function(data) {
			$tree = $('#pageTree').tree({
				dragAndDrop: true,
				data: data,
				autoOpen: false,
				
				saveState: true,
				onCreateLi: function(node, $li) {
					$li.css("margin", "4px 0 4px 0");
					
					// add "dataid" in order to test with selenium
	    			$li.attr("dataid", node.id);
	    			
	    			/*
					$li.find('.jqtree-element').append(
						' [<a href="#node-'+ node.id +'" class="manipulatenode" data-node-id="'+
							node.id +'">edit</a>]'
					);
					*/
					
					var level = node.getLevel();
					if(level == 1){
						$li.find('.jqtree-title').prepend('<img src="/admin/cms/article/img/world.png" style="margin: 0 3px 0 0;" />');
					}else{
						$li.find('.jqtree-title').prepend('<img src="/admin/cms/article/img/page.gif" style="margin: 0 3px 0 0;" />');
					}
					
					var selectedNodeId = $("#selectedNodeId").val();
					if(selectedNodeId == node.id){
						$li.find('.jqtree-element').css("background-color", "#B7C4E0");
					}
					
	    			var openinitFunction = "JqTreeLazyState.initNode($tree, " +
	    					"'" + node.id + "', " +
	    					"" + level + ", " +
	    					"'" + treeId + "'" +
	    				");JqTreeScroll.restore();";
	    			
	    			setTimeout(openinitFunction, 1);
				}
	        });
				        
			$tree.on(
				'click', '.manipulatenode',
				function(e) {
					// Get the id from the 'node-id' data property
					var node_id = $(e.target).data('node-id');
		
					// Get the node from the tree
					var node = $tree.tree('getNodeById', node_id);
		
					if (node) {
						var url = "/admin/cms/article/dialog/editNode.html";
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								nodeId: node_id
							},
							dataType: 'html',
							success: function(data) {
								$('#dialog').html(data);
								$( "#dialog" ).dialog( "open" );
							},
							error:function() {
								alert('Error occur');
							}
						});
					}
				}
			);
			
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
			
			$tree.bind(
				'tree.contextmenu',
				function(event) {
					// The clicked node is 'event.node'
					currentNode = event.node;
					$("#scroll-container").contextMenu({x: event.click_event.clientX, y: event.click_event.clientY});
				}
			);
			
			$tree.bind(
				'tree.move',
				function(event) {
					var url = "/admin/cms/article/moveHandler.alns";
					
					var movedNodeIdValue = event.move_info.moved_node.id;
					var targetNodeIdValue = event.move_info.target_node.id;
					var positionValue = event.move_info.position;
					var previousParentIdValue = event.move_info.previous_parent.id;
					
					$.ajax({
						type: 'POST',
						url: url,
						data: {
							cmd: "move",
							movedNodeId: movedNodeIdValue,
							targetNodeId: targetNodeIdValue,
							position: positionValue,
							previousParentId: previousParentIdValue,
							treeId : treeId
						},
						dataType: 'html',
						success: function(data) {
							
						},
						error:function() {
							alert('Error occur');
						}
					});
				}
			);
		}
	);

    $.contextMenu({
        selector: '#scroll-container', 
        callback: function(key, options) {
            if(key == 'edit_page'){
            	document.pagefrm.selectedNodeId.value = currentNode.id;
            	document.pagefrm.submit();
            }
            else if(key == 'add_page' || key == 'delete_page'){
				// Get the id from the 'node-id' data property
				var node_id = currentNode.id;
	
				// Get the node from the tree
				var node = $tree.tree('getNodeById', node_id);
	
				if (node) {
					var url = "/admin/cms/article/dialog/editNode.html";
					$.ajax({
						type: 'POST',
						url: url,
						data: {
							nodeId: node_id,
							key: key
						},
						dataType: 'html',
						success: function(data) {
							$('#dialog').html(data);
							$( "#dialog" ).dialog( "open" );
						},
						error:function() {
							alert('Error occur');
						}
					});
				}
            }
            else if(key == 'new_site'){
            	firstNode();
            }
        },
        items: {
        	"new_site": {name: "Create a new Website", icon: "/admin/cms/article/img/world.png"},
        	"sep2": "---------",
        	"add_page": {name: "Add a new page", icon: "/admin/cms/article/img/world.png"},
   		    "delete_page": {name: "Delete this page", icon: "/admin/cms/article/img/world.png"},
            "sep1": "---------",
            "edit_page": {name: "Edit Page (Double Click)", icon: "edit"}
        }
    });
	
	// bind 'tree.click' event
	$('#pageTree').on(
		'tree.dblclick',
		function(event) {
			// The clicked node is 'event.node'
			var node = event.node;
			
			JqTreeScroll.saveScrollPosition();
			
			document.pagefrm.selectedNodeId.value = node.id;
			document.pagefrm.submit();
		}
	);
	
}

var JqTreeScroll ={
	saveScrollPosition : function ()
	{
		var scrollPosition = document.getElementById("scroll-container").scrollTop;
		$.cookie("cms-tree-scroll", scrollPosition , {expires: 7});
	},
	restore : function ()
	{
		var scrollPosition = $.cookie("cms-tree-scroll");
		document.getElementById("scroll-container").scrollTop = scrollPosition;
	}
}