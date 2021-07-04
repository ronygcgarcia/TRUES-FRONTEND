import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormRole from './FormRole';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop'
import api from '../../config/axios';
const columns = [
    { id: 'id', label: 'id', minWidth: 170 },
    {
        id: 'users',
        label: 'Nombre',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'actions',
        label: 'Acciones',
        minWidth: 100,
        align: 'center'
    }
];

function createData(id, users, actions) {
    return { id, users, actions };
}


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '4px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),

    },
}));


export default function StickyHeadTable() {

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [formType, setFormType] = React.useState('');
    const [roles, setRoles] = useState();
    const [rol, setRol] = useState({ id: 0, name: '', permisos: [] });
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = [];

    const getRoles = async () => {
        try {
            const resp = await api.get('/roles');
            setRoles(resp.data)
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

    useEffect(() => {
        getRoles()
    }, [])

    if (roles) {
        rows.push(...roles.map((element) => {
            return createData(
                element.id,
                element.name,
                <Box pr={1} pl={1}>
                    <Button variant="outlined" color="primary" onClick={() => {
                        handleOpen();
                        setFormType('edit');
                        setRol(element);
                        console.log(element)
                    }}>
                        <EditIcon />
                    </Button> <Button variant="outlined" color="secondary" onClick={() => {
                        handleOpen();
                        setFormType('delete');
                        setRol(element);
                    }}>
                        <DeleteForeverIcon />
                    </Button>
                </Box>
            )
        }));
    }
    return (
        <div>
            <Box pt={1} pb={1}>
                <Button variant="outlined" color="primary" onClick={() => {
                    handleOpen();
                    setFormType('new');
                    setRol({ id: 0, name: '', permisos: [] })
                }} style={{ display: 'block', marginLeft: 'auto' }}>
                    <AddIcon /> Crear nuevo rol
                </Button>
            </Box>
            <Paper className={classes.root} >
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <h1 id="transition-modal-title">{formType === 'new' ? 'Crear rol' : formType === 'edit' ? 'Editar rol' : 'Eliminar rol'}</h1>
                            <FormRole rolId={rol.id} formType={formType} handleClose={handleClose} ></FormRole>
                        </div>
                    </Fade>
                </Modal>
            </Paper>
        </div>
    );
}