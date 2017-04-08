const _ = require('lodash');
const MealComposer = module.exports = {};
const MealRepo = require('./meal-repository');

MealComposer.getMealsForDay = (totalKcal) => {
	const mealsCount = 7;
	const kcalPerMeal = totalKcal/mealsCount;

	const meals = [];

	return new Promise((resolve, reject) => {
    MealComposer.getBreakfast()
			.then((aa) => {

        _.filter(aa, (obj) => {
          // console.log(obj.title);
          return (typeof obj.data !== 'undefined' && obj.data.carbo <= kcalPerMeal);
        })

    		// console.log(aa);

    		resolve(aa);
			})
	});
};

MealComposer.getBreakfast = () => {
	return MealRepo.getByCategory('Śniadanie');
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