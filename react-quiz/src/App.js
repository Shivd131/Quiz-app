import React, { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function App() {
  const [answersStatus, setAnswersStatus] = useState({});
  const { error, isPending, data } = useFetch(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
  );

  useEffect(() => {
    if (data) {
      const shuffledData = data.results.map((q) => {
        const answers = [q.correct_answer, ...q.incorrect_answers];
        shuffleArray(answers);
        return { ...q, answers, status: null };
      });

      setShuffledData(shuffledData);
    }
  }, [data]);

  const handleAnswerClick = (questionIndex, selectedAnswer) => {
    const correctAnswer = shuffledData[questionIndex].correct_answer;
    const isCorrect = selectedAnswer === correctAnswer;

    const updatedShuffledData = [...shuffledData];
    updatedShuffledData[questionIndex].status = isCorrect ? "right" : "wrong";

    setAnswersStatus((prevStatus) => ({
      ...prevStatus,
      [questionIndex]: isCorrect ? "right" : "wrong",
    }));

    setShuffledData(updatedShuffledData);
  };

  const calculateCorrectAnswers = () => {
    let correctCount = 0;
    for (const status of Object.values(answersStatus)) {
      if (status === "right") {
        correctCount++;
      }
    }
    return correctCount;
  };

  const [shuffledData, setShuffledData] = useState([]);

  return (
    <div className="App">
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {shuffledData.length > 0 &&
        shuffledData.map((q, index) => (
          <div key={index}>
            <h1>{q.question}</h1>
            <div className="options">
              {q.answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(index, answer)}
                  className={`option-btn ${
                    answersStatus[index] === "right" && answer === q.correct_answer
                      ? "right"
                      : answersStatus[index] === "wrong" && answer === q.correct_answer
                      ? "correct-wrong"
                      : ""
                  } ${
                    answersStatus[index] === "wrong" && answer !== q.correct_answer
                      ? "wrong"
                      : ""
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
            <div className={`status ${q.status}`}>{q.status}</div>
          </div>
        ))}
      <div className="score">
        Correct Answers: {calculateCorrectAnswers()}
      </div>
    </div>
  );
}

export default App;
