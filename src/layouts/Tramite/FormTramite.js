import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';
import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
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
    formulario:{
        width: '100%%',
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const documentos = [];

api.get('/documento').then((response) => {
    response.data.forEach(function (element) {
        documentos.push(element)
    })
})

const requisitos = [];

api.get('/requisito').then((response) => {
    response.data.forEach(function (element) {
        requisitos.push(element)
    })
})

const pasos = [];

api.get('/pasos').then((response) => {
    response.data.forEach(function (element) {
        pasos.push(element)
    })
})

const FormRole = (props) => {
    const [tramite, setTramite] = React.useState({ id: 0, nombre: '', documento_id: [], requisito_id: [], paso_id: [] });
    const [requestError, setRequestError] = useState();
    //const [documento, setDocumento] = useState([]);
    //const [requisito, setRequisito] = useState([]);
    //const [paso, setPaso] = useState([]);
    const classes = useStyles();
    const [validacionNombre, setValidacionNombre] = useState({
        mensajeError: "",
    });
    const validarNombre = (nombre) => {
        setValidacionNombre({
            mensajeError:
                "",
        });
        let regName = new RegExp(/^[A-zÀ-ú0-9.\s]{5,50}$/).test(nombre);
        if (!regName) {
            setValidacionNombre({
                mensajeError:
                    "El nombre debe ser de un minimo de 5 caracteres y un maximo de 50 caracteres ",
            });
        }
    }

    const editTramite = (id, hasMany) => {

        if (hasMany.documento_id.length) {
            api.post("/tra-doc", { tramite_id: id, documento_id: hasMany.documento_id }).then((response) => {
            }, (error) => {
            })
        }

        if (hasMany.requisito_id.length) {
            api.post("/tra-req", { tramite_id: id, requisito_id: hasMany.requisito_id }).then((response) => {
            }, (error) => {
            })
        }

        if (hasMany.paso_id.length) {
            api.post("/tra-pas", { tramite_id: id, paso_id: hasMany.paso_id }).then((response) => {
            }, (error) => {
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const hasMany = {
            documento_id: tramite.documento_id.map((el) => {
                return documentos.find(p => p.nombre === el).id;
            }),
            requisito_id: tramite.requisito_id.map((el) => {
                return requisitos.find(p => p.nombre === el).id;
            }),
            paso_id: tramite.paso_id.map((el) => {
                return pasos.find(p => p.nombre === el).id;
            })
        };
        //console.log("ESTADO ANTES DE PERMISOS",tramite);        
        if (props.formType === 'new') {
            api.post("/tramite", { nombre: tramite.nombre }).then((response) => {
                props.setRows(props.rows.concat(response.data));
                editTramite(response.data.id, hasMany)
                props.handleClose();
            }, (error) => {
                setRequestError(error.response.data.message + ' ' + error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else if (props.formType === 'edit') {
            //console.log(tramite)
            api.put("/tramite/" + props.tramiteId, tramite).then((response) => {
                var newRows = props.rows
                newRows.forEach(function (row) {
                    if (row.id === response.data.id) {
                        row.nombre = tramite.nombre
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                editTramite(response.data.id, hasMany)
                props.handleClose()
            }, (error) => {
                console.log(error.response.data.errors)
                setRequestError(error.response.data.message + ' ' + error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        } else {
            api.delete("/tramite/" + props.tramiteId).then((response) => {
                //console.log(response)
                api.get('/tramite').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                    props.handleClose();
                })
            }, (error) => {
                console.log(error.response.data.message)
                setRequestError(error.response.data.message + ' ' + error.response.data.errors.map((el) => {
                    console.log(el);
                    return el;
                }))
            })
        }
    }

    useEffect(() => {
        if (props.tramiteId && props.tramiteId !== 0) {
            api.get('/tramite/' + props.tramiteId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione   
                //console.log(tramite)
                setTramite({
                    id: props.tramiteId, nombre: response.data.nombre,
                    documento_id: response.data.documentos.map((ele) => {
                        return ele.nombre
                    }),
                    requisito_id: response.data.requisitos.map((ele) => {
                        return ele.nombre
                    }),
                    paso_id: response.data.pasos.map((ele) => {
                        return ele.nombre
                    })
                });

            })
        }
    }, [props.tramiteId]);

    function createOrEdit() {
        return (
            <FormGroup style={{ justifyContent: 'center' }} >
                <TextField
                    required
                    id="outlined-required"
                    placeholder="Nombre tramite*"
                    value={tramite.nombre}
                    variant="outlined"
                    onChange={(e) => {
                        setTramite({
                            ...tramite,
                            nombre: e.target.value
                        })
                        validarNombre(e.target.value)
                    }
                    }
                    error={Boolean(validacionNombre?.mensajeError)}
                    helperText={validacionNombre?.mensajeError}
                />
                <FormControl className={classes.formControl} >

                    <InputLabel id="demo-mutiple-checkbox-label">Documentos</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={tramite.documento_id}
                        onChange={(e) => setTramite({ ...tramite, documento_id: e.target.value })}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {documentos.map((element) => (
                            <MenuItem key={element.id} value={element.nombre}>
                                <Checkbox checked={tramite.documento_id.indexOf(element.nombre) > -1} />
                                <ListItemText primary={element.nombre} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl} >
                    <InputLabel id="demo-mutiple-checkbox-label">Requisitos</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={tramite.requisito_id}
                        onChange={(e) => setTramite({ ...tramite, requisito_id: e.target.value })}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {requisitos.map((element) => (
                            <MenuItem key={element.id} value={element.nombre}>
                                <Checkbox checked={tramite.requisito_id.indexOf(element.nombre) > -1} />
                                <ListItemText primary={element.nombre} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl} >
                    <InputLabel id="demo-mutiple-checkbox-label">Pasos</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={tramite.paso_id}
                        onChange={(e) => setTramite({ ...tramite, paso_id: e.target.value })}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {pasos.map((element) => (
                            <MenuItem key={element.id} value={element.nombre}>
                                <Checkbox checked={tramite.paso_id.indexOf(element.nombre) > -1} />
                                <ListItemText primary={element.nombre} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.formulario}>
                {requestError != null ? <p className="alert danger-alert"><Alert severity="error">Ha ocurrido un error: {requestError}</Alert></p> : ''}
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este tramite?</p> : props.formType==='new' ? createOrEdit() : tramite.id ? createOrEdit() : <CircularProgress/>}
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
