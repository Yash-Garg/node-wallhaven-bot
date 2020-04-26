process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js')
const ping = require('./ping/ping.js');
const axios = require('axios')

init();
const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

var hosts = [`https://api.telegram.org', 'https://google.co.in`];
const API_URL = `https://wallhaven.cc/api/v1/`;
const API_INDEX = `&apikey=${config.API_WALLHAVEN}`;
const WALL_URL = `${API_URL}w/`

const search = async (query) => {
    let args = query.split(" ");
    let q = "search?q=" + args.join("+");
    let response = await axios.get(
        `${API_URL}${q}&sorting=random${API_INDEX}`
    );
    let path = await response.data.data[1].path;
    let image = await response.data.data[1].thumbs.small;
    let surl = await response.data.data[1].short_url;
    return {
        path: path,
        image: image,
        surl: surl,
    };
};

const random = async () => {
    let response = await axios.get(
        `${API_URL}search?sorting=random${API_INDEX}`
    );
    let path = await response.data.data[1].path;
    let image = await response.data.data[1].thumbs.small;
    let surl = await response.data.data[1].short_url;
    return {
        path: path,
        image: image,
        surl: surl,
    };
};

const nsfw = async () => {
    let response = await axios.get(
        `${API_URL}search?sorting=random&purity=001${API_INDEX}`
    );
    let path = await response.data.data[1].path;
    let image = await response.data.data[1].thumbs.small;
    let surl = await response.data.data[1].short_url;
    return {
        path: path,
        image: image,
        surl: surl,
    };
};

const get_wall_using_id = async (query) => {
    let id = query.split(" ");
    let response = await axios.get(
        `${WALL_URL}${id}?apikey=${config.API_WALLHAVEN}`
    );
    let data = (await response.data.data) ? response.data.data.path : `404`;
    return data;
};

const toplist = async (query) => {
    let args = query.split(" ");
    let response = await axios.get(
        `${API_URL}search?sorting=toplist&topRange=${args}${API_INDEX}`
    );
    let data = response.data.data.map((obj) => obj.path);
    return data;
};

//
//  C O M M A N D S  S T U F F
//

bot.onText(/^\/start/, (msg) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        bot.sendMessage(msg.chat.id, `Hello there! I am a bot based on NodeJS and Wallhaven\'s API!\
        \nHit /help to get a list of available commands.`, {
            reply_to_message_id: msg.message_id,
        });
    }
});

bot.onText(/^\/ping/, (msg) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        ping(hosts).then(function (delta) {
            bot.sendMessage(msg.chat.id, `Ping time was ` + String(delta) + ` ms.`, {
                reply_to_message_id: msg.message_id,
            });
            console.log(`Starting ping test. Ping time was ` + String(delta) + ` ms`);
        }).catch(function (err) {
            console.error(`Could not ping remote URL`, err);
        });
    }
});

bot.onText(/\/search (.+)/, async (msg, match) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        const resp = await search(match[1]);
        const sendDoc = bot.sendDocument(msg.chat.id, resp.path);
        bot.sendPhoto(msg.chat.id, resp.image, {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "View on website",
                        url: resp.surl,
                    }]
                ]
            }
        }).then(sendDoc);
    }
});

bot.onText(/\/random/, async (msg) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        const resp = await random();
        const sendDoc = bot.sendDocument(msg.chat.id, resp.path);
        bot.sendPhoto(msg.chat.id, resp.image, {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "View on website",
                        url: resp.surl,
                    }]
                ]
            }
        }).then(sendDoc);
    }
});

bot.onText(/\/nsfw/, async (msg) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        const resp = await nsfw();
        const sendDoc = bot.sendDocument(msg.chat.id, resp.path);
        bot.sendPhoto(msg.chat.id, resp.image, {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "View on website",
                        url: resp.surl,
                    }]
                ]
            }
        }).then(sendDoc);
    }
});

bot.onText(/\/getwall (.+)/, async (msg, match) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        const resp = await get_wall_using_id(match[1]);
        resp != `404` ?
            bot.sendDocument(msg.chat.id, resp, {
                reply_to_message_id: msg.message_id,
            }) :
            bot.sendMessage(msg.chat.id, `Try using another wallpaper ID`, {
                reply_to_message_id: msg.message_id,
            });
    }
});

bot.onText(/\/top (.+)/, async (msg, match) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        const resp = await toplist(match[1]);
        for (let i = 0; i < 5; i++) {
            bot.sendDocument(msg.chat.id, resp[i], {
                reply_to_message_id: msg.message_id,
            });
        }
    }
});

bot.onText(/\/help/, (msg) => {
    if (isAuthorized(msg) < 0) {
        sendUnauthorizedMessage(msg);
    } else {
        bot.sendMessage(
            msg.chat.id, `/help : To get this message \
            \n\n/search <keyword> : To get a wallpaper related to the keyword \
            \n\n/nsfw : To get a random NSFW image from Wallhaven \
            \n\n/random : To get any random image from Wallhaven \
            \n\n/ping : To test the ping of the bot with telegram/google \
            \n\n/getwall <id> : Download the wallpaper using it's id \
            \n\n/top <1d/3d/1w/1M/3M/6M/1y> : Returns 5 images based on the specified toprange`, {
            reply_to_message_id: msg.message_id,
        });
    }
});

//
//  F U N C T I O N S
//

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isAuthorized(msg) {
    for (var i = 0; i < config.AUTH_USERS.length; i++) {
        if (config.AUTH_USERS[i] == msg.from.id) return 0;
    }
    if (config.AUTH_CHATS.indexOf(msg.chat.id) > -1 &&
        msg.chat.all_members_are_administrators) return 2;
    if (config.AUTH_CHATS.indexOf(msg.chat.id) > -1) return 3;
    return -1;
}

function sendUnauthorizedMessage(msg) {
    bot.sendMessage(msg.chat.id, `You don't have the permission to use this bot.`, {
        reply_to_message_id: msg.message_id,
    });
}

function init() {
    if (config.TOKEN == undefined || config.API_WALLHAVEN == undefined || config.AUTH_USERS == undefined) {
        console.log(new Error(`\n\nOne or more variables missing in config. Exiting..\n`));
        process.exit(1);
    } else {
        console.log(`\nBot is up and working! All variables are set.`);
    }
};