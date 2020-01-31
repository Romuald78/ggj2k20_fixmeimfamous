import * as React from 'react';
import DrawerMenu from "./DrawerMenu";
import WinLoseDialog from "./WinLoseDialog";
import PlayerSelect from "./PlayerSelect";

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
                <WinLoseDialog/>
            </React.Fragment>
        );
    }
}

export default GameOverlay;
