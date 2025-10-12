class recaps {
    summaries = {};

    constructor () {
        return new Promise(resolve => {
            new schedule().then(result => {
                this.schedule = result;

                // Build the list of summeries to pull
                this.promises = this.schedule.getCurrentWeekNumbers()
                    .map(week => makeRequest("GET", `${SUMMARY_PATH}/week${week}.json`)
                        .then(result => this.summaries[week] = JSON.parse(result).Data)
                        .catch(error => console.log(`File not found ${SUMMARY_PATH}/week${week}.json`)));

                // Resolve all the get requests for summary data
                return Promise.all(this.promises);
            }).then(() => {
                // Return this object
                resolve(this);
            });
        });
    }

    getWeekNums() {
        return Object.keys(this.summaries).map(num => Number(num));
    }

    getWeek(weekNum) {
        return this.summaries[weekNum];
    }

    gamesPerWeek(weekNum = 1) {
        // Find the max number of games bowled by a person
        return Math.max(...
            // Get the week
            gameData.recaps.getWeek(weekNum)
                .map(bowler => arrayBuilder(1, MAX_GAMES_PER_WEEK)
                    // Get the score types
                    .map(game =>  bowler[`ScoreType${game}`])
                    // Filter out the none type
                    .filter(type => type != "0")
                    // Count up the games
                    .length));
    }

    bowlersPerTeam(weekNum = 1, teamNum = undefined) {
        // Get the corresponding week
        let teamCounts = this.summaries[weekNum]
        // Get a list of bowler's team names
        .map(bowler => bowler.TeamNum)
        // Count the occourances of each team
        .reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});

        if (undefined != teamNum) {
            return teamCounts[teamNum];
        }

        return Math.max(... Object.values(teamCounts));
    }

    getTeam(weekNum, teamNum) {
        return this.getWeek(weekNum).filter(bowler => bowler.TeamNum == teamNum);
    }

    getBowler(weekNum, bowlerName) {
        return this.getWeek(weekNum).find(bowler => bowler.BowlerName == bowlerName);
    }

    getTeamMemberNames(weekNum, teamNum) {
        return this.getTeam(weekNum, teamNum).map(bowler => bowler.BowlerName);
    }
}
