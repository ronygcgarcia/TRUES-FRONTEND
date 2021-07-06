import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import "./User.css";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";

//---------------------------------------------------------------Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

//------------------------------------------------------------Material Table
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

//------------------------------------------------Iconos que usa material-table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

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
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

//-----------------------------------FUNCION PRINCIPAL---------------------------//
function Users() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  //-----------------------------------Definicion de columnas para material-table
  const columnas = [
    {
      title: "Nombre",
      field: "name",
    },
    {
      title: "Username",
      field: "uid",
    },
    {
      title: "Correo Electronico",
      field: "email",
    },
  ];

  const [users, setUsers] = useState([]);
  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Estado para el usuario al cual hacer acciones
  const [userSelected, setUserSelected] = useState({
    name: "",
    uid: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(userSelected);
    setRequestError(null);
  };

  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    userSelected.name = "";
    userSelected.uid = "";
    userSelected.email = "";
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
    if (
      userSelected.name !== "" &&
      userSelected.uid !== "" &&
      userSelected.email !== "" &&
      userSelected.password !== "" &&
      userSelected.password_confirmation !== ""
    ) {
      try {
        const resp = await api.post("/users", userSelected).then((response) => {
          setUsers(users.concat(response.data));

          abrirCerrarModalInsertar();
        });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };

  const updateUser = async () => {
    if (
      userSelected.name !== "" &&
      userSelected.uid !== "" &&
      userSelected.email !== ""
    ) {
    try {
      const resp = await api
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
          setUsers(newUsers);
          abrirCerrarModalEditar();
        });
    } catch (error) {
      setRequestError(error.response.data.message);
    }}
  };

  const deleteUser = async () => {
    try {
      const resp = await api
        .delete("/users/" + userSelected.id)
        .then((response) => {
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
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
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
          required
          name="name"
          className={styles.inputMaterial}
          label="Nombre del Usuario"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          name="uid"
          required
          className={styles.inputMaterial}
          label="Nombre de Usuario"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          name="email"
          required
          className={styles.inputMaterial}
          label="Correo Electronico"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          type="password"
          name="password"
          className={styles.inputMaterial}
          label="Contraseña"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          type="password"
          name="password_confirmation"
          className={styles.inputMaterial}
          label="Repetir Contraseña"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <br />
        <div align="right">
          {requestError != null ? (
            <div className="alert danger-alert">
              <Alert severity="error">
                Ha ocurrido un error: {requestError}
              </Alert>
            </div>
          ) : (
            ""
          )}
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
          name="name"
          required
          className={styles.inputMaterial}
          label="Nombre"
          onChange={handleChange}
          value={userSelected && userSelected.name}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          name="uid"
          required
          className={styles.inputMaterial}
          label="Nombre de Usuario"
          onChange={handleChange}
          value={userSelected && userSelected.uid}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          name="email"
          required
          className={styles.inputMaterial}
          label="Correo Electronico"
          onChange={handleChange}
          value={userSelected && userSelected.email}
          variant="outlined"
        />
        <br />
        <br />
        <br />
        {requestError != null ? (
          <div className="alert danger-alert">
            <Alert severity="error">Ha ocurrido un error: {requestError}</Alert>
          </div>
        ) : (
          ""
        )}
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
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => (abrirCerrarModalInsertar(), setRequestError(null))}
      >
        Crear Nuevo Usuario
      </Button>
      <br />
      <br />
      <MaterialTable
        icons={tableIcons}
        title="Usuarios del sistema"
        columns={columnas}
        data={users}
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Información del Usuario",
            onClick: (event, rowData) => (
              seleccionarUser(rowData, "Editar"), setRequestError(null)
            ),
          },
          {
            icon: Delete,
            tooltip: "Elimnar Usuario",
            onClick: (event, rowData) => (
              seleccionarUser(rowData, "Eliminar"), setRequestError(null)
            ),
          },
        ]}
        options={{ actionsColumnIndex: -1 }}
        localization={{
          header: {
            actions: "Opciones",
          },
        }}
      />

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
