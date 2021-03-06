import * as React from "react";

export class ImageFit extends React.Component<{ src: string }, {}> {

    public render() {
        return (
            <div style={{
                minWidth: "100%",
                minHeight: "100%",
                backgroundImage: `url(${this.props.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%",
            }} />
        );
    }
}