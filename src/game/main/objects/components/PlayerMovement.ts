import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import {physicWorld} from "../../ecs/system/physics/PhysicWorld";
import {TouchBodyComponent} from "./TouchBodyComponent";

export class PlayerMovement implements ScriptComponent{


    private canClimb;
    public enableControl = false;

    private moveDirs = 0;
    private jumpRequested = false;

    private MAX_SPEED:number = 1000.0;   //cm/s
    private speedH:number;               //cm/s
    private speedV:number;               //cm/s

    constructor(private touchBodyComponent:TouchBodyComponent,private playerBody:Matter.Body, private player:Phaser.GameObjects.Sprite) {
        this.speedH = 0;
        this.speedV = 0;
    }

    public getName(): string {
        return PlayerMovement.name;
    }

    public updateScript(delta: number) {
        Matter.Body.setAngle(this.playerBody, 0);
        Matter.Body.setAngularVelocity(this.playerBody, 0);

        let deltaTime = delta;

        // Walk left/right
        Matter.Body.set(this.playerBody,"velocity", {x:0,y:this.playerBody.velocity.y} );
        if ( this.enableControl ) {
            let mv = 0;

            // Adapt move variable according to player keys
            if ((this.moveDirs & 0x01) == 1){
                mv--;
            }
            if ((this.moveDirs & 0x02) == 2){
                mv++;
            }

            // Adapt X Scale according to horizontal direction
            if(mv<0){
                this.player.scaleX = Math.abs(this.player.scaleX);
            }
            if(mv>0){
                this.player.scaleX = -Math.abs(this.player.scaleX);
            }

            // Start walk animation or  idle animation according to move variable
            if(mv == 0){
                this.player.anims.play('idle', true);
            }
            else{
                this.player.anims.play('walk', true);
            }

            // move the player along the X axis
            Matter.Body.translate(this.playerBody, {x: mv*this.speedH*(deltaTime/1000), y: 0});
        }

        // Ladder up and down
        if (this.canClimb) {
            /*this.playerBody.frictionAir=1;
            this.playerBody.frictionStatic=10;*/
            //this.player.setTint(0xFF0000);

            // stops the body
            Matter.Body.set(this.playerBody,"velocity", {x: 0, y:0});
            // gravity proof
            physicWorld.disableGravity(this.playerBody);

            // Force vertical down vector to 0
            if (this.enableControl) {
                let mv = 0;
                if ((this.moveDirs & 0x04) == 4 || this.jumpRequested){
                    mv--;
                }
                if ((this.moveDirs & 0x08) == 8){
                    mv++;
                }
                Matter.Body.translate(this.playerBody, {x: 0, y: mv*this.speedV*(deltaTime/1000)});
            }
        }
        else{
            // no more gravity proof
            physicWorld.enableGravity(this.playerBody);
        }

        // Jump
        if (this.enableControl && this.jumpRequested && !this.canClimb && this.touchBodyComponent.isTouchingGround()) {
            Matter.Body.applyForce(this.playerBody, this.playerBody.position, {x: 0, y: -11});
        }
        this.jumpRequested = false;


        // debug Color
        /*
        if (this.isTouchingGround) {
            this.player.setTint(0x00FF00);
        }
        else {
            this.player.clearTint();
        }
        //*/
    }

    setInputState(active: boolean): void {
        this.enableControl = active;
    }

    getInputState(): boolean {
        return this.enableControl;
    }

    setClimb(can: boolean): void {
        this.canClimb = can;
    }

    setSpeedH(spd:number){
        this.speedH  = spd;
        this.speedH  = this.speedH >= 0.0 ? this.speedH : 0.0;
        this.speedH  = this.speedH <= 1.0 ? this.speedH : 1.0;
        this.speedH *= this.MAX_SPEED;
    }

    setSpeedV(spd:number){
        this.speedV  = spd;
        this.speedV  = this.speedV >= 0.0 ? this.speedV : 0.0;
        this.speedV  = this.speedV <= 1.0 ? this.speedV : 1.0;
        this.speedV *= this.MAX_SPEED;
    }



    moveLeft(b:boolean){
        if(b){
            this.moveDirs |= 1;
        }
        else{
            this.moveDirs &= ~1;
        }
    }
    moveRight(b:boolean){
        if(b){
            this.moveDirs |= 2;
        }
        else{
            this.moveDirs &= ~2;
        }
    }
    moveUp(b:boolean){
        if(b){
            this.moveDirs |= 4;
        }
        else{
            this.moveDirs &= ~4;
        }
    }
    moveDown(b:boolean){
        if(b){
            this.moveDirs |= 8;
        }
        else{
            this.moveDirs &= ~8;
        }
    }

    jump(){
        this.jumpRequested = true;
    }
}