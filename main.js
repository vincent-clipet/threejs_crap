import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import ThreeUtils from "./utils/ThreeUtils";
import { generate3DObject } from "./utils/TypeUtils.js";
import { Config as C } from "./config.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Vector2 } from "three";
import { Vector3 } from "three";



// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

// Setup stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Setup Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x62d6fc);

// Setup Camera
const camera = new THREE.PerspectiveCamera(
	C.camera.fov,
	window.innerWidth / window.innerHeight,
	0.1,
	1000000,
);
camera.position.set(C.camera.x, C.camera.y, C.camera.z);

// Setup controls
const controls = new OrbitControls( camera, renderer.domElement );






// Setup lights
const lightAmbient = new THREE.AmbientLight(C.lights.ambient.color, C.lights.ambient.intensity);

const lightA = new THREE.PointLight(C.lights.main.color, C.lights.main.intensity);
lightA.position.set(C.lights.main.x, C.lights.main.y, C.lights.main.z);
ThreeUtils.setupShadows(lightA, 1024)



// Setup ground
const ground = generate3DObject(
	new THREE.PlaneGeometry(C.ground.size, C.ground.size),
	new THREE.MeshStandardMaterial({color: C.ground.color, side: THREE.DoubleSide}),
);
ground.mesh.position.set(C.ground.z, C.ground.y, C.ground.z);
ground.mesh.rotateX(Math.PI / 2)
ground.mesh.receiveShadow = true;



// Inner sphere
const inner = generate3DObject(
	new THREE.IcosahedronGeometry(C.globe.radius, C.globe.detail),
	new THREE.MeshStandardMaterial({ color: C.globe.color })
);
inner.mesh.receiveShadow = true;
inner.mesh.castShadow = true;



// Rim 1 (inner)
const rim1Geometries = [
	new THREE.CylinderGeometry(C.rim1.outerRadius, C.rim1.outerRadius, C.rim1.height, 128, 1, true),
	new THREE.CylinderGeometry(C.rim1.innerRadius, C.rim1.innerRadius, C.rim1.height, 128, 1, true),
	new THREE.RingGeometry(C.rim1.innerRadius, C.rim1.outerRadius, 128),
	new THREE.RingGeometry(C.rim1.innerRadius, C.rim1.outerRadius, 128),
];
rim1Geometries[2].translate(0, 0, C.rim1.height / 2).rotateX(Math.PI/2);
rim1Geometries[3].translate(0, 0, -C.rim1.height / 2).rotateX(Math.PI/2);

const rim1 = generate3DObject(
	BufferGeometryUtils.mergeGeometries(rim1Geometries, false),
	new THREE.MeshStandardMaterial({color: C.rim1.color, side: THREE.DoubleSide})
);
rim1.mesh.position.set(0, 0, 0);
rim1.mesh.rotateOnAxis(new Vector3(1, 0, 0).normalize(), -Math.PI / 4);
rim1.mesh.receiveShadow = true;
rim1.mesh.castShadow = true;



// Rim 2 (middle)
const rim2Geometries = [
	new THREE.CylinderGeometry(C.rim2.outerRadius, C.rim2.outerRadius, C.rim2.height, 128, 1, true),
	new THREE.CylinderGeometry(C.rim2.innerRadius, C.rim2.innerRadius, C.rim2.height, 128, 1, true),
	new THREE.RingGeometry(C.rim2.innerRadius, C.rim2.outerRadius, 128),
	new THREE.RingGeometry(C.rim2.innerRadius, C.rim2.outerRadius, 128),
];
rim2Geometries[2].translate(0, 0, C.rim2.height / 2).rotateX(Math.PI/2);
rim2Geometries[3].translate(0, 0, -C.rim2.height / 2).rotateX(Math.PI/2);

const rim2 = generate3DObject(
	BufferGeometryUtils.mergeGeometries(rim2Geometries, false),
	new THREE.MeshStandardMaterial({color: C.rim2.color, side: THREE.DoubleSide})
);
rim2.mesh.position.set(0, 0, 0)
rim2.mesh.rotateOnAxis(new Vector3(1, 0, 0).normalize(), Math.PI / 4);
rim2.mesh.receiveShadow = true;
rim2.mesh.castShadow = true;



// Rim 3 (outer)
const rim3Geometries = [
	new THREE.CylinderGeometry(C.rim3.outerRadius, C.rim3.outerRadius, C.rim3.height, 128, 1, true),
	new THREE.CylinderGeometry(C.rim3.innerRadius, C.rim3.innerRadius, C.rim3.height, 128, 1, true),
	new THREE.RingGeometry(C.rim3.innerRadius, C.rim3.outerRadius, 128),
	new THREE.RingGeometry(C.rim3.innerRadius, C.rim3.outerRadius, 128),
];
rim3Geometries[2].translate(0, 0, C.rim3.height / 2).rotateX(Math.PI/2);
rim3Geometries[3].translate(0, 0, -C.rim3.height / 2).rotateX(Math.PI/2);

const rim3 = generate3DObject(
	BufferGeometryUtils.mergeGeometries(rim3Geometries, false),
	new THREE.MeshStandardMaterial({color: C.rim3.color, side: THREE.DoubleSide})
);
rim3.mesh.position.set(0, 0, 0)
rim3.mesh.receiveShadow = true;
rim3.mesh.castShadow = true;





// Add everything to the scene
scene.add(lightAmbient);
scene.add(lightA);
scene.add(ground.mesh);
scene.add(inner.mesh);
scene.add(rim1.mesh);
scene.add(rim2.mesh);
scene.add(rim3.mesh);
// scene.add(new THREE.CameraHelper(lightA.shadow.camera));






// Render
function animate() {
	const frame = requestAnimationFrame(animate);
	controls.update();

	// Animation code here
	rim1.mesh.rotateOnAxis(new Vector3(1,1,0).normalize(), Math.PI / 60)
	rim2.mesh.rotateOnAxis(new Vector3(1,0,1).normalize(), -Math.PI / 60)
	rim3.mesh.rotateOnAxis(new Vector3(0,1,1).normalize(), Math.PI / 60)

	renderer.render(scene, camera);
	stats.update();
}



// Run
if (WebGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById("container").appendChild(warning);
}
