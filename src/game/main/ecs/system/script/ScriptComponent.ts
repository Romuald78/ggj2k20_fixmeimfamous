import {Component} from "../../core/Component";

export interface ScriptComponent extends Component{
    updateScript(delta:number);
}
