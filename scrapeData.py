from lxml import html
import requests
import pandas as pd
import json
from datetime import datetime

errorLog = open("error.log", "a")

# -------------- Get Bowler List -------------- #

bowlerList = {}

for page in range(1,6):
  url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2023-2024/bowler-list/2023/fall/12/130603/' + str(page)
  page = requests.get(url)
  tree = html.fromstring(page.content)

  try:
    bowlers = tree.xpath('//table/tbody/tr/td[1]/a/text()')
    hsg = tree.xpath('//table/tbody/tr/td[10]/text()')
    hss = tree.xpath('//table/tbody/tr/td[11]/text()')

  except:
    print("Invalid URL: " + url)
    errorLog.write(str(datetime.now()) + " Invalid URL: " + url +"\n")
    errorLog.write("  page = " + str(page) + "\n")

  else:
    for bowler in range(0, len(bowlers)):
      name = bowlers[bowler].split(", ")[1] + " " + bowlers[bowler].split(", ")[0]
      stats = {}
      stats['hsg'] = hsg[bowler]
      stats['hss'] = hss[bowler]
      stats['weeks'] = []
      bowlerList[name] = stats

# -------------- Get Scoring Against Team and weelky scores -------------- #

for week in range(1,13):
  for uid in range(1,31):
    url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2023-2024/team/recap-sheet/first-team/2023/fall/' + str(week) + '/130603/' + str(uid)
    page = requests.get(url)
    tree = html.fromstring(page.content)

    try:
      team = tree.xpath('//div[@class="panel-body"]/h3/text()')[1].split("Team: ")[1]

    except:
      print("Invalid URL: " + url)
      errorLog.write(str(datetime.now()) + " Invalid URL: " + url +"\n")
      errorLog.write("  week = " + str(week) + "\n")
      errorLog.write("  uid = " + str(uid) + "\n")

    else:
      for bowlerIndex in range(0,2):
        try:
          bowler = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[2]/a/text()')[bowlerIndex]
          avg = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[4]/text()')[bowlerIndex]
          hcp = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[5]/text()')[bowlerIndex]
          gm1 = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[6]/text()')[bowlerIndex]
          gm2 = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[7]/text()')[bowlerIndex]
          ss = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[8]/text()')[bowlerIndex]
          hs = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[9]/text()')[bowlerIndex]
          total = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[10]/text()')[bowlerIndex]

        except:
          print("Invalid Bowler Index: " + url)
          errorLog.write(str(datetime.now()) + " Invalid Bowler Index: " + url +"\n")
          errorLog.write("  week = " + str(week) + "\n")
          errorLog.write("  uid = " + str(uid) + "\n")
          errorLog.write("  bowlerIndex = " + str(bowlerIndex) + "\n")

        else:
          print([week, bowler, gm1, gm2, ss])
          weekStats = {}
          weekStats['week'] = week
          weekStats['avg'] = avg
          weekStats['hcp'] = hcp
          weekStats['gm1'] = gm1
          weekStats['gm2'] = gm2
          weekStats['ss'] = ss
          weekStats['hs'] = hs
          weekStats['total'] = total
          weekStats['against'] = team

          bowlerList[bowler]['weeks'].append(weekStats)

          if (bowlerList[bowler]['hsg'] == gm1 or bowlerList[bowler]['hsg'] == gm2):
            bowlerList[bowler]['hsgTeam'] = team

          if (bowlerList[bowler]['hss'] == ss):
            bowlerList[bowler]['hssTeam'] = team

errorLog.close()
fd = open("2023-2024/report.json", "w")
fd.write(json.dumps(bowlerList))
fd.close()
