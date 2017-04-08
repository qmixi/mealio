
var MealioViewModel = function(data) {
	var self = this;
	self.mode = ko.observable("start");
	self.form = {
		age: ko.observable(""),
		growth: ko.observable(""),
		weight: ko.observable(""),
		sex: ko.observable("male")
	};

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
		console.log("obj", obj);

		fetch('/kcal', {
			method: 'post',
			body: obj
		}).then(function(resp){
			console.log("resp", resp);
		}).catch(function(err){
			console.log(err)
		});
	};
};

ko.applyBindings(new MealioViewModel());