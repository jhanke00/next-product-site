'use client';

import './globals.css';
import { useState } from 'react';
import { Intro } from './ui/components/Intro';
import { Quiz } from './ui/components/Quiz';

export default function QuizHome() {
  const [displayView, setDisplayView] = useState('intro');

  return (
    <main className='h-viewport flex flex-col w-full overflow-hidden'>
      {
        {
          intro: (
            <Intro
              onGetStartedClick={() => {
                setDisplayView('quiz');
              }}
            />
          ),
          quiz: <Quiz />,
        }[displayView]
      }
    </main>
  );
}
