import pandas as pd
import os
import math
from itertools import repeat

numWeeks = 12

def getRowForWeek(team, week):
     for index, row in team.iterrows():
          try:
               if week == int(row['Week']):
                    return row
          except:
               pass

def findMatchingGame(row, teamGames):
     lane = row["Lane"]
     week = row["Week"]

     if not math.isnan(lane):
          if lane % 2:
               matchingLane = lane + 1
          else:
               matchingLane = lane - 1

          for team in teamGames:
               potentialMatch = getRowForWeek(team, int(week))
               if potentialMatch["Lane"] == matchingLane:
                    return potentialMatch


directory = os.fsencode("C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\teams\\")
teamGames = []

for file in os.listdir(directory):
     filename = os.fsdecode(file)

     data = pd.read_csv("C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\teams\\" + filename).head(numWeeks)

     teamName = list(repeat(filename.split(".csv")[0].replace("-", " "), numWeeks))
     data["Team"] = teamName

     teamGames.append(data)

directory = os.fsencode("C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\bowlers\\")
bowlers = []
sandbaggerScore = 0

for file in os.listdir(directory):
     filename = os.fsdecode(file)

     data = pd.read_csv("C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\bowlers\\" + filename)

     highGame = {"score": 0, "week": 0}
     highSeries = {"score": 0, "week": 0}

     name = filename.split(".csv")[0]
     weeks = 0

     startingAve = 0
     endingAve = 0

     for index, row in data.iterrows():
          if not math.isnan(row["SS"]):
               if 0 == startingAve:
                    startingAve = int(row["Avg After"])
               endingAve = int(row["Avg After"])
               weeks += 1
               # name.append(filename.split(".csv")[0])
               if int(row["Gm1"]) > highGame["score"]:
                    highGame["score"] = int(row["Gm1"])
                    highGame["week"] = int(row["Week"])
               if int(row["Gm2"]) > highGame["score"]:
                    highGame["score"] = int(row["Gm2"])
                    highGame["week"] = int(row["Week"])
               if int(row["SS"]) > highSeries["score"]:
                    highSeries["score"] = int(row["SS"])
                    highSeries["week"] = int(row["Week"])

     if (weeks > 4):
          bowler = {"name": name, "weeks": weeks, "highGame": highGame, "highSeries": highSeries, "aveDelta": (endingAve - startingAve)}
          if sandbaggerScore < (endingAve - startingAve):
               sandbaggerScore = endingAve - startingAve
               sandbagger = bowler
          bowlers.append(bowler)

for bowler in bowlers:
     print(bowler)

print("----- Sandbagger -----")
print(sandbagger)







# week = getRowForWeek(teamGames[5], 5)
# print(week)

# print(findMatchingGame(week, teamGames))

# for index, week in teamGames[1].iterrows():
#      # print(week)
#      findMatchingGame(week, teamGames)
#      break
#      # print(findMatchingGame(week, teamGames))


#

# print (teamGames[2][1])
# print ("-MATCHES--MATCHES--MATCHES--MATCHES--MATCHES--MATCHES--MATCHES--MATCHES--MATCHES--MATCHES-")
# for index, week in teamGames[2][1].iterrows():
#      game = findMatchingGame(week, teamGames)
#      # print (game)
