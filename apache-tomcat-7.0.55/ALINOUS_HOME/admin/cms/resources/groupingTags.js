
var ResourceTag = {
	url: "/admin/cms/resources/markResources.html",
	submitted: 0,
	loadDialog: function()
	{
		var resource_owner_type = $("#resource_owner_type").val();
		var resource_owner_id = $("#resource_owner_id").val();
		
		$.ajax({
			type: 'POST',
			url: ResourceTag.url,
			data: {
				resource_owner_type: resource_owner_type,
				resource_owner_id: resource_owner_id
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
	},
	
	deleteTag: function(form, cms_resource_group_id)
	{
		var bl = confirm("Are you sure to delete ?");
		if(!bl){
			return;
		}
		
		form.cms_resource_group_id.value = cms_resource_group_id;
		ResourceTag.submitForm(form, "delete");
	},
	
	submitForm: function(form, cmd)
	{
		form.cmd.value = cmd;
		
		var fd = new FormData(form);
		$.ajax({
			type: 'POST',
			url: ResourceTag.url,
			processData: false,
			contentType: false,
			data: fd,
			dataType: 'html',
			success: function (data){
				$('#dialog').html(data);
			},
			error:function() {
				alert('Error occur');
			}
		});
		
		ResourceTag.submitted = 1;
	},
	
	closeDialog: function()
	{
		if(ResourceTag.submitted > 0){
			document.frm.cmd.value = '';
			document.frm.submit();
		}else{
			$( "#dialog" ).dialog( "close" );
		}
	}
};
