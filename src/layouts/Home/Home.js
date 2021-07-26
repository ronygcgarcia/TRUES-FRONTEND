import React from 'react';


const Home = ({usuario}) => {
    console.log(usuario);
    return (
        <div>  
            {usuario.permissions.find(permiso => permiso.name==='ver personal') ? <p>Encontrado</p> : <p>No encontrado</p>}
           
        </div>
    )
}

export default Home;