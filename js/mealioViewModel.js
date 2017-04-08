
var MealioViewModel = function(data) {
	var self = this;
	self.mode = ko.observable("start");
	self.form = ko.observable({
		age: "",
		growth: "",
		weight: ""
	});

	self.goToForm = function()
	{
		self.mode("form");
	};

	self.getMeals = function()
	{
		self.mode("meals");
	};
};

ko.applyBindings(new MealioViewModel());