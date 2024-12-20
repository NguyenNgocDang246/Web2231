require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

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

require('./configs/server_config')(app);

app.use(require('./middlewares/checkAuth.mw'));

app.use('/auth/google', require('./routes/ggAuth.r'));
app.use('/page', require('./routes/page.r'));
app.use('/product', require('./routes/product.r'));
app.use('/user', require('./routes/user.r'));
app.use('/cart', require('./routes/cart.r'));
app.use('/checkout', require('./routes/checkout.r'));

// router error để cuối
app.use(require('./middlewares/handle404Error.mw'));
app.use(require('./middlewares/handleError.mw'));

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



