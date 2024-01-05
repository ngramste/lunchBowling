import json

with open("2023-2024/report.json") as json_data:
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

friendTeam = []
friendScore = 0
meanTeam = []
meanScore = 100

for team in teams:
  print(teams[team])
  if friendScore <= teams[team]:
    if friendScore == teams[team]:
      friendScore = teams[team]
      friendTeam.append(team)
    else:
      friendScore = teams[team]
      friendTeam = [team]

  if meanScore >= teams[team]:
    if meanScore == teams[team]:
      meanScore = teams[team]
      meanTeam.append(team)
    else:
      meanScore = teams[team]
      meanTeam = [team]

print("Friendly Team: " + " and ".join(friendTeam) + ", " + str(friendScore))
print("Meanie Team: " + ":".join(meanTeam) + ", " + str(meanScore))
