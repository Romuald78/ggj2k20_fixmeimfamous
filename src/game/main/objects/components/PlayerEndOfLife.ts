import {PhysicGenericComponent} from "../../ecs/system/physics/PhysicGenericComponent";
import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {GameObjects} from "phaser";
import {Life} from "./Life";
import {PlayerMovement} from "./PlayerMovement";
import { Entity } from "../../ecs/core/Entity";
import * as Matter from "matter-js";


export class PlayerEndOfLife implements ScriptComponent{

    private isCallbackCalled = false;

    getName(): string {
        return PlayerEndOfLife.name;
    }

    constructor (private player:Entity, private callback:()=>void ){

    }


    updateScript(delta: number) {
        let life      = this.player.getFirstComponentByName<Life>(Life.name);
        let mov       = this.player.getFirstComponentByName<PlayerMovement>(PlayerMovement.name);
        let playerGfx = this.player.getFirstComponentByName<GfxGenericComponent<GameObjects.Sprite>>("gfx");
        let phyBody   = this.player.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name);
        if( life.isDead() ){
            playerGfx.getGfxObj().setTint(0xFF0000);
            mov.setInputState(false);
            playerGfx.getGfxObj().anims.play("idle", true);
            // Call only once to tell the react layer the player is dead
            if( !this.isCallbackCalled ){
                this.isCallbackCalled = true;
                this.callback();
                setTimeout( () => { this.player.removeComponent(phyBody); }, 500 );
            }
        }
    }




}