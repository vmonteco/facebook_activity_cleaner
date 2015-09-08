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
** Variables :
*/

// Selectors :
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';


// Flags :
var buttons_added = false;
var url_observer_launched = false;
var set = false;

/*
** Basic functions :
*/

function check_timeline()
{
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

function reset(){
	buttons_added = false;
	set = false;
	return true;
}

/*
** Evolved functions :
*/

function add_all_button(){
	var text = 'Delete ALL this shit!';
	var fn = function(){
		alert("delete all!");
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

function add_buttons(){
	buttons_added = true;
	set = true;
	add_all_button();
	add_one_button();
}

/*
** Event handling functions :
*/

console.log("test8");

function handling_url_change(mutations){
	mutations.forEach(function (mutation){
		if (check_timeline()){
//			console.log("buttons added : " + buttons_added);
			if (!buttons_added){
				var element = $(document).find(button_location);
				if (element && element.length > 0){
					add_buttons();
				}
			}
		}else if (set){
			reset();
		}
	});
};

/*
** Mutation observers :
*/

var url_mutation_observer = new MutationObserver(handling_url_change);

/*
** Mutation observer starting functions :
*/

var dictionnary = {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
};

// Must start url_mutation_observer.
function start_url_observer(){
	url_mutation_observer.observe(document, dictionnary);
	url_observer_launched = true;
}

/*
** Launching :
*/

function launch()
{
	if (check_timeline()){
		if (!buttons_added){
			var element = $(document).find(button_location);
			if (element && element.length > 0){
				add_buttons();
			}
		}
	}else if (set){
		reset();
	}
	if (!url_observer_launched){
		start_url_observer();
	}
}

launch();
