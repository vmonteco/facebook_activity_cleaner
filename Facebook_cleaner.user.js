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

// Flags.
var launched = false;
var test = false;

// Selectors
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';
var activity_button = 'a[class="_42ft _42fu _4-s1 _2agf _p _42gx"]';
var delete_button_selector = 'a[class="_54nc"]';
var confirm_selector = 'button[class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy"]';

/*
** Basic functions.
*/

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

function click_event(){
	return new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': false
	});
}

function click_on_elem(elem){
	elem.dispatchEvent(click_event());
}

/*
** Evolved functions.
*/

function delete_all_activity(){
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

function detect_node_for_buttons(mutations){
	mutations.forEach(function (mutation){
		var element = $(document).find(button_location);
		if (element){
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
** Init() main().
*/

function main(){
	if (!launched){
		launched = true;
		add_all_button();
		add_one_button();
	}
}

/*
** MutationObserver.
*/

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
