import {Scene} from "phaser";
import {phaserReactService} from "../../phaser/PhaserReactService";
import {LOADER_SCENE_KEY} from "./LoaderScene";

export const BOOT_SCENE_KEY:string = "BootScene";

export class BootScene extends Scene {
    constructor() {
        super({
            key: BOOT_SCENE_KEY
        });
    }


    create(): void {
    }

    update(): void {
        this.scene.start(LOADER_SCENE_KEY);

    }
}
