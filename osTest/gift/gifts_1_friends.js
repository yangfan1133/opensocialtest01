function loadFriends() {
	var req=opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');

	var viewerFriends=opensocial.newIdSpec({"userId":"VIEWER","groupId":"FRIENDS"});
	var opt_params={};
	opt_params[opensocial.DataRequest.PeopleRequestFields.MAX]=100;//要获取的最大项目数
	req.add(req.newFetchPeopleRequest(viewerFriends, opt_params), 'viewerFriends');

	req.send(onLoadFriends);
}

function onLoadFriends(data) {
	var viewer=data.get('viewer').getData();
	var viewerFriends=data.get('viewerFriends').getData();

	html = new Array();
	html.push('<li>viewer name:'+viewer.getDisplayName()+'</li>');
	html.push('<ul>');
	viewerFriends.each(function(person) {
	            if (person.getId()) {//The simple check for person.getId() assures that only mutual friends are loaded.
	              html.push('<li>', person.getDisplayName(), '</li>');
	            }
	          });
	html.push('</ul>');
	
	document.getElementById('friends').innerHTML=html.join('');
	gadgets.window.adjustHeight();
}

function init() {
	loadFriends();
}

gadgets.util.registerOnLoadHandler(init);