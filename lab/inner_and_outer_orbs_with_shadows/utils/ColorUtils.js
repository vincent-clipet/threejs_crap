const ColorUtils = {
	/**
	 * @param {number} hex Color (hex)
	 * @returns {number[]} Array containing 3 color values
	 */
	hexToRgb: (hex) => {
		return [
			(hex & 0xff0000) >> 16,
			(hex & 0x00ff00) >> 8,
			(hex & 0x0000ff),
		];
	},

	/**
	 * @param {number[]} rgbData Array of 3 values
	 * @returns {number} RGB value
	 */
	rgbToHex: (rgbData) => {
		return rgbData[0] * 256 * 256 + rgbData[1] * 256 + rgbData[2];
	},

	/**
	 * @param {number} start Starting color (hex)
	 * @param {number} end Ending color (hex)
	 * @param {number} total Number of steps in the gradient
	 * @param {boolean} bothDirections Set to true to get an ABCCBA array
	 * @returns {{r: number, g: number, b: number, rgb: number}} Object representing color data
	 */
	generateGradient: (start, end, total, bothDirections = false) => {
		var start = ColorUtils.hexToRgb(start);
		var end = ColorUtils.hexToRgb(end);
		var alpha = 0.0;
		const ret = new Array(total);

		for (var i = 0; i < total; i++) {
			alpha += (1.0 / total);
			ret[i] = {
				r: Math.floor(start[0] * alpha + (1 - alpha) * end[0]),
				g: Math.floor(start[1] * alpha + (1 - alpha) * end[1]),
				b: Math.floor(start[2] * alpha + (1 - alpha) * end[2]),
			};
			ret[i].rgb = ColorUtils.rgbToHex([ret[i].r, ret[i].g, ret[i].b]);
		}

		if (bothDirections) {
			const reversed = ret.toReversed();
			return ret.concat(reversed);
		} else {
			return ret;
		}
	},
}

export default ColorUtils;