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
                // Get the players list of weeks played
                let weeks = gameData.getGames(player)
                    // Filter to get games actually bowled
                    .filter(week => arrayBuilder(1, gameData.gamesPerWeek())
                        // ScoreType# == S is a scratch game actually bowled
                        .map(game => week[`ScoreType${game}`]).includes("S")
                    );
                
                return {
                    bowlerName: gameData.players.prettyName(player), 
                    aveStart: gameData.calculateAverage(player, weeks[0].week),
                    aveEnd: gameData.calculateAverage(player, weeks[weeks.length - 1].week)
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