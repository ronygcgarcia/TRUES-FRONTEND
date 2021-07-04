import React, { useEffect, useState } from "react";
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
import { Edit, Delete } from "@material-ui/icons";
import "./User.css";

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
  const [users, setUsers] = useState([]);
  const styles = useStyles();


  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  //const [modalEliminar, setModalEliminar]=useState(false);

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
      const resp = await api.post("/users",userSelected).then((response) => {
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
      const resp = await api.post("/users", userSelected).then((response) => {
        setUsers(users.concat(response.data));
        abrirCerrarModalInsertar();
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nuevo Usuario</h3>
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="uid"
        className={styles.inputMaterial}
        label="Nombre de Usuario"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="email"
        className={styles.inputMaterial}
        label="Correo Electronico"
        onChange={handleChange}
      />
      <br />
      <TextField
        type="password"
        name="password"
        className={styles.inputMaterial}
        label="Contraseña"
        onChange={handleChange}
      />
      <br />
      <TextField
        type="password"
        name="password_confirmation"
        className={styles.inputMaterial}
        label="Verificar Contraseña"
        onChange={handleChange}
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => createUser()}>
          Insertar
        </Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar Usuario</h3>
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
        value={userSelected && userSelected.name}
      />
      <br />
      <TextField
        name="username"
        className={styles.inputMaterial}
        label="Nombre de Usuario"
        onChange={handleChange}
        value={userSelected && userSelected.username}
      />
      <br />
      <TextField
        name="email"
        className={styles.inputMaterial}
        label="Correo Electronico"
        onChange={handleChange}
        value={userSelected && userSelected.email}
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => updateUser()}>
          Editar
        </Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  );

  return (
    <div className="users__crud">
      <br />
      <Button onClick={() => abrirCerrarModalInsertar()}>Insertar</Button>
      <br />
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Correo</TableCell>

              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Edit />
                  <Delete />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
    </div>
  );
}

export default Users;
