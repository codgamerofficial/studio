'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Play, Pause, RotateCcw, Timer as TimerIcon, Hourglass } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Stopwatch Component
function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0')
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0')
    const milliseconds = (time % 1000).toString().padStart(3, '0').slice(0, 2)
    return `${minutes}:${seconds}:${milliseconds}`
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="font-mono text-5xl md:text-6xl text-primary tracking-widest">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="bg-green-500 hover:bg-green-600 text-white dark:text-white">
            <Play className="mr-2 h-5 w-5" /> Start
          </Button>
        ) : (
          <Button onClick={handleStop} size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <Pause className="mr-2 h-5 w-5" /> Stop
          </Button>
        )}
        <Button onClick={handleReset} size="lg" variant="outline">
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </div>
    </div>
  )
}

// Timer Component
function Timer() {
    const [duration, setDuration] = useState({ hours: 0, minutes: 1, seconds: 0 });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            toast({
                title: "Timer Finished!",
                description: "Your countdown has ended.",
            });
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, toast]);

    const handleStart = () => {
        const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        setIsActive(false);
        setIsPaused(true);
        if(intervalRef.current) clearInterval(intervalRef.current);
    }
    
    const handleResume = () => {
        setIsActive(true);
        setIsPaused(false);
    }

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        if(intervalRef.current) clearInterval(intervalRef.current);
        setTimeLeft(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDuration(prev => ({ ...prev, [name]: Math.max(0, parseInt(value, 10) || 0) }));
    };

    const formatTimeLeft = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const totalDurationInSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
    const progress = totalDurationInSeconds > 0 ? (timeLeft / totalDurationInSeconds) * 100 : 0;
    const isTimerSet = timeLeft > 0 || isActive || isPaused;

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-4">
            {isTimerSet ? (
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            className="text-muted/30"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="80"
                            cx="96"
                            cy="96"
                        />
                        <circle
                            className="text-primary transition-all duration-1000 linear"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 80}
                            strokeDashoffset={(2 * Math.PI * 80) * (1 - progress / 100)}
                            stroke="currentColor"
                            fill="transparent"
                            r="80"
                            cx="96"
                            cy="96"
                        />
                    </svg>
                    <div className="absolute font-mono text-4xl tracking-widest">
                        {formatTimeLeft(timeLeft)}
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-center my-12">
                    <Input type="number" name="hours" value={duration.hours} onChange={handleInputChange} className="w-20 text-center text-lg bg-card/80" placeholder="HH" />
                    <span className="text-2xl font-bold text-muted-foreground">:</span>
                    <Input type="number" name="minutes" value={duration.minutes} onChange={handleInputChange} className="w-20 text-center text-lg bg-card/80" placeholder="MM" />
                    <span className="text-2xl font-bold text-muted-foreground">:</span>
                    <Input type="number" name="seconds" value={duration.seconds} onChange={handleInputChange} className="w-20 text-center text-lg bg-card/80" placeholder="SS" />
                </div>
            )}
             <div className="flex gap-4">
                { !isActive && !isPaused ? (
                    <Button onClick={handleStart} size="lg" className="bg-green-500 hover:bg-green-600 text-white dark:text-white" disabled={totalDurationInSeconds === 0}>
                        <Play className="mr-2 h-5 w-5" /> Start
                    </Button>
                ) : isActive ? (
                    <Button onClick={handlePause} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white dark:text-white">
                        <Pause className="mr-2 h-5 w-5" /> Pause
                    </Button>
                ) : (
                     <Button onClick={handleResume} size="lg" className="bg-green-500 hover:bg-green-600 text-white dark:text-white">
                        <Play className="mr-2 h-5 w-5" /> Resume
                    </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline">
                    <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
            </div>
        </div>
    );
}


// Main TimeTools Component
export function TimeTools() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardContent className="p-2">
        <Tabs defaultValue="stopwatch" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="stopwatch">
              <Hourglass className="mr-2 h-5 w-5 text-accent" />
              Stopwatch
            </TabsTrigger>
            <TabsTrigger value="timer">
              <TimerIcon className="mr-2 h-5 w-5 text-accent" />
              Timer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stopwatch">
            <Stopwatch />
          </TabsContent>
          <TabsContent value="timer">
            <Timer />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
