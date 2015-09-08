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

// Selectors :
var button_location = 'div[class="_2o3t fixed_elem"]';
var button_classes = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';


// Flags :
var buttons_added = false;
var url_observer_launched = false;


/*
** Basic functions :
*/

console.log("test2");

function check_timeline()
{
	console.log("test2-1");
	if (/(allactivity)/g.test($(location).attr('href'))){
		console.log("test2-2");
		return true;
	}
	console.log("test2-3");
	return false;
}

console.log("test3");

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

console.log("test4");

function reset(){
	return true;
}

console.log("test5");

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

console.log("test6");

function add_one_button(){
	var text = 'Delete ONE of this shit!';
	var fn = function(){
		alert('Delete one');
	};
	add_button(text, fn);
}

console.log("test7");

function add_buttons(){
	console.log("test7-1");
	buttons_added = true;
	console.log("test7-2");
	add_all_button();
	console.log("test7-3");
	add_one_button();
	console.log("test7-4");
}

/*
** Event handling functions :
*/

console.log("test8");

function handling_url_change(mutations){
	console.log("test8-1");
	mutations.forEach(function (mutation){
		console.log("test8-2");
		if (check_timeline()){
			console.log("test8-3");
			console.log("buttons added : " + buttons_added);
			if (!buttons_added){
				console.log("test8-4");
				var element = $(document).find(button_location);
				console.log("test8-5");
				if (element && element.length > 0){
					console.log("test8-6");
					add_buttons();
					console.log("test8-7");
				}
				console.log("test8-8");
			}
			console.log("test8-9");
		}else{
			console.log("test8-10");
			reset();
			console.log("test8-11");
		}
		console.log("test8-12");
	});
};

/*
** Mutation observers :
*/

console.log("test9");

var url_mutation_observer = new MutationObserver(handling_url_change);

/*
** Mutation observer starting functions :
*/

console.log("test10");

var dictionnary = {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
};

console.log("test11");

// Must start url_mutation_observer.
function start_url_observer(){
	console.log("test11-1");
	url_mutation_observer.observe(document, dictionnary);
	console.log("test11-2");
	url_observer_launched = true;
	console.log("test11-3");
}

/*
** Launching :
*/

console.log("test12");

function launch()
{
	console.log("test12-1");
	if (check_timeline()){
		console.log("test12-2");
		if (!buttons_added){
			console.log("test12-3");
			var element = $(document).find(button_location);
			console.log("test12-4");
			if (element && element.length > 0){
				console.log("test12-5");
				add_buttons();
				console.log("test12-6");
			}
			console.log("test12-7");
		}
	}else{
		console.log("test12-8");
		reset();
		console.log("test12-9");
	}
	if (!url_observer_launched){
		console.log("test12-10");
		start_url_observer();
		console.log("test12-11");
	}
	console.log("test12-12");
}

console.log("test13");

launch();

console.log("test14");
