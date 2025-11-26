import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 90);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});

const loader = new GLTFLoader();

const clock = new THREE.Clock();

// Bottom banner element for showing loading state (optional)
const bottomBanner = typeof document !== 'undefined' ? document.getElementById('bottomBanner') : null;
const bottomBannerOriginalText = bottomBanner ? bottomBanner.innerText : '';
function setBottomLoading(percent) {
    if (!bottomBanner) return;
    if (typeof percent === 'number') {
        bottomBanner.innerText = `LOADING... ${percent}%`;
    } else {
        bottomBanner.innerText = 'LOADING...';
    }
}
function clearBottomLoading() {
    if (!bottomBanner) return;
    bottomBanner.innerText = bottomBannerOriginalText;
}

// Animation mixer for robot
let robotMixer = null;
// Bounding boxes and helpers
let robotBox = null;
let robotBoxHelper = null;
let logoCollisionBox = null;
let logoCollisionBoxHelper = null;
// Collision state for laravel-robot interaction
let collisionState = 'free'; // 'free' | 'raising' | 'waiting' | 'lowering'
let logoBoxOriginalY = null;
let logoBoxTargetY = null;
const logoBoxRaiseAmount = 7; // how much to lift the laravel model
const logoBoxRiseSpeed = 0.06; // speed to raise/lower per frame

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

scene.background = new THREE.Color(0xebebeb);
// scene.background = new THREE.Color(0x111111);


// spotLight that follows robot
// const spotLight = new THREE.SpotLight(0xffffff, 100);
// spotLight.castShadow = true;
// spotLight.position.set(0, 100, 0); // initial position
// spotLight.angle = Math.PI / 4; // wider cone angle
// spotLight.distance = 100; // increase distance
// spotLight.penumbra = 0.5; // softer edge
// spotLight.decay = 2; // realistic decay
// spotLight.target.position.set(0, 0, 0); // target the center of the scene

// Soft shadow (PCF filtering)
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const dLight = new THREE.DirectionalLight(0xffffff, 5);
dLight.position.set(40, 80, 60);
dLight.target.position.set(0, 3, 50)
dLight.castShadow = true;

// dLight.shadow.camera.bottom = -35;
// dLight.shadow.camera.top = 35;
// dLight.shadow.camera.left = -45;
// dLight.shadow.camera.right = 45;
// dLight.shadow.camera.right = 35;
scene.add(dLight);
scene.add(dLight.target);


// Model placeholder (will load robot.glb)
let robotModel = null;
// show initial loading state
setBottomLoading();
loader.load(new URL('../assets/robot-new.glb', import.meta.url).href,
    (gltf) => {
        robotModel = gltf.scene;
        // optional: adjust scale/position if the robotModel is large or offset
        robotModel.position.set(0, 3, 30);
        robotModel.rotateY(1)
        robotModel.scale.set(10, 10, 10);
        // enable shadows for all mesh children
        robotModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                // ensure standard material reacts to lights
                if (!node.material) return;
            }
        });
        // If the GLTF contains animations, create a mixer and play the first clip
        if (gltf.animations && gltf.animations.length > 0) {
            robotMixer = new THREE.AnimationMixer(robotModel);
            const clip = gltf.animations[0];
            const action = robotMixer.clipAction(clip);
            action.play();
            // optional: loop settings (default is LoopRepeat)
            // action.setLoop(THREE.LoopRepeat);
        }
        scene.add(robotModel);
        // create bounding box and helper for robot (will be updated every frame)
        robotBox = new THREE.Box3().setFromObject(robotModel);
        robotBoxHelper = new THREE.Box3Helper(robotBox, 0xff0000);
        // scene.add(robotBoxHelper);
        // clear the loading hint
        clearBottomLoading();
    },
    (xhr) => {
        // xhr.lengthComputable may be false on some environments; fallback to generic LOADING...
        if (xhr && xhr.lengthComputable) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            setBottomLoading(pct);
        } else {
            setBottomLoading();
        }
    },
    (err) => {
        console.error('Error loading GLB robotModel:', err);
        if (bottomBanner) bottomBanner.innerText = 'LOADING FAILED';
    }
);


