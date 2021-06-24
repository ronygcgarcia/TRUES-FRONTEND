import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//import Login from '../layouts/Login/Login';
//import Home from '../layouts/Home/Home';
import Drawer from '../components/Drawer/Drawer';

class Routes extends Component {
    render() {
        return (
            <Drawer>
                <Router>
                    <Switch>
                        <Route path='/' exact component={()=>{
                            return <p></p>
                        }} />
                    </Switch>
                </Router>
            </Drawer>
        )
    }
}

export default Routes
