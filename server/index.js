const express = require('express');
const app = express();
const fs = require('fs');
const Calculations = require('./calculations');

app.use(express.static(`${__dirname}/../`));

app.get('/', function (req, res) {
  res.send(fs.readFileSync(`${__dirname}/../index.html`, {
    encoding: 'UTF-8'
  }))
});

app.post('/kcal', function(req, res) {
	let params = req.body;
	try {
		let kcal = Calculations.getDailyKcal(params.sex, params.height, params.weight, params.age);
		res.send({ kcal: kcal });

	} catch(e) {
		res.statusCode = 400;
		res.send({ error: e.message });
	}

});

app.get('/meals-for-day', function(req, res) {
	let params = req.query;


});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});