import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );

    //camer control
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();
    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load(['sky1.jpg',
        'sky1.jpg',
        'sky1.jpg',
        'sky1.jpg',
        'sky1.jpg',
        'sky1.jpg',]);
        scene.background = texture;
    }
    //plane
	{
		const planeSize = 40;
		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'ground.jpg' );
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}
    //random color
    /*var randomColor = function(){
        return '0x'+(Math.random()*0xffffff<<0).toString(16); 
    }
    const rcolor = randomColor();*/
    //ballon
    function makeBallon(x,y,z) {
        const balloonRadius = 1.5;
        const balloonWidthSegments = 20;
        const balloonHeightSegments = 20;
        const balloonGeo = new THREE.SphereGeometry(balloonRadius, balloonWidthSegments, balloonHeightSegments);
        
        const balloonMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 }); // Red color
        
        const balloonMesh = new THREE.Mesh(balloonGeo, balloonMaterial);
        
        // Position the balloon
        balloonMesh.position.set(x, y, z);
        
        scene.add(balloonMesh);
        return balloonMesh;
    }
    const cubes = [
        makeBallon(0,10,0),
        makeBallon(5,10,5),
        makeBallon(4,8,10),
        makeBallon(1,7,-10),
        makeBallon(16,8,11),
    ];
    function makeStage(x,y,z){
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'wood.jpg' );
	    texture.colorSpace = THREE.SRGBColorSpace;
	    const material = new THREE.MeshBasicMaterial( {
		    map: texture
	    } );
		const stageWidth = x;
        const stageHeight = y;
        const stageDepth = z;
		const cubeGeo = new THREE.BoxGeometry( stageWidth, stageHeight, stageDepth );
		const mesh = new THREE.Mesh( cubeGeo, material);
		mesh.position.set( 5, 1, 0 );
		scene.add( mesh );
    }
    makeStage(8,2,12);
    //make the people
    function makePeople(radiusTop,radiusBottom,height,x1,y1,z1,colors){
        const bodyg = new THREE.CylinderGeometry(radiusTop,radiusBottom,height,32);
        const material = new THREE.MeshBasicMaterial({color:colors});
        const body = new THREE.Mesh(bodyg, material);
        scene.add(body);
        body.position.set(x1,y1,z1);
        const headg = new THREE.SphereGeometry(0.5,20,20);
        const material1= new THREE.MeshBasicMaterial({color:colors});
        const head = new THREE.Mesh(headg,material1);
        scene.add(head);
        const headh = y1 + 1
        head.position.set(x1,headh,z1);
    }
    makePeople(0.2,0.5,1.5,-4,1,2,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,4,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,6,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,8,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,0,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,-2,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,-4,0x971d9f);
    makePeople(0.2,0.5,1.5,-4,1,-6,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,2,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,4,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,6,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,-2,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,-4,0x971d9f);
    makePeople(0.2,0.5,1.5,-6,1,0,0x971d9f);
    makePeople(0.2,0.5,1.5,-8,1,-2,0x971d9f);
    makePeople(0.2,0.5,1.5,-8,1,2,0x9a1919);
    makePeople(0.2,0.5,1.5,-8,1,0,0xdef811);
    makePeople(0.2,0.5,1.5,-8,1,4,0xde3a2c);
    //camera
    class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}

	function updateCamera() {

		camera.updateProjectionMatrix();

	}

    //light
	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}
    class DegRadHelper {

		constructor( obj, prop ) {

			this.obj = obj;
			this.prop = prop;

		}
		get value() {

			return THREE.MathUtils.radToDeg( this.obj[ this.prop ] );

		}
		set value( v ) {

			this.obj[ this.prop ] = THREE.MathUtils.degToRad( v );

		}

	}
	function makeXYZGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', - 20, 30 ).onChange( onChangeFn );
		folder.add( vector3, 'y', 0, 30 ).onChange( onChangeFn );
		folder.add( vector3, 'z', - 20, 30 ).onChange( onChangeFn );
		folder.close();

	}
    function makeColorGUI(gui,name,light){
        const folder = gui.addFolder( name );
        folder.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
		folder.add( light, 'intensity', 0, 250, 1 );
        folder.close();
    }
    function makeSpotLightGUI(){
        const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.SpotLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

		const helper = new THREE.SpotLightHelper( light );
		scene.add( helper );

		function updateLight() {

			light.target.updateMatrixWorld();
			helper.update();

		}

		updateLight();

		const gui = new GUI();
        gui.domElement.style.postion = 'absolute';
        gui.domElement.style.top = '0';
        gui.domElement.style.right= '0';
		//gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
		//gui.add( light, 'intensity', 0, 250, 1 );
		gui.add( light, 'distance', 0, 40 ).onChange( updateLight );
		gui.add( new DegRadHelper( light, 'angle' ), 'value', 0, 90 ).name( 'angle' ).onChange( updateLight );
		gui.add( light, 'penumbra', 0, 1, 0.01 );
        makeColorGUI(gui,'spotlight-color', light);
		makeXYZGUI( gui, light.position, 'spotlight-position', updateLight );
		makeXYZGUI( gui, light.target.position, 'spotlight-target', updateLight );
        gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
        const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
        gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
        gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );

        const controls = new OrbitControls( camera, canvas );
        controls.target.set( 0, 5, 0 );
        controls.update();

    }
    makeSpotLightGUI();

    function makeDiretionaLightGUI(){
        const Ambcolor = 0x0b0b09;
        const Ambintensity = 1;
        const Amblight = new THREE.AmbientLight(Ambcolor, Ambintensity);
        scene.add(Amblight);
        const color = 0xeed21b;
		const intensity = 1;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 5, 5, -11 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

		const helper = new THREE.DirectionalLightHelper( light );
		scene.add( helper );

		function updateLight() {

			light.target.updateMatrixWorld();
			helper.update();

		}

		updateLight();

		const gui = new GUI();
        gui.domElement.style.postion = 'absolute';
        gui.domElement.style.top = '0';
        gui.domElement.style.left= '0';
		//gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
		//gui.add( light, 'intensity', 0, 5, 0.01 );
        makeColorGUI(gui,'Direction-color', light),
        makeColorGUI(gui, 'Ambient-Light',Amblight);
		makeXYZGUI( gui, light.position, 'Direction-position', updateLight );
		makeXYZGUI( gui, light.target.position, 'Direction-target', updateLight );
    }
    makeDiretionaLightGUI();
	{
        var axix = new THREE.Vector3(-14,0-5);
        const mtlLoader = new MTLLoader();
        mtlLoader.load('light.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('light.obj',(root)=>{
                root.scale.set(0.5,0.5,0.5);
                root.position.set(5,0,-12);
                //root.rotateY(Math.pi/4);
                //root.rotateOnAxis(axix,Math.PI/8);
                scene.add(root);
            });
        });
    }
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render(time) {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}
        time *= 0.001; // convert time to seconds
    
        cubes.forEach( ( cube, ndx ) => {

            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.y = rot;

        } );
		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
