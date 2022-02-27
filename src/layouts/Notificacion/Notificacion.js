import {
  Box,
  Button,
  Container,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ErrorIcon from "@material-ui/icons/Error";
import ListItemText from "@material-ui/core/ListItemText";
import AddBoxIcon from "@material-ui/icons/AddBox";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import api from "../../config/axios";
import React, { useEffect, useState } from "react";
import { Delete, Send } from "@material-ui/icons";
import Alert from '@material-ui/lab/Alert';
import { AlertTitle } from "@material-ui/lab";


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
  box: {
    padding: "15px",
    display: "block",
    position: "relative",
  },
  centrarH: {
    display: "block",
    alignItems: "center",
    margin: "20px 10px",
  },
  label: {
    float: "left",
    position: "inline",
  },
  textinput: {
    position: "inline",
  },
  table: {
    minWidth: 650,
    margin: "5px 10px",
  },
  send: {
    float: "right",
    position: "flex",
    margin: "10px 20px 0px",
  },
  control: {
    display: "block",
    alignItems: "center",
  },
  title: {
    float: "left",
    position: "inline",
    margin: "10px 20px 0px",
  },
}));

function Notificacion() {
  const classes = useStyles();
  const ref = React.createRef();
  const fixedHeightPaper = clsx(classes.paper);
  const [requestError, setRequestError] = useState(true);
  const [ids, setIds] = useState([]);
  const [usuarioSearch, setUsuarioSearch] = useState({
    uid: "",
  });
  const [usuario, setUsuario] = useState({});
  const [destinatarios, setDestinatarios] = useState([]);
  const [notificacion, setNotificacion] = useState({
    titulo: "",
    descripcion: "",
    user_id: [],
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleNotificacion = (event) => {
    const { name, value } = event.target;

    setNotificacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(notificacion);
  };

  const handleChange = (e) => {
    setUsuarioSearch({
      ...usuarioSearch,
      uid: e.target.value,
    });
  };

  const buscarUsuario = async () => {
    if (usuarioSearch.uid !== "") {
      try {
        await api.get("/tramites/" + usuarioSearch.uid).then((response) => {
          setUsuario(response.data.user);
          setRequestError(false);
          console.log(response.data);
        });
      } catch (error) {
        switch (error.response.data.message) {
          case "Este usuario no posee tramites":
            setUsuario(error.response.data.user);
            setRequestError(false);
            break;
          case "No existe este carnet":
            console.log("Este usuario no existe");
            setRequestError(true);
            setUsuario([]);
            break;

          default:
            break;
        }
      }
      setUsuarioSearch({ uid: "" });
    }
  };

  const agregarDestinatario = () => {
    console.log("Destinatarios", destinatarios);
    if (ids.length !== 0) {
      const existe = ids.findIndex((element) => element === usuario.id);
      if (existe === -1) {
        setIds((arr) => [...arr, usuario.id]);
        setDestinatarios((arr) => [...arr, usuario]);
      } else {
      }
    } else {
      setIds((arr) => [...arr, usuario.id]);
      setDestinatarios((arr) => [...arr, usuario]);
    }
  };

  const quitarDestinatario = (destinatario_id) => {
    const newDestinatarios = destinatarios.filter(
      (item) => item.id !== destinatario_id
    );
    const newListaIds = ids.filter((elemento) => elemento !== destinatario_id);
    setDestinatarios(newDestinatarios);
    setIds(newListaIds);
    console.log(newDestinatarios);
  };

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  

  const mostrarResultado = async () => {
    await sleep(2000)
    setEnviado(false);
    console.log(enviado);
  }
  

  const enviarNotificacion = async () => {
    try {
      await api
        .post("/notificacion", {
          titulo: notificacion.titulo,
          descripcion: notificacion.descripcion,
          user_id: ids,
        })
        .then((response) => {
          setNotificacion({
            titulo: "",
            descripcion: "",
          });
          setDestinatarios([]);
          setIds([]);
          setUsuario([]);
          setEnviado(true);
          mostrarResultado();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Notificaciones a Estudiantes</Typography>
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
                    value={usuarioSearch.uid}
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
                Datos del estudiante
              </Typography>
              {usuario.name ? (
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemText primary={usuario.uid} secondary="Carnet" />
                  <ListItemText primary={usuario.email} secondary="Correo" />
                  <ListItemText primary={usuario.name} secondary="Nombre" />
                </List>
              ) : (
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemText primary=" " secondary="Carnet" />
                  <ListItemText primary=" " secondary="Correo" />
                  <ListItemText primary=" " secondary="Nombre" />
                </List>
              )}
              <Button
                variant="outlined"
                color="primary"
                disabled={requestError}
                onClick={() => {
                  agregarDestinatario();
                }}
                type="submit"
              >
                <AddBoxIcon />
                &nbsp; Agregar a Destinatarios
              </Button>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12} className={classes.pasos}>
            <form onSubmit={handleSubmit}>
              <Paper className={classes.paper}>
                <div className={classes.control}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                    className={classes.title}
                  >
                    Envio de Notificacion
                  </Typography>
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    endIcon={<Send>send</Send>}
                    className={classes.send}
                    disabled={
                      (ids.length === 0) |
                      (notificacion.titulo === "") |
                      (notificacion.descripcion === "")
                        ? true
                        : false
                    }
                    onClick={() => enviarNotificacion()}
                    type="submit"
                  >
                    Enviar
                  </Button>
                </div>
                {!enviado ? (
                    null
                  ):(
                    <Alert severity="success">Notificacion Enviada</Alert>
                  )}
                <Container className={classes.box}>
                  <div className={classes.centrarH}>
                    <Typography
                      variant="h6"
                      component="span"
                      className={classes.label}
                    >
                      Titulo de la notificacion
                    </Typography>
                    <TextField
                      name="titulo"
                      required
                      fullWidth
                      placeholder="Ej: Nuevas fechas para retirar ..."
                      variant="outlined"
                      className={classes.textinput}
                      onChange={handleNotificacion}
                    ></TextField>
                  </div>
                  <div className={classes.centrarH}>
                    <Typography
                      variant="h6"
                      component="span"
                      className={classes.label}
                    >
                      Mensaje
                    </Typography>
                    <TextField
                      name="descripcion"
                      required
                      fullWidth
                      multiline
                      variant="outlined"
                      className={classes.textinput}
                      onChange={handleNotificacion}
                    ></TextField>
                  </div>
                  <Typography
                    variant="h6"
                    component="span"
                    className={classes.label}
                  >
                    Destinatarios
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableBody>
                        {destinatarios.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.uid}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => quitarDestinatario(row.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </Paper>
            </form>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default Notificacion;
