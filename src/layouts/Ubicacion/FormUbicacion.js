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
    formContubicacion: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

const FormRole = (props) => {
    const [ubicacion, setUbicacion] = React.useState({ id: 0, name: '', permissions: [] });

    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",ubicacion);        
        if (props.formType === 'new') {
            //console.log(ubicacion)
            api.post("/ubicacion", ubicacion).then((response) => {
                props.setRows(props.rows.concat(response.data));
            }, (error) => {
                console.log(error)
            })
        } else if (props.formType === 'edit') {
            //console.log(ubicacion)
            api.put("/ubicacion/" + props.ubicacionId, ubicacion).then((response) => {
                var newRows = props.rows
                newRows.forEach(function(row){
                    if (row.id === response.data.id) {
                        row.nombre = ubicacion.nombre
                        row.descripcion=ubicacion.descripcion
                        row.longitud=ubicacion.longitud
                        row.latitud=ubicacion.latitud
                    }
                })
                props.setRows([])
                props.setRows(newRows)                
            })
        } else {
            api.delete("/ubicacion/" + props.ubicacionId).then((response) => {
                //console.log(response)
                api.get('/ubicacion').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
            })
        }
        //console.log("ESTADO ANTES DE ENVIAR",{...ubicacion,permissions:permisos});
        props.handleClose();
    }

    useEffect(() => {
        if (props.ubicacionId && props.ubicacionId !== 0) {
            api.get('/ubicacion/' + props.ubicacionId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setUbicacion({
                    id: props.ubicacionId, nombre: response.data.nombre, descripcion:response.data.descripcion, longitud:response.data.longitud, latitud:response.data.latitud
                });
            })
        }
    }, [props.ubicacionId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                required
                id="outlined-required"
                placeholder="Nombre ubicacion*"
                value={ubicacion.nombre}
                variant="outlined"
                onChange={(e) => setUbicacion({ ...ubicacion, nombre: e.target.value })}
            />
            <TextField
                required
                id="outlined-required"
                placeholder="Descripcion*"
                value={ubicacion.descripcion}
                variant="outlined"
                onChange={(e) => setUbicacion({ ...ubicacion, descripcion: e.target.value })}
            />
            <TextField
                required
                id="outlined-required"
                placeholder="Longitud*"
                value={ubicacion.longitud}
                variant="outlined"
                onChange={(e) => setUbicacion({ ...ubicacion, longitud: e.target.value })}
            />
            <TextField
                required
                id="outlined-required"
                placeholder="Latitud*"
                value={ubicacion.latitud}
                variant="outlined"
                onChange={(e) => setUbicacion({ ...ubicacion, latitud: e.target.value })}
            />           
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este ubicacion?</p> : createOrEdit()}
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
