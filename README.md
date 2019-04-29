# qtum-telegram-stake-alert

> Simple telegram bot that alerts you every time your node mines a block.


## Install


## Guide

### General Requirements

- Windows / Linux system (I recommend you to get a cheap or even free vps server with debian or ubuntu)
- NodeJS (I am using version 10.15) -> https://nodejs.org/en/
- npm (should be included in the nodejs installer)

### Installing the bot

Step 1. Create a directory for the bot
Step 2. Create a file inside that directory called "app.js"
Step 3. Make sure that the console is inside that directory and execute the following command (this will install all the npm packages that we need to run the bot):

```sh
npm install request lowdb wallet-address-validator node-telegram-bot-api
```

Step 4. Open the file "app.js" (that you created in Step 2) and copy the content from the app.js file from this git repository inside the file on your machine.


### Creating a telegram bot API key
Go to your telegram app and follow the following instructions:

Step 1. Find telegram bot named "@botfarther", he will help you with creating and managing your bot.
Step 2. Print “/help” and you will see all possible commands that the botfather can operate.
Step 3. To create a new bot type “/newbot” or click on it. Follow instructions he given and create a new name to your bot.
Step 4. You will see a new API token generated for it (It looks similar to the following API key: 25234234:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0).

-> Copy the API key (don't share the key in public channels) and paste it into the app.js file behind "const token".
For example: const token = "25234234:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0";

### Run the bot using pm2

If you followed the instructions and everything worked you should now be able to run the telegram bot.
I recommend you to use pm2 to run the bot. This will make it possible to let the bot run all the time and also manages to restart the bot incase the nodejs instance crashes for some reason.

Therefor you need to install pm2:
```sh
npm install pm2@latest -g
```

After that you can start the bot using the following command:
```sh
pm2 start app.js
```

Congrats! You should now be able to use the bot!
Create a private chat with the bot and type "/follow test" and see if the bot replies.

