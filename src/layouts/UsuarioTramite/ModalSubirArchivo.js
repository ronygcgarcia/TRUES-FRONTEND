import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import React, {useState, useCallback } from "react";
import estiloDrop from "../Documento/Dropzone.css";
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

const ModalSubirArchivo = ({handleModalUpload}) => {
  const classes = useStyles();
  const [archivo, setArchivo] = useState([]);
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
    let url = process.env.REACT_APP_BACKEND_URL+"/documento";
    console.log(archivo);
    // archivo.forEach(async (acceptedFile) => {
    //   const formData = new FormData();
    //   formData.append("documento", acceptedFile);
    //   try {
    //     axios({
    //       method: "post",
    //       url: url,
    //       data: formData,
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: `Bearer ${getAccessToken()}`,
    //       },
    //     })
    //       .then(function (response) {
    //         console.log(response);
    //         handleModalUpload();
    //       })
    //       .catch(function (response) {console.log(response);});
    //   } catch (error) {}
    // });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setArchivo(acceptedFiles);
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
      "text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet",
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
      {archivo[0] && !isDragActive ? (
        <div>
          <Alert severity="info">{archivo[0].name}</Alert>
        </div>
      ) : null}
      <br />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleModalUpload()}
      >
        Cancelar
      </Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        disabled={!archivo[0]}
        variant="contained"
        color="primary"
        onClick={() => upload()}
      >
        Aceptar
      </Button>
    </div>
  );
};

export default ModalSubirArchivo;
