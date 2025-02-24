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

    getTeam(teamNum) {
        return this.json_teams.find(team => team.TeamNum == teamNum);
    }

    getTeamName(teamNum) {
        return this.getTeam(teamNum).TeamName;
    }

    getTeamNumbers() {
        return this.json_teams.map(team => team.TeamNum);
    }
}
