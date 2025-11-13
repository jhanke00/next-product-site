'use client';

import React from 'react';

type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const steps: CheckoutStep[] = ['review', 'shipping', 'payment', 'confirmation'];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className='w-full mb-8'>
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const stepNumber = index + 1;

          return (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center flex-1'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span
                  className={`mt-2 text-sm font-medium capitalize ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
