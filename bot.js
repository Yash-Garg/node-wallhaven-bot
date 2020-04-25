const TelegramBot = require("node-telegram-bot-api");
const config = require('./config.js')
const ping = require('./ping/ping.js');
const axios = require('axios')

const bot = new TelegramBot(config.TOKEN, { polling: true });

var hosts = ['https://api.telegram.org', 'https://google.co.in'];
const API_URL = "https://wallhaven.cc/api/v1/";
const API_INDEX = "&apikey=" + config.API_WALLHAVEN;

const search = async (query) => {
    let args = query.split(" ");
    let q = "?q=" + args.join("+");
    console.log(q);
    let data = await axios.get(API_URL + q + API_INDEX);
    console.log(data);
    let resp = await data.data.data[1].path;
    return resp;
};

const random = async () => {
    let data = await axios.get(API_URL + "search?sorting=random" + API_INDEX);
    let resp = await data.data.data[1].path;
    return resp;
};

//
// C O M M A N D S  S T U F F
//

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

bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = await search(match[1]);
    resp != "404"
        ? bot.sendDocument(chatId, resp)
        : bot.sendMessage(chatId, "Try again with some other keyword(s)");
});

bot.onText(/\/random/, async (msg) => {
    const chatId = msg.chat.id;
    const resp = await random();
    bot.sendDocument(chatId, resp);
});

//
// F U N C T I O N S 
//

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