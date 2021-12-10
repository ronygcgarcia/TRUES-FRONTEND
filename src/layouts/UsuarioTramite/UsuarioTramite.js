import {
  Button,
  FormGroup,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddBoxIcon from "@material-ui/icons/AddBox";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import api from "../../config/axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  fixedTite: {
    height: 100,
  },
  inputMaterial: {
    width: "100%",
  },
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
  selectTramite: {
    minWidth: 200,
  },
}));

const tramitesGet = [];

api.get("/tramite").then((response) => {
  response.data.forEach(function (element) {
    tramitesGet.push(element);
  });
});

function UsuarioTramite({ usuarioLog }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [requestError, setRequestError] = useState();
  const [usuario, setUsuario] = useState({
    uid: "",
  });
  const [tramites, setTramites] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [tramiteAsignar, setTramiteAsignar] = React.useState(
    "Seleccione un tramite para asignar"
  );
  const [pasos, setPasos] = useState([]);

  const handleModal = () => {
    setEstadoModal(!estadoModal);
  };

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      uid: e.target.value,
    });
  };

  const selectTramite = (event) => {
    setTramiteAsignar(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const buscarUsuario = async () => {
    if (usuario.uid !== "") {
      try {
        await api.get("/tramites/" + usuario.uid).then((response) => {
          setTramites(response.data.user.tramites);
          setUsuario(response.data.user);
          setRequestError(true);
          setPasos([]);
        });
      } catch (error) {
        switch (error.response.data.message) {
          case "Este usuario no posee tramites":
            setRequestError(true);
            setTramites([{ nombre: "Este usuario no posee tramites" }]);
            setUsuario(error.response.data.user);
            setPasos([]);
            break;
          case "No existe este carnet":
            setRequestError(false);
            setTramites([{ nombre: "No existe este carnet" }]);
            setPasos([]);
            break;

          default:
            setRequestError(null);
            break;
        }
      }
    }
  };
  const agregarTramite = async () => {
    try {
      api.post("/user-tramite", {
        user_id: usuario.id,
        tramite_id: tramiteAsignar,
      });
      buscarUsuario();
      handleModal();
    } catch (error) {
      console.log("Error al agregarle el tramite al usuario: " + error);
    }
  };

  const showPasos = async (id) => {
    const pasosAr = [];
    try {
      const respuesta = await api.get("/tramites/" + usuario.id + "/" + id);
      respuesta.data.forEach((element) => {
        pasosAr.push(element);
      });
      setPasos(pasosAr);
    } catch (error) {
      console.log("error al obtener los pasos: " + error);
    }
  };

  const modalAsignacion = (
    <div>
      <form className={classes.modal} onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.selectTramite}>
              Selecciones un Tramite para Asignar
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tramiteAsignar}
              onChange={selectTramite}
              className={classes.selectTramite}
              required
            >
              {tramitesGet.map((tramiteA, index) => (
                <MenuItem key={index} value={tramiteA.id}>
                  {tramiteA.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Button variant="contained" color="secondary" onClick={handleModal}>
              Cerrar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => agregarTramite()}
            >
              Agregar
            </Button>
          </FormControl>
        </FormGroup>
      </form>
    </div>
  );

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6">
                Gestror de Tramite por Estudiante
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Paper className={fixedHeightPaper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Ingrese el Carnet del Estudiante
                  </Typography>
                  <br />
                  <TextField
                    className={classes.inputMaterial}
                    name="uuid"
                    label="Carnet o UUID"
                    onChange={handleChange}
                    value={usuario.uuid}
                    variant="outlined"
                    required
                  />
                  <br />
                  <FormControl>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => buscarUsuario()}
                      type="submit"
                    >
                      Buscar
                    </Button>
                  </FormControl>
                </Paper>
              </FormGroup>
            </form>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper className={fixedHeightPaper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Tramites del estudiante
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                disabled={!requestError}
                onClick={() => {
                  handleModal();
                }}
                type="submit"
              >
                <AddBoxIcon />
                &nbsp; Agregar Tramite a Usuario
              </Button>
              <List component="nav" aria-label="main mailbox folders">
                {tramites.map((tramite, index) => {
                  return (
                    <ListItem
                      button
                      key={index}
                      onClick={() => {
                        showPasos(tramite.id);
                      }}
                    >
                      <ListItemIcon>
                        {requestError ? (
                          <AssignmentIcon />
                        ) : (
                          <HighlightOffIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={tramite.nombre} />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Pasos del tramite actual
              </Typography>
              <List component="nav" aria-label="main mailbox folders">
                {pasos.map((paso, index) => {
                  return (
                    <ListItem button key={index}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={paso[0].tramite_paso.pasos.nombre}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
        <Modal open={estadoModal} onClose={handleModal}>
          {modalAsignacion}
        </Modal>
      </main>
    </div>
  );
}

export default UsuarioTramite;
