from lxml import html
import requests
import json
from datetime import datetime
import constants as c

errorLog = open("error.log", "w")

# -------------- Get Bowler List -------------- #

bowlerList = {}

for page in range(1,6):
  url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2023-2024/bowler-list/2023/fall/12/130603/' + str(page)
  page = requests.get(url)
  tree = html.fromstring(page.content)

  try:
    bowlers = tree.xpath('//table/tbody/tr/td[1]/a/text()')
    links = tree.xpath('//table/tbody/tr/td[1]/a/@href')
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
      stats['link'] = 'https://www.leaguesecretary.com/' + links[bowler]
      stats['weeks'] = []
      bowlerList[name] = stats

# -------------- Get Scoring Against Team and weelky scores -------------- #

for week in range(1,13):
  for uid in range(1,31):
    url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2023-2024/team/recap-sheet/first-team/2023/fall/' + str(week) + '/130603/' + str(uid)
    page = requests.get(url)
    tree = html.fromstring(page.content)

    try:
      team = tree.xpath('//div[@class="panel-body"]/h3/text()')[0].split("Team: ")[1]
      against = tree.xpath('//div[@class="panel-body"]/h3/text()')[1].split("Team: ")[1]

    except:
      print("Invalid URL: " + url)
      errorLog.write(str(datetime.now()) + " Invalid URL: " + url +"\n")
      errorLog.write("  week = " + str(week) + "\n")
      errorLog.write("  uid = " + str(uid) + "\n")

    else:
      for bowlerIndex in range(0,2):
        try:
          bowler = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[2]/a/text()')[bowlerIndex]
          mw = tree.xpath('//table[@id="ctl00_MainContent_ctl02_RadGrid1_ctl00"]/tbody/tr/td[3]/text()')[bowlerIndex]
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
          weekStats['against'] = against

          bowlerList[bowler]['mw'] = mw
          bowlerList[bowler]['weeks'].append(weekStats)
          
          bowlerList[bowler]['team'] = team

          if (bowlerList[bowler]['hsg'] == gm1 or bowlerList[bowler]['hsg'] == gm2):
            bowlerList[bowler]['hsgTeam'] = against

          if (bowlerList[bowler]['hss'] == ss):
            bowlerList[bowler]['hssTeam'] = against

# -------------- Fill in missing bowler data -------------- #

for bowler in bowlerList:
  try:
    if len(bowlerList[bowler]['weeks']) == 0:
      print("Filling some missing data for " + bowler)
      page = requests.get(bowlerList[bowler]['link'])
      tree = html.fromstring(page.content)
      
      data = tree.xpath('//table/tbody/tr/td/text()')
      team = tree.xpath('//span[@id="MainContent_BowlerHistoryGrid1_Note1"]/a/text()')[0]
      
      if (len(tree.xpath('//span[@id="MainContent_BowlerHistoryGrid1_Note1"]/a/text()')) == 2):
        bowlerList[bowler]['team'] = team
      
      for index in range(0,int(len(data)/17)):
        weekStats = {}
        weekStats['week'] = int(data[index * 17 + 0])
        weekStats['avg'] = data[index * 17 + 7]
        weekStats['hcp'] = str(int(int(data[index * 17 + 5]) / 2))
        weekStats['gm1'] = data[index * 17 + 2]
        weekStats['gm2'] = data[index * 17 + 3]
        weekStats['ss'] = data[index * 17 + 4]
        weekStats['hs'] = data[index * 17 + 5]
        weekStats['total'] = data[index * 17 + 6]
        
        bowlerList[bowler]['weeks'].append(weekStats)
        
  except Exception as e:
    print("We had a problem filling out extra data for " + str(bowler))
    errorLog.write(str(datetime.now()) + " bowler = " + str(bowler) + ": " + str(e) +"\n")

errorLog.close()
fd = open(c.REPORT_PATH, "w")
fd.write(json.dumps(bowlerList))
fd.close()
