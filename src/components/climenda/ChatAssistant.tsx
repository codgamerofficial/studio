'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { chat, ChatInput } from '@/ai/flows/chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Bot, User, Send, AlertTriangle, Loader2 } from 'lucide-react'
import { CurrentWeather as CurrentWeatherType } from '@/lib/weather'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAssistantProps {
  weather: CurrentWeatherType | null;
  location: string | null;
}

export function ChatAssistant({ weather, location }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
        {
            role: 'model',
            content: `Hello! I'm your Climenda AI assistant. How can I help you today? You can ask me about the weather, for activity ideas, or anything else!`,
        }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    startTransition(async () => {
      try {
        const chatInput: ChatInput = {
          message: input,
          history: messages,
          weather: weather ? JSON.stringify({ ...weather, location }) : undefined,
        };
        const result = await chat(chatInput);
        setMessages(prev => [...prev, { role: 'model', content: result.response }]);
      } catch (err) {
        setError('Sorry, I had trouble getting a response. Please try again.');
        // Revert user message on error
        setMessages(prev => prev.slice(0, -1));
      }
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm h-[32rem] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Climenda Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'p-3 rounded-2xl max-w-sm text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  )}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="p-3 rounded-2xl max-w-sm text-sm bg-muted rounded-bl-none">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isPending}
            className="flex-1 bg-background"
          />
          <Button type="submit" disabled={!input.trim() || isPending} size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </form>
         {error && (
            <div className="flex items-center gap-2 text-destructive text-xs px-2">
                <AlertTriangle className="w-4 h-4" />
                <p>{error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
