import * as React from 'react'
import {phaserReactService} from "../../game/phaser/PhaserReactService";
import GameCanvaOverlay from "../../game/GameCanvaOverlay";

export default class HomePage extends React.Component<{}, {}> {
    state = {};

    componentWillMount() {
        phaserReactService.parameters = {}
    }

    render() {
        return (<div className="fullSpace"><GameCanvaOverlay/></div>)
    }
}