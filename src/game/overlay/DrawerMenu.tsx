import * as React from 'react';
import {Menu} from "@material-ui/icons";
import Drawer from "@material-ui/core/Drawer/Drawer";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Chip from "@material-ui/core/Chip/Chip";
import {Redirect} from 'react-router-dom';
import Fab from "@material-ui/core/Fab";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {phaserReactService} from "../phaser/PhaserReactService";
import {GameScene, GAME_SCENE_KEY} from "../main/scenes/GameScene";

interface State {
    open: boolean,
}

class DrawerMenu extends React.Component<{}, State> {
    state: State = {
        open: false,
    };

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    public render() {
        return (<React.Fragment>
                <Drawer open={this.state.open}
                        onClose={() => {
                            this.setState({open: false})
                        }}
                        style={{maxWidth: "50%", wordBreak: "break-all"}}
                >
                    <Typography component="h1">

                    </Typography>
                    <Chip
                        style={{margin: "20px"}}
                        label={"Croco Menu"}
                    />

                    <List component="nav">
                        <ListItem button>
                            <ListItemText onClick={()=> {
                                this.setState({open:false});
                                let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                                scene.restartLevel();
                            }} primary="Restart Level"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText onClick={()=>{window.history.back();}} primary="Back to main"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText onClick={()=>{
                                this.setState({open:false});
                                let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                                scene.displayWinScreen();
                            }} primary="[debug] win screen"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText onClick={()=>{
                                this.setState({open:false});
                                let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                                scene.displayLoseScreen();
                            }} primary="[debug] lose screen"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText onClick={()=>{
                                this.setState({open:false});
                                let scene = phaserReactService.getScene<GameScene>(GAME_SCENE_KEY);
                                scene.killplayer(2);
                            }} primary="[debug] kill player 3"/>
                        </ListItem>
                        {/*
                        <ListItem button>
                            <ListItemText onClick={()=>{window.close();window.history.back();}} primary="Quit Game"/>
                        </ListItem>
                        */}
                    </List>
                </Drawer>
                <div style={{position: 'relative'}}>
                    <Fab
                        className="pointerOn"
                        style={{
                            position: 'absolute',
                            top: "10px",
                            left: "10px",
                        }}
                        onClick={() => {
                            this.setState({open: true});
                        }}
                    ><Menu/></Fab>
                </div>
            </React.Fragment>
        );
    }
}

export default DrawerMenu;
