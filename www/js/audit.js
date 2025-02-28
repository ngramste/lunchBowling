let gameData = null;
let teamData = null;
let weeklyStandings = null;

function BuildTeamRecap(teamName, weekNum) {
    let schedule = gameData.schedule;
    let bowlers = gameData.recaps.getTeam(weekNum, teamData.getTeamByName(teamName).TeamNum);
    let opponents = gameData.recaps.getTeam(weekNum, schedule.getOpponentNumber(weekNum, teamData.getTeamByName(teamName).TeamNum));
    
    let table = document.createElement("table");
    
    let tr = document.createElement("tr");
    
    // Create the headers
    let th = document.createElement("th");
    th.innerHTML = teamName;
    th.style = "width: calc(14 * 12pt); text-align: left;"
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Old<br>Ave";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Old<br>HDCP";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "-1-";
    th.style = "width: calc(2.5 * 12pt); text-align: left;"
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "-2-";
    th.style = "width: calc(2.5 * 12pt); text-align: left;"
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Total";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "HDCP<br>Total";
    tr.appendChild(th);
    tr.style = "border-bottom: 1px solid black;"
    
    table.appendChild(tr);
    
    // Create result for each bowler
    bowlers.forEach(bowler => {
        tr = document.createElement("tr");
        
        let td = document.createElement("td");
        let a = document.createElement("a");
        a.innerHTML = nameFlipper(bowler.BowlerName);
        a.href = `./bowler.html?name=${bowler.BowlerName}`;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getGame(bowler.BowlerName, weekNum).averageBefore;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getGame(bowler.BowlerName, weekNum).handicapBefore;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = `${gameData.establishingFlag(bowler.BowlerName, weekNum)}${gameData.getGamePrefix(bowler.BowlerName, weekNum, 1)}${bowler.Score1}`;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = `${gameData.establishingFlag(bowler.BowlerName, weekNum)}${gameData.getGamePrefix(bowler.BowlerName, weekNum, 2)}${bowler.Score2}`;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getScratchSeries(bowler.BowlerName, weekNum);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getHandicapSeries(bowler.BowlerName, weekNum);
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    // Team totals
    tr = document.createElement("tr");
    
    let td = document.createElement("td");
    td.innerHTML = "Scratch Total";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = bowlers[0].Score1 + bowlers[1].Score1;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = bowlers[0].Score2 + bowlers[1].Score2;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2;
    tr.appendChild(td);
    tr.style = "border-top: 1px solid black;"
    
    table.appendChild(tr);
    
    // Team handicap
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Handicap";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = gameData.getGame(bowlers[0].BowlerName, weekNum, 1).handicapBefore + gameData.getGame(bowlers[1].BowlerName, weekNum, 1).handicapBefore;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = gameData.getGame(bowlers[0].BowlerName, weekNum, 1).handicapBefore + gameData.getGame(bowlers[1].BowlerName, weekNum, 1).handicapBefore;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = 2 * (gameData.getGame(bowlers[0].BowlerName, weekNum, 1).handicapBefore + gameData.getGame(bowlers[1].BowlerName, weekNum, 1).handicapBefore);
    tr.appendChild(td);
    
    table.appendChild(tr);
    
    let teamScore;
    let opponentsScore;
    
    if ("a" == gameData.getGamePrefix(bowlers[0].BowlerName, weekNum, 1) && "a" == gameData.getGamePrefix(bowlers[1].BowlerName, weekNum, 1)) {
        teamScore = {
            game1: 0,
            game2: 0,
            series: 0
        };
    } else {
        teamScore = {
            game1: gameData.getHandicapGame(bowlers[0].BowlerName, weekNum, 1) + gameData.getHandicapGame(bowlers[1].BowlerName, weekNum, 1),
            game2: gameData.getHandicapGame(bowlers[0].BowlerName, weekNum, 2) + gameData.getHandicapGame(bowlers[1].BowlerName, weekNum, 2),
            series: gameData.getHandicapSeries(bowlers[0].BowlerName, weekNum) + gameData.getHandicapSeries(bowlers[1].BowlerName, weekNum)
        };
    }
    
    if ("a" == gameData.getGamePrefix(opponents[0].BowlerName, weekNum, 1) && "a" == gameData.getGamePrefix(opponents[1].BowlerName, weekNum, 1)) {
        opponentsScore = {
            game1: 0,
            game2: 0,
            series: 0
        };
    } else {
        opponentsScore = {
            game1: gameData.getHandicapGame(opponents[0].BowlerName, weekNum, 1) + gameData.getHandicapGame(opponents[1].BowlerName, weekNum, 1),
            game2: gameData.getHandicapGame(opponents[0].BowlerName, weekNum, 2) + gameData.getHandicapGame(opponents[1].BowlerName, weekNum, 2),
            series: gameData.getHandicapSeries(opponents[0].BowlerName, weekNum) + gameData.getHandicapSeries(opponents[1].BowlerName, weekNum)
        };
    }
    
    let teamPoints = {};
    teamPoints.game1 = (teamScore.game1 > opponentsScore.game1) ? 1:0;
    teamPoints.game1 += (teamScore.game1 == opponentsScore.game1) ? 0.5:0;
    
    teamPoints.game2 = (teamScore.game2 > opponentsScore.game2) ? 1:0;
    teamPoints.game2 += (teamScore.game2 == opponentsScore.game2) ? 0.5:0;
    
    teamPoints.series = (teamScore.series > opponentsScore.series) ? 1:0;
    teamPoints.series += (teamScore.series == opponentsScore.series) ? 0.5:0;
    
    teamPoints.total = teamPoints.game1 + teamPoints.game2 + teamPoints.series;
    
    // Team handicap total
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Total";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamScore.game1;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamScore.game2;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamScore.series;
    tr.appendChild(td);
    tr.style = "border-bottom: 1px solid black;"
    
    table.appendChild(tr);
    
    // Team points
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Team Points Won";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.game1;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.game2;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.series;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.total;
    tr.appendChild(td);
    
    table.appendChild(tr);
    table.style = "border: 1px solid black; border-collapse: collapse;";
    
    return table;
}

function RunningTotals(teamName, weekNum) {
    let fullSchedule = gameData.schedule.schedule;
    let subSchedule = [];
    
    // Get all weeks before specified week
    fullSchedule.forEach(week => {
        if (gameData.schedule.getTimestamp(week.weekNum) <= gameData.schedule.getTimestamp(weekNum)) {
            subSchedule.push(week); 
        }
    });
    
    let runningTotal = {
        pointsWon: 0,
        pointsLost: 0,
        handicapPins: 0,
        scratchPins: 0
    }
    
    subSchedule.forEach(week => {
        let bowlers = gameData.recaps.getTeam(week.weekNum, teamData.getTeamByName(teamName).TeamNum);
        let opponents = gameData.recaps.getTeam(week.weekNum, gameData.schedule.getOpponentNumber(week.weekNum, teamData.getTeamByName(teamName).TeamNum));
    
        if ("a" == gameData.getGamePrefix(bowlers[0].BowlerName, week.weekNum, 1) && "a" == gameData.getGamePrefix(bowlers[1].BowlerName, week.weekNum, 1)) {
            teamScore = {
                game1: 0,
                game2: 0,
                series: 0
            };
        } else {
            teamScore = {
                game1: gameData.getHandicapGame(bowlers[0].BowlerName, week.weekNum, 1) + gameData.getHandicapGame(bowlers[1].BowlerName, week.weekNum, 1),
                game2: gameData.getHandicapGame(bowlers[0].BowlerName, week.weekNum, 2) + gameData.getHandicapGame(bowlers[1].BowlerName, week.weekNum, 2),
                series: gameData.getHandicapSeries(bowlers[0].BowlerName, week.weekNum) + gameData.getHandicapSeries(bowlers[1].BowlerName, week.weekNum)
            };
        }
        
        if ("a" == gameData.getGamePrefix(opponents[0].BowlerName, week.weekNum, 1) && "a" == gameData.getGamePrefix(opponents[1].BowlerName, week.weekNum, 1)) {
            opponentsScore = {
                game1: 0,
                game2: 0,
                series: 0
            };
        } else {
            opponentsScore = {
                game1: gameData.getHandicapGame(opponents[0].BowlerName, week.weekNum, 1) + gameData.getHandicapGame(opponents[1].BowlerName, week.weekNum, 1),
                game2: gameData.getHandicapGame(opponents[0].BowlerName, week.weekNum, 2) + gameData.getHandicapGame(opponents[1].BowlerName, week.weekNum, 2),
                series: gameData.getHandicapSeries(opponents[0].BowlerName, week.weekNum) + gameData.getHandicapSeries(opponents[1].BowlerName, week.weekNum)
            };
        }
    
        let teamPoints = {};
        teamPoints.game1 = (teamScore.game1 > opponentsScore.game1) ? 1:0;
        teamPoints.game1 += (teamScore.game1 == opponentsScore.game1) ? 0.5:0;
        
        teamPoints.game2 = (teamScore.game2 > opponentsScore.game2) ? 1:0;
        teamPoints.game2 += (teamScore.game2 == opponentsScore.game2) ? 0.5:0;
        
        teamPoints.series = (teamScore.series > opponentsScore.series) ? 1:0;
        teamPoints.series += (teamScore.series == opponentsScore.series) ? 0.5:0;
        
        teamPoints.total = teamPoints.game1 + teamPoints.game2 + teamPoints.series;
        
        runningTotal.pointsWon += teamPoints.total;
        runningTotal.pointsLost += (3 - teamPoints.total);
        
        
        if ("a" != gameData.getGamePrefix(bowlers[0].BowlerName, week.weekNum, 1) || "a" != gameData.getGamePrefix(bowlers[1].BowlerName, week.weekNum, 1)) {
            runningTotal.handicapPins += teamScore.series;
            runningTotal.scratchPins += (bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2);
        }
    });
    
    let table = document.createElement("table");
    
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Week:";
    tr.appendChild(th);
    let td = document.createElement("td");
    td.innerHTML = weekNum;
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Date:";
    tr.appendChild(th);
    td = document.createElement("td");
    let a = document.createElement("a");
    a.innerHTML = gameData.schedule.getWeek(weekNum).date;
    a.href = `./index.html?weekNum=${weekNum}`;
    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Place:";
    tr.appendChild(th);
    td = document.createElement("td");
    td.innerHTML = weeklyStandings.getTeamPlace(teamName, weekNum);
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Points Won:";
    tr.appendChild(th);
    td = document.createElement("td");
    td.innerHTML = runningTotal.pointsWon;
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Points Lost:";
    tr.appendChild(th);
    td = document.createElement("td");
    td.innerHTML = runningTotal.pointsLost;
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Handicap Pins:";
    tr.appendChild(th);
    td = document.createElement("td");
    td.innerHTML = runningTotal.handicapPins;
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Scratch Pins:";
    tr.appendChild(th);
    td = document.createElement("td");
    td.innerHTML = runningTotal.scratchPins;
    tr.appendChild(td);
    table.appendChild(tr);
    
    return table;
}

function BuildRecap(teamName, weekNum) {
    let schedule = gameData.schedule;
    let team = teamData.getTeamByName(teamName);
    let opponent = teamData.getTeam(schedule.getOpponentNumber(weekNum, team.TeamNum));
    
    let tr = document.createElement("tr");
    
    let totals = document.createElement("td");
    let team1 = document.createElement("td");
    let team2 = document.createElement("td");
    
    totals.appendChild(RunningTotals(teamName, weekNum));
    team1.appendChild(BuildTeamRecap(teamName, weekNum));
    team2.appendChild(BuildTeamRecap(opponent.TeamName, weekNum));
    
    tr.appendChild(totals);
    tr.appendChild(team1);
    tr.appendChild(team2);
    
    return tr;
}

function TeamSelected(event) {
    let team = event.target.value;
    let dataDom = document.getElementById("data");
    dataDom.innerHTML = "";
    
    let fullSchedule = gameData.schedule.schedule;
    let schedule = [];
    let recaps = gameData.recaps;
    
    fullSchedule.forEach(week => {
        if (recaps.getWeekNums().includes(week.weekNum)) {
            schedule.push(week); 
        }
    });
    
    schedule.forEach(week => {
        dataDom.appendChild(BuildRecap(team, week.weekNum));
    });
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    new standings().then(result => {
        weeklyStandings = result;
        new bowlerGames().then(result => {
            gameData = result;
            new teamInfo().then(result => {
                teamData = result;
                let teamSelect = document.getElementById("teams");
                
                teamData.getTeamList().forEach(team => {
                    let option = document.createElement("option");
                    option.value = team;
                    option.innerHTML = team;
                    teamSelect.appendChild(option);
                });
                
                teamSelect.addEventListener("change", TeamSelected);
                
                let params = new URLSearchParams(window.location.search);
                let teamName = params.get("teamName");
                
                if (teamName) {
                    teamSelect.value = teamName;
                    TeamSelected({target: {value: teamName}});
                } else {
                    // Auto select the first option
                    TeamSelected({target: {value: teamData.getTeamList()[0]}});
                }
            })
        });
    });
}