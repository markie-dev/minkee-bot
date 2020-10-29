let Twit = require('twit');
require('dotenv').config();
let Datastore = require('nedb');
let { getMessage } = require("./messages.js");
let database = new Datastore('matches.db');

database.loadDatabase();

module.exports.tweetMessage = getTweet;

async function getTweet() {
    let response = await getMessage();
    let matchId = response.gameId;
    let message = response.message;

    database.find({matchId}, function(err, docs) {
        if(docs === undefined || docs.length=== 0) {
            database.insert({matchId});
            tweetIt(message);
        }
        else {
            console.log("No new tweet");
        }
    });
 }

function tweetIt(message) {
    let T = new Twit({ 
        consumer_key: process.env.TWIT_KEY,
        consumer_secret: process.env.TWIT_SECRET_KEY,
        access_token: process.env.TWIT_ACCESS_KEY,
        access_token_secret: process.env.TWIT_ACCESS_SECRET_KEY
    });

    let tweet = {status: message};

    T.post('statuses/update', tweet, (err, data, response) => {
        let currentDate = new Date();
        let timestamp = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getFullYear() + 
        " " + currentDate.getHours() + ":" + currentDate.getMinutes();
        console.log("Tweeted at " + timestamp);
    })
}
