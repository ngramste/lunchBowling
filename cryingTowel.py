import json
import constants as c
from os import listdir
from tabulate import tabulate
from schedule import schedule
from teamInfo import teamInfo
from recap import recaps
from bowlerGames import bowlerGames
from players import players

bowlerGames = bowlerGames()
players = players()

report = {}

for player in players.getPlayerNames():
  if player not in report:
    report[player] = {
      'drop': 0,
      'week': None,
      'gender': players.getGender(player)
    }
  
  if bowlerGames.getGames(player):
    for game in bowlerGames.getGames(player):
      if report[player]['drop'] < (game['averageBefore'] - game['averageAfter']):
        report[player]['drop'] = game['averageBefore'] - game['averageAfter']
        report[player]['week'] = game['week']

sortedReport = dict(sorted(report.items(), key=lambda item: item[1]['drop'], reverse = True))

headers = ["Bowler", "Gender", "Drop", "Week"]
data = []
for bowler in sortedReport:
  data.append([
    bowler,
    sortedReport[bowler]['gender'],
    sortedReport[bowler]['drop'],
    sortedReport[bowler]['week']
  ])

print(tabulate(data, headers=headers))

fd = open(c.DATA_FOLDER + "cryingTowel.txt", "w")
fd.write(tabulate(data, headers=headers))
fd.close()
