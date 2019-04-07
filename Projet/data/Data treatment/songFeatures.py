from collections import namedtuple
header = "Position,Track_Name,Artist,Streams,Id,Date,Region,danceability,energy,key,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo,duration_ms\n"
Entry = namedtuple("Entry", header)

new_header = "name,nTracks,danceability,energy,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo\n"
Artist = namedtuple("Artist", new_header)

with open("completeDataset.csv", "r", encoding="cp819", errors ='replace') as file:
	# get rid of header
	file.read(len(header))
	
	songs = {}
	artists = {}
	
	# treatment of the data
	for line in file:
		
		content = line.split(",")
		
		try:
			song = Entry( *content )
			
			if song not in songs:
				songs[song.Id] = song
		except:
			# chinese songs can be shunned without fear :P
			pass
			#print(content)
			
	songs = songs.values()
	
	for song in songs:
		if song.Artist not in artists:
			artists[song.Artist] = Artist(	song.Artist,
														1,
														float(song.danceability),
														float(song.energy),
														-float(song.loudness),
														float(song.speechiness),
														float(song.acousticness),
														float(song.instrumentalness),
														float(song.liveness),
														float(song.valence),
														float(song.tempo))
		else:
			artist = artists[song.Artist]
			artists[song.Artist] = Artist(	artist.name,
														artist.nTracks+1,
														artist.danceability+float(song.danceability),
														artist.energy+float(song.energy),
														artist.loudness-float(song.loudness),
														artist.speechiness+float(song.speechiness),
														artist.acousticness+float(song.acousticness),
														artist.instrumentalness+float(song.instrumentalness),
														artist.liveness+float(song.liveness),
														artist.valence+float(song.valence),
														artist.tempo+float(song.tempo))
	
	artists = artists.values()
	
	with open('artists.csv','wb') as out:
		out.write(new_header.encode("cp819"))
		for row in artists:
			for el in row:
				out.write( (str(el)+", ").encode("cp819") )
			out.write("\n".encode("cp819"))
