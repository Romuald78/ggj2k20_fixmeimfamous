import {Scene} from "phaser";
import {INTRO_SCENE_KEY} from "./IntroScene";

export const LOADER_SCENE_KEY: string = "LoaderScene";

export class LoaderScene extends Scene {


    constructor() {
        super({
            key: LOADER_SCENE_KEY
        });
    }

    preload(): void {
        // Get dimensions of the screen
        let W = this.game.canvas.width;
        let H = this.game.canvas.height;
        let barW  = (W*3)/4;
        let barH  = H/10;
        let space = barH/7;
        let refX  = (W-barW)/2;
        let refY  = (H-barH)/2;

        //------------------------------------------------------------------------
        // Create progress bar and text
        //------------------------------------------------------------------------
        var progressBox = this.add.graphics();
        var progressBar = this.add.graphics();
        progressBox.fillStyle(0x343434, 0.75);
        progressBox.fillRect(refX, refY, barW, barH);

        var text = this.add.text(0,0, "Loading 100%", { fontFamily: 'Verdana', fontSize: 50 });
        text.setPosition((W-text.width)/2,(H-text.height)/2);
        text.setText("Loading 0%");
        text.setColor("#606060");

        //------------------------------------------------------------------------
        // Create listeners to the loading progress events
        //------------------------------------------------------------------------
        this.load.on('progress', function (value) {
            progressBar.clear();
            let red   = (1-value)*255;
            let green = (  value)*255;
            let blue  = 0;
            let clr = (red<<16)+(green<<8)+blue;
            progressBar.fillStyle(clr, 0.75);
            progressBar.fillRect(refX+space, refY+space, (barW-2*space) * value, barH-2*space);
            value = Math.round(value*100);
            text.setText("Loading "+value+"%");
        });

        // Add files into a list in order to be displayed when all the loading process is finished
        let files = [];
        this.load.on('fileprogress', function (file) {
            files.push(file.src);
        });
        this.load.on('complete', function () {
            console.log('preload complete',files);
        });

        //------------------------------------------------------------------------
        // Add asset preloading here
        //------------------------------------------------------------------------
        // MISC assets
        this.load.image('logoGGJ', 'assets/misc/logoGGJ.png');
        this.load.image('logoPhaser', 'assets/misc/logoPhaser.jpg');
        this.load.image('logoRPHStudio', 'assets/misc/logoRPHStudio.png');

        //UI assets
        this.load.image('ux-01', 'assets/game/ui/croco-logo.png');
        this.load.image('ux-02', 'assets/game/ui/lose-image.png');
        this.load.image('ux-03', 'assets/game/ui/start-screen-image.png');
        this.load.image('ux-04', 'assets/game/ui/win-image.png');
        this.load.image('ux-05', 'assets/game/ui/player/player-1.png');
        this.load.image('ux-06', 'assets/game/ui/player/player-1-dead.png');
        this.load.image('ux-07', 'assets/game/ui/player/player-2.png');
        this.load.image('ux-08', 'assets/game/ui/player/player-2-dead.png');
        this.load.image('ux-09', 'assets/game/ui/player/player-3.png');
        this.load.image('ux-10', 'assets/game/ui/player/player-3-dead.png');
        // Background image (sky)
        this.load.image('sky', 'assets/game/map/backgrounds/Sky.png');
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/game/map/level01/leveldesign03.json');
        // tiles in spritesheet
        this.load.spritesheet('teamCroco3', 'assets/game/map/level01/teamCroco3.png', {frameWidth: 128, frameHeight: 128});
        // lift spritesheet
        this.load.spritesheet('liftSpriteSheet', 'assets/game/map/level01/teamCroco3.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        // PLAYER ANIMATION (ATLAS)
        this.load.atlas('crocoAtlas', 'assets/game/characters/croco_atlas.png', 'assets/game/characters/croco.json');
        // SWITCH ANIMATION (ATLAS)
        this.load.atlas('switchAtlas', 'assets/game/map/level01/lift_switch.png', 'assets/game/map/level01/lift_switch.json');

    }

    create(): void {
    }

    update(time, delta): void {
        // Go to the intro scene directly
        this.scene.start(INTRO_SCENE_KEY);
    }

}
