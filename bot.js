const Telebot = require('telebot')
const config = require('./config.js')
const ping = require('./ping/ping.js');

const bot = new Telebot(config.TOKEN);
bot.start();
var hosts = ['https://api.telegram.org', 'https://google.co.in'];

bot.on(/^\/start/, (msg) => msg.reply.text('This is a bot based on NodeJS and Wallhaven\'s API!'));

bot.on(/^\/ping/, (msg) =>
    ping(hosts).then(function (delta) {
        msg.reply.text('Ping time was ' + String(delta) + ' ms.');
        console.log('Starting ping test. Ping time was ' + String(delta) + ' ms');
    }).catch(function (err) {
        console.error('Could not ping remote URL', err);
    })
);