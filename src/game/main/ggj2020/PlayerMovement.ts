import { InputComponent } from './../ecs/system/controls/InputComponent';
import { ScriptComponent } from "../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import { physicWorld } from "../ecs/system/physics/PhysicWorld";
import { TouchBodyComponent } from "../objects/components/TouchBodyComponent";
import * as GameConstants from "./GameConstants";


export class PlayerMovement implements ScriptComponent {


    public enableControl = false;

    private moveDirs = 0;
    private defaultScaleX;
    private defaultScaleY;


    constructor(private playerBody: Matter.Body, private player: Phaser.GameObjects.Sprite, private playerInput: InputComponent) {
        this.defaultScaleX = player.scaleX;
        this.defaultScaleY = player.scaleY;
    }

    public getName(): string {
        return PlayerMovement.name;
    }

    public updateScript(delta: number) {
        Matter.Body.setAngle(this.playerBody, 0);
        //Matter.Body.setAngularVelocity(this.playerBody, 0);
        let dx = -this.playerInput.getAnalogValue("WALK_LEFT") + this.playerInput.getAnalogValue("WALK_RIGHT");
        let dy = -this.playerInput.getAnalogValue("WALK_UP") + this.playerInput.getAnalogValue("WALK_DOWN");

        if(    this.playerInput.isON("WALK_LEFT")
            || this.playerInput.isON("WALK_RIGHT")
            || this.playerInput.isON("WALK_UP")
            || this.playerInput.isON("WALK_DOWN") ){
            let ang = Math.atan2(dy,dx)*180/Math.PI;
            ang = (ang+360)%360;
            if(ang >= 45 && ang < 135){
                // DOWN
                this.player.play("WALKDOWN");
            }
            else if(ang >= 135 && ang < 225){
                // LEFT
                this.player.play("WALKSIDE");
                this.player.setScale(this.defaultScaleX,this.defaultScaleY);
            }
            else if(ang >= 225 && ang < 315){
                // UP
                this.player.play("WALKUP");
            }
            else{
                // RIGHT
                this.player.play("WALKSIDE");
                this.player.setScale(-this.defaultScaleX,this.defaultScaleY);
            }
        }

        // Set Z depth according to Y level
        this.player.setDepth(Math.round(this.player.y*1000))

        Matter.Body.applyForce(this.playerBody, this.playerBody.position, Matter.Vector.create(dx*GameConstants.PLAYER_MOVE_FORCE, dy*GameConstants.PLAYER_MOVE_FORCE));
    }
}