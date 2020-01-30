import {Scene} from "phaser";
import * as Matter from "matter-js";

export class PhysicWorldDebugger {
    debugData:Phaser.GameObjects.Graphics[] = [];
    enabled = true;
    private removeListener: () => void;

    constructor(private scene: Scene, engine: Matter.Engine) {
        if (this.enabled) {
            // ADD
            let cbAfterAdd = (body: {
                name: string,
                object: Matter.Body,
                source: Matter.Body,
            }) => {
                // parts contains all bodies + it contains the whole compound body itself
                if (body.object.parts.length > 1) {
                    body.object.parts.forEach(subbody => {
                        // change color for the compound body
                        let clr:number = body.object == subbody ? 0x0000FF : 0xFF0000;
                        this.addBoundGfxToDisplay(subbody, scene, clr);
                    });
                }
                else{
                    this.addBoundGfxToDisplay(body.object, scene, 0x00FF00);
                }
            };
            Matter.Events.on(engine.world, "afterAdd",cbAfterAdd );

            // REMOVE
            let cbAfterRemove = (event: {
                name: string,
                object: Matter.Body,
                source: Matter.Body,
            }) => {
                // parts contains all bodies + it contains the whole compound body itself
                if (event.object.parts.length > 1) {
                    event.object.parts.forEach(subbody => {
                        this.removeBoundGfxToDisplay(subbody);
                    });
                }
                else{
                    this.removeBoundGfxToDisplay(event.object);
                }
            };
            Matter.Events.on(engine.world, "afterRemove",cbAfterRemove );

            // UPDATE
            let cbAfterUpdate  = (event) => {
                this.updateGraphicsWithPhysicsData();
            };
            Matter.Events.on(engine, 'afterUpdate',cbAfterUpdate );

            this.removeListener = ()=>{
                Matter.Events.off(engine.world, "afterAdd",cbAfterAdd );
                Matter.Events.off(engine, 'afterUpdate',cbAfterUpdate );
                Matter.Events.off(engine, 'afterRemove',cbAfterRemove );
            }
        }
    }

    addBoundGfxToDisplay(body: Matter.Body, scene, color: number) {
        if (body["circleRadius"]) {
            let circle = new Phaser.Geom.Circle(0, 0, body["circleRadius"]);
            let graphics = scene.add.graphics({
                lineStyle: {width: 2, color: color},
                fillStyle: {color: 0xff0000}
            }).strokeCircleShape(circle);
            graphics.dataDebugPhysic = body as any;
            this.debugData.push(graphics);
        } else {
            let rectangle = new Phaser.Geom.Rectangle(-(body.bounds.max.x - body.bounds.min.x) / 2, -(body.bounds.max.y - body.bounds.min.y) / 2, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
            let graphics = scene.add.graphics({
                lineStyle: {width: 2, color: color},
                fillStyle: {color: 0xff0000}
            }).strokeRectShape(rectangle);
            graphics.dataDebugPhysic = body as any;
            this.debugData.push(graphics);
        }
    }

    removeBoundGfxToDisplay(body: Matter.Body){
        //console.log("remove "+body);
        //console.log("avant = "+this.debugData.length);
        this.debugData.forEach( (gfx) => {
            if( (gfx as any).dataDebugPhysic == body){
                this.debugData = this.debugData.filter( (graph) => {
                    return graph != gfx;
                } );
                gfx.destroy();
            }
        });
        //console.log("après = "+this.debugData.length);
    }

    updateGraphicsWithPhysicsData() {
        this.debugData.forEach(debugInfo => {
            debugInfo.x = (debugInfo as any).dataDebugPhysic.position.x;
            debugInfo.y = (debugInfo as any).dataDebugPhysic.position.y;
            debugInfo.angle = (debugInfo as any).dataDebugPhysic.angle;
            debugInfo.depth = 1000000;
        })
    }


    stop(){
        this.removeListener();
        this.debugData = [];
        console.log("Debug list cleaned !")
    }

}