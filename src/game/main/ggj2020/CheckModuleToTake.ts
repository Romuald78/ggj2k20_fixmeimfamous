import {ScriptComponent} from "../ecs/system/script/ScriptComponent";
import {Physic2D} from "../ecs/system/physics/Physic2D";
import {PhysicGenericComponent} from "../ecs/system/physics/PhysicGenericComponent";
import * as GameConstants from "./GameConstants";
import * as Matter from "matter-js";
import {ModuleInfo} from "./ModuleInfo";
import {physicWorld} from "../ecs/system/physics/PhysicWorld";
import {InputComponent} from "../ecs/system/controls/InputComponent";
import {Entity} from "../ecs/core/Entity";

export class CheckToModuleToTake implements ScriptComponent{

    private carriedModule:ModuleInfo;

    constructor(private playerEnt:Entity, private moduleList:Entity[]){
        this.carriedModule = null;
    }


    getName(): string {
        return CheckToModuleToTake.name;
    }


    updateScript(delta: number) {

        // Get player Input component
        let playerIn = this.playerEnt.getFirstComponentByName<InputComponent>(InputComponent.name);

        // We check if we have to leavr a module
        if(this.carriedModule){
            if (playerIn.isOFF("TAKEMODULE")) {
                this.carriedModule.leave();
                this.carriedModule = null;
            }
        }
        else {
            // Get current player Physic Body
            let playerPhys = this.playerEnt.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name);

            // Loop into the list,
            if (playerIn.isON("TAKEMODULE")) {
                let distanceMin = 64;
                let moduleInfoMin = null;
                this.moduleList.forEach((modEnt) => {
                    if(!this.carriedModule) {
                        // get module info
                        let modInfo = modEnt.getFirstComponentByName<ModuleInfo>(ModuleInfo.name);
                        if(!modInfo.getCarryMode()) {
                            // Get module physics
                            let modPhys = modEnt.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name);
                            // CHeck if the input component has been pressed
                            let xp = playerPhys.getX();
                            let yp = playerPhys.getY();
                            let xm = modPhys.getX();
                            let ym = modPhys.getY();
                            let dx = xp - xm;
                            let dy = yp - ym;
                            let distance =Math.sqrt( (dx * dx) + (dy * dy));
                            if (distance < distanceMin){
                                distanceMin = distance;
                                moduleInfoMin = modInfo;
                            }
                        }
                    }
                });

                if (moduleInfoMin) {
                    this.carriedModule = moduleInfoMin;
                    this.carriedModule.take(playerPhys);
                }
            }
        }

    }

}