import * as React from 'react';
import {phaserReactService} from "../phaser/PhaserReactService";
import {GameScene, GAME_SCENE_KEY} from "../main/scenes/GameScene";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {PlayerComponent} from "./StartMenu";
import TargetPreview from "./TargetPreview";
import {Entity} from "../main/ecs/core/Entity";
import {ModuleGrid} from "../main/ggj2020/ModuleGrid";

interface State {
    loseDialogOpen: boolean,
    winDialogOpen: boolean,
    windata: any,
}

class WinLoseDialog extends React.Component<{}, State> {
    state: State = {
        loseDialogOpen: false,
        winDialogOpen: false,
        windata: {},
    };

    componentDidMount() {
        let removeListener = phaserReactService.onSceneReady<GameScene>(GAME_SCENE_KEY, (scene) => {
            scene.registerOnWinCallback((windata) => {
                this.setState({winDialogOpen: true, windata: windata});
            });
            scene.registerOnLoseCallback(() => {
                this.setState({loseDialogOpen: true});
            });
            removeListener();
        });
    }

    componentWillUnmount() {
    }


    goBack() {
        window.location.reload();
    }

    public render() {
        return (<React.Fragment>
                <Dialog
                    open={this.state.loseDialogOpen}
                    onClose={() => {
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"You Lose"}</DialogTitle>
                    <DialogContent>
                        <img style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            minWidth: "100%",
                        }}
                             src="./assets/game/ui/lose-image.png"
                             alt=""/>
                        <DialogContentText id="alert-dialog-description"
                                           style={{textAlign: "center", color: "red", fontSize: "2.5em"}}>
                            You Lose
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={"contained"} onClick={() => {
                            this.goBack()
                        }} color="primary">
                            Main Menu
                        </Button>
                        <Button variant={"contained"} onClick={() => {
                            this.setState({loseDialogOpen: false});
                            let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                            scene.restartLevel();
                        }} color="primary" autoFocus>
                            Retry
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.winDialogOpen}
                    onClose={() => {
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{backgroundColor: this.state.windata.team === 0 ? "#00009FFF" : "#9F0000FF"}}>
                        <PlayerComponent classes={{}} key={""} name={this.state.windata.team === 0 ? "Blue" : "Red"}
                                         src={this.state.windata.team === 0 ?
                                             "./assets/main_atlas/player_front/player_front_blue_0.png" :
                                             "./assets/main_atlas/player_front/player_front_0.png"
                                         } team={this.state.windata.team === 0 ? "blue" : "red"}></PlayerComponent>
                        {/*this.state.windata.receipe &&
                            <div>
                        <TargetPreview color={this.state.windata.team === 0 ? "#00009FFF" : "#9F0000FF"}
                                       team={this.state.windata.team === 0 ? "blue" : "red"}
                                       modulegrid={((this.state.windata.receipe) as Entity).getFirstComponentByName<ModuleGrid>(ModuleGrid.name)}/>
                            </div>
                        */}

                        <DialogContentText id="alert-dialog-description" style={{
                            backgroundColor: this.state.windata.team === 0 ? "#00009FFF" : "#9F0000FF",
                            textAlign: "center", color: "white", fontSize: "2.5em"
                        }}>
                            {(this.state.windata.team === 0 ? "Blue" : "Red") + " Win!"}
                        </DialogContentText>
                        <Button variant={"contained"} onClick={() => {
                            this.goBack()
                        }} color="primary"
                                autoFocus>
                            Restart
                        </Button>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default WinLoseDialog;
