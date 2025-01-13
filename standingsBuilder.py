import json
import constants as c
from os import listdir
from tabulate import tabulate
from schedule import schedule
from bowlerGames import bowlerGames
from teamInfo import teamInfo
from recap import recaps

schedule = schedule()
bowlerGames = bowlerGames()
teamInfo = teamInfo()
recaps = recaps()

teamScores = {}

# loop over all the weeks
for week in schedule.getCurrentWeekNumbers():
  for team in teamInfo.getTeamNumbers():
    if teamInfo.getTeamName(team) not in teamScores:
      teamScores[teamInfo.getTeamName(team)] = {
        'pointsWon': 0,
        'pointsLost': 0,
        'handicapPins': 0,
        'scratchPins': 0
      }
      
    bowlers = recaps.getTeamMemberNames(week, team)
    opponents = recaps.getTeamMemberNames(week, schedule.getOpponentNumber(week, team))
    
    teamScores[teamInfo.getTeamName(team)]['handicapPins'] += bowlerGames.getHandicapSeries(bowlers[0], week)
    teamScores[teamInfo.getTeamName(team)]['handicapPins'] += bowlerGames.getHandicapSeries(bowlers[1], week)
    
    teamScores[teamInfo.getTeamName(team)]['scratchPins'] += bowlerGames.getScratchSeries(bowlers[0], week)
    teamScores[teamInfo.getTeamName(team)]['scratchPins'] += bowlerGames.getScratchSeries(bowlers[1], week)
    
    points = 0
    
    if 0 < (bowlerGames.getHandicapGame(bowlers[0], week, 1) + bowlerGames.getHandicapGame(bowlers[1], week, 1)
        - bowlerGames.getHandicapGame(opponents[0], week, 1) - bowlerGames.getHandicapGame(opponents[1], week, 1)):
      points += 1
    if 0 == (bowlerGames.getHandicapGame(bowlers[0], week, 1) + bowlerGames.getHandicapGame(bowlers[1], week, 1)
        - bowlerGames.getHandicapGame(opponents[0], week, 1) - bowlerGames.getHandicapGame(opponents[1], week, 1)):
      points += 0.5
    
    if 0 < (bowlerGames.getHandicapGame(bowlers[0], week, 2) + bowlerGames.getHandicapGame(bowlers[1], week, 2)
        - bowlerGames.getHandicapGame(opponents[0], week, 2) - bowlerGames.getHandicapGame(opponents[1], week, 2)):
      points += 1
    if 0 == (bowlerGames.getHandicapGame(bowlers[0], week, 2) + bowlerGames.getHandicapGame(bowlers[1], week, 2)
        - bowlerGames.getHandicapGame(opponents[0], week, 2) - bowlerGames.getHandicapGame(opponents[1], week, 2)):
      points += 0.5
    
    if 0 < (bowlerGames.getHandicapSeries(bowlers[0], week) + bowlerGames.getHandicapSeries(bowlers[1], week)
        - bowlerGames.getHandicapSeries(opponents[0], week) - bowlerGames.getHandicapSeries(opponents[1], week)):
      points += 1
    if 0 == (bowlerGames.getHandicapSeries(bowlers[0], week) + bowlerGames.getHandicapSeries(bowlers[1], week)
        - bowlerGames.getHandicapSeries(opponents[0], week) - bowlerGames.getHandicapSeries(opponents[1], week)):
      points += 0.5
      
    teamScores[teamInfo.getTeamName(team)]['pointsWon'] += points
    teamScores[teamInfo.getTeamName(team)]['pointsLost'] += (3 - points)
    
  # Sort the scores from first place to last
  sortedScores = dict(sorted(teamScores.items(), key=lambda item: (item[1]['pointsWon'], item[1]['handicapPins']), reverse = True))
  # print(json.dumps(sortedScores, indent=2))

  headers = ["Place", "Team Name", "Points Won", "Points Lost", "Pins+HDCP", "Scratch Pins"]
  data = []
  for index, team in enumerate(sortedScores):
    data.append([
      index + 1,
      team,
      sortedScores[team]['pointsWon'],
      sortedScores[team]['pointsLost'],
      sortedScores[team]['handicapPins'],
      sortedScores[team]['scratchPins']
    ])
  # print(tabulate(data, headers=headers))

  # Write the results out to file for safe keeping
  fd = open(c.STANDINGS_PATH + "/week" + str(week) + ".txt", "w")
  fd.write(tabulate(data, headers=headers))
  fd.close()