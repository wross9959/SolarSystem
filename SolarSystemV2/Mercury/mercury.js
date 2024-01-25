// mercury.js
let scene, camera, renderer, mercuryMesh;

function initVisualization() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.planet-visualization').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    const mercuryTexture = textureLoader.load('mercuryPlanetTexture.jpg'); // Replace with path to your texture

    // Mercury geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ map: mercuryTexture });
    mercuryMesh = new THREE.Mesh(geometry, material);

    // Position the Mercury mesh
    mercuryMesh.position.set(0, 0, 0);
    scene.add(mercuryMesh);

    // Start the animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate Mercury
    mercuryMesh.rotation.y += 0.005;

    // Render the scene
    renderer.render(scene, camera);
}

// Event listeners for responsive design
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function returnToOverview() {
    window.location.href = 'http://127.0.0.1:5500/index.html';
}
/* for when live
function returnToOverview() {
    window.location.href = '../index.html'; // Goes up one directory level to the root
}
*/

// Initialize the visualization when the window loads

initVisualization();
