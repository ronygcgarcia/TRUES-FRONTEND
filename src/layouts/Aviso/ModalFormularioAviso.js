import React, { useState, useCallback, useEffect } from "react";
import { Button, FormControl, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
    width: "70%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  formulario: {
    height: "100%",
  },
  inputMaterial: {
    width: "100%",
  },
  imageInfo: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    maxHeight: 400,
    maxWidth: 400,
    overflow: "hidden",
    margin: "0 auto",
  },
  img: {
    display: "block",
    width: "auto",
    height: "auto",
  },
}));

const ModalFormularioAviso = ({
  handleModal,
  getAvisos,
  actionType,
  aviso_id,
  aviso_descripcion,
}) => {
  const classes = useStyles();
  const [aviso, setAvisos] = useState([]);
  const getAccessToken = () => localStorage.getItem("token");
  const [descripcion, setDescripcion] = useState("");

  const handleDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  const upload = () => {
    let url = process.env.REACT_APP_BACKEND_URL + "/aviso";
    aviso.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("descripcion", descripcion);
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
            handleModal();
            getAvisos();
          })
          .catch(function (response) {
            console.log(response);
          });
      } catch (error) {}
    });
  };

  const update = () => {
    let url = process.env.REACT_APP_BACKEND_URL + "/aviso/" + aviso_id;
    aviso.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("imagen", acceptedFile);
      formData.append("descripcion", descripcion);
      formData.append("_method", "PUT");
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
            handleModal();
            getAvisos();
          })
          .catch(function (response) {
            console.log(response.response.data);
          });
      } catch (error) {}
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setAvisos(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    aviso.forEach((file) => URL.revokeObjectURL(file.preview));
    setDescripcion(aviso_descripcion);
  }, [aviso, aviso_descripcion]);

  return (
    <div className={classes.dropzone}>
      <form className={classes.formulario} onSubmit={handleSubmit}>
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
              CLICK  o ARRASTRELO a esta area y se subirá
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
        {aviso.map((file, index) => (
          <div key={index} className={classes.imageInfo}>
            <div className={classes.thumbInner}>
              <img src={file.preview} className={classes.img} alt={file.name} />
            </div>
            <Alert className={classes.inputMaterial} severity="info">
              {file.name} - {file.size} bytes
            </Alert>
          </div>
        ))}
        <br />
        <TextField
          multiline={true}
          className={classes.inputMaterial}
          required
          value={descripcion}
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
              onClick={
                actionType === "insertar" ? () => upload() : () => update()
              }
              type="submit"
            >
              Guardar
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleModal()}
            >
              Cancelar
            </Button>
          </div>
        </FormControl>
      </form>
    </div>
  );
};

export default ModalFormularioAviso;
