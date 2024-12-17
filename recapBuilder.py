import json
import constants as c
from os import listdir
import re
from tabulate import tabulate
from schedule import schedule
from bowlerGames import bowlerGames
from teamInfo import teamInfo
from recap import recaps

schedule = schedule()
bowlerGames = bowlerGames()
teamInfo = teamInfo()
recaps = recaps()

# Loop over all recorded weeks
for week in recaps.getWeekNums():
  table_output = "Reprint of scores for week " + str(week)
    
  # Loop over all the matchups
  for matchup in schedule.getWeek(week)['matchups']:
    
    bowlers = [
      recaps.getTeamMemberNames(week, matchup[0])[0],
      recaps.getTeamMemberNames(week, matchup[0])[1],
      recaps.getTeamMemberNames(week, matchup[1])[0],
      recaps.getTeamMemberNames(week, matchup[1])[1]
    ]
          
    game1Pts = 0
    game2Pts = 0
    totalPts = 0
    if 0 < (bowlerGames.getHandicapGame(bowlers[0], week, 1) + bowlerGames.getHandicapGame(bowlers[1], week, 1) 
            - bowlerGames.getHandicapGame(bowlers[2], week, 1) - bowlerGames.getHandicapGame(bowlers[3], week, 1)):
      game1Pts += 1
      
    if 0 == (bowlerGames.getHandicapGame(bowlers[0], week, 1) + bowlerGames.getHandicapGame(bowlers[1], week, 1) 
            - bowlerGames.getHandicapGame(bowlers[2], week, 1) - bowlerGames.getHandicapGame(bowlers[3], week, 1)):
      game1Pts += 0.5
      
    if 0 < (bowlerGames.getHandicapGame(bowlers[0], week, 2) + bowlerGames.getHandicapGame(bowlers[1], week, 2) 
            - bowlerGames.getHandicapGame(bowlers[2], week, 2) - bowlerGames.getHandicapGame(bowlers[3], week, 2)):
      game2Pts += 1
      
    if 0 == (bowlerGames.getHandicapGame(bowlers[0], week, 2) + bowlerGames.getHandicapGame(bowlers[1], week, 2) 
            - bowlerGames.getHandicapGame(bowlers[2], week, 2) - bowlerGames.getHandicapGame(bowlers[3], week, 2)):
      game2Pts += 0.5
      
    if 0 < (bowlerGames.getHandicapSeries(bowlers[0], week) + bowlerGames.getHandicapSeries(bowlers[1], week)
            - bowlerGames.getHandicapSeries(bowlers[2], week) - bowlerGames.getHandicapSeries(bowlers[3], week)):
      totalPts += 1
      
    if 0 == (bowlerGames.getHandicapSeries(bowlers[0], week) + bowlerGames.getHandicapSeries(bowlers[1], week)
            - bowlerGames.getHandicapSeries(bowlers[2], week) - bowlerGames.getHandicapSeries(bowlers[3], week)):
      totalPts += 0.5
    
    headers = ["\n"+teamInfo.getTeamName(matchup[0]), "Old\nAvg", "Old\nHDCP", "\n-1-", "\n-2-", "\nTotal", "HDCP\nTotal","\n"+teamInfo.getTeamName(matchup[1]), "Old\nAvg", "Old\nHDCP", "\n-1-", "\n-2-", "\nTotal", "HDCP\nTotal"]
    data = [
      [
        bowlers[0],
        bowlerGames.getGame(bowlers[0], week)['averageBefore'],
        bowlerGames.getGame(bowlers[0], week)['handicapBefore'],
        bowlerGames.getGamePrefix(bowlers[0], week, 1) + str(bowlerGames.getGame(bowlers[0], week)['Score1']),
        bowlerGames.getGamePrefix(bowlers[0], week, 2) + str(bowlerGames.getGame(bowlers[0], week)['Score2']),
        bowlerGames.getScratchSeries(bowlers[0], week),
        bowlerGames.getHandicapSeries(bowlers[0], week),
        bowlers[2],
        bowlerGames.getGame(bowlers[2], week)['averageBefore'],
        bowlerGames.getGame(bowlers[2], week)['handicapBefore'],
        bowlerGames.getGamePrefix(bowlers[2], week, 1) + str(bowlerGames.getGame(bowlers[2], week)['Score1']),
        bowlerGames.getGamePrefix(bowlers[2], week, 1) + str(bowlerGames.getGame(bowlers[2], week)['Score2']),
        bowlerGames.getScratchSeries(bowlers[2], week),
        bowlerGames.getHandicapSeries(bowlers[2], week)
      ],
      [
        bowlers[1],
        bowlerGames.getGame(bowlers[1], week)['averageBefore'],
        bowlerGames.getGame(bowlers[1], week)['handicapBefore'],
        bowlerGames.getGamePrefix(bowlers[1], week, 1) + str(bowlerGames.getGame(bowlers[1], week)['Score1']),
        bowlerGames.getGamePrefix(bowlers[1], week, 1) + str(bowlerGames.getGame(bowlers[1], week)['Score2']),
        bowlerGames.getScratchSeries(bowlers[1], week),
        bowlerGames.getHandicapSeries(bowlers[1], week),
        bowlers[3],
        bowlerGames.getGame(bowlers[3], week)['averageBefore'],
        bowlerGames.getGame(bowlers[3], week)['handicapBefore'],
        bowlerGames.getGamePrefix(bowlers[3], week, 1) + str(bowlerGames.getGame(bowlers[3], week)['Score1']),
        bowlerGames.getGamePrefix(bowlers[3], week, 1) + str(bowlerGames.getGame(bowlers[3], week)['Score2']),
        bowlerGames.getScratchSeries(bowlers[3], week),
        bowlerGames.getHandicapSeries(bowlers[3], week)
      ],
      [
        "",
        "",
        "",
        "====",
        "====",
        "====",
        "====",
        "",
        "",
        "",
        "====",
        "====",
        "====",
        "===="
      ],
      [
        "Scratch Total",
        "",
        "",
        bowlerGames.getGame(bowlers[0], week)['Score1'] + bowlerGames.getGame(bowlers[1], week)['Score1'],
        bowlerGames.getGame(bowlers[0], week)['Score2'] + bowlerGames.getGame(bowlers[1], week)['Score2'],
        bowlerGames.getScratchSeries(bowlers[0], week) + bowlerGames.getScratchSeries(bowlers[1], week),
        bowlerGames.getScratchSeries(bowlers[0], week) + bowlerGames.getScratchSeries(bowlers[1], week),
        "Scratch Total",
        "",
        "",
        bowlerGames.getGame(bowlers[2], week)['Score1'] + bowlerGames.getGame(bowlers[3], week)['Score1'],
        bowlerGames.getGame(bowlers[2], week)['Score2'] + bowlerGames.getGame(bowlers[3], week)['Score2'],
        bowlerGames.getScratchSeries(bowlers[2], week) + bowlerGames.getScratchSeries(bowlers[3], week),
        bowlerGames.getScratchSeries(bowlers[2], week) + bowlerGames.getScratchSeries(bowlers[3], week)
      ],
      [
        "Handicap",
        "",
        "",
        bowlerGames.getGame(bowlers[0], week)['handicapBefore'] + bowlerGames.getGame(bowlers[1], week)['handicapBefore'],
        bowlerGames.getGame(bowlers[0], week)['handicapBefore'] + bowlerGames.getGame(bowlers[1], week)['handicapBefore'],
        "",
        2 * (bowlerGames.getGame(bowlers[0], week)['handicapBefore'] + bowlerGames.getGame(bowlers[1], week)['handicapBefore']),
        "Handicap",
        "",
        "",
        bowlerGames.getGame(bowlers[2], week)['handicapBefore'] + bowlerGames.getGame(bowlers[3], week)['handicapBefore'],
        bowlerGames.getGame(bowlers[2], week)['handicapBefore'] + bowlerGames.getGame(bowlers[3], week)['handicapBefore'],
        "",
        2 * (bowlerGames.getGame(bowlers[2], week)['handicapBefore'] + bowlerGames.getGame(bowlers[3], week)['handicapBefore']),
      ],
      [
        "Total",
        "",
        "",
        bowlerGames.getHandicapGame(bowlers[0], week, 1) + bowlerGames.getHandicapGame(bowlers[1], week, 1),
        bowlerGames.getHandicapGame(bowlers[0], week, 2) + bowlerGames.getHandicapGame(bowlers[1], week, 2),
        bowlerGames.getScratchSeries(bowlers[0], week) + bowlerGames.getScratchSeries(bowlers[1], week),
        bowlerGames.getHandicapSeries(bowlers[0], week) + bowlerGames.getHandicapSeries(bowlers[1], week),
        "Total",
        "",
        "",
        bowlerGames.getHandicapGame(bowlers[2], week, 1) + bowlerGames.getHandicapGame(bowlers[3], week, 1),
        bowlerGames.getHandicapGame(bowlers[2], week, 2) + bowlerGames.getHandicapGame(bowlers[3], week, 2),
        bowlerGames.getScratchSeries(bowlers[2], week) + bowlerGames.getScratchSeries(bowlers[3], week),
        bowlerGames.getHandicapSeries(bowlers[2], week) + bowlerGames.getHandicapSeries(bowlers[3], week)
      ],
      [
        "Team Points Won",
        "",
        "",
        game1Pts,
        game2Pts,
        totalPts,
        game1Pts + game2Pts + totalPts,
        "Team Points Won",
        "",
        "",
        1 - game1Pts,
        1 - game2Pts,
        1 - totalPts,
        3 - game1Pts - game2Pts - totalPts
      ]
    ]
      
    table_output += "\n\n\n\n" + tabulate(data, headers=headers)
    
  # Write the recaps out to file for safe keeping
  fd = open(c.RECAPS_PATH + "\\week" + str(week) + ".txt", "w")
  fd.write(table_output)
  fd.close()
  