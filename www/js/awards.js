let teamData = null;
let weeklyStandings = null;
let leagueRecaps = null;
let playerData = null;
let gameData = null;
let scheduleData = null;

function getValidTeamMembers(teamNum, weeksRequired = 6) {
    let names = leagueRecaps.getWeekNums().map(week => leagueRecaps.getTeamMemberNames(week, teamNum)).flat();
    let counts = {};
    names.forEach(name => counts[name] = (counts[name] || 0) + 1);
    Object.keys(counts).forEach(name => {
        if (counts[name] < weeksRequired) {
            delete counts[name];
        }
    });
    return Object.keys(counts);
}

function getIndividualAwards() {
    let awards = {
        men: {
            highSS: null,
            highSG: null,
            highHS: null,
            highHG: null
        },
        women: {
            highSS: null,
            highSG: null,
            highHS: null,
            highHG: null
        }
    };

    let men = playerData.getPlayerNamesByGender("M").map(name => {
        return {
            name: name, 
            games: gameData.getHighGames(name, 6)
        }
    });
    men = men.filter(man => undefined != man.games);

    men.sort(
        function(a,b) {
            return b.games.highScratchSeries.score - a.games.highScratchSeries.score
        }
    );

    awards.men.highSS = {
        name: men[0].name, 
        score: men[0].games.highScratchSeries.score,
        game: men[0].games.highScratchSeries.game
    };

    men.sort(
        function(a,b) {
            return b.games.highScratchGame.score - a.games.highScratchGame.score
        }
    );

    let index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(man => man.name).includes(men[index].name));
    awards.men.highSG = {
        name: men[index].name, 
        score: men[index].games.highScratchGame.score,
        game: men[index].games.highScratchGame.game
    };

    men.sort(
        function(a,b) {
            return b.games.highHandicapSeries.score - a.games.highHandicapSeries.score
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(man => man.name).includes(men[index].name));
    awards.men.highHS = {
        name: men[index].name, 
        score: men[index].games.highHandicapSeries.score,
        game: men[index].games.highHandicapSeries.game
    };

    men.sort(
        function(a,b) {
            return b.games.highHandicapGame.score - a.games.highHandicapGame.score
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(man => man.name).includes(men[index].name));
    awards.men.highHG = {
        name: men[index].name, 
        score: men[index].games.highHandicapGame.score,
        game: men[index].games.highHandicapGame.game
    };

    let women = playerData.getPlayerNamesByGender("W").map(name => {
        return {
            name: name, 
            games: gameData.getHighGames(name, 6)
        }
    });
    women = women.filter(woman => undefined != woman.games);

    women.sort(
        function(a,b) {
            return b.games.highScratchSeries.score - a.games.highScratchSeries.score
        }
    );

    awards.women.highSS = {
        name: women[0].name, 
        score: women[0].games.highScratchSeries.score,
        game: women[0].games.highScratchSeries.game
    };

    women.sort(
        function(a,b) {
            return b.games.highScratchGame.score - a.games.highScratchGame.score
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(woman => woman.name).includes(women[index].name));
    awards.women.highSG = {
        name: women[index].name, 
        score: women[index].games.highScratchGame.score,
        game: women[index].games.highScratchGame.game
    };

    women.sort(
        function(a,b) {
            return b.games.highHandicapSeries.score - a.games.highHandicapSeries.score
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(woman => woman.name).includes(women[index].name));
    awards.women.highHS = {
        name: women[index].name, 
        score: women[index].games.highHandicapSeries.score,
        game: women[index].games.highHandicapSeries.game
    };

    women.sort(
        function(a,b) {
            return b.games.highHandicapGame.score - a.games.highHandicapGame.score
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(woman => woman.name).includes(women[index].name));
    awards.women.highHG = {
        name: women[index].name, 
        score: women[index].games.highHandicapGame.score,
        game: women[index].games.highHandicapGame.game
    };

    return awards;
}

function largestDropInAve(minWeeks = 6) {
    return playerData.getPlayerNames().map(player => {
        let retval = {
            player: player,
            gender: gameData.getGender(player),
            drop: 0
        };
        let games = gameData.getGames(player);
        if ((games != undefined) && (games.length >= minWeeks)) {
            retval.drop = Math.min(... games.map(game => game.averageAfterFloating - game.averageBeforeFloating).filter(num => !isNaN(num)));
        }

        return retval;
    }).sort(function(a,b) {return a.drop - b.drop});
}

function calculateMeanies() {
    // Build the team list
    let teams = teamData.getTeamList().map(team => {
        return {
            teamName: team, 
            points: 0
        };
    });
    
    // Get all the low game data
    let bowlers = playerData.getPlayerNames().filter(bowler => gameData.getLowGames(bowler, 2) != undefined).map(player => {
        return {
            bowlerName: player,
            lowGameOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getLowGames(player).lowScratchGame.week, gameData.recaps.summaries[gameData.getLowGames(player).lowScratchGame.week].find(bowler => bowler.BowlerName == player).TeamNum)),
            lowSeriesOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getLowGames(player).lowScratchSeries.week, gameData.recaps.summaries[gameData.getLowGames(player).lowScratchSeries.week].find(bowler => bowler.BowlerName == player).TeamNum))
        };
    });
    
    // Tally up the points
    bowlers.forEach(bowler => {
        let team = teams.find(team => team.teamName == bowler.lowGameOpponent);
        team.points += 1;
        team = teams.find(team => team.teamName == bowler.lowSeriesOpponent);
        team.points += 1;
    });
    
    // Sort the list of teams
    teams.sort(function(a,b) {return b.points - a.points});
    
    return teams;
}

