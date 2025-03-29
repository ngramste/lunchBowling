let teamData = null;
let weeklyStandings = null;
let leagueRecaps = null;
let playerData = null;
let gameData = null;

function getValidTeamMembers(teamNum, weeksRequired = 6) {
    let names = leagueRecaps.getWeekNums().map(week => leagueRecaps.getTeamMemberNames(week, teamNum)).flat();
    names = names.map(name => playerData.prettyName(name));
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

    let men = playerData.getPlayerNamesByGender("M").map(name => [name, gameData.getHighGames(name, 6)]);
    men = men.filter(man => undefined != man[1]);

    men.sort(
        function(a,b) {
            return (b[1].highScratchSeries.Score1 + b[1].highScratchSeries.Score2) 
                    - (a[1].highScratchSeries.Score1 + a[1].highScratchSeries.Score2)
        }
    );

    awards.men.highSS = [men[0][0], men[0][1].highScratchSeries];

    men.sort(
        function(a,b) {
            return Math.max(b[1].highScratchGame.Score1, b[1].highScratchGame.Score2) 
                    - Math.max(a[1].highScratchGame.Score1, a[1].highScratchGame.Score2)
        }
    );

    let index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(name => name[0]).includes(men[index][0]));
    awards.men.highSG = [men[index][0], men[index][1].highScratchGame];

    men.sort(
        function(a,b) {
            return (b[1].highHandicapSeries.Score1 + b[1].highHandicapSeries.Score2 + (2 * b[1].highHandicapSeries.handicapBefore)) 
                    - (a[1].highHandicapSeries.Score1 + a[1].highHandicapSeries.Score2 + (2 * a[1].highHandicapSeries.handicapBefore))
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(name => name[0]).includes(men[index][0]));
    awards.men.highHS = [men[index][0], men[index][1].highHandicapSeries];

    men.sort(
        function(a,b) {
            return Math.max(b[1].highHandicapGame.Score1 + b[1].highHandicapSeries.handicapBefore, b[1].highHandicapGame.Score2 + b[1].highHandicapSeries.handicapBefore) 
                    - Math.max(a[1].highHandicapGame.Score1 + a[1].highHandicapSeries.handicapBefore, a[1].highHandicapGame.Score2 + a[1].highHandicapSeries.handicapBefore)
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.men).filter(value => null != value).map(name => name[0]).includes(men[index][0]));
    awards.men.highHG = [men[index][0], men[index][1].highHandicapGame];

    let women = playerData.getPlayerNamesByGender("W").map(name => [name, gameData.getHighGames(name, 6)]);
    women = women.filter(woman => undefined != woman[1]);

    women.sort(
        function(a,b) {
            return (b[1].highScratchSeries.Score1 + b[1].highScratchSeries.Score2) 
                    - (a[1].highScratchSeries.Score1 + a[1].highScratchSeries.Score2)
        }
    );

    awards.women.highSS = [women[0][0], women[0][1].highScratchSeries];

    women.sort(
        function(a,b) {
            return Math.max(b[1].highScratchGame.Score1, b[1].highScratchGame.Score2) 
                    - Math.max(a[1].highScratchGame.Score1, a[1].highScratchGame.Score2)
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(name => name[0]).includes(women[index][0]));
    awards.women.highSG = [women[index][0], women[index][1].highScratchGame];

    women.sort(
        function(a,b) {
            return (b[1].highHandicapSeries.Score1 + b[1].highHandicapSeries.Score2 + (2 * b[1].highHandicapSeries.handicapBefore)) 
                    - (a[1].highHandicapSeries.Score1 + a[1].highHandicapSeries.Score2 + (2 * a[1].highHandicapSeries.handicapBefore))
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(name => name[0]).includes(women[index][0]));
    awards.women.highHS = [women[index][0], women[index][1].highHandicapSeries];

    women.sort(
        function(a,b) {
            return Math.max(b[1].highHandicapGame.Score1 + b[1].highHandicapSeries.handicapBefore, b[1].highHandicapGame.Score2 + b[1].highHandicapSeries.handicapBefore) 
                    - Math.max(a[1].highHandicapGame.Score1 + a[1].highHandicapSeries.handicapBefore, a[1].highHandicapGame.Score2 + a[1].highHandicapSeries.handicapBefore)
        }
    );

    index = -1;
    do {
        index++;
    } while (Object.values(awards.women).filter(value => null != value).map(name => name[0]).includes(women[index][0]));
    awards.women.highHG = [women[index][0], women[index][1].highHandicapGame];

    return awards;
}

function buildRow(prize, teamName, people, score, award, plaqueText) {
    tr = document.createElement("tr");

    td = document.createElement("td");
    td.innerHTML = prize;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = teamName;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = people.join(",<br>");
    tr.appendChild(td);

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
        new bowlerGames().then(result => gameData = result)
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
        let plaqueText = `${prize}<br>${teamName}<br>${people.join(", ")}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League 2nd Place";
        teamName = weeklyStandings.getLatestWeek()[1].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[1].pointsWon;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.join(", ")}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League 3rd Place";
        teamName = weeklyStandings.getLatestWeek()[2].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[2].pointsWon;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people.join(", ")}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Last Place";
        teamName = weeklyStandings.getLatestWeek()[weeklyStandings.getLatestWeek().length - 1].teamName;
        people = getValidTeamMembers(teamData.getTeamByName(teamName).TeamNum);
        score = weeklyStandings.getLatestWeek()[weeklyStandings.getLatestWeek().length - 1].pointsWon;
        award = `${people.length} Goofy bowler trophies`;
        plaqueText = `${prize}<br>${teamName}<br>${people.join(", ")}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));
        
        let individual = getIndividualAwards();

        prize = "Noon League Men's High Scratch Series";
        teamName = leagueRecaps.getBowler(individual.men.highSS[1].week, individual.men.highSS[0]).TeamName;
        people = [playerData.prettyName(individual.men.highSS[0])];
        score = individual.men.highSS[1].Score1 + individual.men.highSS[1].Score2;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Scratch Game";
        teamName = leagueRecaps.getBowler(individual.men.highSG[1].week, individual.men.highSG[0]).TeamName;
        people = [playerData.prettyName(individual.men.highSG[0])];
        score = Math.max(individual.men.highSG[1].Score1, individual.men.highSG[1].Score2);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Handicap Series";
        teamName = leagueRecaps.getBowler(individual.men.highHS[1].week, individual.men.highHS[0]).TeamName;
        people = [playerData.prettyName(individual.men.highHS[0])];
        score = individual.men.highHS[1].Score1 + individual.men.highHS[1].Score2 + (2 * individual.men.highHS[1].handicapBefore);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Men's High Handicap Game";
        teamName = leagueRecaps.getBowler(individual.men.highHG[1].week, individual.men.highHG[0]).TeamName;
        people = [playerData.prettyName(individual.men.highHG[0])];
        score = Math.max(individual.men.highHG[1].Score1 + individual.men.highHG[1].handicapBefore, individual.men.highHG[1].Score2 + individual.men.highHG[1].handicapBefore);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Scratch Series";
        teamName = leagueRecaps.getBowler(individual.women.highSS[1].week, individual.women.highSS[0]).TeamName;
        people = [playerData.prettyName(individual.women.highSS[0])];
        score = individual.women.highSS[1].Score1 + individual.women.highSS[1].Score2;
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Scratch Game";
        teamName = leagueRecaps.getBowler(individual.women.highSG[1].week, individual.women.highSG[0]).TeamName;
        people = [playerData.prettyName(individual.women.highSG[0])];
        score = Math.max(individual.women.highSG[1].Score1, individual.women.highSG[1].Score2);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Handicap Series";
        teamName = leagueRecaps.getBowler(individual.women.highHS[1].week, individual.women.highHS[0]).TeamName;
        people = [playerData.prettyName(individual.women.highHS[0])];
        score = individual.women.highHS[1].Score1 + individual.women.highHS[1].Score2 + (2 * individual.women.highHS[1].handicapBefore);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Women's High Handicap Game";
        teamName = leagueRecaps.getBowler(individual.women.highHG[1].week, individual.women.highHG[0]).TeamName;
        people = [playerData.prettyName(individual.women.highHG[0])];
        score = Math.max(individual.women.highHG[1].Score1 + individual.women.highHG[1].handicapBefore, individual.women.highHG[1].Score2 + individual.men.highHG[1].handicapBefore);
        award = `1 plaque - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

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
        people = getValidTeamMembers(teamData.getTeamByName(teams[0].teamName).TeamNum);
        score = teams[0].scores.highScratchSeries.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

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
        people = getValidTeamMembers(teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[0].scores.highScratchGame.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

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
        people = getValidTeamMembers(teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[0].scores.highHandicapSeries.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

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
        people = getValidTeamMembers(teamData.getTeamByName(teams[index].teamName).TeamNum);
        score = teams[0].scores.highHandicapGame.score;
        award = `${people.length} plaques - (size - 5x7)`;
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

        prize = "Noon League Most Improved";
        teamName = "";
        people = [];
        score = "";
        award = "";
        plaqueText = "";
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));

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
            gameData.players.prettyName(bowlers[0].bowlerName)
        prize = "Noon League Sandbagger";
        teamName = gameData.getPlayerTeam(bowlers[0].bowlerName);
        people = [gameData.players.prettyName(bowlers[0].bowlerName)];
        score = `${bowlers[0].aveStart - bowlers[0].aveEnd} Pins`;
        award = "Toilet Paper and butt";
        plaqueText = `${prize}<br>${teamName}<br>${people}: ${score}`;
        table.appendChild(buildRow(prize, teamName, people, score, award, plaqueText));
    });
};