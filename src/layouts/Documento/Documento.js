import React, { useEffect, useState, forwardRef } from "react";
import api from "../../config/axios";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, TablePagination } from "@material-ui/core";
import { Add, DeleteForever } from "@material-ui/icons";
import ArchiveIcon from "@material-ui/icons/Archive";
import MaterialTable, { MTableBodyRow } from "material-table";
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
import ModalSubirDocumento from "./ModalSubirDocumento";

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
  main: {
    textAlign: "right",
  },
}));

function Documento({ usuario }) {
  const columnas = [
    {
      title: "Nombre",
      field: "nombre",
    },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const [hoveringOver, setHoveringOver] = useState("");
  const handleRowHover = (event, propsData) => setHoveringOver(propsData.index);
  const handleRowHoverLeave = (event, propsData) => setHoveringOver("");

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
  //Acciones para mostrar los Modales
  const abrirCerrarModalInsertar = () => {
    setDocumentSelected({
      nombre: "",
      url: "",
    });
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
    switch (caso) {
      case "Editar":
        abrirCerrarModalEditar();
        break;
      case "Eliminar":
        abrirCerrarModalEliminar();
        break;
      case "Descargar":
        window.open(documento.url, "_blank");
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getDocumentos();
  }, []);

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
      await api.delete("/documento/" + documentSelected.id).then((response) => {
        setDocumentos(
          documentos.filter((documento) => documento.id !== documentSelected.id)
        );
        abrirCerrarModalEliminar();
      });
    } catch (error) {
      setRequestError(error.response.data.message);
    }
  };

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

  return (
    <div className={styles.main}>
      <br />
      <Button
        disabled={
          !usuario.permissions.find(
            (permiso) => permiso.name === "crear documento"
          )
        }
        variant="outlined"
        color="primary"
        onClick={() => {
          abrirCerrarModalInsertar();
          setRequestError(null);
        }}
      >
        <Add />
        &nbsp; Agregar un Documento
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
            disabled: !usuario.permissions.find(
              (permiso) => permiso.name === "editar documento"
            ),
            icon: (props) => (
              <Button variant="outlined" color="primary">
                <EditIcon />
              </Button>
            ),
            tooltip: "Modificar Información del Documento",
            onClick: (event, rowData) => {
              seleccionarDocumento(rowData, "Editar");
              setRequestError(null);
            },
          },
          {
            icon: (props) => (
              <Button variant="outlined" color="primary">
                <ArchiveIcon />
              </Button>
            ),
            tooltip: "Descargar Documento",
            onClick: (event, rowData) => {
              seleccionarDocumento(rowData, "Descargar");
              setRequestError(null);
            },
          },
          {
            disabled: !usuario.permissions.find(
              (permiso) => permiso.name === "eliminar documento"
            ),
            icon: (props) => (
              <Button variant="outlined" color="secondary">
                <DeleteForever />
              </Button>
            ),
            tooltip: "Elimnar Documento",
            onClick: (event, rowData) => {
              seleccionarDocumento(rowData, "Eliminar");
              setRequestError(null);
            },
          },
        ]}
        onRowClick={(evt, selectedRow) =>
          setSelectedRow(selectedRow.tableData.id)
        }
        options={{
          tableLayout: "auto",
          pageSize: 10,
          pageSizeOptions: [10, 20, 30],
          actionsColumnIndex: -1,
          rowStyle: (rowData) => ({
            backgroundColor:
              rowData.tableData.id === hoveringOver ? "##f5f5f5" : "",
            fontWeight:
              selectedRow === rowData.tableData.id ? "bold" : "normal",
            color: selectedRow === rowData.tableData.id ? "#000" : "#000",
          }),
          Pagination: (props) => (
            <TablePagination
              {...props}
              rowsPerPage={this.state.numberRowPerPage}
              count={this.state.totalRow}
              page={this.state.pageNumber}
              onChangePage={(e, page) => this.handleChangePage(page + 1)}
              onChangeRowsPerPage={(event) => {
                props.onChangeRowsPerPage(event);
                this.handleChangeRowPerPage(event.target.value);
              }}
            />
          ),
        }}
        components={{
          Row: (props) => {
            return (
              <MTableBodyRow
                {...props}
                onMouseEnter={(e) => handleRowHover(e, props)}
                onMouseLeave={(e) => handleRowHoverLeave(e, props)}
              />
            );
          },
        }}
        localization={{
          header: {
            actions: "Opciones",
          },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        <div>
          <ModalSubirDocumento
            handleModal={abrirCerrarModalInsertar}
            getDocumentos={getDocumentos}
            actionType="insertar"
          />
        </div>
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        <div>
          <ModalSubirDocumento
            handleModal={abrirCerrarModalEditar}
            getDocumentos={getDocumentos}
            actionType="actualizar"
            documento_id={documentSelected.id}
            documento_type={documentSelected.type}
          />
        </div>
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default Documento;
