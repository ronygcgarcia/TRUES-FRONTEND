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
    const [requisito, setRequisito] = React.useState({ id: 0, nombre: '', descripcion:'' });
    const [requestError, setRequestError] = useState();
    const classes = useStyles();
    const [validacionNombre, setValidacionNombre] = useState({
    mensajeError: "",
    });
    const [validacionDescripcion, setValidacionDescripcion] = useState({
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
            default:
              break;
        }

        switch (name) {
            case "nombre":
              let ExpRegName = new RegExp(/^[A-zÀ-ú0-9.\s]{5,100}$/).test(value);
              
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
      
            default:
              break;
          }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",requisito);        
        if (props.formType === 'new') {
            console.log(requisito)
            api.post("/requisito", requisito).then((response) => {
                props.setRows(props.rows.concat(response.data));
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message+' '+error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else if (props.formType === 'edit') {
            //console.log(requisito)
            api.put("/requisito/" + props.unidadId, requisito).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = requisito.nombre
                        row.descripcion=requisito.descripcion
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message+' '+error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else {
            api.delete("/requisito/" + props.unidadId).then((response) => {
                //console.log(response)
                api.get('/requisito').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message+' '+error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        }        
    }

    useEffect(() => {
        if (props.unidadId && props.unidadId !== 0) {
            api.get('/requisito/' + props.unidadId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setRequisito({
                    id: props.unidadId, nombre: response.data.nombre, descripcion:response.data.descripcion
                });
            })
        }
    }, [props.unidadId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                name="nombre"
                required
                id="outlined-required"
                placeholder="Nombre requisito*"
                value={requisito.nombre}
                variant="outlined"
                onChange={(e) =>{setRequisito({ ...requisito, nombre: e.target.value })
                validacionCampos(e)}}
                error={Boolean(validacionNombre?.mensajeError)}
                helperText={validacionNombre?.mensajeError}
            />
            <TextField
                name="descripcion"
                required
                id="outlined-required"
                placeholder="Descripcion*"
                value={requisito.descripcion}
                variant="outlined"
                onChange={(e) => (setRequisito({ ...requisito, descripcion: e.target.value },
                validacionCampos(e)))}
                error={Boolean(validacionDescripcion?.mensajeError)}
                helperText={validacionDescripcion?.mensajeError}
            />
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este requisito?</p> : createOrEdit()}
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
