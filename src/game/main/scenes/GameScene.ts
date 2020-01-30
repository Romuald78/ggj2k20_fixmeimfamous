import {phaserReactService} from "../../phaser/PhaserReactService";
import {GameObjects, Scene, Tilemaps} from "phaser";
import * as EventEmitter from "eventemitter3";
import {GameCamera} from "../objects/GameCamera";
import {ECSWorld} from "../ecs/system/ECSWorld";
import {LiftFactory} from "../objects/factories/LiftFactory";
import {Entity} from "../ecs/core/Entity";
import {LiftMove} from "../objects/components/LiftMove";
import {MapFactory} from "../objects/factories/MapFactory";
import {MapLifts} from "../objects/components/MapLifts";
import {Bound} from "../objects/components/Bound";
import {GfxGenericComponent} from "../ecs/system/gfx/GfxGenericComponent";
import {PlayerFactory} from "../objects/factories/PlayerFactory";
import {PlayerMovement} from "../objects/components/PlayerMovement";
import {PlayerSpikeInteraction} from "../objects/components/PlayerSpikeInteraction";
import {Life} from "../objects/components/Life";
import {PlayerEndOfLife} from "../objects/components/PlayerEndOfLife";
import {InputComponent} from "../ecs/system/controls/InputComponent";

export const GAME_SCENE_KEY: string = "GameScene";


export class GameScene extends Scene {
    eventEmitter: EventEmitter = new EventEmitter();

    //gameMap: GameMap;
    private gameCam: GameCamera;
    private players: Entity[] = [];
    private lifts: Entity[] = [];

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private ecsWorld: ECSWorld;
    private mapEntity: Entity;


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

    selectPlayer(playerNumber: number) {
        this.players.forEach(player => {
            let movState = player.getFirstComponentByName<PlayerMovement>(PlayerMovement.name);
            movState.setInputState(false);
        });

        if (this.players[playerNumber]) {
            let gfx = this.players[playerNumber].getFirstComponentByName<GfxGenericComponent<GameObjects.Image>>("gfx").getGfxObj();
            let movState = this.players[playerNumber].getFirstComponentByName<PlayerMovement>(PlayerMovement.name);
            let life = this.players[playerNumber].getFirstComponentByName<Life>(Life.name);
            this.gameCam.startFollow(gfx).then(() => {
                if (life.isAlive()) {
                    movState.setInputState(true);
                }
            });
        }

    }

    displayWinScreen() {
        this.eventEmitter.emit("win", {});
    }

    displayLoseScreen() {
        this.eventEmitter.emit("lose", {});
    }

    killplayer(player: number) {
        this.eventEmitter.emit("player_dead", player);
        // check end game (looser)
        if(this.hasLost()){
            this.displayLoseScreen();
        }
    }

    private hasLost():boolean {
        let lost = true;
        this.players.forEach( (p) => {
            if( p.getFirstComponentByName<Life>(Life.name).isAlive()){
                lost = false;
            }
        } );
        return lost;
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

    registerOnPlayerDead(callback: (player: number) => void): () => void {
        this.eventEmitter.on("player_dead", callback);
        return () => {
            this.eventEmitter.off("player_dead", callback);
        }
    }

    preload(): void {
    }

    inputTest(){
        window.addEventListener("gamepadconnected", (e:any) => {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
        });
        window.addEventListener("gamepaddisconnected", (e:any) => {
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

        let sky = this.add.sprite(0, 0, 'sky');

        this.cameras.main.setZoom(0.5);


        // Create cursors
        //this.cursors = this.input.keyboard.createCursorKeys();
        console.log(navigator.getGamepads());


        /*ic.registerEvent("JUMP", (an,st)=>{
            console.log("ACTION NAME = "+an+" / STATE = "+st);
        })*/



        let playerFactory = new PlayerFactory(this.ecsWorld, this);

        //----------------------------------------------
        // Create Lift entities
        //----------------------------------------------
        let liftFactory = new LiftFactory(this.ecsWorld, this);

        //----------------------------------------------
        // Create MAP entity
        //----------------------------------------------
        let mapFactory = new MapFactory(this.ecsWorld, this);
        this.mapEntity = mapFactory.createMap(this.players, liftFactory);

        this.players[0] = playerFactory.create(400,"right",0);
        this.players[1] = playerFactory.create(650,"right",0);
        this.players[2] = playerFactory.create(1150,"left",0);

        this.gameCam = new GameCamera(this);

        // Lifts
        this.lifts = this.mapEntity.getFirstComponentByName<MapLifts>(MapLifts.name).getLifts();
        let mapBound = this.mapEntity.getFirstComponentByName<Bound>(Bound.name).getBound();
        this.gameCam.setBounds(mapBound.x, mapBound.y, mapBound.width, mapBound.height);

        sky.setScale(mapBound.width / 1920, mapBound.height / 1080);
        sky.setOrigin(0, 0);
        sky.setPosition(0, 0);

        this.selectPlayer(0);


        // Make the lifts go up at start
        this.lifts[1].getFirstComponentByName<LiftMove>(LiftMove.name).liftUp();
        this.lifts[0].getFirstComponentByName<LiftMove>(LiftMove.name).liftUp();


        phaserReactService.eventEmitter.emit("displayOverlay",true);


        // INTERACTIONS

        let rules:Entity = this.ecsWorld.createEntity();
        // For all three players
        for(let i=0;i<this.players.length;i++){
            let p = this.players[i];
            // Add SPIKE interaction
            let spik:PlayerSpikeInteraction = new PlayerSpikeInteraction(
                p.getFirstComponentByName("gfx"),
                this.mapEntity.getFirstComponentByName("spikes"),
                p.getFirstComponentByName(Life.name)
            );
            rules.addComponent(spik);

            // Add PLAYER END OF LIFE
            let eol = new PlayerEndOfLife( p, ()=> {this.killplayer(i)} );
            rules.addComponent(eol);
        }

        this.cameras.main.setBackgroundColor("#89fbf9")



        console.log("GameScene Created");
        phaserReactService.notifySceneReadyEvent(GAME_SCENE_KEY);

    }

    update(time, delta): void {

        this.ecsWorld.update(delta);

        // Camera Update
        this.gameCam.update(delta);


    }

}
