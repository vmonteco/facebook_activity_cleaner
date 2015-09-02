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

console.log('foo');

//var activities = [];
var count = 1;
var one = false;
var test = true;
var launched = false;

// Ask for confirmation.
function ask_for_confirmation()
{
	return confirm('Do you really want to delete ALL this shit?');
}

//Checks if it is the right page.
function check_timeline()
{
	if (/(allactivity)/g.test($(location).attr('href')))
		return true;
	return false;
}
function get_button_with_word(word)
{
	return $(this).find('a:contains("{0}")'.format(word));
}

//Get the button to delete an activity.
function get_delete_button()
{
	var commands = [
		'Delete',
		'Hidden from Timeline'
	];
	for (word in commands)
	{
		var button = get_button_with_word(word);
		if (button)
			return button;
	}
	return null;
}

function click_on_elem(elem)
{
	console.log('test2-1');
	var event = new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': false
	});
	//var event = new MouseEvent("click");
	console.log('Just clicked on ' + elem);
	elem.dispatchEvent(event);
}

// Delete current activity.
function delete_activity(elem)
{
	// click on button on the right of the elem
	console.log(elem);
	console.log('test1-1-1');
	//console.log(elem.find);
	var button = elem.find('a[class="_42ft _42fu _4-s1 _2agf _p _42gx"]');
	// console.log(Object.keys(elem));
	console.log('test1-1-2');
	console.log(button);
	// button.click();
	//click_on_elem(button);
	// get the right button and click on it.
	console.log('test1-2');
	var delete_button = get_delete_button($(document).find('a[classe="_54nc"'));
	console.log('test1-3');
	if (one)
		count = count - 1;
	console.log('test1-4');
	if (delete_button)
	{
		console.log('test1-5');
		if (test)
			console.log('test : {0}'.format(elem));
		else
			delete_button.click();
		// confirm
		$(document).find('button[class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy"]').click();
	}
	return true;
}

// // Function triggered by the button "delete all activity".
function delete_all_activity()
{
	var activities = [
	];
	if (ask_for_confirmation())
	{
		console.log('I\'m in!');
		while (activities = get_activities())
		{
			console.log('I\'m in bis.');
			if (count == 0 && one)
			{
				console.log('returns no 1');
				return true;
			}
			console.log('test1');
			activities.each(function (index, value) {
				console.log('test2');
				console.log('del no ' + index + ' object : ' + value);
				delete_activity(value);
			});
			activities.each(function ()
							{
								console.log('test3');
								this.remove();
							});
			console.log('test4');
			activities = [
			];
		}
	}
	return true;
}

// Scroll down to load more activities
function scroll()
{
	return scrollTo(0, 1000000000);
}

// get all activity loaded on screen
function get_activities()
{
	var activities = $(document).find('div[class="pam _5shk uiBoxWhite bottomborder"]');
	scroll();
	return activities;
}

// function to add a button
function add_button(text, code)
{
	var button = document.createElement('button');
	var button_text = document.createTextNode(text);
	var location = $('div[class="uiHeader _a4f"]');
	button.className = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy';
	button.setAttribute('type', 'submit');
	// button.setAttribute("onclick", code);
	// button.click(code);
	button.addEventListener('click', code);
	button.appendChild(button_text);
	location.append(button);
}

function add_all_button()
{
	add_button('Delete ALL this shit!', function () {
		delete_all_activity()
	});
}

function add_one_button()
{
	add_button('Delete ONE of this shit!', function () {
		alert('Delete_one')
	});
}

// Main function, only add buttons
function main()
{
	add_all_button();
	add_one_button();
}

// function sleep(milliseconds)
// {
// 	var start = new Date().getTime();
// 	for (far i = 0; i < 1e7; i++)
// 	{
// 		if ((new Date().getTime() - start) > milliseconds)
// 		{
// 			break;
// 		}
// 	}
// }

function init()
{
	console.log('Launched : ' + launched);
	if (!launched)
	{
		launched = true;
		main();
	}
}

console.log('barfoo');

// $(document).ready(function () {
// 	console.log("ready");
// 	console.log("Launched : " + launched);
// 	if (!launched)
// 	{
// 		launched = true;
// 		main();
// 	}
// });

function detect_node_for_buttons(mutations)
{
	var selector = 'div[class="pam _5shk uiBoxWhite bottomborder"]';
	mutations.forEach(function (mutation)
					  {
						  if ($(document).find(selector))
						  {
							  console.log("found");
							  init();
						  }
						  if (!mutation.addedNodes) return;
						  for (var i = 0; i < mutation.addedNodes.length; i++)
						  {
							  console.log(mutation.addedNodes[i]);
							  if (mutation.addedNodes[i].matches(selector))
							  {
								  console.log(mutation.addedNodes[i]);
								  console.log('init');
								  init();
							  }
						  }
					  });
									
}

if (check_timeline())
{
	var observer = new MutationObserver(function (mutations)
										{
											detect_node_for_buttons(mutations);
										});
}

console.log('bar');

// try
// {
//   observer.observe(document.body, {
//     childlist: true,
//     subtree: true,
//     attributes: false,
//     characterData: false,
//   });
// } 
// catch (error)
// {
//   console.log(error);
// }

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
});

console.log('foobar');
