let teamData = null;
let weeklyStandings = null;
let leagueRecaps = null;
let playerData = null;
let gameData = null;
let scheduleData = null;

function buildHighScoresTable (header, data) {
    let table = document.createElement("table");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML  = header;
    th.colSpan = 2;
    tr.appendChild(th);
    table.appendChild(tr);
    
    data.forEach(bowler => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let a = document.createElement("a");
        a.href = `./bowler.html?name=${bowler.name}`;
        a.innerHTML = playerData.prettyName(bowler.name);
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = bowler.score;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    return table;
}

function buildTeamScoresTable (header, data) {
    let table = document.createElement("table");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML  = header;
    th.colSpan = 2;
    tr.appendChild(th);
    table.appendChild(tr);
    
    data.forEach(team => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let a = document.createElement("a");
        a.href = `./team.html?teamName=${team.name}`;
        a.innerHTML = team.name;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = team.score;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    return table;
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
        let dataTable = document.getElementById("data");
        let tr = document.createElement("tr");
        
        let men = playerData.getPlayerNamesByGender("M").map(name => {
            return {
                name: name, 
                games: gameData.getHighGames(name, 6)
            }
        });
        men = men.filter(man => undefined != man.games);
    
        men.sort((a,b) => b.games.highScratchSeries.score - a.games.highScratchSeries.score);
        
        let data = men.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchSeries.score
            }
        });
        
        let td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Men's High Scratch Series", data));
        tr.appendChild(td);
    
        men.sort((a,b) => b.games.highScratchGame.score - a.games.highScratchGame.score);
        
        data = men.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Men's High Scratch Game", data));
        tr.appendChild(td);
    
        men.sort((a,b) => b.games.highHandicapSeries.score - a.games.highHandicapSeries.score);
        
        data = men.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapSeries.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Men's High Handicap Series", data));
        tr.appendChild(td);
    
        men.sort((a,b) => b.games.highHandicapGame.score - a.games.highHandicapGame.score);
        
        data = men.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Men's High Handicap Game", data));
        tr.appendChild(td);
        
        dataTable.appendChild(tr);
        tr = document.createElement("tr");
        
        let women = playerData.getPlayerNamesByGender("W").map(name => {
            return {
                name: name, 
                games: gameData.getHighGames(name, 6)
            }
        });
        women = women.filter(woman => undefined != woman.games);
    
        women.sort((a,b) => b.games.highScratchSeries.score - a.games.highScratchSeries.score);
        
        data = women.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchSeries.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Women's High Scratch Series", data));
        tr.appendChild(td);
    
        women.sort((a,b) => b.games.highScratchGame.score - a.games.highScratchGame.score);
        
        data = women.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Women's High Scratch Game", data));
        tr.appendChild(td);
    
        women.sort((a,b) => b.games.highHandicapSeries.score - a.games.highHandicapSeries.score);
        
        data = women.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapSeries.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Women's High Handicap Series", data));
        tr.appendChild(td);
    
        women.sort((a,b) => b.games.highHandicapGame.score - a.games.highHandicapGame.score);
        
        data = women.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildHighScoresTable("Women's High Handicap Game", data));
        tr.appendChild(td);
        
        dataTable.appendChild(tr);
        tr = document.createElement("tr");
        
        teams = teamData.getTeamList().map(name => {
            return {
                name: name, 
                games: gameData.getTeamHighGames(teamData.getTeamByName(name).TeamNum)
            }
        });
    
        teams.sort((a,b) => b.games.highScratchSeries.score - a.games.highScratchSeries.score);
        
        data = teams.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchSeries.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildTeamScoresTable("Team's High Scratch Series", data));
        tr.appendChild(td);
    
        teams.sort((a,b) => b.games.highScratchGame.score - a.games.highScratchGame.score);
        
        data = teams.map(person => {
            return {
                name: person.name,
                score: person.games.highScratchGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildTeamScoresTable("Team's High Scratch Game", data));
        tr.appendChild(td);
    
        teams.sort((a,b) => b.games.highHandicapSeries.score - a.games.highHandicapSeries.score);
        
        data = teams.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapSeries.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildTeamScoresTable("Team's High Handicap Series", data));
        tr.appendChild(td);
    
        teams.sort((a,b) => b.games.highHandicapGame.score - a.games.highHandicapGame.score);
        
        data = teams.map(person => {
            return {
                name: person.name,
                score: person.games.highHandicapGame.score
            }
        });
        
        td = document.createElement("td");
        td.appendChild(buildTeamScoresTable("Team's High Handicap Game", data));
        tr.appendChild(td);
        
        dataTable.appendChild(tr);

    });
}
