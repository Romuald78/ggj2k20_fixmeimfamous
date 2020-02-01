import * as React from 'react';
import './App.css';
import {BrowserRouter, Switch} from 'react-router-dom'
import {Route} from 'react-router-dom'

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import HomePage from "./page/HomePage";

class App extends React.Component<{},{}> {
    render() {
        const theme = createMuiTheme({
            typography: {
                useNextVariants: true,
            },
            palette: {
                type: 'dark',
                //https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=212121&secondary.color=FF3D00
            },
        });
        return (
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <div>
                        <Switch>
                            <Route exact path='/' component={HomePage}/>
                        </Switch>
                    </div>
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }
}

export default App;
