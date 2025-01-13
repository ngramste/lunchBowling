import json
import constants as c
from os import listdir
import re
from tabulate import tabulate
from datetime import datetime

class recaps:
  def __init__(self):
    self.summaries = []
    
    # Loop over all the recorded results, these reports hold the scores for each week
    for filename in listdir(c.SUMMARY_PATH):
      with open(c.SUMMARY_PATH + "/" + filename) as json_data:
        report = json.load(json_data)
        week = int(re.findall(r'\d+', filename)[0])
        
        self.summaries.append({
          'week': week,
          'data': report['Data']
        })
        
  def getWeekNums(self):
    weeks = []
    for week in self.summaries:
      weeks.append(week['week'])
      
    return weeks
        
  def getWeek(self, weekNum):
    return next((item for item in self.summaries if int(item['week']) == int(weekNum)), None)['data']
    
  def getTeam(self, weekNum, teamNum):
    bowlers = []
    for bowler in self.getWeek(weekNum):
      if int(bowler['TeamNum']) == int(teamNum):
        bowlers.append(bowler)
        
    return bowlers
  
  def getTeamMemberNames(self, weekNum, teamNum):
    names = []
    for bowler in self.getTeam(weekNum, teamNum):
      names.append(bowler['BowlerName'])
      
    return names