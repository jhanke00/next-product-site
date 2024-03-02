import React from 'react';

interface SummaryProps {
  questions: any;
  resetHandle: () => void;
  answeredCorrect: number;
}

const Summary = ({ questions, resetHandle, answeredCorrect }: SummaryProps) => {
  return (
    <div className='text-left px-10'>
      <h2 className='text-4xl font-extrabold text-[#37239d] dark:text-white mb-4'>Quiz Summary</h2>
      <p className='text-lg text-gray-500'>
        You have answered <span className='font-bold text-black'>{answeredCorrect}</span> right out of{' '}
        <span className='font-bold text-black'>{questions.length}</span> questions and your score is{' '}
        <span className='font-bold text-black'>{answeredCorrect * 10}</span>
      </p>
      <ul className='mt-4 list-decimal list-inside  w-full float-left'>
        {questions.map((question: any) => {
          return (
            <li
              key={`quest-${question.id}`}
              className='mt-3 mb-3 pb-4 w-full float-left clear-both border-b-[1px] border-gray-300 border-collapse last:border-b-0'
            >
              <p className='inline font-bold'>{question.questionText}</p>
              <div className='w-full mt-3 overflow-hidden clear-both'>
                <ol className='w-3/4 list-[lower-alpha] list-inside float-left'>
                  {question.options.map((option: any, optionIndex: number) => {
                    const correctAnswer = option.isAnswer ? 'correct_answer' : '';
                    const selectedOption = optionIndex == question.selectionIndex - 1 ? 'selected_option' : '';
                    return (
                      <li
                        key={`opt-${question.id}${option.id}`}
                        className={`${correctAnswer} ${selectedOption} float-left w-full md:w-1/2 sm:w-1/2`}
                      >
                        {option.text}
                      </li>
                    );
                  })}
                </ol>
              </div>
              <h3 className='mt-3 clear-both'>
                <b>Know more: </b>
                {question.feedback}
              </h3>
            </li>
          );
        })}
      </ul>
      <button
        className=' my-2 inline-flex items-center justify-center px-5 py-1 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900'
        onClick={resetHandle}
      >
        Start a new Quiz
      </button>
    </div>
  );
};

export default Summary;
