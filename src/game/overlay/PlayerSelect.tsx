import * as React from 'react';
import Avatar from "@material-ui/core/Avatar/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip";
import Paper from "@material-ui/core/Paper/Paper";
import {phaserReactService} from "../phaser/PhaserReactService";
import {GAME_SCENE_KEY, GameScene} from "../main/scenes/GameScene";
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";

const styles = {
    bigAvatar: {
        margin: 10,
        width: 120,
        height: 120,
    },
};

interface PlayerInterface {
    id: number,
    name: string,
    src: string,
    srcdead: string,
    dead: boolean,
}

interface State {
    players: PlayerInterface[],
    selected: number,
}

interface PlayerProps extends PlayerInterface {
    classes: any,
    key: string,
    selected: boolean,
    onSelect: (id: number) => void
}

class Player extends React.Component<PlayerProps, {}> {

    private getBgColor(){
        if( !this.props.dead ) {
            if(this.props.selected){
                return "#00C200";
            }
            else{
                return "#006200";
            }
        }
        else {
            if(this.props.selected){
                return "#C20000";
            }
            else{
                return "#620000";
            }
        }
    }

    public render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <ButtonBase
                    className="pointerOn"
                    onClick={() => {
                        this.props.onSelect(this.props.id);
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <Paper
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            margin: "10px",
                            backgroundColor: this.getBgColor()
                        }}
                        color={this.props.selected ? "primay" : "default"}>
                        <img draggable={false} alt={this.props.name} src={this.props.dead ? this.props.srcdead : this.props.src} className={classes.bigAvatar}/>
                        <Chip label={this.props.name} style={{margin: "5px"}}/>
                    </Paper>
                </ButtonBase>
            </React.Fragment>
        );
    }
}

class PlayerSelect extends React.Component<{ classes: any }, State> {
    state: State = {
        players: [],
        selected: -1,
    };

    componentWillMount() {
        this.setState((state) => {
            let newState = {...state};//copy
            newState.players.push({
                id: 0,
                name: "Player-1",
                src: "./assets/game/ui/player/player-1.png",
                srcdead: "./assets/game/ui/player/player-1-dead.png",
                dead: false,
            });
            newState.players.push({
                id: 1,
                name: "Player-2",
                src: "./assets/game/ui/player/player-2.png",
                srcdead: "./assets/game/ui/player/player-2-dead.png",
                dead: false,
            });
            newState.players.push({
                id: 2,
                name: "Player-3",
                src: "./assets/game/ui/player/player-3.png",
                srcdead: "./assets/game/ui/player/player-3-dead.png",
                dead: false,
            });
            return newState;
        });
        let removeListener = phaserReactService.onSceneReady<GameScene>(GAME_SCENE_KEY, (scene) => {
            scene.registerOnPlayerDead((player: number) => {
                this.setState((state) => {
                    let newState = {...state};//copy
                    newState.players[player].dead = true;
                    return newState;
                });
            });
            this.notifySelect(0);//initial player select
            removeListener();
        });

    }

    notifySelect(player: number) {
        if(this.state.selected!==player) {
            if (phaserReactService.getScene<GameScene>(GAME_SCENE_KEY)) {
                phaserReactService.getScene<GameScene>(GAME_SCENE_KEY).selectPlayer(player);
            }
            this.setState({
                selected: player
            });
        }
    }

    checkAtLeastOneSelected(state: State) {
        if (state.selected === -1) {
            state.players.forEach(value => {
                if (!value.dead && state.selected === 0) {
                    state.selected = value.id;
                    this.notifySelect(value.id);
                }
            })
        }
    }

    componentWillUnmount() {
    }

    public render() {
        const {classes} = this.props;
        return (<React.Fragment>
                <div style={{position: "absolute", right: 0, left: "auto", bottom: "auto", top: 0}}>
                    {
                        this.state.players.map((value, index) => {
                            return <Player
                                classes={classes}
                                key={"key" + index}
                                {...value}
                                selected={this.state.selected === value.id}
                                onSelect={(id) => {
                                    this.notifySelect(id);
                                }}
                            />
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PlayerSelect);