// Raycaster + mouse target for follow behavior
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseTarget = null; // THREE.Vector3 world point on plane

window.addEventListener('mousemove', (event) => {
    // Convert mouse to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera to the mouse position and intersect with the ground plane
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        // Keep the robot's current Y so it doesn't sink into the plane
        const p = intersects[0].point.clone();
        mouseTarget = new THREE.Vector3(p.x, robotModel ? robotModel.position.y : p.y, p.z);
    }
});

// Helper to handle pointer/touch coordinates and set the mouseTarget (used for mobile taps)
function handlePointerCoords(clientX, clientY) {
    // Convert to normalized device coordinates (-1 to +1)
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        const p = intersects[0].point.clone();
        mouseTarget = new THREE.Vector3(p.x, robotModel ? robotModel.position.y : p.y, p.z);
    }
}

// Use Pointer Events where available (covers mouse and touch). Prevent default on touch so page doesn't scroll.
window.addEventListener('pointerdown', (e) => {
    // Only handle primary button / primary pointer
    if (e.isPrimary === false) return;
    e.preventDefault();
    handlePointerCoords(e.clientX, e.clientY);
});

// Fallback for older browsers: touchstart
window.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    // preventDefault to avoid scrolling while interacting
    e.preventDefault();
    const t = e.touches[0];
    handlePointerCoords(t.clientX, t.clientY);
}, { passive: false });


// Ground plane (white)
const planeGeometry = new THREE.PlaneGeometry(300, 200);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const textureLoader = new THREE.TextureLoader();

// textureLoader.load(new URL('../img/background.jpg', import.meta.url).href, function(texture) {
//     scene.background = texture;
// })

const materials = [
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/mysql.png', import.meta.url).href) }), // right
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/react.png', import.meta.url).href) }), // left
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/blank.png', import.meta.url).href) }), // bottom
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/blank.png', import.meta.url).href) }), // top
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/laravel.png', import.meta.url).href) }), // front
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(new URL('../img/nginx.png', import.meta.url).href) })  // back
];

const logoBoxGeometry = new THREE.BoxGeometry();
const logoBox = new THREE.Mesh(logoBoxGeometry, materials);
logoBox.position.set(0, 6, 0)
logoBox.scale.set(10,10,10);
logoBox.castShadow = true;
scene.add(logoBox);

logoCollisionBox = new THREE.Box3().setFromObject(logoBox);
// logoCollisionBoxHelper = new THREE.Box3Helper(logoCollisionBox, 0x0000ff);
// scene.add(logoCollisionBoxHelper);



// const edges = new THREE.EdgesGeometry(logoBoxGeometry);
// const line = new THREE.LineSegments(
//     edges,
//     new THREE.LineBasicMaterial({ color: 0x000000 })
// );
// // Render on top so edges are always visible
// line.material.depthTest = false;
// line.renderOrder = 1;
// // Attach to the box so position/scale/rotation are inherited
// logoBox.add(line);

// Controls
// const control = new OrbitControls(camera, renderer.domElement);

// Helpers
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const dLightShadowHelper = new THREE.CameraHelper(dLight.shadow.camera);
// scene.add(dLightShadowHelper)

// const dLightHleper = new THREE.DirectionalLightHelper(dLight, 1);
// scene.add(dLightHleper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
// scene.add(spotLightHelper);

// const spotLightShadowHleper = new  THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightShadowHleper);


// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    logoBox.rotation.y += 0.01;

    const delta = clock.getDelta();
    if (robotMixer) robotMixer.update(delta);

    // Update robot bounding box helper (robot moves)
    if (robotModel && robotBox && robotBoxHelper) {
        robotBox.setFromObject(robotModel);
        // robotBoxHelper.update();
    }

    // If there's a target from mouse, rotate robotModel toward it first, then follow slowly
    if (robotModel && mouseTarget) {
        // keep robot at its current height
        const targetPos = new THREE.Vector3(mouseTarget.x, robotModel.position.y, mouseTarget.z);

        // Compute direction to target (X/Z plane)
        const dx = targetPos.x - robotModel.position.x;
        const dz = targetPos.z - robotModel.position.z;
        const distanceSq = dx * dx + dz * dz;

        if (distanceSq > 10 && !checkCollisions()) {
            // desired angle: note the swap to align model forward
            // Add 90 degree offset so robot faces mouse
            const desiredAngle = Math.atan2(dx, dz) + Math.PI / 2;
            let curY = robotModel.rotation.y;
            // normalize angle difference to [-PI,PI]
            let delta = desiredAngle - curY;
            while (delta > Math.PI) delta -= Math.PI * 2;
            while (delta < -Math.PI) delta += Math.PI * 2;

            // rotate with a higher factor so robot turns to face target first
            const rotateFactor = 0.18;
            robotModel.rotation.y = curY + delta * rotateFactor;

            // Only move toward the target when the robot is mostly facing it
            const facingThreshold = 0.18; // radians (~10 degrees)
            if (Math.abs(delta) < facingThreshold) {
                // move slowly toward target with a small lerp factor
                const moveLerp = 0.01;
                robotModel.position.lerp(targetPos, moveLerp);
            }
        }
        // Move spotLight above robot
        // spotLight.position.set(robotModel.position.x, robotModel.position.y + 20, robotModel.position.z);
        // spotLight.target.position.set(robotModel.position.x, robotModel.position.y, robotModel.position.z);
        // scene.add(spotLight.target); // Add the target to the scene
        // spotLightHelper.update();

        // dLight.target.position.set(robotModel.position.x, robotModel.position.y, robotModel.position.z);
        dLight.target.position.copy(robotModel.position);
        // scene.add(dLight.target); // Ensure the target is part of the scene so the light updates
    }

    if (collisionState === 'waiting' && logoBoxOriginalY !== null && robotModel) {
        const dxPassed = robotModel.position.x - logoBox.position.x;
        const dzPassed = robotModel.position.z - logoBox.position.z;
        const passedDistSq = dxPassed * dxPassed + dzPassed * dzPassed;
        const passThresholdSq = 100; // squared distance threshold (5 units)
        if (passedDistSq > passThresholdSq) {
            collisionState = 'lowering';
        }
    }

    // Handle lowering state: slowly bring logoBox back to original Y
    if (collisionState === 'lowering' && logoBoxOriginalY !== null) {
        logoBox.position.y -= logoBoxRiseSpeed;
        if (logoBox.position.y <= logoBoxOriginalY + 0.01) {
            logoBox.position.y = logoBoxOriginalY;
            // restore state
            collisionState = 'free';
            logoBoxOriginalY = null;
            logoBoxTargetY = null;
        }
        // if (logoCollisionBox) {
        //     logoCollisionBox.setFromObject(logoBox);
        // }
    }

    // control.update();

    renderer.render(scene, camera);
}

animate();

function checkCollisions()
{

    // let robotPausedForCollision = false;
    // Basic guards
    if (!robotBox || !logoCollisionBox || !robotModel || !logoBox) return false;

    // If we are already in the process of raising, keep raising and block movement until raised
    if (collisionState === 'raising') {
        // raise smoothly toward target
        logoBox.position.y += (logoBoxTargetY - logoBox.position.y) * 0.08;
        // if nearly reached target, snap and finish raising
        if (Math.abs(logoBox.position.y - logoBoxTargetY) < 0.1) {
            logoBox.position.y = logoBoxTargetY;
            collisionState = 'waiting';
            // robotPausedForCollision = false; // allow robot to move now
        }
        // logoCollisionBox.setFromObject(logoBox);
        return true; // while raising, block movement
    }

    // If collision already handled (waiting or lowering), do not start new raise
    if (collisionState === 'waiting' || collisionState === 'lowering') {
        return false;
    }

    // Normal collision detection: if boxes intersect, start raising and block robot
    if (robotBox.intersectsBox(logoCollisionBox)) {
        // initialize raise
        logoBoxOriginalY = logoBox.position.y;
        logoBoxTargetY = logoBoxOriginalY + logoBoxRaiseAmount;
        collisionState = 'raising';
        return true;
    }

    return false;
}