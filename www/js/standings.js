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
                            scores.handicapPins = Math.max(... previous.map(pre => pre.handicapPins));
                            scores.scratchPins = Math.max(... previous.map(pre => pre.scratchPins));
                        }
                        
                        // Calculate the pin count difference between the teams
                        let bowlers = this.recaps.getTeam(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum);
                        let opponents = this.recaps.getTeam(week.weekNum, this.schedule.getOpponentNumber(week.weekNum, this.teamInfo.getTeamByName(team).TeamNum));
                        
                        let game1 = -opponents.map(bowler => this.bowlerGames.getHandicapGame(bowler.BowlerName, week.weekNum, 1)).reduce((a, b) => a + b, 0);
                        game1 += bowlers.map(bowler => this.bowlerGames.getHandicapGame(bowler.BowlerName, week.weekNum, 1)).reduce((a, b) => a + b, 0);
                        
                        let game2 = -opponents.map(bowler => this.bowlerGames.getHandicapGame(bowler.BowlerName, week.weekNum, 2)).reduce((a, b) => a + b, 0);
                        game2 += bowlers.map(bowler => this.bowlerGames.getHandicapGame(bowler.BowlerName, week.weekNum, 2)).reduce((a, b) => a + b, 0);
                        
                        let series = -opponents.map(bowler => this.bowlerGames.getHandicapSeries(bowler.BowlerName, week.weekNum)).reduce((a, b) => a + b, 0);
                        series += bowlers.map(bowler => this.bowlerGames.getHandicapSeries(bowler.BowlerName, week.weekNum)).reduce((a, b) => a + b, 0);
                        
                        // Calculate the associated points earned based on pin totals
                        scores.pointsWon += (game1 > 0) ? 1 : (game1 == 0) ? 0.5 : 0;
                        scores.pointsWon += (game2 > 0) ? 1 : (game2 == 0) ? 0.5 : 0;
                        scores.pointsWon += (series > 0) ? 1 : (series == 0) ? 0.5 : 0;
                        
                        scores.pointsLost = ((previous.length * 3) + 3) - scores.pointsWon;
                        
                        scores.scratchPins += bowlers.map(bowler => this.bowlerGames.getScratchSeries(bowler.BowlerName, week.weekNum)).reduce((a, b) => a + b, 0);
                        scores.handicapPins += bowlers.map(bowler => this.bowlerGames.getHandicapSeries(bowler.BowlerName, week.weekNum)).reduce((a, b) => a + b, 0);
                        
                        this.json_data[week.weekNum].push(scores);
                    });
                    
                    // Sort this week's results
                    this.json_data[week.weekNum] = this.json_data[week.weekNum].sort(function(a, b) {
                        if (0 != (b.pointsWon - a.pointsWon)) {
                            return b.pointsWon - a.pointsWon;
                        } else {
                            return b.scratchPins - a.scratchPins;
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
    
    getTeamPlace(teamName, weekNum) {
        return this.getWeek(weekNum).find(team => team.teamName == teamName).place;
    }
}
