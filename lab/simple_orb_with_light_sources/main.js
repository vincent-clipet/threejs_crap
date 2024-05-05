import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(3000));

const light = new THREE.PointLight(0xffffff, 50000000);
light.position.set(2000, 2000, 2000);
scene.add(light);

const backlight = new THREE.PointLight(0xffffaa, 50000000);
backlight.position.set(-3000, 0, 0);
scene.add(backlight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

const geometry = new THREE.SphereGeometry(500, 64, 64);
const material = new THREE.MeshStandardMaterial({
  // color: 0xffaa00
});
const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

camera.position.z = 1000;

function animate() {
  requestAnimationFrame(animate);

  // Animation code here

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
