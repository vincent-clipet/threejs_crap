import * as THREE from "three";

const ThreeJsUtils = {
	/**
	 * Setup shadows on a Light object
	 * @param {THREE.Light} light Light source
	 * @param {*} size Width & height of the shadow map
	 * @param {*} near Camera frustrum near plane
	 * @param {*} far Camera frustrum far plane
	 */
	setupShadows: (light, size = 512, near = 0.1, far = 1000000000) => {
		light.castShadow = true;
		light.shadow.mapSize.width = size;
		light.shadow.mapSize.height = size;
		light.shadow.camera.near = near;
		light.shadow.camera.far = far;
	},
}

export default ThreeJsUtils;