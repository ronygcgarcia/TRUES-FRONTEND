import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from '../layouts/Login/Login';
import Ubicacion from '../layouts/Ubicacion/Ubicacion';
import Unidad from '../layouts/Unidad/Unidad';
import createRole from '../layouts/Roles/Roles'
import Tramite from '../layouts/Tramite/Tramite'
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
                        <Route path='/roles' exact component={createRole} />
                        <Route path='/login' exact component={Login} />
                        <Route path='/ubicacion' exact component={Ubicacion} />
                        <Route path='/unidad' exact component={Unidad} />
                        <Route path='/tramite' exact component={Tramite} />
                    </Switch>
                </Router>
            </Drawer>
            /*<Router>
                <Switch>
                    <Route path='/' exact component={Login} />
                </Switch>
            </Router>*/
        )
    }
}

export default Routes
