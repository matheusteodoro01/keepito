import React, { useState, useEffect } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import Replay from "@material-ui/icons/Replay";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useParams } from "react-router-dom";
import api from "../../services/api";

// components
import { Typography } from "../../components/Wrappers/Wrappers";

export default function Quiz() {
  const [activeStep, setActiveStep] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [quizResponses, setQuizResponses] = useState([]);
  const [booleanonsubmit, setBooleanonsubmit] = useState(false);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [catchmsg, setCatchmsg] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const { quizId } = useParams();

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getQuizData = async () => {
    try {
      const quiz = await api.get(`/v1/quizzes/${quizId}`);
      setQuizData(quiz.data.questions);
    } catch (error) {
      setQuizData({});
    }
  };

  useEffect(() => {
    getQuizData();
  }, []);

  const onInputChange = (e) => {
    const nexState = quizData.map((question) => {
      console.log(question.id, e.target.name);
      if (question.id != e.target.name) return question;
      return {
        ...question,
        alternatives: question.alternatives.map((alternative) => {
          const checked = alternative.id == e.target.value;
          return {
            ...alternative,
            selected: checked,
          };
        }),
      };
    });
    console.log(nexState);
    setQuizData(nexState);
  };

  onsubmit = () => {
    let count = 0;
    let notattempcount = 0;

    quizData.map((question, key) => {
      question.alternatives.map((alternative, key) => {
        if (alternative.selected === true) {
          notattempcount = notattempcount + 1;
          if (alternative.id === question.correctAlternative) {
            count = count + 1;
          }
        }
      });
    });

    if (notattempcount != quizData.length) {
      setBooleanonsubmit(false);
      setTotal(count);
      setCatchmsg("Responda todas as questões para finalizar!");
      setErrormsg("error");
      setOpen(true);
    } else {
      setBooleanonsubmit(true);
      setTotal(count);
    }
  };

  const Snackbarrender = () => {
    return open ? (
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        style={{ marginTop: "0px", width: "100%" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={errormsg}
        >
          {catchmsg}
        </MuiAlert>
      </Snackbar>
    ) : null;
  };

  return (
    <div className="Quiz_render_container">
      {booleanonsubmit ? (
        <div className="Quiz-DisplayResult">
          <h2>
            {" "}
            Voce acertou {total} de {quizData.length} questões!{" "}
          </h2>
          <Button
            onClick={() => {
              setBooleanonsubmit(false);
              setActiveStep(0);
              getQuizData();
              setTotal(0);
            }}
          >
            {" "}
            <Replay /> Tentar novamente{" "}
          </Button>
        </div>
      ) : (
        <div className="Quiz_container_display">
          {quizData.map((question, index) => {
            if (Math.abs(activeStep - index) <= 0) {
              return (
                <div>
                  <div className="Quiz_que">
                    <Typography gutterBottom variant="h1" component="div">
                      {index + 1} - {question.title}
                    </Typography>
                  </div>
                  {question.alternatives.map(
                    (alternative, index_alternative) => {
                      index_alternative = index_alternative + 1;
                      return (
                        <div
                          key={index_alternative}
                          className="Quiz_multiple_options"
                        >
                          <Typography gutterBottom variant="h3" component="div">
                            <input
                              key={index_alternative}
                              type="radio"
                              name={question.id}
                              value={alternative.id}
                              checked={!!alternative.selected}
                              onChange={onInputChange}
                            />{" "}
                            {alternative.description}
                          </Typography>
                        </div>
                      );
                    },
                  )}
                </div>
              );
            } else {
              return null;
            }
          })}

          <div className="Quiz-MobileStepper">
            <MobileStepper
              variant="dots"
              steps={quizData?.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                activeStep === quizData?.length - 1 ? (
                  <Button size="small" variant="contained" color="primary" onClick={onsubmit}>
                    Finalizar
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    disabled={activeStep === quizData?.length}
                  >
                    Proxima
                  </Button>
                )
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  variant="contained"
                  color="inherit"
                  disabled={activeStep === 0}
                >
                  Anterior
                </Button>
              }
            />
          </div>
        </div>
      )}
      {Snackbarrender()}
    </div>
  );
}
