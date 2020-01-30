import {Component} from "../../ecs/core/Component";


export class Bound implements Component{
    constructor(private bound:{
        width: number,
        height: number,
        y: number,
        x: number,
    }) {
    }

    public getName(): string {
        return Bound.name;
    }

    getBound(){
        return this.bound;
    }

}