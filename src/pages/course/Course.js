import React, { useState, useEffect } from "react";
import { Grid, CardContent, Rai } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";
import Rating from "@mui/material/Rating";
import Card from "@material-ui/core/Card";
import { InsertDriveFile } from "@material-ui/icons";
import CardMedia from "@material-ui/core/CardMedia";
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
// components
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import api from "../../services/api";

export default function Course(props) {
  var classes = useStyles();
  const [course, setCourse] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  const [avaliation, setAvaliation] = useState(2);
  let { course_id } = useParams();

  async function getFiles(classId) {
    const response = await api.get(`/v1/classes/files?classId=${classId}`, {});
    return response.data;
  }
  async function getClasses() {
    const response = await api.get(`/v1/courses/${course_id}`, {});
    const promise = await response.data.classes.map(async (classCourse) => {
      //const files = await getFiles(classCourse.id);
      return { ...classCourse };
    });
    const classes = await Promise.all(promise);
    setCourse(response.data);
    setCourseClasses(classes);
  }
  useEffect(() => {
    getClasses();
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item sm={4} md={4}>
          <Card
            style={{
              boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
              backgroundColor: "#fafafa",
            }}
          >
            <CardMedia
              component="img"
              maxWidth="345"
              maxHeight="345"
              image="https://escuelafullstack.com/web/image/slide.channel/18/image_512"
              alt="green iguana"
            />
          </Card>
        </Grid>
        <Grid item sm={8} md={8}>
          <CardContent>
            <Typography gutterBottom variant="h1" component="div">
              {course.name}
            </Typography>
            <Rating
              name="simple-controlled"
              value={avaliation}
              onChange={(event, newValue) => {
                setAvaliation(newValue);
              }}
            />
            <Typography variant="body1" color="text.primary">
              {courseClasses.length} aula(s)
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={10} md={8}>
          <Typography gutterBottom variant="h2" component="div">
            Conteudo
          </Typography>
        </Grid>
        {courseClasses.map((classeCourse) => (
          <Grid item sm={12} md={12} lg={12} key={classeCourse.id}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="p">
                  {classeCourse.name}
                </Typography>
                <Typography>{classeCourse.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/app/course/${course_id}/classe/details/${classeCourse.id}`}
                >
                  Acessar
                </Button>
                {classeCourse?.files?.map((file) => (
                  <Typography key={file}>
                    <InsertDriveFile
                      key={file}
                      href={`${{ file }}`}
                      classes={{ root: classes.headerIcon }}
                    />
                    <a
                      href={`https://jornada-back.s3.amazonaws.com/classes/classId-${classeCourse.id}/${file}`}
                      target="blank"
                    >
                      {file}
                    </a>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
