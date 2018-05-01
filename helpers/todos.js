// Have to include this file again so we can use the db variable
var db = require("../models");

// Attach all the functions to the exports variable and the export the exports variable at the end //
//-------------------------------------------------------------------------------------------------//

exports.getTodos = function(req, res) {
	// Gets all the entries from the Todo collection in our database and sends it as json
	// When the find() funciton is passed nothing, it will return everything
	db.Todo.find()
	.then(function(todos) {
		res.json(todos)
	}).catch(function(err) {
		res.send(err)
	})
}

exports.createTodo = function(req, res) {
	// We are able to just to 'req.body' because we have body-parser installed and configured. 
	// If we did not, 'req.body' would be undefined.
	db.Todo.create(req.body)
	.then(function(todo) {
		// We can use the status method to return a specific status code. Here, 201 means 'created'.
		res.status(201).send(todo);
	})
	.catch(function(err) {
		res.send(err);
	})
}

exports.showTodo = function(req, res) {
	// We can access any variable in the path by doing 'req.params.<variable>'.
	db.Todo.findById(req.params.todoId)
	.then(function(foundTodo) {
		res.send(foundTodo);
	})
	.catch(function(err) {
		res.send(err);
	})
}

exports.updateTodo = function(req, res) {
	// This mongoose method finds an entry based on the object passed to it as the first parameter and 
	// then updates it with the object that is passed as the second parameter. Here, 'req.body' only
	// contains the name field, but that is okay because the rest of the fields are filled in automatically.
	// The third parameter specifies whether or not to return the new updated entry or the original 
	// entry that has been overridden. Mongoose automatically just returns the original entry.
	db.Todo.findOneAndUpdate({_id: req.params.todoId}, req.body, {new: true})
	.then(function(todo) {
		// This 'todo' variable would be the original overridden entry if we did not pass '{new: true}' 
		// to the mongoose method above.
		res.json(todo);
	})
	.catch(function(err) {
		res.send(err);
	})
}

exports.deleteTodo = function(req, res) {
	// All you need to pass this mongoose method is an object that can be 
	// used to identify the entry you wish to delete.
	db.Todo.remove({_id: req.params.todoId})
	.then(function() {
		// Since the entry is deleted, nothing is returned from the remove 
		// function, so we just do a res.send 
		res.send("Todo Deleted.");
	})
	.catch(function(err) {
		res.send(err);
	})
}

// Export the functions variable that we have attached all the above functions 
// to, so that they can be accessed by other files that require this file.
module.exports = exports;