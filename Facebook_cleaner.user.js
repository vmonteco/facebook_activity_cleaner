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
** No conflict mode :
*/

//jQuery.noConflict();


/*
** Variables.
*/

// Texts :
var confirm_text = "Do you want to delete everything?";

// Flags :
var launched = false;
var test = true;

// Selectors :
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';
var activity_button = 'a[class="_42ft _42fu _4-s1 _2agf _p _42gx"]';
//var activity_button = 'a[class="_42ft _42fu _4-s1 _2agf _p _42gx"], a[class="rfloat"]';
var activity_selector = 'div[class="pam _5shk uiBoxWhite bottomborder"]';
var delete_button_selector = 'a[class="_54nc"]';
var confirm_selector = 'button[class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy"]';

/*
** Basic functions.
*/

function sleep(milliseconds)
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++)
	{
		if ((new Date().getTime() - start) > milliseconds)
		{
			break;
		}
	}
}

function check_timeline()
{
	// NB : It only works if the URL matches exactly "/allactivity". "/allactivity#" didn't work.
	// NB2 : nevermind.
	if (/(allactivity)/g.test($(location).attr('href'))){
		return true;
	}
	return false;
}

function add_button(text, code){	
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
}

function ask_for_confirmation(){
	return confirm(confirm_text);
}

function get_button_with_word(word){
	var selector = 'a:contains("' + word + '")';
	var button =  $(document).find(selector);
	return button;
}

function get_delete_button()
{
	var commands = [
		'Delete',
		'Hidden from Timeline'
	];
	for (word in commands){
		var button = get_button_with_word(word);
		if (button){
			return button;
		}
	}
	return null;
}

// function delete_activity(elem){
// 	var button = $(elem).find(activity_button);
// 	click_on_elem(button);
// 	var delete_button = get_delete_button($(document).find(delete_button_selector));
// 	if (delete_button){
// 		if (test){
// 			console.log('test : ' + elem);
// 		}
// 		else{
// 			click_on_elem(delete_button);
// 			// confirm
// 			click_on_elem($(document).find(confirm_selector));
// 		}
// 	}
// }

function delete_activity(elem){
	var button = $(elem).find(activity_button);
	if (button && button.length > 0){
		click_on_elem(button);
	}
	else{
		return;
	}
	var delete_button = get_delete_button($(document).find(delete_button_selector));
	if (test){
		console.log('test : ');
		console.log(elem);
	}
	else if (delete_button && delete_button.length > 0){
			click_on_elem(delete_button);
			// confirm
			click_on_elem($(document).find(confirm_selector));
	}
}

function click_event(){
	return new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': false
	});
}

function scroll(){
	return scrollTo(0, 1000000000);
}

function get_activities(){
	var activities = $(document).find(activity_selector);
	scroll();
	sleep(5000);
	return activities;
}

function click_on_elem(elem){
	elem[0].dispatchEvent(click_event());
}

/*
** Evolved functions.
*/

function delete_all_activity(){
	var activities = [];
	var fn = function(index, value){
		console.log("Delete no " + index + " - object : " + value);
		delete_activity(value);
		$(value).remove();
	};
	if (ask_for_confirmation()){
		while (activities = get_activities()){
			console.log(activities);
			activities.each(fn);
			activities = [];
		}
	}
	return true;
}

function add_all_button(){
	var text = 'Delete ALL this shit!';
	var fn = function(){
		delete_all_activity();
	};
	add_button(text, fn);
}

function add_one_button(){
	var text = 'Delete ONE of this shit!';
	var fn = function(){
		alert('Delete one');
	};
	add_button(text, fn);
}

// main().

function main(){
	if (!launched){
		launched = true;
		add_all_button();
		add_one_button();
	}
}

function detect_node_for_buttons(mutations){
	mutations.forEach(function (mutation){
		var element = $(document).find(button_location);
		if (launched){
			return;
		}
		if (element && element.length > 0){
			main();
			observer.disconnect();
			return;
		}
		if (!mutation.addedNodes) return;
		for (var i = 0; i < mutation.addedNodes.length; i++){
			if (mutation.addedNodes[i].matches(button_location)){
				main();
				observer.disconnect();
				return;
			}
		}
	});
}

/*
** MutationObserver.
*/

$(window).bind('hashchange', function() {
	console.log("TEST");
	if (check_timeline()){
		var observer = new MutationObserver(function (mutations){
			detect_node_for_buttons(mutations);
		});
	}
});

if (check_timeline()){
	var observer = new MutationObserver(function (mutations){
		detect_node_for_buttons(mutations);
	});
}


observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
});
