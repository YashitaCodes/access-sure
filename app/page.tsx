import { UrlInput } from '@/components/url-input';
import { DotPattern } from '@/components/dot-pattern';
import { GradientBackground } from '@/components/gradient-background';
import { Gauge, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
      <DotPattern />
      <GradientBackground />

      <div className="relative z-10 text-center space-y-8 max-w-4xl w-full mx-auto">
        <div className="space-y-4 mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Web Accessibility Audit
          </h1>
          <p className="text-xl text-muted-foreground">
            Ensure your website is accessible to everyone with our comprehensive accessibility checker
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full mb-10 max-w-xl mx-auto">
            <UrlInput />
          </div>
        </div>

        <div className="lg:grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 mx-auto md:ml-12 hidden">
          <div className="flex items-start gap-4 text-left">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Detailed Analysis</h3>
              <p className="text-muted-foreground">
                Get comprehensive insights into your website&apos;s accessibility compliance
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-left">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">WCAG Guidelines</h3>
              <p className="text-muted-foreground">
                Check compliance with Web Content Accessibility Guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
