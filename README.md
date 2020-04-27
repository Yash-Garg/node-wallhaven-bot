# What is this bot about?
A telegram bot to download wallpapers from Wallhaven based on NodeJS by [Me](https://github.com/Yash-Garg) and [Barun](https://github.com/daemon1024).

![wallhaven image](https://w.wallhaven.cc/full/1j/wallhaven-1j7eg3.png)

## Limitations
This bot should not be spammed with commands as [Wallhaven API](https://wallhaven.cc/help/api#limits) allows only 45 requests per minute, if you hit this limit you will receive a **429 - Too many requests error**.

## Bot Commands

* `/random` : Provides a random image from the wallhaven database
* `/search <keyword>` : Provides a random image related to the keyword
* `/nsfw` : Provides a random NSFW (not safe for work) image 
* `/getwall <id>` : Provides the specific wall requested by matching the id provided by user
* `/top <1d/3d/1w/1M/3M/6M/1y>` : Provides 5 images from the toplist based on the topRange specified by user
* `/ping` : Checks the response time of bot by requesting to telegram api

**NOTE** : Image previews are not shown in toplist command to prevent API spam
# How to deploy?
## Installing requirements
* Clone this repo :
```git
git clone https://github.com/Yash-Garg/node-wallhaven-bot
cd node-wallhaven-bot
```
> Make sure NodeJS and npm is installed
* Install required npm packages :
```node
npm install
```
## Setting up config file
* Copy example config as config.js :
`cp example_config.js config.js`

Fill up all the fields. Meaning of each fields are discussed below:
* **TOKEN** : The telegram bot token that you get from [@BotFather](https://t.me/botfather)
* **API_WALLHAVEN** : Your wallhaven API which you can get by making up an account on [Wallhaven](https://wallhaven.cc). API can be found under the Settings > Account tab
* **AUTH_USERS** : Telegram ID of users whom u want to allow access to use this bot
* **AUTH_CHATS** : Telegram ID of the chat where u want to allow access of bot by anyone in that particular chat 

**NOTE** : `AUTH_CHATS` is optional, u can leave it blank or as it is.

# Deploying
* Start the bot by using this command :
`npm start`
