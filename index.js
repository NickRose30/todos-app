var express 	= require('express'),
	app     	= express(),
	port    	= process.env.PORT || 3000,
	bodyParser 	= require("body-parser");

// SET UP BODY-PARSER
// These two lines are just required things to do in order for body-parser to work 
// properly. Body-parser allows us to access the body of a request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// LINK TO STATIC FILES (HTML/CSS/JS)
// These two lines tell node where to look for the static files. The '/public' path 
// is for CSS files and the '/views' path is for HTML files. So when we send an 
// html file to be rendered, or a css file to be loaded, these paths will automatically 
// be added to the beginning of the files. Also, in our html files, we can just include 
// css and javascript files like normal and they will be found using these two lines. 
// The '__dirname' variable is the current directory we are in.
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

// INDEX ROUTE OF APPLICATION
// Simple get route
app.get("/", function(req, res) {
	// This is how we render an html page. We only need to do the name of 
	// the file, and not the full path to the file, because we already told 
	// node where to look for the static files above.
	res.sendFile("index.html");
});

// LINK TO EXTERNAL ROUTES FILES
// Fetches what is in the todos.js routes file and assigns it to a 
// variable which is later used to include the routes in our application
var todosRoutes = require("./routes/todos");
// Includes the todos.js routes in our application 
app.use("/api/todos", todosRoutes);

// START UP SERVER
// Allows the server to start up and listen on a specified port
app.listen(port, function(req, res) {
	console.log("Server listening on port " + port);
});
