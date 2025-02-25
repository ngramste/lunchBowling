let gameData = null;
let teamData = null;

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
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "-2-";
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
        td.innerHTML = bowler.BowlerName;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = bowler.AverageBeforeBowling;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = bowler.HandicapBeforeBowling;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = bowler.Score1;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = bowler.Score2;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = (bowler.Score1 + bowler.Score2);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = (bowler.Score1 + bowler.Score2 + (bowler.HandicapBeforeBowling * 2));
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
    td.innerHTML = bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = 2 * (bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling);
    tr.appendChild(td);
    
    table.appendChild(tr);
    
    let teamScore = {
        game1: bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling,
        game2: bowlers[0].Score2 + bowlers[1].Score2 + bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling,
        series: bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2 + (2 * (bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling))
    };
    
    let opponentsScore = {
        game1: opponents[0].Score1 + opponents[1].Score1 + opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling,
        game2: opponents[0].Score2 + opponents[1].Score2 + opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling,
        series: opponents[0].Score1 + opponents[1].Score1 + opponents[0].Score2 + opponents[1].Score2 + (2 * (opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling))
    };
    
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
        
        let teamScore = {
            game1: bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling,
            game2: bowlers[0].Score2 + bowlers[1].Score2 + bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling,
            series: bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2 + (2 * (bowlers[0].HandicapBeforeBowling + bowlers[1].HandicapBeforeBowling))
        };
        
        let opponentsScore = {
            game1: opponents[0].Score1 + opponents[1].Score1 + opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling,
            game2: opponents[0].Score2 + opponents[1].Score2 + opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling,
            series: opponents[0].Score1 + opponents[1].Score1 + opponents[0].Score2 + opponents[1].Score2 + (2 * (opponents[0].HandicapBeforeBowling + opponents[1].HandicapBeforeBowling))
        };
    
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
        runningTotal.handicapPins += teamScore.series;
        runningTotal.scratchPins += (bowlers[0].Score1 + bowlers[1].Score1 + bowlers[0].Score2 + bowlers[1].Score2);
    });
    
    let table = document.createElement("table");
    
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.style = "text-align: left;";
    th.innerHTML = "Date:";
    tr.appendChild(th);
    let td = document.createElement("td");
    td.innerHTML = gameData.schedule.getWeek(weekNum).date;
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
        // let tr = document.createElement("th");
        // tr.innerHTML = `${week.weekNum} ${week.date}`;
        // dataDom.appendChild(tr);
        dataDom.appendChild(BuildRecap(team, week.weekNum));
    });
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
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
            
            // Auto select the first option
            TeamSelected({target: {value: teamData.getTeamList()[0]}});
        })
    });
}