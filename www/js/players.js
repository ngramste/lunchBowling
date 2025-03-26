class players {
    json_players = null;

    constructor () {
        return new Promise(resolve => {
            Promise.all([
                makeRequest("GET", PLAYERS_PATH).then(responseText => this.json_players = JSON.parse(responseText).Data),
                makeRequest("GET", FRIENDLY_NAMES_PATH).then(responseText => this.friendly_names = JSON.parse(responseText).Data)
            ]).then(() => {
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
    
    getPlayerNamesByGender(gender) {
        return weeklyStandings.bowlerGames.players.getPlayerNames()
            .map(bowlerName => (weeklyStandings.bowlerGames.players.getGender(bowlerName) == gender) ? bowlerName : undefined)
            .filter(bowlerName => bowlerName != undefined);
    }

    getGender(name) {
        return this.getPlayerByName(name).Gender;
    }

    prettyName(bowlerName) {
        let name = this.friendly_names.find(bowler => bowler.BowlerName == bowlerName);

        if (undefined == name) {
            name = bowlerName;
        } else {
            name = name.FriendlyName;
        }

        return `${name.split(",")[1]} ${name.split(",")[0]}`.trim();
    }
}