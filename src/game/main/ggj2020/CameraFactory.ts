import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { GfxGenericComponent } from "../ecs/system/gfx/GfxGenericComponent";
import { GameObjects } from "phaser";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";
import * as Matter from "matter-js";
import { GfxFollowPhysics } from "../ecs/system/script/GfxFollowPhysics";
import * as GameConstants from "./GameConstants";
import {GameCamera} from "../objects/GameCamera";
import {CameraZoom} from "./CameraZoom";

export class CameraFactory {

    constructor(private world: ECSWorld, private scene: Scene) {
    }

    public create(playerList: Entity[]): Entity {
        let entity = this.world.createEntity();

        // Create camera main for this scene
        let gameCam:GameCamera = new GameCamera(this.scene);

        // Set bounds
        gameCam.setBounds(-GameConstants.MAP_W/2, -GameConstants.MAP_H/2, 2*GameConstants.MAP_W, 2*GameConstants.MAP_H);
//        gameCam.setBounds(0, 0, GameConstants.MAP_W, GameConstants.MAP_H);

        // Create script component for cam zoom
        let camZoom = new CameraZoom(playerList,gameCam);
        entity.addComponent(camZoom);

        return entity;
    }


}