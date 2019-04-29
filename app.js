const request = require("request"),
  low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("db.json"),
  db = low(adapter),
  WAValidator = require("wallet-address-validator"),
  TelegramBot = require("node-telegram-bot-api");

const token = ""; //here you need to add your telegram bot API key
const bot = new TelegramBot(token, { polling: true });

// configure local json database
db.defaults({ wallets: [] }).write();

// Telegram bot command listeners
bot.onText(/\/follow/, msg => {
  var address = msg.text.replace("/follow ", "");
  addAddress(address, msg.chat.id);
});

bot.onText(/\/remove/, msg => {
  var address = msg.text.replace("/remove ", "");
  removeAddress(address, msg.chat.id);
});

// function that gets called when you use the /follow command

function addAddress(address, chatId) {
  var valid = WAValidator.validate(address, "QTUM");
  if (valid) {
    request("https://qtum.info/api/address/" + address, function(
      error,
      response,
      body
    ) {
      if (response.statusCode === 200) {
        var jsonObject = JSON.parse(body);
        console.log(jsonObject.blocksMined);
        db.get("wallets")
          .push({
            address: address,
            blocksMined: jsonObject.blocksMined,
            chatId: chatId
          })
          .write();
        bot.sendMessage(
          chatId,
          "Success! 🎉 - You will from now on receive alerts if you mine a block!"
        );
      } else {
        console.log("API is probably down...");
        bot.sendMessage(
          chatId,
          "Oh no! It seems like the Bot can't reach the qtum.info API."
        );
      }
    });
  } else {
    bot.sendMessage(
      chatId,
      "Oh no! It seems like the address you tried to add is not a valid QTUM address. Please check if you copied the right address and try again!"
    );
  }
}

// function that gets called when you use the /remove command

function removeAddress(address, chatId) {
  var valid = WAValidator.validate(address, "QTUM");
  if (valid) {
    db.get("wallets")
      .remove({ address: address, chatId: chatId })
      .write();
    bot.sendMessage(
      chatId,
      "Success! From now on you WON'T receive updates from this address."
    );
  } else {
    bot.sendMessage(
      chatId,
      "Oh no! It seems like the address you tried to add is not a valid QTUM address. Please check if you copied the right address and try again!"
    );
  }
}

// this function gets called every x - seconds (depending on the intervall that you set) for each address that is added to your lcoal json database
// it checks if the blocksMined value changed for each address and notifies if the case happened + updates the blocksMined value in the local json database

function checkAddress(address, blocksMined, chatId) {
  request("https://qtum.info/api/address/" + address, function(
    error,
    response,
    body
  ) {
    if (response.statusCode === 200) {
      var jsonObject = JSON.parse(body);
      console.log(jsonObject.blocksMined);
      if (jsonObject.blocksMined !== blocksMined) {
        // send chat message and update wallet
        db.get("wallets")
          .find({ address: address })
          .assign({ blocksMined: jsonObject.blocksMined })
          .write();

        bot.sendMessage(
          chatId,
          "🎉 Congrats! You just mined a block! 🎉\n\n" +
            "If you want to see your new balance, feel free to check out the following url: " +
            "https://qtum.info/address/" +
            address
        );
      } else {
        console.log("Nothing Changed");
      }
    } else {
      console.log("API might be down...");
    }
  });
}

function checkForChanges() {
  var length = db
    .get("wallets")
    .size()
    .value();
  for (var i = 0; i < length; i++) {
    var address = db.get("wallets[" + i + "].address").value();
    var blocksMined = db.get("wallets[" + i + "].blocksMined").value();
    var chatId = db.get("wallets[" + i + "].chatId").value();
    checkAddress(address, blocksMined, chatId);
  }
}

setInterval(checkForChanges, 10000); // here you can define the intervall in which the bot checks if one of the addresses / nodes mined a block. Currently it is set to 10 seconds (10000ms)
