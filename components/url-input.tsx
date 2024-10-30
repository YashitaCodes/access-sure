"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function UrlInput() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const validateUrl = (input: string) => {
    let processedUrl = input;
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      processedUrl = `https://${input}`;
    }

    try {
      const urlObj = new URL(processedUrl);
      return urlObj.hostname.includes('.');
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }

    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }

    router.push(`/results?url=${encodeURIComponent(processedUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <Input
        type="text"
        placeholder="Enter website URL (e.g., example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-12 bg-background/50 backdrop-blur-sm"
      />
      <Button type="submit" size="lg" className="h-12 px-8">
        <Search className="mr-2 h-4 w-4" />
        Audit
      </Button>
    </form>
  );
}