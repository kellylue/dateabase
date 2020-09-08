class Date {
    constructor(dateArr) {
        this.activity = dateArr[0];
        this.description = dateArr[1];
        this.location = dateArr[2];
        this.planningBy = dateArr[3];
        this.ranking = [dateArr[4], dateArr[5]];
        this.rankingAvg = dateArr[6];
        this.pandemicRank = dateArr[7];
        this.cost = dateArr[8];
        this.duration = dateArr[9];
        this.timesDone = dateArr[10];
        this.contributed = dateArr[11];
        this.comments = dateArr[12]
    }
}

module.exports = Date;