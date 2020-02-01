import { Scene } from "phaser";
import { INTRO_SCENE_KEY } from "./IntroScene";

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
        let barW = (W * 3) / 4;
        let barH = H / 10;
        let space = barH / 7;
        let refX = (W - barW) / 2;
        let refY = (H - barH) / 2;

        //------------------------------------------------------------------------
        // Create progress bar and text
        //------------------------------------------------------------------------
        var progressBox = this.add.graphics();
        var progressBar = this.add.graphics();
        progressBox.fillStyle(0x343434, 0.75);
        progressBox.fillRect(refX, refY, barW, barH);

        var text = this.add.text(0, 0, "Loading 100%", { fontFamily: 'Verdana', fontSize: 50 });
        text.setPosition((W - text.width) / 2, (H - text.height) / 2);
        text.setText("Loading 0%");
        text.setColor("#606060");

        //------------------------------------------------------------------------
        // Create listeners to the loading progress events
        //------------------------------------------------------------------------
        this.load.on('progress', function (value) {
            progressBar.clear();
            let red = (1 - value) * 255;
            let green = (value) * 255;
            let blue = 0;
            let clr = (red << 16) + (green << 8) + blue;
            progressBar.fillStyle(clr, 0.75);
            progressBar.fillRect(refX + space, refY + space, (barW - 2 * space) * value, barH - 2 * space);
            value = Math.round(value * 100);
            text.setText("Loading " + value + "%");
        });

        // Add files into a list in order to be displayed when all the loading process is finished
        let files = [];
        this.load.on('fileprogress', function (file) {
            files.push(file.src);
        });
        this.load.on('complete', function () {
            console.log('preload complete', files);
        });

        //------------------------------------------------------------------------
        // Add asset preloading here
        //------------------------------------------------------------------------
        // MISC assets
        this.load.image('logoGGJ', 'assets/misc/logoGGJ.png');
        this.load.image('logoPhaser', 'assets/misc/logoPhaser.jpg');
        this.load.image('logoRPHStudio', 'assets/misc/logoRPHStudio.png');
        this.load.audio('theme', ["assets/sound/GGJ - Fix Me I'm Famous.mp3"]);


        // Background image (map)
        this.load.image('background', 'assets/map/map.png');
        this.load.image('grass', 'assets/map/grass.png');

        // PLAYER ANIMATION (ATLAS)
        this.load.atlas('atlas', 'assets/main_atlas/main_atlas.png', 'assets/main_atlas/main_atlas.json');

    }

    create(): void {
    }

    update(time, delta): void {
        // Go to the intro scene directly
        this.scene.start(INTRO_SCENE_KEY);
    }

}
