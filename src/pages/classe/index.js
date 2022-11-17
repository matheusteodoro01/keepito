import React, { useState, useEffect } from "react";
import {
  Grid,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import AttachFileIcon from "@material-ui/icons/AttachFile";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../components/styles";

// components
import CardMedia from "@material-ui/core/CardMedia";
import api from "../../services/api";
import { decoder } from "../../services/decoder";

export default function ClasseDetails() {
  var classesNames = useStyles();
  const token = localStorage.getItem("keepitoAuthorization");
  const [classe, setClasse] = useState([]);
  const [ClasseQuizzes, setClasseQuizzes] = useState([]);
  const [openFiles, setOpenFiles] = useState(false);
  const { id } = decoder(token);
  let { classeId } = useParams();

  async function getClasse() {
    try {
      const classe = await api.get(`/v1/classes/${classeId}`);
      setClasse(classe.data);
      setClasseQuizzes(classe.data.quizzes);
    } catch (error) {
      setClasse([]);
      setClasseQuizzes([]);
    }
  }

  useEffect(() => {
    getClasse();
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
              image="https://loiane.com/assets/images/assets/curso-javaSE-loiane.png"
              alt="green iguana"
            />
          </Card>
        </Grid>

        <Grid item sm={8} md={8}>
          <CardContent>
            <Typography gutterBottom variant="h2" component="div">
              {classe.name}
            </Typography>
            <Typography variant="body1" color="InfoText">
              {classe.description}
            </Typography>

            <CardActions></CardActions>
          </CardContent>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={15} md={12} lg={12}>
          <Typography gutterBottom variant="h3" component="div">
            Conteudo
          </Typography>
        </Grid>
        {ClasseQuizzes.map((quiz) => (
          <Grid item sm={12} md={12} lg={12} key={quiz.id}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4" component="p">
                      {quiz.name}
                    </Typography>
                  </Stack>
                  <Typography>{quiz.description}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={quiz.questions.length + " Questões"}
                      color="info"
                    />
                    <Chip label={quiz.score + " Minutos"} color="error" />
                   
                    <Chip label={quiz.score + " Pontos"} color="success" />
                    <Chip label={quiz.theme} color="warning" />
                  </Stack>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    component={Link}
                    disabled={!!quiz.questions.length == 0}
                    to={`/app/course/quiz/${quiz.id}`}
                  >
                    Iniciar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
