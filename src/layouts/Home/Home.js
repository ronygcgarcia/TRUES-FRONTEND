import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import documentIcon from "../../assets/1.png";
import tramiteIcon from "../../assets/2.png";
import requisitoIcon from "../../assets/3.png";
import ubicacionIcon from "../../assets/4.png";
import notificationIcon from "../../assets/notification.png"
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    height: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: "100%",
    paddingTop: "56.25%",
    backgroundSize: "contain",
  },
}));

const Home = ({ usuario }) => {
  const classes = useStyles();

  //tramite, requitos, documentos, ubicacion,
  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={3}>
          {usuario.permissions.map((elemento, index) =>
            elemento.name === "ver documento" ? (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card className={classes.card}>
                  <Link to="/documentos">
                    <CardMedia
                      className={classes.media}
                      image={documentIcon}
                      title="documentos"
                    />
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      ></Typography>
                      <Typography variant="h5" component="h2">
                        Ver Documentos
                      </Typography>
                      <Typography variant="body2" component="p">
                        Administracion de Documentos para Tramites
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ) : null
          )}
          {usuario.permissions.map((elemento, index) =>
            elemento.name === "ver tramite" ? (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card className={classes.card}>
                  <Link to="/tramite">
                    <CardMedia
                      className={classes.media}
                      image={tramiteIcon}
                      title="tramites"
                    />
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      ></Typography>
                      <Typography variant="h5" component="h2">
                        Ver Tramites
                      </Typography>
                      <Typography variant="body2" component="p">
                        Administracion de Tramites
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ) : null
          )}
          {usuario.permissions.map((elemento, index) =>
            elemento.name === "ver requisito" ? (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card className={classes.root}>
                  <Link to="/requisito">
                    <CardMedia
                      className={classes.media}
                      image={requisitoIcon}
                      title="requisitos"
                    />
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      ></Typography>
                      <Typography variant="h5" component="h2">
                        Ver Requisitos
                      </Typography>
                      <Typography variant="body2" component="p">
                        Administracion de Requisitos para Tramites
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ) : null
          )}
          {usuario.permissions.map((elemento, index) =>
            elemento.name === "ver ubicacion" ? (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card className={classes.root}>
                  <Link to="/ubicacion">
                    <CardMedia
                      className={classes.media}
                      image={ubicacionIcon}
                      title="Ubicacion"
                    />
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      ></Typography>
                      <Typography variant="h5" component="h2">
                        Ver Ubicaciones
                      </Typography>
                      <Typography variant="body2" component="p">
                        Administracion de Ubicacion para Tramites
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ) : null
          )}
          {usuario.permissions.map((elemento, index) =>
            elemento.name === "crear notificacion" ? (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card className={classes.root}>
                  <Link to="/notificacion">
                    <CardMedia
                      className={classes.media}
                      image={notificationIcon}
                      title="Notificacion"
                    />
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      ></Typography>
                      <Typography variant="h5" component="h2">
                        Enviar Notificacion
                      </Typography>
                      <Typography variant="body2" component="p">
                        Enviar notificaciones a usuarios
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ) : null
          )}
        </Grid>
      </main>
    </div>
  );
};

export default Home;
