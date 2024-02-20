'use client';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Quiz } from './Quiz';

interface ResultProps {
  results: {
    correctAnswers: number;
    wrongAnswers: number;
  };
  totalQuestions: number;
}
export const Result = ({ results, totalQuestions }: ResultProps) => {
  const { correctAnswers } = results;
  const [showQuiz, setShowQuiz] = useState(false);

  const handleRetry = () => {
    const divElement = document.getElementById('answers');
    if (divElement && divElement.parentNode) {
      // Remove the "answers" div from its parent node
      divElement.parentNode.removeChild(divElement);
    }
    setShowQuiz(true);
  };

  return (
    <div className='flex flex-col text-black font-bold text-[32px] text-center w-full'>
      <div
        id='answers'
        className='mt-6 flex-1 bg-white border border-brand-light-gray rounded-2xl flex flex-col items-center py-7 px-2 '
      >
        <p className=' text-xl font-normal mt-2'>Your Score</p>
        <span className=' font-medium text-[40px]'>{`${correctAnswers}/${totalQuestions}`}</span>
        <p className=' text-sm font-normal mt-1'>correct answers</p>
      </div>

      <div>
        {!showQuiz ? (
          <div>
            <Button intent={'secondary'} size='small' block className='mt-6' onClick={handleRetry}>
              Restart Quiz
            </Button>
          </div>
        ) : (
          <Quiz />
        )}{' '}
      </div>
    </div>
  );
};
