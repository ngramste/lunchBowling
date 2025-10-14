const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

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
        let weeks = this.schedule.filter(week => new Date(week.date) <= (Date.now() + (6 * MS_PER_DAY))).map(week => week.weekNum);
        
        return (weeks.length) ? this.getWeek(weeks[weeks.length - 1]) : undefined;
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