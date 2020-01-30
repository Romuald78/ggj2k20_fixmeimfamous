import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import {Entity} from "../../ecs/core/Entity";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {Tilemaps} from "phaser";
import * as Matter from "matter-js";
import {physicWorld} from "../../ecs/system/physics/PhysicWorld";


export class MapPhysic implements ScriptComponent{
    constructor(mapGfx:GfxGenericComponent<Tilemaps.Tilemap>) {
        let map = mapGfx.getGfxObj();
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                if (map.getTileAt(x, y, true, "Ground").index !== -1) {
                    //add physics
                    let cube = Matter.Bodies.rectangle((x * 100) + 50, (y * 100) + 50, 100, 100, {isStatic: true, label:"GroundBody"});
                    Matter.World.add(physicWorld.world, cube);
                    //MatterWorld.add(this.scene.matter.world.localWorld,cube);
                }
            }
        }
    }

    public getName(): string {
        return MapPhysic.name;
    }

    public updateScript(delta: number) {

    }

}