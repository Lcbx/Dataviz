from collections import namedtuple
header = "Position,Track_Name,Artist,Streams,Id,Date,Region,danceability,energy,key,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo,duration_ms\n"
Entry = namedtuple("Entry", header)

with open("completeDataset.csv", "r", encoding="cp819", errors ='replace') as file:
	# get rid of header
	file.read(len(header))
	
	songList = {}
	
	# treatment of the data
	for line in file:
		
		content = line.split(",")
		
		try:
			song = Entry( *content )
			if song.Id not in songList:
				songList[song.Id] = content
		except:
			# chinese songs can be shunned without fear
			pass
			#print(content)
	
	#print(songList)