import * as React from 'react';

interface State {
    open: boolean,
}

class TargetPreview extends React.Component<{}, State> {
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
                <div></div>
            </React.Fragment>
        );
    }
}

export default TargetPreview;
