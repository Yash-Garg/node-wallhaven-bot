const TelegramBot = require('node-telegram-bot-api');
const constants = require('./.constants.js');
const ping = require('./ping/ping.js');

const options = {
    polling: true
};

const bot = new TelegramBot(constants.TOKEN, options);
var hosts = ['https://api.telegram.org'];

bot.onText(/^\/start/, (msg) => {
    sendMessage(msg, 'This is a bot based on NodeJS and Wallhaven\'s API!');
});

bot.onText(/^\/ping/, (msg) => {
    ping(hosts).then(function (delta) {
        sendMessage(msg, 'Ping time was ' + String(delta) + ' ms.');
        console.log('Starting ping test. Ping time was ' + String(delta) + ' ms');
    }).catch(function (err) {
        console.error('Could not ping remote URL', err);
    });
});

function sendMessage(msg, text, delay, callback) {
    if (!delay) delay = 5000;
    bot.sendMessage(msg.chat.id, text, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML'
    })
        .then((res) => {
            if (callback) callback(res);
        })
        .catch((ignored) => { });
}