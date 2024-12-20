const {create} = require('express-handlebars');
const path = require('path');

const hbs = create({
    extname: '.hbs',
    encoding: 'utf-8',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
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

module.exports = hbs;