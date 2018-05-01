var mongoose = require("mongoose");

// Define the schema for a single todo
var todoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Name cannot be blank."
	},
	completed: {
		type: Boolean,
		default: false
	},
	created_date: {
		type: Date,
		default: Date.now
	}
});

// assign this schema to a model and export it to be required by the index file of the models directory
var Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;