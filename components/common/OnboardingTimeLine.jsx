"use client";
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const ONBOARDING_STEPS = [
  { id: 1, label: 'Complete Profile' },
  { id: 2, label: 'Account Review' },
  { id: 3, label: 'Terms' },
  { id: 4, label: 'Pricing' },
  { id: 5, label: 'Done' },
];

const OnboardingTimeline = ({ currentStep = 1, isApproved = false }) => {
  const effectiveStep = currentStep === 3 && isApproved ? 4 : currentStep;

  return (
    <div className="w-full px-4 py-4">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between">
          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = step.id < effectiveStep;
            const isCurrent = step.id === effectiveStep;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div 
                    className={`
                      absolute top-2 left-1/2 w-full h-px
                      ${step.id < effectiveStep ? 'bg-green-300' : 'bg-gray-200'}
                    `}
                  />
                )}
                
                {/* Circle */}
                <div
                  className={`
                    relative z-10 w-4 h-4 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-400' 
                      : isCurrent 
                        ? 'bg-[#5F22D9]' 
                        : 'bg-gray-200'
                    }
                  `}
                >
                  {isCompleted && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                </div>
                
                {/* Label */}
                <span
                  className={`
                    mt-2 text-[10px] text-center leading-tight
                    ${isCompleted 
                      ? 'text-green-500' 
                      : isCurrent 
                        ? 'text-[#5F22D9] font-medium' 
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View - Compact dots with current label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-1.5">
          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = step.id < effectiveStep;
            const isCurrent = step.id === effectiveStep;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`
                    rounded-full transition-all duration-300 flex items-center justify-center
                    ${isCurrent 
                      ? 'w-3 h-3' 
                      : 'w-2 h-2'
                    }
                    ${isCompleted 
                      ? 'bg-green-400' 
                      : isCurrent 
                        ? 'bg-[#5F22D9]' 
                        : 'bg-gray-200'
                    }
                  `}
                >
                  {isCompleted && <CheckIcon className="w-1.5 h-1.5 text-white" />}
                </div>
                
                {/* Small connector */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div 
                    className={`w-3 h-px ${step.id < effectiveStep ? 'bg-green-300' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Current step label */}
        <p className="text-center mt-2 text-[10px] text-[#5F22D9] font-medium">
          {ONBOARDING_STEPS.find(s => s.id === effectiveStep)?.label}
        </p>
      </div>
    </div>
  );
};

export default OnboardingTimeline;