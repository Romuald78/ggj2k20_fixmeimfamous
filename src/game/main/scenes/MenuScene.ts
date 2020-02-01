import { Scene } from "phaser";
import {phaserReactService} from "../../phaser/PhaserReactService";
import {GAME_SCENE_KEY} from "./GameScene";
import {InputComponent} from "../ecs/system/controls/InputComponent";

export const MENU_SCENE_KEY: string = "MenuScene";

export class MenuScene extends Scene {

    public inputComponent;

    constructor() {
        super({
            key: MENU_SCENE_KEY
        });
    }

    preload(): void {

    }

    create(): void {
        this.inputComponent = new InputComponent();
        phaserReactService.notifySceneReadyEvent(this.scene.key);
    }

    goNext(players){
        this.scene.start(GAME_SCENE_KEY,players);
    }

    update(time, delta): void {
        if(this.inputComponent) {
            this.inputComponent.updateScript(delta);
        }
    }

}
