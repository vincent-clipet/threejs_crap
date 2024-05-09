const Config = {

	camera: {
		x: 0, y: 0, z: 2200,
		fov: 30,
	},
	innerSphere: {
		radius: 400,
		color: 0xffffff,
	},
	outerSphere: {
		radius: 500,
	},
	gradient: {
		size: 60,
		startColor: 0x7734eb,
		endColor: 0xebde34,
	},
	lights: {
		ambient: {
			color: 0xaa3300,
			intensity: 1,
		},
		a: {
			x: 2000, y: 2000, z: 2000,
			color: 0xebde34,
			intensity: 50000000,
		},
		b: {
			x: -4000, y: 0, z: -4000,
			color: 0xebde34,
			intensity: 5000000,
		},
		spotlight: {
			x: -500, y: -500, z: 2000,
			color: 0x00ffff,
			intensity: 5000000,
			distance: 0,
			angle: Math.PI / 32,
			penumbra: 1,
			decay: 2,
		}
	},
	ground: {
		x: 0, y: -600, z: 0,
		size: 5000,
		color: 0x335033,
	},

};

export { Config };