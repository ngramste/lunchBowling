import pandas as pd

df = pd.read_csv('C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\bowlers.csv')

for index, row in df.iterrows():
    name = row['firstName'] + " " + row['lastName']
    fileName = 'C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\bowlers\\' + row['firstName'] + row['lastName'] + '.csv'
    url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2022-2023/bowler-info/'+row['firstName']+'-'+row['lastName']+'/2023/winter/130603/'+str(row['uid'])

    print(url)
    df = pd.read_html(url, match=name)
    df[0].to_csv(fileName, sep=',')


df = pd.read_csv('C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\teams.csv')

for index, row in df.iterrows():
    name = str(row['team']).replace(" ", "-")
    fileName = 'C:\\RW_APPS\\git\\lunchBowling\\2022-2023\\data\\teams\\' + name + '.csv'
    url = 'https://www.leaguesecretary.com/bowling-centers/cedar-rapids-bowl-cedar-rapids-iowa/bowling-leagues/lunch-league-2022-2023/team/history/'+name+'/2023/Winter/130603/'+str(row['uid'])

    print(url)
    df = pd.read_html(url, match=name.replace("-", " "))
    df[0].to_csv(fileName, sep=',')
