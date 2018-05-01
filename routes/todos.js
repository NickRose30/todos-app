var express = require('express');
// This line allows you to break up all your routes into different files and then 
// export them at the end of the file so they can be required in a different file
var router = express.Router();
// Use the models directory (if you just require a directory it will automatically 
// look for the index.js file in it). So, we include the models directory, which 
// looks at the index.js file, which looks at the things that are exported, which 
// leads to this file
var db = require('../models');
// Include all the helper functions that are exported in the todos.js file in 
// the 'helpers' folder
var helpers = require("../helpers/todos");


// **** All the functions for these routes are defined in the todos.js file in the 'helpers' folder. ****
//------------------------------------------------------------------------------------------------------//

// INDEX ROUTE & CREATE ROUTE
// This '.route()' method is a way of chaining on two different http verbs for one path
// GET route is the INDEX route. It just returns all the todos in the databse
// POST route is the CREATE route. It creates a new todo in our database. It sends a POST request 
// just to our root api route but includes the name of the todo in the body of the request. It 
// then sends back the created database entry as the json response.
router.route('/')
	.get(helpers.getTodos)
	.post(helpers.createTodo)

// SHOW ROUTE, UPDATE ROUTE & DELETE ROUTE
// GET route is the SHOW route. It retrieves one single todo by id. Pretty much the same as the first GET route that 
// returns all the todos except there is an additional id variable added to the end of the path (which 
// we make a variable by putting a colon in front of it) that we search the db for.
// PUT route is the UPDATE route. It updates a single entry in the databse.
// DELETE route removes an entry from the database.
router.route("/:todoId")
	.get(helpers.showTodo)
	.put(helpers.updateTodo)
	.delete(helpers.deleteTodo)


// Export our router variable so that when another file requires this one, it will just 
// be every route defined on the router variable.
module.exports = router;