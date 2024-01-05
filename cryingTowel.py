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

men = {'name': '', 'drop': 300}
women = {'name': '', 'drop': 300}
unknown = []
all = []

for bowler in report:
    data = {'name': bowler, 'drop': 300}
    
    if len(report[bowler]['weeks']) <= 1:
      data['drop'] = 0
    
    if 'mw' not in report[bowler]:
      data['mw'] = 'U'
      if len(report[bowler]['weeks']) > 1:
        for week in report[bowler]['weeks']:
          if 'changeInAve' in week:
            if week['changeInAve'] < data['drop']:
              data['drop'] = week['changeInAve']
        unknown.append(data)
        
    elif report[bowler]['mw'] == 'M':
      data['mw'] = 'M'
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < data['drop']:
            data['drop'] = week['changeInAve']
          if week['changeInAve'] < men['drop']:
            men['drop'] = week['changeInAve']
            men['name'] = bowler
            
    elif report[bowler]['mw'] == 'W':
      data['mw'] = 'W'
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < data['drop']:
            data['drop'] = week['changeInAve']
          if week['changeInAve'] < women['drop']:
            women['drop'] = week['changeInAve']
            women['name'] = bowler
            
    all.append(data)
  
print(json.dumps(men))
print(json.dumps(women))
print(json.dumps(unknown))

fd = open(c.DATA_FOLDER + "report-cryData.json", "w")
fd.write(json.dumps(report))
fd.close()

fd = open(c.DATA_FOLDER + "cryingTowel.json", "w")
fd.write(json.dumps(all))
fd.close()
