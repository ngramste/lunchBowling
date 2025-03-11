let teamData = null;
let gameData = null;
let playerData = null;
let scheduleData = null;

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
        
        if (bowler.lowGameOpponent == "The Munsons" || bowler.lowSeriesOpponent == "The Munsons") {
            console.log(bowler);
        }
    });
    
    // Sort the list of teams
    teams.sort(function(a,b) {return b.points - a.points});
    
    // build out the table
    let table = document.createElement("table");
    
    teams.forEach(team => {
        let tr = document.createElement("tr");
        
        let th = document.createElement("th");
        th.innerHTML = team.teamName;
        th.style.textAlign = "right";
        tr.appendChild(th);
        
        let td = document.createElement("td");
        td.innerHTML = team.points;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    return table;
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
            highGameOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getHighGames(player).highScratchGame.week, gameData.recaps.summaries[gameData.getHighGames(player).highScratchGame.week].find(bowler => bowler.BowlerName == player).TeamNum)),
            highSeriesOpponent: teamData.getTeamName(scheduleData.getOpponentNumber(gameData.getHighGames(player).highScratchSeries.week, gameData.recaps.summaries[gameData.getHighGames(player).highScratchSeries.week].find(bowler => bowler.BowlerName == player).TeamNum))
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
    
    // build out the table
    let table = document.createElement("table");
    
    teams.forEach(team => {
        let tr = document.createElement("tr");
        
        let th = document.createElement("th");
        th.innerHTML = team.teamName;
        th.style.textAlign = "right";
        tr.appendChild(th);
        
        let td = document.createElement("td");
        td.innerHTML = team.points;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    return table;
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    new schedule().then(result => {
        scheduleData = result;
        new players().then(result => {
            playerData = result;
            new bowlerGames().then(result => {
                gameData = result;
                new teamInfo().then(result => {
                    teamData = result;
                    
                    let friendshipTable = calculateFriendship();
                    let meaineTable = calculateMeanies();
                    let dataTable = document.getElementById("data");
                    
                    let tr = document.createElement("tr");
                    let th = document.createElement("th");
                    
                    th.innerHTML = "Friendship Points";
                    tr.appendChild(th);
                    
                    th = document.createElement("th");
                    
                    th.innerHTML = "Meanie Points";
                    tr.appendChild(th);
                    
                    dataTable.appendChild(tr);
                    tr = document.createElement("tr");
                    
                    let td = document.createElement("td");
                    td.appendChild(friendshipTable);
                    tr.appendChild(td);
                    
                    td = document.createElement("td");
                    td.appendChild(meaineTable);
                    tr.appendChild(td);
                    
                    dataTable.appendChild(tr);
                });
            });
        });
    });
}