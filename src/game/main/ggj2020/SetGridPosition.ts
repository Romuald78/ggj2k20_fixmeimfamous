import {ScriptComponent} from "../ecs/system/script/ScriptComponent";
import {Physic2D} from "../ecs/system/physics/Physic2D";
import {PhysicGenericComponent} from "../ecs/system/physics/PhysicGenericComponent";
import * as GameConstants from "./GameConstants";
import * as Matter from "matter-js";
import {ModuleInfo} from "./ModuleInfo";
import {physicWorld} from "../ecs/system/physics/PhysicWorld";
import {InputComponent} from "../ecs/system/controls/InputComponent";

export class SetGridPosition implements ScriptComponent{

    private previousCarryMode;

    constructor(private phyModule:Physic2D | PhysicGenericComponent, private modInfo:ModuleInfo){
        this.previousCarryMode = false;
        this.align();
    }


    getName(): string {
        return SetGridPosition.name;
    }

    public static getAlignedPosition(x:number, y:number){
        let x2 = Math.round(x / GameConstants.moduleWidthWU) * GameConstants.moduleWidthWU;
        let y2 = Math.round(y / GameConstants.moduleHeightWU) * GameConstants.moduleHeightWU;
        return [x2,y2];
    }

    private align(){
        let x = this.phyModule.getBody().position.x;
        let y = this.phyModule.getBody().position.y;
        let newCoords = SetGridPosition.getAlignedPosition(x,y);
        let x2 = newCoords[0];
        let y2 = newCoords[1];

        if (x2 != x || y2 != y) {
            Matter.Body.setPosition(this.phyModule.getBody(), {x: x2, y: y2});
        }
    }

    updateScript(delta: number) {

        if( this.modInfo.getCarryMode() ){
            let phyCarrier:PhysicGenericComponent = this.modInfo.getPhyCarrier();
            if( this.previousCarryMode == false ){
                this.phyModule.disable();
            }
            let x = phyCarrier.getFrontX(64);
            let y = phyCarrier.getFrontY(64);
            let alignedXY = SetGridPosition.getAlignedPosition(x,y);
            this.phyModule.setPosition(alignedXY[0],alignedXY[1]);
        }
        else{

            if( this.previousCarryMode == true ) {
                // align module
                this.align();
                // enable physics back
                this.phyModule.enable();
            }
        }



        // update for next cycle
        this.previousCarryMode = this.modInfo.getCarryMode();

    }

}