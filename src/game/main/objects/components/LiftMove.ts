import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import {Physic2D} from "../../ecs/system/physics/Physic2D";
import {physicWorld} from "../../ecs/system/physics/PhysicWorld";

export class LiftMove implements ScriptComponent{

    private isUp:boolean;
    private isDown:boolean;

    private readonly SPEED = 400;// centimeters per second

    constructor(private minx:number, private miny:number, private width:number, private height:number, private yPosition:number, private liftBody:Physic2D) {
        this.miny+=50;
        physicWorld.addUserData(liftBody.getBody(), this);
        // liftBody.getBody() // useless line ? bad legacy ???
    }

    public getName(): string {
        return "LiftMove";
    }

    public updateScript(delta: number) {

        let step = (this.SPEED*delta)/1000;

        if(this.isUp && this.isDown)
        {
            this.isUp = false;
            this.isDown = false;
        }

        if(this.isUp )
        {
            if(this.yPosition > this.miny)
            {
                this.yPosition -= step;
            }
            else
            {
                this.isUp = false;
                this.yPosition = this.miny;
            }
        }

        if(this.isDown )
        {
            if(this.yPosition < this.miny+this.height-100)   // Remove thickness of lift !!!
            {
                this.yPosition += step;
            }
            else
            {
                this.isDown = false;
                this.yPosition = this.miny+this.height-100;
            }
        }
        // update sprite position
        Matter.Body.setPosition(this.liftBody.getBody(),{x:this.liftBody.getBody().position.x,y:this.yPosition});

        /*
        //debug auto back and forth
        if(!this.isUp && !this.isDown){
            if(this.yPosition < this.miny+this.height-100){
                this.liftDown();
            }else{
                this.liftUp();
            }
        }
        //*/

    }


    liftUp():void{
        this.isUp = true;
    }
    liftDown():void{
        this.isDown = true;
    }

}