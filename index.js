require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./app/config/mongoose');
const flash = require('express-flash');


const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./app/config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const { Server } = require('http');
const Emitter = require('events');

app.use(sassMiddleware({
    src: './resources/scss',
    dest: './public/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));


app.use(flash());
// assets
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set up the view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'pizza',
    // TODO change the secret before deployment in production mode
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60 * 24)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            collection: 'sessions',
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

// Global Middleware
app.use(function(req, res, next) {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
});

// Passport config
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes/web'));


const server = app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});

const io = require('socket.io')(server)
io.on('connection', (socket) =>{
    // Join
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})