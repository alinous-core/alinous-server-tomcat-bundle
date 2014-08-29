
var ImporterJs = {
	newImporter: function(){
		var url = "/admin/cms/importer/dialog/newImporterDlg.html";
		$.ajax({
			type: 'POST',
			url: url,
			data: {},
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
	delete: function (form, content_importer_id)
	{
		var bl = confirm("Are you sure to delete ?");
		if(!bl){
			return;
		}
		
		form.content_importer_id.value = content_importer_id
		form.cmd.value = "delete";
		form.submit();
	},
	editImporter: function (content_importer_id)
	{
		var url = "/admin/cms/importer/dialog/editImporterDlg.html";
		$.ajax({
			type: 'POST',
			url: url,
			data: {content_importer_id: content_importer_id},
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
};