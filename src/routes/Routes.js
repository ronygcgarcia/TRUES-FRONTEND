import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from '../layouts/Login/Login';
import Ubicacion from '../layouts/Ubicacion/Ubicacion';
import Unidad from '../layouts/Unidad/Unidad';
import createRole from '../layouts/Roles/Roles';
import Tramite from '../layouts/Tramite/Tramite';
import Requisito from '../layouts/Requisito/Requisito';
import Paso from '../layouts/Paso/Paso';
//import Home from '../layouts/Home/Home';
import Drawer from '../components/Drawer/Drawer';
import Users from '../layouts/Users/Users';
import Personal from '../layouts/Personal/Personal';
import Documento from '../layouts/Documento/Documento';
import Requisito from '../layouts/Requisitos/Requisito';

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
                        <Route path='/requisito' exact component={Requisito} />
                        <Route path='/paso' exact component={Paso} />
                        <Route path='/users' exact component={Users} />
                        <Route path='/personal' exact component={Personal} />
                        <Route path='/documentos' exact component={Documento} />
                        <Route path='/requisitos' exact component={Requisito} />
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
