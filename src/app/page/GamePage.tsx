import {Component} from 'react'
import * as React from 'react'
import {phaserReactService} from "../../game/phaser/PhaserReactService";
import GameCanvaOverlay from "../../game/GameCanvaOverlay";

export default class GamePage extends Component<{
    match: any,
    history: any
}, {}> {

    componentWillMount() {
        //const match = this.props.match; // coming from React Router.
        /*{isExact:true
        params:{memeid: "toto"}
        path:"/meme/:memeid"
        url:"/meme/toto"}*/
        //let player = match.params.toFollow;
        //player = decodeURIComponent(player);
        phaserReactService.parameters = {}
    }

    render() {
        return (<div className="fullSpace"><GameCanvaOverlay/></div>)
    }
}
