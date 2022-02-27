import {
  Button,
  FormGroup,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddBoxIcon from "@material-ui/icons/AddBox";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import PublishIcon from "@material-ui/icons/Publish";

import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import api from "../../config/axios";
import ModalSubirArchivo from "./ModalSubirArchivo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  content: {
    flexGrow: 1,
    height: "100%",
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
    height: 65,
  },
  fixedTite: {
    height: 100,
  },
  inputMaterial: {
    width: "100%",
  },
  modal: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
  },
  selectTramite: {
    margin: theme.spacing(1),
    minidth: 300,
    height: "100%",
  },
  pasos: {
    width: "40%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  formButtons: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function UsuarioTramite({ usuarioLog }) {
  const classes = useStyles();
  const ref = React.createRef();
  const fixedHeightPaper = clsx(classes.paper);
  const [requestError, setRequestError] = useState();
  const [usuario, setUsuario] = useState({
    uid: "",
  });
  const [tramites, setTramites] = useState([]);
  const [tramitesGet, setTramitesGet] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalUpload, setEstadoModalUpload] = useState(false);
  const [tramiteAsignar, setTramiteAsignar] = React.useState(
    "Seleccione un tramite para asignar"
  );
  const [tramiteSelected, setTramiteSelected] = useState();
  const [pasos, setPasos] = useState([]);
  const [checked, setChecked] = React.useState([]);
  const [problem, setProblem] = useState(false);

  const handleModal = () => {
    setEstadoModal(!estadoModal);
  };

  const handleModalUpload = () => {
    setEstadoModalUpload(!estadoModalUpload);
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

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    changePasoState(value);
  };

  const changePasoState = async (value) => {
    try {
      await api.post("/user-paso/" + value);
      showPasos(tramiteSelected);
    } catch (err) {
      
    }
  };

  const getTramites = async () => {
    const tramitesAr = [];
    try {
      api.get("/tramite").then((response) => {
        response.data.forEach(function (element) {
          tramitesAr.push(element);
        });
      });
      setTramitesGet(tramitesAr);
    } catch (error) {
      
    }
  };

  const buscarUsuario = async () => {
    if (usuario.uid !== "") {
      try {
        await api.get("/tramites/" + usuario.uid).then((response) => {
          setTramites(response.data.user.tramites);
          setUsuario(response.data.user);
          setRequestError(true);
          setPasos([]);
          setProblem(false);
        });
      } catch (error) {
        switch (error.response.data.message) {
          case "Este usuario no posee tramites":
            setRequestError(true);
            setTramites([{ nombre: "Este usuario no posee tramites" }]);
            setUsuario(error.response.data.user);
            setPasos([]);
            setProblem(false);
            break;
          case "No existe este carnet":
            setRequestError(false);
            setTramites([{ nombre: "No existe este carnet" }]);
            setPasos([]);
            setProblem(true);
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
      api.get("/tramites/" + usuario.uid).then((response) => {
        setTramites(response.data.user.tramites);
        setRequestError(true);
        setPasos([]);
        buscarUsuario();
      });
      handleModal();
    } catch (error) {
      
    }
  };

  const eliminarTramite = async (usertramite_id) => {
    try {
      api.delete("/user-tramite/" + usertramite_id).then((response) => {
        buscarUsuario();
      });
    } catch (error) {
      setProblem(true);
    }
  };

  const showPasos = async (id) => {
    const pasosAr = [];
    try {
      const respuesta = await api.get("/user-paso/" + usuario.id + "/" + id);
      respuesta.data.forEach((element) => {
        pasosAr.push(element);
      });
      setPasos(pasosAr);
      setTramiteSelected(id);
    } catch (error) {
      
      setTramiteSelected(0);
    }
  };

  useEffect(() => {
    getTramites();
  }, []);

  const dialogoSubirArchivo = (
    <div>
      <ModalSubirArchivo
        handleModalUpload={handleModalUpload}
      ></ModalSubirArchivo>
    </div>
  );

  const modalAsignacion = (
    <div>
      <form className={classes.modal} onSubmit={handleSubmit}>
        <FormGroup>
          <Typography variant="h4">Asignar Tramite a Usuario</Typography>
          &nbsp;
          <FormControl className={classes.formControl}>
            <InputLabel>Tramites Disponibles</InputLabel>
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
          <FormControl className={classes.formButtons}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => agregarTramite()}
            >
              Agregar
            </Button>
            &nbsp;&nbsp;
            <Button variant="contained" color="secondary" onClick={handleModal}>
              Cerrar
            </Button>
          </FormControl>
        </FormGroup>
      </form>
    </div>
  );

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <Paper className={classes.paper}>
              <Typography variant="h6">
                Gestror de Tramite por Estudiante
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Button
              className={classes.fixedHeight}
              onClick={() => {
                handleModalUpload();
              }}
              variant="outlined"
              color="primary"
            >
              <PublishIcon />
              Subir Archivo
            </Button>
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
                    error={problem}
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
                      disabled={
                        tramites[0].nombre === "Este usuario no posee tramites"
                          ? true
                          : false
                      }
                      button
                      key={index}
                      divider
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
                      <ListItemSecondaryAction>
                        <IconButton
                          disabled={
                            tramites[0].nombre ===
                            "Este usuario no posee tramites"
                              ? true
                              : false
                          }
                          edge="end"
                          aria-label="delete"
                          onClick={() => eliminarTramite(tramite.pivot.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12} className={classes.pasos}>
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
                    <ListItem button key={index} divider>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={paso[0].tramite_paso.pasos.nombre}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          onChange={handleToggle(paso[0].id)}
                          checked={paso[0].estado === 1}
                          inputProps={{
                            "aria-labelledby": "switch-list-label-wifi",
                          }}
                        />
                      </ListItemSecondaryAction>
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
        <Modal ref={ref} open={estadoModalUpload} onClose={handleModalUpload}>
          {dialogoSubirArchivo}
        </Modal>
      </main>
    </div>
  );
}

export default UsuarioTramite;
