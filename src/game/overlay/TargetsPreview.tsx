import * as React from 'react';
import {ModuleGrid} from "../main/ggj2020/ModuleGrid";
import {phaserReactService} from "../phaser/PhaserReactService";
import {GAME_SCENE_KEY, GameScene} from "../main/scenes/GameScene";
import TargetPreview from './TargetPreview';

interface State {
    open: boolean,
    modules: ModuleGrid[],
}

class TargetsPreview extends React.Component<{}, State> {
    state: State = {
        open: false,
        modules: null,
    };

    componentDidMount() {
        let removeListener = phaserReactService.onSceneReady<GameScene>(GAME_SCENE_KEY, (scene) => {
            let modules = [];
            scene.recipeFactory.recipes.forEach(value => {
                let module = value.getFirstComponentByName<ModuleGrid>(ModuleGrid.name);
                modules.push(module);
            });
            this.setState({modules:modules})
        });
    }

    componentWillUnmount() {
    }

    public render() {
        return (
            <React.Fragment>
                <div style={{display:"flex",position:"absolute",bottom:"0",right:"0"}}>
                {this.state.modules && this.state.modules.map((module,index) => {
                    return <TargetPreview key={""+index} modulegrid={module}
                                          team={index===0?"blue":"red"}
                                          color={index===0?"#0000FF60":"#FF000060"}/>
                })}
                </div>
            </React.Fragment>
        );
    }
}

export default TargetsPreview;
