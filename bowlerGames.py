import json
import constants as c
from os import listdir
import re
from datetime import datetime
from players import players

def getDate(report, weekNum):
  for week in report['weeks']:
    if week['weekNum'] == weekNum:
      return week['date']

class bowlerGames:
  def __init__(self):
    self.players = players()
    
    self.bowlers = {}
    
    # Now lets open the season schedule for reference
    with open(c.SCHEDULE_PATH) as json_scedule:
      report_scedule = json.load(json_scedule)

      # Loop over all the recorded results, these reports hold the scores for each week
      for filename in listdir(c.SUMMARY_PATH):
        with open(c.SUMMARY_PATH + "\\" + filename) as json_data:
          report = json.load(json_data)
          week = int(re.findall(r'\d+', filename)[0])
          date = getDate(report_scedule, week)
          
          for bowler in report['Data']:
            if bowler['BowlerName'] not in self.bowlers:
              self.bowlers[bowler['BowlerName']] = []
              
            scores = {
              "week": week,
              "date": date,
              "timestamp": int(datetime.strptime(date, "%m/%d/%Y").timestamp()),
              "Score1": bowler["Score1"],
              "Score2": bowler["Score2"],
              "ScoreType1": bowler["ScoreType1"],
              "ScoreType2": bowler["ScoreType2"]
            }
            
            self.bowlers[bowler['BowlerName']].append(scores)
            
            # Now sort the weeks
            self.bowlers[bowler['BowlerName']] = sorted(self.bowlers[bowler['BowlerName']], key=lambda week: week['timestamp'])
            
    # Calculate the averages
    for bowler in self.bowlers:
      totalScratch = 0
      games = 0
      for week in self.bowlers[bowler]:
        if (0 == games):
          week['averageBefore'] = int((week['Score1'] + week['Score2']) / 2)
        else:
          week['averageBefore'] = int(totalScratch / games)
        
        week['handicapBefore'] = max(0, int((220 - week['averageBefore']) * 0.9))
        
        # If bowler was absent, don't roll these scores into their average
        if week['ScoreType1'] == "A":
          # Special case where bowler is absent and haven't yet bowled
          if 0 == games:
            week['averageBefore'] = 140
            week['handicapBefore'] = max(0, int((220 - week['averageBefore']) * 0.9))
        else:
          games += 2
          totalScratch += week['Score1']
          totalScratch += week['Score2']
        
        week['totalScratch'] = totalScratch
        if 0 == games:
          # Special case where bowler is absent and haven't yet bowled for the year
          week['averageAfter'] = 140
        else:
          week['averageAfter'] = int(totalScratch / games)
        week['handicapAfter'] = max(0, int((220 - week['averageAfter']) * 0.9))
    
  def getGames(self, name):
    try:
      return self.bowlers[name]
    except:
      return None
  
  def getGame(self, name, weekNum):
    return next((item for item in self.getGames(name) if int(item['week']) == int(weekNum)), None)
  
  def establishingFlag(self, name, weekNum):
    for game in self.getGames(name):
      if "A" != game['ScoreType1']:
        if game['week'] == weekNum:
          return "e"
        else:
          return ""
  
  def getScratchSeries(self, name, weekNum):
    game = self.getGame(name, weekNum)
    return game['Score1'] + game['Score2']
  
  def getHandicapSeries(self, name, weekNum):
    game = self.getGame(name, weekNum)
    return game['Score1'] + game['Score2'] + game['handicapBefore'] + game['handicapBefore']
  
  def getHandicapGame(self, name, weekNum, gameNum):
    game = self.getGame(name, weekNum)
    
    if gameNum == 1:
      return game['Score1'] + game['handicapBefore']
    
    if gameNum == 2:
      return game['Score2'] + game['handicapBefore']
    
  def getGamePrefix(self, name, weekNum, gameNum):
    game = self.getGame(name, weekNum)
    
    if gameNum == 1:
      if game['ScoreType1'] == "A":
        return "a"
    
    if gameNum == 2:
      if game['ScoreType2'] == "A":
        return "a"
    return ""
      
  def getGender(self, name):
    return players.getPlayerByName(name)['Gender']