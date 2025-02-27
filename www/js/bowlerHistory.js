let gameData = null;
let teamData = null;

function BowlerSelected(event) {
    let bowlerName =  event.target.value;
    let table = document.getElementById("data");
    table.innerHTML = "";
    
    let tr = document.createElement("tr");
    
    let th = document.createElement("th");
    th.innerHTML = "Week";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Date";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Team";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Game 1";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Game 2";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "SS";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "HCP";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "HS";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Avg Before";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Avg After";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Avg After CALC";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "Avg Today";
    tr.appendChild(th);
    
    th = document.createElement("th");
    th.innerHTML = "+/- Avg";
    tr.appendChild(th);
    
    table.appendChild(tr);
    
    let totalPins = 0;
    let totalGames = 0;
    
    gameData.getGames(bowlerName).forEach(week => {
        if ("a" != gameData.getGamePrefix(bowlerName, week.week, 1)) {
            totalGames += 2;
            totalPins += (week.Score1 + week.Score2);
        }
        
        tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = week.week;
        tr.appendChild(td);
        
        td = document.createElement("td");
        let a = document.createElement("a");
        a.innerHTML = week.date;
        a.href = `./index.html?weekNum=${week.week}`;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        a = document.createElement("a");
        a.href = `./team.html?teamName=${gameData.recaps.summaries[week.week].find(bowler => bowler.BowlerName == bowlerName).TeamName}`;
        a.innerHTML = gameData.recaps.summaries[week.week].find(bowler => bowler.BowlerName == bowlerName).TeamName;
        td.appendChild(a);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = `${gameData.getGamePrefix(bowlerName, week.week, 1)}${gameData.establishingFlag(bowlerName, week.week)}${week.Score1}`;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = `${gameData.getGamePrefix(bowlerName, week.week, 2)}${gameData.establishingFlag(bowlerName, week.week)}${week.Score2}`;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getScratchSeries(bowlerName, week.week);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = week.handicapBefore;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = gameData.getHandicapSeries(bowlerName, week.week);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = week.averageBefore;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = week.averageAfter;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = `${Math.floor(totalPins / totalGames)}=${totalPins}/${totalGames}`;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = Math.floor((week.Score1 + week.Score2) / 2);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = Math.floor((week.Score1 + week.Score2) / 2) - week.averageBefore;
        tr.appendChild(td);
        
        table.appendChild(tr);
    });
}

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    new bowlerGames().then(result => {
        gameData = result;
        new teamInfo().then(result => {
            teamData = result;
            let bowlerSelect = document.getElementById("bowlers");

            gameData.players.getPlayerNames().forEach(bowler => {
                let option = document.createElement("option");
                option.value = bowler;
                option.innerHTML = bowler;
                bowlerSelect.appendChild(option);
            });

            bowlerSelect.addEventListener("change", BowlerSelected);

            let params = new URLSearchParams(window.location.search);
            let bowlerName = params.get("name");
            
            if (null != bowlerName) {
                bowlerSelect.value = bowlerName;
                BowlerSelected({ target: { value: bowlerName } });
            } else {
                // Auto select the last option
                bowlerSelect.value = gameData.players.getPlayerNames()[0];
                // Auto select the first option
                BowlerSelected({ target: { value: gameData.players.getPlayerNames()[0] } });
            }

        })
    });
}