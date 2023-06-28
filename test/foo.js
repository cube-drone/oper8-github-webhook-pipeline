const assert = require('assert');
const axios = require('axios');
const {http} = require('./common');

describe('Test the foo system', async function () {

    describe('http works', async function () {
        it('ping', async function () {
            let response = await http.get('/ping')
            assert.strictEqual(response.data, "pong")
        });
        it('test endpoint is available', async function () {
            let response = await http.get('/test')
            assert.strictEqual(response.data, ":)")
        });
        it('i can post to the webhook url', async function(){
            let response = await http.post('/webhook', {
                'action': 'test',
                'sender': 'testy-jim',
                'repo': 'who knows',
            });
        });
    });

})
