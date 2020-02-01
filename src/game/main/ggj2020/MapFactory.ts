import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import {Sound} from "./Sound";


export class MapFactory {


    constructor(private world: ECSWorld, private scene: Scene) {

    }


    public create(): Entity {
        let entity = this.world.createEntity();

        entity.addComponent(new Sound(this.scene,"theme"));

        return entity;
    }


}