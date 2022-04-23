import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import api from '../../services/api'

// styles
import useStyles from "./styles";


import google from "../../images/google.svg";

// context
import { useUserDispatch, login, singUp } from "../../context/UserContext";


function DetailsCourse(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [errorMessage, setErrorMessage] = useState('');
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");



  useEffect(() => {
  });

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
     
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
        
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2014-{new Date().getFullYear()} <a style={{ textDecoration: 'none', color: 'inherit' }} href="https://Keepito.com" rel="noopener noreferrer" target="_blank">Keepito</a>, LLC. All rights reserved.
        </Typography>
      </div>
    </Grid >
  );
}

export default withRouter(DetailsCourse);
