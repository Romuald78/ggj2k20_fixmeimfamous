import * as React from 'react';
import './Game.css';
import {phaserReactService} from "./phaser/PhaserReactService";
import {CSSProperties} from "react";
import { Redirect } from 'react-router-dom';
import ResizeDetector from 'react-resize-detector';
import GameOverlay from "./overlay/GameOverlay";
import GameCanvas from "./GameCanvas";

interface State {
    redirectTo: string;
    overlayStyle: CSSProperties;
    visible:boolean,
}

class GameCanvaOverlay extends React.Component<{}, State> {
    state: State = {
        redirectTo:"",
        visible:false,
        overlayStyle: {
            position: "absolute",
            left: "0",
            top: "0",
            width: "150px",
            height: "150px"
        }
    };

    componentDidMount() {
        phaserReactService.eventEmitter.on("redirect",url => {
            this.setState({redirectTo:url});
        });
        phaserReactService.eventEmitter.on("displayOverlay",visible => {
            this.setState({visible:visible});
        });
    }

    componentWillUnmount() {
        phaserReactService.destroy();
    }

    renderRedirect = () => {
        if (this.state.redirectTo!=="") {
            return <Redirect to={this.state.redirectTo} />
        }
        return <div></div>;
    };

    onResize = (width,height) => {
        //console.log(width+"/"+height)
        //resize overlay
        this.setState({
            overlayStyle: {
                position: this.state.overlayStyle.position,
                left: this.state.overlayStyle.left,
                top: this.state.overlayStyle.top,
                width: width+"px",
                height: height + "px"
            }
        });
        this.setState({overlayStyle:this.state.overlayStyle})
        //resize game
        phaserReactService.resize(width,height);
    };

    public render() {
        return (<ResizeDetector
                handleWidth
                handleHeight
                onResize = {this.onResize}
                render={({ width, height }) => (
                    <div className="fullSpace">
                        {this.renderRedirect()}
                        <GameCanvas />
                        {this.state.visible &&
                            <div id="caneva-overlay" className="pointerOff" style={this.state.overlayStyle}>
                                <GameOverlay/>
                            </div>
                        }
                    </div>
                )}
            />
        );
    }
}

export default GameCanvaOverlay;
