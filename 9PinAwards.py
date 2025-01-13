import json
import csv
import constants as c
from os import listdir
import re

bowlers = {}

for filename in listdir(c.SUMMARY_PATH):
  with open(c.SUMMARY_PATH + "/" + filename) as json_data:
    # Make calculations on weeks leading up to 9 pin only
    if c.NINE_PIN_WEEK > int(re.findall(r'\d+', filename)[0]):
      report = json.load(json_data)
      
      for bowler in report["Data"]:
        name = bowler["BowlerName"]

        if name not in bowlers:
          bowlers[name] = {
            'name': "",
            'totalPins': 0,
            'games': 0,
            'average': 0,
            'handicap': 0,
            'game1': 0,
            'game2': 0,
            'series': 0,
            'ninePinHandicapSeries': 0
          }

        bowlers[name]['totalPins'] = bowlers[name]['totalPins'] + bowler['Score1'] + bowler['Score2']
        bowlers[name]['games'] = bowlers[name]['games'] + 2
        bowlers[name]['average'] = int(bowlers[name]['totalPins'] / bowlers[name]['games'])
        bowlers[name]['handicap'] = int((220 - bowlers[name]['average']) * 0.9)
        
# Calculate nine pin scores
with open(c.DATA_FOLDER + "/9pin.csv") as csv_data:
  report = csv_read=csv.reader(csv_data, delimiter=';')

  # Loop over all of the results
  for row in report:
    name = row[1].strip()
    series = row[4]
    
    # print(name)
    
    if name in bowlers and series != 0:
      bowlers[name]['series'] = int(series)
      bowlers[name]['game1'] = int(row[2])
      bowlers[name]['game2'] = int(row[3])
      bowlers[name]['ninePinHandicapSeries'] = int(series) + (bowlers[name]['handicap'] * 2)
      bowlers[name]['name'] = row[0]
    else:
      print("Could not find ", name)

# Remove bowlers who haven't bowled at least a minimum number of games
trimmedBowlers = {}
for bowler in bowlers:
  if bowlers[bowler]['games'] > 2 and bowlers[bowler]['ninePinHandicapSeries'] != 0:
    trimmedBowlers[bowler] = bowlers[bowler]

# Sort the list of bowlers by average
sortedBowlers = dict(sorted(trimmedBowlers.items(), key=lambda item: item[1]['average'], reverse = True))

topHalf = {}
bottomHalf = {}

# Split into two groups of bowlers
for index, bowler in enumerate(sortedBowlers):
  if index < len(sortedBowlers) / 2:
    topHalf[bowler] = sortedBowlers[bowler]
  else:
    bottomHalf[bowler] = sortedBowlers[bowler]

sortedTop = dict(sorted(topHalf.items(), key=lambda item: item[1]['ninePinHandicapSeries'], reverse = True))
sortedBottom = dict(sorted(bottomHalf.items(), key=lambda item: item[1]['ninePinHandicapSeries'], reverse = True))

print("Bowler, Average, Game 1, Game 2, Handicap, Handicap Series")
for bowler in sortedTop:
  print(sortedTop[bowler]['name'] + ",", 
        str(sortedTop[bowler]['average']) + ",", 
        str(sortedTop[bowler]['game1']) + ",",
        str(sortedTop[bowler]['game2']) + ",",
        str(sortedTop[bowler]['handicap']) + ",",
        str(sortedTop[bowler]['ninePinHandicapSeries']))
  
print("\nBowler, Average, Game 1, Game 2, Handicap, Handicap Series")
for bowler in sortedBottom:
  print(sortedBottom[bowler]['name'] + ",", 
        str(sortedBottom[bowler]['average']) + ",", 
        str(sortedBottom[bowler]['game1']) + ",",
        str(sortedBottom[bowler]['game2']) + ",",
        str(sortedBottom[bowler]['handicap']) + ",",
        str(sortedBottom[bowler]['ninePinHandicapSeries']))

# print(json.dumps(sortedTop))