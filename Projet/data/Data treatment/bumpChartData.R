library(timeDate)
setwd("/home/jean-michel/Documents/École/INF8808/TPs/INF8808-TP/Projet/data/Data treatment")

data <- read.csv("/home/jean-michel/Documents/École/INF8808/TPs/data.csv", stringsAsFactors = FALSE)

data <- data[!(data$Position > 10), ]
data <- data[!(data$Region == "lu"), ] # missing values for "lu"

for (row in 1:nrow(data)) {
  url = unlist(strsplit(as.character(data[row, "URL"]), "/"))
  data[row, "URL"] <- url[length(url)]
}

colnames(data)[which(names(data) == "URL")] <- "songId"
data['firstDayOfMonth'] <- timeFirstDayInMonth(data$Date)

countries = unique(data$Region)
months <- split(unique(data$firstDayOfMonth), seq_along(months))
months <- months[-14]

completeSongRanks = data[0,]
completeSongRanks$firstDayOfMonth = NULL

for (country in countries) {
  dataRegion <- data[(data$Region == country),]
  for (month in months) {
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

completeSongRanks <- na.omit(completeSongRanks)
completeSongRanks <- completeSongRanks[!(completeSongRanks$Month=="2018-01-01"),]
months <- unique(completeSongRanks$Month)

for (country in countries) {
  dataRegion <- completeSongRanks[(completeSongRanks$Region == country),]
  dataRegion2 <- dataRegion
  dataRegion2$Position = NULL
  dataRegion2$Streams = NULL
  dataRegion2$Month = NULL
  dataRegion2 <- unique(dataRegion2)
  for (month in 1:nrow(months)) {
    dataRegionMonth <- dataRegion[(dataRegion$Month == month),]
    dataRegionMonth$Position = NULL
    dataRegionMonth$Streams = NULL
    dataRegionMonth$Month = NULL
    for (row2 in 1:nrow(dataRegion2)) {
      for (row in 1:nrow(dataRegionMonth)) {
        if (dataRegionMonth[row, "songId"] == dataRegion2[row2, "songId"]) {
          songToAdd <- data.frame(dataRegion2[row2, "Track.Name"], dataRegion2[row2, "Artist"], datare, dataRegion2[row2, "songId"], months[month], country)
          names(songToAdd) <- c("Track.Name", "Artist", "Streams", "songId", "Month", "Region", months[1], months[2], months[3], months[4], months[5], months[6], months[7], months[8], months[9], months[10], months[11], months[12])
          break
        }
        if (dataRegionMonth[row, "songId"] == dataRegionMonth[nrow(dataRegionMonth), "songId"]) {
          missingSong <- data.frame(0, dataRegion2[row2, "Track.Name"], dataRegion2[row2, "Artist"], 0, dataRegion2[row2, "songId"], months[month], country)
          names(missingSong) <- c("Position", "Track.Name", "Artist", "Streams", "songId", "Month", "Region")
          completeSongRanks <- rbind(completeSongRanks, missingSong)
          #print(paste("Country : ", country, " Month : ", month, " Song : ", dataRegion2[row2, "Track.Name"]))
        }
      }
      
    }
    #songIdsMonth <- unique(dataRegionMonth$songId)
    #dataRegionMonthSongs <- c(unique(dataRegionMonth$songId))
  }
}

write.csv(completeSongRanks, "bumpChartData.csv", row.names = FALSE)

dates <- as.Date(dates, format = "%Y-%m-%d")
class(dates)
max(dates)
