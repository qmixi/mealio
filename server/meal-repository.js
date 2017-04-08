const MealRepo = module.exports = {};

const db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './database.sqlite'
	},
	useNullAsDefault: true
});

/**
 * @return Promise
 * @param category
 * @param limit
 */
MealRepo.getByCategory = (category, limit = 15) => {

	return new Promise( (resolve, reject) => {
		let recipies = db('recipe');
		let ingredients = db('ingredients');
		let dataRecipe = db('data_recipe');

		let sel = recipies.select("id", "title", "category", "preparation").limit(limit);
		let innerSelects = [];

		sel.map(recipe => {
			recipe.ingredients = [];

			let sel = ingredients
				.select('id', 'name', 'value', 'id_recipe')
				.where('id_recipe', '=', recipe.id)
				.map(res => {
					return res;
				});
			sel.then(function(res) {
				console.log(sel, res);
			});

			sel.then(data => {
				recipe.ingredients = data;
				if(!recipe.image) {
					recipe.image = "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150";
				}
			});

			innerSelects.push(sel);

			let dataSel = dataRecipe.select("id", 'id_recipe', 'energy', 'protein', 'fat', 'carbo',
			'fiber', 'ww', 'wbt', 'id_all');
			dataSel.where('id_recipe', '=', recipe.id);
			dataSel.then(data => {
				recipe.data = data[0];
			});

			innerSelects.push(dataSel);

			return recipe;
		})
			.then(data => {
				Promise.all(innerSelects).then(function(innerSelectsResults) {
					resolve(data);
				});
			});
	});

};