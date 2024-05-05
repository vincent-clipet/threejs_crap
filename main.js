import * as THREE from 'three';
import { GreaterEqualCompare } from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js'




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const stats = new Stats();
document.body.appendChild(stats.dom)



const geometry = new THREE.SphereGeometry( 500, 64, 64 );
const material = new THREE.PointsMaterial({ color: 0xff0000, size: 2 }); 
geometry.rotateX(Math.PI / 2)
geometry.rotateX(Math.PI / 10)
const points = new THREE.Points(geometry, material)


const geometry2 = new THREE.SphereGeometry( 600, 64, 64 );
geometry2.rotateX(Math.PI / 10)
const material2 = new THREE.PointsMaterial({
	color: 0xffff00,
	size: 2
}); 
const points2 = new THREE.Points(geometry2, material2)




const group = new THREE.Group();
group.add(points)
group.add(points2)



camera.position.z = 1000;
scene.add(group);



function animate() {
	requestAnimationFrame( animate );

	// Animation code here
	// points.rotateX(0.002)
	// group.rotateY(0.002)
	points.rotateY(0.002)
	points2.rotateY(-0.002)
	// group.rotateZ(0.001)

	renderer.render( scene, camera );

	stats.update()
}


if ( WebGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('container').appendChild(warning);
}