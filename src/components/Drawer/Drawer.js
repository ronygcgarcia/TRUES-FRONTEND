import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import RoomIcon from "@material-ui/icons/Room";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ViewCarouselIcon from "@material-ui/icons/ViewCarousel";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Ubicacion from "../../layouts/Ubicacion/Ubicacion";
import Unidad from "../../layouts/Unidad/Unidad";
import Roles from "../../layouts/Roles/Roles";
import Tramite from "../../layouts/Tramite/Tramite";
import Requisito from "../../layouts/Requisito/Requisito";
import Paso from "../../layouts/Paso/Paso";
import Historial from "../../layouts/Historial/Historial";
import Usuarios from "../../layouts/Usuarios/Usuarios";
import Personal from "../../layouts/Personal/Personal";
import UsuarioTramite from "../../layouts/UsuarioTramite/UsuarioTramite";
import Documento from "../../layouts/Documento/Documento";
import Aviso from "../../layouts/Aviso/Aviso";
import Home from "../../layouts/Home/Home";
import api from "../../config/axios";
import HistoryIcon from "@material-ui/icons/History";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Notificacion from "../../layouts/Notificacion/Notificacion";
import AddAlertIcon from '@material-ui/icons/AddAlert';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginLeft: "7%",
    marginRight: "7%"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const openD = Boolean(anchorEl);
  const [usuario, setUsuario] = useState({
    id: 0,
    permissions: [],
  });
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    props.history.push('/');
  };

  useEffect(() => {
    async function getUser() {
      try {
        const { data: usuarioAPI } = await api.get("/user");
        setUsuario(usuarioAPI);
      } catch (error) {
        
      }
    }
    getUser();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar
            style={{
              justifyContent: "space-between",
              backgroundColor: "#6e0000",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Universidad de El Salvador - TRUES
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >

              <AccountCircle />
              <h2>{usuario.name}</h2>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openD}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={logout}>Cerrar Sesion</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />

          <List>
            <Link to="/home">
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>Inicio</ListItemText>
              </ListItem>
            </Link>

            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver personal" ? (
                <Link key={index} to="/personal">
                  <ListItem button>
                    <ListItemIcon>
                      <SupervisedUserCircleIcon />
                    </ListItemIcon>
                    <ListItemText>Personal</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver tramite" ? (
                <Link key={index} to="/tramite">
                  <ListItem button>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText>Tramites</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver usuarios" ? (
                <Link key={index} to="/usuarios">
                  <ListItem button>
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText>Usuarios</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver documento" ? (
                <Link key={index} to="/documentos">
                  <ListItem button>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText>Documentos</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver roles" ? (
                <Link key={index} to="/roles">
                  <ListItem button>
                    <ListItemIcon>
                      <FaceIcon />
                    </ListItemIcon>
                    <ListItemText>Roles</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver ubicacion" ? (
                <Link key={index} to="/ubicacion">
                  <ListItem button>
                    <ListItemIcon>
                      <RoomIcon />
                    </ListItemIcon>
                    <ListItemText>Ubicacion</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver unidad" ? (
                <Link key={index} to="/unidad">
                  <ListItem button>
                    <ListItemIcon>
                      <HomeWorkIcon />
                    </ListItemIcon>
                    <ListItemText>Unidad Admin.</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver requisito" ? (
                <Link key={index} to="/requisito">
                  <ListItem button>
                    <ListItemIcon>
                      <AssignmentTurnedInIcon />
                    </ListItemIcon>
                    <ListItemText>Requisitos</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver paso" ? (
                <Link key={index} to="/paso">
                  <ListItem button>
                    <ListItemIcon>
                      <FormatListNumberedIcon />
                    </ListItemIcon>
                    <ListItemText>Pasos</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver usuario tramite" ? (
                <Link key={index} to="/usuariotramite">
                  <ListItem button>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText>Tramites de Usuarios</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver historial" ? (
                <Link key={index} to="/historial">
                  <ListItem button>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText>Historial</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "ver aviso" ? (
                <Link key={index} to="/avisos">
                  <ListItem button>
                    <ListItemIcon>
                      <ViewCarouselIcon />
                    </ListItemIcon>
                    <ListItemText>Aviso</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )}
            {/** Agregar el permiso para crear notificaciones */}
            {usuario.permissions.map((elemento, index) =>
              elemento.name === "crear notificacion" ? (
                <Link key={index} to="/notificacion">
                  <ListItem button>
                    <ListItemIcon>
                      <AddAlertIcon />
                    </ListItemIcon>
                    <ListItemText>Notificacion</ListItemText>
                  </ListItem>
                </Link>
              ) : null
            )} 
          </List>
          <Divider />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {props.children}
          <Switch>
            <Route
              path="/home"
              exact
              render={() => {return (<Home usuario={usuario}/>)}}
            />
            <Route
              path="/usuarios"
              exact
              render={() => {return (<Usuarios usuario={usuario}/>)}}
            />

            <Route
              path="/roles"
              exact
              render={() => {return (<Roles usuario={usuario}/>)}}
            />
            <Route
              path="/ubicacion"
              exact
              render={() => {return (<Ubicacion usuario={usuario}/>)}}
            />

            <Route
              path="/unidad"
              exact
              render={() => {return (<Unidad usuario={usuario}/>)}}
            />
            <Route
              path="/tramite"
              exact
              render={() => {return (<Tramite usuario={usuario}/>)}}
            />
            <Route
              path="/requisito"
              exact
              render={() => {return (<Requisito usuario={usuario}/>)}}
            />
            <Route
              path="/paso"
              exact
              render={() => {return (<Paso usuario={usuario}/>)}}
            />
            <Route
              path="/historial"
              exact
              render={() => {return (<Historial usuario={usuario}/>)}}
            />
            <Route
              path="/personal"
              exact
              render={() => {return (<Personal usuario={usuario}/>)}}
            />
            <Route
              path="/usuariotramite"
              exact
              render={() => {return (<UsuarioTramite usuarioLog={usuario}/>)}}
            />
            <Route
              path="/documentos"
              exact
              render={() => {return (<Documento usuario={usuario}/>)}}
            />
            <Route
              path="/avisos"
              exact
              render={() => {return (<Aviso usuario={usuario}/>)}}
            />
            <Route
              path="/notificacion"
              exact
              render={() => {return (<Notificacion usuario={usuario}/>)}}
            />
          </Switch>
        </main>
      </Router>
    </div>
  );
}
