import * as EventEmitter from "eventemitter3";
import * as Matter from "matter-js";
import {Scene} from "phaser";
import {Component} from "../../core/Component";
import {ADD_COMPONENT_EVT, DEL_COMPONENT_EVT} from "../ECSWorld";
import {PhysicGenericComponent} from "./PhysicGenericComponent";

export interface Slavable {
    setPosition(x, y): void,

    setRotation(radians): void
}

export class PhysicWorld {

    world: Matter.World;
    userData: { [id: number]: any[] };
    bodyToUpdate: { [id: number]: Matter.Body };
    engine: Matter.Engine;
    id: number;
    noGravityBodies:{ [id:number]: Matter.Body };
    private removeListener: () => void;

    constructor() {
        this.init();

    }

    public setDelComponentEmitter( eventEmitter:EventEmitter ){
        eventEmitter.on(DEL_COMPONENT_EVT,(component:Component) => {
            if("getBody" in component){
                let phy = component as PhysicGenericComponent;
                Matter.World.remove(physicWorld.world, phy.getBody());
            }
        })
    }

    public restart(){
        this.removeListener();
        this.init();
    }

    init() {
        console.log("Physic world restart...");
        this.userData = {};
        this.bodyToUpdate = {};
        this.id = 0;
        this.noGravityBodies = {};
        let world = Matter.World.create({
            gravity: {
                x: 0,
                y: 9.8, //9.8m/s2
                scale: 0.001
            },
        });
        this.engine = Matter.Engine.create({world: world});
        this.world = this.engine.world;
        // create runner
        let runner = Matter.Runner.create({});
        Matter.Runner.run(runner, this.engine);

        //----- Matter World events -----//
        Matter.Events.on(this.world, "afterAdd", (body: {
            name: string,
            object: Matter.Body,
            source: Matter.Body,
        }) => {
            this.bodyToUpdate[body.object.id] = body.object;
        });
        Matter.Events.on(this.world, "afterRemove", (body: {
            name: string,
            object: Matter.Body,
            source: Matter.Body,
        }) => {
            delete this.bodyToUpdate[body.object.id];
        });

        //----- Matter Engine events -----//
        // Before update, compensate gravity
        let cbBeforeUpdate = (event) => {
            this.compensateGravity();
        };
        Matter.Events.on(this.engine, 'beforeUpdate', cbBeforeUpdate );
        // after update, update graphics
        let cbAfterUpdate  = (event) => {
            this.updateGraphicsWithPhysicsData();
        };
        Matter.Events.on(this.engine, 'afterUpdate', cbAfterUpdate );
        // when restarting, remove listeners
        this.removeListener = ()=>{
            Matter.Events.off(this.engine, "beforeUpdate",cbBeforeUpdate );
            Matter.Events.off(this.engine, 'afterUpdate',cbAfterUpdate );
        }



    }

    addUserData(body: Matter.Body, object: any) {
        if (!this.userData[body.id]) {
            this.userData[body.id] = []
        }
        this.userData[body.id].push(object);
    }

    getUserData(body: Matter.Body): any[] {
        return this.userData[body.id] || [];
    }

    updateGraphicsWithPhysicsData() {
        Object.keys(this.bodyToUpdate).forEach(id => {
            let physicBody = this.bodyToUpdate[id];
            if (this.userData[id]) {
                this.userData[id].forEach(slave => {
                    if (slave.setPosition && slave.setRotation) {
                        slave.setPosition(physicBody.position.x, physicBody.position.y);
                        slave.setRotation(physicBody.angle);
                    }
                })
            }
        })
    }

    // Store a body into the "no gravity" list
    disableGravity(body:Matter.Body){
        let id = body.id;
        if( !this.noGravityBodies[id] ){
            //console.log("Disable gravity for "+id);
            this.noGravityBodies[id] = body;
        }
    }
    // Remove a body from the "no gravity" list
    enableGravity(body:Matter.Body){
        let id = body.id;
        if( this.noGravityBodies[id] ){
            //console.log("Enable gravity for "+id);
            delete this.noGravityBodies[id];
        }
    }
    // compensate gravity for all registered bodies
    compensateGravity(){
        Object.keys(this.noGravityBodies).forEach(id => {
            let body:Matter.Body = this.noGravityBodies[id];
            let gravity:Matter.Gravity = this.engine.world.gravity;
            Matter.Body.applyForce(body, body.position, {
                x: -gravity.x * gravity.scale * body.mass,
                y: -gravity.y * gravity.scale * body.mass
            });
        });
    }



}

export let physicWorld = new PhysicWorld();