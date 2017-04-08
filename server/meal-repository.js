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

		let sel = recipies.select("id", "title", "category", "preparation").limit(limit);
		let innerSelects = [];

		sel.map(recipe => {
			recipe.ingredients = [];

			let sel = ingredients
				.select('id', 'name', 'value', 'id_recipe')
				.where('id_recipe', '=', recipe.id);

			innerSelects.push(sel);

			sel.then(data => {
				recipe.ingredients = data;
				// todo: usunac to gdy baza danych bedzie zmergowana z moim contentem
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