import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Grid, CardActionArea } from "@material-ui/core";

import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";

import api from "../../services/api";

// components
import PageTitle from "../../components/PageTitle/PageTitle";

export default function Menu() {
  const [courses, setCourses] = useState([]);

  function fetchData() {
    api.get("/v1/courses", {}).then((response) => {
      console.log(response.data.content)
      setCourses(response.data.content);
    });
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {courses.map((course,index) => {
          if(course.classes.length > 0) {
            return <Grid item key={course.id}>
            <Card
              style={{
                fontSize: 3,
                width: 320,
                height: 250,
                boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
                backgroundColor: "#fafafa",
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/app/course/details/${course.id}`}
              >
                <CardMedia
                  component="img"
          
                  height="150"
              
                  image={`https://escuelafullstack.com/web/image/slide.channel/${index+2}/image_512`}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {course.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>;
          }
          
        })}
      </Grid>
    </>
  );
}
