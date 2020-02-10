import { InputComponent } from './../ecs/system/controls/InputComponent';
import { ScriptComponent } from "../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import { physicWorld } from "../ecs/system/physics/PhysicWorld";
import { TouchBodyComponent } from "../objects/components/TouchBodyComponent";
import * as GameConstants from "./GameConstants";


export class PlayerMovement implements ScriptComponent {


    public enableControl = false;

    private defaultScaleX;
    private defaultScaleY;


    constructor(private playerBody: Matter.Body, private player: Phaser.GameObjects.Sprite, private playerInput: InputComponent,public teamid:number) {
        this.defaultScaleX = player.scaleX;
        this.defaultScaleY = player.scaleY;
    }

    public getName(): string {
        return PlayerMovement.name;
    }

    public updateScript(delta: number) {

        // Get move values
        let dx = -this.playerInput.getAnalogValue("WALK_LEFT") + this.playerInput.getAnalogValue("WALK_RIGHT");
        let dy = -this.playerInput.getAnalogValue("WALK_UP") + this.playerInput.getAnalogValue("WALK_DOWN");

        // Set speed modifier according to player carrying a module or not
        let forceModifier = 1;
        if(this.playerInput.isON("TAKEMODULE") || this.playerInput.isON("TAKEMODULE2")){
            forceModifier = 0.5;
        }

        // Apply force to move
        Matter.Body.applyForce(this.playerBody, this.playerBody.position, Matter.Vector.create(dx*GameConstants.PLAYER_MOVE_FORCE*forceModifier, dy*GameConstants.PLAYER_MOVE_FORCE*forceModifier));

        // Get turn values
        let dx2 = -this.playerInput.getAnalogValue("TURN_LEFT") + this.playerInput.getAnalogValue("TURN_RIGHT");
        let dy2 = -this.playerInput.getAnalogValue("TURN_UP") + this.playerInput.getAnalogValue("TURN_DOWN");

        // Compute both turn+move
        let dx3 = Math.min(1, Math.max(-1,dx + dx2));
        let dy3 = Math.min(1, Math.max(-1,dy + dy2));

        // Compute real angles (move / turn)
        let realAng3  = Math.atan2(dy3 ,dx3);

        // update animation direction according to turn
        let ang = 0;
        if(    this.playerInput.isON("WALK_LEFT")
            || this.playerInput.isON("WALK_RIGHT")
            || this.playerInput.isON("WALK_UP")
            || this.playerInput.isON("WALK_DOWN")
            || this.playerInput.isON("TURN_LEFT")
            || this.playerInput.isON("TURN_RIGHT")
            || this.playerInput.isON("TURN_UP")
            || this.playerInput.isON("TURN_DOWN") ) {
            ang = realAng3 * 180 / Math.PI;
            ang = (ang + 360) % 360;

            if(ang >= 45 && ang < 135){
                // DOWN
                this.player.play("WALKDOWN"+this.teamid,true);
            }
            else if(ang >= 135 && ang < 225){
                // LEFT
                this.player.play("WALKSIDE"+this.teamid,true);
                this.player.setScale(this.defaultScaleX,this.defaultScaleY);
            }
            else if(ang >= 225 && ang < 315){
                // UP
                this.player.play("WALKUP"+this.teamid,true);
            }
            else{
                // RIGHT
                this.player.play("WALKSIDE"+this.teamid,true);
                this.player.setScale(-this.defaultScaleX,this.defaultScaleY);
            }

            // Set angle according to real angles
            Matter.Body.setAngle(this.playerBody, realAng3);
        }

        // Set Z depth according to Y level
        this.player.setDepth(Math.round(this.player.y*1000));



    }
}