import * as React from 'react';
import {phaserReactService} from "../phaser/PhaserReactService";
import {MENU_SCENE_KEY, MenuScene} from "../main/scenes/MenuScene";
import {Button, Chip, Paper} from "@material-ui/core";

interface Player {
    team: string,
    src: string,
    name: string
}

interface PlayerProps extends Player {
    classes: any,
    key: string,
}

export class PlayerComponent extends React.Component<PlayerProps, {}> {

    private getBgColor() {
        if (this.props.team === "blue") {
            return "#0000C2";
        } else {
            return "#C20000";
        }
    }

    public render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Paper
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        margin: "10px",
                        backgroundColor: this.getBgColor()
                    }}
                    color={"primary"}>
                    <img style={{
                        width:"100%",
                        height: "auto"}} draggable={false} alt={this.props.name} src={this.props.src}
                         className={classes.bigAvatar}/>
                    <Chip label={this.props.name} style={{margin: "5px"}}/>
                </Paper>
            </React.Fragment>
        );
    }
}

interface State {
    open: boolean,
    players: { [id: string]: Player }

}

export class StartMenu extends React.Component<{}, State> {
    state: State = {
        open: false,
        players: {},
    };

    registered = new Set();

    componentDidMount() {
        let removeListener = phaserReactService.onSceneReady<MenuScene>(MENU_SCENE_KEY, (scene) => {
            this.setState({open: true});
            window.addEventListener("gamepadconnected", (e: any) => {
                this.registerGamepad(e.gamepad.index, scene.inputComponent);
            });
            let pads = navigator.getGamepads();
            if (pads) {
                for (let p = 0; p < pads.length; p++) {
                    if (pads[p] !== null) {
                        this.registerGamepad(pads[p].index, scene.inputComponent);
                    }
                }
            }
            scene.inputComponent.register("pressA", {device_num: 0, input_ref: " ", threshold: 0, type: "key"});
            scene.inputComponent.registerEvent("pressA", (actionName, buttonState) => {
                if (!buttonState)
                    if (!this.addPlayer("Keyboard")) {
                        this.switchPlayer("Keyboard");
                    }
            });
        });


    }

    registerGamepad(id: number, input) {
        if (!this.registered.has(id)) {
            this.registered.add(id);
            input.register("pressA-" + id, {device_num: id, input_ref: "A", threshold: 0, type: "button"});
            input.registerEvent("pressA-" + id, (actionName, buttonState) => {
                if (!buttonState)
                    if (!this.addPlayer("Gamepad-" + id)) {
                        this.switchPlayer("Gamepad-" + id);
                    }
            });

            input.register("start-" + id, {device_num: id, input_ref: "START", threshold: 0, type: "button"});
            input.registerEvent("start-" + id, (actionName, buttonState) => {
                if (!buttonState)
                    this.validate();
            });
        }
    }

    componentWillUnmount() {

    }

    switchPlayer(name: string) {
        this.setState((state) => {
            let newState = {...state};
            if (newState.players[name].team == "blue") {
                newState.players[name].team = "red";
                newState.players[name].src = "./assets/main_atlas/player_front/player_front_0.png";
            } else {
                newState.players[name].team = "blue";
                newState.players[name].src = "./assets/main_atlas/player_front/player_front_blue_0.png";
            }
            return newState;
        })
    }

    addPlayer(name: string) {
        if (!this.state.players[name]) {
            this.setState((state) => {
                let newState = {...state};
                let player: Player = {
                    name: name,
                    team: Object.keys(newState.players).length % 2 === 0 ? "blue" : "red",
                    src: Object.keys(newState.players).length % 2 === 0 ? "./assets/main_atlas/player_front/player_front_blue_0.png" : "./assets/main_atlas/player_front/player_front_0.png",
                };
                newState.players[name] = player;
                return newState;
            });
            return true;
        } else {
            return false;
        }
    }

    validate() {
        if (this.allowValidate()) {
            this.setState({open: false});
            let scene = phaserReactService.getScene<MenuScene>(MENU_SCENE_KEY);
            scene.goNext({playersStartData: this.state.players});
        }
    }

    public render() {
        return (<React.Fragment>
                {this.state.open &&
                <div className="pointerOn" style={{

                    /* The image used */
                    backgroundImage: "url(/assets/map/map.png)",

                    /* Center and scale the image nicely */
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",

                    backgroundColor: "#42FF32FF",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'space-around',
                }}>
                    <div style={{flexBasis: "10%",
                        display: 'flex',justifyContent:"center",}}>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}>
                            <img style={{
                                width:"100%",
                                height: "auto"}} draggable={false} alt={"f"} src={"./assets/main_atlas/misc/title.png"}/>
                        </div>
                    </div>

                    <div style={{flexBasis: "80%",display: 'flex',justifyContent:"space-around",width:"100%"}}>
                        <Paper style={{backgroundColor: "#0000F28F", margin: "20px"}}>
                            <div style={{
                                display: "flex",
                                alignItems:"center",
                                height:"100%",
                                justifyContent: "center",
                                flexDirection: "row",
                            }}>
                                {Object.keys(this.state.players).map(key => {
                                        let player = this.state.players[key];
                                        return player.team !== "blue" ?
                                            <div key={key} style={{width: "0", height: "0"}}></div> :
                                            <PlayerComponent classes={{}} key={key} {...player} />
                                    }
                                )}
                                {Object.keys(this.state.players).length===0 &&
                                <Button disabled={this.diallowValidate()} style={{margin: "20px"}} variant="contained"
                                        color="primary" >
                                    Press any key to start!
                                </Button>
                                }
                            </div>
                        </Paper>
                        <Paper style={{backgroundColor: "#F200008F", margin: "20px"}}>
                            <div style={{
                                display: "flex",
                                height:"100%",
                                justifyContent: "center",
                                alignItems:"center",
                                flexDirection: "row",
                            }}>
                                {Object.keys(this.state.players).map(key => {
                                        let player = this.state.players[key];
                                        return player.team !== "red" ?
                                            <div key={key} style={{width: "0", height: "0"}}></div> :
                                            <PlayerComponent classes={{}} key={key} {...player} />
                                    }
                                )}
                                {Object.keys(this.state.players).length===0 &&
                                <Button disabled={this.diallowValidate()} style={{margin: "20px"}} variant="contained"
                                        color="primary" >
                                    Press any key to start!
                                </Button>
                                }
                            </div>
                        </Paper>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}>
                        <img style={{
                            width:"100%",
                            height: "auto"}} draggable={false} alt={"f"} src={"./assets/main_atlas/misc/controller.png"}/>
                        </div>
                    </div>

                    <div style={{flexBasis: "10%",display: 'flex',justifyContent:"center"}}>
                        <Button disabled={this.diallowValidate()} style={{margin: "20px"}} variant="contained"
                                color="primary" onClick={() => {
                            this.validate()
                        }}>
                            Start!
                        </Button>
                    </div>
                </div>
                }
            </React.Fragment>
        );
    }

    allowValidate(): boolean {
        return Object.keys(this.state.players).length > 0;
    }

    diallowValidate(): boolean {
        return !this.allowValidate();
        ;
    }
}
