import json
import constants as c
from os import listdir
import re

bowlers = {}

for filename in listdir(c.SUMMARY_PATH):
  with open(c.SUMMARY_PATH + "/" + filename) as json_data:
    report = json.load(json_data)
    
    for bowler in report["Data"]:
      if abs(int(bowler['Score1']) - int(bowler['Score2'])) >= 100:
        name = bowler["BowlerName"]
        
        stats = {}
        stats['week'] = re.findall(r'\d+', filename)[0]
        stats['gm1'] = bowler['Score1']
        stats['gm2'] = bowler['Score2']
        stats['diff'] = abs(int(bowler['Score1']) - int(bowler['Score2']))

        if name not in bowlers:
          bowlers[name] = []

        bowlers[name].append(stats)

for bowler in bowlers:
  # print(bowler)
  print(bowler + " " + str(len(bowlers[bowler])) + " time(s)")
  for week in bowlers[bowler]:
    print("  week " + str(week['week']))
    print("    gm1  " + str(week['gm1']))
    print("    gm2  " + str(week['gm2']))
    print("    diff " + str(week['diff']))


fd = open(c.DATA_FOLDER + "centuries.json", "w")
fd.write(json.dumps(bowlers, indent=2))
fd.close()
