import {Component} from "../../core/Component";
import * as Matter from "matter-js";
import {physicWorld} from "./PhysicWorld";

export class PhysicGenericComponent implements Component{

    constructor(private body:Matter.Body,private name:string=PhysicGenericComponent.name) {
        Matter.World.add(physicWorld.world, this.body);
    }

    getBody():Matter.Body{
        return this.body;
    }

    getName(): string {
        return this.name;
    }

    getX(){
        return this.body.position.x;
    }
    getY(){
        return this.body.position.y;
    }

    enable(){
        Matter.World.add(physicWorld.world, this.body);
    }

    disable() {
        Matter.World.remove( physicWorld.world, this.body );
    }

    setPosition(otherBody:PhysicGenericComponent){
        Matter.Body.setPosition(this.getBody(),{x:otherBody.getX(), y:otherBody.getY()} );
    }


}