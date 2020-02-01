import {ECSWorld} from "../ecs/system/ECSWorld";
import {Scene} from "phaser";
import {Entity} from "../ecs/core/Entity";
import {PhysicGenericComponent} from "../ecs/system/physics/PhysicGenericComponent";
import {ModuleGrid} from "./ModuleGrid";

export class RecipeFactory {

    recipes:Entity[] = [];

    constructor(private world: ECSWorld, private scene: Scene) {

    }

    public create(teamId: number): Entity {

        let entity = this.world.createEntity();

        // Add new Module Grid
        let mg = new ModuleGrid(teamId);
        entity.addComponent(mg);

        this.recipes.push(entity);
        return entity;
    }
}