import json
import constants as c
from os import listdir
import re
from tabulate import tabulate
from datetime import datetime

bowlers = {}

def getDate(report, weekNum):
  for week in report['weeks']:
    if week['weekNum'] == weekNum:
      return week['date']

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
        if bowler['BowlerName'] not in bowlers:
          bowlers[bowler['BowlerName']] = []
          
        scores = {
          "week": week,
          "date": date,
          "timestamp": int(datetime.strptime(date, "%m/%d/%Y").timestamp()),
          "Score1": bowler["Score1"],
          "Score2": bowler["Score2"],
          "ScoreType1": bowler["ScoreType1"],
          "ScoreType2": bowler["ScoreType2"]
        }
        
        bowlers[bowler['BowlerName']].append(scores)
        
        # Now sort the weeks
        bowlers[bowler['BowlerName']] = sorted(bowlers[bowler['BowlerName']], key=lambda week: week['timestamp'])
        
# Calculate the averages
for bowler in bowlers:
  totalScratch = 0
  games = 0
  for week in bowlers[bowler]:
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
      # Special case where bowler is absent and haven't yet bowled
      week['averageAfter'] = 140
    else:
      week['averageAfter'] = int(totalScratch / games)
    week['handicapAfter'] = max(0, int((220 - week['averageAfter']) * 0.9))
    
fd = open(c.BOWLER_AVERAGES_PATH, "w")
fd.write(json.dumps(bowlers, indent=2))
fd.close()