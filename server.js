const express = require('express');
const session = require('express-session');
const passport = require('./auth');
const routes = require('./routes');
const path = require('path'); // Import the path module

const app = express();

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express session
app.use(session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});