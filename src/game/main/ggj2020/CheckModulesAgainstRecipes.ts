import { PhysicGenericComponent } from './../ecs/system/physics/PhysicGenericComponent';
import * as GameConstants from "./GameConstants";
import { ModuleInfo } from "./ModuleInfo";
import { Entity } from "../ecs/core/Entity";
import { ModuleGrid } from "./ModuleGrid";
import {Component} from "../ecs/core/Component";
import {Scene} from "phaser";

class RelativeModule {
    public constructor(private id: number, private relativeOffsetx: number, private relativeOffsety: number) {

    }

    public getID() {
        return this.id;
    }

    public computedOffsetX(originPosX: number) {
        return originPosX + (this.relativeOffsetx * GameConstants.moduleWidthWU)
    }

    public computedOffsetY(originPosY: number) {
        return originPosY + (this.relativeOffsety * GameConstants.moduleHeightWU)
    }
};

export class CheckModulesAgainstRecipes implements Component {

    private relativeModulesList: RelativeModule[][] = [];

    constructor(private modulesList: Entity[],private recipesList: Entity[],private callback: (windata:any)=>void) {
        recipesList.forEach(element => {
            this.relativeModulesList.push(this.toRelativeModulesList(element));
        });
    }


    getName(): string {
        return CheckModulesAgainstRecipes.name;
    }

    private toRelativeModulesList(recipe: Entity) {
        let result: RelativeModule[] = [];
        // get module grid from recipe
        let grid: ModuleGrid = recipe.getFirstComponentByName<ModuleGrid>("ModuleGrid");

        let initialIndex = 0;
        for (; initialIndex < grid.grid[0].length; initialIndex++) {
            if (grid.grid[0][initialIndex] != 0)
                break;
        }

        // from this point on, build the modules list associated to the recipe
        for (let j = 0; j < grid.grid.length; j++) {
            for (let i = 0; i < grid.grid[j].length; i++) {
                if (grid.grid[j][i] != 0)
                    result.push(new RelativeModule(grid.grid[j][i], i - initialIndex, j));
            }
        }

        return result;
    }

    private fullPatternMatching(relativeModulesList: RelativeModule[], initialMatchedPhysics: PhysicGenericComponent) {
        // fetch moduleList and check the next element in the list
        if (relativeModulesList.length <= 1)
            return true;

        let returnValue: boolean = true;


        for (let i = 1; i < relativeModulesList.length; i++) {

            // check cell following relative coordinates
            const newPosX = relativeModulesList[i].computedOffsetX(initialMatchedPhysics.getX())
            const newPosY = relativeModulesList[i].computedOffsetY(initialMatchedPhysics.getY())

            returnValue = false;
            for (let j = 0; j < this.modulesList.length; j++) {
                const associatedModulePhysics: PhysicGenericComponent = this.modulesList[j].getFirstComponentByName<PhysicGenericComponent>("PhysicGenericComponent");
                const associatedModuleInfo: ModuleInfo = this.modulesList[j].getFirstComponentByName<ModuleInfo>("ModuleInfo");
                if (relativeModulesList[i].getID() == associatedModuleInfo.getID()
                    && !associatedModuleInfo.getCarryMode()
                    && newPosX == associatedModulePhysics.getX()
                    && newPosY == associatedModulePhysics.getY()
                ) {
                    console.log("Found match ! : ", j);
                    returnValue = true;
                    break;
                }
            }

            if (!returnValue) {
                break;
            }
        }

        return returnValue;
    }

    checkWin() {
        // fetch list of modules and for each module check if it matches the provided recipes
        // (be careful to ignore modules that are currently carried)
        // step 1: check in all recipes the starting point
        // for that we have the relativeModules list

        this.relativeModulesList.forEach(element => {
            // get the first element in the relative modules list
            const firstRelativeModule: RelativeModule = element[0];
            // fetch list of modules for modules having the required id
            for (let i = 0; i < this.modulesList.length; i++) {
                const currentInfos: ModuleInfo = this.modulesList[i].getFirstComponentByName<ModuleInfo>("ModuleInfo");
                const currentPhysics: PhysicGenericComponent = this.modulesList[i].getFirstComponentByName<PhysicGenericComponent>("PhysicGenericComponent");
                //console.log("Expected : " + firstRelativeModule.getID() + " vs " + currentInfos.getID())
                if (firstRelativeModule.getID() == currentInfos.getID()) {
                    //console.log("Found one ID : ", currentInfos.getID());
                    //console.log("carry ? " + currentInfos.getCarryMode());
                    if (!currentInfos.getCarryMode()) {
                        //console.log("Found module ID : " + currentInfos.getID());
                        if (this.fullPatternMatching(element, currentPhysics)) {
                            // We have a winner here !
                            // raise appopriate event
                            this.callback({
                                team:i,
                                receipe:this.recipesList[i]
                            });
                            break; // WIN !
                        }
                    }
                }
            }
        });
    }

}