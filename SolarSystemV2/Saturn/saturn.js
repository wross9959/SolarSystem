// Saturn.js
let scene, camera, renderer, SaturnMesh, ringsMesh;

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
    const SaturnTexture = textureLoader.load('SaturnTexture.jpg'); // Replace with path to your texture
    
    // Saturn Rings
    const ringsTexture = textureLoader.load('SaturnRingsTexture.jpg'); // Replace with path to your rings texture
    const ringsGeometry = new THREE.RingGeometry(1.1, 2, 64); // Adjust inner and outer radius as needed
    const ringsMaterial = new THREE.MeshBasicMaterial({ 
        map: ringsTexture, 
        side: THREE.DoubleSide,
        transparent: true 
    });
    ringsMesh = new THREE.Mesh(ringsGeometry, ringsMaterial);

    // Rotate the rings to be visible from the camera angle
    const ringAngle = Math.PI / 3; // Adjust this angle as needed
    ringsMesh.rotation.x = ringAngle; // Tilt the rings
    scene.add(ringsMesh);

    // Saturn geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ map: SaturnTexture });
    SaturnMesh = new THREE.Mesh(geometry, material);

    // Position the Saturn mesh
    SaturnMesh.position.set(0, 0, 0);
    scene.add(SaturnMesh);

    // Start the animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate Saturn and its Rings
    SaturnMesh.rotation.y += 0.005;
    ringsMesh.rotation.y += 0.005; // Rotate the rings at the same speed as Saturn

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
