import * as THREE from './Library/THREE/three.module.js';

import Stats from './Library/stats.module.js';

import { OrbitControls } from './Library/THREE/js/OrbitControls.js';
import { OBJLoader } from './Library/THREE/js/OBJLoader.js';

let container, stats;

let camera, scene, renderer;

let pointLight;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 2000;

    //cubemap
    const path = './Assets/Images/';
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    const reflectionCube = new THREE.CubeTextureLoader().load( urls );
    const refractionCube = new THREE.CubeTextureLoader().load( urls );
    refractionCube.mapping = THREE.CubeRefractionMapping;

    scene = new THREE.Scene();
    scene.background = reflectionCube;

    //lights
    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    pointLight = new THREE.PointLight( 0xffffff, 2 );
    scene.add( pointLight );

    //materials
    const cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
    const cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffee00, envMap: refractionCube, refractionRatio: 0.95 } );
    const cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );

    //models
    const objLoader = new OBJLoader();

    objLoader.setPath( './Assets/Models/Walt/' );
    objLoader.load( 'WaltHead.obj', function ( object ) {

        const head = object.children[ 0 ];

        head.scale.multiplyScalar( 15 );
        head.position.y = - 500;
        head.material = cubeMaterial1;

        const head2 = head.clone();
        head2.position.x = - 900;
        head2.material = cubeMaterial2;

        const head3 = head.clone();
        head3.position.x = 900;
        head3.material = cubeMaterial3;

        scene.add( head, head2, head3 );

    } );

    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.5;

    //stats
    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    renderer.render( scene, camera );
    stats.update();

}
