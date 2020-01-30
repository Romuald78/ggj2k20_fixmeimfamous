import {ScriptComponent} from "./ScriptComponent";
import * as EventEmitter from "eventemitter3";
import {ADD_COMPONENT_EVT} from "../ECSWorld";
import {Component} from "../../core/Component";


export class ScriptSystem {
    private scripts:ScriptComponent[] = [];


    constructor(private eventEmitter:EventEmitter) {
        eventEmitter.on(ADD_COMPONENT_EVT,(component:Component) => {
            if("updateScript" in component){
                this.scripts.push(component);
            }
        })
    }

    update(delta:number){
        this.scripts.forEach(script => {
            script.updateScript(delta);
        });
    }

    stop(){
        this.scripts = [];
    }
}