import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Products from "./Products";
import '../styles/ProductsStyle.css'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    zIndex: 1000,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: -1,
    position: "zIndex",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  none: {
    textDecoration: "none",
    color: "black",
    fontWeight: "700",
  },
}));

export default function Sidebar({ products }) {
  const classes = useStyles();

  return (
    
<div className="absolute">
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}>
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem>
              <ListItemText primary={"Options"} />
            </ListItem>
          </List>

          <Divider />
          <ListItem>
            <Link to='/configs/addadmin' className={classes.none}>
              <ListItemText primary={"Create / Remove admin"} />
            </Link>
          </ListItem>
          <ListItem>
            <Link to='/configs/addproducts' className={classes.none}>
              <ListItemText primary={"Add product"} />
            </Link>
          </ListItem>
          <ListItem>
            <Link to='/configs/removeproducts' className={classes.none}>
              <ListItemText primary={"Edit / Remove products"} />
            </Link>
          </ListItem>
          <ListItem>
            <Link to='/configs/addcategories' className={classes.none}>
              <ListItemText primary={"Add categories"} />
            </Link>
          </ListItem>
          <ListItem>
            <Link to='/configs/dashboard' className={classes.none}>
              <ListItemText primary={"Dashboard"} />
            </Link>
          </ListItem>
        </div>
      </Drawer>
    </div>
    </div>
  );
}
