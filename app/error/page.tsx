"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DotPattern } from '@/components/dot-pattern';
import { GradientBackground } from '@/components/gradient-background';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
      <DotPattern />
      <GradientBackground />
      
      <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold">Something went wrong!</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t complete the accessibility check. Please try again.
        </p>
        <Button onClick={() => router.push('/')}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Go to Home
        </Button>
      </div>
    </main>
  );
}
