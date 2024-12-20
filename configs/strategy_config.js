const passport = require('passport');
const { Strategy } = require('passport-strategy');
module.exports = class MyStrategy extends Strategy {
    constructor(verify) {
        super();
        this.name = 'myPassportStrategy';
        this.verify = verify;
        passport.strategies[this.name] = this;

    }
    async authenticate(req) {
        try {
            const { username, password } = req.body;
            await this.verify(username, password, (err, user, info) => {
                if (err) 
                    return this.error(err);
                if (!user) 
                    return this.fail(info || { message: 'Xác thực thất bại' }, 401);
                this.success(user, info);
            });
        } catch (e) {
            this.error(e)
        }
    }
};
