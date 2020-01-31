import { InputComponent } from './../ecs/system/controls/InputComponent';
import { ScriptComponent } from "../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import { physicWorld } from "../ecs/system/physics/PhysicWorld";
import { TouchBodyComponent } from "../objects/components/TouchBodyComponent";

export class PlayerMovement implements ScriptComponent {



    public enableControl = false;

    private moveDirs = 0;


    constructor(private playerBody: Matter.Body, private player: Phaser.GameObjects.Sprite, private playerInput: InputComponent) {
    }

    public getName(): string {
        return PlayerMovement.name;
    }

    public updateScript(delta: number) {
        Matter.Body.setAngle(this.playerBody, 0);
        //Matter.Body.setAngularVelocity(this.playerBody, 0);
        let dx = -this.playerInput.getAnalogValue("WALK_LEFT") + this.playerInput.getAnalogValue("WALK_RIGHT");
        let dy = -this.playerInput.getAnalogValue("WALK_UP") + this.playerInput.getAnalogValue("WALK_DOWN");
        Matter.Body.applyForce(this.playerBody, this.playerBody.position, Matter.Vector.create(dx, dy));
    }
}