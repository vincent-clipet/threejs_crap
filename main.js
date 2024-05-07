import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import ColorUtils from "./utils/ColorUtils";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const CAMERA = {
	x: 0, y: 0, z: 2200,
	fov: 30,
}
const INNER_SPHERE =  {
	radius: 400,
	color: 0xffffff,
}
const BIG_SPHERE = {
	radius: 500,
}
const GRADIENT = {
	size: 60,
	startColor: 0x7734eb,
	endColor: 0xebde34,
}
const LIGHTS = {
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
}
const GROUND = {
	x: 0, y: -600, z: 0,
	size: 5000,
	color: 0x335033,
}



function getRandomInt(max, min = 0) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setMinMax(value, min, max) {
	return Math.max(
		Math.min(value, max),
		min
	);
}



// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Setup stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Setup Scene
const scene = new THREE.Scene();

// Setup Camera
const camera = new THREE.PerspectiveCamera(
	CAMERA.fov,
	window.innerWidth / window.innerHeight,
	0.1,
	1000000,
);
camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z);

// Setup controls
const controls = new OrbitControls( camera, renderer.domElement );



// Setup ground
const ground = {
	geometry: new THREE.PlaneGeometry(GROUND.size, GROUND.size),
	material: new THREE.MeshBasicMaterial({color: GROUND.color, side: THREE.DoubleSide} ),
}
ground.plane = new THREE.Mesh(ground.geometry, ground.material);
ground.plane.position.set(GROUND.z, GROUND.y, GROUND.z);
ground.plane.rotateX(Math.PI / 2)
ground.plane.receiveShadow = true;
scene.add(ground.plane);



// Setup lights
const lightAmbient = new THREE.AmbientLight(LIGHTS.ambient.color, LIGHTS.ambient.intensity);
scene.add(lightAmbient);

const lightA = new THREE.PointLight(LIGHTS.a.color, LIGHTS.a.intensity);
lightA.position.set(LIGHTS.a.x, LIGHTS.a.y, LIGHTS.a.z);
lightA.castShadow = true;
lightA.shadow.mapSize.width = 128;
lightA.shadow.mapSize.height = 128;
lightA.shadow.camera.near = 1;
lightA.shadow.camera.far = 5000;
scene.add(lightA);

const lightB = new THREE.PointLight(LIGHTS.b.color, LIGHTS.b.intensity);
lightB.position.set(LIGHTS.b.x, LIGHTS.b.y, LIGHTS.b.z);
lightB.castShadow = true;
lightB.shadow.mapSize.width = 128;
lightB.shadow.mapSize.height = 128;
lightB.shadow.camera.near = 1;
lightB.shadow.camera.far = 5000;
scene.add(lightB);

const lightSpotlight = new THREE.SpotLight(
	LIGHTS.spotlight.color,
	LIGHTS.spotlight.intensity,
	LIGHTS.spotlight.distance,
	LIGHTS.spotlight.angle,
	LIGHTS.spotlight.penumbra,
	LIGHTS.spotlight.decay
);
lightSpotlight.position.set(LIGHTS.spotlight.x, LIGHTS.spotlight.y, LIGHTS.spotlight.z);
lightSpotlight.castShadow = true;
lightSpotlight.shadow.mapSize.width = 128;
lightSpotlight.shadow.mapSize.height = 128;
lightSpotlight.shadow.camera.near = 1;
lightSpotlight.shadow.camera.far = 5000;
lightSpotlight.shadow.focus = 1;
scene.add(lightSpotlight);



// Inner sphere
const inner = {
	geometry: new THREE.SphereGeometry(INNER_SPHERE.radius, 32, 32),
	material: new THREE.MeshStandardMaterial({ color: INNER_SPHERE.color }),
}
inner.mesh = new THREE.Mesh(inner.geometry, inner.material);
scene.add(inner.mesh);



// Outer orbs
const orbs = new THREE.Group();
const geometry = new THREE.SphereGeometry(500, 16, 16);
const points = geometry.getAttribute("position").array;

var data = new Array(points.length / 3);

const gradient = ColorUtils.generateGradient(
	GRADIENT.startColor, GRADIENT.endColor,
	GRADIENT.size, true
);

for (var i = 0; i < points.length; i = i + 3) {
	const geometry = new THREE.SphereGeometry(6, 4, 4);
	const x = points[i];
	const y = points[i+1];
	const z = points[i+2];
	
	// Set orb location
	geometry.translate(x, y, z);
	
	// Set color & current gradient step for animation
	// const gradientStep = getRandomInt(gradient.length);
	const gradientStep = setMinMax(
		Math.floor(gradient.length * (y + BIG_SPHERE.radius) / (BIG_SPHERE.radius * 2)),
		0,
		gradient.length - 1
	);
	const material = new THREE.MeshBasicMaterial({ color: gradient[gradientStep].rgb });

	const orb = new THREE.Mesh(geometry, material);
	orb.receiveShadow = true;
	orb.castShadow = true;
	orbs.add(orb);
	data[i / 3] = {
		orb,
		x, y, z,
		gradientStep: gradientStep,
	};
}
scene.add(orbs);



scene.add(new THREE.CameraHelper(lightA.shadow.camera));
scene.add(new THREE.CameraHelper(lightB.shadow.camera));
scene.add(new THREE.SpotLightHelper(lightSpotlight));



// Render
function animate() {
	const frame = requestAnimationFrame(animate);
	controls.update();

	// Animation code here
	data.forEach((i) => {
		i.gradientStep += 1;
		const newRGB = gradient[i.gradientStep % gradient.length].rgb;
		i.orb.material.color.setHex(newRGB);
	});

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
