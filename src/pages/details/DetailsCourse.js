import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import classnames from "classnames";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import Notification from "../../components/Notification";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import CardMedia from '@material-ui/core/CardMedia';
import api from '../../services/api'

export default function NotificationsPage(props) {
  var classes = useStyles();
  const [course, setCourse] = useState([])
  const [courseClasses, setCourseClasses] = useState([])

  useEffect(() => {

    async function fetchData() {
      await api.get(`/v1/courses/${1}`, {
      })
        .then((response) => {
          console.log(response.data)
          setCourse(response.data)
          setCourseClasses(response.data.classes)
        })

    }
    fetchData();

  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={8} >
            <Widget disableWidgetMenu>
              <Grid container item xs={12} spacing={4}>
                   <Grid item xs={5}>
                   <CardMedia
                  component="img"
                  height="200"
                  image="https://escuelafullstack.com/web/image/slide.channel/18/image_512"
                  alt="green iguana"
                />
                    </Grid>
                    <Grid item xs={7}>
                    <Widget title={course.name} noWidgetShadow disableWidgetMenu noBodyPadding noHeaderPadding style={{paddingRight: 15}} headerClass={classes.widgetHeader}>
                      <Typography>
                        {course.description}
                      </Typography>
                      <Typography>
                        {courseClasses.length} aula(s).
                      </Typography>
                   
                      
                    </Widget>
                    </Grid>
                    <Grid item xs={12}>
                      <Widget title="Conteudo"disableWidgetMenu noWidgetShadow>
                      {courseClasses.map(course => (
                              <Grid key={course.id} item xs={4} >
                              <Widget title={course.name}  disableWidgetMenu noBodyPadding noHeaderPadding style={{paddingRight: 15}} headerClass={classes.widgetHeader}>
                                <Typography>
                                  {course.description}
                                </Typography>
                              </Widget>
                              </Grid>
                      ))}
                        </Widget>
                      </Grid>
                   
              </Grid>
            </Widget>
        </Grid>
        <Grid item xs={4}>
        <Widget disableWidgetMenu>
      
        </Widget>
        </Grid>
      </Grid>
    </>
  );
}
