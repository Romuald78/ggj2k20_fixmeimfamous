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

export const GAME_SCENE_KEY: string = "GameScene";


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

    create(): void {
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


        //this.cameras.main.setZoom(0.5);

        let playerFactory = new PlayerFactory(this.ecsWorld, this);

        // create players at appropriate locations with approprirate controllers !
        for (let i = 0; i < 4; i++) {
            playerFactory.create(i * 200 + 200, i * 100 + 300, i - 1, i % 2);
        }

        let moduleFactory = new ModuleFactory(this.ecsWorld, this);
        /*for (let i = 0; i < 4; i++) {
            moduleFactory.create(i + 1, i * 100 + 100, i * 20 + 150);
        }*/

        //----------------------------------------------
        // Create MAP entity
        //----------------------------------------------
        //let mapFactory = new MapFactory(this.ecsWorld, this);
        //this.mapEntity = mapFactory.createMap(this.players, liftFactory);

        this.gameCam = new GameCamera(this);

        // Lifts
        this.gameCam.setBounds(0, 0, 1000, 1000);

        //phaserReactService.eventEmitter.emit("displayOverlay", true);

        //this.cameras.main.setBackgroundColor("#89fbf9")
        this.cameras.main.setBackgroundColor("#000000")

        console.log("GameScene Created");
        phaserReactService.notifySceneReadyEvent(GAME_SCENE_KEY);

    }

    update(time, delta): void {

        this.ecsWorld.update(delta);

        // Camera Update
        this.gameCam.update(delta);


    }

}
