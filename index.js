const express = require('express')
require('express-async-errors') // this patches better async error handling into express
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert')

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//--------------------------
async function main({nodeEnv, envPort, webhookUrl}){

    let report = async (text) => {
        if(webhookUrl){
            let axios = require('axios');
            let postMessage = {
                text
            }
            let response = await axios.post(webhookUrl, postMessage);
            return response.data;
        }
        else{
            console.log(text)
        }
    }

    let githubToPlainText = (githubMessage) => {

        // this is the default text if we don't know what to do with the message
        let action = githubMessage.action || "unknown action"
        let sender = githubMessage.sender && githubMessage.sender.login || "unknown sender"
        let repo = githubMessage.repository && githubMessage.repository.full_name || "unknown repo"

        let remainingData = githubMessage;
        delete remainingData.action;
        delete remainingData.sender;
        delete remainingData.repository;

        let defaultMessage = `github webhook: ${action} by ${sender} on ${repo}: ${JSON.stringify(remainingData)}`

        return defaultMessage;
    }

    // we are going to deploy this behind nginx
    app.set('trust proxy', true)
    // log stuff
    app.use(morgan('tiny'))

    let noopMiddleware = async (req, res, next) => {
        next()
    }

    // error handler
    app.use((err, req, res, next) => {
        console.error(err.stack)
        let errorMessage = err.message;
        if(nodeEnv === "production"){
            errorMessage = "Internal Server Error"
        }
        res.status(500).send(errorMessage)
    })

    //---------------------------

    app.get('/ping', function (req, res) {
        res.send('pong')
    })

    app.get('/test', async function (req, res) {
        res.send(":)")
    })

    app.get('/env', async function (req, res) {
        if(nodeEnv === "production"){
            res.send("production");
        }
        else {
            res.json(process.env);
        }
    });

    app.get('/webhook', jsonParser, async function (req, res) {

        res.json({"hey": "you have to POST to the webhook, silly"});
    });
    app.post('/webhook', jsonParser, async function (req, res) {

        let githubMessage = req.body;
        let text = githubToPlainText(githubMessage);

        await report(text);

        res.json({text});
    });

    app.listen(envPort)
    console.log(`Listening on port ${envPort}...`)
}

module.exports = {
    main
}
