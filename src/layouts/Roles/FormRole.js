import React from 'react'
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

const permissions = [
    'Crear rol',
    'Editar rol',
    'Ver rol',
    'Eliminar rol'
];

const FormRole = (props) => {
    const [permission, setPermission] = React.useState([]);

    const classes = useStyles();

    const handleChange = (event) => {
        setPermission(event.target.value);
    };

    function createOrEdit() {
        return (<FormGroup style={{ justifyContent: 'center' }}>
            <TextField
                required
                id="outlined-required"
                label="Nombre rol"
                defaultValue=""
                variant="outlined"
            />
            <FormControl className={classes.formControl} >

                <InputLabel id="demo-mutiple-checkbox-label">Permisos</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={permission}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {permissions.map((element) => (
                        <MenuItem key={element} value={element}>
                            <Checkbox checked={permission.indexOf(element) > -1} />
                            <ListItemText primary={element} />
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>
        </FormGroup>);
    }
    return (
        <div>
            <form onSubmit={props.onSubmit} className={classes.root}>
                {props.formType==='delete'?<p>¿Esta seguro de que desea eliminar este rol?</p>:createOrEdit()}
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
