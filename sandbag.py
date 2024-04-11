import json
import constants as c

with open(c.DATA_FOLDER + "report-cryData.json") as json_data:
  report = json.load(json_data)

bowlers = {}

weeksSkipped = 0

for bowler in report:
  lastIndex = len(report[bowler]['weeks']) - 1
  if weeksSkipped > lastIndex:
    continue

  bowlers[bowler] = int(report[bowler]['weeks'][lastIndex]['aveAfter']) - int(report[bowler]['weeks'][weeksSkipped]['aveBefore'])

# ----------- Crazy sorting done here --------------
sortedList = sorted(bowlers, key=lambda v: bowlers[v])

sandbaggers = {}
for bowler in sortedList:
  sandbaggers[bowler] = bowlers[bowler]

print(json.dumps(sandbaggers, indent=2))

fd = open(c.DATA_FOLDER + "sandbaggers.json", "w")
fd.write(json.dumps(sandbaggers, indent=2))
fd.close()
