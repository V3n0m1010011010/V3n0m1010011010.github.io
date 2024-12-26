import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
export class Model{
  	constructor(w = 1, h = 1, d = 1){
    	this.loader = new GLTFLoader();
      	this.model = null;
      	this.anim = null;
      	this.w = w;
      	this.h = h;
      	this.d = d;
  	}
	async loadModel(file){
      	return new Promise((resolve, reject) => {
    		this.loader.load(file, (gltf) => {
        		let model = gltf.scene;
				var mroot = model;
				var bbox = new THREE.Box3().setFromObject(mroot);
				var cent = bbox.getCenter(new THREE.Vector3());
				var size = bbox.getSize(new THREE.Vector3());
				var maxAxis = Math.max(size.x, size.y, size.z);
				mroot.scale.multiplyScalar(1.0 / maxAxis);
				bbox.setFromObject(mroot);
				bbox.getCenter(cent);
				bbox.getSize(size);
				mroot.position.copy(cent).multiplyScalar(-1);
				mroot.position.y-= (size.y * 0.5);
          		this.model = mroot;
        		let mixer = null;
        		if (gltf.animations && gltf.animations.length > 0) {
        			mixer = new THREE.AnimationMixer(model);
          			let action = mixer.clipAction(gltf.animations[0]);
          			action.play();
              		this.anim = mixer;
        		}
              	resolve(this.model);
    		}, undefined, (error) => { 
            	console.error("Fehler beim Laden des Modells:", error);
          		reject(error);
			});
        });
	}
  	setPos(x, y, z){
    	this.model.position.set(x, y, z);
    }
  	setSize(w, h, d){
    	this.model.scale.set(w, h, d);
    }
  	setSizeM(m){
		this.model.scale.multiplyScalar(m);
    }
  	
}