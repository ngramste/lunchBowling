[Link to web interface](/lunchBowling/www)

These scripts will help me figure out scoring for lunch bowling, and some of the more weird awards that require more goofy calculations

This is the order of operations for running scripts
1. Ensure all the constants in constants.py look right. These will be different each season
2. Populate schedule.json for the current season. There isn't an API for this on League Secretary, those jerks
3. Run scrapeData.py to pull down all the latest results. Results will be stored in the weeklySummary folder for the current season. This should be run weekly as people subbing for other teams will vanish once they change teams the next week. Everything for the current week is good though.
4. calculateStandings.py can be run after step 3 which will update the standings.json file for the current season
5. centuries.py can be run after step 3 which looks for people who bowled two games with a pin difference of more than 99 pins
6. friendship.py can be run after step 3. This is the main reason for this repo. Each week, teams that inspired one of their opponents to bowl their best game or best series will earn a friendship point. The team with the most friendship points at the end of the season gets the friendly award. The team with the fewest earns the meanie award.
7. cryingTowl.py has not been updated to work with the current LeagueSecretary API
8. sandbag.py has not been updated to work with the current LeagueSecretary API
