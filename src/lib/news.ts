
export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
  code?: string;
  message?: string;
}

interface ErrorResponse {
    error: string;
}

export const getNews = async (): Promise<{ articles: Article[], error: string | null }> => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    if (!response.ok) {
      const errorData = data as ErrorResponse;
      console.error("Error fetching news:", errorData.error);
      return { articles: [], error: errorData.error || 'Failed to fetch news data.' };
    }
    
    const newsData = data as NewsResponse;
    return { articles: newsData.articles || [], error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch or parse news data:", message);
    return { articles: [], error: message };
  }
};
