class players {
    json_players = null;

    constructor () {
        return new Promise(resolve => {
            makeRequest("GET", PLAYERS_PATH).then(responseText => {
                this.json_players = JSON.parse(responseText).Data;
                resolve(this);
            });
        });
    }

    getPlayerById(bowlerID) {
        return this.json_players.find(bowler => bowler.BowlerID == bowlerID);
    }

    getPlayerByName(name) {
        return this.json_players.find(bowler => bowler.BowlerName == name);
    }

    getPlayerNames() {
        return this.json_players.map(bowler => bowler.BowlerName);
    }

    getGender(name) {
        return this.getPlayerByName(name).Gender;
    }
}