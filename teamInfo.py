import json
import constants as c

class teamInfo:
  def __init__(self):

    # Now lets open the season schedule for reference
    json_teams = open(c.TEAMS_PATH, "r")
    self.teams = json.load(json_teams)['Data']
    json_teams.close()
    
  def getTeam(self, teamNum):
    return next((item for item in self.teams if item['TeamNum'] == teamNum), None)
  
  def getTeamName(self, teamNum):
    return self.getTeam(teamNum)['TeamName']
  
  def getTeamNumbers(self):
    teams = []
    for team in self.teams:
      teams.append(team['TeamNum'])
      
    return teams