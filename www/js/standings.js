class standings {
    json_data = {};
    
    constructor () {
        return new Promise(resolve => {
            Promise.all([
                new schedule().then(obj => this.schedule = obj),
                new bowlerGames().then(obj => this.bowlerGames = obj),
                new recaps().then(obj => this.recaps = obj),
                new teamInfo().then(obj => this.teamInfo = obj)
            ]).then(() => {
                // Loop over all the weeks
                let completedWeeks = this.schedule.schedule.filter(week => this.recaps.getWeekNums().includes(week.weekNum));
                completedWeeks.forEach(week => {
                    this.json_data[week.weekNum] = [];
                    
                    // Loop over each team
                    this.teamInfo.getTeamList().forEach(team => {
                        let scores = {
                            teamName: team,
                            pointsWon: 0,
                            pointsLost: 0,
                            handicapPins: 0,
                            scratchPins: 0
                        };
                        
                        let previous = Object.values(this.json_data).map(pre => pre.find(name => name.teamName == team)).filter(pre => pre != undefined);
                        if(previous && undefined != previous[0]) {
                            scores.pointsWon = Math.max(... previous.map(pre => pre.pointsWon));
                            scores.pointsLost = Math.max(... previous.map(pre => pre.pointsLost));
                            scores.handicapPins = Math.max(... previous.map(pre => pre.handicapPins));
                            scores.scratchPins = Math.max(... previous.map(pre => pre.scratchPins));
                        }
                        
                        scores.pointsWon += this.bowlerGames.getTeamPoints(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum).won;
                        scores.pointsLost += this.bowlerGames.getTeamPoints(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum).lost;

                        scores.scratchPins += this.bowlerGames.getTeamGame(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum).SeriesTotal;
                        scores.handicapPins += this.bowlerGames.getTeamGame(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum).HandicapSeriesTotal;
                        
                        this.json_data[week.weekNum].push(scores);
                    });
                    
                    // Sort this week's results
                    this.json_data[week.weekNum] = this.json_data[week.weekNum].sort(function(a, b) {
                        if (0 != (b.pointsWon - a.pointsWon)) {
                            return b.pointsWon - a.pointsWon;
                        } else {
                            return b.handicapPins - a.handicapPins;
                        };
                    });
                    
                    // Add in place information
                    this.json_data[week.weekNum].forEach((team, index) => team.place = index + 1);
                });
                
                resolve(this);
            });
        });
    }
    
    getWeek(weekNum) {
        return this.json_data[weekNum];
    }

    getLatestWeek() {
        return this.json_data[Math.max(... Object.keys(this.json_data))];
    }
    
    getTeamPlace(teamName, weekNum) {
        return this.getWeek(weekNum).find(team => team.teamName == teamName).place;
    }
}
