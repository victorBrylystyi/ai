import * as THREE from "three";

class Effect {
    constructor(name='default effect',canvas,sett){
        this.name = name;
        this.canvas = canvas;
        this.camera = new THREE.OrthographicCamera( -this.canvas.clientWidth/2, this.canvas.clientWidth/2,
                                                    -this.canvas.clientHeight/2,this.canvas.clientHeight/2,
                                                    -1000,1000);
        this.scene = new THREE.Scene();
        this.assets = null;
        this.settings = sett;
        this.smoke = { 
            material: new THREE.MeshLambertMaterial({
                color: this.settings.smoke.smokeColor, 
                opacity: this.settings.smoke.smokeOpacity,
                blending: THREE.AdditiveBlending, 
                transparent: true,
            }), 
            geometry: new THREE.BoxGeometry(1000,1000,1),
            particles: [],
        };
        this.fireFlies = {
            material: new THREE.PointsMaterial( {
                color: 0xffffff,
                size: 100,
                blending: THREE.AdditiveBlending,
                depthTest: false, 
                }),
            geometry: new THREE.BufferGeometry(),
            particles: {},
        };
        this.fireFliesV3 = {
                material: new THREE.MeshBasicMaterial( {
                    color: 0xffffff,
                    blending: THREE.AdditiveBlending,
                    transparent:true,
                    }),
            geometry: new THREE.BoxGeometry(150,150,1),
            particles: {},
        };
        this.fireFliesV2 = {
            material: new THREE.PointsMaterial( {
                color: 0xffffff,
                size: 100,
                blending: THREE.AdditiveBlending,
                depthTest: false, 
                }),
            geometry: new THREE.BufferGeometry(),
            particles: {},
        };
        this.defaultWidth = 1440;//1920; // 26 May 2021 // add default width 
        this.init();
        this.resizeScene(); // 26 May 2021 
    }
    init(){
        this.scene.background = new THREE.Color(this.settings.app.backgroundColor);
        
        this.scene.fog = new THREE.FogExp2(0x000000 ,0.05);

        this.addLight();

        const vertexFireFliesSmall = this.createVertices(7);
        const vertexFireFliesBig = this.createVertices(10);
        const fireFliesStartPosition = 0;
        
        this.fireFliesV3.particles = new THREE.Mesh(this.fireFliesV3.geometry,this.fireFliesV3.material);
        this.fireFlies.geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertexFireFliesSmall,3));
        this.fireFlies.particles = new THREE.Points(this.fireFlies.geometry,this.fireFlies.material);
        this.fireFlies.particles.position.z = fireFliesStartPosition;
        this.fireFliesV2.geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertexFireFliesBig,3));
        this.fireFliesV2.particles = new THREE.Points(this.fireFliesV2.geometry,this.fireFliesV2.material);
        this.fireFliesV2.particles.position.z = fireFliesStartPosition;

        this.fireFlies.particles.visible = true;
        this.fireFliesV2.particles.visible = true;
        this.fireFliesV3.particles.visible = true;
    }
    addLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        this.scene.add(light);
    }
    createVertices(num){
        let vertices = [];
        for (let i=0;i<num;i++) {
            const x = this.getRandomArbitrary(-1,1) * 200;
            const y = this.getRandomArbitrary(-1,1) * 200;
            const z = this.getRandomArbitrary(-1,1) * 200;
            vertices.push(x,y,z);
        }
        return vertices;
    }
    getMapByName(name = ''){
        return this.assets.get(name);
    }
    addSmokeParticles(){      // 26 May 2021
        const numClouds = 40;
        const areaX = 300;
        const areaY = 200;
        const areaZ = 500;
        for (let p = 0; p < numClouds; p++) {

            let particle = new THREE.Mesh(this.smoke.geometry,this.smoke.material);

            particle.position.set(this.getRandomArbitrary(-2,2)  * areaX, 
                                  this.getRandomArbitrary(-2,2)  * areaY, 
                                  this.getRandomArbitrary(-1,1)  * areaZ);

            particle.rotation.z = this.getRandomArbitrary(-2,2) * 360;
            
            this.smoke.particles.push(particle);

            this.scene.add(particle);
        }
    }
    getRandomArbitrary(min,max) {
        return Math.random() * (max - min) + min;
    }
    update(fi){
        this.evolveSmoke(fi);
        this.updateFireFlies(fi);
    }
    updateFireFlies(fi){
        let speed = fi * this.settings.app.speedRotateFireFlies;

        this.fireFliesV3.particles.position.z = Math.sin(fi*5) * 45;
        this.fireFliesV3.particles.position.x = Math.sin(fi*10) * 205;
        this.fireFliesV3.particles.position.y = Math.cos(fi*2) * 100;

        this.fireFlies.particles.rotation.y = -speed;
        this.fireFlies.particles.rotation.x =  speed;
        this.fireFlies.particles.rotation.z = -speed;
        this.fireFliesV2.particles.rotation.z = -speed;
        this.fireFliesV2.particles.rotation.x = -speed;
        this.fireFliesV2.particles.rotation.y =  speed;
    }
    evolveSmoke(fi) {
        for (let i = 0; i<this.smoke.particles.length;i++){
            let rndI = 0;
            if ((i<this.smoke.particles.length-5)&&(i>5)){
                rndI = Math.floor(this.getRandomArbitrary(-5,5));
            } 
            this.smoke.particles[i+rndI].rotation.z = fi * 1.1;
            this.smoke.particles[i].position.z = Math.sin(fi) * 15;
        }
    }
    resizeScene(){ // 26 May 2021
        let newScale = this.canvas.clientWidth/this.defaultWidth; //calculate new scale for scene objects 
        this.scene.scale.x = newScale;
        this.scene.scale.y = newScale;
    }
    resizeAction(){
        this.camera.left   = -this.canvas.clientWidth/2;
        this.camera.right  =  this.canvas.clientWidth/2;
        this.camera.top    = -this.canvas.clientHeight/2;
        this.camera.bottom =  this.canvas.clientHeight/2;
        this.resizeScene(); //  26 May 2021
        this.camera.updateProjectionMatrix();    
    }
}

export default Effect;