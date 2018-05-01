var mongoose = require('mongoose');
mongoose.set('debug', true);
// This is my localhost databse
// mongoose.connect("mongodb://localhost/todo-api")
// This is my hosted database. I should've created an environment variable for it so the username 
// and password isn't just here in plain text but it doesn't matter for these purposes
mongoose.connect("mongodb://nick_rose:todos@ds163689.mlab.com:63689/todos")
.then(function() {
	console.log("Connected to databse");
})
.catch(function(err) {
	console.log(err);
});

// Allows us to use promises with mongoose instead of callbacks 
mongoose.Promise = Promise;

// Export the todo.js model file and call the model 'Todo'
module.exports.Todo = require("./todo");
