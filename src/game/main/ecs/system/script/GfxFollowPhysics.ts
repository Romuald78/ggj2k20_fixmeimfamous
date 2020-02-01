import {ScriptComponent} from "./ScriptComponent";
import {GfxComponent} from "../gfx/GfxComponent";
import {Physic2D} from "../physics/Physic2D";
import {GfxGenericComponent} from "../gfx/GfxGenericComponent";
import {PhysicGenericComponent} from "../physics/PhysicGenericComponent";

export class GfxFollowPhysics implements ScriptComponent{


    constructor(private gfx:GfxComponent | GfxGenericComponent<any>, private phy:Physic2D | PhysicGenericComponent, private dx:number=0, private dy:number=0){

    }


    getName(): string {
        return GfxFollowPhysics.name;
    }

    updateScript(delta: number) {
        this.gfx.setPosition(this.phy.getBody().position.x+this.dx, this.phy.getBody().position.y+this.dy);
    //    this.gfx.setRotation(this.phy.getBody().angle);
    }

}