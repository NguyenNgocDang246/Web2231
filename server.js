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
    cookie: { secure: false, maxAge: 1 * 24 * 60 * 60 * 1000 }
}));


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

hbs.handlebars.registerHelper('index', function(array, index) {
    if (Array.isArray(array) && array.length > 0) {
        return array[index];
    }
    return null;  // Trả về null nếu mảng rỗng hoặc không phải là mảng
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/page', require('./routes/page'));
app.use('/product', require('./routes/product'));
app.use('/user', require('./routes/user/normalUser'));
app.use('/cart', require('./routes/cart'));

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



