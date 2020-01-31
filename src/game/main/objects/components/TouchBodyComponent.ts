import { Component } from "../../ecs/core/Component";
import * as Matter from "matter-js";

export class TouchBodyComponent implements Component {

    private touchingGround = 0;

    private touchObjects: { [id: string]: Matter.Body } = {};

    getTouchObjects(): { [id: string]: Matter.Body } {
        return this.touchObjects;
    }

    isTouchingGround(): boolean {
        return this.touchingGround > 0;
    }

    constructor() {
        /*Matter.Events.on(physicWorld.engine, "collisionStart", (event) => {
            event.pairs.forEach(pair => {
                let bottomBody = pair.bodyA;
                let otherBody  = pair.bodyB;
                if(pair.bodyB.label == "bottom")
                {
                    bottomBody = pair.bodyB;
                    otherBody  = pair.bodyA;
                }
                if(bottomBody.label == "bottom") {
                    if (aBody.parts.includes(bottomBody)) {
                        if (!otherBody.isSensor) {
                            this.touchingGround++;
                        }
                        this.touchObjects[otherBody.id] = otherBody;
                        //console.log(otherBody);
                    }
                }
            });
        });
        Matter.Events.on(physicWorld.engine, "collisionEnd", (event) => {
            event.pairs.forEach(pair => {
                let bottomBody = pair.bodyA;
                let otherBody  = pair.bodyB;
                if(pair.bodyB.label == "bottom")
                {
                    bottomBody = pair.bodyB;
                    otherBody  = pair.bodyA;
                }
                if(bottomBody.label == "bottom") {
                    if (aBody.parts.includes(bottomBody)) {
                        if (!otherBody.isSensor) {
                            this.touchingGround--;
                        }
                        delete this.touchObjects[otherBody.id];
                    }
                }
            });
            this.touchingGround = Math.max(0, this.touchingGround);
        });*/
    }

    getName(): string {
        return TouchBodyComponent.name;
    }

}