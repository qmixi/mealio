// const module = require('module');
const Calculations = module.exports = {};

(function() {
	/**
	 * wzor Harrisa-Benedicta, wyznaczajacy podstawowa wartosc kaloryczna w spoczynku.
	 */
	function getHarrisPPM(sex, heightInCm, massInKg, age) {
		let result = null;
		if(sex === 'female') {
			result = 655.1 + (9.563 * massInKg) + (1.85 * heightInCm) - (4.676 * age);

		} else if(sex === 'male') {
			result = 65.5 + (13.75 * massInKg) + (5.003 * heightInCm) - (6.775 * age);
		}
		if(result !== null) result = Math.round(result);
		return result;
	}

	Calculations.getDailyKcal = function(sex, heightInCm, massInKg, age, activityMultiplier = 1.4) {
		if(['male', 'female'].indexOf(sex) === -1) {
			throw new Error("Parameter sex invalid");
		}
		if(isNaN(heightInCm = heightInCm*1) || heightInCm <= 0) {
			throw new Error("Height is invalid");
		}
		if(isNaN(massInKg = massInKg*1) || massInKg <= 0) {
			throw new Error("Mass is invalid");
		}
		if(isNaN(age = age*1) || age <= 0) {
			throw new Error("Age is invalid");
		}

		return getHarrisPPM(sex, heightInCm, massInKg, age) * activityMultiplier;
	}

})();
