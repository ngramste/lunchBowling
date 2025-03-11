let gameData = null;

// Setup a function to be called when the document is finished loading.
window.onload = function () {
    new bowlerGames().then(result => {
        gameData = result;
        
        let bowlers = gameData.players.getPlayerNames()
            // filter out people who didn't bowl a game
            .filter(player => undefined != gameData.getGames(player))
            // Get averages in first and last weeks of bowling
            .map(player => {
                return {
                    bowlerName: gameData.players.prettyName(player), 
                    aveStart: gameData.getGames(player)[0].averageAfter, 
                    aveEnd: gameData.getGames(player)[gameData.getGames(player).length - 1].averageAfter
                }
            })
            // Sort by rise in average
            .sort(function(a,b){return (b.aveEnd-b.aveStart) - (a.aveEnd-a.aveStart)});
            
        let dataTable = document.getElementById("data");
        let tr = document.createElement("tr");
        
        let th = document.createElement("th");
        th.innerHTML = "Bowler";
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.innerHTML = "Starting Average";
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.innerHTML = "Ending Average";
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.innerHTML = "Change in Average";
        tr.appendChild(th);
        
        dataTable.appendChild(tr);
        
        bowlers.forEach(bowler => {
            let tr = document.createElement("tr");
            
            let td = document.createElement("td");
            td.innerHTML = bowler.bowlerName;
            tr.appendChild(td);
            
            td = document.createElement("td");
            td.innerHTML = bowler.aveStart;
            tr.appendChild(td);
            
            td = document.createElement("td");
            td.innerHTML = bowler.aveEnd;
            tr.appendChild(td);
            
            td = document.createElement("td");
            td.innerHTML = bowler.aveEnd - bowler.aveStart;
            tr.appendChild(td);
        
            dataTable.appendChild(tr);
        });
    });
}