const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

class schedule {
    schedule = null;

    constructor () {
        return new Promise(resolve => {
            makeRequest("GET", SCHEDULE_PATH).then(responseText => {
                this.schedule = JSON.parse(responseText).weeks;
                resolve(this);
            });
        });
    }

    getCurrentWeekNumbers() {
        return this.schedule.filter(week => new Date(week.date) <= Date.now()).map(week => week.weekNum);
    }
    
    getCurrentSchedule() {
        let weeks = this.schedule.filter(week => new Date(week.date) >= (Date.now() - MS_PER_DAY)).map(week => week.weekNum);
        return (weeks.length) ? this.getWeek(weeks[0]) : undefined;
    }
    
    getWeek(weekNum) {
        return this.schedule.find(week => week.weekNum == weekNum);
    }

    getDate(weekNum) {
        return this.getWeek(weekNum).date;
    }

    getTimestamp(weekNum) {
        return (new Date(this.getDate(weekNum))).getTime();
    }

    getLaneCount(weekNum = 1) {
        return this.getWeek(weekNum).matchups.length * 2; 
    }

    getLaneNumber(weekNum, teamNum) {
        // We always start on lane 1, so add 1 to the result
        return this.getWeek(weekNum).matchups.flat().indexOf(teamNum) + 1;
    }

    getOpponentNumber(weekNum, teamNum) {
        let matchup = this.getWeek(weekNum).matchups.find(matchup => matchup.includes(teamNum));
        return matchup[(matchup.indexOf(teamNum)) ? 0 : 1];
    }
}