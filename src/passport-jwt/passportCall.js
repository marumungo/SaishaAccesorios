const passport = require('passport')

// Función para visualizar cual es el error de autenticacion
const passportCall = strategy => {
    return async (req, res, next) =>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) {
                return next(err)
            };

            if(!user) {
                // return res.status(401).send({status: 'error', error: info.messages ? info.messages : info.toString()});
                return res.render("noPermissions", {});
            };

            req.user = user.user;
            next();
        })(req, res, next);
    };
};

module.exports = {
    passportCall
};
