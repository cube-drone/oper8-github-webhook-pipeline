# oper8-github-webhook-pipeline
A super-lightweight node application designed to:

* receive messages from github's webhook on the /webhook url (POST) 
* poop them out into any webhook that takes a `{text: 'whatever'}` format

The only thing that it requires is an environment variable: INFO_WEBHOOK_URL 

## Install

 * Docker
 * `npm install -g jake`
 * `npm install -g nodemon`
