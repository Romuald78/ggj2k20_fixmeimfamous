import { ECSWorld } from "../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../ecs/core/Entity";
import { GfxGenericComponent } from "../ecs/system/gfx/GfxGenericComponent";
import { GameObjects } from "phaser";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";
import * as Matter from "matter-js";
import { PlayerMovement } from "./PlayerMovement";
import { GfxFollowPhysics } from "../ecs/system/script/GfxFollowPhysics";
import { InputComponent } from "../ecs/system/controls/InputComponent";

export class PlayerFactory {

    constructor(private world: ECSWorld, private scene: Scene) {

    }

    public widthWU = 100;//cm
    public heightWU = this.widthWU;//cm

    public create(initX: number, initY: number, ctrlID: number, teamId: number): Entity {
        let entity = this.world.createEntity();

        //////
        //Sprite creation
        /////

        let atlasName: string = "atlas";

        let player = this.scene.add.sprite(initX, initY, atlasName);
        player.setScale(this.widthWU / player.width, this.heightWU / player.height);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(player, "gfx");
        entity.addComponent(gfxComp);
        player.setTint(teamId == 1 ? 0xA0A0FF : 0xFFA0A0);



        // create animation object
        this.scene.anims.create({
            key: 'WALKUP',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_walkup',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: 3,
            repeat: -1
        })
        /*
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'walk',
                start: 1,
                end: 1,
                zeroPad: 2
            }),
            frameRate: 25,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'carry',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'carry',
                start: 1,
                end: 1,
                zeroPad: 2
            }),
            frameRate: 25,
            repeat: -1
        });
        // */

        // Play animation IDLE
        player.anims.play('WALKUP', true);

        ////
        //Body creation
        /////
        let originX = player.x;
        let originY = player.y;
        let circle = Matter.Bodies.circle(originX, originY,
            this.widthWU / 2,
            // player.height * player.scaleY,
            { mass: 80 },
        );

        let playerBody = Matter.Body.create({
            parts: [circle,],
        });

        let physicBodyComponent = new PhysicGenericComponent(playerBody);
        entity.addComponent(physicBodyComponent);


        //-----------------------------------------------
        // Create input component
        let playerInput = entity.addComponent(new InputComponent());
        if (ctrlID < 0) {
            playerInput.register("WALK_LEFT", { type: "key", device_num: 0, input_ref: "q", threshold: 0 });
            playerInput.register("WALK_RIGHT", { type: "key", device_num: 0, input_ref: "d", threshold: 0 });
            playerInput.register("WALK_UP", { type: "key", device_num: 0, input_ref: "z", threshold: 0 });
            playerInput.register("WALK_DOWN", { type: "key", device_num: 0, input_ref: "s", threshold: 0 });
        }
        else {
            playerInput.register("WALK_LEFT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTH", threshold: -0.2 });
            playerInput.register("WALK_RIGHT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTH", threshold: 0.2 });
            playerInput.register("WALK_UP", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTV", threshold: -0.2 });
            playerInput.register("WALK_DOWN", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTV", threshold: 0.2 });
        }
        entity.addComponent(playerInput);

        let playerMov = entity.addComponent(new PlayerMovement(physicBodyComponent.getBody(), player, playerInput));
        entity.addComponent(playerMov);

        let gfxfollow = entity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent));
        entity.addComponent(gfxfollow);

        return entity;
    }


}