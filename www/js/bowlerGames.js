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

    gamesPerWeek(weekNum = 1) {
        return this.recaps.gamesPerWeek(weekNum);
    }

    // This is the special way battle of the sexes calculates team handicaps
    deltaTeamHandicap(weekNum, teamNum) {
        let bowlers = this.recaps.getTeam(weekNum, teamNum);
        let opponents = this.recaps.getTeam(weekNum, this.schedule.getOpponentNumber(weekNum, teamNum));

        return Math.max(... [
            0, 
            Math.floor(0.95 * (opponents.map(bowler => bowler.AverageBeforeBowling).reduce((acc, i) => acc + i) 
                    - bowlers.map(bowler => bowler.AverageBeforeBowling).reduce((acc, i) => acc + i)))
            ]);
    }

    getTeamGame(weekNum, teamNum) {
        let bowlers = this.recaps.getTeam(weekNum, teamNum);
        
        let gameTypes = bowlers.map(bowler => arrayBuilder(1, this.gamesPerWeek()).map(game => bowler[`ScoreType${game}`])).flat();
        let allAbsent = gameTypes.filter(game => "A" == game).length == gameTypes.length;

        return {
            Score1: bowlers.reduce((acc, i) => acc + i.Score1, 0),
            Score2: bowlers.reduce((acc, i) => acc + i.Score2, 0),
            Score3: bowlers.reduce((acc, i) => acc + i.Score3, 0),
            Score4: bowlers.reduce((acc, i) => acc + i.Score4, 0),
            Score5: bowlers.reduce((acc, i) => acc + i.Score5, 0),
            Score6: bowlers.reduce((acc, i) => acc + i.Score6, 0),
            SeriesTotal: (allAbsent) ? 0 : bowlers.reduce((acc, i) => {
                    return acc + arrayBuilder(1, this.gamesPerWeek()).map(game => i[`Score${game}`]).reduce((acc, i) => acc + i, 0);
                }, 0),
            HandicapSeriesTotal: (102860 == leagueId) 
                ? (allAbsent) ? 0 : bowlers.reduce((acc, i) => {
                    return acc + arrayBuilder(1, this.gamesPerWeek()).map(game => i[`Score${game}`]).reduce((acc, i) => acc + i, 0);
                }, 0) + (this.deltaTeamHandicap(weekNum, teamNum) * this.gamesPerWeek()) 
                : (allAbsent) ? 0 : bowlers.reduce((acc, i) => {
                    return acc + arrayBuilder(1, this.gamesPerWeek()).map(game => i[`Score${game}`] + i.HandicapBeforeBowling).reduce((acc, i) => acc + i, 0);
                }, 0),
            HandicapBeforeBowling: (102860 == leagueId) ? this.deltaTeamHandicap(weekNum, teamNum) : bowlers.reduce((acc, i) => acc + i.HandicapBeforeBowling, 0)
        }
    }

    getTeamGames(teamNum) {
        return this.recaps.getWeekNums().map(weekNum => this.getTeamGame(weekNum, teamNum));
    }

    getTeamPoints(weekNum, teamNum) {
        let team = this.getTeamGame(weekNum, teamNum);
        let opponents = this.getTeamGame(weekNum, this.schedule.getOpponentNumber(weekNum, teamNum));

        let points = {};
        arrayBuilder(1, this.gamesPerWeek()).forEach(gameNum => {
            points[`Score${gameNum}`] = (team[`Score${gameNum}`] + team.HandicapBeforeBowling > opponents[`Score${gameNum}`] + opponents.HandicapBeforeBowling) ? 1 :
                (team[`Score${gameNum}`] + team.HandicapBeforeBowling == opponents[`Score${gameNum}`] + opponents.HandicapBeforeBowling) ? 0.5 : 0;
        });

        points.series = (team.HandicapSeriesTotal > opponents.HandicapSeriesTotal) ? 1 :
                (team.HandicapSeriesTotal == opponents.HandicapSeriesTotal) ? 0.5 : 0;

        points.won = Object.values(points).reduce((acc, i) => acc + i);
        points.lost = (this.gamesPerWeek() + 1) - points.won;

        return points;
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
        return arrayBuilder(1,MAX_GAMES_PER_WEEK).map(num => this.getGame(name, weekNum)[`Score${num}`]).reduce((acc, i) => acc + i);
    }

    getHandicapSeries(name, weekNum) {
        return this.getScratchSeries(name, weekNum) + (this.getGame(name, weekNum).HandicapBeforeBowling * arrayBuilder(1,MAX_GAMES_PER_WEEK).map(num => this.getGame(name, weekNum)[`ScoreType${num}`]).filter(type => "0" != type).length);
    }

    getHandicapGame(name, weekNum, gameNum) {
        let game = this.getGame(name, weekNum);
        return game[`Score${gameNum}`] + game.HandicapBeforeBowling;
    }

    calculateAverage(name, weekNum) {
        let games = this.getGames(name).filter(game => game.week <= weekNum);

        let gameCount = 0;

        return Math.floor(games.reduce((acc, week) => {
            return acc + arrayBuilder(1, MAX_GAMES_PER_WEEK).reduce((acc, game) => {
                if ("S" == week[`ScoreType${game}`]) {
                    gameCount++;
                    return acc + week[`Score${game}`];
                } else {
                    return acc;
                }
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
        // Get a list of all games bowled
        let weeks = this.getGames(name);
        
        if (undefined != this.getGames(name)) {
            // Optionally filter out games after the weekNum in question
            if (null != weekNum) {
                weeks = this.getGames(name).filter(week => week.timestamp <= this.schedule.getTimestamp(weekNum));
            }
            
            // Check to make sure that there are enough games to make a comparison
            if (undefined != weeks && weeks.length >= minWeeks) {
                // Find the high scores
                let highScratchGame = Math.max(... weeks.map(week => arrayBuilder(1,MAX_GAMES_PER_WEEK).map(game => week[`Score${game}`])).flat().filter(score => score));
                let highScratchSeries = Math.max(... weeks.map(week => week.SeriesTotal).flat().filter(score => score));
                let highHandicapGame = Math.max(... weeks.map(week => arrayBuilder(1,MAX_GAMES_PER_WEEK).map(game => week[`Score${game}`] + week.HandicapBeforeBowling)).flat().filter(score => score));
                let highHandicapSeries = Math.max(... weeks.map(week => week.HandicapSeriesTotal).flat().filter(score => score));
                
                // Find the actual week those scores occurred in
                let results = {
                    highScratchGame: {
                        game: weeks.find(week => arrayBuilder(1,MAX_GAMES_PER_WEEK).map(game => week[`Score${game}`]).includes(highScratchGame)),
                        score: highScratchGame
                    },
                    highScratchSeries: {
                        game: weeks.find(week => week.SeriesTotal == highScratchSeries),
                        score: highScratchSeries
                    },
                    highHandicapGame: {
                        game: weeks.find(week => arrayBuilder(1,MAX_GAMES_PER_WEEK).map(game => week[`Score${game}`] + week.HandicapBeforeBowling).includes(highHandicapGame)),
                        score: highHandicapGame
                    },
                    highHandicapSeries: {
                        game: weeks.find(week => week.HandicapSeriesTotal == highHandicapSeries),
                        score: highHandicapSeries
                    }
                };
                
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
                let lowScratchGame = Math.min(... weeks.map(week => arrayBuilder(1, this.gamesPerWeek()).map(game => week[`Score${game}`])).flat());
                let lowScratchSeries = Math.min(... weeks.map(week => week.SeriesTotal).flat());
                let lowHandicapGame = Math.min(... weeks.map(week => arrayBuilder(1, this.gamesPerWeek()).map(game => week[`Score${game}`] + week.HandicapBeforeBowling)).flat());
                let lowHandicapSeries = Math.min(... weeks.map(week => week.HandicapSeriesTotal).flat());
                
                // Find the actual week those scores occurred in
                let results = {
                    lowScratchGame: {
                        game: weeks.find(week => arrayBuilder(1, this.gamesPerWeek()).map(game => week[`Score${game}`]).includes(lowScratchGame)),
                        score: lowScratchGame
                    },
                    lowScratchSeries: {
                        game: weeks.find(week => week.SeriesTotal == lowScratchSeries),
                        score: lowScratchSeries
                    },
                    lowHandicapGame: {
                        game: weeks.find(week => arrayBuilder(1, this.gamesPerWeek()).map(game => week[`Score${game}`] + week.HandicapBeforeBowling).includes(lowHandicapGame)),
                        score: lowHandicapGame
                    },
                    lowHandicapSeries: {
                        game: weeks.find(week => week.HandicapSeriesTotal == lowHandicapSeries),
                        score: lowHandicapSeries
                    }
                };
                
                return results;
            }
        }
        return undefined;
    }

    getImprovement(name, baselineGames = 21) {
        let games = this.getGames(name);
        
        // Filter out absent games
        if (undefined != games) games = games.filter(game => this.getGamePrefix(name, game.week, 0) == "");
        
        if (undefined != games && (games.length * 2) >= baselineGames) {
            games = games.map(week => arrayBuilder(1,MAX_GAMES_PER_WEEK).map(game => week[`Score${game}`])).flat();
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
            return (b.games.reduce((acc, i) => acc + i.SeriesTotal, 0)) - (a.games.reduce((acc, i) => acc + i.SeriesTotal, 0))
        });

        scores.highScratchSeries = {
            score: teamGames[0].games.reduce((acc, i) => acc + i.SeriesTotal, 0),
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
