import { Button } from '../components/Button';

interface IntroProps {
  onGetStartedClick: () => void;
}

export const Intro = ({ onGetStartedClick }: IntroProps) => {
  return (
    <div className='px-5 py-8 flex-1 w-full lg:max-w-4xl mx-auto flex flex-col overflow-hidden'>
      <div className='w-full flex flex-col flex-1 items-center z-10'>
        <h1 className='font-bold text-[32px] sm:text-4xl'>QuizApp</h1>
      </div>
      <Button className='w-full z-10' onClick={onGetStartedClick}>{`Let's Get Started`}</Button>
    </div>
  );
};
