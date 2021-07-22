import React from "react";
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
import Login from "../../layouts/Login/Login";
import Ubicacion from "../../layouts/Ubicacion/Ubicacion";
import Unidad from "../../layouts/Unidad/Unidad";
import createRole from "../../layouts/Roles/Roles";
import Tramite from "../../layouts/Tramite/Tramite";
import Requisito from "../../layouts/Requisito/Requisito";
import Paso from "../../layouts/Paso/Paso";
import Historial from "../../layouts/Historial/Historial";
import Usuarios from "../../layouts/Usuarios/Usuarios";
import Personal from "../../layouts/Personal/Personal";
import UsuarioTramite from "../../layouts/UsuarioTramite/UsuarioTramite";
import Documento from "../../layouts/Documento/Documento";
import Aviso from "../../layouts/Aviso/Aviso";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const openD = Boolean(anchorEl);

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
            <Link to="/personal">
              <ListItem button>
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText>Personal</ListItemText>
              </ListItem>
            </Link>
            <Link to="/tramite">
              <ListItem button>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText>Tramites</ListItemText>
              </ListItem>
            </Link>
            <Link to="/usuarios">
              <ListItem button>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText>Usuarios</ListItemText>
              </ListItem>
            </Link>
            <Link to="/documentos">
              <ListItem button>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText>Documentos</ListItemText>
              </ListItem>
            </Link>
            <Link to="/roles">
              <ListItem button>
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText>Roles</ListItemText>
              </ListItem>
            </Link>
            <Link to="/ubicacion">
              <ListItem button>
                <ListItemIcon>
                  <RoomIcon />
                </ListItemIcon>
                <ListItemText>Ubicacion</ListItemText>
              </ListItem>
            </Link>
            <Link to="/unidad">
              <ListItem button>
                <ListItemIcon>
                  <HomeWorkIcon />
                </ListItemIcon>
                <ListItemText>Unidad Admin.</ListItemText>
              </ListItem>
            </Link>
            <Link to="/requisito">
              <ListItem button>
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText>Requisitos</ListItemText>
              </ListItem>
            </Link>
            <Link to="/paso">
              <ListItem button>
                <ListItemIcon>
                  <FormatListNumberedIcon />
                </ListItemIcon>
                <ListItemText>Pasos</ListItemText>
              </ListItem>
            </Link>
            <Link to="/usuariotramite">
              <ListItem button>
                <ListItemIcon>
                  <FormatListNumberedIcon />
                </ListItemIcon>
                <ListItemText>Tramites de Usuarios</ListItemText>
              </ListItem>
            </Link>
            <Link to="/historial">
              <ListItem button>
                <ListItemIcon>
                  <FormatListNumberedIcon />
                </ListItemIcon>
                <ListItemText>Historial</ListItemText>
              </ListItem>
            </Link>
            <Link to="/avisos">
              <ListItem button>
                <ListItemIcon>
                  <ViewCarouselIcon />
                </ListItemIcon>
                <ListItemText>Aviso</ListItemText>
              </ListItem>
            </Link>
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
              path="/"
              exact
              component={() => {
                return <p></p>;
              }}
            />
            <Route path="/roles" exact component={createRole} />
            <Route path="/login" exact component={Login} />
            <Route path="/ubicacion" exact component={Ubicacion} />
            <Route path="/unidad" exact component={Unidad} />
            <Route path="/tramite" exact component={Tramite} />
            <Route path="/requisito" exact component={Requisito} />
            <Route path="/paso" exact component={Paso} />
            <Route path="/historial" exact component={Historial} />
            <Route path="/usuarios" exact component={Usuarios} />
            <Route path="/personal" exact component={Personal} />
            <Route path="/usuariotramite" exact component={UsuarioTramite} />
            <Route path="/documentos" exact component={Documento} />
            <Route path="/avisos" exact component={Aviso} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}
