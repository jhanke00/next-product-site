import React from 'react';

interface QuizIntroProps {
  displayHandle: (screen: string) => void;
}

const QuizIntro = ({ displayHandle }: QuizIntroProps) => {
  return (
    <div className='text-center '>
      <h2 className='lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-extrabold dark:text-white mb-4 text-[#37239d]'>
        General Knowledge Quiz
      </h2>

      <p className='mb-6 my-4 text-lg text-gray-500 px-10'>
        General knowledge is information that has been accumulated over time through various media and sources. It
        excludes specialized learning that can only be obtained with extensive training and information confined to a
        single medium.
      </p>

      <button
        type='button'
        className=' my-4 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900'
        onClick={() => displayHandle('quiz')}
      >
        Start the quiz
        <svg
          className='w-3.5 h-3.5 ms-2 rtl:rotate-180'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 10'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M1 5h12m0 0L9 1m4 4L9 9'
          />
        </svg>
      </button>
    </div>
  );
};

export default QuizIntro;
