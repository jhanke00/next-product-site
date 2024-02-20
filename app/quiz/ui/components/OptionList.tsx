import { Tick, Close } from '../icons/index';
interface OptionListProps {
  options: string[];
  isCorrectAnswer: boolean;
  selectedAnswerIndex: number;
  onAnswerSelected: (answerIndex: number) => void;
  activeQuestion: any;
}

const correctAnswerBadge = (
  <div className='bg-feedback-green text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]'>
    <Tick />
    <p className='text-xs font-medium'>Correct answer</p>
  </div>
);

const wrongAnswerBadge = (
  <div className='bg-feedback-red text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]'>
    <Close />
    <p className='text-xs font-medium'>Your answer</p>
  </div>
);

export const OptionList = ({
  options,
  selectedAnswerIndex,
  onAnswerSelected,
  isCorrectAnswer,
  activeQuestion,
}: OptionListProps) => {
  const correctAnswerIndex = options.findIndex((option) => option === activeQuestion.correctAnswer);

  console.log({
    correctAnswerIndex,
    activeQuestion,
    options,
  });

  const renderSelectedOptionBadge = (idx: number) => {
    if (selectedAnswerIndex === -1) {
      return null;
    }

    if (selectedAnswerIndex === idx) {
      return (
        <div className='absolute top-[50%] -translate-y-1/2 right-2 z-10'>
          {isCorrectAnswer ? correctAnswerBadge : wrongAnswerBadge}
        </div>
      );
    }
  };

  const renderCorrectBadge = (idx: number) => {
    if (selectedAnswerIndex === -1) {
      return null;
    }

    if (correctAnswerIndex === idx) {
      return <div className='absolute top-[50%] -translate-y-1/2 right-2 z-10'>{correctAnswerBadge}</div>;
    }
  };

  return (
    <div className='flex flex-col items-start space-y-1'>
      {options.map((option, idx) => (
        <div
          key={idx}
          className={`relative flex items-center space-x-2 rounded-xl border px-6 py-4 w-full cursor-pointer select-none ${
            idx === selectedAnswerIndex ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => {
            if (selectedAnswerIndex !== -1) {
              return;
            }
            onAnswerSelected(idx);
          }}
        >
          <p className=' font-normal text-base'>{option}</p>
          {renderSelectedOptionBadge(idx)}
          {renderCorrectBadge(idx)}
        </div>
      ))}
    </div>
  );
};
