$(function() {
	$( "#items-catalog" ).accordion();
	$( "#items-catalog li" ).draggable({
		appendTo: "body",
		helper: "clone"
	});
	$("#contents1").sortable({
		items: "li:not(.placeholder)",
		sort: function() {
			$( this ).removeClass( "ui-state-default" );
		}
	});
	$("#contents2").sortable({
		items: "li:not(.placeholder)",
		sort: function() {
			$( this ).removeClass( "ui-state-default" );
		}
	});
	
	$("#contents1").droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper)",
			drop: function( event, ui ) {
				$( this ).find( ".placeholder" ).remove();
				
				var tmplid = ui.draggable.attr("tmplid");
				var tmpltype = ui.draggable.attr("tmpltype");
				var position = 'left';
				var url = "/admin/cms/template-container/edit/part.html";
				
				var olTag = this.children[0];
				
				var estimated_height = ui.draggable.attr("estimated-height");
				estimated_height = estimated_height / 2;
				// alert(estimated_height);
				
				$.ajax({
					type: 'POST',
					url: url,
					data: {
						tmplid: tmplid,
						tmpltype: tmpltype,
						position: position
					},
					dataType: 'html',
					success: function(data) {
						$( "<li></li>" ).html(data)
							.css("padding", "5px 5px 5px 5px")
							.css("border", "1px solid orange")
							.css("height", estimated_height)
							.css("display", "block")
							.appendTo( olTag );
					},
					error:function() {
						alert('Error occur');
					}
				});
			}
	});
	$("#contents2").droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper)",
			drop: function( event, ui ) {
				$( this ).find( ".placeholder" ).remove();
				
				var tmplid = ui.draggable.attr("tmplid");
				var tmpltype = ui.draggable.attr("tmpltype");
				var position = 'right';
				var url = "/admin/cms/template-container/edit/part.html";
				
				var olTag = this.children[0];
				
				$.ajax({
					type: 'POST',
					url: url,
					data: {
						tmplid: tmplid,
						tmpltype: tmpltype,
						position: position
					},
					dataType: 'html',
					success: function(data) {
						$( "<li></li>" ).html(data)
							.css("padding", "5px 5px 5px 5px")
							.css("border", "1px solid orange")
							.css("bgcolor", "#362b36")
							.appendTo( olTag );
					},
					error:function() {
						alert('Error occur');
					}
				});
			}
	});
});

var TemplateCallback = {
	remove: function(buttonDom)
	{
		var bl = confirm("Are you sure to remove ?");
		if(!bl){ return; }
		
		var li = buttonDom.parentNode;
		var ol = li.parentNode;
		
		// li.remove();
		ol.removeChild(li);
		
		if(ol.children.length == 0){
			$('<li class="placeholder">Add your items here</li>').appendTo(ol);
		}
		
		return;
	},
	submit: function (form, cmd)
	{
		form.cmd.value = cmd;
		form.submit();
	}
};

