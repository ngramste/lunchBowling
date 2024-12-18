import json
import constants as c

class players:
  def __init__(self):

    # Now lets open the season schedule for reference
    json_players = open(c.PLAYERS_PATH, "r")
    self.players = json.load(json_players)['Data']
    json_players.close()
    
  def getPlayerById(self, bowlerID):
    return next((item for item in self.players if item['BowlerID'] == bowlerID), None)
    
  def getPlayerByName(self, name):
    return next((item for item in self.players if item['BowlerName'] == name), None)
  
  def getPlayerNames(self):
    names = []
    
    for player in self.players:
      names.append(player['BowlerName'])
    return names
      
  def getGender(self, name):
    return self.getPlayerByName(name)['Gender']
    