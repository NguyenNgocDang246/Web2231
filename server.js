require('dotenv').config();

const { create } = require('express-handlebars');
const express = require('express');
const session = require('express-session');
const path = require('path');

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    if (req.session.isLoggin === undefined) {
        req.session.isLoggin = false;
    }
    req.session.isLoggin = true;
    next();
});

const hbs = create({
    extname: '.hbs',
    encoding: 'utf-8',
    layoutsDir: './views/layouts',
    partialsDir: './views/partials',
    defaultLayout: 'main'
})

hbs.handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/', require('./routes/page'));
app.use('/product', require('./routes/product'));
app.use('/user', require('./routes/user'));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})