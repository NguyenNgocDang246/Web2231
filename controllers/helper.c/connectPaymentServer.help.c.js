const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: true, 
});

module.exports = {
    getAccessToken: async (data) => {
        try {

            const response = await axios.post('https://localhost:3002/payment/getAccessToken', data, {httpsAgent});
            return response.data.accessToken;
            
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    confirmPayment: async (token, data) => {
        try {
            const response = await axios.post('https://localhost:3002/payment/transferMoney', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                httpsAgent,
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
            const response = await axios.post('https://localhost:3002/payment/createAccount', {userId:userId.toString()}, {httpsAgent});
            return response.status === 200;
        } catch(e)
        {
            console.log(e);
            throw e;
        }
    }
}