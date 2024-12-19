import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export class World{
  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100,window.innerWidth / window.innerHeight,0.1,1000);
    this.renderer = new THREE.WebGLRenderer();
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.clock = new THREE.Clock();
    
    this.Models = [];
    this.ModelAnims = [];
  }
  async init(){
    this.dirLight.position.set(0, 200, 200);
    this.scene.add(this.dirLight);
    this.scene.add(this.ambientLight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x3b3b3b, 1);
    //this.renderer.setClearColor(0x000000, 1);
    document.body.appendChild(this.renderer.domElement);
    this.camera.position.z = 20;
  };
  coords() {
    const materialX = new THREE.LineBasicMaterial({ color: 0x0016bf, linewidth: 2 });
    const materialY = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const materialZ = new THREE.LineBasicMaterial({ color: 0x00ff15, linewidth: 2 });
    const geometryX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-50, 0, 0), new THREE.Vector3(50, 0, 0)]);
    const lineX = new THREE.Line(geometryX, materialX);
    this.scene.add(lineX);
    const geometryY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 50, 0)]);
    const lineY = new THREE.Line(geometryY, materialY);
    this.scene.add(lineY);
    const geometryZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -50), new THREE.Vector3(0, 0, 50)]);
    const lineZ = new THREE.Line(geometryZ, materialZ);
    this.scene.add(lineZ);
  }
  setRoom(model, anim){
    this.Models.push(model);
    if(anim){
      this.ModelAnims.push(anim);
    }
    this.scene.add(model);
  }
  addModel(model, anim){
    this.Models.push(model);
    if(anim){
      this.ModelAnims.push(anim);
    }
    this.scene.add(model);
  }
  updateModel(model, index){
    this.Models[i] = model;
  }
  getModel(index){
    return this.Models[i];
  }
  animate(){
    requestAnimationFrame(() => this.animate());
  	const delta = this.clock.getDelta();
    for (let mixer of this.ModelAnims) {
      if (mixer){ 
      	mixer.update(delta);
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}