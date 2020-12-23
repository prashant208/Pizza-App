const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const path = require('path');


app.get('/', function(req, res){
    res.render('home');
})

app.use(express.urlencoded());
app.use(express.static('./public'));
app.use(expressLayouts);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));




app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});