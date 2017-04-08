const MealRepo = module.exports = {};
const async = require('async');

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
MealRepo.getByCategory = (category) => {

  return new Promise((resolve, reject) => {
    let recipies = db('recipe');
    // let ingredients = db('ingredients');
    // let dataRecipe = db('data_recipe');

    const selectRecipe = recipies.select('*').where('category', category);

    selectRecipe
      .then((rows) => {
        async.map(rows, (recipe, cb) => {
          Promise.all([
            db
              .select('id', 'name', 'value', 'id_recipe')
              .from('ingredients')
              .where('id_recipe', '=', recipe.id)
              .then((data) => {
                if (recipe.image) {
                  recipe.image = "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150";
                }

                return (recipe.ingredients = data);
              }),
            db.select('*')
              .from('data_recipe')
              .where('id_recipe', '=', recipe.id)
              .then((data) => {
                return (recipe.data = data[0] || {});
              })
          ])
            .then(() => {
              cb(null);
            });
        }, (err, result) => {
          resolve(rows);
        });
      });
  });
}