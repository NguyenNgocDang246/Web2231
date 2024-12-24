require('dotenv').config();

const hbs = require('./hbs_config');

const MyStrategy = require('./strategy_config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

const { verifyPassword, hashPassword } = require('./crypto_config');
const userModel = require('../models/user.m');  

module.exports = (app) => {

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', './views');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new MyStrategy(async (username, password, done) => {
        try {
            const user = await userModel.findOne({username: username});
            if (user) {
                if (!verifyPassword(password, user.password)) {
                    return done(null, null, { message: 'Xác thực thất bại' });
                }
                return done(null, user);
            } else {
                return done(null, null, { message: 'Xác thực thất bại' });
            }
        } catch (e) {
            return done(e);
        }
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GG_CLIENT_ID,
        clientSecret: process.env.GG_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await userModel.findOne({email: profile.emails[0].value});
        if(!user)
        {
            const newUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value,
                password: hashPassword(Math.random().toString(36).substring(2, 10)), // random mật khẩu
                dob: new Date(),
                phone: "0000000000",
                role: "normal_user",
            };
    
            await userModel.add(newUser);
            user = newUser;
        }
        return done(null, user);
      }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });
    passport.deserializeUser(async (username, done) => {
        try {
            const user = await userModel.findOne({username: username});
            done(null, user);
        } catch (e) {
            done(e);
        }
    });
}   