var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserService = require('./../services/UserService')
const ConfigFile = require('../config')

var passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT= passportJWT.ExtractJwt;

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use('login', new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
    //   Création du système de login avec comparaison des mots de passe.
    UserService.loginUser(username, password, null, done)
}))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: ConfigFile.secret_key,
    passReqToCallback: true
}, function(req, jwt_payload, done) {
    // Déchiffrer le token et lire les informations dedans. (_id) -> Pour rechercher l'utlilsateur.
    UserService.findOneUserById(jwt_payload._id, null, function(err, value) {
        if (err)
            done(err)
        else
        done(null, value)
    })
}))

module.exports = passport;var passport = require('passport');