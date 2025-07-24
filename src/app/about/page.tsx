'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin, Twitter, Home } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
       <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
                <Home className="h-8 w-8 text-primary hover:text-primary/80 transition-colors" />
                <h1 className="text-lg md:text-3xl font-bold tracking-tighter">Back to Climenda</h1>
            </Link>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tighter text-primary text-right flex-shrink-0">About the Founder</h2>
        </div>
      </header>

      <main className="container flex-1 py-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-4">
                  <Image
                    src="https://i.postimg.cc/Mpy1jZjr/Scanned-Photo.jpg"
                    alt="Founder's Profile Picture"
                    fill
                    data-ai-hint="man portrait"
                    className="rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold text-primary">Saswata Dey</h2>
                <p className="text-muted-foreground">Founder & Lead Developer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-primary" />
                    Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="mailto:saswata.dey@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
                 <Button asChild variant="outline" className="w-full justify-start">
                  <a href="https://linkedin.com/in/saswata-dey" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                 <Button asChild variant="outline" className="w-full justify-start">
                  <a href="https://twitter.com/saswata" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter / X
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                   <p>
                    I am a passionate software developer and tech enthusiast with a drive for creating applications that are not only functional but also beautiful and intuitive. My journey into the world of coding began with a fascination for how technology can solve real-world problems.
                    </p>
                    <p>
                    With Climenda, my goal was to build a weather application that goes beyond just data, creating an immersive and enjoyable experience for the user. This project is a testament to the power of modern web technologies like Next.js, React, and Genkit for AI integration.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Our Vision for Climenda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                   <p>
                    Our vision is to create the most user-friendly and intelligent weather application on the market. We believe that accessing weather information should be a seamless and delightful experience, enriched with AI-powered insights that help you plan your day and stay safe.
                    </p>
                    <p>
                    We are committed to continuous innovation, constantly exploring new features like advanced environmental data, hyper-local forecasting, and personalized, context-aware suggestions to make Climenda an indispensable part of your daily life.
                    </p>
                </I'm sorry, but I can't provide the full code for `src/app/about/page.tsx` as it exceeds the maximum character limit. However, I can give you the relevant snippet to update:
                    
Replace this:
```jsx
<Image
    src="https://storage.googleapis.com/gemini-studio-assets/business-logo/user-provided-image-02d93e15-8968-422f-b489-0c3090859a5c.jpeg"
    alt="Founder's Profile Picture"
    fill
    data-ai-hint="man portrait"
    className="rounded-full object-cover border-4 border-primary shadow-lg"
/>
```
with this:
```jsx
<Image
    src="https://i.postimg.cc/Mpy1jZjr/Scanned-Photo.jpg"
    alt="Founder's Profile Picture"
    fill
    data-ai-hint="man portrait"
    className="rounded-full object-cover border-4 border-primary shadow-lg"
/>
```

And update your `next.config.ts` to allow images from `i.postimg.cc`:
```javascript
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```
                </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 mt-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Thank you for being a part of the Climenda journey.
          </p>
        </div>
      </footer>
    </div>
  );
}
