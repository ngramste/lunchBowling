import json

with open("report.json") as json_data:
  report = json.load(json_data)
    
teams = {}
    
for bowler in report:
  if 'hsgTeam' in report[bowler]:
    if report[bowler]['hsgTeam'] in teams:
      teams[report[bowler]['hsgTeam']] += 1
    else:
      teams[report[bowler]['hsgTeam']] = 1
  if 'hssTeam' in report[bowler]:
    if report[bowler]['hssTeam'] in teams:
      teams[report[bowler]['hssTeam']] += 1
    else:
      teams[report[bowler]['hssTeam']] = 1
      
print(json.dumps(teams))
