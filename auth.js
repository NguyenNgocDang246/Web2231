const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userModel = require('./models/user.m');
const sha256 = require('js-sha256');
require('dotenv').config();

// Cấu hình chiến lược Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GG_CLIENT_ID,
    clientSecret: process.env.GG_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = {
        remember: true,
        role: "normal_user"
    };
    const existUser = await userModel.findOne({email: profile.emails[0].value});
    if(existUser)
    {
       user.role = existUser.role;
       user.username = existUser.username;
    }
    else
    {
        const newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            password: Math.random().toString(36).substring(2, 10), // random mật khẩu
            role: "normal_user",
        };
        // hash password
        const salt = (new Date()).getTime().toString();
        const pw_salt = newUser.password + salt;
        const pwHash = sha256(pw_salt);
        newUser.password = pwHash + salt;

        await userModel.add(newUser);
        user.username = newUser.username;
    }
    // Lưu thông tin user hoặc kiểm tra trong database
    return done(null, user);
  }
));

// Serialize và deserialize user để lưu vào session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
