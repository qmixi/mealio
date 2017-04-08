const MealComposer = module.exports = {};
const MealRepo = require('./meal-repository');

MealComposer.getMockedBreakfast = () => {
	return new Promise(resolve => {
		resolve({"id":3,"title":"Sałatka","category":"breakfast","preparation":null,"ingredients":[{"id":1,"name":"Sałata","value":"20","id_recipe":3}],"image":"https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150"});
	});
};

MealComposer.getMealsForDay = () => {
	let meals = [];
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	meals.push(MealComposer.getMockedBreakfast());
	return new Promise(resolve => {
		Promise.all(meals).then(function(data) {
			resolve(data);
		});
	});
};

MealComposer.getBreakfast = () => {
	return MealRepo.getByCategory('breakfast', 10);
};


MealComposer.getDinner = () => {
	return MealRepo.getByCategory('Obiad', 10);
};

MealComposer.getSupper = () => {
	return MealRepo.getByCategory('Kolacja', 10);
};

MealComposer.getDessert = () => {
	return MealRepo.getByCategory('Deser', 10);
};


// MealComposer.getBreakfast().then((breakfast) => {
// 	console.log('mamy %j', breakfast);
//
// });