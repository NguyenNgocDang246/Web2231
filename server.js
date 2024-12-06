require('dotenv').config();

const { create } = require('express-handlebars');
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./auth');

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SS_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


const hbs = create({
    extname: '.hbs',
    encoding: 'utf-8',
    layoutsDir: './views/layouts',
    partialsDir: './views/partials',
    defaultLayout: 'main'
})

hbs.handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

hbs.handlebars.registerHelper('index', function (array, index) {
    if (Array.isArray(array) && array.length > 0) {
        return array[index];
    }
    return null;  // Trả về null nếu mảng rỗng hoặc không phải là mảng
});

hbs.handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.use(passport.initialize());
app.use(passport.session());

const authMiddleware = (req, res, next) => {
    const openRoutes = ['/page/login', '/page/register', '/auth/google', '/auth/google/callback'];
    if (openRoutes.includes(req.path)) {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.remember)
            req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
        return next();
    }
    res.redirect('/page/login');
}
app.use(authMiddleware);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        req.session.user = req.session.passport?.user;
        if (req.session.user.remember)
            req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
        res.redirect("/product/all");
    }
);

app.use('/page', require('./routes/page'));
app.use('/product', require('./routes/product'));
app.use('/user', require('./routes/user'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));

const { connectDB } = require('./models/db');

connectDB()
    .then(() => {
        // Kết nối thành công, bắt đầu server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        // Xử lý lỗi kết nối nếu có
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);  // Dừng ứng dụng nếu kết nối thất bại
    });



