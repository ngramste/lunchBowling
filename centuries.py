import json

with open("2023-2024/report.json") as json_data:
  report = json.load(json_data)

bowlers = {}

for bowler in report:
  for week in report[bowler]['weeks']:
    if abs(int(week['gm1']) - int(week['gm2'])) >= 100:
      stats = {}
      stats['week'] = week['week']
      stats['gm1'] = week['gm1']
      stats['gm2'] = week['gm2']
      stats['diff'] = abs(int(week['gm1']) - int(week['gm2']))

      if bowler not in bowlers:
        bowlers[bowler] = []

      bowlers[bowler].append(stats)

for bowler in bowlers:
  # print(bowler)
  print(bowler + " " + str(len(bowlers[bowler])) + " time(s)")
  for week in bowlers[bowler]:
    print("  week " + str(week['week']))
    print("    gm1  " + str(week['gm1']))
    print("    gm2  " + str(week['gm2']))
    print("    diff " + str(week['diff']))
