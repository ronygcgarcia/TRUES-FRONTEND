import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Modal,
  TextField,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import "./User.css";
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

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

//PRINCIPAL
function Users() {
  //MAterial Table
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

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [userSelected, setUserSelected] = useState({
    name: "",
    uid: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(userSelected);
  };

  /*const handleChangeCreate=e=>{

  }*/

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const getUsers = async () => {
    try {
      const resp = await api.get("/users");
      setUsers(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  const createUser = async () => {
    try {
      const resp = await api.post("/users", userSelected).then((response) => {
        setUsers(users.concat(response.data));
        console.log(users);
        console.log(response.data);
        abrirCerrarModalInsertar();
      });
    } catch (error) {
      abrirCerrarModalInsertar();
      console.error(error);
    }
  };

  const updateUser = async () => {
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
      abrirCerrarModalEditar();
      console.error(error);
    }
  };

  const deleteUser = async () => {
    try {
      const resp = await api
        .delete("/users/" + userSelected.id)
        .then((response) => {
          //setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
          setUsers(users.filter((user) => user.id !== userSelected.id));
          abrirCerrarModalEliminar();
        });
    } catch (error) {
      console.log("Somethig went wrong");
    }
  };

  const seleccionarUser = (user, caso) => {
    setUserSelected(user);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    getUsers();
  }, []);

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nuevo Usuario</h3>
      <br />
      <br />
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
        variant="outlined"
      />
      <br />
      <br />
      <TextField
        name="uid"
        className={styles.inputMaterial}
        label="Nombre de Usuario"
        onChange={handleChange}
        variant="outlined"
      />
      <br />
      <br />
      <TextField
        name="email"
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
        label="Verificar Contraseña"
        onChange={handleChange}
        variant="outlined"
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => createUser()}
        >
          Insertar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => abrirCerrarModalInsertar()}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );

  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar Usuario</h3>
      <br />
      <br />
      <TextField
        name="name"
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
        className={styles.inputMaterial}
        label="Correo Electronico"
        onChange={handleChange}
        value={userSelected && userSelected.email}
        variant="outlined"
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateUser()}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => abrirCerrarModalEditar()}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el usuario? </p>
      <br />
      <br />
      <div align="right">
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
        onClick={() => abrirCerrarModalInsertar()}
      >
        Insertar
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
            onClick: (event, rowData) => seleccionarUser(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Elimnar Usuario",
            onClick: (event, rowData) => seleccionarUser(rowData, "Eliminar"),
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
