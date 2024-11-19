import requests
import json
from datetime import datetime
import constants as c
from os import listdir

with open(c.SCHEDULE_PATH) as json_data:
  schedule = json.load(json_data)

downloaded = listdir(c.SUMMARY_PATH)
  
for week in schedule["weeks"]:
  date = datetime.strptime(week["date"], '%m/%d/%Y')
  if date < datetime.now():
    filename = "week" + str(week["weekNum"]) + ".json"
    if not filename in downloaded:
      print("Retrieving data for " + filename)
    
      postData = {
        "leagueId": c.leagueId,
        "year": c.year,
        "season": c.season,
        "weekNum": week["weekNum"]
      }
      
      request = requests.post(c.Summary_Read, postData)
      
      if request.json()['Total'] == 0:
        print("Results for week " + str(week["weekNum"]) + " have not been published")
      
      else:
        fd = open(c.SUMMARY_PATH + "/" + filename, "w")
        fd.write(json.dumps(request.json(), indent=2))
        fd.close()
