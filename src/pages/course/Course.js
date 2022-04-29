import React, { useState, useEffect } from "react";
import { Grid,CardContent,CardActions, IconButton} from "@material-ui/core";
import { Link } from 'react-router-dom';
import classnames from "classnames";
import Card from '@material-ui/core/Card';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components

import { Typography, Button } from "../../components/Wrappers/Wrappers";
import CardMedia from '@material-ui/core/CardMedia';
import api from '../../services/api'

export default function Course (props) {
  var classes = useStyles();
  const [course, setCourse] = useState([])
  const [courseClasses, setCourseClasses] = useState([])

  useEffect(() => {

    async function fetchData () {
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
  <Grid container spacing={1} >

        <Grid item sm={8} md={8}>
        <CardContent>
                  <Typography gutterBottom variant="h1" component="div">
                    {course.name}
                  </Typography>
                </CardContent>
        </Grid>
        <Grid item>
          <CardContent>
                  <Typography gutterBottom variant="h2" component="div">
                  Conteudo
                  </Typography>
                  {courseClasses.map(course => (
              <Card key={course.id}>
                 <CardContent>
                 <Typography  variant="h4" component="p">
                 {course.id} - {course.name}
                  </Typography>
                <Typography>
                  {course.description} Neste curso o aluno irá aprender as partes básicas como: Configuração do Ambiente; Algoritmo e Estrutura de Dados; Fundamentos da Linguagem Java; Estruturas de Controle; Classes, Objetos e Métodos. Dessa forma, o aluno estará preparado para conceitos mais avançados, como a Orientação a Objetos, por exemplo.
                </Typography>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Grid>
      </Grid>
    </>
  );
}
