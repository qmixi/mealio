const _ = require('lodash');
const MealComposer = module.exports = {};
const MealRepo = require('./meal-repository');

MealComposer.getMealsForDay = (totalKcal) => {
	const mealsCount = 7;
	const kcalPerMeal = totalKcal/mealsCount;

	return new Promise((resolve, reject) => {
    return Promise.all([
      MealComposer.getBreakfast()
        .then((rows) => {

          _.filter(rows, (obj) => {
            return (typeof obj.data !== 'undefined' && obj.data.carbo <= kcalPerMeal);
          });

          _.filter(rows, (obj) => {
            return (obj.ingredients.length > 0);
          })

          return rows.slice(0, 2);
        }),
      MealComposer.getDinner()
        .then((rows) => {

          _.filter(rows, (obj) => {
            return (typeof obj.data !== 'undefined' && obj.data.carbo <= kcalPerMeal);
          });

          _.filter(rows, (obj) => {
            return (obj.ingredients.length > 0);
          })

          return rows.slice(0, 2);
        }),
      MealComposer.getDessert()
        .then((rows) => {

          _.filter(rows, (obj) => {
            return (typeof obj.data !== 'undefined' && obj.data.carbo <= kcalPerMeal);
          });

          _.filter(rows, (obj) => {
            return (obj.ingredients.length > 0);
          })

          return rows.slice(0, 2);
        }),
      MealComposer.getSupper()
        .then((rows) => {

          _.filter(rows, (obj) => {
            return (typeof obj.data !== 'undefined' && obj.data.carbo <= kcalPerMeal);
          });

          _.filter(rows, (obj) => {
            return (obj.ingredients.length > 0);
          })

          return rows.slice(0, 1);
        })
    ]).then((data) => {
    	var result = [];
    	data.forEach(function(item) {
    		if(item instanceof Array) {
    			result = result.concat(item);
				} else {
    			result.push(item);
				}
			});
      resolve(result);
    });
	});
};

MealComposer.getBreakfast = () => {
	return MealRepo.getByCategory('Śniadanie');
};


MealComposer.getDinner = () => {
	return MealRepo.getByCategory('Obiad');
};

MealComposer.getSupper = () => {
	return MealRepo.getByCategory('Kolacja');
};

MealComposer.getDessert = () => {
	return MealRepo.getByCategory('Deser');
};

// MealComposer.getBreakfast().then((breakfast) => {
// 	console.log('mamy %j', breakfast);
//
// });