function getViewName() {
	return gadgets.views.getCurrentView().getName();
}

function getUrlP() {
	output(gadgets.util.getUrlParameters()["parent"]);//父网址

	var supported_views = gadgets.views.getSupportedViews();
	output("supported_views['canvas'] = "+supported_views["canvas"]);

	var application_id = gadgets.util.getUrlParameters()["gadgetId"];//获取应用程序的 ID
	output("application_id = "+application_id);

	output("~~~~");
}
getUrlP();


if (getViewName()=="canvas") {
	/* Do canvas specific stuff here */
	output(getViewName());
}

if (getViewName()=="profile") {
	/* Do profile specific stuff here */
	output(getViewName());
}

function output(str){
	document.getElementById("txt").innerHTML += str+"<br />";
}

//gadgets.util.registerOnLoadHandler(getViewName);