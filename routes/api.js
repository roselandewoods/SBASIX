const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const todosFilePath = path.join(__dirname, '../data/todos.json');
let todos = require(todosFilePath);

// We need a Helper function to save to dos to file
const saveTodos = (todos) => {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// We need a to dos or filter by task and/or status
router.get('/todos', (req, res) => {
    const { status, task } = req.query;
    let filteredTodos = todos;
    if (status) {
        filteredTodos = filteredTodos.filter(todo => todo.status === status);
    }
    if (task) {
        filteredTodos = filteredTodos.filter(todo => todo.task.toLowerCase().includes(task.toLowerCase()));
    }
    res.json(filteredTodos);
});

// We need to Create a new to do
router.post('/todos', (req, res) => {
    const todo = req.body;
    todo.id = todos.length + 1;
    todos.push(todo);
    saveTodos(todos);
    res.status(201).json(todo);
});

// We need to Get a to do 
router.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

// We need to update to do 
router.patch('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (todo) {
        Object.assign(todo, req.body);
        saveTodos(todos);
        res.json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

// We need to delete a todo 
router.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        saveTodos(todos);
        res.status(204).send();
    } else {
        res.status(404).send('Todo not found');
    }
});

module.exports = router;
