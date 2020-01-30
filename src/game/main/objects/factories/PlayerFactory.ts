import {ECSWorld} from "../../ecs/system/ECSWorld";
import {Scene, Tilemaps} from "phaser";
import {Entity} from "../../ecs/core/Entity";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {GameObjects} from "phaser";
import {PhysicGenericComponent} from "../../ecs/system/physics/PhysicGenericComponent";
import * as Matter from "matter-js";
import {TouchBodyComponent} from "../components/TouchBodyComponent";
import {PlayerMovement} from "../components/PlayerMovement";
import {PlayerControl} from "../components/PlayerControl";
import {GfxFollowPhysics} from "../../ecs/system/script/GfxFollowPhysics";
import {Life} from "../components/Life";
import {InputComponent} from "../../ecs/system/controls/InputComponent";

export class PlayerFactory {

    constructor(private world: ECSWorld, private scene: Scene) {

    }

    public widthWU  = 250;//cm
    public heightWU = 150;//cm

    public create( initX:number, initDir:String, ctrlID:number ): Entity {
        let entity = this.world.createEntity();

        //////
        //Sprite creation
        /////
        let player = this.scene.add.sprite(initX, 300, 'crocoAtlas');
        player.setScale(this.widthWU / player.width , this.heightWU / player.height);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(player, "gfx");
        entity.addComponent(gfxComp);

        // create animation object
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('crocoAtlas', {
                prefix: 'croco_idle',
                start: 1,
                end: 1,
                zeroPad: 2
            }),
            frameRate: 25,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('crocoAtlas', {
                prefix: 'croco_walk',
                start: 1,
                end: 11,
                zeroPad: 2
            }),
            frameRate: 25,
            repeat: -1
        });

        // Play animation IDLE
        player.anims.play('idle', true);

        // set initial direction
        if(initDir == "right"){
            player.scaleX = -player.scaleX;
        }

        ////
        //Body creation
        /////
        let originX = player.x;
        let originY = player.y;
        let rect = Matter.Bodies.circle(originX, originY,
            150/2,
            // player.height * player.scaleY,
            {mass:80},
        );
        //let circleA = Matter.Bodies.circle(originX - 70, originY + 0, 50, {isSensor: true, label: 'left',density:0});
        //let circleB = Matter.Bodies.circle(originX + 70, originY + 0, 50, {isSensor: true, label: 'right',density:0});
        //let circleC = Matter.Bodies.circle(originX + 0, originY - 100, 50, {isSensor: true, label: 'top',density:0});
        let circleD = Matter.Bodies.rectangle(originX + 0, originY + player.height*player.scaleY/2, 50, 10,{isSensor: true, label: 'bottom',density:0});

        let playerBody = Matter.Body.create({
            parts: [rect, circleD],
        });

        let physicBodyComponent = new PhysicGenericComponent(playerBody);
        entity.addComponent(physicBodyComponent);

        let touchBodyComponent = entity.addComponent(new TouchBodyComponent(playerBody));


        let playerMov = entity.addComponent(new PlayerMovement(touchBodyComponent, physicBodyComponent.getBody(),player));

        //-----------------------------------------------
        // Create input component
        let ic = new InputComponent();
        let padNum      = ctrlID;
        let keyboardNum = 0;
        // MOVE (keys)
        ic.register("WALK_LEFT",{type:"key",device_num:keyboardNum,input_ref:"q",threshold:0});
        ic.register("WALK_RIGHT",{type:"key",device_num:keyboardNum,input_ref:"d",threshold:0});
        ic.register("WALK_UP",{type:"key",device_num:keyboardNum,input_ref:"z",threshold:0});
        ic.register("WALK_DOWN",{type:"key",device_num:keyboardNum,input_ref:"s",threshold:0});
        // MOVE (axis)
        ic.register("WALK_LEFT",{type:"gamepadaxis",device_num:padNum,input_ref:"LEFTH",threshold:-0.20});
        ic.register("WALK_RIGHT",{type:"gamepadaxis",device_num:padNum,input_ref:"LEFTH",threshold:0.20});
        ic.register("WALK_UP",{type:"gamepadaxis",device_num:padNum,input_ref:"LEFTV",threshold:-0.50});
        ic.register("WALK_DOWN",{type:"gamepadaxis",device_num:padNum,input_ref:"LEFTV",threshold:0.50});
        // MOVE (buttons)
        ic.register("WALK_LEFT",{type:"button",device_num:padNum,input_ref:"CROSSL",threshold:0});
        ic.register("WALK_RIGHT",{type:"button",device_num:padNum,input_ref:"CROSSR",threshold:0});
        ic.register("WALK_UP",{type:"button",device_num:padNum,input_ref:"CROSSU",threshold:0});
        ic.register("WALK_DOWN",{type:"button",device_num:padNum,input_ref:"CROSSD",threshold:0});
        // JUMP (keys)
        ic.register("JUMP",{type:"key",device_num:keyboardNum,input_ref:" ",threshold:0});
        // JUMP (buttons)
        ic.register("JUMP",{type:"button",device_num:padNum,input_ref:"A",threshold:0});
        //-----------------------------------------------


        entity.addComponent(ic);
        entity.addComponent(new PlayerControl(playerMov, ic));

        entity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent));

        entity.addComponent(new Life(1));

        return entity;
    }


}