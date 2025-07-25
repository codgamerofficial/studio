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
}

export const getNews = async (): Promise<Article[]> => {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching news:", errorData.error);
      return [];
    }
    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Failed to fetch or parse news data:", error);
    return [];
  }
};
