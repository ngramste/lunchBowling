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
