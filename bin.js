#!/usr/bin/env node

let { main, setup } = require('./index')

const nodeEnv = process.env.NODE_ENV || "development";
const envPort = process.env.TEMPL8_PORT || process.env.PORT || 9494;
const webhookUrl = process.env.INFO_WEBHOOK_URL;

if(webhookUrl == null){
    console.error("INFO_WEBHOOK_URL is not set")
    process.exit(1)
}

// take arguments and do various tasks:
main({nodeEnv, envPort, webhookUrl})
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
