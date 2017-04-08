
var MealioViewModel = function(data) {
	var self = this;
	self.mode = ko.observable("start");
	self.form = {
		age: ko.observable(""),
		growth: ko.observable(""),
		weight: ko.observable(""),
		sex: ko.observable("male")
	};

	self.meals = ko.observable();
	self.mealsWork = ko.observable();

	self.goToForm = function()
	{
		self.mode("form");
	};

	self.getMeals = function()
	{
		self.mode("meals");
	};

	self.sendData = function()
	{
		var obj = ko.toJSON(self.form);
		var body = "/kcal?age=" + self.form.age() + "&weight=" + self.form.weight() + "&growth=" + self.form.growth() +"&sex=" + self.form.sex();

		$.get(body, function(resp) {
			console.log("resp", resp);
			if(resp) {
				self.mode('meals')
				self.mealsWork(resp.meals)
				self.addMealsCollapsing();
				self.meals(self.mealsWork());
				self.meals()[0].collapse(false);
				setTimeout(self.initCharts, 1000);
			}
		});
	};

	self.addMealsCollapsing = function()
	{
		for(var i=0; i<self.mealsWork().length; i++) {
			self.mealsWork()[i].collapse = ko.observable(false);
			self.mealsWork()[i].fat = 34,
			self.mealsWork()[i].protein = 21,
 			self.mealsWork()[i].carbo = 42,
			self.mealsWork()[i].fiber = 13
		}
	}

	self.initCharts = function()
	{
		for(var i=0; i<self.meals().length; i++) {
			var id = "myChart" + i;
			var ctx = document.getElementById(id).getContext("2d");
			var data = [
				{
				value: self.mealsWork()[i].fat,
				color: "#E2EAE9",
					// label: 'Tłuszcz'
			}, {
				value: self.mealsWork()[i].protein,
				color: "#D4CCC5",
					// label: 'Białko'
			}, {
				value: self.mealsWork()[i].carbo,
				color: "#949FB1",
					// label: 'Węglowodany'
			}, {
				value: self.mealsWork()[i].fiber,
				color: "#4D5360",
					// label: 'Błonnik'
			}];

			console.log("data", data, "ctx", ctx);

			self.meals()[i].myDoughnutChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					datasets: [{
						backgroundColor: [
							"#2a24f2",
							"#e897b4",
							"#ed005d",
							"#83c785",
						],
						data: [12, 13, 14]
					}]
				},
				options: {
					responsive: true
				}
			});
		}

	}
};

ko.applyBindings(new MealioViewModel());