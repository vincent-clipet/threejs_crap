const MathUtils = {
	/**
	 * Generates an integer between a set minimum and maximum
	 * @param {*} max 
	 * @param {*} min 
	 * @returns {number}
	 */
	getRandomInt: (max, min = 0) => {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	
	/**
	 * Keeps a value between a set minimum and maximum
	 * @param {*} value 
	 * @param {*} min 
	 * @param {*} max 
	 * @returns Clamped value
	 */
	clamp: (value, min, max) => {
		return Math.max(
			Math.min(value, max),
			min
		);
	}
}

export default MathUtils;