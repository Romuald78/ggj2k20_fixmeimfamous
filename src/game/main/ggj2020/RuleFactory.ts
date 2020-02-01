import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { Sound } from "./Sound";
import { CheckModulesAgainstRecipes } from "./CheckModulesAgainstRecipes"

export class RuleFactory {


    constructor(private world: ECSWorld, private scene: Scene) {

    }


    public create(modulesList: Entity[], recipesList: Entity[]): Entity {
        let entity = this.world.createEntity();

        entity.addComponent(new CheckModulesAgainstRecipes(modulesList, recipesList));

        return entity;
    }


}