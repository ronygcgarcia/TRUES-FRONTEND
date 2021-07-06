import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import Alert from "@material-ui/lab/Alert";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

//---------------------------------------------------------------Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { DropzoneDialog } from "material-ui-dropzone";

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
}));

function Documento() {
  /*const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
    {
      title: "URL",
      field: "url",
    },
  ];*/
  const theme = createMuiTheme({
    overrides: {
      MuiDropzoneSnackbar: {
        errorAlert: {
          backgroundColor: "#AFA",
          color: "#000",

        },
        successAlert: {
          backgroundColor: "#FAA",
          color: "#000",
          successAlert:"Excelente",
          text: "Hola"
        },
      }
    }
  });

  const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
  ];

  const [documentos, setDocumentos] = useState([]);
  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Estado para el usuario al cual hacer acciones
  const [documentSelected, setDocumentSelected] = useState({
    nombre: "",
    url: "",
  });

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setRequestError(null);
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

  const [personal, setPersonal] = useState([]);
  const getPersonal = async () => {
    try {
      const resp = await api.get("/personal");
      setPersonal(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [open, setOpen] = React.useState(false);

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarDocumento = (documento, caso) => {
    setDocumentSelected(documento);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };
  useEffect(() => {
    getPersonal();
  }, []);

  

  return (
    <div>
      <br />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Agregar un Documento
      </Button>
      <MuiThemeProvider theme={theme}>
      <DropzoneDialog
        filesLimit={1}
        dropzoneText="Arrastra y suelta el archivo aquí"
        acceptedFiles={["application/pdf"]}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={open}
        onClose={() => setOpen(false)}
        onSave={(files) => {
          console.log("Files:", files);
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
      </MuiThemeProvider>
      <br />
      <br />
      <MaterialTable
        icons={tableIcons}
        title="Personal del sistema"
        columns={columnas}
        data={personal}
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Información del Personal",
          },
          {
            icon: Delete,
            tooltip: "Elimnar Personal",
          },
        ]}
        options={{ actionsColumnIndex: -1 }}
        localization={{
          header: {
            actions: "Opciones",
          },
        }}
      />

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}></Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}></Modal>
    </div>
  );
}

export default Documento;
