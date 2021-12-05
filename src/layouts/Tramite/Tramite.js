import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormTramite from "./FormTramite";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import api from "../../config/axios";
import Typography from "@material-ui/core/Typography";
const columns = [
  { id: "id", label: "Tramite", align: "center", minWidth: 170 },
  {
    id: "nombre",
    label: "Acciones",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
];

/*function createData(id, users, actions) {
    return { id, users, actions };
}*/

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "75%",
  },
}));

export default function StickyHeadTable({ usuario }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = React.useState("");
  //const [unidades, setTramite] = useState();
  const [tramite, setTramite] = useState({
    id: 0,
    nombre: "",
    documentos: [],
    requisitos: [],
    pasos: [],
  });
  const [rows, setRows] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getTramite = async () => {
    try {
      const resp = await api.get("/tramite");
      setRows(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useEffect(() => {
    getTramite();
  }, []);

  //console.log(rows)
  return (
    <div>
      <Box pt={1} pb={1}>
        <Button
          disabled={
            !usuario.permissions.find(
              (permiso) => permiso.name === "crear tramite"
            )
          }
          variant="outlined"
          color="primary"
          onClick={() => {
            handleOpen();
            setFormType("new");
            setTramite({
              id: 0,
              nombre: "",
              documentos: [],
              requisitos: [],
              pasos: [],
            });
          }}
          style={{ display: "block", marginLeft: "auto" }}
        >
          <AddIcon /> Crear nuevo tramite
        </Button>
      </Box>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((element, index) => (
                <TableRow key={index}>
                  <TableCell  align="center">
                    {element.nombre}
                  </TableCell>
                  <TableCell align="center">
                    <Box pr={1} pl={1}>
                      <Button
                        disabled={
                          !usuario.permissions.find(
                            (permiso) => permiso.name === "editar tramite"
                          )
                        }
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          handleOpen();
                          setFormType("edit");
                          setTramite(element);
                        }}
                      >
                        <EditIcon />
                      </Button>{" "}
                      <Button
                        disabled={
                          !usuario.permissions.find(
                            (permiso) => permiso.name === "eliminar tramite"
                          )
                        }
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          handleOpen();
                          setFormType("delete");
                          setTramite(element);
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h1 id="transition-modal-title">
                {formType === "new" ? (
                  <Typography variant="h4">Crear tramite</Typography>
                ) : formType === "edit" ? (
                  <Typography variant="h4">Editar tramite</Typography>
                ) : (
                  <Typography variant="h4">Eliminar tramite</Typography>
                )}
              </h1>
              <FormTramite
                tramiteId={tramite.id}
                formType={formType}
                rows={rows}
                setRows={setRows}
                handleClose={handleClose}
              ></FormTramite>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  );
}
