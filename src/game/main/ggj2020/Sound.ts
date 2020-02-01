import {Component} from "../ecs/core/Component";
import {Scene} from "phaser";

export class Sound implements Component{
    private music: Phaser.Sound.BaseSound;

    getName(): string {
        return Sound.name;
    }

    constructor(private scene:Scene,soundKey:string){
        this.music = this.scene.sound.add('theme');
        this.music.play();
    }
}