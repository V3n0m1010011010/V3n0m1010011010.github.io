import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Kamera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(3, 3, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// GLB laden
const loader = new GLTFLoader();

loader.load(
    "./model.glb",
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        console.log("GLB geladen:", model);
    },
    undefined,
    (error) => {
        console.error("Fehler beim Laden des GLB:", error);
    }
);

// Fenstergröße
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Renderloop
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();