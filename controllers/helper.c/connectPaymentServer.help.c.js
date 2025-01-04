const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, 
});

// const link = 'https://web2231-admin.onrender.com/payment';
const link = 'https://34.126.99.70/payment';

module.exports = {
    getAccessToken: async (data) => {
        try {

            const response = await axios.post(`${link}/getAccessToken`, data, {httpsAgent});
            return response.data.accessToken;
            
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    confirmPayment: async (token, data) => {
        try {
            const response = await axios.post(`${link}/transferMoney`, data, {
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
            const response = await axios.post(`${link}/createAccount`, {userId:userId.toString()}, {httpsAgent});
            return response.status === 200;
        } catch(e)
        {
            console.log(e);
            throw e;
        }
    }
}