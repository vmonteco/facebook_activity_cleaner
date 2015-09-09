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


console.log("test1");

/*
** Variables :
*/

// Texts :
var confirm_text = "Do you want to delete everything?";

// Selectors :
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';
var activity_selector = 'div[class="pam _5shk uiBoxWhite bottomborder"]';
var delete_button_selector = 'a[class="_54nc"]';
var confirm_selector = 'button[class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy"]';
var activity_button = 'a[class="_42ft _42fu _4-s1 _2agf _p _42gx"]';
var month_header_selector = 'div[class="_iqq"]';
var day_header_selector = 'div[class="pam _5ep8 uiBoxWhite bottomborder"]';

// Flags :
var buttons_added = false;
var url_observer_launched = false;
var delete_observer_launched = false;
var set = false;
var running = false;

// Activities :
var activities = [];

// Settings :
var test = true;

console.log("test2");

/*
** Basic functions :
*/

function ask_for_confirmation(){
	console.log("test2-1");
	return confirm(confirm_text);
}

console.log("test3");

function check_timeline()
{
	console.log("test3-1");
	if (/(allactivity)/g.test($(location).attr('href'))){
		console.log("test3-2");
		return true;
	}
	console.log("test3-3");
	return false;
}

console.log("test4");

function add_button(text, code){
	console.log("test4-1");
	// Creating the button.
	var button = document.createElement('button');
	console.log("test4-2");	
	// Creating the text.
	var button_text = document.createTextNode(text);
	console.log("test4-3");
	// Getting the target element.
	var location = $(button_location);
	console.log("test4-4");
	// Setting button classes.
	button.className = button_classes;
	console.log("test4-5");
	// Making the button a submit button.
	button.setAttribute('type', 'submit');
	console.log("test4-6");	
	// Binding the code to the 'click' button event.
	button.addEventListener('click', code);
	console.log("test4-7");
	// Make the button append the text node.
	button.appendChild(button_text);
	console.log("test4-8");
	// make the location append the button.
	location.append(button);
	console.log("test4-9");
}

console.log("test5");

function reset(){	
	console.log("test5-1");
	buttons_added = false;
	console.log("test5-2");
	set = false;
	console.log("test5-3");
	if (delete_observer_launched){
		console.log("test5-4");
		delete_mutation_observer.disconnect();
		console.log("test5-5");
		delete_observer_launched = false;
		console.log("test5-6");
	}
	console.log("test5-7");
	running = false;
	console.log("test5-8");
}

console.log("test6");

function click_event(){
	console.log("test6-1");
	return new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': false
	});
}

console.log("test7");

function click_on_elem(elem){
	console.log("test7-1");
	elem[0].dispatchEvent(click_event());
}

console.log("test8");

function delete_activity(elem){
	console.log("test8-1");
	var button = $(elem).find(activity_button);
	console.log("test8-2");
	if (button && button.length > 0){
		console.log("test8-3");
		click_on_elem(button);
		console.log("test8-4");
	}
	else{
		console.log("test8-5");
		return;
	}
	console.log("test8-6");
	var delete_button = get_delete_button($(document).find(delete_button_selector));
	console.log("test8-7");
	if (test){
		console.log("test8-8");
		console.log('test : ');
		console.log(elem);
		console.log("test8-9");
		$(elem).remove();
		console.log("test8-10");
	}
	else if (delete_button && delete_button.length > 0){
		console.log("test8-11");
		click_on_elem(delete_button);
		console.log("test8-12");
		// confirm
		click_on_elem($(document).find(confirm_selector));
		console.log("test8-13");
	}
	console.log("test8-14");
}

console.log("test9");

function isheader(node){
	console.log("test9-1");
	return (node.matches(month_header_selector) || node.matches(day_header_selector));
}

console.log("test10");

/*
** Evolved functions :
*/

function add_all_button(){
	console.log("test10-1");
	var text = 'Delete ALL this shit!';
	console.log("test10-2");
	var fn = function(){
		console.log("test10-3");
		alert("delete all!");
		console.log("test10-4");
		delete_all_activity();
		console.log("test10-5");
	};
	add_button(text, fn);
	console.log("test10-6");
}

console.log("test11");

function add_one_button(){
	console.log("test11-1");
	var text = 'Delete ONE of this shit!';
	console.log("test11-2");
	var fn = function(){
		console.log("test11-3");
		alert('Delete one');
		console.log("test11-4");
	};
	console.log("test11-5");
	add_button(text, fn);
	console.log("test11-6");
}

console.log("test12");

