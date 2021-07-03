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
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import "./User.css";



function Users() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const resp = await api.get("/users");
      console.log(resp.data);
      setUsers(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="users__crud">
      <br />
      <Button>Insertar</Button>
      <br />
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {console.log(user)}
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role.map((rol) => (
                    <li key={rol.id}>
                      {rol.name}
                      <br/>
                    </li>
                  ))}
                </TableCell>
                <TableCell>
                  <Edit />
                  <Delete />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Users;
