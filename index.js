const express = require('express')
const crypto = require('crypto')
require('express-async-errors') // this patches better async error handling into express
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert')

const { Redis } = require("ioredis")

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//--------------------------
async function main({nodeEnv, envPort, webhookUrl}){

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

        let githubMessage = req.body;
        let text = JSON.stringify(githubMessage, null, 2);

        let message = {
            text
        };

        res.send(message);
    });

    app.listen(envPort)
    console.log(`Listening on port ${envPort}...`)
}

module.exports = {
    main
}