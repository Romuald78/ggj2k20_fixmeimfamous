import * as EventEmitter from "eventemitter3";
import {Game,Scene} from "phaser";

export class PhaserReactService {
    private _parameters:any;
    eventEmitter = new EventEmitter();
    gameDestroyedCallback:(()=>void)[] = [];
    private _game: Game;

    get parameters(): any {
        return this._parameters;
    }

    set parameters(value: any) {
        this._parameters = value;
    }

    get game(): Game {
        return this._game;
    }

    set game(value: Game) {
        this._game = value;
        this.eventEmitter.emit("game",this._game);
    }

    onDestroyEvent(callback:()=>void){
        this.gameDestroyedCallback.push(callback);
    }

    destroy(){
        this.gameDestroyedCallback.forEach(value => {
            value();
        });
        this.gameDestroyedCallback = [];
        this.parameters = {};
    }

    onResizeEvent(callback:(data:{width: number, height: number})=>void):()=>void{
        this.eventEmitter.on("resize",callback);
        return ()=>{
            this.eventEmitter.off("resize",callback);
        }
    }

    getScene <T extends Scene>(sceneKey:string):T{
        return this.game.scene.getScene(sceneKey) as T;
    }

    resize(width: number, height: number) {
        this.eventEmitter.emit("resize",{
            width:width,
            height:height,
        });
    }

    notifySceneReadyEvent(key){
        this.eventEmitter.emit("scene/"+key,this.getScene(key));
    }

    onSceneReady<T extends Scene>(key:string,callback: (scene:T) => void):()=>void {
        this.eventEmitter.on("scene/"+key,callback);
        this.onGameReady(game1 => {
            if(this.getScene(key)){
                this.notifySceneReadyEvent(key);
            }
        });
        return ()=>{
            this.eventEmitter.off("scene/"+key,callback);
        }
    }

    onGameReady(callback: (game:Game) => void):()=>void {
        this.eventEmitter.on("game",callback);
        return ()=>{
            this.eventEmitter.off("game",callback);
        }
    }
}

export let phaserReactService = new PhaserReactService();