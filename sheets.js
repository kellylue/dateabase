require('dotenv').config({ path: __dirname + '/.env' })
const Date = require('./Date.js')
const { google } = require('googleapis')
const { JWT } = require('google-auth-library');

//sheets ID for this google sheets
const NODE_SHEETS_TEST = '1miz6FabnPYH4IL67V3yCD5oUQtMV4X78Sn5XbOyPHxc';

class Sheets {
	/** 
	 * Creates the required auth client to access the sheets.
	 * MUST RUN BEFORE ANY ATTEMPTS TO ACCESS.
	 */
	static createAuth() {
		this._auth = new JWT({
			email: process.env.SHEETS_EMAIL,
			key: process.env.SHEETS_KEY,
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		});
		this._gsapi = google.sheets({ version: 'v4', auth: this._auth })
	}

	/**
	 * A method to test out the methods in this class.
	 */
	static async accessSheetsTest() {
		let sheetData = await this.getSheetRangeArr(NODE_SHEETS_TEST, 'Sheet1!A:M');

		let dates = this._convertArr2Dates(sheetData);
		console.log(dates[0]);
		// console.log(dates[1]);
	}

	/**
	 * @static
	 * @returns An array of all the dates.
	 */
	static async loadAllDates() {
		let sheetData = await this.getSheetRangeArr(NODE_SHEETS_TEST, 'Sheet1!A:M')
		return this._convertArr2Dates(sheetData)
	}

	/**
	 * Gets a given sheet range and returns it in array form.
	 * @param {string} sID 		Sheet ID string.
	 * @param {string} sRange 		Desired sheet range in standard sheet form.
	 * @returns Sheet data as an array
	 */
	static async getSheetRangeArr(sID, sRange) {
		//check for mismatch params
		if (typeof sID != 'string' || typeof sRange != 'string') {
			console.log('Error: getSheetRangeArr(), wrong parameters');
			return undefined;
		}
		const request = {
			spreadsheetId: sID,
			range: sRange,
		};

		//get the array and save
		let retArr = (await this._gsapi.spreadsheets.values.get(request)).data.values;

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
	static _convertArr2Dates(dateArr) {
		let tempObj;
		let retArr = [];
		for (let d of dateArr) {
			tempObj = new Date(d);
			retArr.push(tempObj);
		}

		retArr.shift();
		return retArr;
	}
}

module.exports = Sheets