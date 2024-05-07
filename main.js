import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import ColorUtils from "./utils/ColorUtils";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const BIG_ORB_RADIUS = 500



function getRandomInt(max, min = 0) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setMinMax(value, min, max) {
	return Math.max(
		Math.min(value, max),
		min
	);
}



// Setup Scene
const scene = new THREE.Scene();

// Setup Camera
const camera = new THREE.PerspectiveCamera(
	30,
	window.innerWidth / window.innerHeight,
	0.1,
	1000000,
);
camera.position.z = 2200;

// Setup Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup controls
const controls = new OrbitControls( camera, renderer.domElement );

const stats = new Stats();
document.body.appendChild(stats.dom);

const orbs = new THREE.Group();

const geometry = new THREE.SphereGeometry(500, 32, 32);
const points = geometry.getAttribute("position").array;

var data = new Array(points.length / 3);

const gradient = ColorUtils.generateGradient(0x7734eb, 0xebde34, 60, true);
console.log(gradient);

for (var i = 0; i < points.length; i = i + 3) {
	const geometry = new THREE.SphereGeometry(6, 8, 8);
	const x = points[i];
	const y = points[i+1];
	const z = points[i+2];
	
	// Set orb location
	geometry.translate(x, y, z);
	
	// Set color & current gradient step for animation
	// const gradientStep = getRandomInt(gradient.length);
	const gradientStep = setMinMax(
		Math.floor(gradient.length * (y + BIG_ORB_RADIUS) / (BIG_ORB_RADIUS * 2)),
		0,
		gradient.length - 1
	);
	console.log(gradientStep)
	console.log(gradient[gradientStep])
	const material = new THREE.MeshBasicMaterial({ color: gradient[gradientStep].rgb });

	const orb = new THREE.Mesh(geometry, material);
	orbs.add(orb);
	data[i / 3] = {
		orb,
		// x, y, z
		gradientStep: gradientStep,
	};
}

scene.add(orbs);

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

if (WebGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById("container").appendChild(warning);
}
