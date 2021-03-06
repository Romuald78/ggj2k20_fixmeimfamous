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
import {CheckToModuleToTake} from "./CheckModuleToTake";
import {CheckModulesAgainstRecipes} from "./CheckModulesAgainstRecipes";

export class PlayerFactory {

    constructor(private world: ECSWorld, private scene: Scene,private checkModulesAgainstRecipes:CheckModulesAgainstRecipes) {

    }


    public create(initX: number, initY: number, ctrlID: number, teamId: number, modEntities:Entity[] ): Entity {
        let entity = this.world.createEntity();

        //////
        //Sprite creation
        /////

        let atlasName: string = "atlas";

        let player = this.scene.add.sprite(initX, initY, atlasName);
        player.setScale(GameConstants.playerWidthWU / 192, GameConstants.playerHeightWU / 192);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(player, "gfx");
        entity.addComponent(gfxComp);


        // create animation object
        this.scene.anims.create({
            key: 'WALKUP'+teamId,
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_back_' + (teamId!==0 ? 'blue_' : ''),
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'WALKDOWN'+teamId,
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_front_' + (teamId!==0 ? 'blue_' : ''),
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'WALKSIDE'+teamId,
            frames: this.scene.anims.generateFrameNames(atlasName, {
                prefix: 'player_side' + (teamId!==0 ? '_blue_' : ''),
                suffix:'.png',
                start: 0,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 3,
            repeat: -1
        });

        // Play animation IDLE
        player.anims.play('WALKDOWN'+teamId, true);


        // Create sprite for highlight selection
        let highlight   = this.scene.add.circle(0,0,30,0x00FF00);
        highlight.setFillStyle(teamId!==0 ? 0x000080 : 0x800000);
        let gfxComp2 = new GfxGenericComponent<GameObjects.Arc>(highlight, "highlight");
        entity.addComponent(gfxComp2);

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

            playerInput.register("TURN_LEFT", { type: "key", device_num: 0, input_ref: "q", threshold: 0 });
            playerInput.register("TURN_RIGHT", { type: "key", device_num: 0, input_ref: "d", threshold: 0 });
            playerInput.register("TURN_UP", { type: "key", device_num: 0, input_ref: "z", threshold: 0 });
            playerInput.register("TURN_DOWN", { type: "key", device_num: 0, input_ref: "s", threshold: 0 });

            playerInput.register("TAKEMODULE", { type: "key", device_num: 0, input_ref: " ", threshold: 0 });
        }
        else {
            playerInput.register("WALK_LEFT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTH", threshold: -0.2 });
            playerInput.register("WALK_RIGHT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTH", threshold: 0.2 });
            playerInput.register("WALK_UP", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTV", threshold: -0.2 });
            playerInput.register("WALK_DOWN", { type: "gamepadaxis", device_num: ctrlID, input_ref: "LEFTV", threshold: 0.2 });

            playerInput.register("TURN_LEFT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "RIGHTH", threshold: -0.2 });
            playerInput.register("TURN_RIGHT", { type: "gamepadaxis", device_num: ctrlID, input_ref: "RIGHTH", threshold: 0.2 });
            playerInput.register("TURN_UP", { type: "gamepadaxis", device_num: ctrlID, input_ref: "RIGHTV", threshold: -0.2 });
            playerInput.register("TURN_DOWN", { type: "gamepadaxis", device_num: ctrlID, input_ref: "RIGHTV", threshold: 0.2 });

            playerInput.register("WALK_LEFT", { type: "button", device_num: ctrlID, input_ref: "CROSSL", threshold: 0 });
            playerInput.register("WALK_RIGHT", { type: "button", device_num: ctrlID, input_ref: "CROSSR", threshold: 0 });
            playerInput.register("WALK_UP", { type: "button", device_num: ctrlID, input_ref: "CROSSU", threshold: 0 });
            playerInput.register("WALK_DOWN", { type: "button", device_num: ctrlID, input_ref: "CROSSD", threshold: 0 });
            playerInput.register("TAKEMODULE", { type: "button", device_num: ctrlID, input_ref: "LB", threshold: 0 });
            playerInput.register("TAKEMODULE2", { type: "button", device_num: ctrlID, input_ref: "RB", threshold: 0 });
        }
        entity.addComponent(playerInput);


        let playerMov = entity.addComponent(new PlayerMovement(physicBodyComponent.getBody(), player, playerInput,teamId));
        entity.addComponent(playerMov);

        let gfxfollow = entity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent,0, GameConstants.playerHeightOF7));
        entity.addComponent(gfxfollow);

        let takeLeave = entity.addComponent(new CheckToModuleToTake(entity, modEntities,this.checkModulesAgainstRecipes));
        entity.addComponent(takeLeave);

        return entity;
    }


}