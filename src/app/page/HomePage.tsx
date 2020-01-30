import * as React from 'react'

export default class HomePage extends React.Component<{}, {}> {
    state = {};

    render() {
        return (
            window.location.href = (window.location.pathname + "/game").replace("//", "/")
        )
    }
}