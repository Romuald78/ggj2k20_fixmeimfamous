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
        //Matter.Body.setAngularVelocity(this.playerBody, 0);
        let dx = -this.playerInput.getAnalogValue("WALK_LEFT") + this.playerInput.getAnalogValue("WALK_RIGHT");
        let dy = -this.playerInput.getAnalogValue("WALK_UP") + this.playerInput.getAnalogValue("WALK_DOWN");
        let realAng = Math.atan2(dy,dx);
        if(    this.playerInput.isON("WALK_LEFT")
            || this.playerInput.isON("WALK_RIGHT")
            || this.playerInput.isON("WALK_UP")
            || this.playerInput.isON("WALK_DOWN") ){
            let ang = realAng*180/Math.PI;
            ang = (ang+360)%360;
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
            // check if we have to update the angle or not
            Matter.Body.setAngle(this.playerBody, realAng);
        }



        // Set Z depth according to Y level
        this.player.setDepth(Math.round(this.player.y*1000));

        // Apply force to move
        let forceModifier = 1;
        if(this.playerInput.isON("TAKEMODULE")){
            forceModifier = 0.5;
        }
        Matter.Body.applyForce(this.playerBody, this.playerBody.position, Matter.Vector.create(dx*GameConstants.PLAYER_MOVE_FORCE*forceModifier, dy*GameConstants.PLAYER_MOVE_FORCE*forceModifier));


    }
}