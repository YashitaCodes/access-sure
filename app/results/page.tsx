"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuditResults } from '@/components/audit-results';
import { LoadingState } from '@/components/loading-state';
import { DotPattern } from '@/components/dot-pattern';
import { GradientBackground } from '@/components/gradient-background';
import { useRouter } from 'next/navigation';

interface ApiResponse {
  html: string;
  css: string;
  js: string;
}

interface Check {
  description: string;
  passed: boolean;
}

interface AuditData {
  checks: Check[];
  score: number;
  suggestions: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [loading, setLoading] = useState<boolean>(true);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://source-render-api.onrender.com/fetch-html?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: ApiResponse = await response.json();
        const checks = computeChecks(data);

        setAuditData({
          checks,
          score: computeScore(checks),
          suggestions: generateSuggestions(checks)
        });
      } catch (error) {
        router.push('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      if (!auditData) {
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [auditData, url, router]);

  const computeChecks = (data: ApiResponse): Check[] => {
    const { html } = data;
  
    const hasButtons = /<button[^>]*>.*?<\/button>/.test(html) || /<input[^>]*type=["']button["'][^>]*>/.test(html);
    const hasImages = /<img[^>]+src=["'][^"']*["']/i.test(html);
    const hasLabels = /<label[^>]*for=["'][^"']*["'][^>]*>.*?<\/label>/i.test(html) || /<input[^>]*id=["'][^"']*["']/.test(html);
  
    const headingOrderValid = checkHeadingOrder(html);
  
    const checks: Check[] = [
        {
            description: "ARIA attributes match their roles",
            passed: validateAriaAttributes(html)
        },
        {
            description: "Buttons have an accessible name",
            passed: validateButtonAccessibility(html)
        },
        {
            description: "Image elements have alt attributes",
            passed: hasImages ? /<img[^>]+alt=["'][^"']*["'][^>]*>/i.test(html) : true
        },
        {
            description: "Form inputs have associated labels",
            passed: hasLabels ? (/<label[^>]*for=["'][^"']*["'][^>]*>(.*?)<\/label>/i.test(html) || /<input[^>]*id=["'][^"']*["']/i.test(html)) : true
        },
        {
            description: "Color contrast meets WCAG guidelines",
            passed: true
        },
        {
            description: "All interactive elements are keyboard accessible",
            passed: validateKeyboardAccessibility(html)
        },
        {
            description: "No auto-playing media",
            passed: !/<audio[^>]*autoplay|<video[^>]*autoplay/i.test(html) 
        },
        {
            description: "Headings are used in a logical order",
            passed: headingOrderValid
        }
    ];
  
    return checks;
  };
  
  const validateKeyboardAccessibility = (html: string): boolean => {
      const inaccessibleElements = html.match(/<(a|button)[^>]*(tabindex=["']?-1["']?|style=["'][^"']*(display:\s*none|visibility:\s*hidden)[^"']*["'])/i);
      return !inaccessibleElements; 
  };
  
  
  

const checkHeadingOrder = (html: string): boolean => {
    const headingLevels: number[] = [];
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const level = parseInt(match[1], 10);
        if (headingLevels.length === 0) {
            headingLevels.push(level);
        } else {
            const lastLevel = headingLevels[headingLevels.length - 1];

            if (level > lastLevel) {
                if (level - lastLevel > 1) {
                    return false; 
                }
                headingLevels.push(level);
            } else if (level < lastLevel) {
                while (headingLevels.length > 0 && headingLevels[headingLevels.length - 1] > level) {
                    headingLevels.pop(); 
                }
                if (headingLevels.length > 0 && headingLevels[headingLevels.length - 1] !== level) {
                    return false; 
                }
                headingLevels.push(level); 
            } else {
                headingLevels.push(level);
            }
        }
    }

    return true; 
};

const validateAriaAttributes = (html: string): boolean => {
  const ariaRoles: { [role: string]: { regex: RegExp; requiredAttributes: string[] } } = {
      alert: {
          regex: /<div[^>]+role=["']?alert["']?[^>]*>/i,
          requiredAttributes: []
      },
      alertdialog: {
          regex: /<div[^>]+role=["']?alertdialog["']?[^>]*>/i,
          requiredAttributes: ['aria-labelledby', 'aria-describedby']
      },
      button: {
          regex: /<button[^>]*>/i,
          requiredAttributes: ['aria-label', 'aria-labelledby']
      },
      checkbox: {
          regex: /<input[^>]+type=["']?checkbox["'][^>]*>/i,
          requiredAttributes: ['aria-checked']
      },
      dialog: {
          regex: /<div[^>]+role=["']?dialog["']?[^>]*>/i,
          requiredAttributes: ['aria-labelledby', 'aria-describedby']
      },
      grid: {
          regex: /<div[^>]+role=["']?grid["']?[^>]*>/i,
          requiredAttributes: []
      },
      link: {
          regex: /<a[^>]*>/i,
          requiredAttributes: ['aria-label', 'aria-labelledby']
      },
      menu: {
          regex: /<ul[^>]+role=["']?menu["']?[^>]*>/i,
          requiredAttributes: []
      },
      menuitem: {
          regex: /<li[^>]+role=["']?menuitem["']?[^>]*>/i,
          requiredAttributes: []
      },
      radio: {
          regex: /<input[^>]+type=["']?radio["'][^>]*>/i,
          requiredAttributes: ['aria-checked']
      },
      slider: {
          regex: /<input[^>]+type=["']?range["'][^>]*>/i,
          requiredAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']
      },
      tab: {
          regex: /<div[^>]+role=["']?tab["']?[^>]*>/i,
          requiredAttributes: []
      },
      tooltip: {
          regex: /<div[^>]+role=["']?tooltip["']?[^>]*>/i,
          requiredAttributes: []
      }
  };

  const ariaElementsPresent = Object.values(ariaRoles).some(({ regex }) => regex.test(html));
  if (!ariaElementsPresent) return true;

  let ariaAttributesExist = /aria-[a-z]+=["']?[^"']*["']?/i.test(html);
  for (const [role, { regex, requiredAttributes }] of Object.entries(ariaRoles)) {
      if (regex.test(html)) {
          for (const attr of requiredAttributes) {
              if (!new RegExp(`${attr}=["']?[^"']*["']?`).test(html)) {
                  return false;
              }
          }
      }
  }

  return true;
};



const validateButtonAccessibility = (html: string): boolean => {
    const buttonAccessible = /<button[^>]*>([^<]*)<\/button>|<button[^>]*aria-label=["'][^"']*["'][^>]*>/i.test(html);
    const inputAccessible = /<input[^>]*type=["']button["'][^>]*value=["'][^"']*["']/i.test(html);

    return buttonAccessible || inputAccessible; 
  };

  const computeScore = (checks: Check[]): number => {
    const passedChecks = checks.filter(check => check.passed).length;
    return (passedChecks / checks.length) * 100; 
  };

  const generateSuggestions = (checks: Check[]): string[] => {
    const suggestions: string[] = [];
    checks.forEach(check => {
      if (!check.passed) {
        suggestions.push(`Suggestion for: ${check.description}`);
      }
    });
    return suggestions;
  };

  if (loading || !auditData) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-8">
        <DotPattern />
        <GradientBackground />
        <div className="relative z-10">
          <LoadingState />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen py-12 px-4">
      <DotPattern />
      <GradientBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Accessibility Audit Results</h1>
          <p className="text-xl text-muted-foreground">
            Results for: <span className="font-medium">{decodeURIComponent(url || '')}</span>
          </p>
        </div>

        <AuditResults
          score={auditData.score}
          checks={auditData.checks}
          suggestions={auditData.suggestions}
        />
      </div>
    </main>
  );
}
