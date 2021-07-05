import React, { useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';

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
    const [unidad, setUnidad] = React.useState({ id: 0, nombre: ''});

    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",unidad);        
        if (props.formType === 'new') {
            console.log(unidad)
            api.post("/unidad", unidad).then((response) => {
                props.setRows(props.rows.concat(response.data));
            }, (error) => {
                console.log(error)
            })
        } else if (props.formType === 'edit') {
            //console.log(unidad)
            api.put("/unidad/" + props.unidadId, unidad).then((response) => {
                var newRows = props.rows
                newRows.forEach(function(row){
                    if (row.id === response.data.id) {
                        row.nombre = unidad.nombre                       
                    }
                })
                props.setRows([])
                props.setRows(newRows)                
            })
        } else {
            api.delete("/unidad/" + props.unidadId).then((response) => {
                //console.log(response)
                api.get('/unidad').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
            })
        }        
        props.handleClose();
    }

    useEffect(() => {
        if (props.unidadId && props.unidadId !== 0) {
            api.get('/unidad/' + props.unidadId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
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
                onChange={(e) => setUnidad({ ...unidad, nombre: e.target.value })}
            />              
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este unidad?</p> : createOrEdit()}
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
