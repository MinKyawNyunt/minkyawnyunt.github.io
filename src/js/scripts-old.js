import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer;
let robot, robotBox;
let wallBoxes = [];
let speed = 0.05;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    const loader = new GLTFLoader();

    // Load room model
    loader.load(new URL('../assets/room.glb', import.meta.url).href, gltf => {
        const room = gltf.scene;
        room.traverse(obj => {
            if (obj.isMesh) {
                obj.geometry.computeBoundingBox();
                let box = new THREE.Box3().setFromObject(obj);
                wallBoxes.push(box);
            }
        });
        scene.add(room);
    });

    // Load robot
    loader.load(new URL('../assets/robot.glb', import.meta.url).href, gltf => {
        robot = gltf.scene;
        // place the robot slightly away from the room walls to avoid immediate collisions
        robot.position.set(0, 0, -2);
        scene.add(robot);

        // robot collider
        robotBox = new THREE.Box3().setFromObject(robot);
        console.log('robot loaded; robotBox:', robotBox);
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

function onKeyDown(e) {
    console.log(e);
    if (e.code === "KeyW") moveForward = true;
    if (e.code === "KeyS") moveBackward = true;
    if (e.code === "KeyA") moveLeft = true;
    if (e.code === "KeyD") moveRight = true;
}

function onKeyUp(e) {
    if (e.code === "KeyW") moveForward = false;
    if (e.code === "KeyS") moveBackward = false;
    if (e.code === "KeyA") moveLeft = false;
    if (e.code === "KeyD") moveRight = false;
}

function animate() {
    requestAnimationFrame(animate);

    if (robot) moveRobot();

    renderer.render(scene, camera);
}

function moveRobot() {
    const direction = new THREE.Vector3();

    if (moveForward) direction.z -= speed;
    if (moveBackward) direction.z += speed;
    if (moveLeft) direction.x -= speed;
    if (moveRight) direction.x += speed;

    // Predict next position (clone robot for collision test)
    const nextPosition = robot.position.clone().add(direction);
    
    // Update future bounding box
    const futureBox = robotBox.clone();
    futureBox.translate(direction);

    // Check wall collision
    for (let wall of wallBoxes) {
        if (futureBox.intersectsBox(wall)) {
            // collision → stop movement
            console.log('movement blocked by wall box', wall);
            return;
        }
    }

    // No collision → apply move
    robot.position.copy(nextPosition);
    robotBox.copy(futureBox);
}
