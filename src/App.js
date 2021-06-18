import * as THREE from "three";
import Effect from "./Effect";
import AssetsLoader from "./AssetsLoader";
import defSett from "./defSettings.json";

class App {
    constructor(element,resources,settings){
        this.name = 'manager';
        this.domElement = element;
        this.appConfig = {
            fps: 60,
            dT: 0,
            tPrev: window.performance.now(),
            speed: 0.001,
            fi: 0,
        };
        this.currentScene = null;
        this.appLoader = new AssetsLoader(resources);
        this.userSettings = settings;
        this._defSettings = defSett;
        this.actualSettings = this.createSettings();
        this.processId = null;
        this.pause = false;
        this.prepareCanvas();
        //this.init();
        return this;
    }
    set defSettings(v){
        console.warn('Please, dont touch default settings! This is for your good =) Best regards.')
    }
    get defSettings(){
        return this._defSettings;
    }
    resize(){
        this.canvas.width = this.domElement.clientWidth;
        this.canvas.height = this.domElement.clientHeight;

        this.currentScene.resizeAction();
        this.renderer.setSize(this.canvas.width, this.canvas.height); // 26 May 2021 
    }
    prepareCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        this.canvas.width = this.domElement.clientWidth;
        this.canvas.height = this.domElement.clientHeight;

        this.domElement.appendChild(this.canvas);
    }
    createSettings(){ 
        return {
            app:{
                speedRotateFireFlies: this.userSettings[0].speedRotateFireFlies || this.defSettings[0].speedRotateFireFlies,
                speedAnimation: this.userSettings[0].speedAnimation || this.defSettings[0].speedAnimation,
                backgroundColor: parseInt(this.userSettings[0].backgroundColor,16) || parseInt(this.defSettings[0].backgroundColor,16),
            },
            smoke:{
                smokeOpacity: this.userSettings[1].smokeOpacity || this.defSettings[1].smokeOpacity,
                smokeColor: parseInt(this.userSettings[1].smokeColor,16) || parseInt(this.defSettings[1].smokeColor,16),
            },
        };
    }//"0x8354ee"
    loadAssets(){
        this.appLoader.on('start',()=>{
            this.startAnimation();
        });
        this.appLoader.on('progress', (d)=>{
            switch(d.name){
                case "smoke":
                    this.currentScene.smoke.material.map = d.map;
                    this.currentScene.addSmokeParticles();
                    break;
                    case "firefliesV1":
                        this.currentScene.fireFlies.material.map = d.map;
                        this.currentScene.scene.add(this.currentScene.fireFlies.particles);
                        this.currentScene.fireFliesV3.material.map = d.map;
                        this.currentScene.scene.add(this.currentScene.fireFliesV3.particles);
                        break;
                        case "firefliesV2":
                            this.currentScene.fireFliesV2.material.map = d.map;
                            this.currentScene.scene.add(this.currentScene.fireFliesV2.particles);
                            break;
                            case "centerImage":
                                this.currentScene.centralPlane = {
                                    material: new THREE.MeshStandardMaterial({
                                        map: d.map,
                                        blending: THREE.AdditiveBlending,
                                        transparent: true,
                                    }),
                                    geometry: new THREE.BoxGeometry(d.map.image.width * d.asset.scale,d.map.image.height * d.asset.scale,1),
                                    mesh: {},
                                };
                                this.currentScene.centralPlane.mesh = new THREE.Mesh(this.currentScene.centralPlane.geometry,this.currentScene.centralPlane.material);
                                this.currentScene.centralPlane.mesh.position.z = 0;
                                this.currentScene.centralPlane.mesh.rotation.z = Math.PI;
                                this.currentScene.scene.add(this.currentScene.centralPlane.mesh);
                                break;
            };
        })
        this.appLoader.on('load', ()=>{
            this.currentScene.assets = this.appLoader.res;
        });
        this.appLoader.load();
    }
    init(){
        this.renderer = new THREE.WebGLRenderer({canvas:this.canvas});
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        window.addEventListener('resize',()=>{
            this.resize();
        });

        this.currentScene = new Effect('smoke+fireflies',this.canvas,this.actualSettings);
        this.loadAssets();
    }
    animate(){
        this.appConfig.dT = (window.performance.now() - this.appConfig.tPrev) * this.appConfig.fps / 1000;
        this.appConfig.fi += this.appConfig.speed * this.appConfig.dT * this.actualSettings.app.speedAnimation;

        this.currentScene.update(this.appConfig.fi);  // update effect 
        this.renderer.render(this.currentScene.scene,this.currentScene.camera);

        this.appConfig.tPrev = window.performance.now();
    }
    stopAnimation(){
        cancelAnimationFrame(this.processId);
    }
    startAnimation(){
        this.appConfig.tPrev = window.performance.now();
        this.render();
    }
    render(){
        this.animate();
        this.processId = requestAnimationFrame(()=>{
            this.render();
        });
    }
}





export default App; 