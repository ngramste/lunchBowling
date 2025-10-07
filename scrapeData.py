import requests
import json
from datetime import datetime
import constants as c
from os import listdir

data_folder = listdir(c.DATA_FOLDER)

if c.TEAMS_FILENAME not in data_folder:
  print("Teams file not found, retrieving data...")
    
  # Build the post request for the secret league secretary API call
  postData = {
    "leagueId": c.leagueId,
    "year": c.year,
    "season": c.season,
    "weekNum": 1
  }
  
  # Get that juicy juicy data!
  request = requests.post(c.Team_List_Read, postData)
  
  fd = open(c.TEAMS_PATH, "w")
  fd.write(json.dumps(request.json(), indent=2))
  fd.close()
  
# Scrape bowler list
# Build the post request for the secret league secretary API call
postData = {
  "leagueId": c.leagueId,
  "year": c.year,
  "season": c.season,
  "weekNum": 1
}
  
# Get that juicy juicy data!
request = requests.post(c.Player_List_Read, postData)

fd = open(c.PLAYERS_PATH, "w")
fd.write(json.dumps(request.json(), indent=2))
fd.close()

# Open the schedule, we will use this to see what weeks might have data to scrape
with open(c.SCHEDULE_PATH) as json_data:
  schedule = json.load(json_data)

# Get a list of files which represent weeks we previously scraped for
downloaded = listdir(c.SUMMARY_PATH)
  
# Loop over all the weeks in the schedule
for week in schedule["weeks"]:
  # If the week in question happend today or in the past, we will try to scrape it
  date = datetime.strptime(week["date"], '%m/%d/%Y')
  if date < datetime.now():
    filename = "week" + str(week["weekNum"]) + ".json"
    
    # Before scraping, make sure we don't already have the file downloaded
    if not filename in downloaded:
      print("Retrieving data for " + filename)
    
      # Build the post request for the secret league secretary API call
      postData = {
        "leagueId": c.leagueId,
        "year": c.year,
        "season": c.season,
        "weekNum": week["weekNum"]
      }
      
      # Get that juicy juicy data!
      request = requests.post(c.Summary_Read, postData)
      
      # If the results are empty, Leauge Secretary doesn't have the results yet
      if request.json()['Total'] == 0:
        print("Results for week " + str(week["weekNum"]) + " have not been published")
      
      # If there is data, write it to a file
      else:
        fd = open(c.SUMMARY_PATH + "/" + filename, "w")
        fd.write(json.dumps(request.json(), indent=2))
        fd.close()
