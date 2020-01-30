import {Entity} from "../core/Entity";
import {Component} from "../core/Component";
import * as EventEmitter from "eventemitter3";
import {ScriptSystem} from "./script/ScriptSystem";
import {PhysicWorldDebugger} from "./physics/PhysicWorldDebugger";
import {physicWorld} from "./physics/PhysicWorld";
import Scene = Phaser.Scene;

export const ADD_COMPONENT_EVT = "addComponent";
export const DEL_COMPONENT_EVT = "delComponent";

export class ECSWorld {
    private physicWorldDebugger: PhysicWorldDebugger;
    private eventEmitter:EventEmitter = new EventEmitter();
    private entities:Entity[] = [];

    constructor(scene:Scene){
        this.physicWorldDebugger = new PhysicWorldDebugger(scene, physicWorld.engine);
        physicWorld.setDelComponentEmitter(this.eventEmitter);
    }

    private scriptSystem = new ScriptSystem(this.eventEmitter);

    public createEntity(components:Component[]=[],name:string="Entity"):Entity{
        let entity:Entity = new Entity(this.eventEmitter,name);
        entity.addComponents(components);
        this.entities.push(entity);
        return entity;
    }

    // GFX update
    public update(delta:number){
        this.scriptSystem.update(delta);
    }

    public stop(){
        physicWorld.restart();
        this.scriptSystem.stop();
        this.physicWorldDebugger.stop();
        this.entities = [];
    }

    //TODO keyboard input gamepad input
}