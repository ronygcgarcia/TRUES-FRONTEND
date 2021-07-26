import "./App.css";
import api from "./config/axios";
import React, { useState, useEffect } from "react";
import PersistentDrawerLeft from "./components/Drawer/Drawer";
import Login from "./layouts/Login/Login";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  const [usuario, setUsuario] = useState([]);
  const [obteniendo, setobteniendo] = useState(true);

  const [conectado, setconectado] = useState(false);
  const acceder = (estado) => {
    setconectado(estado);
    console.log(estado);
    setUsuario(estado);
  };

  useEffect(() => {
    async function loadUser() {
      if (!localStorage.getItem("token")) {
        setobteniendo(false);
        return;
      }
      try {
        const { data: usuarioAPI } = await api.get("/user");
        setUsuario(usuarioAPI);
        setconectado(true);
        console.log(usuario)
        setobteniendo(false);
      } catch (error) {
        console.log(error);
      }
    }
    loadUser();
  }, []);
  return !conectado ? (
    <Login acceder={acceder} />
  ) : obteniendo ? (
    <CircularProgress />
  ) : (
    <PersistentDrawerLeft acceder={acceder} usuario={JSON.stringify(usuario)} />
  );
}

export default App;
