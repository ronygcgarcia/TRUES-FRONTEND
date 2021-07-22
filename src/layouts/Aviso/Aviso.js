import { Button, TextField, Typography, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import api from "../../config/axios";
import Box from "@material-ui/core/Box";
import { Add } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";

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
  estiloDrop: {
    height: "7rem",
    margin: "2rem",
    padding: "1rem",
    border: "2px dashed black",
    display: "flex",
    cursor: "pointer",
  },
  dropzone: {
    position: "absolute",
    width: "60%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  inputMaterial: {
    width: "100%",
  },
  thumb: {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  },
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  img: {
    display: "block",
    width: "auto",
    height: "100%",
  },
  typo: {
    alignContent: "center",
  },
  box: {
    display: "flex",
    padding: 20,
  },
}));

function Aviso() {
  const [files, setFiles] = useState([]);
  const classes = useStyles();
  const [avisos, setAvisos] = useState([]);
  const getAccessToken = () => localStorage.getItem("token");
  const [imagen, setImagen] = useState([]);
  const [archivosAceptados, setArchivosAceptados] = useState([]);
  const [descripcion, setDescripcion] = useState({
    descripcion: "",
  });
  const [avisoSelected, setAvisoSelected] = useState({
    descripcion: "",
    url: "",
  });

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/png, image/jpeg, image/jpg",
    multiple: false,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setArchivosAceptados(acceptedFiles);
      setFiles(
        archivosAceptados.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setImagen(acceptedFiles);
    },
  });

  const getAvisos = async () => {
    try {
      const resp = await api.get("/aviso");
      setAvisos(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDescripcion = (e) => {
    setDescripcion({
      descripcion: e.target.value,
    });
  };

  useEffect(() => {
    getAvisos();
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
    descripcion.descripcion = "";
    setFiles([]);
    setImagen([]);
    setArchivosAceptados([]);
  };

  const guardarAviso = () => {
    let url = "https://trues-backend.herokuapp.com/api/aviso";
    if (descripcion.descripcion !== "" && imagen !== undefined) {
      imagen.forEach(async (acceptedFile) => {
        const formData = new FormData();
        formData.append("descripcion", descripcion.descripcion);
        formData.append("imagen", acceptedFile);

        try {
          axios({
            method: "post",
            url: url,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
            .then(function (response) {
              getAvisos();
              setModalInsertar(false);
              setAvisoSelected([]);
              setDescripcion([]);
              setFiles([]);
              setImagen([]);
              files.forEach((file) => URL.revokeObjectURL(file.preview));
            })
            .catch(function (error) {});
        } catch (error) {}
      });
    }
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    setArchivosAceptados([]);
  };

  const editarAviso = () => {
    let url = "https://trues-backend.herokuapp.com/api/aviso/";
    if (avisoSelected.descripcion !== "") {
      imagen.forEach(async (acceptedFile) => {
        const formData = new FormData();
        formData.append("descripcion", descripcion.descripcion);
        formData.append("imagen", acceptedFile);

        try {
          axios({
            method: "put",
            url: url.concat(avisoSelected.id),
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
            .then(function (response) {
              getAvisos();
              setModalEditar(false);
              setAvisoSelected([]);
              setDescripcion([]);
              setFiles([]);
              setImagen([]);
              files.forEach((file) => URL.revokeObjectURL(file.preview));
            })
            .catch(function (error) {});
        } catch (error) {}
      });
    }
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

  const bodyInsertar = (
    <div className={classes.dropzone}>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className="dropzone">
          <input
            {...getInputProps()}
            className={`${classes.estiloDrop} ${
              isDragReject ? classes.estiloDrop : null
            }`}
          />
          {isDragActive ? (
            <div></div>
          ) : (
            <p>
              CLICK para buscar el archivo o ARRASTRELO a esta area y se subirá
            </p>
          )}

          {isDragReject ? (
            <div>
              <Alert severity="warning">
                Este tipo de archivo no está permitido o está arrastrando más de
                los permitidos
              </Alert>
            </div>
          ) : null}
          {isDragAccept ? (
            <div>
              <Alert>Puede soltar el archivo ahora</Alert>
            </div>
          ) : null}
        </div>
        <Box className={classes.thumbsContainer} alignItems="center">
          {archivosAceptados.map((file, index) => (
            <Alert key={index}>
              {file.path} - {file.size} bytes
            </Alert>
          ))}
        </Box>
        <br />
        <TextField
          multiline={true}
          className={classes.inputMaterial}
          required
          value={descripcion.descripcion}
          name="descripcion"
          label="Descripcion"
          onChange={handleDescripcion}
          variant="outlined"
        />
        <br />
        <br />
        <FormControl>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => guardarAviso()}
              type="submit"
            >
              Guardar
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
        </FormControl>
      </form>
    </div>
  );

  const bodyEditar = (
    <div className={classes.dropzone}>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className="dropzone">
          <input
            {...getInputProps()}
            className={`${classes.estiloDrop} ${
              isDragReject ? classes.estiloDrop : null
            }`}
          />
          {isDragActive ? (
            <div></div>
          ) : (
            <p>
              CLICK para buscar el archivo o ARRASTRELO a esta area y se subirá
            </p>
          )}
          {isDragReject ? (
            <div>
              <Alert severity="warning">
                Este tipo de archivo no está permitido o está arrastrando más de
                los permitidos
              </Alert>
            </div>
          ) : null}
          {isDragAccept ? (
            <div>
              <Alert>Puede soltar el archivo ahora</Alert>
            </div>
          ) : null}
        </div>
        <Box className={classes.thumbsContainer} alignItems="center">
          {archivosAceptados.map((file, index) => (
            <Alert key={index}>
              {file.path} - {file.size} bytes
            </Alert>
          ))}
        </Box>
        <br />
        <TextField
          multiline={true}
          className={classes.inputMaterial}
          required
          value={avisoSelected.descripcion}
          name="descripcion"
          label="Descripcion"
          onChange={(e) =>
            setAvisoSelected({
              ...avisoSelected,
              descripcion: e.target.value,
            })
          }
          variant="outlined"
        />
        <br />
        <br />
        <FormControl>
          <div align="right">
            <Button
              variant="contained"
              color="primary"
              onClick={() => editarAviso()}
              type="submit"
            >
              Guardar
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
        </FormControl>
      </form>
    </div>
  );

  const bodyEliminar = (
    <div className={classes.modal}>
      <p>
        Estás seguro que deseas eliminar este aviso? {avisoSelected.descripcion}{" "}
      </p>
      <br />
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

        <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>
        <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
      </main>
    </div>
  );
}

export default Aviso;
