library(timeDate)
setwd("/home/jean-michel/Documents/École/INF8808/TPs/INF8808-TP/Projet/data/Data treatment")

data <- read.csv("/home/jean-michel/Documents/École/INF8808/TPs/data.csv", stringsAsFactors = FALSE)

data <- data[!(data$Position > 10), ]
data <- data[!(data$Region == "lu"), ] # missing values for "lu"
data <- data[!(data$Date == "2018-01-01"), ] # missing values for "lu"

for (row in 1:nrow(data)) {
  url = unlist(strsplit(as.character(data[row, "URL"]), "/"))
  data[row, "URL"] <- url[length(url)]
}

colnames(data)[which(names(data) == "URL")] <- "songId"
data['firstDayOfMonth'] <- timeFirstDayInMonth(data$Date)

countries = unique(data$Region)
months <- split(unique(data$firstDayOfMonth), seq_along(months))
months <- months[-14]
months <- months[1:12]

completeSongRanks = data[0,]
completeSongRanks$firstDayOfMonth = NULL

# get top 10 songs by month by country
for (country in countries) {
  dataRegion <- data[(data$Region == country),]
  for (month in months) {
    print(month)
    dataRegionMonth <- dataRegion[(dataRegion$firstDayOfMonth == month),]
    songIds <- unique(dataRegionMonth$songId)
    songRanks = data[0,]
    songRanks$firstDayOfMonth = NULL
    colnames(songRanks)[which(names(songRanks) == "Date")] <- "Month"
    for (song in songIds) {
      dataRegionMonthSong <- dataRegionMonth[(dataRegionMonth$songId == song),]
      songRanks[nrow(songRanks) + 1,] = list(sum((11-dataRegionMonthSong$Position)), dataRegionMonthSong[1,"Track.Name"], dataRegionMonthSong[1,"Artist"], sum(dataRegionMonthSong$Streams), song, as.character(month), country)
      #print(paste("Country: ", country, "Month: ", month, "Song: ", song, "Avg rank: ", sum(dataRegionMonthSong$Position)))
    }
    songRanks <- songRanks[order(-songRanks$Position),]
    songRanks <- songRanks[1:10, ]   
    for (i in 1:10) {
      songRanks[i,"Position"] = i
    }
    completeSongRanks <- rbind(completeSongRanks, songRanks)
  }
}


# add song not in top 10 for every months by country
for (country in countries) {
  
  dataRegion <- completeSongRanks[(completeSongRanks$Region == country),]
  dataRegionSongs <- dataRegion[!duplicated(dataRegion$songId), ]
  dataRegionSongs$Month = NULL
  dataRegionSongs$Position = NULL
  dataRegionSongs$Streams = NULL
  for (m in months) {
    #print(toString(m))
    dataRegionSongs[toString(m)] = c("")
  }
  #completeDataRegion <- dataRegionSongs[0,]
  for (month in months) {
    dataRegionMonth <- dataRegion[(dataRegion$Month == toString(month)),]
    for (song in 1:nrow(dataRegionSongs)) {
      for (row in 1:nrow(dataRegionMonth)) {
        if (dataRegionSongs[song,]$songId == dataRegionMonth[row, "songId"]) {
          dataRegionSongs[song,toString(month)] = dataRegionMonth[row,"Position"]
          break
        }
      }
    }
  }
  if (country == countries[1]){
    formattedCompleteSongRanks <- dataRegionSongs
  } else {
    formattedCompleteSongRanks <- rbind(formattedCompleteSongRanks, dataRegionSongs)
  }
}
write.csv(formattedCompleteSongRanks, paste("bumpChartData_test.csv", sep=""), row.names = FALSE)

# # add song not in top 10 for every months by country
# for (country in countries) {
#   dataRegion <- completeSongRanks[(completeSongRanks$Region == country),]
#   dataRegionSongs <- dataRegion
#   dataRegionSongs <- dataRegionSongs[!duplicated(dataRegionSongs$songId), ]
#   completeDataRegion <- dataRegion[0,]
#   for (month in months) {
#     dataRegionMonth <- dataRegion[(dataRegion$Month == month),]
#     dataRegionMonthTemp <- dataRegionMonth
#     for (song in 1:nrow(dataRegionSongs)) {
#       for (row in 1:nrow(dataRegionMonth)) {
#         if (dataRegionSongs[song,]$songId == dataRegionMonth[row, "songId"]) {
#           break
#         }
#         if (row == nrow(dataRegionMonth)) {
#           
#           newRow <- dataRegionSongs[song,]
#           newRow[1, "Position"] = 11
#           newRow[1, "Month"] = month
#           newRow[1, "Streams"] = 0
#           dataRegionMonthTemp <- rbind(dataRegionMonthTemp, newRow)
#         }
#       }
#     }
#     completeDataRegion <- rbind(completeDataRegion, dataRegionMonthTemp)
#   }
#   write.csv(completeDataRegion, paste("bumpChartData_", country, ".csv", sep=""), row.names = FALSE)
# }

write.csv(completeSongRanks, "bumpChartData.csv", row.names = FALSE)

dates <- as.Date(dates, format = "%Y-%m-%d")
class(dates)
max(dates)
