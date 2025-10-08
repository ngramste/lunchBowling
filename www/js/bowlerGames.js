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

                        bowler.week = week;
                        bowler.date = this.schedule.getDate(week);
                        bowler.timestamp = this.schedule.getTimestamp(week);
    
                        this.bowlers[bowler.BowlerName].push(bowler);
    
                        // Ensure the weeks are sorted
                        this.bowlers[bowler.BowlerName] = this.bowlers[bowler.BowlerName].sort(function(a, b) {return a.timestamp - b.timestamp});
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

    isEstablishing(name, weekNum) {
        let games = this.getGames(name);
        for (let game = 0; game < games.length; game++) {
            if ("A" != games[game].ScoreType1 && "V" != games[game].ScoreType1) {
                if (games[game].week == weekNum && 0 == games[game].PlusMinusAverage) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    establishingFlag(name, weekNum) {
        return this.isEstablishing(name, weekNum) ? "e" : "";
    }

    getScratchSeries(name, weekNum) {
        return arrayBuilder(1,6).map(num => this.getGame(name, weekNum)[`Score${num}`]).reduce((acc, i) => acc + i);
    }

    getHandicapSeries(name, weekNum) {
        return this.getScratchSeries(name, weekNum) + (this.getGame(name, weekNum).HandicapBeforeBowling * arrayBuilder(1,6).map(num => this.getGame(name, weekNum)[`ScoreType${num}`]).filter(type => "0" != type).length);
    }

    getHandicapGame(name, weekNum, gameNum) {
        let game = this.getGame(name, weekNum);
        return game[`Score${gameNum}`] + game.HandicapBeforeBowling;
    }

    calculateAverage(name, weekNum) {
        let games = this.getGames(name).filter(game => game.week <= weekNum);

        let gameCount = 0;

        return Math.floor(games.reduce((acc, week) => {
            return acc + arrayBuilder(1,6).reduce((acc, game) => {
                if ("S" == week[`ScoreType${game}`]) {
                    gameCount++;
                }
                return acc + week[`Score${game}`];
            }, 0);
        }, 0) / gameCount);
    }

    getGamePrefix(name, weekNum, gameNum) {
        switch (this.getGame(name, weekNum)[`ScoreType${gameNum}`]) {
            case "A":
                return "a";

            case "V":
                return "v";

            default:
                return this.establishingFlag(name, weekNum);
        }
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
                let highHandicapGame = Math.max(... weeks.map(week => [week.Score1 + week.HandicapBeforeBowling, week.Score2 + week.HandicapBeforeBowling]).flat());
                let highHandicapSeries = Math.max(... weeks.map(week => week.Score1 + week.HandicapBeforeBowling + week.Score2 + week.HandicapBeforeBowling).flat());
                
                let results = {
                    highScratchGame: {
                        game: weeks.find(week => week.Score1 == highScratchGame || week.Score2 == highScratchGame)
                    },
                    highScratchSeries: {
                        game: weeks.find(week => week.Score1 + week.Score2 == highScratchSeries)
                    },
                    highHandicapGame: {
                        game: weeks.find(week => (week.Score1 + week.HandicapBeforeBowling) == highHandicapGame || (week.Score2 + week.HandicapBeforeBowling) == highHandicapGame)
                        
                    },
                    highHandicapSeries: {
                        game: weeks.find(week => (week.Score1 + week.HandicapBeforeBowling + week.Score2 + week.HandicapBeforeBowling) == highHandicapSeries)
                    }
                };
                
                results.highScratchGame.score = Math.max(... [results.highScratchGame.game.Score1, results.highScratchGame.game.Score2]);
                results.highScratchSeries.score = results.highScratchSeries.game.Score1 + results.highScratchSeries.game.Score2;
                results.highHandicapGame.score = Math.max(... [results.highHandicapGame.game.Score1 + results.highHandicapGame.game.HandicapBeforeBowling, results.highHandicapGame.game.Score2 + results.highHandicapGame.game.HandicapBeforeBowling]);
                results.highHandicapSeries.score = results.highHandicapSeries.game.Score1 + results.highHandicapSeries.game.Score2 + (2 * results.highHandicapSeries.game.HandicapBeforeBowling);
                
                return results;
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
                let lowHandicapGame = Math.min(... weeks.map(week => [week.Score1 + week.HandicapBeforeBowling, week.Score2 + week.HandicapBeforeBowling]).flat());
                let lowHandicapSeries = Math.min(... weeks.map(week => week.Score1 + week.HandicapBeforeBowling + week.Score2 + week.HandicapBeforeBowling).flat());
                
                return {
                    lowScratchGame: weeks.find(week => week.Score1 == lowScratchGame || week.Score2 == lowScratchGame),
                    lowScratchSeries: weeks.find(week => week.Score1 + week.Score2 == lowScratchSeries),
                    lowHandicapGame: weeks.find(week => (week.Score1 + week.HandicapBeforeBowling) == lowHandicapGame || (week.Score2 + week.HandicapBeforeBowling) == lowHandicapGame),
                    lowHandicapSeries: weeks.find(week => (week.Score1 + week.HandicapBeforeBowling + week.Score2 + week.HandicapBeforeBowling) == lowHandicapSeries)
                };
            }
        }
        return undefined;
    }

    getImprovement(name, baselineGames = 21) {
        let games = this.getGames(name);
        
        // Filter out absent games
        if (undefined != games) games = games.filter(game => this.getGamePrefix(name, game.week, 0) == "");
        
        if (undefined != games && (games.length * 2) >= baselineGames) {
            games = games.map(week => [week.Score1, week.Score2]).flat();
            return Math.round(games.reduce((a,b) => a+b) / games.length) - Math.round(games.slice(0, baselineGames).reduce((a,b) => a+b) / baselineGames);
            // return (games.reduce((a,b) => a+b) / games.length) - (games.slice(baselineGames).reduce((a,b) => a+b) / (games.length - baselineGames));
        }

        return undefined;
    }

    getTeamHighGames(teamNum, weekNum = 52) {
        let scores = {};

        let teamGames = this.recaps.getWeekNums()
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
