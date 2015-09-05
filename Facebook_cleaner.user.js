// ==UserScript==
// @name        Facebook_cleaner
// @namespace   Facebook_cleaner
// @description cleans facebook timeline
// @include     http://*.facebook.com/*
// @include     https://*.facebook.com/*
// @require     http://code.jquery.com/jquery-1.7.1.min.js
// @version     1
// @grant       none
// ==/UserScript==

/*
** Variables.
*/

console.log("test0");

// Texts :
var confirm_text = "Do you want to delete everything?";

// Flags :
var launched = false;
var test = false;

// Selectors :
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';
var activity_button = 'a[class="_42ft _42fu _4-s1 _2agf _p _42gx"]';
var activity_selector = 'div[class="pam _5shk uiBoxWhite bottomborder"]';
var delete_button_selector = 'a[class="_54nc"]';
var confirm_selector = 'button[class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy"]';

console.log("test1");

/*
** Basic functions.
*/

function check_timeline()
{
	if (/(allactivity)/g.test($(location).attr('href')))
		return true;
	return false;
}

console.log("test1bis");

function add_button(text, code){
	console.log("test1bis");
	
	// Creating the button.
	var button = document.createElement('button');
	
	// Creating the text.
	var button_text = document.createTextNode(text);
	
	// Getting the target element.
	var location = $(button_location);
	
	// Setting button classes.
	button.className = button_classes;

	// Making the button a submit button.
	button.setAttribute('type', 'submit');
	
	// Binding the code to the 'click' button event.
	button.addEventListener('click', code);
	
	// Make the button append the text node.
	button.appendChild(button_text);

	// make the location append the button.
	location.append(button);

	console.log("test1bis-2");
}

console.log("test1ter");

function ask_for_confirmation(){
	console.log("test1ter1");
	return confirm(confirm_text);
}

console.log("test2");

function delete_activity(elem){
	var button = elem.find(activity_button);
	click_on_elem(button);
	var delete_button = get_delete_button($(document).find(delete_button_selector));
	if (delete_button){
		if (test)
			console.log('test : {0}'.format(elem));
		else{
			click_on_elem_button(delete_button);
			// confirm
			click_on_elem($(document).find(confirm_selector));
		}
	}
}

console.log("test3");

function click_event(){
	return new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': false
	});
}

console.log("test4");

function get_activities(){
	console.log("test4-1");
	var activities = $(document).find(activity_selector);
	console.log("test4-2");
	console.log(activities);
	return activities;
}

console.log("test4bis");

function click_on_elem(elem){
	elem.dispatchEvent(click_event());
}

console.log("test5");

/*
** Evolved functions.
*/

function delete_all_activity(){
	console.log("test5-1");
	var activities = [];
	var fn = function(index, value){
		console.log("test5-2");
		console.log("Delete no " + index + " - object : " + value);
		delete_activity(value);
		console.log("test5-3");
		this.remove();
		console.log("test5-4");
	};
	if (ask_for_confirmation()){
		console.log("test5-5");
		while (activities = get_activities()){
			console.log("test5-6");
			activities.each(fn);
			console.log("test5-7");
			activities = [];
		}
	}
	return true;
}

console.log("test6");

function add_all_button(){
	console.log("test6-1");
	var text = 'Delete ALL this shit!';
	var fn = function(){
		delete_all_activity();
	};
	add_button(text, fn);
	console.log("test6-2");
}

console.log("test7");

function add_one_button(){
	console.log("test7-1");
	var text = 'Delete ONE of this shit!';
	var fn = function(){
		alert('Delete one');
	};
	add_button(text, fn);
	console.log("test7-2");
}

console.log("test8");

// main().

function main(){
	console.log("test8-1");
	console.log("launched state : " + launched);
	if (!launched){
		console.log("test8-2");
		launched = true;
		console.log("test8-3");
		add_all_button();
		console.log("test8-4");
		add_one_button();
		console.log("test8-5");
	}
}

console.log("test9");

function detect_node_for_buttons(mutations){
	console.log("test9-1");
	mutations.forEach(function (mutation){
		console.log("test9-2");
		var element = $(document).find(button_location);
		if (element){
			console.log("test9-3");
			main();
			console.log("test9-4");
			observer.disconnect();
			console.log("test9-5");
			return;
		}
		console.log("test9-6");
		if (!mutation.addedNodes) return;
		console.log("test9-7");
		for (var i = 0; i < mutation.addedNodes.length; i++){
			console.log("test9-8");
			if (mutation.addedNodes[i].matches(button_location)){
				console.log("test9-9");
				main();
				console.log("test9-10");
				observer.disconnect();
				console.log("test9-11");
				return;
			}
		}
	});
}

console.log("test10");

/*
** MutationObserver.
*/

if (check_timeline()){
	console.log("test10-1");
	var observer = new MutationObserver(function (mutations){
		detect_node_for_buttons(mutations);
	});
}

console.log("test11");

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
});

console.log("test12");
