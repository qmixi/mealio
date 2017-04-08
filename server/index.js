const express = require('express');
const app = express();
const fs = require('fs');
const Calculations = require('./calculations');

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.send(fs.readFileSync('./index.html', {
    encoding: 'UTF-8'
  }))
});

app.get('/kcal', function(req, res) {
	let params = req.query;
	try {
		let kcal = Calculations.getDailyKcal(params.sex, params.height, params.weight, params.age);
		res.send({ kcal: kcal });

	} catch(e) {
		res.statusCode = 400;
		res.send({ error: e.message });
	}

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});