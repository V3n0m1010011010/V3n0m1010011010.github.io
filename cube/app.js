import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';


let scene, renderer, camera, controls;
let dirLight;
let box;

scene = new THREE.Scene();
//scene.add(new THREE.AmbientLight(0x404040, 3));


renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {renderer.setSize(window.innerWidth, window.innerHeight)})
renderer.setClearColor(0xffffff, 1);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);


camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.position.x = -15;
camera.position.y = 20;
//camera.rotate.y = (100 * Math.PI) / 180;


controls = new OrbitControls(camera, renderer.domElement);

let d = 15;

dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.name = 'Dir. Light';
dirLight.position.set(0, 20, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 20;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
const camerahelper = new THREE.CameraHelper(dirLight.shadow.camera)


const materialPlane = new THREE.ShadowMaterial();
materialPlane.opacity = 0.5;
let geometryPlane = new THREE.BoxGeometry(10, 0.001, 10);
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.set(0, 0, 0);
plane.rotation.x = (90 * Math.PI) / 180;
plane.receiveShadow = true;
plane.castShadow = false;
plane.scale.multiplyScalar(3);
plane.rotation.x = Math.PI




let material = new THREE.ShaderMaterial({
    uniforms: {
        v_Uv: { value: new THREE.Vector2() },
        u_Color: { value: new THREE.Color(0xeb4034) }
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
    side: THREE.DoubleSide,
    transparent: true,
});

let geometryBox = new THREE.BoxGeometry(5, 5, 5);
let materialBox = new THREE.MeshPhongMaterial({
    color: 0x3d803b,
    shininess: 150,
    specular: 0x222222
});
box = new THREE.Mesh(geometryBox, material);
box.position.set(0, 5, 0);
box.receiveShadow = true;
box.castShadow = true;

const depthMaterial = new THREE.MeshDepthMaterial();
depthMaterial.onBeforeCompile = function (shader) {
    shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
        'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) );'
    );
};

camera.lookAt(box);


scene.add(dirLight);
scene.add(dirLightHelper);
scene.add(camerahelper);
scene.add(plane);
scene.add(box);


document.getElementById('light-intensity').addEventListener('input', (event) => {
    materialPlane.opacity = event.target.value;
});
document.getElementById('bg-color').addEventListener('input', (event) => {
    scene.background = new THREE.Color(event.target.value);
});
document.getElementById('lighthelper').addEventListener('input', (event) => {
    dirLightHelper.visible = event.target.checked;
    camerahelper.visible = event.target.checked;
});
document.getElementById('box-rotation').addEventListener('input', (event) => {
    speed = event.target.value;
});


let speed = 1;
let clock = new THREE.Clock();
function animate() {
    const delta = clock.getDelta();
    controls.update();
    box.rotation.x += 0.25 * delta * speed;
    box.rotation.y += 2 * delta * speed;
    box.rotation.z += 1 * delta * speed;
    renderer.render(scene, camera);
}
function vertexShader() {
    return `
        varying vec2 v_Uv;
		void main( ) {
				v_Uv = uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
		} 
    `;
}
function fragmentShader() {
    return `
        varying vec2 v_Uv;
        uniform vec3 u_Color;
        void main() {
            vec2 position = v_Uv;
            gl_FragColor = vec4(u_Color - position.y, position.x);
        }
    `;
}