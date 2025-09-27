'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

interface StepProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

const Step = ({ step, isActive, isCompleted, isLast }: StepProps) => {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
          isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : isActive
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted bg-background text-muted-foreground'
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : <span>{step}</span>}
      </div>
      {!isLast && (
        <div
          className={cn('h-0.5 w-12', isCompleted ? 'bg-primary' : 'bg-muted')}
        />
      )}
    </div>
  );
};

export const Stepper = ({
  currentStep,
  totalSteps,
  className,
}: StepperProps) => {
  return (
    <div className={cn('flex items-center', className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <Step
          key={index}
          step={index + 1}
          isActive={currentStep === index + 1}
          isCompleted={currentStep > index + 1}
          isLast={index === totalSteps - 1}
        />
      ))}
    </div>
  );
};
