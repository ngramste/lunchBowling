function LastWeekHighScores(weekNum) {
    let table = document.getElementById("lastWeekHighScores");
    table.innerHTML = "";
    
    let tr = document.createElement("tr");
    
    let td = document.createElement("td");
    td.innerHTML = "Scratch Game";
    tr.appendChild(td);

    table.appendChild(tr);
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Scratch Series";
    tr.appendChild(td);

    table.appendChild(tr);
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Game";
    tr.appendChild(td);

    table.appendChild(tr);
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Series";
    tr.appendChild(td);
    
    table.appendChild(tr);
}

function HighScores(weekNum) {
    let table = document.getElementById("highScores");
    table.innerHTML = "";
    
    // Get everyone's high scores, filtering out people who hadn't bowled at all this season
    let highScores = weeklyStandings.bowlerGames.players.getPlayerNamesByGender("M").map(name => [name, weeklyStandings.bowlerGames.getHighGames(name, Math.min(weekNum, 6), weekNum)]);
    highScores = highScores.filter(score => score[1] != undefined && score[1].highScratchGame != undefined);
    
    let tr = document.createElement("tr");
    
    let th = document.createElement("th");
    th.innerHTML = "Men";
    tr.appendChild(th);
    
    let highScratchGame = highScores.map(score => [score[0], Math.max(score[1].highScratchGame.Score1, score[1].highScratchGame.Score2)]);
    highScratchGame = highScratchGame.sort(function(a,b) {return b[1] - a[1]});
    
    let td = document.createElement("td");
    td.innerHTML = "Scratch Game";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchGame[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highScratchGame[index][0])}`;
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
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchSeries[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highScratchSeries[index][0])}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    let highHandicapGame = highScores.map(score => [score[0], Math.max(score[1].highHandicapGame.Score1 + score[1].highHandicapGame.HandicapBeforeBowling, score[1].highHandicapGame.Score2 + score[1].highHandicapGame.HandicapBeforeBowling)]);
    highHandicapGame = highHandicapGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Game";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapGame[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highHandicapGame[index][0])}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    let highHandicapSeries = highScores.map(score => [score[0], score[1].highHandicapSeries.Score1 + score[1].highHandicapSeries.Score2 + 2*score[1].highHandicapSeries.HandicapBeforeBowling]);
    highHandicapSeries = highHandicapSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Series";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapSeries[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highHandicapSeries[index][0])}`;
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
    highScores = weeklyStandings.bowlerGames.players.getPlayerNamesByGender("W").map(name => [name, weeklyStandings.bowlerGames.getHighGames(name, Math.min(weekNum, MIN_WEEKS_FOR_AWARD), weekNum)]);
    highScores = highScores.filter(score => score[1] != undefined && score[1].highScratchGame != undefined);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "Women";
    tr.appendChild(th);
    
    highScratchGame = highScores.map(score => [score[0], Math.max(score[1].highScratchGame.Score1, score[1].highScratchGame.Score2)]);
    highScratchGame = highScratchGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Scratch Game";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchGame[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highScratchGame[index][0])}`;
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
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highScratchSeries[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highScratchSeries[index][0])}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    highHandicapGame = highScores.map(score => [score[0], Math.max(score[1].highHandicapGame.Score1 + score[1].highHandicapGame.HandicapBeforeBowling, score[1].highHandicapGame.Score2 + score[1].highHandicapGame.HandicapBeforeBowling)]);
    highHandicapGame = highHandicapGame.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Game";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapGame[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highHandicapGame[index][0])}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
    tr = document.createElement("tr");
    
    th = document.createElement("th");
    th.innerHTML = "";
    tr.appendChild(th);
    
    highHandicapSeries = highScores.map(score => [score[0], score[1].highHandicapSeries.Score1 + score[1].highHandicapSeries.Score2 + 2*score[1].highHandicapSeries.HandicapBeforeBowling]);
    highHandicapSeries = highHandicapSeries.sort(function(a,b) {return b[1] - a[1]});
    
    td = document.createElement("td");
    td.innerHTML = "Handicap Series";
    tr.appendChild(td);
    
    for(let index = 0; index < Math.min(3, highScores.length); index++) {
        td = document.createElement("td");
        td.style.paddingRight = "50px";
        td.innerHTML = `${highHandicapSeries[index][1]} ${weeklyStandings.bowlerGames.players.prettyName(highHandicapSeries[index][0])}`;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
    
}