
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
	self.totalKcal = ko.observable(0);
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
			if(resp) {
				self.mode('meals')
				self.mealsWork(resp.meals);
				self.totalKcal(resp.kcal);
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
		}
	};

	self.convertToFloat = function(number) {
		var str = number.toString();
		str = str.replace(',', '.');
		return parseFloat(str, 10);
	}

	self.initCharts = function()
	{
		for(var i=0; i<self.meals().length; i++) {
			var id = "myChart" + i;
			var ctx = document.getElementById(id).getContext("2d");

			self.meals()[i].myDoughnutChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: [
						"Tłuszcz",
						"Białko",
						"Węglowodany",
						"Błonnik",
					],
					datasets: [{
						backgroundColor: [
							"#2a24f2",
							"#e897b4",
							"#ed005d",
							"#83c785",
						],
						data: [
							self.convertToFloat(self.mealsWork()[i].data.fat),
							self.convertToFloat(self.mealsWork()[i].data.protein),
							self.convertToFloat(self.mealsWork()[i].data.carbo),
							self.convertToFloat(self.mealsWork()[i].data.fiber)
						]
					}]
				},
				options: {
					responsive: true
				}
			});
			// Chart.defaults.global.legend.display = false;
		}

	}
};

ko.applyBindings(new MealioViewModel());