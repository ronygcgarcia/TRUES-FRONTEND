import "./App.css";
import React, { useEffect } from "react";
import PersistentDrawerLeft from "./components/Drawer/Drawer";
import Login from "./layouts/Login/Login";
import { BrowserRouter, Switch } from "react-router-dom";
import PrivateRoute from "./config/PrivateRoute";
import PublicRoute from "./config/PublicRoute";

function App() {

  useEffect(() => {
    
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
            <Switch>
              <PublicRoute path="/" exact component={Login} />
              <PrivateRoute path="/" component={PersistentDrawerLeft} />
            </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
