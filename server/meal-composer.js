const MealComposer = module.exports = {};

const db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './database.sqlite'
	},
	useNullAsDefault: true
});

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

	return new Promise((resolve, reject) => {

		let recipies = db('recipe');
		let ingredients = db('ingredients');

		let sel = recipies.select("id", "title", "category", "preparation");
		let innerSelects = [];

		sel.map(recipe => {
			console.log('fetched recipe', recipe);

			recipe.ingredients = [];

			let sel = ingredients.select('id', 'name', 'value', 'id_recipe').where('id_recipe', '=', recipe.id);
			innerSelects.push(sel);
			sel.then(data => {
				recipe.ingredients = data;
				recipe.image = "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150";
			});

			return recipe;

		})
			.then(data => {
				Promise.all(innerSelects).then(function() {
					resolve(data);
				});
			});
	});

};


MealComposer.getDinner = () => {

};

MealComposer.getSupper = () => {

};

MealComposer.getDessert = () => {

};


// MealComposer.getBreakfast().then((breakfast) => {
// 	console.log('mamy %j', breakfast);
//
// });