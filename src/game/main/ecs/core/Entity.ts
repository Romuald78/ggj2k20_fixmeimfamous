import {Component} from "./Component";
import * as EventEmitter from "eventemitter3";
import {ADD_COMPONENT_EVT, DEL_COMPONENT_EVT} from "../system/ECSWorld";

export class Entity implements Component {
    private components: Component[] = [];

    constructor(private eventEmitter: EventEmitter,private name: string = "Entity") {
    }

    public addComponent<T extends Component>(component: T):T {
        this.components.push(component);
        this.eventEmitter.emit(ADD_COMPONENT_EVT, component);
        return component;
    }

    public removeComponent<T extends Component>(component: T):T {
        this.components = this.components.filter( (comp) => {
            return comp != component;
        });
        this.eventEmitter.emit(DEL_COMPONENT_EVT, component);
        return component;
    }


    public addComponents(components: Component[]) {
        components.forEach(comp => {
            this.addComponent(comp);
        });
    }

    public getComponentByName(n:string):Component[]{
        let ret = [];
        this.components.forEach(comp => {
            if( comp.getName() === n ){
                ret.push(comp);
            }
        });
        return ret;
    }

    public getFirstComponentByName<T extends Component>(n:string):T{
        return this.getComponentByName(n)[0] as T;
    }



     public getName(): string {
        return this.name;
    }

}