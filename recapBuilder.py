import json
import constants as c
from os import listdir
import re
from tabulate import tabulate

# We need to reference a lot of local files to figure everything out, start with getting basic team data
with open(c.TEAMS_PATH) as json_teams:
  report_teams = json.load(json_teams)

  # Now lets open the season schedule for reference
  with open(c.SCHEDULE_PATH) as json_scedule:
    report_scedule = json.load(json_scedule)

    # Loop over all the recorded results, these reports hold the scores for each week
    for filename in listdir(c.SUMMARY_PATH):
      
      with open(c.SUMMARY_PATH + "\\" + filename) as json_data:
        report = json.load(json_data)
        week = re.findall(r'\d+', filename)[0]
        recaps = "Reprint of scores for week " + week
        
        # Build the array of arrays for weekly matchups
        weekMatchups = [weekData for weekData in report_scedule['weeks'] if weekData['weekNum'] == int(week)][0]['matchups']
        
        # Loop over each matchup for this week
        for matchup in weekMatchups:
          team1ID = matchup[0]
          team2ID = matchup[1]
          
          results = {
            'teams': [
              {
                'name': list(filter(lambda team: team['TeamNum'] == team1ID, report_teams['Data']))[0]['TeamName'],
                'handicap': 0,
                'scratchseries': 0,
                'handicapseries': 0,
                'bowlers': [
                  {
                    'name': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[0]['BowlerName'],
                    'handicap': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[0]['HandicapBeforeBowling'],
                    'games': [
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[0]['Score1'],
                        'handicap': 0
                      },
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[0]['Score2'],
                        'handicap': 0
                      }
                    ],
                    'scratchseries': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[0]['SeriesTotal'],
                    'handicapseries': 0
                  },
                  {
                    'name': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[1]['BowlerName'],
                    'handicap': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[1]['HandicapBeforeBowling'],
                    'games': [
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[1]['Score1'],
                        'handicap': 0
                      },
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[1]['Score2'],
                        'handicap': 0
                      }
                    ],
                    'scratchseries': list(filter(lambda bowler: bowler['TeamNum'] == team1ID, report['Data']))[1]['SeriesTotal'],
                    'handicapseries': 0
                  }
                ]
              },
              {
                'name': list(filter(lambda team: team['TeamNum'] == team2ID, report_teams['Data']))[0]['TeamName'],
                'handicap': 0,
                'scratchseries': 0,
                'handicapseries': 0,
                'bowlers': [
                  {
                    'name': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[0]['BowlerName'],
                    'handicap': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[0]['HandicapBeforeBowling'],
                    'games': [
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[0]['Score1'],
                        'handicap': 0
                      },
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[0]['Score2'],
                        'handicap': 0
                      }
                    ],
                    'scratchseries': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[0]['SeriesTotal'],
                    'handicapseries': 0
                  },
                  {
                    'name': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[1]['BowlerName'],
                    'handicap': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[1]['HandicapBeforeBowling'],
                    'games': [
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[1]['Score1'],
                        'handicap': 0
                      },
                      {
                        'scratch': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[1]['Score2'],
                        'handicap': 0
                      }
                    ],
                    'scratchseries': list(filter(lambda bowler: bowler['TeamNum'] == team2ID, report['Data']))[1]['SeriesTotal'],
                    'handicapseries': 0
                  }
                ]
              }
            ]
          }
          
          for team in results['teams']:
            teamhandicap = 0
            teamscratchseries = 0
            teamhandicapseries = 0
            for bowler in team['bowlers']:
              handicapseries = 0
              teamhandicap += bowler['handicap']
              for game in bowler['games']:
                game['handicap'] = game['scratch'] + bowler['handicap']
                handicapseries += game['handicap']
                teamscratchseries += game['scratch']
                teamhandicapseries += game['handicap']
              bowler['handicapseries'] = handicapseries
            team['scratchseries'] = teamscratchseries
            team['handicapseries'] = teamhandicapseries
            team['handicap'] = teamhandicap
            
          
          team = results['teams'][0]
          opponent = results['teams'][1]
          
          game1Pts = 0
          game2Pts = 0
          totalPts = 0
          if 0 < (team['bowlers'][0]['games'][0]['handicap'] 
                  + team['bowlers'][1]['games'][0]['handicap'] 
                  - opponent['bowlers'][0]['games'][0]['handicap'] 
                  - opponent['bowlers'][1]['games'][0]['handicap']):
            game1Pts += 1
            
          if 0 == (team['bowlers'][0]['games'][0]['handicap'] 
                   + team['bowlers'][1]['games'][0]['handicap'] 
                   - opponent['bowlers'][0]['games'][0]['handicap'] 
                   - opponent['bowlers'][1]['games'][0]['handicap']):
            game1Pts += 0.5
            
          if 0 < (team['bowlers'][0]['games'][1]['handicap'] 
                  + team['bowlers'][1]['games'][1]['handicap'] 
                  - opponent['bowlers'][0]['games'][1]['handicap'] 
                  - opponent['bowlers'][1]['games'][1]['handicap']):
            game2Pts += 1
            
          if 0 == (team['bowlers'][0]['games'][1]['handicap'] 
                   + team['bowlers'][1]['games'][1]['handicap'] 
                   - opponent['bowlers'][0]['games'][1]['handicap'] 
                   - opponent['bowlers'][1]['games'][1]['handicap']):
            game2Pts += 0.5
            
          if 0 < (team['bowlers'][0]['handicapseries'] 
                  + team['bowlers'][1]['handicapseries'] 
                  - opponent['bowlers'][0]['handicapseries'] 
                  - opponent['bowlers'][1]['handicapseries']):
            totalPts += 1
            
          if 0 == (team['bowlers'][0]['handicapseries'] 
                  + team['bowlers'][1]['handicapseries'] 
                  - opponent['bowlers'][0]['handicapseries'] 
                  - opponent['bowlers'][1]['handicapseries']):
            totalPts += 0.5
          
          headers = ["\n"+team['name'], "Old\nHDCP", "\n-1-", "\n-2-", "\nTotal", "HDCP\nTotal","\n"+opponent['name'], "Old\nHDCP", "\n-1-", "\n-2-", "\nTotal", "HDCP\nTotal"]
          data = [
            [
              team['bowlers'][0]['name'],
              team['bowlers'][0]['handicap'],
              team['bowlers'][0]['games'][0]['scratch'],
              team['bowlers'][0]['games'][1]['scratch'],
              team['bowlers'][0]['scratchseries'],
              team['bowlers'][0]['handicapseries'],
              opponent['bowlers'][0]['name'],
              opponent['bowlers'][0]['handicap'],
              opponent['bowlers'][0]['games'][0]['scratch'],
              opponent['bowlers'][0]['games'][1]['scratch'],
              opponent['bowlers'][0]['scratchseries'],
              opponent['bowlers'][0]['handicapseries']
            ],
            [
              team['bowlers'][1]['name'],
              team['bowlers'][1]['handicap'],
              team['bowlers'][1]['games'][0]['scratch'],
              team['bowlers'][1]['games'][1]['scratch'],
              team['bowlers'][1]['scratchseries'],
              team['bowlers'][1]['handicapseries'],
              opponent['bowlers'][1]['name'],
              opponent['bowlers'][1]['handicap'],
              opponent['bowlers'][1]['games'][0]['scratch'],
              opponent['bowlers'][1]['games'][1]['scratch'],
              opponent['bowlers'][1]['scratchseries'],
              opponent['bowlers'][1]['handicapseries']
            ],
            [
              "",
              "",
              "====",
              "====",
              "====",
              "====",
              "",
              "",
              "====",
              "====",
              "====",
              "===="
            ],
            [
              "Scratch Total",
              "",
              team['bowlers'][0]['games'][0]['scratch'] + team['bowlers'][1]['games'][0]['scratch'],
              team['bowlers'][0]['games'][1]['scratch'] + team['bowlers'][1]['games'][1]['scratch'],
              team['scratchseries'],
              team['scratchseries'],
              "Scratch Total",
              "",
              opponent['bowlers'][0]['games'][0]['scratch'] + opponent['bowlers'][1]['games'][0]['scratch'],
              opponent['bowlers'][0]['games'][1]['scratch'] + opponent['bowlers'][1]['games'][1]['scratch'],
              opponent['scratchseries'],
              opponent['scratchseries']
            ],
            [
              "Handicap",
              "",
              team['bowlers'][0]['handicap'] + team['bowlers'][1]['handicap'],
              team['bowlers'][0]['handicap'] + team['bowlers'][1]['handicap'],
              "",
              (team['bowlers'][0]['handicap'] + team['bowlers'][1]['handicap']) * 2,
              "Handicap",
              "",
              opponent['bowlers'][0]['handicap'] + opponent['bowlers'][1]['handicap'],
              opponent['bowlers'][0]['handicap'] + opponent['bowlers'][1]['handicap'],
              "",
              (opponent['bowlers'][0]['handicap'] + opponent['bowlers'][1]['handicap']) * 2
            ],
            [
              "Total",
              "",
              team['bowlers'][0]['games'][0]['handicap'] + team['bowlers'][1]['games'][0]['handicap'],
              team['bowlers'][0]['games'][1]['handicap'] + team['bowlers'][1]['games'][1]['handicap'],
              team['scratchseries'],
              team['handicapseries'],
              "Total",
              "",
              opponent['bowlers'][0]['games'][0]['handicap'] + opponent['bowlers'][1]['games'][0]['handicap'],
              opponent['bowlers'][0]['games'][1]['handicap'] + opponent['bowlers'][1]['games'][1]['handicap'],
              opponent['scratchseries'],
              opponent['handicapseries']
            ],
            [
              "Team Points Won",
              "",
              game1Pts,
              game2Pts,
              totalPts,
              game1Pts + game2Pts + totalPts,
              "Team Points Won",
              "",
              1 - game1Pts,
              1 - game2Pts,
              1 - totalPts,
              3 - game1Pts - game2Pts - totalPts
            ]
          ]
            
          recaps += "\n\n\n\n" + tabulate(data, headers=headers)
          
      # Write the recaps out to file for safe keeping
      fd = open(c.RECAPS_PATH + "\\" + filename.replace(".json", ".txt"), "w")
      fd.write(recaps)
      fd.close()
          
          
          