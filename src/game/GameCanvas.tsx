import * as React from 'react';
import './Game.css';
import {phaserReactService} from "./phaser/PhaserReactService";
import {BootScene} from "./main/scenes/BootScene";
import {LoaderScene} from "./main/scenes/LoaderScene";
import {IntroScene} from "./main/scenes/IntroScene";
import {GameScene} from "./main/scenes/GameScene";
import {Game,Types} from "phaser";
import {MenuScene} from "./main/scenes/MenuScene";

interface State {
}

class GameCanvas extends React.Component<{}, State> {
    state: State = {};
    private game: Game;
    private config: Types.Core.GameConfig;
    private canvaName = 'game';

    componentDidMount() {

        setTimeout(() => {
            let elementById = document.getElementById(this.canvaName);
            let offsetWidth = elementById.offsetWidth;//window.innerWidth,
            let offsetHeight = elementById.offsetHeight;//window.innerHeight,
            this.setState({
                overlayStyle: {
                    position: "absolute",
                    left: elementById.getBoundingClientRect().left + "px",
                    top: elementById.getBoundingClientRect().top + "px",
                    width: offsetWidth + "px",
                    height: offsetHeight + "px"
                }
            });
            let scenes: any[] = [BootScene, LoaderScene, IntroScene, GameScene,MenuScene];
            this.config = {
                title: "FixMe!",
                url: "",
                version: "1.0",
                width: offsetWidth,
                height: offsetHeight,
                type: Phaser.AUTO,
                parent: this.canvaName,
                scene: scenes,
                input: {
                    keyboard: true,
                    mouse: true,
                    touch: true,
                    gamepad: true
                },
                physics: {},
                backgroundColor: "#000000",
            };
            this.game = new Phaser.Game(this.config);
            phaserReactService.game = this.game;
            console.log("Game initialized");
        }, 0);
    }

    componentWillUnmount() {
        phaserReactService.destroy();
        this.game.destroy(true);
    }

    public render() {
        return (
            <div id={this.canvaName}></div>
        );
    }
}

export default GameCanvas;
