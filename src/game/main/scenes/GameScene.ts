import { ModuleFactory } from './../ggj2020/ModuleFactory';
import { phaserReactService } from "../../phaser/PhaserReactService";
import { GameObjects, Scene } from "phaser";
import * as EventEmitter from "eventemitter3";
import { GameCamera } from "../objects/GameCamera";
import { ECSWorld } from "../ecs/system/ECSWorld";
import { Entity } from "../ecs/core/Entity";
import { GfxGenericComponent } from "../ecs/system/gfx/GfxGenericComponent";
import { PlayerMovement } from "../ggj2020/PlayerMovement";
import { Life } from "../objects/components/Life";
import { PlayerFactory } from "../ggj2020/PlayerFactory";
import {RecipeFactory} from "../ggj2020/RecipeFactory";
import * as GameConstants from "../ggj2020/GameConstants";
import {PhysicGenericComponent} from "../ecs/system/physics/PhysicGenericComponent";
import {CameraFactory} from "../ggj2020/CameraFactory";
import * as Matter from "matter-js";
import {physicWorld} from "../ecs/system/physics/PhysicWorld";
import {MapFactory} from "../ggj2020/MapFactory";
import {ModuleInfo} from "../ggj2020/ModuleInfo";
export const GAME_SCENE_KEY: string = "GameScene";

let Stats = require("stats.js");
let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

export class GameScene extends Scene {
    eventEmitter: EventEmitter = new EventEmitter();

    //gameMap: GameMap;
    private gameCam: GameCamera;
    private players: Entity[] = [];

    private ecsWorld: ECSWorld;


    constructor() {
        super({
            key: GAME_SCENE_KEY
        });
    }

    restartLevel() {
        console.log("restart level");
        // Stop world activity
        this.ecsWorld.stop();
        // Go to next scene
        this.scene.start(GAME_SCENE_KEY);
    }

    displayWinScreen() {
        this.eventEmitter.emit("win", {});
    }

    displayLoseScreen() {
        this.eventEmitter.emit("lose", {});
    }

    registerOnWinCallback(callback: () => void): () => void {
        this.eventEmitter.on("win", callback);
        return () => {
            this.eventEmitter.off("win", callback);
        }
    }

    registerOnLoseCallback(callback: () => void): () => void {
        this.eventEmitter.on("lose", callback);
        return () => {
            this.eventEmitter.off("lose", callback);
        }
    }

    preload(): void {
    }

    inputTest() {
        window.addEventListener("gamepadconnected", (e: any) => {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
        });
        window.addEventListener("gamepaddisconnected", (e: any) => {
            console.log("Gamepad disconnected from index %d: %s",
                e.gamepad.index, e.gamepad.id);
        });
    }

    create(data): void {
        console.log(data);
        this.inputTest();
        this.ecsWorld = new ECSWorld(this);

        let removeListenerResizeEvent = phaserReactService.onResizeEvent((data) => {
            let width = data.width;
            let height = data.height;
            this.cameras.main.scaleManager.resize(width, height);
            this.cameras.main.setViewport(0, 0, width, height);
        });
        phaserReactService.onDestroyEvent(() => {
            removeListenerResizeEvent();
        });

        // Create background
        let map = new MapFactory(this.ecsWorld,this.scene.scene).create();
        let grass = this.add.tileSprite(GameConstants.MAP_W/2, GameConstants.MAP_H/2, 3.0*GameConstants.MAP_W,3.0*GameConstants.MAP_H, "grass");
        let bg = this.add.sprite(0,0, "background");
        bg.setOrigin(0,0);
        bg.setScale(GameConstants.MAP_W/bg.width,GameConstants.MAP_H/bg.height);

        //------------------------------------------------------------------------------
        // Physical borders
        let borderBox:Matter.Body;
        borderBox = Matter.Bodies.rectangle(GameConstants.MAP_W/2, 0,
            GameConstants.MAP_W, GameConstants.BORDER_THICKNESS,
        );
        borderBox = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [borderBox,],
        });
        Matter.World.add(physicWorld.world, borderBox);
        borderBox = Matter.Bodies.rectangle(GameConstants.MAP_W/2, GameConstants.MAP_H,
            GameConstants.MAP_W, GameConstants.BORDER_THICKNESS,
        );
        borderBox = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [borderBox,],
        });
        Matter.World.add(physicWorld.world, borderBox);
        borderBox = Matter.Bodies.rectangle(0, GameConstants.MAP_H/2,
            GameConstants.BORDER_THICKNESS,GameConstants.MAP_H
        );
        borderBox = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [borderBox,],
        });
        Matter.World.add(physicWorld.world, borderBox);
        borderBox = Matter.Bodies.rectangle(GameConstants.MAP_W, GameConstants.MAP_H/2,
            GameConstants.BORDER_THICKNESS,GameConstants.MAP_H
        );
        borderBox = Matter.Body.create({
            isStatic: true,
            mass: Infinity,
            parts: [borderBox,],
        });
        Matter.World.add(physicWorld.world, borderBox);




        // RECIPES
        let recipeFactory = new RecipeFactory(this.ecsWorld, this);
        recipeFactory.create(1);
        recipeFactory.create(2);





        let moduleFactory = new ModuleFactory(this.ecsWorld, this);
        let dw = GameConstants.MAP_W - 2*GameConstants.moduleWidthWU;
        let dh = GameConstants.MAP_H - 2*GameConstants.moduleHeightWU;
        let moduleList:Entity[] = [];
        for (let i = 1; i <= 20; i++) {
            let modEnt = moduleFactory.create( (i%5)+1, Math.random()*dw+GameConstants.moduleWidthWU, Math.random()*dh+GameConstants.moduleHeightWU);
            let modInfo:ModuleInfo = modEnt.getFirstComponentByName<ModuleInfo>("ModuleInfo");
            moduleList.push(modEnt);
        }

        let playerFactory = new PlayerFactory(this.ecsWorld, this);
        let playerList:Entity[] = [];
        // create players at appropriate locations with approprirate controllers !
        for (let i = 0; i < Object.keys(data.playersStartData).length; i++) {
            let key = Object.keys(data.playersStartData)[i];
            let player = data.playersStartData[key];
            let teamId = 0;
            if(player.team!=="blue"){
                let teamId = 1;
            }
            let ctrlID = -1;
            if(player.name ==="Keyboard"){
                ctrlID = -1;
            }else{
                ctrlID = player.name.split("-")[1];
            }
			let ent:Entity = playerFactory.create(i * 200 + 200, i * 100 + 300, i - 1, i % 2, moduleList);
            let phy:PhysicGenericComponent = ent.getFirstComponentByName( "PhysicGenericComponent" );
            playerList.push( ent );
        }



        let camFactory = new CameraFactory(this.ecsWorld,this);
        camFactory.create(playerList);




        //this.cameras.main.setBackgroundColor("#89fbf9")
        this.cameras.main.setBackgroundColor("#000000")


        console.log("GameScene Created");
        phaserReactService.notifySceneReadyEvent(this.scene.key);

    }

    update(time, delta): void {
        stats.begin();
        this.ecsWorld.update(delta);
        stats.end();
    }

}
