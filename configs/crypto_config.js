const crypto = require('crypto');

// Hàm tạo salt
const generateSalt = (length = 16) => {
    return crypto.randomBytes(length).toString('hex'); // Salt 16 bytes => 32 ký tự hex
};

// Hàm tạo hash mật khẩu với salt
const hashPassword = (password) => {
    const salt = generateSalt(); // Tạo salt
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex'); // Băm mật khẩu + salt
    return `${hash}:${salt}`; // Ghép hash và salt lại thành một chuỗi
};

const verifyPassword = (password, hash) => {
    const [hashValue, salt] = hash.split(':');
    const newHash = crypto.createHash('sha256').update(password + salt).digest('hex');
    return newHash === hashValue;
};

module.exports = { hashPassword, verifyPassword };