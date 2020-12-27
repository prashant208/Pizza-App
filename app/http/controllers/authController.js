module.exports.login = function(req, res){
    res.render('auth/login');
}

module.exports.register = function(req, res){
    res.render('auth/register');
}