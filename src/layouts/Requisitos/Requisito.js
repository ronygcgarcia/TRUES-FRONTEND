import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";

//---------------------------------------------------------------Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
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

function Requisito() {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  //-----------------------------------Definicion de columnas para material-table
  const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
    {
      title: "Descripcion",
      field: "descripcion",
    },
  ];

  const [requisitos, setRequisitos] = useState([]);
  const styles = useStyles();
  const [requestError, setRequestError] = useState(null);

  //Estados para los modales para las acciones de los usuarios
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //Estado para el usuario al cual hacer acciones
  const [requisitoSelected, setRequisitoSelected] = useState({
    nombre: "",
    descripcion: "",
  });

  //Obtener los que el usuarion escribe en los textfield
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequisitoSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(requisitoSelected);
    setRequestError(null);
  };

  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    requisitoSelected.nombre = "";
    requisitoSelected.descripcion = "";
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  //Peticiones para obtener los usuarios
  const getRequisitos = async () => {
    try {
      const resp = await api.get("/requisito");
      setRequisitos(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };
  const createRequisito = async () => {
    if (
      requisitoSelected.nombre !== "" &&
      requisitoSelected.descripcion !== ""
    ) {
      try {
        const resp = await api
          .post("/requisito", requisitoSelected)
          .then((response) => {
            setRequisitos(requisitos.concat(response.data));

            abrirCerrarModalInsertar();
          });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };
  const updateRequisito = async () => {
    if (
      requisitoSelected.nombre !== "" &&
      requisitoSelected.descripcion !== ""
    ) {
      try {
        const resp = await api
          .put("/requisito/" + requisitoSelected.id, requisitoSelected)
          .then((response) => {
            var newRequisitos = requisitos;
            newRequisitos.map((requisito) => {
              if (requisitoSelected.id === requisito.id) {
                requisito.nombre = requisitoSelected.nombre;
                requisito.descripcion = requisitoSelected.descripcion;
              }
            });
            setRequisitos(newRequisitos);
            abrirCerrarModalEditar();
          });
      } catch (error) {
        setRequestError(error.response.data.message);
      }
    }
  };
  const deleteRequisito = async () => {
    try {
      const resp = await api
        .delete("/requisito/" + requisitoSelected.id)
        .then((response) => {
          setRequisitos(
            requisitos.filter(
              (requisito) => requisito.id !== requisitoSelected.id
            )
          );
          abrirCerrarModalEliminar();
        });
    } catch (error) {
      setRequestError(error.response.data.message);
    }
  };

  //Seleccionar el usuario de la tabla al cual realizar acciones
  const seleccionarRequisito = (requisito, caso) => {
    setRequisitoSelected(requisito);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };
  useEffect(() => {
    getRequisitos();
  }, []);

  const bodyInsertar = (
    <div>
      <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Agregar Nuevo Requisito</Typography>
        <br />
        <br />
        <TextField
          required
          name="nombre"
          className={styles.inputMaterial}
          label="Nombre del Requisito"
          onChange={handleChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          name="descripcion"
          className={styles.inputMaterial}
          label="Descripcion de Requisito"
          onChange={handleChange}
          variant="outlined"
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
            onClick={() => createRequisito()}
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
        <Typography variant="h4">Editar Rqeuisito</Typography>
        <h3>Editar Requisito</h3>
        <br />
        <br />
        <TextField
          required
          name="nombre"
          className={styles.inputMaterial}
          label="Nombre"
          onChange={handleChange}
          value={requisitoSelected && requisitoSelected.nombre}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          name="descripcion"
          className={styles.inputMaterial}
          label="Descipcion del Requisito"
          onChange={handleChange}
          value={requisitoSelected && requisitoSelected.descripcion}
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
            onClick={() => updateRequisito()}
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
      <p>Estás seguro que deseas eliminar {requisitoSelected.nombre} ? </p>
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
          onClick={() => deleteRequisito()}
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
    <div>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => (abrirCerrarModalInsertar(), setRequestError(null))}
      >
        Crear Nuevo Requisito
      </Button>
      <br />
      <br />
      <MaterialTable
        icons={tableIcons}
        title="Requisitos de Tramites"
        columns={columnas}
        data={requisitos}
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Información del Requisito",
            onClick: (event, rowData) => (
              seleccionarRequisito(rowData, "Editar"), setRequestError(null)
            ),
          },
          {
            icon: Delete,
            tooltip: "Elimnar Requisito",
            onClick: (event, rowData) => (
              seleccionarRequisito(rowData, "Eliminar"), setRequestError(null)
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
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default Requisito;
