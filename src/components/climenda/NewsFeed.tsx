
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getNews, Article } from '@/lib/news'
import { Newspaper, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const { articles: newsArticles, error: apiError } = await getNews();
        if (apiError) {
            setError(`Failed to load news feed: ${apiError}`);
            setArticles([]);
        } else {
            // NOTE: NewsAPI in developer mode may return articles with missing fields. Filter out those without a title.
            setArticles(newsArticles.filter(a => a.title && a.title !== '[Removed]'));
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching the news feed.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          Worldwide News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
           <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-6">
              {articles.length > 0 ? articles.map((article, index) => (
                <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted/50 p-3 rounded-lg transition-colors duration-200 group">
                    <div className="flex flex-col sm:flex-row gap-4">
                         {article.urlToImage ? (
                            <div className="relative w-full sm:w-32 h-32 sm:h-24 flex-shrink-0">
                                <Image
                                    src={article.urlToImage}
                                    alt={article.title}
                                    fill
                                    data-ai-hint="news article"
                                    className="rounded-lg object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        ) : (
                           <div className="w-full sm:w-32 h-32 sm:h-24 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center">
                                <Newspaper className="w-10 h-10 text-muted-foreground" />
                           </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors duration-200">{article.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">{article.source.name} &bull; {new Date(article.publishedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </a>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
                    <Newspaper className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">No news articles found.</p>
                    <p className="text-sm">Please try again later.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
