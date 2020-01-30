import * as Matter from "matter-js";
import {Component} from "../../core/Component";
import {physicWorld} from "./PhysicWorld";
import { PhysicGenericComponent } from "./PhysicGenericComponent";

export class Physic2D extends PhysicGenericComponent implements Component{

    constructor(x:number,y:number,width:number,height:number, name:string=Physic2D.name) {
        let bdy = Matter.Bodies.rectangle(
            x+(width)/2,
            y+(height)/2,
            width,
            height,
            {isStatic: true, label:name});
        super(bdy,name);
    }

    public getName(): string {
        return "Physic2D";
    }

}