
var ImportContent = {
	openDialog: function (form)
	{
		var url = "/admin/cms/article/dialog/ImportContents.html";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				selectedNodeId: form.selectedNodeId.value
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
	},
	fetchContents: function(form)
	{
		form.cmd.value = "fetch";
		
		var url = "/admin/cms/article/dialog/ImportContents.html";
		var fd = new FormData(form);
		$.ajax({
			type: 'POST',
			url: url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: function (data){
				$("#dialog").html(data);
			},
			error:function() {
				alert('Error occur');
			}
		});
	},
	filterContents: function(form)
	{
		form.cmd.value = "filter";
		
		var url = "/admin/cms/article/dialog/ImportContents.html";
		var fd = new FormData(form);
		$.ajax({
			type: 'POST',
			url: url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: function (data){
				$("#dialog").html(data);
			},
			error:function() {
				alert('Error occur');
			}
		});
	},
	import: function(form)
	{
		form.cmd.value = "import";
		
		var url = "/admin/cms/article/dialog/ImportContents.html";
		var fd = new FormData(form);
		$.ajax({
			type: 'POST',
			url: url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: function (data){
				$("#dialog").html(data);
				
				document.frm.cmd.value = "";
				document.frm.submit();
			},
			error:function() {
				alert('Error occur');
			}
		});
		
		$("#dialog").html("Please wait for importing...");
	}
};