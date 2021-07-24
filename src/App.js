import './App.css';
import React, {useState} from 'react';
import PersistentDrawerLeft from './components/Drawer/Drawer';
import Login from './layouts/Login/Login';

function App() {
  const [conectado, setconectado] = useState(false);   
  const acceder=(estado)=>{
    setconectado(estado);
    console.log(estado)
  }
  return (
    conectado ? <PersistentDrawerLeft/> : <Login acceder={acceder}/>
  );
}

export default App;
