const express = require('express');
const app = express();
const fs = require('fs');
const Calculations = require('./calculations');
const MealComposer = require('./meal-composer');

app.use(express.static(`${__dirname}/../`));

app.get('/', function (req, res) {
  res.send(fs.readFileSync(`${__dirname}/../index.html`, {
    encoding: 'UTF-8'
  }))
});

app.get('/kcal', function(req, res) {
	let params = req.query;
	try {
		let kcal = Calculations.getDailyKcal(params.sex, params.growth, params.weight, params.age);
		MealComposer.getMealsForDay(kcal).then((meals) => {
			res.send({ kcal: kcal, meals: meals });
		});

	} catch(e) {
		res.statusCode = 400;
		res.send({ error: e.message });
	}

});

app.get('/meals-for-day', function(req, res) {
	let params = req.query;
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
});