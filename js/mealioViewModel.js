
var MealioViewModel = function(data) {
	var self = this;
	self.mode = ko.observable("start");
	self.form = {
		age: ko.observable(""),
		growth: ko.observable(""),
		weight: ko.observable(""),
		sex: ko.observable("male")
	};

	self.meals = ko.observable(false);

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
			}
		});
	};
};

ko.applyBindings(new MealioViewModel());