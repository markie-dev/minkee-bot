let axios = require("./axios");

module.exports.getAccount = getAccount;

async function getAccount(summonerName){
    let response = await axios.get(`/summoner/v4/summoners/by-name/${summonerName}`);
    let accountId = response.data.accountId;
    let summonerId = response.data.id;
    return await getMatch(accountId, summonerId, 1);
}

async function getMatch(accountId, summonerId, amountOfGames) {
    let response = await axios.get(`/match/v4/matchlists/by-account/${accountId}`,{
        params: {
            endIndex: amountOfGames,
            beginIndex: 0
        }
    });
    
    let match = response.data.matches[0];
    let gameId = match.gameId;
    // console.log(gameId);
    let champId = match.champion;
    // console.log(response.data);
    return await getMatchData(gameId, summonerId, champId);
};

async function getMatchData(gameId, summonerId, champId) {

    let response = await axios.get(`/match/v4/matches/${gameId}`);
    let body = response.data;

    let participant = body.participants.filter(participant => participant.championId === champId)[0];
   
    //get stats 
    let isVictor = participant.stats.win;
    let totalDamageDealtToChampions = participant.stats.totalDamageDealtToChampions;
    let kdaSpread = `${participant.stats.kills}/${participant.stats.deaths}/${participant.stats.assists}`;
    let kda = (participant.stats.kills + participant.stats.assists) / participant.stats.deaths;
    let cs = ((participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled)/(body.gameDuration/60.0)).toFixed(2);

    let currentRank = await axios.get(`/league/v4/entries/by-summoner/${summonerId}`);
    let tier; let rank; let lp; let winloss;
    
    for(i in currentRank.data){
        if(currentRank.data[i].queueType == "RANKED_SOLO_5x5"){
            tier = currentRank.data[i].tier;
            rank = currentRank.data[i].rank;
            lp = currentRank.data[i].leaguePoints;
            winloss = `${currentRank.data[i].wins}W ${currentRank.data[i].losses}L`;
        }
    }

    let gameData = {
        gameId: gameId,
        win: isVictor,
        currentRank: (tier === "DIAMOND") ? `${tier} ${rank} ${lp} LP` : `${tier} ${lp} LP`,
        WL: winloss,
        dmgDealt: totalDamageDealtToChampions,
        kda:`${kdaSpread} (${kda})`,
        csPerMin: cs
    }

    return gameData;
};