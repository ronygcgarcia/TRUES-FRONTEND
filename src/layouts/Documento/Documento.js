import React, { useEffect, useState, forwardRef, useCallback } from "react";
import api from "../../config/axios";
import Alert from "@material-ui/lab/Alert";
import estiloDrop from "./Dropzone.css";

//---------------------------------------------------------------Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

//------------------------------------------------------------Material Table
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import axios from "axios";

import { useDropzone } from "react-dropzone";

//------------------------------------------------Iconos que usa material-table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

//----------------------------------------------------Estilos para los Modales
const useStyles = makeStyles((theme) => ({
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
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
  dropzone: {
    position: "absolute",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function Documento() {
  const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
    {
      title: "URL",
      field: "url",
    },
  ];

  const [documentos, setDocumentos] = useState([]);
  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);
  const getAccessToken = () => localStorage.getItem("token");

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Estado para el usuario al cual hacer acciones
  const [documentSelected, setDocumentSelected] = useState({
    nombre: "",
    url: "",
  });
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

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarDocumento = (documento, caso) => {
    setDocumentSelected(documento);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };
  useEffect(() => {
    getDocumentos();
  }, []);

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setRequestError(null);
  };

  //-----------------------------------------------------
  const getDocumentos = async () => {
    try {
      const resp = await api.get("/documento");
      setDocumentos(resp.data);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteDocumento = async () => {
    try {
      const resp = await api
        .delete("/documento/" + documentSelected.id)
        .then((response) => {
          setDocumentos(
            documentos.filter(
              (documento) => documento.id !== documentSelected.id
            )
          );
          abrirCerrarModalEliminar();
        });
    } catch (error) {
      setRequestError(error.response.data.message);
    }
  };
  //----------------------------------------------------------

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    let url = "https://trues-backend.herokuapp.com/api/documento";
    const formData = new FormData();
    formData.append("documento", acceptedFiles[0]);
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
          console.log("funciona ->" + response);
          setDocumentos(documentos.concat(response.data));
          setModalInsertar(false);
        })
        .catch(function (response) {
          console.log("No Funciona ->" + response);
        });
    } catch (error) {
      console.log("Error axios" + error);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.oasis.opendocument.text",
    multiple: false,
  });

  const bodyInsertar = (
    <div className={styles.dropzone}>
      <div {...getRootProps()} className="dropzone">
        <input
          {...getInputProps()}
          className={`${estiloDrop.dropzone} ${
            isDragActive ? estiloDrop.active : null
          }`}
        />
        <p>
          Haga CLICK para buscar el archivo o simplemente ARRASTRELO a esta area
          y se subirá
        </p>
      </div>
      <br />
      
          <Button
            variant="contained"
            color="secondary"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </Button>
    </div>
  );

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar a {documentSelected.nombre} ? </p>
      <br />
      <br />
      <div align="right">
        {requestError != null ? (
          <div className="alert danger-alert">
            <Alert severity="error">Ha ocurrido un error: {requestError}</Alert>
          </div>
        ) : (
          ""
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteDocumento()}
        >
          Sí
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={() => abrirCerrarModalEliminar()}
        >
          No
        </Button>
      </div>
    </div>
  );

  ///////////////////////////////RETURN////////////////////////////////
  return (
    <div>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => (abrirCerrarModalInsertar(), setRequestError(null))}
      >
        Agregar un Documento
      </Button>

      <br />
      <br />
      <MaterialTable
        icons={tableIcons}
        title="Documentos"
        columns={columnas}
        data={documentos}
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Información del Documento",
            onClick: (event, rowData) => (
              seleccionarDocumento(rowData, "Editar"), setRequestError(null)
            ),
          },
          {
            icon: Delete,
            tooltip: "Elimnar Documento",
            onClick: (event, rowData) => (
              seleccionarDocumento(rowData, "Eliminar"), setRequestError(null)
            ),
          },
        ]}
        options={{ actionsColumnIndex: -1 }}
        localization={{
          header: {
            actions: "Opciones",
          },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default Documento;
