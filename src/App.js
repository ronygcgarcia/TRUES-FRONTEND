import './App.css';
import api from './config/axios';
import React, {useState, useEffect} from 'react';
import PersistentDrawerLeft from './components/Drawer/Drawer';
import Login from './layouts/Login/Login';
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {
  const [usuario, setUsuario] = useState([]);
  
  const [conectado, setconectado] = useState(false);   
  const acceder=(estado)=>{
    setconectado(estado);
    console.log(estado);
  }

  useEffect(() => {
    async function loadUser(){
     if(localStorage.getItem('token')){
       const usuarioAPI =  api.get("/user").then((response) => {
         setUsuario(response.data);
         setconectado(true);
       });
     }
    }
    loadUser();
    console.log(conectado);
    console.log(usuario);
 }, [])
  return (
    !conectado ? <Login acceder={acceder}/> : <PersistentDrawerLeft acceder={acceder}/>
  );
}

export default App;
