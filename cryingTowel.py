import lxml
from lxml import html
import requests
import json
from datetime import datetime
import constants as c

with open(c.REPORT_PATH) as json_data:
  report = json.load(json_data)

# -------------- Sort weekly averages for every bowler -------------- #

for bowler in report:
  report[bowler]['weeks'] = sorted(report[bowler]['weeks'], key=lambda v: v['week'])

# -------------- Figure out weekly averages for every bowler -------------- #

for bowler in report:
  url = report[bowler]['link']
  page = requests.get(url)
  tree = html.fromstring(page.content)

  weeks = tree.xpath('//table/tbody/tr/td[1]/text()')
  before = tree.xpath('//table/tbody/tr/td[8]/text()')
  after = tree.xpath('//table/tbody/tr/td[9]/text()')

  print("Figuring averages for", bowler)

  for week in report[bowler]['weeks']:
    index = weeks.index(lxml.etree._ElementUnicodeResult(week['week']))
    week['aveBefore'] = before[index]
    week['aveAfter'] = after[index]
    week['changeInAve'] = int(after[index]) - int(before[index])

# -------------- Find the larget drop in averages -------------- #

men = {'name': '', 'drop': 300}
women = {'name': '', 'drop': 300}
unknown = []
all = []

for bowler in report:
    data = {'name': bowler, 'drop': 300}

    if len(report[bowler]['weeks']) <= 1:
      data['drop'] = 0

    if 'mw' not in report[bowler]:
      data['mw'] = 'U'
      if len(report[bowler]['weeks']) > 1:
        for week in report[bowler]['weeks']:
          if 'changeInAve' in week:
            if week['changeInAve'] < data['drop']:
              data['drop'] = week['changeInAve']
        unknown.append(data)

    elif report[bowler]['mw'] == 'M':
      data['mw'] = 'M'
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < data['drop']:
            data['drop'] = week['changeInAve']
          if week['changeInAve'] < men['drop']:
            men['drop'] = week['changeInAve']
            men['name'] = bowler

    elif report[bowler]['mw'] == 'W':
      data['mw'] = 'W'
      for week in report[bowler]['weeks']:
        if 'changeInAve' in week:
          if week['changeInAve'] < data['drop']:
            data['drop'] = week['changeInAve']
          if week['changeInAve'] < women['drop']:
            women['drop'] = week['changeInAve']
            women['name'] = bowler

    all.append(data)

print(json.dumps(men))
print(json.dumps(women))
print(json.dumps(unknown))

fd = open(c.DATA_FOLDER + "report-cryData.json", "w")
fd.write(json.dumps(report))
fd.close()

fd = open(c.DATA_FOLDER + "cryingTowel.json", "w")
fd.write(json.dumps(all))
fd.close()
