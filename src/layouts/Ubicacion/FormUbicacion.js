import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: '100%',
    },
}));

const FormRole = (props) => {
    const [ubicacion, setUbicacion] = React.useState({ id: 0, name: '', permissions: [] });
    const [requestError, setRequestError] = useState();
    const classes = useStyles();
    const [validacionNombre, setValidacionNombre] = useState({
        mensajeError: "",
    });
    const [validacionDescripcion, setValidacionDescripcion] = useState({
        mensajeError: "",
    });
    const [validacionLongitud, setValidacionLongitud] = useState({
        mensajeError: "",
    });
    const [validacionLatitud, setValidacionLatitud] = useState({
        mensajeError: "",
    });

    const validacionCampos = (e) => {
        const { name, value } = e.target;
        console.log(e.target);
        switch (name) {
            case "nombre":
                setValidacionNombre({
                    mensajeError: "",
                });
                break;
            case "descripcion":
                setValidacionDescripcion({
                    mensajeError: "",
                });
                break;
            case "longitud":
                setValidacionLongitud({
                    mensajeError: "",
                });
                break;
            case "latitud":
                setValidacionLatitud({
                    mensajeError: "",
                });
                break;
            default:
                break;
        }

        switch (name) {
            case "nombre":
                let ExpRegName = new RegExp(/^[a-zA-Z0-9-\s]{3,100}$/).test(value);

                if (!ExpRegName) {
                    setValidacionNombre({
                        mensajeError:
                            "El nombre debe ser de un minimo de 5 caracteres y un maximo de 1000 caracteres",
                    });
                }
                break;
            case "descripcion":
                let ExpRegDescripcion = new RegExp(/^[A-zÀ-ú0-9.\s]{0,255}$/).test(value);

                if (!ExpRegDescripcion) {
                    setValidacionDescripcion({
                        mensajeError:
                            "La descripcion tiene un limite de 255 caracteres",
                    });
                }
                break;
            case "longitud":
                let ExpRegLongitud = new RegExp(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/).test(value);
                if (!ExpRegLongitud) {
                    setValidacionLongitud({
                        mensajeError: "La coordenada de longitud no es correcta",
                    });
                }
                break;
            case "latitud":
                let ExpRegLatitud = new RegExp(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/).test(value);

                if (!ExpRegLatitud) {
                    setValidacionLatitud({
                        mensajeError:
                            "La coordenada de latitud no es correcta",
                    });
                }
                break;

            default:
                break;
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",ubicacion);        
        if (props.formType === 'new') {
            //console.log(ubicacion)
            api.post("/ubicacion", ubicacion).then((response) => {
                props.setRows(props.rows.concat(response.data));
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message)
            })
        } else if (props.formType === 'edit') {
            //console.log(ubicacion)
            api.put("/ubicacion/" + props.ubicacionId, ubicacion).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = ubicacion.nombre
                        row.descripcion = ubicacion.descripcion
                        row.longitud = ubicacion.longitud
                        row.latitud = ubicacion.latitud
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message)
            })
        } else {
            api.delete("/ubicacion/" + props.ubicacionId).then((response) => {
                //console.log(response)
                api.get('/ubicacion').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message)
                props.handleClose();
            })
        }
        //console.log("ESTADO ANTES DE ENVIAR",{...ubicacion,permissions:permisos});        
    }

    useEffect(() => {
        if (props.ubicacionId && props.ubicacionId !== 0) {
            api.get('/ubicacion/' + props.ubicacionId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setUbicacion({
                    id: props.ubicacionId, nombre: response.data.nombre, descripcion: response.data.descripcion, longitud: response.data.longitud, latitud: response.data.latitud
                });
            })
        }
    }, [props.ubicacionId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                name="nombre"
                required
                id="outlined-required"
                placeholder="Nombre ubicacion*"
                value={ubicacion.nombre}
                variant="outlined"
                onChange={(e) => {
                    setUbicacion({ ...ubicacion, nombre: e.target.value })
                    validacionCampos(e)
                }}
                error={Boolean(validacionNombre?.mensajeError)}
                helperText={validacionNombre?.mensajeError}
            />
            <TextField
                name="descripcion"
                required
                id="outlined-required"
                placeholder="Descripcion*"
                value={ubicacion.descripcion}
                variant="outlined"
                onChange={(e) => {
                    setUbicacion({ ...ubicacion, descripcion: e.target.value })
                    validacionCampos(e)
                }}
                error={Boolean(validacionDescripcion?.mensajeError)}
                helperText={validacionDescripcion?.mensajeError}
            />
            <TextField
                name="longitud"
                required
                id="outlined-required"
                placeholder="Longitud*"
                value={ubicacion.longitud}
                variant="outlined"
                onChange={(e) => {
                    setUbicacion({ ...ubicacion, longitud: e.target.value })
                    validacionCampos(e)
                }}
                error={Boolean(validacionLongitud?.mensajeError)}
                helperText={validacionLongitud?.mensajeError}
            />
            <TextField
                name="latitud"
                required
                id="outlined-required"
                placeholder="Latitud*"
                value={ubicacion.latitud}
                variant="outlined"
                onChange={(e) => {
                    setUbicacion({ ...ubicacion, latitud: e.target.value })
                    validacionCampos(e)
                }}
                error={Boolean(validacionLatitud?.mensajeError)}
                helperText={validacionLatitud?.mensajeError}
            />
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este ubicacion?</p> : props.formType==='new' ? createOrEdit() : ubicacion.id ? createOrEdit() : <CircularProgress/>}
                <FormControl style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button variant="contained" color="secondary" onClick={props.handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '1rem', marginRight: '1rem' }}>
                        {props.formType === 'new' ? 'Crear' : props.formType === 'edit' ? 'Editar' : 'Eliminar'}
                    </Button>
                </FormControl>
            </form>
        </div>
    )
}

export default FormRole
