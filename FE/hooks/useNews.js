import { useState, useEffect } from 'react';
import { fetchDeepfakeNews } from '../services/newsApi';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  const loadNews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDeepfakeNews(page, pageSize);
      setNews(data.articles);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(1);
  }, []);

  const goToNextPage = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (currentPage < totalPages) {
      loadNews(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      loadNews(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return {
    news,
    loading,
    error,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    refetch: () => loadNews(currentPage),
  };
};