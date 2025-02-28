let teamData = null;
let weeklyStandings = null;

function HighScores(weekNum) {
    let table = document.getElementById("highScores");
    table.innerHTML = "";
    
    // Get everyone's high scores, filtering out people who hadn't bowled at all this season
    let highScores = weeklyStandings.bowlerGames.players.getPlayerNamesByGender("M").map(name => [name, weeklyStandings.bowlerGames.getHighGames(name, 6, weekNum)]);
    highScores = highScores.filter(score => score[1] != undefined);
    
    let tr = document.createElement("tr");
    
    let th = document.createElement("th");
    th.innerHTML = "Men";
    tr.appendChild(th);
    
    let highScratchGame = highScores.map(score => [score[0], Math.max(score[1].highScratchGame.Score1, score[1].highScratchGame.Score2)]);
    highScratchGame = highScratchGame.sort(function(a,b) {return b[1] - a[1]});
    
    let td = document.createElement("td");
    td.innerHTML = "Scratch Game";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchGame[index][1]} ${highScratchGame[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    let highScratchSeries = highScores.map(score => [score[0], score[1].highScratchSeries.Score1 + score[1].highScratchSeries.Score2]);
    highScratchSeries = highScratchSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Scratch Series";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchSeries[index][1]} ${highScratchSeries[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    let highHandicapGame = highScores.map(score => [score[0], Math.max(score[1].highHandicapGame.Score1 + score[1].highHandicapGame.handicapBefore, score[1].highHandicapGame.Score2 + score[1].highHandicapGame.handicapBefore)]);
    highHandicapGame = highHandicapGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Game";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapGame[index][1]} ${highHandicapGame[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    let highHandicapSeries = highScores.map(score => [score[0], score[1].highHandicapSeries.Score1 + score[1].highHandicapSeries.Score2 + 2*score[1].highHandicapSeries.handicapBefore]);
    highHandicapSeries = highHandicapSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Series";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapSeries[index][1]} ${highHandicapSeries[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    tr = document.createElement("tr");
    for(let cols = 0; cols < 5; cols++) {
        td = document.createElement("td");
        td.innerHTML = "-----";
        tr.appendChild(td);
    }
    table.appendChild(tr);
    
    // Get everyone's high scores, filtering out people who hadn't bowled at all this season
    highScores = weeklyStandings.bowlerGames.players.getPlayerNamesByGender("W").map(name => [name, weeklyStandings.bowlerGames.getHighGames(name, 6, weekNum)]);
    highScores = highScores.filter(score => score[1] != undefined);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "Women";
    tr.appendChild(th);
    
    highScratchGame = highScores.map(score => [score[0], Math.max(score[1].highScratchGame.Score1, score[1].highScratchGame.Score2)]);
    highScratchGame = highScratchGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Scratch Game";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchGame[index][1]} ${highScratchGame[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    highScratchSeries = highScores.map(score => [score[0], score[1].highScratchSeries.Score1 + score[1].highScratchSeries.Score2]);
    highScratchSeries = highScratchSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Scratch Series";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchSeries[index][1]} ${highScratchSeries[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    highHandicapGame = highScores.map(score => [score[0], Math.max(score[1].highHandicapGame.Score1 + score[1].highHandicapGame.handicapBefore, score[1].highHandicapGame.Score2 + score[1].highHandicapGame.handicapBefore)]);
    highHandicapGame = highHandicapGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Game";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapGame[index][1]} ${highHandicapGame[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    highHandicapSeries = highScores.map(score => [score[0], score[1].highHandicapSeries.Score1 + score[1].highHandicapSeries.Score2 + 2*score[1].highHandicapSeries.handicapBefore]);
    highHandicapSeries = highHandicapSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Series";
    tr.appendChild(td);
    
    for(let index = 0; index < 3; index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapSeries[index][1]} ${highHandicapSeries[index][0]}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
}

function WeekSelected(event) {
    let week = JSON.parse(event.target.value);
    let table = document.getElementById("data");
    table.innerHTML = "";

    let tr = document.createElement("tr");
    
    let th = document.createElement("th");
    th.innerHTML = "Place";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Team Name";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Points Won";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Points Lost";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Pins+HDCP";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Scratch Pins";
    tr.appendChild(th);
    
    table.appendChild(tr);
    
    weeklyStandings.getWeek(week.weekNum).forEach(team => {
        tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = team.place;
        tr.appendChild(td);
        
        td = document.createElement("td");
        let a = document.createElement("a");
        a.href = `./team.html?teamName=${team.teamName}`;
        a.innerHTML = team.teamName;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = team.pointsWon;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = team.pointsLost;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = team.handicapPins;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = team.scratchPins;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
    
    HighScores(week.weekNum);
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    new standings().then(result => {
        weeklyStandings = result;
        new teamInfo().then(result => {
            teamData = result;
            let weekSelect = document.getElementById("weeks");

            let schedule = weeklyStandings.schedule.schedule.filter(week => weeklyStandings.recaps.getWeekNums().includes(week.weekNum));

            schedule.forEach(week => {
                let option = document.createElement("option");
                option.value = JSON.stringify(week);
                option.innerHTML = `Week ${week.weekNum} - ${week.date}`;
                weekSelect.appendChild(option);
            });

            weekSelect.addEventListener("change", WeekSelected);

            let params = new URLSearchParams(window.location.search);
            let weekNum = params.get("weekNum");
            
            if (null != weekNum) {
                let week = schedule.find(option => option.weekNum == weekNum);
                weekSelect.value = JSON.stringify(week);
                WeekSelected({ target: { value: JSON.stringify(week) } });
            } else {
                // Auto select the last option
                weekSelect.value = JSON.stringify(schedule[schedule.length - 1]);
                WeekSelected({ target: { value: JSON.stringify(schedule[schedule.length - 1]) } });
            }
        })
    });
};