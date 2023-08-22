const passport = require("passport");
const {Strategy, ExtractJwt} = require("passport-jwt");

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

require('dotenv').config();
let privateKey = process.env.JWT_PRIVATE_KEY;

cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    };
    return token;
};

const configStrategy = {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: privateKey
};

const initPassport = () => {
    passport.use("jwt", new JWTStrategy(configStrategy, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
};

module.exports = {
    initPassport
};