function calculateFriendship() {
    // Build the team list
    let teams = teamData.getTeamList().map(team => {
        return {
            teamName: team, 
            points: 0
        };
    });
    
    // Get all the high game data
    let bowlers = playerData.getPlayerNames().filter(bowler => gameData.getHighGames(bowler, 2) != undefined).map(player => {
        return {
            bowlerName: player,
            highGameOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getHighGames(player).highScratchGame.game.week, gameData.recaps.summaries[gameData.getHighGames(player).highScratchGame.game.week].find(bowler => bowler.BowlerName == player).TeamNum)),
            highSeriesOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getHighGames(player).highScratchSeries.game.week, gameData.recaps.summaries[gameData.getHighGames(player).highScratchSeries.game.week].find(bowler => bowler.BowlerName == player).TeamNum))
        };
    });
    
    // Tally up the points
    bowlers.forEach(bowler => {
        let team = teams.find(team => team.teamName == bowler.highGameOpponent);
        team.points += 1;
        team = teams.find(team => team.teamName == bowler.highSeriesOpponent);
        team.points += 1;
    });
    
    // Sort the list of teams
    teams.sort(function(a,b) {return b.points - a.points});
    
    return teams;
}

function countCenturies(minWeeks = 6) {
    return playerData.getPlayerNames().map(player => {
        let games = gameData.getGames(player);
        if (undefined == games || games.length < minWeeks) return undefined;
        games = games.filter(game => Math.abs(game.Score1 - game.Score2) >= 100);
        if (games.length == 0) return undefined;

        return {
            name: player,
            count: games.length
        }

    }).filter(result => undefined != result);
}

