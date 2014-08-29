
var treeId = 'template-container';
var currentNode = null;

function initJqTree()
{
	var winHeight = document.body.clientHeight - 155;
	$("#scroll-container").css("height", winHeight + "px");
	
	$.getJSON(
		'/admin/cms/template-container/makejson.alns',
		function(data) {
			$tree = $('#pageTree').tree({
				dragAndDrop: true,
				data: data,
				saveState: true,
				onCreateLi: function(node, $li) {
					// add "dataid" in order to test with selenium
	    			$li.attr("dataid", node.id);
					
					/*
					$li.find('.jqtree-element').append(
						' [<a href="#node-'+ node.id +'" class="manipulatenode" data-node-id="'+
							node.id +'">edit</a>]'
					);
					*/
					
					var nodeType = node.nodeType;
					if(nodeType == 'category'){
						$li.find('.jqtree-title').prepend('<img src="/admin/cms/template-primitive/img/folder_table.png" style="margin: 0 3px 0 0;" />');
					}else{
						$li.find('.jqtree-title').prepend('<img src="/admin/cms/template-primitive/img/page_code.png" style="margin: 0 3px 0 0;" />');
					}
					
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
					
					var position = "after";
					var nodeType = node.nodeType;
					if(nodeType == 'category'){
						position = "inside";
					}
		
					if (node) {
						var url = "/admin/cms/template-container/dialog/editNode.html";
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								nodeId: node_id,
								position: position
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
					var url = "/admin/cms/template-container/moveHandler.alns";
					
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
			
			$tree.bind(
				'tree.contextmenu',
				function(event) {
					// The clicked node is 'event.node'
					currentNode = event.node;
					$("#scroll-container").contextMenu({x: event.click_event.clientX, y: event.click_event.clientY});
				}
			);
		}
	);
	
	// bind 'tree.click' event
	$('#pageTree').on(
		'tree.click',
		function(event) {
			// The clicked node is 'event.node'
			var node = event.node;
			
			var nodeType = node.nodeType;
			if(nodeType == 'category'){
				if(node.is_open){
					$tree.tree('closeNode', node, true);
				}else{
					$tree.tree('openNode', node);
				}
				
			}
		}
	);
	
	// bind 'tree.click' event
	$('#pageTree').on(
		'tree.dblclick',
		function(event) {
			// The clicked node is 'event.node'
			var node = event.node;
			
			var nodeType = node.nodeType;
			if(nodeType == 'category'){
				
				return;
			}
			
			document.partsFrm.selectedNodeId.value = node.id;
			document.partsFrm.submit();
		}
	);
	
    $.contextMenu({
        selector: '#scroll-container', 
        callback: function(key, options) {
            if(key == 'edit_template'){
            	document.partsFrm.selectedNodeId.value = currentNode.id;
            	document.partsFrm.submit();
            }
            else if(key == 'edit_tree' || key == 'delete_tree'){
				// Get the id from the 'node-id' data property
				var node_id = currentNode.id;
	
				// Get the node from the tree
				var node = $tree.tree('getNodeById', node_id);
				
				
				var position = "after";
				var nodeType = node.nodeType;
				if(nodeType == 'category'){
					position = "inside";
				}
					
				if (node) {
					var url = "/admin/cms/template-container/dialog/editNode.html";
					$.ajax({
						type: 'POST',
						url: url,
						data: {
							nodeId: node_id,
							position: position,
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
        },
        items: {
        	"edit_tree": {name: "Add Tree Node", icon: "/admin/cms/article/img/world.png"},
        	"delete_tree": {name: "Delete Tree Node", icon: "/admin/cms/article/img/world.png"},
            "sep1": "---------",
            "edit_template": {name: "Edit Page (Double Click)", icon: "edit"}
        }
    });
	
}