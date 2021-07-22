import { Button, FormGroup, TextField, Typography } from "@material-ui/core";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
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
}));

function UsuarioTramite() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6">
                Gestror de Tramite por Estudiante
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <FormGroup>
              <Paper className={fixedHeightPaper}>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Ingrese el Carnet del Estudiante
                </Typography>
                <br />
                <TextField variant="outlined" />
                <br />
                <FormControl>
                  <Button variant="outlined" color="primary">
                    Buscar
                  </Button>
                </FormControl>
              </Paper>
            </FormGroup>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper className={fixedHeightPaper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Tramites del estudiante
              </Typography>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Pasos del tramite actual
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default UsuarioTramite;
