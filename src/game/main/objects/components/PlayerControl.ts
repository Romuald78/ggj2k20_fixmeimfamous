import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import {PlayerMovement} from "./PlayerMovement";
import {InputComponent} from "../../ecs/system/controls/InputComponent";

export class PlayerControl implements ScriptComponent{


    constructor(private playerMovement:PlayerMovement,private input:InputComponent) {
        // JUMP only when a 'key pressed' event occurs. Do not jump when holding pressed.
        this.input.registerEvent("JUMP", (actionName:string, buttonState:boolean)=>{
            if(buttonState) {
                this.playerMovement.jump();
            }
        })
    }

    public getName(): string {
        return PlayerControl.name;
    }

    public updateScript(delta: number) {
        let player = this.playerMovement;
        // check if current player has control
        if (player.enableControl) {
            // Update Speed Value
            let speedLeft:number  = Math.abs( this.input.getAnalogValue("WALK_LEFT") );
            let speedRight:number = Math.abs( this.input.getAnalogValue("WALK_RIGHT") );
            let speedUp:number    = Math.abs( this.input.getAnalogValue("WALK_UP") );
            let speedDown:number  = Math.abs( this.input.getAnalogValue("WALK_DOWN") );
            player.setSpeedH( Math.max(speedLeft, speedRight) );
            player.setSpeedV( Math.max(speedUp, speedDown) );
            // Update movement directions
            player.moveLeft( this.input.isON("WALK_LEFT") );
            player.moveRight( this.input.isON("WALK_RIGHT") );
            player.moveUp( this.input.isON("WALK_UP") );
            player.moveDown( this.input.isON("WALK_DOWN") );

/*
            // TODO remove this if this is possible to LINK callback with buttons
            if ( this.input.isON("JUMP") ) {
                player.jump();
            }
 //*/
        }
    }

}