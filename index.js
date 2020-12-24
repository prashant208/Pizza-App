const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const sassMiddleware = require('node-sass-middleware');


app.use(sassMiddleware({
    src: './resources/scss',
    dest: './public/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(express.static('./public'));
app.use(expressLayouts);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

app.get('/', function(req, res){
    res.render('home');
})

app.get('/cart', function(req, res){
    res.render('customers/cart');
})

app.get('/login', function(req, res){
    res.render('auth/login');
})

app.get('/register', function(req, res){
    res.render('auth/register');
})

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});