"use client";

import { CircularProgress } from '@/components/circular-progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Github, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Check {
  description: string;
  passed: boolean;
}

interface AuditResultsProps {
  score: number;
  checks: Check[];
  suggestions: string[];
}

export function AuditResults({ score, checks, suggestions }: AuditResultsProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center">
        <CircularProgress value={score} size={200} strokeWidth={10} />
        <h2 className="mt-4 text-2xl font-bold">Accessibility Score</h2>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Accessibility Checks</h3>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                {check.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{check.description}</span>
              </div>
              <Badge variant={check.passed ? "success" : "destructive"}>
                {check.passed ? "Passed" : "Failed"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Suggestions for Improvement</h3>
        <ul className="space-y-2 list-disc list-inside">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-muted-foreground">
              {suggestion}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Found a Bug?</h3>
        <p className="mb-4">
          If you found an issue or have an idea to make this site better, consider contributing! This project is open-source, and your help can improve it for everyone.
        </p>
        <Link href="https://github.com/YashitaCodes/access-sure" target="_blank" rel="noopener noreferrer">
          <Button>
            <Github className="mr-2 h-4 w-4" />
            View Repository
          </Button>
        </Link>

      </Card>

    </div>
  );
}