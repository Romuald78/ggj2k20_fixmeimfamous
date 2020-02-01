import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { CheckModulesAgainstRecipes } from "./CheckModulesAgainstRecipes"

export class RuleFactory {


    constructor(private world: ECSWorld, private scene: Scene,private callback: (windata:any)=>void) {

    }


    public create(modulesList: Entity[], recipesList: Entity[]): Entity {
        let entity = this.world.createEntity();

        entity.addComponent(new CheckModulesAgainstRecipes(modulesList, recipesList,this.callback));

        return entity;
    }


}