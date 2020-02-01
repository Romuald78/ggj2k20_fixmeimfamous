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

    getRotation():number{
        return this.body.angle;
    }

    // Get the position on front of the body at the requested distance
    getFrontX(distance:number):number{
        let angle = this.getRotation();
        let x = this.body.position.x;
        x +=Math.cos(angle)*distance;
        return x;
    }
    getFrontY(distance:number):number{
        let angle = this.getRotation();
        let y = this.body.position.y;
        y +=Math.sin(angle)*distance;
        return y;
    }



    disable() {
        Matter.World.remove( physicWorld.world, this.body );
    }

    setPosition(x:number, y:number){
        Matter.Body.setPosition(this.getBody(),{x:x, y:y} );
    }

    copyBodyPosition(otherBody:PhysicGenericComponent){
        Matter.Body.setPosition(this.getBody(),{x:otherBody.getX(), y:otherBody.getY()} );
    }


}