function add_buttons(){
	console.log("test12-1");
	buttons_added = true;
	console.log("test12-2");
	set = true;
	console.log("test12-3");
	add_all_button();
	console.log("test12-4");
	add_one_button();
	console.log("test12-5");
}

console.log("test13");

function delete_current_activities(){
	console.log("test13-1");
	var fn = function(index, value){
		console.log("test13-2");
		console.log("Delete no " + index + " - object : " + value);
		delete_activity(value);
		console.log("test13-3");
		// Is this already removed if I delete it with the facebook button.?
		// $(value).remove();
		// console.log("test13-4");
	};
	console.log("test13-5");
	activities = get_activities()
	console.log("test13-6");
	activities.each(fn);
	console.log("test13-7");
}

console.log("test14");

function delete_current_headers(){
	console.log("test14-1");
	month_headers = $(document).find(month_selector);
	console.log("test14-2");
	day_headers = $(document).find(day_selector);
	console.log("test14-3");
	for (header in month_headers){
		console.log("test14-4");
		header.remove();
		console.log("test14-5");
	}
	console.log("14-6");
	for (header in day_headers){
		console.log("14-7");
		header.remove();
		console.log("14-8");
	}
	console.log("14-9");
	return true;
}

console.log("test15");

function delete_all_activity(){
	console.log("test15-1");
	if (ask_for_confirmation()){
		console.log("test15-2");
		running = true;
		console.log("test15-3");
		start_delete_observer();
		console.log("test15-3");
		delete_current_activities();
		console.log("test15-4");
		delete_current_headers();
		console.log("test15-5");
	}
}

console.log("test16");

/*
** Event handling functions :
*/

function handling_url_change(mutations){
	console.log("test16-1");
	mutations.forEach(function (mutation){
		console.log("test16-2");
		if (check_timeline()){
			console.log("test16-3");
			console.log("buttons added : " + buttons_added);
			if (!buttons_added){
				console.log("test16-4");
				var element = $(document).find(button_location);
				console.log("test16-5");
				if (element && element.length > 0){
					console.log("test16-6");
					add_buttons();
					console.log("test16-7");
				}
				console.log("test16-8");
			}
			console.log("test16-9");
		}else if (set){
			console.log("test16-10");
			reset();
			console.log("test16-11");
		}
		console.log("test16-12");
	});
	console.log("test16-13");
}

console.log("test17");

function handle_deletion(mutations){
	console.log("test17-1")
	mutations.forEach(function (mutation){
		console.log("test17-2");
		if (mutation.addedNodes){
			console.log("test17-3");
			for (var i = 0; i < mutation.addedNodes.length; i++){
				console.log("test17-4");
				if (isheader(mutation.addedNodes[i])){
					console.log("test17-5");
					mutation.addedNodes[i].remove()
					console.log("test17-6");
				}else if (isactivity(mutation.addedNodes[i])){
					console.log("test17-7");
					delete_activity(mutation.addedNodes[i]);
					console.log("test17-8");
				}
				console.log("test17-9");
				return true;
			}
			console.log("test17-10");
		}
		console.log("test17-11");
	});
	console.log("test17-12");
	return true;
}

console.log("test18");

/*
** Mutation observers :
*/

var url_mutation_observer = new MutationObserver(handling_url_change);

console.log("test19");

var delete_mutation_observer = new MutationObserver(handle_deletion);

console.log("test20");

/*
** Mutation observer starting functions :
*/

var dictionnary = {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
};

console.log("test21");

// Must start url_mutation_observer.
function start_url_observer(){
	console.log("test21-1");
	url_mutation_observer.observe(document, dictionnary);
	console.log("test21-2");
	url_observer_launched = true;
	console.log("test21-3");
}

console.log("test22");

function start_delete_observer(){
	console.log("test22-1");
	delete_mutation_observer.observer(document, dictionnary);
	console.log("test22-2");
	delete_observer_launched = true;
	console.log("test22-3");
}

/*
** Launching :
*/

console.log("test23");

function launch()
{
	console.log("test23-1");
	if (check_timeline()){
		console.log("test23-2");
		if (!buttons_added){
			console.log("test23-3");
			var element = $(document).find(button_location);
			console.log("test23-4");
			if (element && element.length > 0){
				console.log("test23-5");
				add_buttons();
				console.log("test23-6");
			}
			console.log("test23-7");
		}
		console.log("test23-8");
	}else if (set){
		console.log("test23-9");
		reset();
		console.log("test23-10");
	}
	if (!url_observer_launched){
		console.log("test23-11");
		start_url_observer();
		console.log("test23-12");
	}
}

console.log("test24");

launch();

console.log("test25");
