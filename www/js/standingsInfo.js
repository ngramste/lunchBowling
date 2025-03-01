let teamData = null;
let weeklyStandings = null;

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
    
    // LastWeekHighScores(week.weekNum);
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