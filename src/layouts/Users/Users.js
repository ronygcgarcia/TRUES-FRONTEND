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
  const [modalEliminar, setModalEliminar]=useState(false);

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

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

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
      const resp = await api.put("/users/"+userSelected.id,userSelected)
      .then(response => {
        var newUsers = users;
        newUsers.map(user=>{
          if(userSelected.id===user.id){
            user.name=userSelected.name;
            user.uid=userSelected.uid;
            user.email=userSelected.email;
          }
        })
        setUsers(newUsers);
        abrirCerrarModalEditar();
      })
    } catch (error) {
      abrirCerrarModalEditar();
      console.error(error);
    }
  }

  const deleteUser = async () => {
    try {
      const resp = await api.delete("/users/"+userSelected.id)
      .then(response=>{
        //setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
        setUsers(users.filter(user=>user.id!==userSelected.id));
        abrirCerrarModalEliminar();
      })
    } catch (error) {
      console.log('Somethig went wrong');
    }
  }

  const seleccionarUser = (user, caso)=>{
    setUserSelected(user);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  

  

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
        <Button variant="contained" color="primary" onClick={() => createUser()}>
          Insertar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
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
        <Button variant="contained" color="primary" onClick={() => updateUser()}>
          Editar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el usuario? </p>
      <br/><br/>
      <div align="right">
        <Button variant="contained" color="secondary" onClick={()=>deleteUser()} >Sí</Button>
        &nbsp;&nbsp;
        <Button variant="contained" color="primary" onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="users__crud">
      <br />
      <Button variant="contained" color="primary" onClick={() => abrirCerrarModalInsertar()}>Insertar</Button>
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
                <TableCell>{user.uid}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Edit onClick={()=>seleccionarUser(user, 'Editar')}/>
                  &nbsp;&nbsp;
                  <Delete onClick={()=>seleccionarUser(user, 'Eliminar')}/>
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
      <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default Users;
