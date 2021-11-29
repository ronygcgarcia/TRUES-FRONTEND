import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
//import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
//import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';
import Alert from '@material-ui/lab/Alert';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '35ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: '100%',
    },
}));

//const ITEM_HEIGHT = 48;
//const ITEM_PADDING_TOP = 8;
/*const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};*/

const ubicaciones = [];

api.get('/ubicacion').then((response) => {
    response.data.forEach(function (element) {
        ubicaciones.push(element)
    })
})

const personales = [];

api.get('/personal').then((response) => {
    response.data.forEach(function (element) {
        personales.push(element)
    })
})


const FormRole = (props) => {
    const [paso, setPaso] = React.useState({ id: 0, nombre: '', indicaciones: '', complejidad: 0, ubicacion_id: 0, personal_id: 0 });
    const [requestError, setRequestError] = useState();
    const classes = useStyles();
    const [validacionNombre, setValidacionNombre] = useState({
    mensajeError: "",
    });
    const [validacionIndicacion, setValidacionIndicacion] = useState({
    mensajeError: "",
    });
    const [validacionComplejidad, setValidacionComplejidad] = useState({
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
            case "indicacion":
                setValidacionIndicacion({
                mensajeError: "",
                });
            break;
            case "complejidad":
                setValidacionComplejidad({
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
          case "indicacion":
            let ExpRegIndicacion = new RegExp(/^[A-zÀ-ú0-9.\s]{0,255}$/).test(
              value
            );

            if (!ExpRegIndicacion) {
              setValidacionIndicacion({
                mensajeError: "La indicacion tiene un limite de 255 caracteres",
              });
            }
            break;
          case "complejidad":
            if ((value < 0)||(value > 100)) {
              setValidacionComplejidad({
                mensajeError: "La indicacion tiene un limite de 255 caracteres",
              });
            }
            break;

          default:
            break;
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS", paso);
        paso.complejidad=paso.complejidad/100
        if (props.formType === 'new') {
            //console.log(paso)
            api.post("/pasos", paso).then((response) => {
                props.setRows(props.rows.concat(response.data));
                props.handleClose();
            }, (error) => {
                setRequestError(error.response.data.message+' '+error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else if (props.formType === 'edit') {
            //console.log(paso)
            api.put("/pasos/" + props.pasoId, paso).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = paso.nombre
                        row.indicaciones = paso.indicaciones
                        row.complejidad = paso.complejidad
                        row.ubicacion_id = paso.ubicacion_id
                        row.personal_id = paso.personal_id
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                //console.log(props.rows)
                props.handleClose();
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message+' '+error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else {
            api.delete("/pasos/" + props.pasoId).then((response) => {
                //console.log(response)
                api.get('/pasos').then((response) => {
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
        //console.log("ESTADO ANTES DE ENVIAR", { ...paso });
    }


    useEffect(() => {
        if (props.pasoId && props.pasoId !== 0) {
            api.get('/pasos/' + props.pasoId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setPaso({
                    id: props.pasoId, nombre: response.data.nombre, indicaciones: response.data.indicaciones, complejidad: response.data.complejidad*100,
                    ubicacion_id: response.data.ubicacion_id.id, personal_id: response.data.personal_id.id
                });
            })
        }
    }, [props.pasoId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                name="nombre"
                required
                id="outlined-required"
                label="Nombre paso"
                value={paso.nombre}
                variant="outlined"
                onChange={(e) => {setPaso({ ...paso, nombre: e.target.value })
                validacionCampos(e)}}
                error={Boolean(validacionNombre?.mensajeError)}
                helperText={validacionNombre?.mensajeError}
            />
            <TextField
                name="indicacion"
                required
                id="outlined-required"
                label="Indicacion"
                value={paso.indicaciones}
                variant="outlined"
                onChange={(e) => (setPaso({ ...paso, indicaciones: e.target.value },
                validacionCampos(e)))}
                error={Boolean(validacionIndicacion?.mensajeError)}
                helperText={validacionIndicacion?.mensajeError}
            />
            <TextField
				name="complejidad"
                required
                type={'number'}
                inputProps={{  
                    min: "0",
                    max: "100",
                    step:"5",               
                  }}
                id="outlined-required"
                label="complejidad %"
                value={paso.complejidad}
                variant="outlined"
                onChange={(e) => (setPaso({ ...paso, complejidad: e.target.value },
				validacionCampos(e)))}
				error={Boolean(validacionComplejidad?.mensajeError)}
                helperText={validacionComplejidad?.mensajeError}
            />
            <FormControl className={classes.formControl} >
                <InputLabel id="demo-mutiple-checkbox-label">Ubicacion</InputLabel>
                <Select
                    className={classes.selectEmpty}
                    value={paso.ubicacion_id}
                    name="ubicacion_id"
                    onChange={(event) => setPaso({ ...paso, ubicacion_id: event.target.value })}
                    inputProps={{ 'aria-label': 'ubicacion' }}
                    required={true}
                >
                    {ubicaciones.map((element) => (
                        <MenuItem key={element.id} value={element.id}>
                            <ListItemText primary={element.nombre} />
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Seleccione la ubicacion del paso</FormHelperText>
            </FormControl>

            <FormControl className={classes.formControl} >

                <InputLabel id="demo-mutiple-checkbox-label">Personal</InputLabel>
                <Select
                    className={classes.selectEmpty}
                    value={paso.personal_id}
                    name="personal_id"
                    onChange={(event) => setPaso({ ...paso, personal_id: event.target.value })}
                    inputProps={{ 'aria-label': 'personal' }}
                    required={true}
                >
                    <MenuItem>
                        <ListItemText primary={'Seleccione el personal'} />
                    </MenuItem>
                    {personales.map((element) => (
                        <MenuItem key={element.id} value={element.id} selected={element.ubicacion_id === paso.ubicacion_id ? true : false}>
                            <ListItemText primary={element.nombre} />
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Seleccion el personal encargado</FormHelperText>
            </FormControl>
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este paso?</p> : props.formType==='new' ? createOrEdit() : paso.id ? createOrEdit() : <CircularProgress/>}
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
