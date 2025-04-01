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
                    score: gameData.getImprovement(player, 12)
                }
            })
            // Filter out missing data
            .filter(player => undefined != player.score)
            // Sort by rise in average
            .sort((a,b) => b.score - a.score);
            
        let dataTable = document.getElementById("data");
        
        bowlers.forEach(bowler => {
            let tr = document.createElement("tr");
            
            let td = document.createElement("td");
            td.innerHTML = bowler.bowlerName;
            tr.appendChild(td);
            
            td = document.createElement("td");
            td.innerHTML = bowler.score;
            tr.appendChild(td);
        
            dataTable.appendChild(tr);
        });
    });
}