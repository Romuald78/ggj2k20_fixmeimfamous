import {phaserReactService} from "../../phaser/PhaserReactService";
import {Scene} from "phaser";
import {GAME_SCENE_KEY} from "./GameScene";

export const INTRO_SCENE_KEY: string = "IntroScene";

export class IntroScene extends Scene {

    private SPEED:number;
    private curTime:number;
    private goToNextScene:number;
    private logoGGJ:Phaser.GameObjects.Image;
    private logoRPH:Phaser.GameObjects.Image;
    private logoPhaser:Phaser.GameObjects.Image;

    constructor() {
        super({
            key: INTRO_SCENE_KEY
        });
        this.SPEED = 3333;
        this.goToNextScene = 0;
        // KEY DOWN LISTENER : if someone press a key, go to the next scene
        window.document.addEventListener('keyup', (evt)=>{
            this.goToNextScene = 2;
        });
    }

    private checkGamePadButton(){
        let pads = navigator.getGamepads();
        if( pads ){
            for(let p=0; p<pads.length; p++){
                if(pads[p]!==null) {
                    let buttons = pads[p].buttons;
                    if (buttons) {
                        for (let b = 0; b < buttons.length; b++) {
                            if (buttons[b].touched) {
                                if (this.goToNextScene == 1) {
                                    this.goToNextScene = 2;
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
        // there is NO button pressed
        if(this.goToNextScene == 0){
            this.goToNextScene = 1;
        }
    }

    private fadeSprite(sprite, time0){
        // set the sprite in foreground
        sprite.setDepth(100);
        // Get level0
        let lvl0 = 0;
        let lvl1 = 0;
        let step = 1/6;
        if(time0 < step){
            // #1
            lvl0 = 0;
            lvl1 = time0/step;
        }
        else if(time0<2*step){
            // #2
            lvl0 = (time0-step)/step;
            lvl1 = 1;
        }
        else if(time0<3*step){
            // #3
            lvl0 = 1;
            lvl1 = 1;
        }
        else if(time0<4*step){
            // #4
            lvl0 = 1;
            lvl1 = (4*step-time0)/step;
        }
        else if(time0<5*step){
            // #5
            lvl0 = (5*step-time0)/step;
            lvl1 = 0;
        }
        else{
            // #6
            lvl0 = 0;
            lvl1 = 0;
        }
        // compute Tint and apply
        let valueTL = Math.round(lvl0*255);
        let valueBR = Math.round(lvl1*255);
        let valueTR = Math.round(((3*lvl1)+(1*lvl0))*255/4);
        let valueBL = Math.round(((1*lvl1)+(3*lvl0))*255/4);
        valueTL = (valueTL<<16) + (valueTL<<8) + (valueTL);
        valueBR = (valueBR<<16) + (valueBR<<8) + (valueBR);
        valueTR = (valueTR<<16) + (valueTR<<8) + (valueTR);
        valueBL = (valueBL<<16) + (valueBL<<8) + (valueBL);
        sprite.setTint(valueTL,valueTR,valueBL,valueBR);
    }

    preload(): void {
    }

    create(): void {
        phaserReactService.notifySceneReadyEvent(GAME_SCENE_KEY);

        // Get screen dimensions
        let W = this.game.canvas.width;
        let H = this.game.canvas.height;
        let scaleRatio;
        // Set timer
        this.curTime = 0;

        // Load GGJ
        this.logoGGJ = this.add.sprite( W/2,H/2,"logoGGJ" );
        scaleRatio = Math.min( W/this.logoGGJ.width, H/this.logoGGJ.height ) * 0.9;
        this.logoGGJ.setScale(scaleRatio, scaleRatio);
        this.logoGGJ.setTint(0);
        // Load RPH
        this.logoRPH = this.add.sprite( W/2,H/2,"logoRPHStudio" );
        scaleRatio = Math.min( W/this.logoRPH.width, H/this.logoRPH.height ) * 0.9;
        this.logoRPH.setScale(scaleRatio, scaleRatio);
        this.logoRPH.setTint(0);
        // Load Phaser
        this.logoPhaser = this.add.sprite( W/2,H/2,"logoPhaser" );
        scaleRatio = Math.min( W/this.logoPhaser.width, H/this.logoPhaser.height ) * 0.9;
        this.logoPhaser.setScale(scaleRatio, scaleRatio);
        this.logoPhaser.setTint(0);
    }

    update(time, delta): void {
        // Increase time
        this.curTime += delta;
        // Set all sprites to 0 depth
        this.logoGGJ.setDepth(0);
        this.logoRPH.setDepth(0);
        this.logoPhaser.setDepth(0);

        // check gamepad button
        this.checkGamePadButton();

        // Check if we have to skip
        if(this.goToNextScene == 2){
            this.curTime = 1000000000;
        }

        // Display All logos
        let step1 = this.SPEED;
        let step2 = 2*this.SPEED;
        let step3 = 3*this.SPEED;
        if(this.curTime <= step1){
            // display the Global game jam logo
            this.fadeSprite(this.logoGGJ, this.curTime/step1);
        }
        else if(this.curTime <= step2){
            // display the RPH Studio logo
            this.fadeSprite(this.logoRPH, (this.curTime-step1)/(step2-step1));
        }
        else if(this.curTime <= step3){
            // display the PHASER JS logo
            this.fadeSprite(this.logoPhaser, (this.curTime-step2)/(step3-step2));
        }
        else {
            // Start the game
            this.scene.start(GAME_SCENE_KEY);
        }

    }

}
