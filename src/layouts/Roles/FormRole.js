import React, { useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
import api from '../../config/axios';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
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

const permissions = [];

api.get('/permisos').then((response)=>{    
    response.data.forEach(function(element){
        permissions.push(element)
    })
})


const FormRole = (props) => {
    const [rol, setRol] = React.useState({ id: 0, name: '', permissions: [] });

    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("ESTADO ANTES DE PERMISOS",rol);
        const permisos = rol.permissions.map((el) => {
            return permissions.find(p => p.name === el).id;
        });
        if (props.formType === 'new') {
            //console.log(rol)
            api.post("/roles", { ...rol, permissions: permisos }).then((response) => {
                props.setRows(props.rows.concat(response.data));
            }, (error) => {
                console.log(error)
            })
        } else if (props.formType === 'edit') {
            //console.log(rol)
            api.put("/roles/" + props.rolId, { ...rol, permissions: permisos }).then((response) => {
                var newRows = props.rows
                newRows.forEach(function(row){
                    if (row.id === response.data.id) {
                        row.name = rol.name
                    }
                })
                props.setRows([])
                props.setRows(newRows)
                //console.log(props.rows)
            })
        } else {
            api.delete("/roles/" + props.rolId).then((response) => {
                //console.log(response)
                api.get('/roles').then((response) => {
                    props.setRows([])
                    props.setRows(response.data)
                })
            })
        }
        //console.log("ESTADO ANTES DE ENVIAR",{...rol,permissions:permisos});
        props.handleClose();
    }

    const handleChange = (event) => {
        //setPermission(event.target.value);
        //console.log(event.target.value);
        setRol({ ...rol, permissions: event.target.value })
    };

    useEffect(() => {
        if (props.rolId && props.rolId !== 0) {
            api.get('/roles/' + props.rolId).then((response) => {
                // los objetos permiso, se cambian a strings para que el select funcione
                //console.log(response)
                setRol({
                    id: props.rolId, name: response.data.name, permissions: response.data.permissions.map((ele) => {
                        return ele.name
                    })
                });
            })
        }
    }, [props.rolId]);

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                required
                id="outlined-required"
                label="Nombre rol"
                value={rol.name}
                variant="outlined"
                onChange={(e) => setRol({ ...rol, name: e.target.value })}
            />
            <FormControl className={classes.formControl} >

                <InputLabel id="demo-mutiple-checkbox-label">Permisos</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={rol.permissions}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {permissions.map((element) => (
                        <MenuItem key={element.id} value={element.name}>
                            <Checkbox checked={rol.permissions.indexOf(element.name) > -1} />
                            <ListItemText primary={element.name} />
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>
        </FormGroup>);
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={classes.root}>
                {props.formType === 'delete' ? <p>¿Esta seguro de que desea eliminar este rol?</p> : createOrEdit()}
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
