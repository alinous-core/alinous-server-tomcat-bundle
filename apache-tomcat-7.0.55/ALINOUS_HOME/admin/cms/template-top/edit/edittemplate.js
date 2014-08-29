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
				var url = "/admin/cms/template-top/edit/part.html";
				
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
				var url = "/admin/cms/template-top/edit/part.html";
				
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
	
	$(".paramsettingbtn").click(function (){
		var url = "/admin/cms/template-top/preview/index.html";
		
		var currentTemplateId = document.frm.currentTemplateId.value;
		
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				currentTemplateId: currentTemplateId
			},
			dataType: 'html',
			success: function(data) {
				$('#dialog').html(data);
			},
			error:function() {
				alert('Error occur');
			}
		});
		
		
		$( "#dialog" ).dialog( "open" );
	});
	
	$(".apply").click(function (){
		var bl = confirm("Are you sure to use latest one of this template on publish ?");
		if(!bl){
			return;
		}
				
		this.form.cmd.value = "apply";
		this.form.submit();
	});
	
	$(".previewbtn").click(function (){
		if(document.frm.dirty.value == 1){
			alert("Save before preview by the button below.");
			return;
		}
		
		var cookieName = "param_top_" + document.frm.currentTemplateId.value;
		
		var paramSetting = $.cookie(cookieName);
		
		if(paramSetting == null){
			alert("Setup parameters to review before do it.");
			return;
		}
		
		var templatePath = "/admin/cms/template-top/preview/preview.html";
		var previewPath = templatePath + "?currentTemplateId=" + document.frm.currentTemplateId.value;
		//alert(previewPath);
		
		cookieName = "param_top_preview_" + document.frm.currentTemplateId.value;
		var sizevalue = $.cookie(cookieName);
		var sizes = sizevalue.split(",");
		var winWidth = parseInt(sizes[0]);
		var winHeight = parseInt(sizes[1]);
		
		// alert(winWidth + "," + winHeight);
		
		var w = ( screen.width-winWidth ) / 2;
		var h = ( screen.height-winHeight ) / 2;
		
		myWin = window.open(previewPath, "preview",
		            "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
		           	+",left="+w+",top="+h);
		
		myWin.focus();
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
