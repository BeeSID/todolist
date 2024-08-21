// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS for all routes

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('DB Connected!');
  })
  .catch((err) => {
    console.log('DB Connection Error:', err);
  });

// Creating schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: String
});

// Creating model
const todoModel = mongoose.model('Todo', todoSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;

  // Log the incoming request body for debugging
  console.log('Received request body:', req.body);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log('Error creating todo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items
app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log('Error fetching todos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo item
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    // Log the incoming request body for debugging
    console.log('Received request body for update:', req.body);

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.log('Error updating todo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Log the ID of the todo to be deleted for debugging
    console.log('Received request to delete todo with ID:', id);

    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.log('Error deleting todo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
