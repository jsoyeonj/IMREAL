import API_KEYS from '../apikey';

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = API_KEYS.NEWS_API;

export const fetchDeepfakeNews = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=딥페이크&language=ko&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === 'ok') {
      return {
        articles: data.articles,
        totalResults: data.totalResults,
      };
    } else {
      throw new Error(data.message || '뉴스를 가져오는데 실패했습니다');
    }
  } catch (error) {
    console.error('News API Error:', error);
    throw error;
  }
};