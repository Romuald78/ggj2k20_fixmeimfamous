import {Component} from "../ecs/core/Component";

export class ModuleID implements Component{
    getName(): string {
        return ModuleID.name;
    }

    constructor(private id:number){

    }

    getID():number{
        return this.id;
    }

}