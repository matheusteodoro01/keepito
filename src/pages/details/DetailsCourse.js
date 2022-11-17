import React, { useState, useEffect } from "react";
import {
  Grid,
  CardContent,
  CardActions,
  IconButton,
  CardMedia,
  Typography,
  Button,
  Card,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";

import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

import api from "../../services/api";
import { decoder } from "../../services/decoder";

export default function DetailsCourse(props) {
  var classes = useStyles();
  const token = localStorage.getItem("keepitoAuthorization");
  const [course, setCourse] = useState([]);
  const [subscribe, setSubscribe] = useState(false);
  const [courseClasses, setCourseClasses] = useState([]);
  const { id } = decoder(token);
  let { course_id } = useParams();

  const isSubscribe = (course) => course.id == course_id;

  const getCourse = async () => {
    try {
      const response = await api.get(`/v1/courses/${course_id}`);
      setCourse(response.data);
      setCourseClasses(response.data.classes);
    } catch (error) {
      setCourse([]);
      setCourseClasses([]);
    }
  };
  async function getSubscribe() {
    try {
      const response = await api.get(`/v1/users/${id}`);
      response.data?.courses?.filter(isSubscribe).length > 0 &&
        setSubscribe(true);
    } catch (error) {
      setSubscribe(false);
    }
  }
  useEffect(() => {
    getCourse();
    getSubscribe();
  }, []);

  function handleSubscribe({ courseId, userId }) {
    api
      .post(`/v1/registers?userId=${userId}&courseId=${courseId}`)
      .then((response) => {
        setSubscribe(true);
      });
  }

  return (
    <>
      <Grid container spacing={1}>
        <CardMedia
          component="img"
          style={{
            maxWidth: 380,
            maxHeight: 350,
            boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
            borderRadius: "10px"
          }}
   
          image="https://escuelafullstack.com/web/image/slide.channel/18/image_512"
          alt="green iguana"
        />

        <Grid item sm={8} md={8}>
          <Stack direction="column" spacing={1}>
            <Typography  variant="h2">
              {course.name}
            </Typography>
            <Rating name="read-only" value={2} readOnly />
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={courseClasses.length + " Questões"} color="info" />
              {subscribe && <Chip label={"Inscrito"} color="success" />}
              <Chip label={"Novo"} color="warning" />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.buttonsContainer}
                component={Link}
                onClick={() =>
                  handleSubscribe({ courseId: course.id, userId: id })
                }
                to={`/app/subscribe/course/${course.id}`}
              >
                {!subscribe ? "Inscrever-se" : "Acessar"}
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={10} md={8}>
          <Typography gutterBottom variant="h3" component="div">
            Conteudo
          </Typography>
        </Grid>
        {courseClasses.map((classe) => (
          <Grid item sm={12} md={12} lg={12} key={classe.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="p">
                  {classe.name}
                </Typography>

                <Typography>{classe.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
