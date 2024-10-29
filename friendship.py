import json
import constants as c
from os import listdir
import re
import numpy

bowlers = {}

with open(c.TEAMS_PATH) as json_teams:
  report_teams = json.load(json_teams)

  with open(c.SCHEDULE_PATH) as json_scedule:
    report_scedule = json.load(json_scedule)

    for filename in listdir(c.SUMMARY_PATH):
      with open(c.SUMMARY_PATH + "\\" + filename) as json_data:
        report = json.load(json_data)
        week = re.findall(r'\d+', filename)[0]
        weekMatchups = [weekData for weekData in report_scedule['weeks'] if weekData['weekNum'] == int(week)][0]['matchups']
        
        for bowler in report["Data"]:
          name = bowler["BowlerName"]
          score1 = bowler["Score1"]
          score2 = bowler["Score2"]
          
          # Find the oppenent
          pair = weekMatchups[numpy.argwhere(numpy.array(weekMatchups) == bowler['TeamNum'])[0][0]]
          opponentNumber = pair[int((numpy.argwhere(numpy.array(weekMatchups) == bowler['TeamNum'])[0][1]) == 0)]
          opponentName = [team for team in report_teams['Data'] if team['TeamNum'] == opponentNumber][0]['TeamName']

          if name not in bowlers:
            bowlers[name] = {
              "highGame": {
                "score": 0,
                "opponent": "",
                "week": 0
              },
              "highSeries": {
                "score": 0,
                "opponent": "",
                "week": 0
              }
            }
            
          if score1 > bowlers[name]["highGame"]["score"]:
            bowlers[name]["highGame"]["score"] = score1
            bowlers[name]["highGame"]["week"] = week
            bowlers[name]["highGame"]["opponent"] = opponentName
            
          if score2 > bowlers[name]["highGame"]["score"]:
            bowlers[name]["highGame"]["score"] = score2
            bowlers[name]["highGame"]["week"] = week
            bowlers[name]["highGame"]["opponent"] = opponentName
            
          if (score1 + score2) > bowlers[name]["highSeries"]["score"]:
            bowlers[name]["highSeries"]["score"] = score1 + score2
            bowlers[name]["highSeries"]["week"] = week
            bowlers[name]["highSeries"]["opponent"] = opponentName
        
  
  teams = {}
  for team in report_teams["Data"]:
    
    teamName = team['TeamName']
    points = 0
    
    for bowler in bowlers:
      if bowlers[bowler]['highGame']['opponent'] == teamName:
        points = points + 1
        
      if bowlers[bowler]['highSeries']['opponent'] == teamName:
        points = points + 1
    
    teams[teamName] = points
    
  friendTeam = []
  friendScore = 0
  meanTeam = []
  meanScore = 100

  for team in teams:
    if friendScore <= teams[team]:
      if friendScore == teams[team]:
        friendScore = teams[team]
        friendTeam.append(team)
      else:
        friendScore = teams[team]
        friendTeam = [team]

    if meanScore >= teams[team]:
      if meanScore == teams[team]:
        meanScore = teams[team]
        meanTeam.append(team)
      else:
        meanScore = teams[team]
        meanTeam = [team]

  print("Friendly Team(s): " + " and ".join(friendTeam) + ", " + str(friendScore))
  print("Meanie Team(s): " + " and ".join(meanTeam) + ", " + str(meanScore))
  
  fd = open(c.DATA_FOLDER + "friendship.json", "w")
  fd.write(json.dumps(teams, indent=2))
  fd.close()
