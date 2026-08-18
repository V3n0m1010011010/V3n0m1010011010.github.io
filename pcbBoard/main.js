import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Kamera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

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
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Rotationsgeschwindigkeit
const baseRotateSpeed = 0.8;

// Ursprünglicher Kameraabstand
let maxCameraDistance = 1;

// Rotationsgeschwindigkeit abhängig vom Zoom
function updateRotateSpeed() {
    const distance = camera.position.distanceTo(controls.target);

    const ratio = distance / maxCameraDistance;

    const speed = THREE.MathUtils.clamp(
        baseRotateSpeed * Math.pow(ratio, 0.7),
        0.15,
        baseRotateSpeed
    );

    controls.rotateSpeed = speed;
}

// GLB laden
const loader = new GLTFLoader();

loader.load(
    "./model.glb",

    (gltf) => {
        const model = gltf.scene;

        scene.add(model);

        // Größe und Mittelpunkt bestimmen
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(
            new THREE.Vector3()
        );

        const size = box.getSize(
            new THREE.Vector3()
        );

        // Modell zentrieren
        model.position.sub(center);

        // Größte Ausdehnung
        const maxSize = Math.max(
            size.x,
            size.y,
            size.z
        );

        // Kameraabstand
        const distance = maxSize * 1.5;

        camera.position.set(
            distance,
            distance,
            distance
        );

        // Ursprünglichen Abstand speichern
        maxCameraDistance = camera.position.distanceTo(
            controls.target
        );

        // Clipping
        camera.near = maxSize / 1000;
        camera.far = maxSize * 100;

        camera.updateProjectionMatrix();

        // Kamera auf Modell ausrichten
        controls.target.set(0, 0, 0);
        controls.update();

        updateRotateSpeed();

        console.log("GLB geladen");
        console.log("Größe:", size);
        console.log("Kameraabstand:", maxCameraDistance);
    },

    (progress) => {
        if (progress.total) {
            console.log(
                "Laden:",
                (progress.loaded / progress.total * 100).toFixed(1),
                "%"
            );
        }
    },

    (error) => {
        console.error(
            "Fehler beim Laden des GLB:",
            error
        );
    }
);

// Fenstergröße
window.addEventListener("resize", () => {
    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// Renderloop
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    updateRotateSpeed();

    renderer.render(
        scene,
        camera
    );
}

animate();
