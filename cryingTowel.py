import json
import constants as c

with open(c.REPORT_PATH) as json_data:
  report = json.load(json_data)
  
# -------------- Figure out weekly averages for every bowler -------------- #
  
for bowler in report:
  previousAverage = 0
  totalPins = 0
  games = 0
  for week in report[bowler]['weeks']:
    totalPins += int(week['gm1'])
    totalPins += int(week['gm1'])
    games += 2
    week['currentAve'] = float(format(totalPins / games, '.4f'))
    week['totalPins'] = totalPins
    week['games'] = games
    if previousAverage != 0:
      week['changeInAve'] = float(format(week['currentAve'] - previousAverage, '.4f'))
      
    previousAverage = week['currentAve']
  
# -------------- Find the larget drop in averages -------------- #

men = {'name': '', 'drop': 0.0}
women = {'name': '', 'drop': 0.0}
unknown = []

for bowler in report:
    if 'mw' not in report[bowler]:
      if len(report[bowler]['weeks']) > 0:
        data = {'name': bowler, 'drop': 0.0}
        for week in report[bowler]['weeks']:
          if 'changeInAve' in week:
            if week['changeInAve'] < data['drop']:
              data['drop'] = week['changeInAve']
        unknown.append(data)
    elif report[bowler]['mw'] == 'M':
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < men['drop']:
            men['drop'] = week['changeInAve']
            men['name'] = bowler
    elif report[bowler]['mw'] == 'W':
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < women['drop']:
            women['drop'] = week['changeInAve']
            women['name'] = bowler
  
print(json.dumps(men))
print(json.dumps(women))
print(json.dumps(unknown))

fd = open(c.DATA_FOLDER + "report-cryData.json", "w")
fd.write(json.dumps(report))
fd.close()
