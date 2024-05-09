const Config = {

	camera: {
		x: 0, y: 0, z: 2200,
		fov: 30,
	},
	rim1: {
		color: 0xf0a337,
		innerRadius: 440,
		outerRadius: 470,
		height: 30,
	},
	rim2: {
		color: 0xf0c837,
		innerRadius: 490,
		outerRadius: 520,
		height: 30,
	},
	rim3: {
		color: 0xedf037,
		innerRadius: 540,
		outerRadius: 570,
		height: 30,
	},
	globe: {
		radius: 400,
		detail: 1,
		color: 0x222222,
	},
	lights: {
		ambient: {
			color: 0xffffff,
			intensity: 3,
		},
		main: {
			x: 2000, y: 2000, z: 2000,
			color: 0xebde34,
			intensity: 50000000,
		},
	},
	ground: {
		x: 0, y: -600, z: 0,
		size: 5000,
		color: 0x335033,
	},

};

export { Config };