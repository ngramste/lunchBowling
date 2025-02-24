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
}
