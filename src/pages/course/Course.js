import React, { useState, useEffect } from "react";
import { Grid, CardContent, CardActions, IconButton } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components

import { Typography, Button } from "../../components/Wrappers/Wrappers";
import CardMedia from "@material-ui/core/CardMedia";
import api from "../../services/api";

export default function Course(props) {
  var classes = useStyles();
  const [course, setCourse] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  let { course_id } = useParams();

  async function getFiles(classId) {
    const response = await api.get(`/v1/classes/files?classId=${classId}`, {});
    return response.data;
  }
  async function getClasses() {
    const response = await api.get(`/v1/courses/${course_id}`, {});
    const promise = await response.data.classes.map(async (classCourse) => {
      const files = await getFiles(classCourse.id);
      return { ...classCourse, files: files };
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
        <Grid item sm={8} md={8}>
          <CardContent>
            <Typography gutterBottom variant="h1" component="div">
              {course.name}
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
        {courseClasses.map((course) => (
          <Grid item key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="p">
                  {course.name}
                </Typography>
                <Typography>
                  {course.description} Neste curso o aluno irá aprender as
                  partes básicas como: Configuração do Ambiente; Algoritmo e
                  Estrutura de Dados; Fundamentos da Linguagem Java; Estruturas
                  de Controle; Classes, Objetos e Métodos. Dessa forma, o aluno
                  estará preparado para conceitos mais avançados, como a
                  Orientação a Objetos, por exemplo.
                  
                </Typography>
                {course.files.map((file) => (
                  <Typography key={file}>{file}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
