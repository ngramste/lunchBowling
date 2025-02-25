class teamInfo {
    json_teams = null;

    constructor () {
        return new Promise(resolve => {
            makeRequest("GET", TEAMS_PATH).then(responseText => {
                this.json_teams = JSON.parse(responseText).Data;
                resolve(this);
            });
        });
    }
    
    getTeamList() {
        return this.json_teams.map(team => team.TeamName);
    }

    getTeam(teamNum) {
        return this.json_teams.find(team => team.TeamNum == teamNum);
    }
    
    getTeamByName(name) {
        return this.json_teams.find(team => team.TeamName == name);
    }

    getTeamName(teamNum) {
        return this.getTeam(teamNum).TeamName;
    }

    getTeamNumbers() {
        return this.json_teams.map(team => team.TeamNum);
    }
}
