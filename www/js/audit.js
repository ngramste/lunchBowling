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
    
    for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
        th = document.createElement("th");
        th.innerHTML = `-${gameNum}-`;
        th.style = "width: calc(2.5 * 12pt); text-align: left;"
        tr.appendChild(th);
    }
    
    th = document.createElement("th");
    th.innerHTML = "Total";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "HDCP<br>Total";
    tr.appendChild(th);
    tr.style = "border-bottom: 1px solid light-dark(black, #888);"
    
    table.appendChild(tr);
    
    // Create result for each bowler
    bowlers.forEach(bowler => {
        tr = document.createElement("tr");
        
        let td = document.createElement("td");
        let a = document.createElement("a");
        a.innerHTML = gameData.players.prettyName(bowler.BowlerName);
        a.href = `./bowler.html?name=${bowler.BowlerName}`;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getGame(bowler.BowlerName, weekNum).AverageBeforeBowling;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getGame(bowler.BowlerName, weekNum).HandicapBeforeBowling;
        tr.appendChild(td);
        
        let highGames = gameData.getHighGames(bowler.BowlerName, 2);
        let lowGames = gameData.getLowGames(bowler.BowlerName, 2);

        for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
            td = document.createElement("td");
            let score = bowler[`Score${gameNum}`];
            td.innerHTML = `${gameData.getGamePrefix(bowler.BowlerName, weekNum, gameNum)}${score}`;
            if (undefined != highGames && highGames.highScratchGame.game.week == weekNum && score == highGames.highScratchGame.score) {
                td.style = "background-color: green; color: white";
            } else if (undefined != lowGames && lowGames.lowScratchGame.game.week == weekNum && score == lowGames.lowScratchGame.score) {
                td.style = "background-color: red; color: white";
            }
            tr.appendChild(td);
        }
        
        td = document.createElement("td");
        td.innerHTML = gameData.getScratchSeries(bowler.BowlerName, weekNum);
        if (undefined != highGames && highGames.highScratchSeries.game.week == weekNum) {
            td.style = "background-color: green; color: white";
        } else if (undefined != lowGames && lowGames.lowScratchSeries.game.week == weekNum) {
            td.style = "background-color: red; color: white";
        }
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

    for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
        td = document.createElement("td");
        td.innerHTML = gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum)[`Score${gameNum}`];
        tr.appendChild(td);
    }
    
    td = document.createElement("td");
    td.innerHTML = gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum).SeriesTotal;
    tr.appendChild(td);
    
    td = document.createElement("td");
    // td.innerHTML = gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum).HandicapSeriesTotal;
    td.innerHTML = "";
    tr.appendChild(td);
    tr.style = "border-top: 1px solid light-dark(black, #888);"
    
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
    
    for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
        td = document.createElement("td");
        td.innerHTML = gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum).HandicapBeforeBowling;
        tr.appendChild(td);
    }
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = gameData.gamesPerWeek(weekNum) * gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum).HandicapBeforeBowling;
    tr.appendChild(td);
    
    table.appendChild(tr);
    
    let teamScore;
    
    if (bowlers.map(bowler => gameData.getGamePrefix(bowler.BowlerName, weekNum, 1)).length 
        == bowlers.map(bowler => gameData.getGamePrefix(bowler.BowlerName, weekNum, 1)).filter(prefix => "a" == prefix).length) {
        teamScore = {
            HandicapBeforeBowling: 0,
            HandicapSeriesTotal: 0,
            Score1: 0,
            Score2: 0,
            Score3: 0,
            Score4: 0,
            Score5: 0,
            Score6: 0,
            SeriesTotal: 0
        };
    } else {
        teamScore = gameData.getTeamGame(weekNum, teamData.getTeamByName(teamName).TeamNum);
    }
    
    let teamPoints = gameData.getTeamPoints(weekNum, teamData.getTeamByName(teamName).TeamNum);
    
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
    
    for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
        td = document.createElement("td");
        td.innerHTML = teamScore[`Score${gameNum}`] +  + teamScore.HandicapBeforeBowling;
        tr.appendChild(td);
    }
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamScore.HandicapSeriesTotal;
    tr.appendChild(td);
    tr.style = "border-bottom: 1px solid light-dark(black, #888);"
    
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
    
    for (let gameNum = 1; gameNum <= gameData.gamesPerWeek(); gameNum++) {
        td = document.createElement("td");
        td.innerHTML = teamPoints[`Score${gameNum}`];
        tr.appendChild(td);
    }
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.series;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = teamPoints.won;
    tr.appendChild(td);
    
    table.appendChild(tr);
    table.style = "border: 1px solid light-dark(black, #888); border-collapse: collapse;";
    
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

        let teamScore;
        
        if (bowlers.map(bowler => gameData.getGamePrefix(bowler.BowlerName, week.weekNum, 1)).length 
            == bowlers.map(bowler => gameData.getGamePrefix(bowler.BowlerName, week.weekNum, 1)).filter(prefix => "a" == prefix).length) {
            teamScore = {
                HandicapBeforeBowling: 0,
                HandicapSeriesTotal: 0,
                Score1: 0,
                Score2: 0,
                Score3: 0,
                Score4: 0,
                Score5: 0,
                Score6: 0,
                SeriesTotal: 0
            };
        } else {
            teamScore = gameData.getTeamGame(week.weekNum, teamData.getTeamByName(teamName).TeamNum);
        }
        
        let teamPoints = gameData.getTeamPoints(week.weekNum, teamData.getTeamByName(teamName).TeamNum);
        
        runningTotal.pointsWon += teamPoints.won;
        runningTotal.pointsLost += teamPoints.lost;
        runningTotal.scratchPins += teamScore.SeriesTotal;
        runningTotal.handicapPins += teamScore.HandicapSeriesTotal;
    });
    
    let table = document.createElement("table");
    
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Week:";
    tr.appendChild(th);
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.innerHTML = weekNum;
    a.href = `./${DATA_FOLDER}pdfs/week${weekNum}.pdf`;
    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Date:";
    tr.appendChild(th);
    td = document.createElement("td");
    a = document.createElement("a");
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