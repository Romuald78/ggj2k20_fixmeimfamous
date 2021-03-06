import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { GfxGenericComponent } from "../ecs/system/gfx/GfxGenericComponent";
import { GameObjects } from "phaser";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";
import * as Matter from "matter-js";
import { GfxFollowPhysics } from "../ecs/system/script/GfxFollowPhysics";
import * as GameConstants from "./GameConstants";
import { ModuleInfo } from "./ModuleInfo";
import { SetGridPosition } from "./SetGridPosition";
import {TintComponent} from "./TintComponent";


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
        console.log(module.width+" / "+module.height);
        module.setScale(GameConstants.moduleWidthWU / 151, GameConstants.moduleHeightWU / 151);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(module, "gfx");
        entity.addComponent(gfxComp);

        entity.addComponent(new TintComponent(gfxComp));

        // create animation object
        this.scene.anims.create({
            key: 'MODULE_IDLE' + idmodule,
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
        module.anims.play('MODULE_IDLE' + idmodule, true);

        // Add module ID
        let modInfo = entity.addComponent(new ModuleInfo(idmodule));
        entity.addComponent(modInfo);

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

        let setGrid = entity.addComponent(new SetGridPosition(physicBodyComponent, modInfo));
        entity.addComponent(setGrid);


        return entity;
    }


}