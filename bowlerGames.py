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