let scene, camera, renderer, solarSystem, orbitControls, selectedPlanet;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isFollowingPlanet = false;

function init() {
    window.addEventListener('click', onDocumentMouseClick, false);

    // Scene, Camera, and Renderer Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
    scene.add(sunLight);

    // Solar system group
    solarSystem = new THREE.Group();
    scene.add(solarSystem);

    // Sun
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('\\Sun\\sunTexture.jpg'); // Update with your texture path
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = "Sun";
    solarSystem.add(sun);

    // Sunlight
    const sunlight = new THREE.PointLight(0xffffff, 1.5, 500);
    sunlight.position.set(0, 0, 0);
    scene.add(sunlight);
    solarSystem.add(sun);

    // Textures
    const mercuryTexture = textureLoader.load('Mercury\\mercuryPlanetTexture.jpg'); // Mercury texture
    const venusTexture = textureLoader.load('venus\\venusTexture.jpg'); // Venus texture
    const earthTexture = textureLoader.load('earth\\earthTexture.jpg'); // Earth texture
    const marsTexture = textureLoader.load('mars\\marsTexture.jpg'); // Mars texture
    const jupiterTexture = textureLoader.load('Jupiter\\jupiterTexture.jpg'); // Jupiter texture
    const saturnTexture = textureLoader.load('saturn\\saturnTexture.jpg'); // Saturn texture
    const saturnRingsTexture = textureLoader.load('saturn\\saturnRingTexture.jpg'); // Saturn's rings texture
    const uranusTexture = textureLoader.load('uranus\\uranusTexture.jpg'); // Uranus texture
    const uranusRingTexture = textureLoader.load('uranus\\uranusRingTexture.jpg'); // Saturn's rings texture
    const neptuneTexture = textureLoader.load('neptune\\neptuneTexture.jpg'); // Neptune texture

    // Planets
    const planets = [
        { name: "Mercury", texture: mercuryTexture, size: 1.5, distance: 10 },   
        { name: "Venus", texture: venusTexture, size: 2, distance: 18 },       
        { name: "Earth", texture: earthTexture, size: 2, distance: 30 },        
        { name: "Mars", texture: marsTexture, size: 1.8, distance: 45 },     
        { name: "Jupiter", texture: jupiterTexture, size: 6, distance: 60 },    
        { name: "Saturn", texture: saturnTexture, size: 5, distance: 100, rings: saturnRingsTexture },     
        { name: "Uranus", texture: uranusTexture, size: 3.5, distance: 160, rings: uranusRingTexture },   
        { name: "Neptune", texture: neptuneTexture, size: 3.3, distance: 200 },  

    ];

    planets.forEach(planet => {
        const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const planetMaterial = new THREE.MeshLambertMaterial({ map: planet.texture || new THREE.Texture() });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.x = planet.distance;
        planetMesh.name = planet.name; // Set the name for each planet mesh
        solarSystem.add(planetMesh);

        // Saturn's Rings
        if (planet.name === "Saturn" || planet.name === "Uranus") {
            const ringsTexture = textureLoader.load(planet.name === "Saturn" ? 'saturn\\saturnRingTexture.jpg' : 'uranus\\uranusRingTexture.jpg');
            const ringsGeometry = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2, 64);
            const ringsMaterial = new THREE.MeshBasicMaterial({ map: ringsTexture, side: THREE.DoubleSide });
            const ringsMesh = new THREE.Mesh(ringsGeometry, ringsMaterial);
            ringsMesh.position.x = planet.distance;
            ringsMesh.rotation.x = -0.5 * Math.PI; // Orient the rings
            solarSystem.add(ringsMesh);
        }
    });

    addStarfield();
    // Initialize OrbitControls
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableZoom = false; // Disable zooming with OrbitControls

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onDocumentMouseClick, false); // Moved here
    selectedPlanet = null;
}

function onDocumentMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(solarSystem.children, true);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        handlePlanetClick(clickedPlanet.name); // Redirect based on clicked planet
    }
}
function handlePlanetClick(planetName) {
    // Define the URL mappings for each planet
    const planetUrls = {
        "Sun": "Sun/Sun.html",
        "Mercury": "Mercury/Mercury.html",
        "Venus": "Venus/Venus.html",
        "Earth": "Earth/Earth.html",
        "Mars": "Mars/Mars.html",
        "Jupiter": "Jupiter/Jupiter.html",
        "Saturn": "Saturn/Saturn.html",
        "Uranus": "Uranus/Uranus.html",
        "Neptune": "Neptune/Neptune.html"
    };

    const url = planetUrls[planetName];
    if (url) {
        // Redirect to the planet's page
        window.location.href = url;
    }
}


function animate() {
    requestAnimationFrame(animate);
    if (isFollowingPlanet && selectedPlanet) {
        // Calculate the world position of the selected planet
        const planetWorldPosition = new THREE.Vector3();
        selectedPlanet.getWorldPosition(planetWorldPosition);

        // Update the camera to constantly look at the planet
        camera.lookAt(planetWorldPosition);

        // Position the camera at a fixed offset from the planet
        const distance = 20; // The desired distance from the planet
        const offset = new THREE.Vector3(distance, distance, distance); // Adjust this offset as needed
        const cameraPosition = planetWorldPosition.clone().add(offset);

        // Smoothly interpolate the camera position
        camera.position.lerp(cameraPosition, 0.1); // Adjust the lerp value (0.1) for smoother or faster movement
    }
    // Rotate the solar system
    solarSystem.rotation.y += 0.001;
    // Update tween animations
    TWEEN.update();
    // Render the scene
    renderer.render(scene, camera);
}

function addStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
}

function onMouseMove(event) {
    window.addEventListener('click', onDocumentMouseClick, false);

    selectedPlanet = null;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function zoomToPlanet(planet) {
    isFollowingPlanet = true;
    orbitControls.target.copy(planet.position);
    // Define a target position which is a bit away from the planet
    const offset = 15 + planet.geometry.parameters.radius; // Adjust this value as needed
    const targetPosition = new THREE.Vector3().copy(planet.position).add(new THREE.Vector3(offset, 0, offset));
    const duration = 2000; // Duration of the animation in milliseconds

    // Tween for smooth animation (using tween.js)
    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    // Adjust camera to look at the planet
    new TWEEN.Tween(camera)
        .to({}, duration)
        .onUpdate(() => camera.lookAt(planet.position))
        .start();
}
function returnToOverview() {
    window.location.href = 'index.html'; // Assuming 'index.html' is your solar system overview page
}

init();
animate();
