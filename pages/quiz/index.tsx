import { useState } from 'react';
import questionData from '../../data/questions';
import QuizIntro from '../../components/QuizIntro';
import Summary from '../../components/Summary';
import Questionnaire from '../../components/Questionnaire';
import '../../app/globals.css';
import Head from 'next/head';

const Quiz = () => {
  const [questions, setQuestions] = useState(questionData);
  const [quizDisplay, setQuizDisplay] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState(0);

  const resetQuiz = () => {
    setQuestions(questionData);
    setQuestionIndex(0);
    setQuizDisplay('intro');
    setAnsweredCorrect(0);
  };

  const setQuestionNumber = (flag: string) => {
    switch (flag) {
      case 'back':
        setQuestionIndex(questionIndex !== 0 ? questionIndex - 1 : questionIndex);
        break;
      case 'next':
        setQuestionIndex(questionIndex !== questions.length - 1 ? questionIndex + 1 : questionIndex);
      default:
        break;
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter((question) => question.answeredCorrect);
    setAnsweredCorrect(correctAnswers.length);
  };

  const handleAnswer = (questionID: number, option: any) => {
    const handleQuestions = questions.map((question: any, index: number) => {
      if (question.id == questionID) {
        return {
          ...question,
          isAnswered: true,
          answeredCorrect: option.isAnswer ? true : false,
          selectionIndex: option.id,
        };
      } else {
        return question;
      }
    });
    setQuestions(handleQuestions);
  };
  return (
    <>
      <Head>
        <title>General Knowledge Quiz</title>
      </Head>
      <main className='lg:w-2/3 md:w-3/4 sm:w-full mx-auto md:mt-10 relative'>
        <div className='m-auto bg-cyan-50 pt-20 pb-20 overflow-hidden'>
          {
            {
              intro: (
                <QuizIntro
                  displayHandle={(screen) => {
                    setQuizDisplay(screen);
                  }}
                />
              ),
              quiz: (
                <Questionnaire
                  questions={questions}
                  questionIndex={questionIndex}
                  displayHandle={(screen) => {
                    setQuizDisplay(screen);
                  }}
                  answerHandle={(questionID, option) => {
                    handleAnswer(questionID, option);
                  }}
                  resetHandle={resetQuiz}
                  scoreHandle={calculateScore}
                  changeQuestion={(flag) => {
                    setQuestionNumber(flag);
                  }}
                />
              ),
              summary: <Summary questions={questions} resetHandle={resetQuiz} answeredCorrect={answeredCorrect} />,
            }[quizDisplay]
          }
        </div>
      </main>
    </>
  );
};
export default Quiz;
