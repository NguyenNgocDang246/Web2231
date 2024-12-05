const userModel = require('../models/user.m');
const sha256 = require('js-sha256');

module.exports = ({
    login: async (req, res) => {
        const { username, password, remember } = req.body;
        const user = await userModel.findOne({username: username});
        if (user) {
            const salt = user.password.slice(64);
            const pwHashSaved = user.password.slice(0, 64);
            const pw_salt = password + salt;
            const pwHash = sha256(pw_salt);
            if(pwHashSaved === pwHash)
            {
                 // Lưu user vào session
                req.session.user = {
                    username: user.username, 
                    remember: false,
                    role: user.role
                };
                if(remember) 
                {
                    req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
                    req.session.user.remember = true;
                }
                else req.session.cookie.expires = null;
                return res.redirect('/product/all');
            }
            else res.redirect('/page/login?fail=true');
        }
        else res.redirect('/page/login?fail=true');
    },
    register: async (req, res) => {
        let {username, password, name, email, dob} = req.body;
        const hasAcc = await userModel.findOne({username: username});
        if(hasAcc) 
        {
            res.status(400).send('duplicate user');
            return;
        }

        const salt = (new Date()).getTime().toString();
        const pw_salt = password + salt;
        const pwHash = sha256(pw_salt);
        password = pwHash + salt;

        const newUser = {
            name: name,
            dob: dob,
            email: email,
            username: username,
            password: password,
            role: "normal_user"
        };

        userModel.add(newUser);
        res.redirect('/page/login');
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) 
            {
                return res.status(500).send("Có lỗi khi đăng xuất.");
            }
        });
        res.redirect('/');
    }
})