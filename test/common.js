const axios = require('axios');

const baseURL = "http://localhost:9494";

const randomIP = () => {
    return [1,2,3,4].map(() => Math.floor(Math.random() * 255)).join('.');
};

const http = axios.create({
    baseURL,
    timeout: 5000,
    headers: {'X-Forwarded-For': randomIP()}
});

const defaultUserAgent = "Pozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";

module.exports = {
    baseURL,
    randomIP,
    http,
    defaultUserAgent,
}