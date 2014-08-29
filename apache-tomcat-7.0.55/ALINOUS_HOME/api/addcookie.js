
function alinousAddCookie(key, value, expireDays)
{
	var extime = new Date().getTime();
	var expire = new Date(extime + (60*60*24*1000*expireDays));
	
	document.cookie = key + '=' + encodeURIComponent(value) + '; expires=' + expire.toUTCString()
		+ "; path=/";
}

alinousAddCookie('alinous_access_log', '##__VALUE__##', 365);
