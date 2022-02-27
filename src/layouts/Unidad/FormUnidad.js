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
    const [unidad, setUnidad] = React.useState({ id: 0, nombre: '' });
    const [requestError, setRequestError] = useState();
    const classes = useStyles();
    const [validacionNombre, setValidacionNombre] = useState({
        mensajeError: "",
      });
    const validarNombre = (nombre) => {
        setValidacionNombre({
            mensajeError:
          "",
        });
        let regName = new RegExp(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9-\s]{3,100}$/).test(nombre);
        if (!regName) {
            setValidacionNombre({
                mensajeError:
              "El nombre debe ser de un minimo de 3 caracteres y un maximo de 100 caracteres ",
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
           
        if (props.formType === 'new') {
            
            api.post("/unidad", unidad).then((response) => {
                props.setRows(props.rows.concat(response.data));
                props.handleClose();
            }, (error) => {
                
                setRequestError(error.response.data.message)
            })
        } else if (props.formType === 'edit') {
            
            api.put("/unidad/" + props.unidadId, unidad).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = unidad.nombre
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                props.handleClose();
            }, (error) => {
              
                setRequestError(error.response.data.message)
            })
        } else {
            api.delete("/unidad/" + props.unidadId).then((response) => {
                
                api.get('/unidad').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
                props.handleClose();
            }, (error) => {
                
                setRequestError(error.response.data.message)
            })
        }        
    }

    useEffect(() => {
        if (props.unidadId && props.unidadId !== 0) {
            api.get('/unidad/' + props.unidadId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
               
                setUnidad({
                    id: props.unidadId, nombre: response.data.nombre
                });
            })
        }
    }, [props.unidadId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                required
                id="outlined-required"
                placeholder="Nombre unidad*"
                value={unidad.nombre}
                variant="outlined"
                onChange={(e) => {setUnidad({ 
                    ...unidad, 
                    nombre: e.target.value 
                })
                validarNombre(e.target.value )}}
                error={Boolean(validacionNombre?.mensajeError)}
                    helperText={validacionNombre?.mensajeError}
            />
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este unidad?</p> : props.formType==='new' ? createOrEdit() : unidad.id ? createOrEdit() : <CircularProgress/>}
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
