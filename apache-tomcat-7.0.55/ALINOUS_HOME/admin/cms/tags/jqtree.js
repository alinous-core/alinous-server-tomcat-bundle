
var treeId = 'tag';
var currentNode = null;

function initJqTree(site)
{
	var winHeight = document.body.clientHeight - 150;
	$("#scroll-container").css("height", winHeight + "px");
	
	JqTreeScroll.restore();
	
	
	$.getJSON(
		'/admin/cms/tags/makejson.alns?site='+ site,
		function(data) {
			$tree = $('#pageTree').tree({
				dragAndDrop: true,
				data: data,
				saveState: true,
				onCreateLi: function(node, $li) {
					// add "dataid" in order to test with selenium
	    			$li.attr("dataid", node.id);
					$li.find('.jqtree-element').append(
						' [<a href="#node-'+ node.id +'" class="manipulatenode" data-node-id="'+
							node.id +'">edit</a>]'
					);
					
					$li.find('.jqtree-title').prepend('<img src="/admin/cms/tags/img/tag_red.png" style="margin: 0 3px 0 0;" />');
					
					var selectedNodeId = $("#selectedNodeId").val();
					if(selectedNodeId == node.id){
						$li.find('.jqtree-element').css("background-color", "#B7C4E0");
					}
					
	    			var level = node.getLevel();
	    			var openinitFunction = "JqTreeLazyState.initNode($tree, " +
	    					"'" + node.id + "', " +
	    					"" + level + ", " +
	    					"'" + treeId + "'" +
	    				")";
	    			setTimeout(openinitFunction, 10);
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
						var url = "/admin/cms/tags/dialog/editTag.html";
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
				'tree.move',
				function(event) {
					var url = "/admin/cms/tags/moveHandler.alns";
					
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
	
	
	// bind 'tree.click' event
	$('#pageTree').on(
		'tree.dblclick',
		function(event) {
			JqTreeScroll.saveScrollPosition();
			
			// The clicked node is 'event.node'
			var node = event.node;
			
			document.tagFrm.selectedNodeId.value = node.id;
			document.tagFrm.submit();
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