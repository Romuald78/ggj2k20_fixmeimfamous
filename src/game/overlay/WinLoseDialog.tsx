import * as React from 'react';
import {phaserReactService} from "../phaser/PhaserReactService";
import {GameScene, GAME_SCENE_KEY} from "../main/scenes/GameScene";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

interface State {
    loseDialogOpen: boolean,
    winDialogOpen: boolean,
}

class WinLoseDialog extends React.Component<{}, State> {
    state: State = {
        loseDialogOpen: false,
        winDialogOpen: false,
    };

    componentDidMount() {
        let removeListener = phaserReactService.onSceneReady<GameScene>(GAME_SCENE_KEY,(scene)=>{
            scene.registerOnWinCallback(()=>{
                this.setState({winDialogOpen:true});
            });
            scene.registerOnLoseCallback(()=>{
                this.setState({loseDialogOpen:true});
            });
            removeListener();
        });
    }

    componentWillUnmount() {
    }


    goBack() {
        window.history.back();
    }

    public render() {
        return (<React.Fragment>
                <Dialog
                    open={this.state.loseDialogOpen}
                    onClose={()=>{}}
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
                        <DialogContentText id="alert-dialog-description" style={{textAlign:"center",color:"red",fontSize:"2.5em"}}>
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
                            this.setState({loseDialogOpen:false});
                            let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                            scene.restartLevel();
                        }} color="primary" autoFocus>
                            Retry
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.winDialogOpen}
                    onClose={()=>{}}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"You Win"}</DialogTitle>
                    <DialogContent>
                        <img style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            minWidth: "100%",
                        }}
                             src="./assets/game/ui/win-image.png"
                             alt=""/>
                        <DialogContentText id="alert-dialog-description"  style={{textAlign:"center",color:"green",fontSize:"2.5em"}}>
                            You Win
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={"contained"} onClick={() => {
                            this.goBack()
                        }} color="primary"
                                autoFocus>
                            Main Menu
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default WinLoseDialog;
