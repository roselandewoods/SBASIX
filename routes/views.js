const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const todosFilePath = path.join(__dirname, '../data/todos.json');
let todos = require(todosFilePath);

// We need a helper function to save todos to file
const saveTodos = (todos) => {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// Render our home page
router.get('/', (req, res) => {
    res.render('index');
});

// We can render todos page with optional status and also task filtering
router.get('/todos', (req, res) => {
    const { status, task } = req.query;
    let filteredTodos = todos;
    if (status) {
        filteredTodos = filteredTodos.filter(todo => todo.status === status);
    }
    if (task) {
        filteredTodos = filteredTodos.filter(todo => todo.task.toLowerCase().includes(task.toLowerCase()));
    }
    res.render('todos', { todos: filteredTodos });
});

// Render create todo form
router.get('/todos/new', (req, res) => {
    res.render('createTodo');
});

// Handle form submission to create todo
router.post('/todos', (req, res) => {
    const todo = req.body;
    todo.id = todos.length + 1;
    todos.push(todo);
    saveTodos(todos);
    res.redirect('/todos');
});

// Render edit todo form
router.get('/todos/edit/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (todo) {
        res.render('editTodo', { todo });
    } else {
        res.status(404).send('Todo not found');
    }
});

// Handle form submission to update todo
router.post('/todos/edit/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (todo) {
        Object.assign(todo, req.body);
        saveTodos(todos);
        res.redirect('/todos');
    } else {
        res.status(404).send('Todo not found');
    }
});

// Handle form submission to delete todo
router.post('/todos/:id/delete', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        saveTodos(todos);
        res.redirect('/todos');
    } else {
        res.status(404).send('Todo not found');
    }
});

module.exports = router;
