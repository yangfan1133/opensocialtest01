var givenGifts={};
var globalGiftList=['a cashew nut','a peanut','a hazelnut','a red pistachio nut'];

function updateReceivedList(viewer, data, friends) {
	var viewerId=viewer.getId();

	var html = new Array();
	html.push('You have received:<ul>');
	friends.each(function(person) {
	            if (data[person.getId()]) {
	              var json = data[person.getId()]['gifts'];
	
	              var gifts = {}
	              if (!json) {
	                gifts = {};
	              }
	              try {
	                gifts = gadgets.json.parse(gadgets.util.unescapeString(json));
	              } catch (e) {
	                gifts = {};
	              }
	
	              for (i in gifts) {
	                if (i.hasOwnProperty && i == viewerId) {
	                  html.push('<li>', globalGiftList[gifts[i]], ' from ', person.getDisplayName(), '</li>');
	                }
	              }
	            }
	          });
	html.push('</ul>');
	document.getElementById('received').innerHTML=html.join('');
}

function updateGiftList(viewer, data, friends) {
	var json=null;
	if (data[viewer.getId()]) {
		json=data[viewer.getId()]['gifts'];
	}

	if (! json) {
		givenGifts={};
	}
	try {
		givenGifts=gadgets.json.parse(gadgets.util.unescapeString(json));
	} catch (e) {
		givenGifts={};
	}

	var html = new Array();
	html.push('You have given:');
	html.push('<ul>');
	for (i in givenGifts) {
		if (i.hasOwnProperty) {
			html.push('<li>', friends.getById(i).getDisplayName(), ' received ', globalGiftList[givenGifts[i]], '</li>');
		}
	}
	html.push('</ul>');
	document.getElementById('given').innerHTML=html.join('');
}

function giveGift() {
	var nut=document.getElementById('nut').value;
	var friend=document.getElementById('person').value;

	givenGifts[friend]=nut;
	var json=gadgets.json.stringify(givenGifts);

	var req=opensocial.newDataRequest();
	req.add(req.newUpdatePersonAppDataRequest("VIEWER", 'gifts', json));
	req.add(req.newFetchPersonRequest("VIEWER"), 'viewer');

	var viewerFriends=opensocial.newIdSpec({"userId":"VIEWER","groupId":"FRIENDS"});
	var opt_params={};
	opt_params[opensocial.DataRequest.PeopleRequestFields.MAX]=100;
	req.add(req.newFetchPeopleRequest(viewerFriends, opt_params), 'viewerFriends');

	var viewer=opensocial.newIdSpec({"userId":"VIEWER"});
	req.add(req.newFetchPersonAppDataRequest(viewer, 'gifts'), 'data');

	req.add(req.newFetchPersonAppDataRequest(viewerFriends, 'gifts', opt_params), 'viewerFriendData');
	req.send(onLoadFriends);
}

function makeOptionsMenu() {
	var html = new Array();
	html.push('<select id="nut">');
	for (var i = 0; i < globalGiftList.length; i++) {
		html.push('<option value="', i, '">', globalGiftList[i], '</option>');
	}
	html.push('</select>');
	document.getElementById('gifts').innerHTML=html.join('');
}

function loadFriends() {
	var req=opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest("VIEWER"), 'viewer');

	var viewerFriends=opensocial.newIdSpec({"userId":"VIEWER","groupId":"FRIENDS"});
	var opt_params={};
	opt_params[opensocial.DataRequest.PeopleRequestFields.MAX]=100;
	req.add(req.newFetchPeopleRequest(viewerFriends, opt_params), 'viewerFriends');

	var viewer=opensocial.newIdSpec({"userId":"VIEWER"});
	req.add(req.newFetchPersonAppDataRequest(viewer, 'gifts'), 'data');

	req.add(req.newFetchPersonAppDataRequest(viewerFriends, 'gifts', opt_params), 'viewerFriendData');
	req.send(onLoadFriends);
}

function onLoadFriends(data) {
	var viewer=data.get('viewer').getData();
	var viewerFriends=data.get('viewerFriends').getData();
	var giftData=data.get('data').getData();
	var viewerFriendData=data.get('viewerFriendData').getData();

	html = new Array();
	html.push('<select id="person">');
	viewerFriends.each(function(person) {
	            if (person.getId()) {
	              html.push('<option value="', person.getId(), '">', person.getDisplayName(), '</option>');
	            }
	          });
	html.push('</select>');
	document.getElementById('friends').innerHTML=html.join('');

	updateGiftList(viewer, giftData, viewerFriends);
	updateReceivedList(viewer, viewerFriendData, viewerFriends);
}

function init() {
	loadFriends();
	makeOptionsMenu();
}

gadgets.util.registerOnLoadHandler(init);