require('dotenv').config({ path: __dirname + '/.env' })
const Date = require('./Date.js')
const { google } = require('googleapis')

//sheets ID for this google sheets
const NODE_SHEETS_TEST = '1miz6FabnPYH4IL67V3yCD5oUQtMV4X78Sn5XbOyPHxc';

function gsrun() {
	//create client to access API
	//use process variables, define in heroku to access them
	const client = new google.auth.JWT(
		process.env.SHEETS_EMAIL,
		null,
		process.env.SHEETS_KEY,
		['https://www.googleapis.com/auth/spreadsheets']
	);

	//start the client, check for errors
	//if no errors, run
	client.authorize(function (err, tokens) {
		if (err) {
			console.log(err);
			return false
		}
		else {
			console.log('Connected!');
			accessSheets(client)
		}
	});
}


//Function that accesses the sheet, performs the required operations
async function accessSheets(cl) {
	const gsapi = google.sheets({ version: 'v4', auth: cl });

	//get columns A through M
	let sheetData = await getSheetRangeArr(gsapi, NODE_SHEETS_TEST, 'Sheet1!A:M');

	let dates = loadDates(sheetData);
	console.log(dates[0]);
	// console.log(dates[1]);
}

//function that returns a given sheets range
/*May want to add:  if there are rows of different length, make the trailing [''] elements
                    so that the array is of constant size
*/
async function getSheetRangeArr(gs, sID, sRange) {

	if (typeof sID != 'string' || typeof sRange != 'string') {
		console.log('Error: getSheetRangeArr(), wrong parameters');
		return undefined;
	}
	const request = {
		spreadsheetId: sID,
		range: sRange,
	};

	//get the array and save
	let retArr = (await gs.spreadsheets.values.get(request)).data.values;
	//make the array of even length by filling with undefined
	const rowSize = retArr[0].length;
	retArr = retArr.map(row => {
		while (row.length < rowSize)
			row.push(undefined);
		return row;
	});

	//wait for the get response, then return off the values in array form
	return retArr;
}

//Function that takes the sheet as an array and returns an array of objects (dates),
//each row is one object (a date)
function loadDates(dateArr) {
	let tempObj;
	let retArr = [];
	for (d of dateArr) {
		tempObj = new Date(d);
		retArr.push(tempObj);
	}

	retArr.shift();
	return retArr;
}

module.exports = gsrun