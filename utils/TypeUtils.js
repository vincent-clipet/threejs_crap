import * as THREE from "three";

/**
 * 
 * @param {THREE.BufferGeometry} geometry 
 * @param {THREE.Material} material 
 * @returns {{ geometry: THREE.BufferGeometry, material: THREE.Material, mesh: THREE.Mesh}}
 */
const generate3DObject = (geometry, material) => {
	return {
		geometry,
		material,
		mesh: new THREE.Mesh(geometry, material)
	}
}

export {
	generate3DObject
};