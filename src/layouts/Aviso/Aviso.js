import { Button, Typography, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import api from "../../config/axios";
import Box from "@material-ui/core/Box";
import { Add } from "@material-ui/icons";
import ModalFormularioAviso from "./ModalFormularioAviso";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    height: "auto",
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
  media: {
    height: 500,
    objectFit: "cover",
  },
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function Aviso({ usuario }) {
  const ref = React.createRef();
  const classes = useStyles();
  const [avisos, setAvisos] = useState([]);
  const [avisoSelected, setAvisoSelected] = useState({
    descripcion: "",
    url: "",
  });

  const getAvisos = async () => {
    try {
      const resp = await api.get("/aviso");
      setAvisos(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAvisos();
  }, []);

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarAviso = (aviso, caso) => {
    setAvisoSelected(aviso);

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
  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const eliminarAviso = async () => {
    try {
      await api.delete("/aviso/" + avisoSelected.id).then((response) => {
        getAvisos();
        abrirCerrarModalEliminar();
      });
    } catch (error) {}
  };

  const bodyEliminar = (
    <div className={classes.modal}>
      <Alert severity="warning">
        Estás seguro que deseas eliminar este aviso?
      </Alert>
      <br />
      <Card>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            component="img"
            alt="imagen"
            height="140"
            image={avisoSelected.url}
            title="Titulo imagen"
          />
        </CardActionArea>
      </Card>
      <br />
      <div align="right">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => eliminarAviso()}
        >
          Sí
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            abrirCerrarModalEliminar();
          }}
        >
          No
        </Button>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.fixedTite}>
              <Box alignContent="center" textAlign="center">
                <Typography variant="h4">Avisos Generales</Typography>
                <div align="right">
                  <Button
                    disabled={
                      !usuario.permissions.find(
                        (permiso) => permiso.name === "crear aviso"
                      )
                    }
                    align="right"
                    variant="outlined"
                    color="primary"
                    onClick={() => abrirCerrarModalInsertar()}
                  >
                    <Add />
                    &nbsp; Agregar Nuevo Aviso
                  </Button>
                </div>
              </Box>
            </Paper>
          </Grid>

          {avisos
            .sort(function (a, b) {
              return b.id - a.id;
            })
            .map((elemento) => (
              <Grid item xs={12} md={6} lg={6} key={elemento.id}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      component="img"
                      alt="imagen"
                      height="140"
                      image={elemento.url}
                      title="Titulo imagen"
                    />
                    <CardContent>
                      <Typography variant="body2" color="primary" component="p">
                        {elemento.descripcion}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      disabled={
                        !usuario.permissions.find(
                          (permiso) => permiso.name === "editar aviso"
                        )
                      }
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        seleccionarAviso(elemento, "Editar");
                        abrirCerrarModalEditar();
                      }}
                    >
                      Editar
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      disabled={
                        !usuario.permissions.find(
                          (permiso) => permiso.name === "eliminar aviso"
                        )
                      }
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        seleccionarAviso(elemento, "Eliminar");
                        abrirCerrarModalEliminar();
                      }}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Modal
          ref={ref}
          open={modalInsertar}
          onClose={abrirCerrarModalInsertar}
        >
          <ModalFormularioAviso
            handleModal={abrirCerrarModalInsertar}
            getAvisos={getAvisos}
            actionType="insertar"
          />
        </Modal>
        <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
          <ModalFormularioAviso
            handleModal={abrirCerrarModalEditar}
            getAvisos={getAvisos}
            actionType="actualizar"
            aviso_id={avisoSelected.id}
            aviso_descripcion={avisoSelected.descripcion}
          />
        </Modal>

        <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
      </main>
    </div>
  );
}

export default Aviso;
