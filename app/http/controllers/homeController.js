const Menu = require('../../../models/menu');

module.exports.home = async function(req, res){
    try{
        const pizzas = await Menu.find();
        return res.render('home',{ pizzas: pizzas }); 
    }
    catch(err){
        console.log('Error', err);
        return;
    }
}