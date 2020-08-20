const { google } = require('googleapis')
const keys = require('./Keys.json')     //the keys to access the api

//sheets ID for this google sheets
const NODE_SHEETS_TEST = '1miz6FabnPYH4IL67V3yCD5oUQtMV4X78Sn5XbOyPHxc'

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

//start the client, check for errors
//if no errors, run
client.authorize(function (err, tokens) {
    if (err) {
        console.log(err)
        return
    }
    else {
        console.log('Connected!')
        gsrun(client)
    }

});

//The main function being run
async function gsrun(cl) {
    const gsapi = google.sheets({ version: 'v4', auth: cl });

    //get columns A through M
    let sheetData = await getSheetRangeArr(gsapi, NODE_SHEETS_TEST, 'Sheet1!A:M')

    // console.log(sheetData)
    let dates = loadDates(sheetData)
    console.log(dates.length)
}

//function that returns a given sheets range
/*May want to add:  if there are rows of different length, make the trailing [''] elements
                    so that the array is of constant size
*/
async function getSheetRangeArr(gs, sID, sRange) {

    if (typeof sID != 'string' || typeof sRange != 'string') {
        console.log('Error: getSheetRangeArr(), wrong parameters')
        return undefined
    }
    const request = {
        spreadsheetId: sID,
        range: sRange,
    };

    //get the array and save
    let retArr = (await gs.spreadsheets.values.get(request)).data.values
    //make the array of even length by filling with undefined
    const rowSize = retArr[0].length
    retArr = retArr.map(row => {
        while (row.length < rowSize)
            row.push(undefined)
        return row
    });

    //wait for the get response, then return off the values in array form
    return retArr
}

//Function that takes the sheet as an array and returns an array of objects (dates),
//each row is one object (a date)
function loadDates(dateArr) {
    let tempObj
    let retArr = []
    for (d of dateArr) {
        tempObj = {
            activity: d[0],
            description: d[1],
            location: d[2],
            planningBy: d[3],
            ranking: [d[4], d[5]],
            rankingAvg: d[6],
            pandemicRank: d[7],
            cost: d[8],
            duration: d[9],
            timesDone: d[10],
            contributed: d[11],
            comments: d[12]
        }
        retArr.push(tempObj)
    }

    retArr.shift()
    return retArr
}