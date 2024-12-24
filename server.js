require('dotenv').config();

const express = require('express');
const path = require('path');
const MongoStore = require('connect-mongo');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const { mongoose, connectDB } = require('./models/db');
connectDB().then(() => {
    const sessionDbConnection = mongoose.createConnection(process.env.MONGODB_URI_SESSION);
    const session = require('express-session');
    app.use(session({
        secret: process.env.SS_KEY,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            client: sessionDbConnection.getClient(), // Sử dụng connection cho session
            collectionName: 'sessions' // Tên collection để lưu session
        }),
        cookie: { secure: false, cookie: { maxAge: 30 * 60 * 1000 } }
    }));

    require('./configs/server_config')(app);

    app.use(require('./middlewares/checkGuest.mw'));

    app.use('/auth/google', require('./routes/ggAuth.r'));
    app.use('/page', require('./routes/page.r'));
    app.use('/product', require('./routes/product.r'));
    app.use('/user', require('./routes/user.r'));
    app.use('/cart', require('./routes/cart.r'));
    app.use('/checkout', require('./routes/checkout.r'));

    // router error để cuối
    app.use(require('./middlewares/handle404Error.mw'));
    app.use(require('./middlewares/handleError.mw'));

    // Kết nối thành công, bắt đầu server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});





