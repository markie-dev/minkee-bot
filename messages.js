let { getAccount } = require("./api-files/riot.js");
let { winMessages, loseMessages } = require("./components/tweetMessage.js");
let summonerName = "Tameedrocus";

module.exports.getMessage = getMessage;

async function getMessage() {
  let gameData = await getAccount(summonerName);
  let message;

  //depending on win or lose, append string message
  if (gameData.win) {
    message = winMessages[Math.floor(Math.random() * winMessages.length)];
    message += "\n\nRare Minkee W \n\n";
  } else {
    message =
      loseMessages[Math.floor(Math.floor(Math.random() * loseMessages.length))];
    message += "\n\nLOL you lost again?? \n\n";
  }

  message += "@minkeekang stats: \n";
  let gameStat = Object.entries(gameData);
  let gameId = gameData.gameId;
  for (i in gameStat) {
    if (i != 3) {
      let camel = gameStat[i][0].replace(/([A-Z])+/g, " $1");
      let normal = camel.charAt(0).toUpperCase() + camel.slice(1);
      gameStat[i][0] = normal;
    }
  }
  for (i = 4; i < 7; i++) {
    message += gameStat[i][0] + ": " + gameStat[i][1] + "\n";
  }
  for (i = 7; i < 8; i++) {
    message += gameStat[i][0] + ": " + gameStat[i][1] + "\n";
  }

  message +=
    "\n" + gameStat[2][1] + " / " + gameStat[3][0] + ": " + gameStat[3][1];

  let messageData = {
    gameId: gameId,
    message: message,
  };

  // console.log(message);
  return messageData;
}
