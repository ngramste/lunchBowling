class bowlerGames {
    bowlers = {};

    constructor () {
        return new Promise(resolve => {
            Promise.all([
                new players().then(obj => this.players = obj),
                new recaps().then(obj => this.recaps = obj),
                new schedule().then(obj => this.schedule = obj)
            ]).then(() => {
                // Fill in the list of all bowlers
                this.recaps.getWeekNums().forEach(week => {
                    this.recaps.getWeek(week).forEach(bowler => {
                        if (undefined == this.bowlers[bowler.BowlerName]) {
                            this.bowlers[bowler.BowlerName] = [];
                        }
    
                        let scores = {
                            week: week,
                            date: this.schedule.getDate(week),
                            timestamp: this.schedule.getTimestamp(week),
                            Score1: bowler.Score1,
                            Score2: bowler.Score2,
                            ScoreType1: bowler.ScoreType1,
                            ScoreType2: bowler.ScoreType2
                        }
    
                        this.bowlers[bowler.BowlerName].push(scores);
    
                        // Ensure the weeks are sorted
                        this.bowlers[bowler.BowlerName] = this.bowlers[bowler.BowlerName].sort(function(a, b) {return a.timestamp - b.timestamp});
                    });
                });
    
                // Calculate averages
                Object.keys(this.bowlers).forEach(bowler => {
                    let totalScratch = 0;
                    let games = 0;

                    this.bowlers[bowler].forEach(week => {
                        if (0 == games) {
                            week.averageBefore = Math.floor((week.Score1 + week.Score2) / 2);
                        } else {
                            week.averageBefore = Math.floor(totalScratch / games);
                        }

                        week.handicapBefore = Math.floor(Math.max(0, (220 - week.averageBefore) * 0.9));

                        // If the bowler is absent, don't roll these scores into their average
                        if (week.ScoreType1 == "A") {
                            // Special case where bowler is absent and haven't yet bowled
                            if (0 == games) {
                                week.averageBefore = 140;
                                week.handicapBefore = Math.floor(Math.max(0, (220 - week.averageBefore) * 0.9));
                            }
                        } else {
                            games += 2;
                            totalScratch += week.Score1;
                            totalScratch += week.Score2;
                        }

                        week.totalScratch = totalScratch;
                        if (0 == games) {
                            // Special case where bowler is absent and haven't yet bowled for the year
                            week.averageAfter = 140;
                        } else {
                            week.averageAfter = Math.floor(totalScratch / games);
                        }

                        week.handicapAfter = Math.floor(Math.max(0, (220 - week.averageAfter) * 0.9));
                    });
                });

                resolve(this);
            });
        });
    }

    getGames(name) {
        return this.bowlers[name];
    }

    getGame(name, weekNum) {
        return this.getGames(name).find(game => game.week == weekNum);
    }

    getPlayerTeam(name) {
        let weekNums = this.getGames(name).map(week => week.week);
        let teamList = weekNums.map(week => gameData.recaps.summaries[week].find(bowler => bowler.BowlerName == name).TeamName);

        let count = {};
        teamList.forEach(team => count[team] = (count[team]) ? count[team] + 1 : 1);

        let max = Math.max(... Object.values(count));
        return Object.keys(count).find(key => count[key] == max);
    }

    establishingFlag(name, weekNum) {
        let games = this.getGames(name);
        for (let game = 0; game < games.length; game++) {
            if ("A" != games[game].ScoreType1) {
                if (games[game].week == weekNum) {
                    return "e";
                } else {
                    return "";
                }
            }
        }
    }

    getScratchSeries(name, weekNum) {
        let game = this.getGame(name, weekNum);
        return game.Score1 + game.Score2;
    }

    getHandicapSeries(name, weekNum) {
        let game = this.getGame(name, weekNum);
        return game.Score1 + game.Score2 + game.handicapBefore + game.handicapBefore;
    }

    getHandicapGame(name, weekNum, gameNum) {
        let game = this.getGame(name, weekNum);
        return ((1 == gameNum) ? game.Score1 : game.Score2) + game.handicapBefore;
    }

    getGamePrefix(name, weekNum, gameNum) {
        let game = this.getGame(name, weekNum);

        if (1 == gameNum) {
            if ("A" == game.ScoreType1) {
                return "a";
            }
        }

        if (2 == gameNum) {
            if ("A" == game.ScoreType1) {
                return "a";
            }
        }

        return "";
    }

    getGender(name) {
        return this.players.getPlayerByName(name).Gender;
    }
    
    getHighGames(name, minWeeks = 1, weekNum = null) {
        let weeks = this.getGames(name);
        
        if (undefined != this.getGames(name)) {
            if (null != weekNum) {
                weeks = this.getGames(name).filter(week => week.timestamp <= this.schedule.getTimestamp(weekNum));
            }
            
            if (undefined != weeks && weeks.length >= minWeeks) {
                let highScratchGame = Math.max(... weeks.map(week => [week.Score1, week.Score2]).flat());
                let highScratchSeries = Math.max(... weeks.map(week => week.Score1 + week.Score2).flat());
                let highHandicapGame = Math.max(... weeks.map(week => [week.Score1 + week.handicapBefore, week.Score2 + week.handicapBefore]).flat());
                let highHandicapSeries = Math.max(... weeks.map(week => week.Score1 + week.handicapBefore + week.Score2 + week.handicapBefore).flat());
                
                return {
                    highScratchGame: weeks.find(week => week.Score1 == highScratchGame || week.Score2 == highScratchGame),
                    highScratchSeries: weeks.find(week => week.Score1 + week.Score2 == highScratchSeries),
                    highHandicapGame: weeks.find(week => (week.Score1 + week.handicapBefore) == highHandicapGame || (week.Score2 + week.handicapBefore) == highHandicapGame),
                    highHandicapSeries: weeks.find(week => (week.Score1 + week.handicapBefore + week.Score2 + week.handicapBefore) == highHandicapSeries)
                };
            }
        }
        return undefined;
    }
    
    getLowGames(name, minWeeks = 1, weekNum = null) {
        let weeks = this.getGames(name);
        
        if (undefined != this.getGames(name)) {
            if (null != weekNum) {
                weeks = this.getGames(name).filter(week => week.timestamp <= this.schedule.getTimestamp(weekNum));
            }
            
            if (undefined != weeks && weeks.length >= minWeeks) {
                let lowScratchGame = Math.min(... weeks.map(week => [week.Score1, week.Score2]).flat());
                let lowScratchSeries = Math.min(... weeks.map(week => week.Score1 + week.Score2).flat());
                let lowHandicapGame = Math.min(... weeks.map(week => [week.Score1 + week.handicapBefore, week.Score2 + week.handicapBefore]).flat());
                let lowHandicapSeries = Math.min(... weeks.map(week => week.Score1 + week.handicapBefore + week.Score2 + week.handicapBefore).flat());
                
                return {
                    lowScratchGame: weeks.find(week => week.Score1 == lowScratchGame || week.Score2 == lowScratchGame),
                    lowScratchSeries: weeks.find(week => week.Score1 + week.Score2 == lowScratchSeries),
                    lowHandicapGame: weeks.find(week => (week.Score1 + week.handicapBefore) == lowHandicapGame || (week.Score2 + week.handicapBefore) == lowHandicapGame),
                    lowHandicapSeries: weeks.find(week => (week.Score1 + week.handicapBefore + week.Score2 + week.handicapBefore) == lowHandicapSeries)
                };
            }
        }
        return undefined;
    }

    getTeamHighGames(teamNum, weekNum = 52) {
        let scores = {};

        let teamGames = this.schedule.getCurrentWeekNumbers()
            .filter(week => week <= weekNum)
            .map(week => {
                return {
                    weekNum: week,
                    games: this.recaps.getTeam(week, teamNum)
                };
            });

        // Sort by team scratch series
        teamGames.sort(function(a,b) {
            return (b.games[0].Score1 + b.games[0].Score2 + b.games[1].Score1 + b.games[1].Score2) 
                    - (a.games[0].Score1 + a.games[0].Score2 + a.games[1].Score1 + a.games[1].Score2)
        });

        scores.highScratchSeries = {
            score: teamGames[0].games.map(game => game.Score1 + game.Score2).reduce((a,b) => a + b),
            games: teamGames[0]
        };

        // Sort by team scratch game
        teamGames.sort(function(a,b) {
            return Math.max(... [b.games[0].Score1 + b.games[1].Score1, b.games[0].Score2 + b.games[1].Score2]) 
                    - Math.max(... [a.games[0].Score1 + a.games[1].Score1, a.games[0].Score2 + a.games[1].Score2])
        });

        scores.highScratchGame = {
            score: Math.max(... [teamGames[0].games[0].Score1 + teamGames[0].games[1].Score1, teamGames[0].games[0].Score2 + teamGames[0].games[1].Score2]),
            games: teamGames[0]
        };

        // Sort by team handicap series
        teamGames.sort(function(a,b) {
            return b.games.map(game => game.Score1 + game.Score2 + ( 2 * game.HandicapBeforeBowling)).reduce((a,b) => a + b)
                    - a.games.map(game => game.Score1 + game.Score2 + ( 2 * game.HandicapBeforeBowling)).reduce((a,b) => a + b)
        });

        scores.highHandicapSeries = {
            score: teamGames[0].games.map(game => game.Score1 + game.Score2 + ( 2 * game.HandicapBeforeBowling)).reduce((a,b) => a + b),
            games: teamGames[0]
        };

        // Sort by team handicap game
        teamGames.sort(function(a,b) {
            return Math.max(... [
                    b.games[0].Score1 + b.games[0].HandicapBeforeBowling + b.games[1].Score1 + b.games[1].HandicapBeforeBowling, 
                    b.games[0].Score2 + b.games[0].HandicapBeforeBowling + b.games[1].Score2 + b.games[1].HandicapBeforeBowling
                ]) 
                - Math.max(... [
                    a.games[0].Score1 + a.games[0].HandicapBeforeBowling + a.games[1].Score1 + a.games[1].HandicapBeforeBowling, 
                    a.games[0].Score2 + a.games[0].HandicapBeforeBowling + a.games[1].Score2 + a.games[1].HandicapBeforeBowling
                ])
        });

        scores.highHandicapGame = {
            score: Math.max(... [
                teamGames[0].games[0].Score1 + teamGames[0].games[0].HandicapBeforeBowling + teamGames[0].games[1].Score1 + teamGames[0].games[1].HandicapBeforeBowling, 
                teamGames[0].games[0].Score2 + teamGames[0].games[0].HandicapBeforeBowling + teamGames[0].games[1].Score2 + teamGames[0].games[1].HandicapBeforeBowling
            ]),
            games: teamGames[0]
        };

        return scores;
    }
}
