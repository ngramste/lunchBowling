import json
import constants as c
from os import listdir
import re

teamScores = {}

with open(c.TEAMS_PATH) as json_teams:
  report_teams = json.load(json_teams)
  
  # teamNum is the value reported in the schedule

  with open(c.SCHEDULE_PATH) as json_scedule:
    report_scedule = json.load(json_scedule)

    for filename in listdir(c.SUMMARY_PATH):
      with open(c.SUMMARY_PATH + "\\" + filename) as json_data:
        report = json.load(json_data)
        week = re.findall(r'\d+', filename)[0]
        weekMatchups = [weekData for weekData in report_scedule['weeks'] if weekData['weekNum'] == int(week)][0]['matchups']
        
        for matchup in weekMatchups:
          for teamNum in matchup:
            teamName = list(filter(lambda team: team['TeamNum'] == teamNum, report_teams['Data']))[0]['TeamName']
              
            if teamName not in teamScores:
              
              teamScores[teamName] = 0
              
            opponentNum = list(filter(lambda team: team != teamNum, matchup))[0]
            
            bowlers = list(filter(lambda bowler: bowler['TeamNum'] == teamNum, report['Data']))
            opponents = list(filter(lambda bowler: bowler['TeamNum'] == opponentNum, report['Data']))
            
            game1 = bowlers[0]['Score1'] + bowlers[0]['HandicapBeforeBowling'] + bowlers[1]['Score1'] + bowlers[1]['HandicapBeforeBowling']
            game2 = bowlers[0]['Score2'] + bowlers[0]['HandicapBeforeBowling'] + bowlers[1]['Score2'] + bowlers[1]['HandicapBeforeBowling']
            series = game1 + game2
            
            oppoentGame1 = opponents[0]['Score1'] + opponents[0]['HandicapBeforeBowling'] + opponents[1]['Score1'] + opponents[1]['HandicapBeforeBowling']
            oppoentGame2 = opponents[0]['Score2'] + opponents[0]['HandicapBeforeBowling'] + opponents[1]['Score2'] + opponents[1]['HandicapBeforeBowling']
            opponentsSeries = oppoentGame1 + oppoentGame2
            
            if game1 > oppoentGame1:
              teamScores[teamName] += 1
            
            if game1 == oppoentGame1:
              teamScores[teamName] += 0.5
              
            if game2 > oppoentGame2:
              teamScores[teamName] += 1
            
            if game2 == oppoentGame2:
              teamScores[teamName] += 0.5
              
            if series > opponentsSeries:
              teamScores[teamName] += 1
            
            if series == opponentsSeries:
              teamScores[teamName] += 0.5
              
sortedScores = dict(sorted(teamScores.items(), key=lambda item: item[1], reverse = True))
print(json.dumps(sortedScores, indent=2))

fd = open(c.DATA_FOLDER + "standings.json", "w")
fd.write(json.dumps(sortedScores, indent=2))
fd.close()