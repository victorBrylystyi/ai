import { EventEmitter } from "events";
import * as THREE from "three";

class AssetsLoader extends EventEmitter{
    constructor (assets){
        super();
        this.name = 'loader';
        this.assets = assets;
    }
    load(){
        if (this.assets===undefined || this.assets.length==0) {
            console.warn('Loader. No any assets!'); 
            return;
        }
        this.emit('start');
        let loaded  = 0; 
        const assetsSize = this.assets.length;
        this.res = new Map();
        for (let i=0;i<this.assets.length;i++){
            switch (this.assets[i].type){
                case "texture":
                    new THREE.TextureLoader()
                    .setPath(this.assets[i].path)
                    .load(this.assets[i].url,(map)=>{
                        this.res.set(this.assets[i].name, map);
                        loaded++;
                        this.emit('progress',{
                            value: loaded/assetsSize,
                            name: this.assets[i].name,
                            map: map,
                            asset:this.assets[i]
                        });
                        if (loaded>=assetsSize){
                            this.emit('load');
                        }
                    });
                break;
                default:
                     console.warn(`Dismatch type of asset ${this.assets[i].name} !`);
                break;
            }
        }
    }
}

export default AssetsLoader;