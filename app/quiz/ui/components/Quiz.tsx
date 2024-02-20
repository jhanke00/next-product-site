'use client';

import { useState, useEffect } from 'react';
import { quizQuestions } from '../content/content';
import { Button } from '../components/Button';
import { OptionList } from './OptionList';
import { Result } from './Result';

export const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  useEffect(() => {
    if (quizFinished) return;
  }, [quizFinished]);

  const handleNextQuestion = () => {
    // Reset selected answer
    setSelectedAnswerIndex(-1);

    // Check if quiz finished
    if (activeQuestion + 1 >= quizQuestions.length) {
      console.log('Quiz finished!');
      setQuizFinished(true);
      return;
    }
    // Set next question
    setActiveQuestion((prev) => prev + 1);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswerIndex(answerIndex);

    // Check if answer is correct
    const correctAnswer = quizQuestions[activeQuestion].correctAnswer;
    const selectedAnswer = quizQuestions[activeQuestion].options[answerIndex];

    if (correctAnswer === selectedAnswer) {
      console.log('Correct answer!');
      // Update results
      setResults((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
      }));

      setIsCorrectAnswer(true);
    } else {
      console.log('Wrong answer!');
      // Update results
      setResults((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
      setIsCorrectAnswer(false);
    }
  };

  const { question, options } = quizQuestions[activeQuestion];
  const numberOfQuestions = quizQuestions.length;

  if (quizFinished) {
    return <Result results={results} totalQuestions={quizQuestions.length} />;
  }

  return (
    <div className='flex flex-col text-black font-bold text-[32px] bg-white text-center w-full'>
      <h1 className='font-bold text-base text-brand-cerulean-blue'>QuizApp</h1>
      <h3 className='text-black font-medium text-sm'>
        Question {activeQuestion + 1} / {numberOfQuestions}
      </h3>
      <div className='mt-6 rounded-2xl border border-brand-light-gray px-7 py-4 w-full mb-1'>
        <h4 className=' font-medium text-base mt-[14px]'>{question}</h4>
      </div>

      <OptionList
        activeQuestion={quizQuestions[activeQuestion]}
        options={options}
        selectedAnswerIndex={selectedAnswerIndex}
        onAnswerSelected={handleSelectAnswer}
        isCorrectAnswer={isCorrectAnswer}
      />

      <div className='mt-[20px] w-full z-10'>
        <Button disabled={selectedAnswerIndex === -1} block size='small' onClick={handleNextQuestion}>
          Next
        </Button>
      </div>
    </div>
  );
};
