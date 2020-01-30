import {GameObjects} from "phaser";
import {GfxComponent} from "./GfxComponent";

export class GfxImageComponent extends GameObjects.Image implements GfxComponent{

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        //scene.add.image(x, y, texture, frame);
        super(scene, x, y, texture, frame);
        (scene.add as any).displayList.add(this);
    }

    scaleToSize(w: number) {
        super.setScale(this.width/w);
    }

    getName(): string {
        return "GfxComponent";
    }

}