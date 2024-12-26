import { World } from "./world.js";
import { Model } from "./model.js";
console.log(1)

const world = new World();
await world.init();
world.camera.rotation.y = 45*Math.PI/180;
world.camera.position.set(10, 5, -10)
world.coords();

const city = await new Model();
await city.loadModel("./3dObjects/city.glb");
city.setSize(2,2,2);
city.setPos(0, 0, 0);
world.setRoom(city.model, city.anim);

const drone = await new Model();
await drone.loadModel("./3dObjects/comic_drone.glb");
drone.setPos(1, 5, -4);
drone.setSizeM(0.7);
world.addModel(drone.model, drone.anim);

const droneRobot = await new Model();
await droneRobot.loadModel("./3dObjects/mech_drone.glb");
droneRobot.setSizeM(2);
droneRobot.setPos(6.5, 0.6, 2);
droneRobot.model.rotation.y = 30*Math.PI/180;
world.addModel(droneRobot.model, droneRobot.anim);

const bike = await new Model();
await bike.loadModel("./3dObjects/rocketBike.glb");
bike.setPos(3, 0.5, -4);
bike.setSizeM(3.5);
bike.model.rotation.y = -70*Math.PI/180;
bike.model.rotation.x = -30*Math.PI/180;
bike.model.rotation.z = -30*Math.PI/180;
world.addModel(bike.model, bike.anim);

const comicBike = await new Model();
await comicBike.loadModel("./3dObjects/motorcicle.glb");
comicBike.setPos(-0.95, 0.7, -4)
comicBike.setSizeM(3);
comicBike.model.rotation.z = 10*Math.PI/180
world.addModel(comicBike.model, comicBike.anim);

world.animate();