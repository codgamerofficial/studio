
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

export const getNews = async (): Promise<{ articles: Article[], error: string | null }> => {
  try {
    const response = await fetch('/api/news');
    const data: NewsResponse = await response.json();
    
    if (!response.ok) {
      console.error("Error fetching news:", data.message);
      return { articles: [], error: data.message || 'Failed to fetch news data.' };
    }
    
    return { articles: data.articles || [], error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch or parse news data:", message);
    return { articles: [], error: message };
  }
};
