import json
import constants as c
from os import listdir
import re

teamScores = {}

# We need to reference a lot of local files to figure everything out, start with getting basic team data
with open(c.TEAMS_PATH) as json_teams:
  report_teams = json.load(json_teams)

  # Now lets open the season schedule for reference
  with open(c.SCHEDULE_PATH) as json_scedule:
    report_scedule = json.load(json_scedule)

    # Loop over all the recorded results, these reports hold the scores for each week
    for filename in listdir(c.SUMMARY_PATH):
      with open(c.SUMMARY_PATH + "\\" + filename) as json_data:
        report = json.load(json_data)
        week = re.findall(r'\d+', filename)[0]
        
        # Build the array of arrays for weekly matchups
        weekMatchups = [weekData for weekData in report_scedule['weeks'] if weekData['weekNum'] == int(week)][0]['matchups']
        
        # Loop over each matchup for this week
        for matchup in weekMatchups:
          # And loop over the two teams in this matchup
          for teamNum in matchup:
            # Convert from a team nuber to a team name
            teamName = list(filter(lambda team: team['TeamNum'] == teamNum, report_teams['Data']))[0]['TeamName']
              
            # This is the first week, add the blank placeholder data for this team
            if teamName not in teamScores:
              teamScores[teamName] = {
                'score': 0,
                'handicapPins': 0
              }
              
            # Store the opponents name and team number for later reference
            opponentNum = list(filter(lambda team: team != teamNum, matchup))[0]
            opponentName = list(filter(lambda team: team['TeamNum'] == opponentNum, report_teams['Data']))[0]['TeamName']
            
            # Filter out the weekly results to find the bowlers on the teams in question
            bowlers = list(filter(lambda bowler: bowler['TeamNum'] == teamNum, report['Data']))
            opponents = list(filter(lambda bowler: bowler['TeamNum'] == opponentNum, report['Data']))
            
            # Figure out what the team in question scored
            game1 = bowlers[0]['Score1'] + bowlers[0]['HandicapBeforeBowling'] + bowlers[1]['Score1'] + bowlers[1]['HandicapBeforeBowling']
            game2 = bowlers[0]['Score2'] + bowlers[0]['HandicapBeforeBowling'] + bowlers[1]['Score2'] + bowlers[1]['HandicapBeforeBowling']
            series = game1 + game2
            
            # Figure out what the opponents scored
            oppoentGame1 = opponents[0]['Score1'] + opponents[0]['HandicapBeforeBowling'] + opponents[1]['Score1'] + opponents[1]['HandicapBeforeBowling']
            oppoentGame2 = opponents[0]['Score2'] + opponents[0]['HandicapBeforeBowling'] + opponents[1]['Score2'] + opponents[1]['HandicapBeforeBowling']
            opponentsSeries = oppoentGame1 + oppoentGame2
            
            # Just code for debugging, uncomment to see the stats for a single team for the season
            # if teamNum == 28:
            #   print(json.dumps({
            #     'week': filename,
            #     'name': teamName,
            #     'opponent': opponentName,
            #     'game1': game1,
            #     'oppoentGame1': oppoentGame1,
            #     'game2': game2,
            #     'oppoentGame2': oppoentGame2,
            #     'series': series,
            #     'opponentsSeries': opponentsSeries
            #   }, indent=2))
            
            # Add in the handicap series to the team score data
            teamScores[teamName]['handicapPins'] += series
            
            # These if statements will add up the points for this week
            if game1 > oppoentGame1:
              teamScores[teamName]['score'] += 1
            
            if game1 == oppoentGame1:
              teamScores[teamName]['score'] += 0.5
              
            if game2 > oppoentGame2:
              teamScores[teamName]['score'] += 1
            
            if game2 == oppoentGame2:
              teamScores[teamName]['score'] += 0.5
              
            if series > opponentsSeries:
              teamScores[teamName]['score'] += 1
            
            if series == opponentsSeries:
              teamScores[teamName]['score'] += 0.5
              
# Sort the scores from first place to last
sortedScores = dict(sorted(teamScores.items(), key=lambda item: (item[1]['score'], item[1]['handicapPins']), reverse = True))
print(json.dumps(sortedScores, indent=2))

# Write the results out to file for safe keeping
fd = open(c.DATA_FOLDER + "standings.json", "w")
fd.write(json.dumps(sortedScores, indent=2))
fd.close()