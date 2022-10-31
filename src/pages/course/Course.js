import React, { useState, useEffect } from "react";
import { Grid, CardContent, Typography, Button } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";
import Rating from "@mui/material/Rating";
import Card from "@material-ui/core/Card";
import { InsertDriveFile } from "@material-ui/icons";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
// components
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
          <CardContent >
            <Typography gutterBottom variant="h1" component="div">
              {course.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
            <Rating
              name="simple-controlled"
              value={avaliation}
              onChange={(event, newValue) => {
                setAvaliation(newValue);
              }}
            />
            <Typography gutterBottom variant="h3" component="div">
             Top 5 melhores alunos do curso!
            </Typography>

            <Stack direction="row" spacing={2}>
              {[
                {
                  name: "Matheus Teodoro",
                  score: 97,
                  imageProfile:
                    "https://media-exp1.licdn.com/dms/image/C4E03AQHpSbIKngBv2w/profile-displayphoto-shrink_200_200/0/1644551927783?e=1672876800&v=beta&t=bxSznWM9Fm9Rc2BI3jMcN6CY0z2QBQsGUQ0hFMGAgxc",
                },
                {
                  name: "Valdir Cezar",
                  score: 92,
                  imageProfile:
                    "https://media-exp1.licdn.com/dms/image/D4D03AQH3My5BWZSxTw/profile-displayphoto-shrink_200_200/0/1665003940308?e=1672876800&v=beta&t=kfe3Mkpdjwfy6tlPVBaT1JEnOX9b7otRch68m5J8e9Q",
                },
                {
                  name: "Matheus Rossato",
                  score: 89,
                  imageProfile:
                    "https://media-exp1.licdn.com/dms/image/C5603AQEHR2IZSIW0bg/profile-displayphoto-shrink_100_100/0/1516307121404?e=1672876800&v=beta&t=un3oXnr7dPzf75BM5x5m13g1Bzut78Zr2ZIS78Gugng",
                },
                {
                  name: "Marcelo Schucman",
                  score: 87,
                  imageProfile:"https://media-exp1.licdn.com/dms/image/D4D03AQHV2GJi0wpI_g/profile-displayphoto-shrink_200_200/0/1664826033347?e=1672876800&v=beta&t=1HlkNrrh09rckbCqSTKj-H36-h_iM94LeHtsyjZQd_c"
                                   },
                {
                  name: "Guilherme Castro",
                  score: 86,
                  imageProfile:"https://media-exp1.licdn.com/dms/image/C4D03AQFzq6x8Lv5Fkg/profile-displayphoto-shrink_200_200/0/1555488028130?e=1672876800&v=beta&t=nii6a5cpd-BWZnf0bMxfxm4Iq4SACz2qwR3u7tp71w8"
                       },
              ].map((user, index) => (
                <Stack
                  key={index}
                  direction="column"
                  spacing={0}
                  alignItems={"center"}
                >
                  <Avatar alt={user.name} src={user.imageProfile} />
                  <Typography>
                    Nota: <b> {user.score}</b>
                  </Typography>
                  <Typography>
                    <b>{user.name}</b>
                  </Typography>
                </Stack>
              ))}
            </Stack>

          
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
