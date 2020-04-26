const TelegramBot = require("node-telegram-bot-api");
const config = require('./config.js')
const ping = require('./ping/ping.js');
const axios = require('axios')

const bot = new TelegramBot(config.TOKEN, { polling: true });

var hosts = ['https://api.telegram.org', 'https://google.co.in'];
const API_URL = "https://wallhaven.cc/api/v1/";
const API_INDEX = `&apikey=${config.API_WALLHAVEN}`;
const WALL_URL = `${API_URL}w/`

const search = async (query) => {
    let args = query.split(" ");
    let q = "search?q=" + args.join("+");
    let response = await axios.get(
        `${API_URL}${q}&sorting=random${API_INDEX}`
    );
    let data = (await response.data.data[0]) ? response.data.data[0].path : "404";
    return data;
};

const random = async () => {
    let response = await axios.get(
        `${API_URL}search?sorting=random${API_INDEX}`
    );
    let data = await response.data.data[1].path;
    return data;
};

const nsfw = async () => {
    let daresponseta = await axios.get(
        `${API_URL}search?sorting=random&purity=001${API_INDEX}`
    );
    let data = await response.data.data[1].path;
    return data;
};

const get_wall_using_id = async (query) => {
    let id = query.split(" ");
    let dresponseata = await axios.get(
        `${WALL_URL}${id}?apikey=${config.API_WALLHAVEN}`
    );
    let data = (await response.data.data) ? response.data.data.path : "404";
    return data;
};

const toplist = async (query) => {
    let args = query.split(" ");
    let response = await axios.get(
        `${API_URL}search?sorting=toplist?toprange=${args}${API_INDEX}`
    );
    let rawData = await response.data;
    let data = response.data.data.map((obj) => obj.path);
    return data;
};

//
// C O M M A N D S  S T U F F
//

bot.onText(/^\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'This is a bot based on NodeJS and Wallhaven\'s API! \nType /help to get a list of available commands.',
        {
            reply_to_message_id: msg.message_id,
        });
});

bot.onText(/^\/ping/, (msg) => {
    ping(hosts).then(function (delta) {
        bot.sendMessage(msg.chat.id, 'Ping time was ' + String(delta) + ' ms.', {
            reply_to_message_id: msg.message_id,
        });
        console.log('Starting ping test. Ping time was ' + String(delta) + ' ms');
    }).catch(function (err) {
        console.error('Could not ping remote URL', err);
    });
});

bot.onText(/\/search (.+)/, async (msg, match) => {
    const resp = await search(match[1]);
    resp != "404"
        ? bot.sendDocument(msg.chat.id, resp, {
            reply_to_message_id: msg.message_id,
        })
        : bot.sendMessage(msg.chat.id, "Try again with some other keyword(s)", {
            reply_to_message_id: msg.message_id,
        });
});

bot.onText(/\/random/, async (msg) => {
    const resp = await random();
    bot.sendDocument(msg.chat.id, resp, {
        reply_to_message_id: msg.message_id,
    });
});

bot.onText(/\/nsfw/, async (msg) => {
    const resp = await nsfw();
    bot.sendDocument(msg.chat.id, resp, {
        reply_to_message_id: msg.message_id,
    });
});

bot.onText(/\/getwall (.+)/, async (msg, match) => {
    const resp = await get_wall_using_id(match[1]);
    resp != "404"
        ? bot.sendDocument(msg.chat.id, resp, {
            reply_to_message_id: msg.message_id,
        })
        : bot.sendMessage(msg.chat.id, "Try using another wallpaper ID", {
            reply_to_message_id: msg.message_id,
        });
});

bot.onText(/\/top (.+)/, async (msg, match) => {
    const resp = await toplist(match[1]);
    for (let i = 0; i < 5; i++) {
        bot.sendDocument(msg.chat.id, resp[i], {
            reply_to_message_id: msg.message_id,
        });
    }
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
        msg.chat.id, "/help : To get this message \
        \n\n/search <keyword> : To get a wallpaper related to the keyword \
        \n\n/nsfw : To get a random NSFW image from Wallhaven.cc \
        \n\n/random : To get any random image from Wallhaven.cc \
        \n\n/ping : To test the ping of the bot with telegram/google \
        \n\n/getwall <id> : Download the wallpaper using it's id \
        \n\n/top <1d/3d/1w/1M/3M/6M/1y> : Returns 5 images based on the specified toprange",
        {
            reply_to_message_id: msg.message_id,
        })
});