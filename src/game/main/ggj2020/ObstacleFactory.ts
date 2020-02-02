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


export class ObstacleFactory {

    constructor(private world: ECSWorld, private scene: Scene) {
    }

    public create(): Entity {
        let entity = this.world.createEntity();
        //////
        //Sprite creation
        /////
        let initX = Math.random()*GameConstants.MAP_W;
        let initY = Math.random()*GameConstants.MAP_H;
        let atlasName = "atlas";
        let obstacle = this.scene.add.sprite(initX, initY, atlasName);
        obstacle.setScale(GameConstants.obstacleWidthWU / 256, GameConstants.obstacleHeightWU / 256);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(obstacle, "gfx");
        entity.addComponent(gfxComp);



        // create animation object
        this.scene.anims.create({
            key: 'CRATE',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: "crate_",
                suffix: ".png",
                start: 0,
                end: 0,
                zeroPad: 1
            }),
            frameRate: 1,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'DANGER',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: "danger_",
                suffix: ".png",
                start: 0,
                end: 0,
                zeroPad: 1
            }),
            frameRate: 1,
            repeat: -1
        });

        let choose:number = Math.round(Math.random()*2 )+1;
        if(choose==0){
            obstacle.anims.play('CRATE',true);
        }
        else if (choose == 1) {
            obstacle.anims.play('DANGER',true);
        }

        // Play animation IDLE
//        obstacle.anims.play('MODULE_IDLE' + idmodule, true);

        ////
        //Body creation
        /////
        let originX = obstacle.x;
        let originY = obstacle.y;
        let rectangleCollisionBox = Matter.Bodies.rectangle(originX, originY,
            GameConstants.obstacleWidthWU, GameConstants.obstacleHeightWU,
            // player.height * player.scaleY,
            //{ mass: 8000 },
        );
        let moduleBody = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [rectangleCollisionBox,],
        });

        // turn random
        let ang = Math.random()*Math.PI;
        Matter.Body.setAngle( moduleBody, ang );
        obstacle.setRotation(ang);

        let physicBodyComponent = new PhysicGenericComponent(moduleBody);
        entity.addComponent(physicBodyComponent);



        return entity;
    }


}