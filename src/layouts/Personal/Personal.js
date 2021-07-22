import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";

//---------------------------------------------------------------Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Add, DeleteForever } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

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
import EditIcon from "@material-ui/icons/Edit";

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
  main: {
    textAlign: "right",
  },
  modal: {
    position: "absolute",
    width: "auto",
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

function Personal() {
  const { handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  //-----------------------------------Definicion de columnas para material-table
  const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
  ];

  const [personal, setPersonal] = useState([]);
  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);
  const [validacionNombre, setValidacionNombre] = useState({
    mensajeError: "",
  });

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Estado para el usuario al cual hacer acciones
  const [personalSelected, setPersonalSelected] = useState({
    nombre: "",
  });

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    setValidacionNombre({
      mensajeError: "",
    });
    const { name, value } = e.target;
    setPersonalSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    let regName = new RegExp(/^[A-zÀ-ú.\s]{0,49}$/).test(value);
    if (!regName) {
      setValidacionNombre({
        mensajeError:
          "El nombre no debe contener números ni carácteres especiales. Maximo: 50 carácteres",
      });
    }
    setRequestError(null);
  };

  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    personalSelected.nombre = "";
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  //Peticiones para obtener los usuarios
  const getPersonal = async () => {
    try {
      const resp = await api.get("/personal");
      setPersonal(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createPersonal = async () => {
    if (personalSelected.nombre !== "") {
      try {
        await api.post("/personal", personalSelected).then((response) => {
          setPersonal(personal.concat(response.data));

          abrirCerrarModalInsertar();
        });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };

  const updatePersona = async () => {
    if (personalSelected.nombre !== "") {
      try {
        await api
          .put("/personal/" + personalSelected.id, personalSelected)
          .then((response) => {
            getPersonal();
            abrirCerrarModalEditar();
          });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };

  const deletePersona = async () => {
    try {
      await api.delete("/personal/" + personalSelected.id).then((response) => {
        setPersonal(
          personal.filter((persona) => persona.id !== personalSelected.id)
        );
        abrirCerrarModalEliminar();
      });
    } catch (error) {
      setRequestError(error.response.data.message);
    }
  };

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarPersona = (persona, caso) => {
    setPersonalSelected(persona);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    getPersonal();
  }, []);

  const bodyInsertar = (
    <div>
      <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Agregar Nuevo Personal</Typography>
        <br />
        <br />
        <TextField
          required
          name="nombre"
          className={styles.inputMaterial}
          label="Nombre del Personal"
          onChange={handleChange}
          variant="outlined"
          error={Boolean(validacionNombre?.mensajeError)}
          helperText={validacionNombre?.mensajeError}
        />
        <br />
        <br />
        <div align="right">
          {requestError != null ? (
            <div className="alert danger-alert">
              <Alert severity="error">
                Ha ocurrido un error: {requestError}
              </Alert>
            </div>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => createPersonal()}
            type="submit"
          >
            Insertar
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
      </form>
    </div>
  );

  const bodyEditar = (
    <div>
      <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Editar Personal</Typography>
        <h3>Editar Personal</h3>
        <br />
        <br />
        <TextField
          required
          name="nombre"
          className={styles.inputMaterial}
          label="Nombre"
          onChange={handleChange}
          value={personalSelected && personalSelected.nombre}
          variant="outlined"
        />
        <br />
        <br />
        <br />
        {requestError != null ? (
          <div className="alert danger-alert">
            <Alert severity="error">Ha ocurrido un error: {requestError}</Alert>
          </div>
        ) : (
          ""
        )}
        <div align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updatePersona()}
            type="submit"
          >
            Editar
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
      </form>
    </div>
  );
  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar a {personalSelected.nombre} ? </p>
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
          onClick={() => deletePersona()}
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

  return (
    <div className={styles.main}>
      <br />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          abrirCerrarModalInsertar();
          setRequestError(null);
        }}
      >
        <Add />
        &nbsp; Crear Nuevo Personal
      </Button>
      <br />
      <br />
      <MaterialTable
        icons={tableIcons}
        title="Personal del sistema"
        columns={columnas}
        data={personal}
        actions={[
          {
            icon: (props) => (
              <Button variant="outlined" color="primary">
                <EditIcon />
              </Button>
            ),
            tooltip: "Modificar Información del Personal",
            onClick: (event, rowData) => {
              seleccionarPersona(rowData, "Editar");
              setRequestError(null);
            },
          },
          {
            icon: (props) => (
              <Button variant="outlined" color="secondary">
                <DeleteForever />
              </Button>
            ),
            tooltip: "Elimnar Personal",
            onClick: (event, rowData) => {
              seleccionarPersona(rowData, "Eliminar");
              setRequestError(null);
            },
          },
        ]}
        options={{
          tableLayout: "auto",
          pageSize: 10,
          pageSizeOptions: [10, 20, 30],
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "Opciones",
          },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default Personal;
