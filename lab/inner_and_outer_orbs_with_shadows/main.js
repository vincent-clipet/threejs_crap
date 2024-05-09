import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import ColorUtils from "./utils/ColorUtils";
import ThreeUtils from "./utils/ThreeUtils";
import MathUtils from "./utils/MathUtils";
import { Config as C } from "./config.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



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

const lightA = new THREE.PointLight(C.lights.a.color, C.lights.a.intensity);
lightA.position.set(C.lights.a.x, C.lights.a.y, C.lights.a.z);
ThreeUtils.setupShadows(lightA, 1024)

const lightB = new THREE.PointLight(C.lights.b.color, C.lights.b.intensity);
lightB.position.set(C.lights.b.x, C.lights.b.y, C.lights.b.z);
ThreeUtils.setupShadows(lightB, 512)

const lightSpotlight = new THREE.SpotLight(
	C.lights.spotlight.color,
	C.lights.spotlight.intensity,
	C.lights.spotlight.distance,
	C.lights.spotlight.angle,
	C.lights.spotlight.penumbra,
	C.lights.spotlight.decay
);
lightSpotlight.position.set(C.lights.spotlight.x, C.lights.spotlight.y, C.lights.spotlight.z);
ThreeUtils.setupShadows(lightSpotlight, 128)



// Setup ground
const ground = {
	geometry: new THREE.PlaneGeometry(C.ground.size, C.ground.size),
	material: new THREE.MeshStandardMaterial({color: C.ground.color, side: THREE.DoubleSide} ),
}
ground.plane = new THREE.Mesh(ground.geometry, ground.material);
ground.plane.position.set(C.ground.z, C.ground.y, C.ground.z);
ground.plane.rotateX(Math.PI / 2)
ground.plane.receiveShadow = true;



// Inner sphere
const inner = {
	geometry: new THREE.SphereGeometry(C.innerSphere.radius, 32, 32),
	material: new THREE.MeshStandardMaterial({ color: C.innerSphere.color }),
}
inner.mesh = new THREE.Mesh(inner.geometry, inner.material);
inner.mesh.receiveShadow = true;
inner.mesh.castShadow = true;



// Outer orbs
const orbs = new THREE.Group();
const geometry = new THREE.SphereGeometry(500, 16, 16);
const points = geometry.getAttribute("position").array;

var data = new Array(points.length / 3);

const gradient = ColorUtils.generateGradient(
	C.gradient.startColor, C.gradient.endColor,
	C.gradient.size, true
);

for (var i = 0; i < points.length; i = i + 3) {
	const geometry = new THREE.SphereGeometry(6, 8, 8);
	const x = points[i];
	const y = points[i+1];
	const z = points[i+2];
	
	// Set orb location
	geometry.translate(x, y, z);
	
	// Set color & current gradient step for animation
	const gradientStep = MathUtils.clamp(
		Math.floor(gradient.length * (y + C.outerSphere.radius) / (C.outerSphere.radius * 2)),
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



// Add everything to the scene
scene.add(lightAmbient);
scene.add(lightA);
scene.add(lightB);
scene.add(lightSpotlight);
scene.add(ground.plane);
scene.add(inner.mesh);
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
