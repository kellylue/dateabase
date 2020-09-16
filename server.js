const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Sheets = require('./sheets.js');

app.use(express.static(__dirname));


app.get('/', (req, res) => {
	res.sendFile('/index.html', { root: __dirname });
});
app.get('/about', (req, res) => {
	res.sendFile('/FrontEnd/about.html', { root: __dirname });
});
app.get('/contact', (req, res) => {
	res.sendFile('/FrontEnd/contact.html', { root: __dirname });
});
app.get('/timeline', (req, res) => {
	res.sendFile('/FrontEnd/timeline.html', { root: __dirname });
});

app.get('/abc', (req, res) => {
	console.log('abc');
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
});

Sheets.createAuth()
Sheets.accessSheetsTest();

(async function () {
	const dates = await Sheets.loadAllDates()
	console.log(dates[0])
})()