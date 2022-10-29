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
  const [quizScore, setQuizScore] = useState([]);
  const [booleanonsubmit, setBooleanonsubmit] = useState(false);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [catchmsg, setCatchmsg] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [quizResponses, setQuizResponses] = useState(new Map());
  const { quizId } = useParams();
  const { id } = decoder(token);

  const handleNext = () => setActiveStep(activeStep + 1);
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
      setQuizScore(quiz.data.score);
    } catch (error) {
      setQuizQuestions({});
    }
  };

  const sendResponsesQuestions = async ({
    questionId,
    correctAlternativeId,
  }) => {
    const responseQuestion = {
      userId: id,
      questionId,
      correctAlternativeId,
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
    quizResponses.set(questionId, { questionId, correctAlternativeId });
    setQuizQuestions(nexState);
  };

  onsubmit = async () => {
    const reponses = [];
    quizResponses.forEach(async (value, key) => reponses.push(value));
    await Promise.all(
      reponses.map(
        async (response) =>
          await sendResponsesQuestions({
            questionId: response.questionId,
            correctAlternativeId: response.correctAlternativeId,
          }),
      ),
    );

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
          <h2> Sua nota foi {(quizScore / quizQuestions.length) * total}! </h2>
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
