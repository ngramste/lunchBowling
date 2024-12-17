import json
import constants as c

class bowlerGames:
  def __init__(self):

    # Now lets open the season schedule for reference
    json_bowlers = open(c.BOWLER_AVERAGES_PATH, "r")
    self.bowlers = json.load(json_bowlers)
    json_bowlers.close()
    
  def getGames(self, name):
    return self.bowlers[name]
  
  def getGame(self, name, weekNum):
    return next((item for item in self.getGames(name) if int(item['week']) == int(weekNum)), None)
  
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