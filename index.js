const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



// We need to set Pug as the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = require('./routes/api');
const viewRoutes = require('./routes/views');

app.use('/api', apiRoutes);
app.use('/', viewRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
