const axios = require('axios');

module.exports = {
    getAccessToken: async (data) => {
        try {

            const response = await axios.post('http://localhost:3002/payment/getAccessToken', data);
            return response.data.accessToken;
            
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    confirmPayment: async (token, data) => {
        try {
            const response = await axios.post('http://localhost:3002/payment/transferMoney', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return response.data.message;
        } catch(e)
        {
            console.log(e);
            throw e;
        }
    },
    createAcount: async (userId) => {
        try {
            const response = await axios.post('http://localhost:3002/payment/createAccount', {userId:userId.toString()});
            return response.status === 200;
        } catch(e)
        {
            console.log(e);
            throw e;
        }
    }
}