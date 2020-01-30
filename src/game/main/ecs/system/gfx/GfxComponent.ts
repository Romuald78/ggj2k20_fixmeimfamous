import {Component} from "../../core/Component";


export interface GfxComponent extends Component{

    setPosition(x:number, y:number);
    setRotation(a:number);

}