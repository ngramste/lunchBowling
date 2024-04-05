import json
import constants as c

with open(c.REPORT_PATH) as json_data:
  report = json.load(json_data)

teams = {}

for bowler in report:
  if 'team' in report[bowler]:
    teams[report[bowler]['team']] = 0

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

print("Friendly Team(s): " + " and ".join(friendTeam) + ", " + str(friendScore))
print("Meanie Team(s): " + " and ".join(meanTeam) + ", " + str(meanScore))

fd = open(c.DATA_FOLDER + "friendship.json", "w")
fd.write(json.dumps(teams, indent=2))
fd.close()
