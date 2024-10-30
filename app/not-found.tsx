import Link from 'next/link';
import { DotPattern } from '@/components/dot-pattern';
import { GradientBackground } from '@/components/gradient-background';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
      <DotPattern />
      <GradientBackground />
      
      <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}