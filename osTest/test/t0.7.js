function getViewName() {
	return gadgets.views.getCurrentView().getName();
}

function getUrlP() {
	output(gadgets.util.getUrlParameters()["parent"]);

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
	document.getElementById("txt").innerHTML += str+"</ br>";
}

//gadgets.util.registerOnLoadHandler(getViewName);