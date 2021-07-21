import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from '../layouts/Login/Login';
import Ubicacion from '../layouts/Ubicacion/Ubicacion';
import Unidad from '../layouts/Unidad/Unidad';
import createRole from '../layouts/Roles/Roles';
import Tramite from '../layouts/Tramite/Tramite';
import Requisito from '../layouts/Requisito/Requisito';
import Paso from '../layouts/Paso/Paso';
import Historial from '../layouts/Historial/Historial';
//import Home from '../layouts/Home/Home';
import PersistentDrawerLeft from '../components/Drawer/Drawer';

class Routes extends Component {
    render() {
        return (
            <PersistentDrawerLeft>
               
            </PersistentDrawerLeft>
           
        )
    }
}

export default Routes
