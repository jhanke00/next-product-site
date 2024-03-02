import React, { useState } from 'react';

interface QuestionnaireProps {
  questions: any;
  resetHandle: () => void;
  answerHandle: (questionID: any, option: any) => void;
  changeQuestion: (flag: string) => void;
  displayHandle: (screen: string) => void;
  scoreHandle: () => void;
  questionIndex: number;
}

let correctAnswerClass,
  wrongAnswerClass = '';
const Questionnaire = ({
  questions,
  questionIndex,
  resetHandle,
  answerHandle,
  displayHandle,
  scoreHandle,
  changeQuestion,
}: QuestionnaireProps) => {
  const showAnswer = (isAnsweredCorrect: string) => {
    return isAnsweredCorrect ? (
      <p className='mt-2 text-lg font-bold right-answer text-[#008000] text-bold'>Yeah! You guessed it right!</p>
    ) : (
      <p className='mt-2 text-lg font-bold wrong-answer  text-[#f00] text-bold'>No! You guessed it wrong!</p>
    );
  };

  return (
    <div className='text-left px-10'>
      <p className='text-1xl font-extrabold dark:text-white'>
        Question {questionIndex + 1} of {questions.length}
      </p>
      <span className='text-gray-500'>Select the options to proceed further</span>
      <h3 className='text-2xl font-extrabold dark:text-white mb-4 mt-4 text-[#37239d]'>
        {questions[questionIndex].questionText}
      </h3>
      <div className='pr-2 w-9/12 float-left clear-both'>
        {questions[questionIndex].options.map((option: any, index: number) => {
          {
            correctAnswerClass = option.isAnswer && questions[questionIndex].selectionIndex ? 'correct_answer' : '';
          }
          {
            if (questions[questionIndex].selectionIndex === option.id) {
              wrongAnswerClass = 'selected_option';
            } else {
              wrongAnswerClass = '';
            }
          }
          return (
            <div
              key={'question-' + index}
              className={`${correctAnswerClass} ${wrongAnswerClass} w-full md:w-1/2 sm:w-1/2 float-left`}
            >
              <input
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer'
                key={option.id}
                id={'question-' + questions[questionIndex].id + option.id}
                type='radio'
                name={'questions-' + questions[questionIndex].id}
                value={option.text}
                onChange={() => answerHandle(questions[questionIndex].id, option)}
                checked={questions[questionIndex].selectionIndex === option.id}
                disabled={questions[questionIndex].selectionIndex > 0}
              />
              <label
                className='ms-2 text-lg capitalize font-medium text-gray-600 dark:text-gray-300 cursor-pointer'
                htmlFor={'question-' + questions[questionIndex].id + option.id}
              >
                {option.text}
              </label>
            </div>
          );
        })}
      </div>
      <div className='clear-both float-left block w-full mt-4'>
        {questionIndex > 0 && (
          <button
            className='my-2 inline-flex items-center justify-center px-5 py-1 text-base font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 mr-4'
            onClick={() => {
              changeQuestion('back');
            }}
          >
            Previous
          </button>
        )}
        {questions[questionIndex].selectionIndex > 0 ? (
          questionIndex === questions.length - 1 ? (
            <button
              className='my-2 inline-flex items-center justify-center px-5 py-1 text-base font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900'
              onClick={() => {
                displayHandle('summary');
                scoreHandle();
              }}
            >
              Check score
            </button>
          ) : (
            <button
              className='my-2 inline-flex items-center justify-center px-5 py-1 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900'
              onClick={() => {
                changeQuestion('next');
              }}
            >
              Next
            </button>
          )
        ) : (
          <></>
        )}
      </div>

      <div className='clear-both mt-2 float-left'>
        {questions[questionIndex].selectionIndex > 0 && (
          <>
            {showAnswer(questions[questionIndex].answeredCorrect)}
            <p className='mb-4 mt-4 text-1xl'>{questions[questionIndex].feedback}</p>
          </>
        )}
      </div>
      <button
        className='absolute top-[20px] right-[20px] cursor-pointer rotate-[0deg] hover:rotate-[-90deg] transition ease-in-out delay-150 '
        onClick={resetHandle}
        title='Reset Quiz'
      >
        <svg width='30px' height='30px' viewBox='0 0 21 21' xmlns='http://www.w3.org/2000/svg'>
          <g
            fill='none'
            fillRule='evenodd'
            stroke='#000000'
            strokeLinecap='round'
            strokeLinejoin='round'
            transform='matrix(0 1 1 0 2.5 2.5)'
          >
            <path d='m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8' />
            <path d='m4 1v4h-4' transform='matrix(1 0 0 -1 0 6)' />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default Questionnaire;
