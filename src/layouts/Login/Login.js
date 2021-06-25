import React, { useState } from 'react';
import logo from "../../assets/ues_logo3.svg";
import './login.css';
import api from '../../config/axios';
const Login = (props) => {

    const [user, setUser] = useState({
        username: '',
        password: ''
    })


    const { username, password } = user;


    const login = async datos => {
        try {

            const credenciales = {
                username: datos.username[0],
                password: datos.password[0]
            }
            api.post('/login', credenciales)
                .then(response => {
                    localStorage.setItem('token', response.data.jwt)
                    api.get('/user').then(response=>{
                        console.log(response)
                    })                    
                })
                .catch(error => {
                    console.log(error)
                });

        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: [e.target.value]
        })
    }

    //inicio de sesion
    const onSubmit = e => {
        e.preventDefault();

        //validar que no hayan campos vacios 

        //pasarlo al action 
        login({ username, password });
    }

    return (
        <div className='container__login'>
            <div className="container__logo">
                <img src={logo} alt="Universidad de El Salvador" />
                <div className="logo__text">
                    <strong>Universidad de El Salvador</strong>
                    <p>Sistema de Tramites Universidad de El Salvador</p>
                    <p>TRUES</p>
                </div>
            </div>
            <div className="login__card">
                <div className="container card bg-white rounded-lg mr-28 ml-28">
                    <div className="card-header h-12 bg-red-700 rounded-t-lg flex items-center justify-center font-bold text-xl">
                        <label className="block text-white" htmlFor="username">
                            Iniciar sesion
                        </label>
                    </div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <div className="mb-4 mt-4 mr-16 ml-16 row">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-base" htmlFor="username">
                                    Usuario
                                </label>
                                <input onChange={handleChange} id="username" name="username" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Usuario" />
                            </div>
                            <div className="mb-4 mt-4 mr-16 ml-16 row">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-base" htmlFor="password">
                                    Contraseña
                                </label>
                                <input onChange={handleChange} id="password" name="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Contraseña" />
                            </div>
                            <div className="mb-4 mt-4 mr-4 ml-4 row">
                                <button type="submit" className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 mr-4 px-4 rounded">
                                    Iniciar sesion
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;
