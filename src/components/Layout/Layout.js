import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
import { Box, IconButton, Link } from "@material-ui/core";
import Icon from "@mdi/react";

//icons
import {
  mdiFacebook as FacebookIcon,
  mdiTwitter as TwitterIcon,
  mdiGithub as GithubIcon,
} from "@mdi/js";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";

// pages
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
import Menu from "../../pages/menu/Menu";
import DetailsCourse from "../../pages/details/DetailsCourse";
import ClasseDetails from "../../pages/classe"
import Course from "../../pages/course/Course";
import Quiz from "../../pages/quiz"
// context
import { useLayoutState } from "../../context/LayoutContext";
import { decoder } from "../../services/decoder";

function Layout(props) {
  var classes = useStyles();
  const token = localStorage.getItem("keepitoAuthorization");

  // global
  var layoutState = useLayoutState();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const { name } = decoder(token);
    setUserName(name);
  }, [token]);
  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} userName={userName} />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/menu" component={Menu} />
            <Route path="/app/course/details/:course_id" component={DetailsCourse} />
            <Route path="/app/subscribe/course/:course_id" component={Course} />
            <Route path="/app/course/:courseId/classe/details/:classeId" component={ClasseDetails} />
            <Route path="/app/course/quiz/:quizId" component={Quiz} />
            
            <Route
              exact
              path="/app/ui"
              render={() => <Redirect to="/app/ui/icons" />}
            />
            <Route path="/app/ui/icons" component={Icons} />
            <Route path="/app/ui/charts" component={Charts} />
          </Switch>
          <Box
            mt={5}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <div>
              <Link
                color={"primary"}
                href={"https://keepito-closer.vercel.app"}
                target={"_blank"}
                className={classes.link}
              >
                Criar Curso
              </Link>
              <Link
                color={"primary"}
                href={"https://flatlogic.com/about"}
                target={"_blank"}
                className={classes.link}
              >
                Sobre nós
              </Link>
              <Link
                color={"primary"}
                href={"https://flatlogic.com/blog"}
                target={"_blank"}
                className={classes.link}
              >
                Contato
              </Link>
            </div>
            <div>
              <Link
                href={"https://www.facebook.com/flatlogic"}
                target={"_blank"}
              >
                <IconButton aria-label="facebook">
                  <Icon path={FacebookIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
              <Link href={"https://twitter.com/flatlogic"} target={"_blank"}>
                <IconButton aria-label="twitter">
                  <Icon path={TwitterIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
              <Link href={"https://github.com/flatlogic"} target={"_blank"}>
                <IconButton aria-label="github" style={{ marginRight: -12 }}>
                  <Icon path={GithubIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
            </div>
          </Box>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