function buildRow(link, prize, teamName, people, score, award, plaqueText) {
    tr = document.createElement("tr");

    td = document.createElement("td");
    if (link != "") {
        let a = document.createElement("a");
        a.innerHTML = prize;
        a.href = link;
        td.appendChild(a);
    } else {
        td.innerHTML = prize;
    }
    tr.appendChild(td);

    td = document.createElement("td");
    if (teamName != "") {
        let a = document.createElement("a");
        a.innerHTML = teamName;
        a.href = `./team.html?teamName=${teamName}`;
        td.appendChild(a);
    }
    tr.appendChild(td);

    td = document.createElement("td");
    people.forEach((person, index) => {
        let a = document.createElement("a");
        let br = document.createElement("br");
        a.innerHTML = `${playerData.prettyName(person)}`;
        a.href = `./bowler.html?name=${person}`;
        td.appendChild(a);
        if (people.length - 1 != index) td.innerHTML += ",";
        td.appendChild(br);
        tr.appendChild(td);
    });

    td = document.createElement("td");
    td.innerHTML = score;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = award;
    tr.appendChild(td);

    td = document.createElement("td");
    td.setAttribute("style", "text-align: center");
    td.innerHTML = plaqueText;
    tr.appendChild(td);
    
    return tr;
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    Promise.all([
        new standings().then(result => weeklyStandings = result),
        new teamInfo().then(result => teamData = result),
        new recaps().then(result => leagueRecaps = result),
        new players().then(result => playerData = result),
        new bowlerGames().then(result => gameData = result),
        new schedule().then(result => scheduleData = result)
    ]).then(() => {
        let table = document.getElementById("data");
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.innerHTML = "Prize";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Team";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Person/People";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Score";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Award";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Text on Plaque";
        tr.appendChild(th);

        table.appendChild(tr);

        let prize = "Noon League 1st Place";
        let teamName = weeklyStandings.getLatestWeek()[0].teamName;
        let people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        let score = weeklyStandings.getLatestWeek()[0].pointsWon;
        let award = `${people.length} plaques - (size - 7x9)`;
        let plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}`;
        let link = "./";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League 2nd Place";
        teamName = weeklyStandings.getLatestWeek()[1].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[1].pointsWon;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}`;
        link = "./";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League 3rd Place";
        teamName = weeklyStandings.getLatestWeek()[2].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[2].pointsWon;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}`;
        link = "./";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Last Place";
        teamName = weeklyStandings.getLatestWeek()[weeklyStandings.getLatestWeek().length - 1].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[weeklyStandings.getLatestWeek().length - 1].pointsWon;
        award = `${people.length} Goofy bowler trophies`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}`;
        link = "./";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));
        
        let individual = getIndividualAwards();

        let perfects = playerData.getPlayerNames()
            // Get everyone's high scores
            .map(name => {
                return {
                    name: name, 
                    games: gameData.getHighGames(name, 6)
                }
            })
            // Filter out unqualified bowler
            .filter(bowler => bowler.games != undefined)
            // Filter out 300 games
            .filter(bowler => bowler.games.highScratchGame.score == 300);
            
        perfects.forEach(bowler => {
            prize = "Noon League 300 Game";
            teamName = leagueRecaps.getBowler(bowler.games.highScratchGame.game.week, bowler.name).TeamName;
            people = [bowler.name];
            score = 300;
            award = `1 plaque - (size - 5x7)`;
            plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(bowler.name))}: ${score}`;
            link = "";
            table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));
        });

        prize = "Noon League Men's High Scratch Series";
        teamName = leagueRecaps.getBowler(individual.men.highSS.game.week, individual.men.highSS.name).TeamName;
        people = [individual.men.highSS.name];
        score = individual.men.highSS.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Scratch Game";
        teamName = leagueRecaps.getBowler(individual.men.highSG.game.week, individual.men.highSG.name).TeamName;
        people = [individual.men.highSG.name];
        score = individual.men.highSG.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Handicap Series";
        teamName = leagueRecaps.getBowler(individual.men.highHS.game.week, individual.men.highHS.name).TeamName;
        people = [individual.men.highHS.name];
        score = individual.men.highHS.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Handicap Game";
        teamName = leagueRecaps.getBowler(individual.men.highHG.game.week, individual.men.highHG.name).TeamName;
        people = [individual.men.highHG.name];
        score = individual.men.highHG.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Scratch Series";
        teamName = leagueRecaps.getBowler(individual.women.highSS.game.week, individual.women.highSS.name).TeamName;
        people = [individual.women.highSS.name];
        score = individual.women.highSS.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Scratch Game";
        teamName = leagueRecaps.getBowler(individual.women.highSG.game.week, individual.women.highSG.name).TeamName;
        people = [individual.women.highSG.name];
        score = individual.women.highSG.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Handicap Series";
        teamName = leagueRecaps.getBowler(individual.women.highHS.game.week, individual.women.highHS.name).TeamName;
        people = [individual.women.highHS.name];
        score = individual.women.highHS.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Handicap Game";
        teamName = leagueRecaps.getBowler(individual.women.highHG.game.week, individual.women.highHG.name).TeamName;
        people = [individual.women.highHG.name];
        score = individual.women.highHG.score;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name))}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let teams = teamData.getTeamList().map(team => {
            return {
                teamName: team,
                scores: gameData.getTeamHighGames(teamData.getTeamByName(team).TeamNum)
            }
        });

        let teamList = [];

        // Sort on the high scratch series
        teams.sort(function(a,b) {
            return b.scores.highScratchSeries.score - a.scores.highScratchSeries.score
        });

        teamList.push(teams[0].teamName);

        prize = "Noon League Team High Scratch Series";
        teamName = teams[0].teamName;
        people = leagueRecaps.getTeamMemberNames(teams[0].scores.highScratchSeries.games.weekNum, teamData.getTeamByName(teams[0].teamName).TeamNum);
        score = teams[0].scores.highScratchSeries.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        // Sort on the high scratch game
        teams.sort(function(a,b) {
            return b.scores.highScratchGame.score - a.scores.highScratchGame.score
        });

        index = -1;
        do {
            index++;
        } while (teamList.includes(teams[index].teamName));

        teamList.push(teams[index].teamName);

        prize = "Noon League Team High Scratch Game";
        teamName = teams[index].teamName;
        people = leagueRecaps.getTeamMemberNames(teams[index].scores.highScratchGame.games.weekNum, teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[0].scores.highScratchGame.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        // Sort on the high handicap series
        teams.sort(function(a,b) {
            return b.scores.highHandicapSeries.score - a.scores.highHandicapSeries.score
        });

        index = -1;
        do {
            index++;
        } while (teamList.includes(teams[index].teamName));

        teamList.push(teams[index].teamName);

        prize = "Noon League Team High Handicap Series";
        teamName = teams[index].teamName;
        people = leagueRecaps.getTeamMemberNames(teams[index].scores.highHandicapSeries.games.weekNum, teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[0].scores.highHandicapSeries.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        // Sort on the high handicap game
        teams.sort(function(a,b) {
            return b.scores.highHandicapGame.score - a.scores.highHandicapGame.score
        });

        index = -1;
        do {
            index++;
        } while (teamList.includes(teams[index].teamName));

        prize = "Noon League Team High Handicap Game";
        teamName = teams[index].teamName;
        people = leagueRecaps.getTeamMemberNames(teams[index].scores.highHandicapGame.games.weekNum, teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[index].scores.highHandicapGame.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score}`;
        link = "./seasonHighs.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let improvements = playerData.getPlayerNames()
            // Get the scores 12
            .map(player => [player, gameData.getImprovement(player, 12)])
            // Filter out unqualified bowlers
            .filter(player => player[1] != undefined)
            // Sort the results and get the first result
            .sort(function(a,b) {return b[1] - a[1]})[0];

        prize = "Noon League Most Improved";
        teamName = gameData.getPlayerTeam(improvements[0]);
        people = [improvements[0]];
        score = improvements[1];
        award = "1 plaque – (size 5x7)";
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score} Pins`;
        link = "./mostImproved.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let bowlers = gameData.players.getPlayerNames()
            // filter out people who didn't bowl a game
            .filter(player => undefined != gameData.getGames(player))
            // Get averages in first and last weeks of bowling
            .map(player => {
                return {
                    bowlerName: player, 
                    aveStart: gameData.getGames(player)[0].averageAfter, 
                    aveEnd: gameData.getGames(player)[gameData.getGames(player).length - 1].averageAfter
                }
            })
            // Sort by rise in average
            .sort(function(a,b){return (b.aveEnd-b.aveStart) - (a.aveEnd-a.aveStart)});

        prize = "Noon League Sandbagger";
        teamName = gameData.getPlayerTeam(bowlers[0].bowlerName);
        people = [bowlers[0].bowlerName];
        score = bowlers[0].aveStart - bowlers[0].aveEnd;
        award = "Toilet Paper and butt";
        plaqueText = `${prize}<br>${teamName}<br>${people.map(name => playerData.prettyName(name)).join(", ")}: ${score} Pins`;
        link = "./sandbagger.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let grumpy = largestDropInAve()[0];

        prize = "Largest Drop in Average";
        teamName = gameData.getPlayerTeam(grumpy.player);
        people = [grumpy.player];
        score = grumpy.drop.toFixed(2);
        award = "Gumpy Sack";
        plaqueText = "";
        link = "";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let friends = calculateFriendship();
        friends = friends.filter(friend => friend.points == friends[0].points);

        prize = "Friendship Awards";
        teamName = friends.map(friend => friend.teamName).join(", ");
        people = friends.map(friend => getValidTeamMembers(teamData.getTeamByName(friend.teamName).TeamNum)).flat();
        score = friends[0].points;
        award = `${people.length} Snickers Bars`;
        plaqueText = "";
        link = "./friendship.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let meanies = calculateMeanies();
        meanies = meanies.filter(meanie => meanie.points == meanies[0].points);

        prize = "Meanie Awards";
        teamName = meanies.map(meanie => meanie.teamName).join(", ");
        people = meanies.map(meanie => getValidTeamMembers(teamData.getTeamByName(meanie.teamName).TeamNum)).flat();
        score = meanies[0].points;
        award = `${people.length} Sour Patch Kids`;
        plaqueText = "";
        link = "./friendship.html";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));

        let centuries = countCenturies();

        prize = "Century Awards";
        teamName = "";
        people = centuries.map(player => player.name);
        score = centuries.map(player => player.count).join("<br>");
        award = `${centuries.map(player => player.count).reduce((a, b) => a + b, 0)} Snickers Bars`;
        plaqueText = "";
        link = "";
        table.appendChild(buildRow(link, prize, teamName, people, score, award, plaqueText));
    });
};
