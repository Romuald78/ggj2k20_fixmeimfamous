import {GameObjects, Scene} from "phaser";
import {Entity} from "../../ecs/core/Entity";
import {ECSWorld} from "../../ecs/system/ECSWorld";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import * as Matter from "matter-js";
import {PhysicGenericComponent} from "../../ecs/system/physics/PhysicGenericComponent";
import {physicWorld} from "../../ecs/system/physics/PhysicWorld";
import {GfxFollowPhysics} from "../../ecs/system/script/GfxFollowPhysics";
import {LiftMove} from "../components/LiftMove";


export class LiftSwitchFactory {

    constructor (private world:ECSWorld,private scene:Scene){
    }

    public createSwitch(posX:number, posY:number, lm:LiftMove ):Entity{

        // Init constants
        const pixelsPerMeter = 75/100;

        // Create entity
        let switchEntity = this.world.createEntity([], "switch");

        // Create SWITCH animations component
        let switchGfx = this.scene.add.sprite(posX, posY, 'switchAtlas');
        switchGfx.setScale(1.0 / pixelsPerMeter);
        let gfxComp = new GfxGenericComponent<GameObjects.Image>(switchGfx, "gfx");
        switchEntity.addComponent(gfxComp);

        // create animation object
        this.scene.anims.create({
            key: 'activeLeft',
            frames: this.scene.anims.generateFrameNames('switchAtlas', {
                prefix: 'switch',
                start: 3,
                end: 1,
                zeroPad: 2
            }),
            frameRate: 4,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'activeRight',
            frames: this.scene.anims.generateFrameNames('switchAtlas', {
                prefix: 'switch',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: 4,
            repeat: 0
        });

        // Create PHYSIC sensor for this switch
        let switchBody = Matter.Bodies.rectangle( posX, posY+20,100,120/pixelsPerMeter,{isSensor: true, label: 'liftSwitch', isStatic: true, density: 0} );
        let physicBodyComponent = new PhysicGenericComponent(switchBody);
        switchEntity.addComponent(physicBodyComponent);
        physicWorld.addUserData(physicBodyComponent.getBody(), lm);

        // GFX follows PHYSIC
        switchEntity.addComponent(new GfxFollowPhysics(gfxComp, physicBodyComponent))

        // return created entity
        return switchEntity;

    }




}