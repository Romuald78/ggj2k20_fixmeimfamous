import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { GfxGenericComponent } from "../ecs/system/gfx/GfxGenericComponent";
import { GameObjects } from "phaser";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";
import * as Matter from "matter-js";
import { GfxFollowPhysics } from "../ecs/system/script/GfxFollowPhysics";
import * as GameConstants from "./GameConstants";

export class ModuleFactory {

    constructor(private world: ECSWorld, private scene: Scene) {
    }

    public create(idmodule: number, initX: number, initY: number): Entity {
        let entity = this.world.createEntity();
        //////
        //Sprite creation
        /////
        let atlasName = "atlas";
        let module = this.scene.add.sprite(initX, initY, atlasName);
        module.setScale(GameConstants.moduleWidthWU / module.width, GameConstants.moduleHeightWU / module.height);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(module, "gfx");
        entity.addComponent(gfxComp);


        // create animation object
        this.scene.anims.create({
            key: 'MODULE_IDLE'+idmodule,
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: "module_" + idmodule + "/module_" + idmodule + "_",
                suffix: ".png",
                start: 0,
                end: 0,
                zeroPad: 1
            }),
            frameRate: 1,
            repeat: -1
        });

        // Play animation IDLE
        module.anims.play('MODULE_IDLE'+idmodule, true);

        ////
        //Body creation
        /////
        let originX = module.x;
        let originY = module.y;
        let rectangleCollisionBox = Matter.Bodies.rectangle(originX, originY,
            GameConstants.moduleWidthWU, GameConstants.moduleHeightWU,
            // player.height * player.scaleY,
            //{ mass: 8000 },
        );

        let moduleBody = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [rectangleCollisionBox,],
        });

        let physicBodyComponent = new PhysicGenericComponent(moduleBody);
        entity.addComponent(physicBodyComponent);

        let gfxfollow = entity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent));
        entity.addComponent(gfxfollow);

        return entity;
    }


}