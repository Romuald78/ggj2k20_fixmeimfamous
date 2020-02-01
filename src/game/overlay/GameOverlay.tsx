import * as React from 'react';
import WinLoseDialog from "./WinLoseDialog";
import {StartMenu} from "./StartMenu";

interface State {
    open: boolean,
}

class GameOverlay extends React.Component<{}, State> {
    state: State = {
        open: false,
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    public render() {
        return (
            <React.Fragment>
                <StartMenu />
                <WinLoseDialog />
            </React.Fragment>
        );
    }
}

export default GameOverlay;
