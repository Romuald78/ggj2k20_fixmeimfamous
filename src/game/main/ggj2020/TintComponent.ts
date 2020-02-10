import {Component} from "../ecs/core/Component";
import {GfxGenericComponent} from "../ecs/system/gfx/GfxGenericComponent";


export class TintComponent implements Component{
    constructor(private gfxComp: GfxGenericComponent<Phaser.GameObjects.Image>) {

    }

    private TIME:number = 2;

    public team: string = "neutral";
    private tintValue:number = 0;

    getName(): string {
        return TintComponent.name;
    }

    setColorTeam(team:string){
        this.team = team;
        this.tintValue=255*this.TIME;
        this.setTintInternal();
    }

    private setTintInternal(){
        if(this.team!=="neutral") {
            let v = 255 - (this.tintValue/this.TIME);
            this.gfxComp.getGfxObj().setTint(
                this.team === "blue" ?
                Math.floor((v<<16)+(v<<8)+255) :
                Math.floor((255<<16)+(v<<8)+v));
        }else{
            this.gfxComp.getGfxObj().setTint(0);
        }
    }

    decreaseToNeutral() {
        this.tintValue--;
        if(this.tintValue<=0){
            this.tintValue = 0;
            this.team = "neutral";
        }
        this.setTintInternal();
    }
}