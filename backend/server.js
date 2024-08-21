const express = require('express');
const mongoose = require('mongoose');

// create an instance of express
const app = express();
app.use(express.json());

// connecting mongoose
mongoose.connect('mongodb://127.0.0.1:27017/todo-app')
.then(() => {
    console.log("Db connected");
})
.catch((err) => {
    console.log(err);
}); 

// creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String,
    },
    description: String,
});

// creating models
const todoModel = mongoose.model('Todo', todoSchema);

// create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    
    try {
        const newTodo = new todoModel({
            title,
            description,
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


// update a todo item

app.put("./todos/:id",async (req,res) => {
    try {
        const {title,description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id, 
        {title, description},
        {new: true}
    )
    if (!updatedTodo) {
        return res.status(404).json({message:"Todo not found"})
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.messsage});
    }
    
});

// delete the todo item
app.delete("./todos/:id", async (req,res) => {
    const id = req.params.id;
    try{
        await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    } catch(error){
        console.log(error);
        res.status(500).json({message:error.messsage});
    }
    
});
// start the server
const port = 5000;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
