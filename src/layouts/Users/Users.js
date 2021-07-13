import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import "./User.css";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";

//---------------------------------------------------------------Material UI
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import EditIcon from "@material-ui/icons/Edit";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
//----------------------------------------------------Estilos para los Modales
const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
  },
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
  container: {},
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    variant: "outlined",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  table: {
    minWidth: 500,
    minHeight: 500,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
function getStyles(rolLista, rolSeleccionado, theme) {
  return {
    fontWeight:
      rolSeleccionado.indexOf(rolLista) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const roles = [];

api.get("/roles").then((response) => {
  response.data.forEach(function (element) {
    roles.push(element);
  });
});

//-----------------------------------FUNCION PRINCIPAL---------------------------//
function Users() {
  const {
    handleSubmit,

    formState: {},
  } = useForm();
  const onSubmit = (data) => {};
  //-----------------------------------Definicion de columnas para material-table
  const columnas = [
    {
      id: "users",
      label: "Nombre",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "username",
      label: "Nombre de Usuario",
      minWidth: 100,
      align: "left",
    },
    {
      id: "email",
      label: "Correo Electronico",
      minWidth: 100,
      align: "left",
    },
    {
      id: "role",
      label: "Rol",
      minWidth: 100,
      align: "center",
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 100,
      align: "center",
    },
  ];

  const [users, setUsers] = useState([]);

  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);

  const [valName, setValName] = useState({
    valName: "",
  });
  const [valUID, setValUID] = useState({
    valUID: "",
  });
  const [valErrors, setValErrors] = useState({
    valEmail: "",
  });
  const [valPass, setValPass] = useState({
    valPass: "",
  });
  const [valPassConf, setValPassConf] = useState({
    valPassConf: "",
  });

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //Estado para el usuario al cual hacer acciones
  const [userSelected, setUserSelected] = useState({
    name: "",
    uid: "",
    email: "",
    role: [],
    password: "",
    password_confirmation: "",
  });

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setValName({
          valName: "",
        });
        break;
      case "uid":
        setValUID({
          valUID: "",
        });
        break;
      case "email":
        setValErrors({
          valEmail: "",
        });
        break;
      case "password":
        setValPass({
          valPass: "",
        });
        break;
      case "password_confirmation":
        setValPassConf({
          valPassConf: "",
        });
        break;

      default:
        break;
    }

    setUserSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    switch (name) {
      case "name":
        let regName = new RegExp(/^[A-zÀ-ú.\s]{0,49}$/).test(value);

        if (!regName) {
          setValName({
            valName:
              "El nombre no debe contener números ni carácteres especiales. Maximo: 50 carácteres",
          });
        }
        break;
      case "uid":
        let regUID = new RegExp(/^[a-zA-Z0-9]\S{7,50}$/).test(value);

        if (!regUID) {
          setValUID({
            valUID:
              "El usuario debe tener al menos 8 letras y/o numeros sin espacios",
          });
        }
        break;
      case "email":
        let regEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{1,9}$/).test(
          value
        );
        if (!regEmail) {
          setValErrors({
            valEmail: "Aun no es un correo valido",
          });
        }
        break;
      case "password":
        //PasswordFacil: /^[a-zA-Z0-9]{7,16}$/
        let regPass = new RegExp(
          /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{7,16}$/
        ).test(value);

        if (!regPass) {
          setValPass({
            valPass:
              "La contraseña debe tener al menos 8 caracteres, 1 numero, 1 minuscula, 1 una mayuscula ",
          });
        }
        break;
      case "password_confirmation":
        if (userSelected.password !== value) {
          setValPassConf({
            valPassConf: "Las contraseñas no coinciden",
          });
        }
        break;

      default:
        break;
    }

    setRequestError(null);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    userSelected.name = "";
    userSelected.uid = "";
    userSelected.email = "";
    userSelected.role = [];
    userSelected.password = "";
    userSelected.password_confirmation = "";
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  //Peticiones para obtener los usuarios
  const getUsers = async () => {
    try {
      const resp = await api.get("/users");
      setUsers(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    const arrayID = userSelected.role.map((elemento) => {
      return elemento.id;
    });

    userSelected.roles = arrayID;

    if (
      userSelected.name !== "" &&
      userSelected.uid !== "" &&
      userSelected.email !== "" &&
      userSelected.password !== "" &&
      userSelected.password_confirmation !== ""
    ) {
      try {
        await api.post("/users", userSelected).then((response) => {
          getUsers();

          abrirCerrarModalInsertar();
        });
      } catch (error) {}
    }
  };

  const updateUser = async () => {
    const arrayID = userSelected.role.map((elemento) => {
      return elemento.id;
    });

    userSelected.roles = arrayID;

    if (
      userSelected.name !== "" &&
      userSelected.uid !== "" &&
      userSelected.email !== ""
    ) {
      try {
        await api
          .put("/users/" + userSelected.id, userSelected)
          .then((response) => {
            var newUsers = users;
            newUsers.map((user) => {
              if (userSelected.id === user.id) {
                user.name = userSelected.name;
                user.uid = userSelected.uid;
                user.email = userSelected.email;
              }
            });
            getUsers();
            abrirCerrarModalEditar();
          });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete("/users/" + userSelected.id).then((response) => {
        setUsers(users.filter((user) => user.id !== userSelected.id));
        abrirCerrarModalEliminar();
      });
    } catch (error) {
      setRequestError(error.response.data.message);
    }
  };

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarUser = (user, caso) => {
    setUserSelected(user);

    switch (caso) {
      case "Editar":
        abrirCerrarModalEditar();
        //obtenerRolesUser(user);
        break;
      case "Eliminar":
        abrirCerrarModalEliminar();
        break;

      default:
        break;
    }
  };

  const rolesToSend = [];
  const theme = useTheme();

  const handleChangeRol = (event) => {
    rolesToSend.push(event.target.value.id);
    setUserSelected({
      ...userSelected,
      role: event.target.value,
      roles: event.target.value,
    });
  };
  useEffect(() => {
    getUsers();
  }, []);

  const bodyInsertar = (
    <div>
      <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Agregar Nuevo Usuario</Typography>
        <br />
        <br />
        <TextField
          autoFocus
          value={userSelected.name}
          required
          name="name"
          className={styles.inputMaterial}
          label="Nombre del Usuario"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valName?.valName)}
          helperText={valName?.valName}
        />
        <br />
        <br />
        <TextField
          value={userSelected.uid}
          name="uid"
          required
          className={styles.inputMaterial}
          label="Nombre de Usuario"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valUID?.valUID)}
          helperText={valUID?.valUID}
        />
        <br />
        <br />
        <TextField
          value={userSelected.email}
          name="email"
          required
          className={styles.inputMaterial}
          label="Correo Electronico"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valErrors?.valEmail)}
          helperText={valErrors?.valEmail}
        />
        <br />
        <br />
        <TextField
          value={userSelected.password}
          type="password"
          name="password"
          className={styles.inputMaterial}
          label="Contraseña"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valPass?.valPass)}
          helperText={valPass?.valPass}
        />
        <br />
        <br />
        <TextField
          value={userSelected.password_confirmation}
          type="password"
          name="password_confirmation"
          className={styles.inputMaterial}
          label="Repetir Contraseña"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valPassConf?.valPassConf)}
          helperText={valPassConf?.valPassConf}
        />
        <br />
        <br />
        <br />
        <FormControl className={styles.formControl}>
          <InputLabel id="demo-mutiple-checkbox-label">Roles</InputLabel>
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            value={userSelected.role}
            onChange={handleChangeRol}
            input={<Input />}
            renderValue={(selected) => {
              return (
                <div className={styles.chips}>
                  {selected.map((elemento) => (
                    <Chip
                      key={elemento.id}
                      label={elemento.name}
                      className={styles.chip}
                      variant="outlined"
                    />
                  ))}
                </div>
              );
            }}
            MenuProps={MenuProps}
          >
            {roles.map((rolLista) => (
              <MenuItem
                key={rolLista.id}
                value={rolLista}
                style={getStyles(rolLista.name, userSelected.role, theme)}
              >
                {rolLista.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => createUser()}
            type="submit"
          >
            Insertar
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="secondary"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );

  const bodyEditar = (
    <div>
      <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Editar Usuario</Typography>
        <br />
        <br />
        <TextField
          value={userSelected.name}
          name="name"
          required
          className={styles.inputMaterial}
          label="Nombre"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valName?.valName)}
          helperText={valName?.valName}
        />
        <br />
        <br />
        <TextField
          value={userSelected.uid}
          name="uid"
          required
          className={styles.inputMaterial}
          label="Nombre de Usuario"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valUID?.valUID)}
          helperText={valUID?.valUID}
        />
        <br />
        <br />
        <TextField
          value={userSelected.email}
          name="email"
          required
          className={styles.inputMaterial}
          label="Correo Electronico"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valErrors?.valEmail)}
          helperText={valErrors?.valEmail}
        />
        <br />
        <br />
        <TextField
          value={userSelected.password}
          type="password"
          name="password"
          className={styles.inputMaterial}
          label="Contraseña"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valPass?.valPass)}
          helperText={valPass?.valPass}
        />
        <br />
        <br />
        <TextField
          value={userSelected.password_confirmation}
          type="password"
          name="password_confirmation"
          className={styles.inputMaterial}
          label="Repetir Contraseña"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(valPassConf?.valPassConf)}
          helperText={valPassConf?.valPassConf}
        />
        <br />
        <br />
        {requestError != null ? (
          <div className="alert danger-alert">
            <Alert severity="error">Ha ocurrido un error: {requestError}</Alert>
          </div>
        ) : (
          ""
        )}

        <FormControl className={styles.formControl}>
          <InputLabel id="demo-mutiple-checkbox-label">Roles</InputLabel>
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            value={userSelected.role}
            onChange={handleChangeRol}
            input={<Input />}
            renderValue={(selected) => {
              return (
                <div className={styles.chips}>
                  {selected.map((elemento) => (
                    <Chip
                      key={elemento.id}
                      label={elemento.name}
                      className={styles.chip}
                      variant="outlined"
                    />
                  ))}
                </div>
              );
            }}
            MenuProps={MenuProps}
          >
            {roles.map((rolLista) => (
              <MenuItem
                key={rolLista.id}
                value={rolLista}
                style={getStyles(rolLista.name, userSelected.role, theme)}
              >
                {rolLista.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateUser()}
            type="submit"
          >
            Editar
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="secondary"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );

  const bodyEliminar = (
    <div className={styles.modal}>
      <Typography variant="h4">Eliminar Usuario</Typography>
      <br />
      <p>Estás seguro que deseas eliminar el usuario {userSelected.name}? </p>
      <br />
      <br />
      <div align="right">
        {requestError != null ? (
          <div className="alert danger-alert">
            <Alert severity="error">Ha ocurrido un error: {requestError}</Alert>
          </div>
        ) : (
          ""
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteUser()}
        >
          Sí
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={() => abrirCerrarModalEliminar()}
        >
          No
        </Button>
      </div>
    </div>
  );
  return (
    <div className="users__crud">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => (abrirCerrarModalInsertar(), setRequestError(null))}
      >
        <Add />
        &nbsp; Crear Nuevo Usuario
      </Button>
      <br />
      <br />
      <Paper className={styles.root}>
        <TableContainer className={styles.container}>
          <Table stickyHeader aria-label="sticky table" className={styles.header}>
            <TableHead>
              <TableRow>
                {columnas.map((column) => (
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
              {(rowsPerPage > 0
                ? users.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : users
              ).map((element, index) => (
                <TableRow hover key={index}>
                  <TableCell key={element.id} align="left">
                    {element.name}
                  </TableCell>
                  <TableCell align="left">{element.uid}</TableCell>
                  <TableCell align="left">{element.email}</TableCell>
                  <TableCell align="center">
                    {element.role.map((rol, index) => (
                      <Chip
                        color="primary"
                        icon={<FaceIcon />}
                        key={rol.id}
                        label={rol.name}
                        className={styles.chip}
                        variant="outlined"
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Box pr={1} pl={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          seleccionarUser(element, "Editar");
                          abrirCerrarModalEditar();
                        }}
                      >
                        <EditIcon />
                      </Button>{" "}
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          seleccionarUser(element, "Eliminar");
                          abrirCerrarModalEliminar();
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default Users;
