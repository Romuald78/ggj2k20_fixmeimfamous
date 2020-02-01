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
import * as GameConstants from "./GameConstants";

export class PlayerFactory {

    constructor(private world: ECSWorld, private scene: Scene) {

    }


    public create(initX: number, initY: number, ctrlID: number, teamId: number): Entity {
        let entity = this.world.createEntity();

        //////
        //Sprite creation
        /////

        let atlasName: string = "atlas";

        let player = this.scene.add.sprite(initX, initY, atlasName);
        player.setScale(GameConstants.playerWidthWU / player.width, GameConstants.playerHeightWU / player.height);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(player, "gfx");
        entity.addComponent(gfxComp);
        player.setTint(teamId == 1 ? 0xA0A0FF : 0xFFA0A0);



        // create animation object
        this.scene.anims.create({
            key: 'WALKUP',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_back_',
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'WALKDOWN',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_front_',
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'WALKSIDE',
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_side',
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });

        // Play animation IDLE
        player.anims.play('WALKUP', true);

        ////
        //Body creation
        /////
        let originX = player.x;
        let originY = player.y;
        let circle = Matter.Bodies.circle(originX, originY,
            GameConstants.playerWidthWU / 6,
            // player.height * player.scaleY,
            { mass: 80 },
        );

        let playerBody = Matter.Body.create({
            parts: [circle,],
        });
        playerBody.frictionAir = GameConstants.PLAYER_MOVE_FRICTION;

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

        let gfxfollow = entity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent,0, GameConstants.playerHeightOF7));
        entity.addComponent(gfxfollow);

        return entity;
    }


}