import React, { useState, useCallback } from "react";
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import estiloDrop from "./Dropzone.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
}));

const ModalSubirDocumento = ({
  handleModal,
  getDocumentos,
  actionType,
  documento_id,
  documento_type,
}) => {
  const classes = useStyles();
  const [archivos, setArchivos] = useState([]);
  const getAccessToken = () => localStorage.getItem("token");
  const [switchState, setSwitchState] = useState({
    switchmultiple: false,
  });
  const handleSwitch = (event) => {
    setSwitchState({
      switchmultiple: event.target.checked,
    });
  };

  const upload = () => {
    let url = process.env.REACT_APP_BACKEND_URL + "/documento";
    archivos.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("documento", acceptedFile);
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
            getDocumentos();
          })
          .catch(function (response) {
            console.log(response);
          });
      } catch (error) {}
    });
  };

  const update = () => {
    let url = process.env.REACT_APP_BACKEND_URL + "/documento/" + documento_id;
    archivos.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("documento", acceptedFile);
      formData.append("_method", "PUT");
      try {
        axios({
          method: "post",
          url: url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAccessToken()}`,
            _method: "post"
          },
        })
          .then(function (response) {
            handleModal();
            getDocumentos();
          })
          .catch(function (response) {
            console.log(response.response.data);
          });
      } catch (error) {}
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setArchivos(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept:
      "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.oasis.opendocument.text",
    multiple: switchState.switchmultiple,
  });

  return (
    <div className={classes.modal}>
      <div {...getRootProps()} className="dropzone">
        <input
          {...getInputProps()}
          className={`${estiloDrop.dropzone} ${
            isDragReject ? estiloDrop.active : null
          }`}
        />
        <p>CLICK para buscar el archivo o ARRASTRELO a esta area y se subirá</p>
      </div>
      {actionType === "insertar" ? (
        <FormControlLabel
          control={
            <Switch
              onChange={handleSwitch}
              name="switchmultiple"
              color="primary"
            />
          }
          label="Activar para subir varios archivos"
        />
      ) : null}
      <br />
      {isDragReject ? (
        <div>
          <Alert severity="warning">
            Este tipo de archivo no está permitido o está arrastrando más de los
            permitidos
          </Alert>
        </div>
      ) : null}
      {isDragAccept ? (
        <div>
          <Alert>Puede soltar el archivo ahora</Alert>
        </div>
      ) : null}
      <br />
      {archivos.length && !isDragActive ? (
        <div>
          {archivos.map((archivo, index) => (
            <Alert key={index} severity="info">
              {archivo.name}
            </Alert>
          ))}
        </div>
      ) : null}
      <br />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleModal()}
      >
        Cancelar
      </Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        disabled={!archivos[0]}
        variant="contained"
        color="primary"
        onClick={actionType === "insertar" ? () => upload() : () => update()}
      >
        Aceptar
      </Button>
    </div>
  );
};

export default ModalSubirDocumento;
