setwd("/home/jean-michel/Documents/École/INF8808/TPs/INF8808-TP/Projet/data/Data treatment")

data <- read.csv("/home/jean-michel/Documents/École/INF8808/TPs/data.csv", stringsAsFactors = FALSE)

data <- data[!(data$Position > 10), ]

for (row in 1:nrow(data)) {
  url = unlist(strsplit(as.character(data[row, "URL"]), "/"))
  data[row, "URL"] <- url[length(url)]
}

colnames(data)[which(names(data) == "URL")] <- "Id"

write.csv(data, "dataTop10.csv", row.names = FALSE)

URLs <- data$URL
UniqueURLs <- unique(URLs)
ids <- vector('character')
pos = 1
for(d in UniqueURLs){
  j = unlist(strsplit(as.character(d), "/"))
  j = j[length(j)]
  if(length(j)>0){
    ids[pos] <- j
  }
  pos = pos + 1
}

write.csv(ids, "SongIds.csv", row.names = FALSE)

for(row in 1:nrow(data)){
  d = unlist(strsplit(as.character(data[row, "URL"]), "/"))
  data[row, "URL"] = d[length(d)]
  #print(d[length(d)])
}
