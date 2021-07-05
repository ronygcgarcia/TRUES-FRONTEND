import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
        },
    },
    formContunidad: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

const FormRole = (props) => {
    const [tramite, setTramite] = React.useState({ id: 0, nombre: '' });
    const [requestError, setRequestError] = useState();
    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",tramite);        
        if (props.formType === 'new') {
            console.log(tramite)
            api.post("/tramite", tramite).then((response) => {
                props.setRows(props.rows.concat(response.data));
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message)
            })
        } else if (props.formType === 'edit') {
            //console.log(tramite)
            api.put("/tramite/" + props.unidadId, tramite).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = tramite.nombre
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
            api.delete("/tramite/" + props.unidadId).then((response) => {
                //console.log(response)
                api.get('/tramite').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                    props.handleClose();
                })
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message)
            })
        }
    }

    useEffect(() => {
        if (props.unidadId && props.unidadId !== 0) {
            api.get('/tramite/' + props.unidadId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setTramite({
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
                placeholder="Nombre tramite*"
                value={tramite.nombre}
                variant="outlined"
                onChange={(e) => setTramite({ ...tramite, nombre: e.target.value })}
            />
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}                
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este tramite?</p> : createOrEdit()}
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
