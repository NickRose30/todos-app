// THIS IS OUR FRONTEND JAVASCRIPT FILE FOR OUR SINGLE PAGE APPLICATION //
// We only have one aspect to our application, the todos. If we had users or 
// comments or any other aspects this file would be extremely latge. This is 
// where frameworks like React help a lot
// ###################################################################### //

// '$(document).ready' waits for the DOM to load before running the code 
// you pass to it as a callback. You don't need to put everything in here, 
// but things like making AJAX calls should go in here to make sure that 
// there is something to insert the data into
$(document).ready(function() {
	// AJAX call made with jQuery
	$.getJSON("/api/todos")
	// The getJSON method returns a promise, so we can chain on a '.then' 
	// and a '.catch', or we can use '.done' and '.fail', which are the 
	// jQuery equivalents. They do the same thing.
	.then(function(result) {
		// Add all the todos from the database to the page. Function defined below
		addTodos(result);
		// Check if 'enter' was clicked. If it was, create a new todo
		$("#todoInput").keypress(function(event) {
			// 'event.which' contains the key code. 13 is the key code for 'enter'
			if(event.which == 13) {
				// Add a new todo to the page. Function defined below.
				createTodo();
			}
		})

		// THIS IS AN IMPORTANT CONCEPT
		// This adds the listener to the X button for each todo. We can't just 
		// do $('span').on('clicked', function(){...}) here because since we are 
		// adding this listener at the very beginning when the page loads, there 
		// is no guarantee that there are any spans on the page yet (because they 
		// are dynamically created with javascript). So, instead, we add the 
		// listener to something that is on the page when the DOM first loads, the 
		// list. Then, the second  parameter passed to the 'on' function says to only 
		// add the listener to to span elements within the '.list' element.
		$('.list').on("click", 'span', function(e) {
			// We use this stopPropagation() method because if we don't, it will trigger 
			// this event listener (like we want), but then it will ALSO trigger the event 
			// listener we have attached to the entire 'li' (because technically the 
			// 'span's are inside of the 'li's). So this is how we make sure that it will 
			// just trigger the 'span' event listener and then stop and do nothing else
			e.stopPropagation();
			// This function is defined below. We pass it the 'li' element that the 'X' 
			// that was clicked is inside of. This is because the 'id' data attribute is 
			// attached to the 'li' element, and also, we want to delete the entire 'li' 
			// element, not just the span that is clicked. Here, 'this' refers to the 
			// 'span' element, so we can access the 'li' element with the .parent() method.
			removeTodo($(this).parent());
		})
		// We do the same thing here as above where we attach the listener to the '.list' 
		// element which is already there when the page loads instead of to the 'li' elemts 
		// which are dynamically created, and then we tell it to only work on 'li' elements 
		// inside that '.list' element
		$('.list').on('click', 'li', function() {
			// This function is defined below. We pass it the todo element that was clicked 
			updateTodo($(this));
		})
	})
	.catch(function(error) {
		console.log(error);
	})
})

function addSingleTodo(todo) {
	// This is how to create a new html element in jQuery
	// This is a list element with a span for the delete button
	var newTodo = $("<li>" + todo.name + "<span>X</span></li>");
	// This is a jQuery way of adding data to an element. We can access this data in our 
	// code, but it is not visible in the browser. An alternative would've just been to 
	// add a data attribute to the html of our newTodo variable above
	newTodo.data('id', todo._id);
	// We want to get this 'completed' field straight from the database instead of just 
	// checking the html class that the todo has because the classes could be changed 
	// and the data could be out of sync 
	newTodo.data('completed', todo.completed);
	// We must add the 'task' class to the new element so the CSS styles 
	// get applied to the element
	newTodo.addClass("task");
	// Check the completed field of the todo and if it is, add the 'done' class to it
	if(todo.completed) {
		newTodo.addClass("done");
	}
	// Append the new element to the list of todos
	$(".list").append(newTodo);
}

function addTodos(todos) {
	// Loop through each todo and add each one to the page
	todos.forEach(function(todo) {
		addSingleTodo(todo);
	})
}

// Create a new todo with a post request to add it to the database, then add 
// the todo to the page
function createTodo() {
	// Get the input from the form
	var userInput = $("#todoInput").val();
	// jQuery post request. Second parameter is the body to be passed 
	// along with the request
	$.post("/api/todos", {
		name: userInput
	})
	.then(function(response) {
		// If the request is successful, add the todo to the page
		addSingleTodo(response);
		// Clear the text for input when the user hits enter to add a new todo
		$("#todoInput").val('');
	})
	.catch(function(err) {
		console.log(err);
	})
}

function removeTodo(todo) {
	// Send a DELETE request to the proper delete url
	$.ajax({
		method: 'DELETE',
		// We have to add the id of the todo to the url, which is attached to the 'li' 
		// element, which here is the 'todo' variable. We can access it by the .data 
		// method and passing it the name of the data attribute. Here we called it 'id' 
		// when we created the new todo elements.
		url: '/api/todos/' + todo.data('id')
	})
	.then(function(data) {
		// Now we want to remove the entire 'li' element.
		todo.remove();
	})
	.catch(function(err) {
		console.log(err);
	})
}

function updateTodo(todo) {
	var isDone = todo.data('completed');
	// For some stupid reason, the 'data' field inside the '$.ajax' method has to be 
	// given a string, so we define a variable up here and then it will be treated as 
	// a string when we use it below. And we want to pass the opposite of 'isDone' 
	// because we are toggling completion
	var updateData = { completed: !isDone };
	$.ajax({
		method: 'PUT',
		// Same thing here as in the 'removeTodo' function above
		url: '/api/todos/' + todo.data('id'),
		data: updateData
	})
	// Remember that our update route returns the newly updated value, not the original one 
	// because this is how we made it in our 'todos.js' file in the 'helpers' folder
	.then(function(updatedTodo) {
		// Toggle the 'done' for CSS styles
		todo.toggleClass('done');
		// Lastly, we have to update the data field for the 'li' element because if we don't, 
		// it will always be its original value when we access it in the first line of this function
		todo.data('completed', !isDone);
	})
	.catch(function(err) {
		console.log(err);
	})
}
