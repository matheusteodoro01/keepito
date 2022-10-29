import React, { useState, useEffect } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import Replay from "@material-ui/icons/Replay";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { decoder } from "../../services/decoder";

// components
import { Typography } from "../../components/Wrappers/Wrappers";

export default function Quiz() {
  const token = localStorage.getItem("keepitoAuthorization");
  const [activeStep, setActiveStep] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [booleanonsubmit, setBooleanonsubmit] = useState(false);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [catchmsg, setCatchmsg] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [questionIdCurrent, setQuestionIdCurrent] = useState(0);
  const [correctAlternativeId, setCorrectAlternativeId] = useState(0);
  const { quizId } = useParams();
  const { id } = decoder(token);

  const handleNext = async () => {
    try {
      await sendResponseQuestion();
      setActiveStep(activeStep + 1);
    } catch (error) {
      setCatchmsg("Erro ao gravar resposta!");
      setErrormsg("error");
      setOpen(true);
    }
  };
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getQuizQuestions = async () => {
    try {
      const quiz = await api.get(`/v1/quizzes/${quizId}`);
      setQuizQuestions(quiz.data.questions);
    } catch (error) {
      setQuizQuestions({});
    }
  };

  const sendResponseQuestion = async () => {
    const responseQuestion = {
      userId: id,
      questionId: questionIdCurrent,
      correctAlternativeId: correctAlternativeId,
    };
    return await api.post("/v1/alternativesResponse", responseQuestion);
  };

  useEffect(() => {
    getQuizQuestions();
  }, []);

  const onInputChange = (e) => {
    const questionId = e.target.name;
    const correctAlternativeId = e.target.value;
    const nexState = quizQuestions.map((question) => {
      if (question.id != questionId) return question;
      return {
        ...question,
        alternatives: question.alternatives.map((alternative) => {
          const checked = alternative.id == correctAlternativeId;
          return {
            ...alternative,
            selected: checked,
          };
        }),
      };
    });
    setQuestionIdCurrent(questionId);
    setCorrectAlternativeId(correctAlternativeId);
    setQuizQuestions(nexState);
  };

  onsubmit = () => {
    let count = 0;
    let notattempcount = 0;

    quizQuestions.map((question, key) => {
      question.alternatives.map((alternative, key) => {
        if (alternative.selected === true) {
          notattempcount = notattempcount + 1;
          if (alternative.id === question.correctAlternative) {
            count = count + 1;
          }
        }
      });
    });

    if (notattempcount != quizQuestions.length) {
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
            Voce acertou {total} de {quizQuestions.length} questões!{" "}
          </h2>
          <Button
            onClick={() => {
              setBooleanonsubmit(false);
              setActiveStep(0);
              getQuizQuestions();
              setTotal(0);
            }}
          >
            {" "}
            <Replay /> Tentar novamente{" "}
          </Button>
        </div>
      ) : (
        <div className="Quiz_container_display">
          {quizQuestions.map((question, index) => {
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
              steps={quizQuestions?.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                activeStep === quizQuestions?.length - 1 ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={onsubmit}
                  >
                    Finalizar
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    disabled={activeStep === quizQuestions?.length}
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
