import json
import constants as c
from os import listdir
import re

print(c.SUMMARY_PATH + "\\" + "week0.json")
with open(c.SUMMARY_PATH + "\\" + "week0.json") as json_data:
  report = json.load(json_data)
  
  for index, bowler in enumerate(report["Data"]):
    if bowler['HandicapBeforeBowling'] != -1:
      print("" + str(index) + ", " + bowler['BowlerName'])
      report["Data"][index]['HandicapSeriesTotal'] = bowler['SeriesTotal'] + bowler['HandicapBeforeBowling'] + bowler['HandicapBeforeBowling']
      report["Data"][index]['PlusMinusAverage'] = int(bowler['SeriesTotal']/2) - bowler['AverageBeforeBowling']
      
  
  fd = open(c.SUMMARY_PATH + "\\" + "week0.json.new", "w")
  fd.write(json.dumps(report)) 
  fd.close()