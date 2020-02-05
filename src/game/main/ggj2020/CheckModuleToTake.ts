import {ScriptComponent} from "../ecs/system/script/ScriptComponent";
import {PhysicGenericComponent} from "../ecs/system/physics/PhysicGenericComponent";
import * as GameConstants from "./GameConstants";
import {ModuleInfo} from "./ModuleInfo";
import {InputComponent} from "../ecs/system/controls/InputComponent";
import {Entity} from "../ecs/core/Entity";
import {CheckModulesAgainstRecipes} from "./CheckModulesAgainstRecipes";
import * as Matter from "matter-js";
import {PlayerMovement} from "./PlayerMovement";
import {TintComponent} from "./TintComponent";

export class CheckToModuleToTake implements ScriptComponent {


    private carriedModule: Entity;

    constructor(private playerEnt: Entity, private moduleList: Entity[], private checkModulesAgainstRecipes: CheckModulesAgainstRecipes) {
        this.carriedModule = null;
    }


    getName(): string {
        return CheckToModuleToTake.name;
    }


    updateScript(delta: number) {

        // Get player Input component
        let playerIn = this.playerEnt.getFirstComponentByName<InputComponent>(InputComponent.name);
        // Get current player Physic Body
        let playerPhys = this.playerEnt.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name);
        // distanceMin in front of player
        let distanceMin = 63;
        // CHeck if the input component has been pressed
        let playerX = playerPhys.getX();
        let playerY = playerPhys.getY();
        let playerPositionOnGridX = Math.round(playerX / GameConstants.moduleWidthWU);
        let playerPositionOnGridY = Math.round(playerY / GameConstants.moduleHeightWU);
        let angp = playerPhys.getRotation();
        let targetPositionX = playerX + distanceMin * Math.cos(angp);
        let targetPositionY = playerY + distanceMin * Math.sin(angp);
        let team = this.playerEnt.getFirstComponentByName<PlayerMovement>(PlayerMovement.name).teamid;

        // We check if we have to leavr a module
        if (this.carriedModule) {
            let tint = this.carriedModule.getFirstComponentByName<TintComponent>(TintComponent.name);
            if (playerIn.isOFF("TAKEMODULE") && playerIn.isOFF("TAKEMODULE2")) {
                let module = this.getModuleAt(targetPositionX, targetPositionY);
                if (!module) {
                    //there is no module in front
                    if(tint.team==="neutral" || tint.team===(team===0?"red":"blue")) {
                        tint.setColorTeam(team === 0 ? "red" : "blue");
                    }
                    this.carriedModule.getFirstComponentByName<ModuleInfo>(ModuleInfo.name).leave();
                    this.carriedModule = null;
                } else {
                    // find another spot
                    dance:for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (i == 0 && j == 0) {
                                continue;
                            }
                            let newTargetPositionX = (playerPositionOnGridX + i) * GameConstants.moduleWidthWU;
                            let newTargetPositionY = (playerPositionOnGridY + j) * GameConstants.moduleWidthWU;
                            let module = this.getModuleAt(newTargetPositionX, newTargetPositionY);
                            if (!module) {
                                let body = this.carriedModule.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name).getBody();
                                Matter.Body.setPosition(body,{x:newTargetPositionX,y:newTargetPositionY});
                                //there is no module in front
                                this.carriedModule.getFirstComponentByName<ModuleInfo>(ModuleInfo.name).leave();
                                this.carriedModule = null;
                                break dance;
                            }
                        }
                    }
                }
                setTimeout(() => {
                    this.checkModulesAgainstRecipes.checkWin();
                }, 100);
            }
        } else {
            // Loop into the list,
            if (playerIn.isON("TAKEMODULE") || playerIn.isON("TAKEMODULE2")) {
                let module = this.getModuleAt(targetPositionX, targetPositionY);
                if (module) {
                    let tint = module.getFirstComponentByName<TintComponent>(TintComponent.name);
                    if(tint.team==="neutral" || tint.team===(team===0?"red":"blue")) {
                        tint.setColorTeam(team === 0 ? "red" : "blue");
                            this.carriedModule = module;
                            this.carriedModule.getFirstComponentByName<ModuleInfo>(ModuleInfo.name).take(playerPhys);
                    }else{
                        tint.decreaseToNeutral();
                    }
                }
            }
        }
    }

    getModuleAt(targetxwu, targetywu): Entity {
        let targetxInGrid = Math.round(targetxwu / GameConstants.moduleWidthWU);
        let targetyInGrid = Math.round(targetywu / GameConstants.moduleHeightWU);
        let moduleInfoMin = null;
        this.moduleList.forEach((modEnt) => {
            // get module info
            let modInfo = modEnt.getFirstComponentByName<ModuleInfo>(ModuleInfo.name);
            if (!modInfo.getCarryMode()) {
                // Get module physics
                let modPhys = modEnt.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name);
                let xm = modPhys.getX();
                let ym = modPhys.getY();
                xm = Math.round(xm / GameConstants.moduleWidthWU);
                ym = Math.round(ym / GameConstants.moduleHeightWU);
                if ((xm == targetxInGrid) && (ym == targetyInGrid)) {
                    moduleInfoMin = modEnt;
                }
            }
        });
        return moduleInfoMin;
    }

}