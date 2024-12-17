import json
import constants as c
from datetime import datetime

class bowlingSchedule:
  def __init__(self):

    # Now lets open the season schedule for reference
    json_scedule = open(c.SCHEDULE_PATH, "r")
    self.schedule = json.load(json_scedule)
    
  def getCurrentWeekNumbers(self):
    weekNumbers = []
    
    # Loop over all the weeks in the schedule
    for week in self.schedule["weeks"]:
      # If the week in question happend today or in the past, we will try to scrape it
      date = datetime.strptime(week["date"], '%m/%d/%Y')
      if date < datetime.now():
        weekNumbers.append(int(week["weekNum"]))
    
    return weekNumbers
  
  def getWeek(self, weekNum):
    # Loop over all the weeks in the schedule
    for week in self.schedule["weeks"]:
      if int(week["weekNum"]) == int(weekNum):
        return week
    return None
  
  def getTimestamp(self, weekNum):
    dateStr = self.getWeek(weekNum)['date']
    return int(datetime.strptime(dateStr, "%m/%d/%Y").timestamp())
  
  def getLaneCount(self, weekNum = 1):
    return len(self.getWeek(weekNum)['matchups'])
  
  def getLaneNumber(self, weekNum, teamNum):
    week = self.getWeek(weekNum)
    # Flatten the 2d matchup array
    lanes = [item for sublist in week['matchups'] for item in sublist]
    # We always start on lane 1
    return lanes.index(teamNum) + 1
  
  def getOpponentNumber(self, weekNum, teamNum):
    week = self.getWeek(weekNum)
    for matchup in week['matchups']:
      try:
        return matchup[0 if matchup.index(teamNum) else 1]
      except:
        pass