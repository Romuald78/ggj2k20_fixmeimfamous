import {ECSWorld} from "../../ecs/system/ECSWorld";
import {Entity} from "../../ecs/core/Entity";
import {LiftMove} from "../components/LiftMove";
import {GfxImageComponent} from "../../ecs/system/gfx/GfxImageComponent";
import {Scene} from "phaser";
import {Physic2D} from "../../ecs/system/physics/Physic2D";
import {GfxFollowPhysics} from "../../ecs/system/script/GfxFollowPhysics";
import {LiftSwitchFactory} from "./LiftSwitchFactory";

export class LiftFactory {

    constructor(private world:ECSWorld,private scene:Scene)
    {

    }

    public createLift(minx:number, miny:number, width:number, height:number, yPosition:number, switchList:number[]):Entity{
        // Create entity
        let liftEntity = this.world.createEntity([], "Lift");

        let phy = new Physic2D(minx,yPosition,width,100,"LiftBody");
        liftEntity.addComponent(phy);

        let lm = new LiftMove(minx,miny,width,height,yPosition, phy);
        liftEntity.addComponent(lm);

        const PixelsPerMeter = 128/100;
        let gsc1 = new GfxImageComponent(this.scene,minx,yPosition,"liftSpriteSheet",72);
        let gsc2 = new GfxImageComponent(this.scene,minx,yPosition,"liftSpriteSheet",72);
        gsc1.setScale(1.0/PixelsPerMeter);
        gsc2.setScale(1.0/PixelsPerMeter);
        liftEntity.addComponent(gsc1);
        liftEntity.addComponent(gsc2);

        let follow1 = new GfxFollowPhysics(gsc1,phy,-50,0);
        let follow2 = new GfxFollowPhysics(gsc2,phy, 50,0);
        liftEntity.addComponent(follow1);
        liftEntity.addComponent(follow2);

        // Switches ( TODO create a factory to create an entity "switch" containing a sensor box and a gfx animation, + a script that toggles animation when player is pressing up or down key, and call lift up down movement)
        switchList.forEach( sw => {
            // Create switch lift entity
            let lf = new LiftSwitchFactory(this.world, this.scene);
            lf.createSwitch( sw[0]+50, sw[1]+33, lm );
        });


        // Return new entity
        return liftEntity;
    }
}