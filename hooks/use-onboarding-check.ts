import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function useOnboardingCheck() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (isSignedIn && !onboardingChecked) {
      // Check if user has completed onboarding
      const checkOnboarding = async () => {
        try {
          const response = await fetch('/api/user-setup');
          const result = await response.json();

          if (!result.success || result.needsOnboarding) {
            router.push('/onboarding');
            return;
          }

          setOnboardingChecked(true);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // If we can't check onboarding status, assume they need it for safety
          router.push('/onboarding');
        }
      };

      checkOnboarding();
    }
  }, [isLoaded, isSignedIn, router, onboardingChecked]);

  return {
    isSignedIn,
    isLoaded,
    onboardingChecked,
    isReady: isLoaded && isSignedIn && onboardingChecked,
  };
}
