library(sqldf)
library(stringr)
data <- read.csv("~/Downloads/12_months_transpose.csv")
data2 <- sqldf("select * from data where cluster not in (' ','','New Players','Quitters','Month Break')")
data2$double <- paste(data2$cluster,data2$month,sep='/')
sqldf("select month,cluster,count(distinct player) from data2 group by month, cluster")
d <- unique(data2$double)
i=1
ctab <- mat.or.vec(nr=89,nc=89)
ctab <- cbind(d,ctab)
colnames(ctab) <- c(1,d)
ctab[1,]

apply(ctab[1:89,2:90],2,

i=2
library(plyr)
##Takes about a half hour to run this.
pb <- txtProgressBar(min=2,max=90,style=3)
for (j in 1:89){
  for (i in 2:90){   
    ctab[j,i] <- sqldf(paste("select count(distinct player) from data2 where cluster= '",
             str_split(colnames(ctab)[i],'/')[[1]][1],"' and month= '",
             str_split(colnames(ctab)[i],'/')[[1]][2],"'
             and player in
           (select distinct player from data2 where cluster='",
             str_split(ctab[j,1],'/')[[1]][1],"' and month= '",
             str_split(ctab[j,1],'/')[[1]][2],"')",sep=""))[[1]]
  }
  setTxtProgressBar(pb, j)
}

write.csv(ctab,'clusterclicks.csv')

rolledout<-data.frame(clicked=character(),
                      monthclust=character(),
                      value=integer(),
                      stringsAsFactors=FALSE)
rolledout<-0
for (j in 1:89){
  for (i in 3:91){ 
    clicked <- as.character(clusterclicks[j,2])
    monthclust <- colnames(clusterclicks)[i]
    value <- clusterclicks[j,i]
    rolledout <- rbind(rolledout,c(clicked,monthclust,value[[1]]))
  }
}
rolledout <- rolledout[2:nrow(rolledout),]
colnames(rolledout)<-c("clicked","monthclust","value")
write.csv(rolledout,'clusterclicks2.csv',row.names=FALSE)

library(reshape2)
data  <- read.csv("~/clusterclicks2.csv")
splits <- colsplit(data$monthclust,"/",c("cluster","month"))
newdata <- cbind(data[1],splits[1],splits[2],data[3])
tobefilled <- as.data.frame(mat.or.vec(nr=1246,nc=13))
colnames(tobefilled) <- c("clicked","month")

clicks <- unique(newdata[1])
list=0
      
tester <- as.list(rep(clicks,14))
t2 <- as.data.frame(tester)
t3 <- as.data.frame(as.list(t(t2)))
t4 <- as.data.frame(t(t3))
tobefilled[1] <- t4[1]
      
months <- unique(newdata[3])
m2 <- as.list(rep(months,times=89))
m3 <- as.data.frame(as.list(m2))
m4 <- as.data.frame(as.list(t(t(m3))))
m5 <- t(m4)
tobefilled[2] <- m5[,1]

library(sqldf)
for (i in 1:nrow(tobefilled)){
    for (k in 3:13){
      print(k)
      tobefilled[i,k] <- ifelse(length(newdata[newdata$clicked==tobefilled$clicked[i] & 
                                      newdata$month==tobefilled$month[i] & 
                                      newdata$cluster==names(tobefilled[k]),4])==0,0,newdata[newdata$clicked==tobefilled$clicked[i] & 
                                                                                               newdata$month==tobefilled$month[i] & 
                                                                                               newdata$cluster==names(tobefilled[k]),4])
    }
}
      
write.csv(tobefilled,"clustclicked.csv",row.names=FALSE)