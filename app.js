// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieparser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const connectDB = require('./server/config/db');
const {
    isActiveRoute
} = require('./server/helpers/routeHelpers');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(cookieparser());
app.use(methodOverride('_method'));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

// Middleware to serve static files
app.use(express.static('public'));

// Set up the templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// Define routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port: http://localhost:${PORT}`);
});